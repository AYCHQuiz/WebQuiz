var webpackConfig = require("./webpack.config.js");
delete webpackConfig.entry;

// karma.conf.js
module.exports = function (config) {
    config.set({
        browsers: ["Firefox", "Chrome"],
        frameworks: ["mocha"],
        // this is the entry file for all our tests.
        files: ["app/test/index.js"],
        // we will pass the entry file to webpack for bundling.
        preprocessors: {
            "app/test/index.js": ["webpack"]
        },
        // use the webpack config
        webpack: webpackConfig,
        // avoid walls of useless text
        webpackMiddleware: {
            noInfo: true
        },
        singleRun: true
    });
};
