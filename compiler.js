#!/usr/bin/env node
main();

function main() {
    const args = process.argv.slice(2);
    if(args.length !== 1) {
        console.log("Usage: compiler.js <file>");
        process.exit(1);
    }

    const renderFile = require("./lib/render.js").renderFile; // lazy-load

    renderFile(args[0]).then(html => {
        console.log(JSON.stringify(html));
    }).catch(error =>  {
        console.error(error);
        process.exit(1);
    });
}
