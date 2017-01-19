var webpackConfig = require("./webpack.config.js");
delete webpackConfig.entry;

// karma.conf.js
module.exports = function (config) {
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.log("Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.");
        process.exit(1);
    }

    var customLaunchers = {
        sl_ios_safari_9: {
            base: "SauceLabs",
            browserName: "Safari",
            platform: "iOS",
            version: "9.3",
            device: "iPhone 6"
        },
        sl_ios_safari_8: {
            base: "SauceLabs",
            browserName: "Safari",
            platform: "iOS",
            version: "8.4",
            device: "iPhone 6"
        },
        sl_android_5: {
            base: "SauceLabs",
            browserName: "Browser",
            platform: "Android",
            version: "5.1",
            device: "Android Emulator",
        },
        sl_chrome: {
            base: "SauceLabs",
            browserName: "chrome",
            platform: "Windows 10",
            version: "55.0"
        },
        sl_firefox: {
            base: "SauceLabs",
            browserName: "firefox",
            platform: "Windows 10",
            version: "50"
        },
        sl_safari_10: {
            base: "SauceLabs",
            browserName: "safari",
            platform: "OS X 10.11",
            version: "10"
        },
        sl_safari_9: {
            base: "SauceLabs",
            browserName: "safari",
            platform: "OS X 10.11",
            version: "9"
        },
        sl_edge_14: {
            base: "SauceLabs",
            browserName: "MicrosoftEdge",
            platform: "Windows 10",
            version: "14"
        },
        sl_edge_13: {
            base: "SauceLabs",
            browserName: "MicrosoftEdge",
            platform: "Windows 10",
            version: "13"
        }
    };

    config.set({
        browsers: Object.keys(customLaunchers),
        customLaunchers: customLaunchers,
        reporters: ["dots", "saucelabs"],
        sauceLabs: {
            testName: "Web-Quiz Component Tests"
        },
        // How many browsers Karma launches in parallel.
        // (prevent overload in saucelabs)
        concurrency: 5,
        // Timeout for capturing a browser (prevent timeouts to saucelabs)
        captureTimeout: 120000,
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
