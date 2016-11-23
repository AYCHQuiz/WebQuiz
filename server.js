const express = require("express");
const path = require("path");
const Bluebird = require("bluebird");
const fs = Bluebird.promisifyAll(require("fs"));
const crypto = require("crypto");
const mkdirp = Bluebird.promisify(require("mkdirp"));
const YAML = require('yamljs');
const prerender = require("./lib/prerender").prerender;

const rootDir = process.argv[2];
const questions = [];
const tags = new Set();

for(let file of fs.readdirSync(rootDir)) {
    if(file === ".." || file === ".") continue;
    const question = YAML.parse(fs.readFileSync(path.join(rootDir, file), "utf8"));
    for(let tag of question.tags) {
        tags.add(tag);
    }
    questions.push(question);
}

const app = express();

app.get("/spectre.css", (req, res) => {
    res.sendFile(path.join(__dirname, "node_modules", "spectre.css",
        "dist", "spectre.min.css"));
});

app.get("/tags", (req, res) => {
    res.json(Array.from(tags));
});

app.get("/count_questions", (req, res) => {
    const filterTags = req.query.tags ? req.query.tags.split("|") : [];
    var counter = 0;
    for(const question of questions) {
        var hasAllTags = true;
        for(const tag of filterTags) {
            if(!question.tags.includes(tag)) {
                hasAllTags = false;
                break;
            }
        }
        if(hasAllTags) {
            counter ++;
        }
    }
    res.json({count: counter});
});

app.get("/api/quiz", (req, res) => {
    const filterTags = req.query.tags ? req.query.tags.split("|") : [];
    const result = [];

    for(const question of questions) {
        let hasAllTags = true;
        for(let tag of filterTags) {
            if(!question.tags.includes(tag)) {
                hasAllTags = false;
                break;
            }
        }
        if(hasAllTags) {
            result.push(question);
        }
    }

    res.json(result.map(prerender));
});

app.get("/api/math", (req, res) => {
    req.query.tex = '' + req.query.tex;
    if(req.query.tex.length > 1000) {
        res.status(400).json({"error": "Input too long. (Max. 1000 chars)"});
        return;
    }

    const hash = crypto.createHash('sha256');
    hash.update(req.query.tex);
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
                    math: req.query.tex,
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
            res.status(500).json({"error": "MathJax failed"});
        });
    });
});

app.use(express.static("app"));

app.listen(3000, function() {
    console.log("web-quiz listening on port 3000");
});
