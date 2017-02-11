"use strict";

// Disable ESLint warnings that are irrelevant for Node.js
/* eslint-disable no-console */

const express = require("express");
const path = require("path");
const compression = require("compression");

const app = express();
app.set("view engine", "pug");
app.set('views', path.join(__dirname, 'lib/views'));
app.disable("x-powered-by");

app.use(compression());

if(process.env.NODE_ENV === "development") {
    // Special configuration for development mode
    // Hot-Module-Reload enables reloading of Vue components on the fly
    const webpack = require("webpack");
    const webpackConfig = require("./webpack.config.js");
    if(!Array.isArray(webpackConfig.entry)) {
        webpackConfig.entry = [webpackConfig.entry];
    }
    webpackConfig.entry.push("webpack-hot-middleware/client");
    if(!Array.isArray(webpackConfig.plugins)) {
        webpackConfig.plugins = [];
    }
    webpackConfig.plugins = webpackConfig.plugins.concat([
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]);
    const compiler = webpack(webpackConfig);
    app.use(require("webpack-dev-middleware")(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));
    app.use(require("webpack-hot-middleware")(compiler));
} else {
    app.use("/static", express.static("static"));
}

require("./lib/api")(app);

const port = process.env.PORT || 3000;

console.log("NODE_ENV: %s", process.env.NODE_ENV);

if(process.env.NODE_ENV !== "test") {
    app.listen(port, function() {
        console.log("web-quiz listening on port %d", port);
    });
}

module.exports = app; // for testing
