const Bluebird = require("bluebird");
const fs = Bluebird.promisifyAll(require("fs"));
const crypto = require("crypto");
const mkdirp = Bluebird.promisify(require("mkdirp"));
const YAML = require('yamljs');
const path = require("path");
const prerender = require("./prerender").prerender;
const jsend = require("./jsend");

module.exports = app => {
    const rootDir = process.env.NODE_ENV === "test" ?
        path.join(__dirname, "..", "example-quiz") : process.argv[2];
    const questions = [];
    const tags = new Set();

    for(var file of fs.readdirSync(rootDir)) {
        if(file === ".." || file === ".") continue;
        const question = YAML.parse(fs.readFileSync(path.join(rootDir, file), "utf8"));
        for(var tag of question.tags) {
            tags.add(tag);
        }
        questions.push(question);
    }

    function getQuestionsByTags(tags, callback) {
        questions.forEach(q => {
            if(tags.every(tag => q.tags.indexOf(tag) !== -1)) {
                callback(q);
            }
        });
    }

    /**
     * @api {get} /api/tags Get all tags
     * @apiGroup WebQuiz
     * @apiName GetTags
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {String[]} data List of all tags
     */
    app.get("/api/tags", (req, res) => {
        jsend(res).success(Array.from(tags));
    });

    /**
     * @api {get} /api/count_questions Count questions matching tags
     * @apiGroup WebQuiz
     * @apiName CountQuestions
     *
     * @apiParam {String[]} tags List of tags, separated by "|"; if list is
     *      empty, the number of all questions will be returned
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {Number} data number of questions matching to given tags
     */
    app.get("/api/count_questions", (req, res) => {
        const filterTags = req.query.tags ? req.query.tags.split("|") : [];
        var counter = 0;
        getQuestionsByTags(filterTags, () => counter++);

        jsend(res).success(counter);
    });

    /**
     * @api {get} /api/quiz Generate quiz
     * @apiGroup WebQuiz
     * @apiName GenerateQuiz
     *
     * @apiParam {String[]} tags List of tags to filter by, separated by "|";
     *      if list is empty, no filtering is applied
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {Object[]} data list of questions
     */
    app.get("/api/quiz", (req, res) => {
        const filterTags = req.query.tags ? req.query.tags.split("|") : [];
        const result = [];

        getQuestionsByTags(filterTags, q => result.push(q));

        jsend(res).success(result.map(prerender));
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
        if(typeof req.query.input === "undefined") {
            jsend(res).fail({input: "required"});
            return;
        }
        const input = '' + req.query.input;
        if(input === "") {
            jsend(res).fail({input: "must not be empty"});
            return;
        }
        const MAX_INPUT_LEN = 1000;
        if(input.length > MAX_INPUT_LEN) {
            jsend(res).fail({input: `too long. max ${MAX_INPUT_LEN} chars`});
            return;
        }

        const hash = crypto.createHash('sha256');
        hash.update(input);
        const sha1hash = hash.digest('hex');
        const folderpath = path.join(__dirname, "cache", sha1hash.slice(0, 2));
        const filepath = path.join(folderpath, sha1hash.slice(2));

        fs.readFileAsync(filepath)
        .then(data => {
            res.setHeader("Content-Type", "image/svg+xml");
            res.send(data);
        }).catch(err => {
            mkdirp(folderpath)
            .then(() => {
                // Cache miss -> Generate SVG from TeX
                return new Bluebird((resolve, reject) => {
                    const mathjax = require("mathjax-node/lib/mj-single.js");
                    mathjax.typeset({
                        math: input,
                        format: "TeX",
                        svg: true
                    }, function (data) {
                        if(data.errors) {
                            reject(data.errors);
                        } else {
                            resolve(data.svg);
                        }
                    });
                });
            }).then(svg => {
                // save SVG to cache file
                return fs.writeFileAsync(filepath, svg)
                .then(() => Bluebird.resolve(svg));
            }).then(svg => {
                res.setHeader("Content-Type", "image/svg+xml");
                res.send(svg);
            }).catch(err => {
                jsend(res).error("MathJax failed");
            });
        });
    });
};
