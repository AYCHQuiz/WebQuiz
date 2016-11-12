#!/usr/bin/env node
const ArgumentParser = require("argparse").ArgumentParser;
const package = require("./package");
const Bluebird = require("Bluebird");
const fs = Bluebird.promisifyAll(require("fs"));
const path = require("path");
const renderFile = require("./lib/render.js").renderFile;

main();

function main() {
    const parser = new ArgumentParser({
        version: package.version,
        addHelp: true,
        description: package.description
    });
    parser.addArgument(["in"]);
    parser.addArgument(["-o", "--out"], {
        required: true
    });
    const args = parser.parseArgs();

    if(fs.statSync(args.in).isDirectory()) {
        try{ fs.mkdirSync(args.out); } catch(e) {}
        compileDirectory(args.in, args.out);
    } else {
        compileFile(args.in, args.out);
    }
}

function compileDirectory(src, dest) {
    const allTags = new Set();
    const questionIndex = [];

    fs.readdirAsync(src).filter(fileName =>
        [".yml", ".yaml"].includes(path.extname(fileName))
    ).filter(fileName =>
        fs.statAsync(path.join(src, fileName)).then(stat => stat.isFile())
    ).map(fileName =>
        renderFile(path.join(src, fileName))
    ).each(question => {
        const destFile = path.join(dest, question.uid + ".json");
        fs.writeFileAsync(destFile, JSON.stringify(question.content), "utf8");
        for(const tag of question.tags) {
            allTags.add(tag);
        }
        questionIndex.push({
            uid: question.uid,
            tags: question.tags
        });
    }).then(() => {
        fs.writeFileAsync(path.join(dest, "_index.json"), JSON.stringify({
            questions: questionIndex,
            tags: Array.from(allTags)
        }), "utf8");
    });
}

function compileFile(src, dest) {
    renderFile(src).then(html => {
        return fs.writeFileAsync(dest, JSON.stringify(html), "utf8");
    }).catch(error => {
        console.error(error);
    });
}

function replaceFileExt(fileName, nextExt) {
    return fileName.replace(/\.[^/\.]+$/, nextExt);
}
