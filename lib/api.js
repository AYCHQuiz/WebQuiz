"use strict";
const Bluebird = require("bluebird");
const fs = Bluebird.promisifyAll(require("fs"));
const crypto = require("crypto");
const mkdirp = Bluebird.promisify(require("mkdirp"));
const YAML = require("yamljs");
const path = require("path");
const SVGO = require("svgo");
const express = require("express");
const svgo = new SVGO();
const glob = require("glob").glob;
const prerender = require("./prerender").prerender;
const shuffle = require("./prerender").shuffle;
const jsend = require("./jsend");
const fixSvgSize = require("./svg-size-fix");
const fixSvgColor = require("./svg-color-fix");
const safeJsonStringify = require("./safe-embedded-json");

// do heavy initialization as early as possible
const mathjax = require("mathjax-node");
mathjax.start();

function getWebQuizRoot() {
    if (process.env.NODE_ENV === "test") {
        return path.join(__dirname, "..", "example-quiz");
    } else if (process.argv.length >= 3) {
        return process.argv[2];
    } else if (process.env.WEB_QUIZ) {
        return process.env.WEB_QUIZ;
    } else {
        console.error("Quiz directory is not set!");
        console.error("");
        console.error(" - Either set WEB_QUIZ environment variable");
        console.error("   WEB_QUIZ=example-quiz node server.js");
        console.error(" - Or add one command line parameter");
        console.error("   node server.js example-quiz");
        process.exit(1);
    }
}

module.exports = (app) => {
    const rootDir = getWebQuizRoot();
    const questions = [];
    const tagsSet = new Set();

    const config = YAML.parse(fs.readFileSync(
        path.join(rootDir, "_config.yml"), "utf8"));

    const files = glob.sync("/**/!(_)*.yml", {root: rootDir, nodir: true});
    for (var file of files) {
        const question = YAML.parse(fs.readFileSync(file, "utf8"));
        for (var tag of question.tags) {
            tagsSet.add(tag);
        }
        questions.push(question);
    }

    const tags = Array.from(tagsSet).sort();

    function getQuestionsByTags(tags) {
        return questions.filter((q) =>
            tags.every((tag) => q.tags.indexOf(tag) !== -1));
    }

    function getTagsWithCountResponse(filterTags) {
        return {
            tags: tags.map((tag) => {
                return {
                    tag,
                    count: getQuestionsByTags(filterTags.concat([tag])).length,
                };
            }),
            total: getQuestionsByTags(filterTags).length,
        };
    }

    const tagsWithCountNoTags = getTagsWithCountResponse([]);

    function isArrayOfStrings(obj) {
        return Array.isArray(obj) && obj.every((x) => typeof x === "string");
    }

    // Expose image files in the quiz folder
    const allowedFiles = /\.(png|jpg|jpeg|svg|gif)$/i;
    app.all("/public/*", (req, res, next) => {
        if (req.path.match(allowedFiles)) {
            next();
        } else {
            res.status(403).send("Access forbidden");
        }
    });
    app.use("/public", express.static(rootDir, {
        dotfiles: "deny", // don't expose ".cache" and similar files/folders
    }));

    /**
     * @api {get} /api/tags_with_count Count questions for each tag
     * @apiGroup WebQuiz
     * @apiName TagsWithCount
     *
     * @apiParam {String} tags List of tags, encoded as JSON array; if list is
     *     empty, no additional filtering is applied
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {Object} data
     * @apiSuccess {Number} data.total
     * @apiSuccess {Object[]} data.tags List of (Tag,Count) pairs, sorted
     *     by tag name
     * @apiSuccess {String} data.tags.tag Tag
     * @apiSuccess {Number} data.tags.count Number of questions that have
     *     this tag and all tags given in parameter `tags`
     */
    app.get("/api/tags_with_count", (req, res) => {
        let filterTags;
        try {
            filterTags = JSON.parse(req.query.tags);
        } catch (e) {
            jsend(res).fail({tags: "must be valid JSON"});
            return;
        }

        if (!isArrayOfStrings(filterTags)) {
            jsend(res).fail({tags: "must be a JSON array of strings"});
            return;
        }

        jsend(res).success(getTagsWithCountResponse(filterTags));
    });

    /**
     * @api {get} /api/quiz Generate quiz
     * @apiGroup WebQuiz
     * @apiName GenerateQuiz
     *
     * @apiParam {String} tags List of tags to filter by, encoded as JSON array;
     *      if list is empty, no filtering is applied
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {Object[]} data list of questions
     *      (at most MAX_QUESTIONS_PER_SESSION, currently 10)
     */
    app.get("/api/quiz", (req, res) => {
        let filterTags;
        try {
            filterTags = JSON.parse(req.query.tags);
        } catch (e) {
            jsend(res).fail({tags: "must be valid JSON"});
            return;
        }

        if (!isArrayOfStrings(filterTags)) {
            jsend(res).fail({tags: "must be a JSON array of strings"});
            return;
        }

        const result = getQuestionsByTags(filterTags);

        shuffle(result);

        const MAX_QUESTIONS_PER_SESSION =
            config.max_questions_per_session || 10;

        jsend(res).success(
            result.slice(0, MAX_QUESTIONS_PER_SESSION).map(prerender));
    });

    /**
     * @api {get} /api/math/tex/svg Render LaTeX math to SVG
     * @apiGroup WebQuiz
     * @apiName RenderTexMath
     *
     * @apiParam {String} input Tex math (usually what you find between $ and $)
     *
     * @apiSuccess {SVG} Content rendered svg as "image/svg+xml"
     */
    app.get("/api/math/tex/svg", (req, res) => {
        if (typeof req.query.input === "undefined") {
            jsend(res).fail({input: "required"});
            return;
        }
        const input = "" + req.query.input;
        if (input === "") {
            jsend(res).fail({input: "must not be empty"});
            return;
        }
        const MAX_INPUT_LEN = 1000;
        if (input.length > MAX_INPUT_LEN) {
            jsend(res).fail({input: `too long. max ${MAX_INPUT_LEN} chars`});
            return;
        }

        const hash = crypto.createHash("sha256");
        hash.update(input);
        const hexDigest = hash.digest("hex");
        const folderpath = path.join(rootDir, ".cache", hexDigest.slice(0, 2));
        const filename = hexDigest.slice(2) + ".svg";

        res.sendFile(filename, {root: folderpath}, (err) => {
            if (!err) {
                // sending file was successful
                return;
            }

            mkdirp(folderpath)
                .then(() => {
                    // Cache miss -> Generate SVG from TeX
                    return new Bluebird((resolve, reject) => {
                        mathjax.typeset({
                            math: input,
                            format: "TeX",
                            svg: true,
                        }, function (data) {
                            if (data.errors) {
                                reject(data.errors);
                            } else {
                                resolve(data.svg);
                            }
                        });
                    });
                }).then((svg) => {
                    const EX_IN_PIXEL = 8;
                    return fixSvgSize(svg, EX_IN_PIXEL);
                }).then((svg) => {
                    return fixSvgColor(svg);
                }).then((svg) => {
                    return svgo.optimize(svg);
                }).then((result) => {
                    // save SVG to cache file
                    return fs.writeFileAsync(
                        path.join(folderpath, filename),
                        result.data
                    );
                }).then(() => {
                    res.sendFile(filename, {root: folderpath});
                }).catch((err) => {
                    console.error(err);
                    jsend(res).error("MathJax failed");
                });
        });
    });

    require("./headers")(app);
    app.get("/", (req, res) => {
        res.render("index", {
            config,
            configString: safeJsonStringify(config),
            tagsWithCount: safeJsonStringify(tagsWithCountNoTags),
        });
    });
};
