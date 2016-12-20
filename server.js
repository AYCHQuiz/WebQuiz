"use strict";

// Disable ESLint warnings that are irrelevant for Node.js
/* eslint-disable no-console */

const express = require("express");
const path = require("path");

const app = express();
app.set("view engine", "pug");
app.disable("x-powered-by");

app.use("/static", express.static("static"));

require("./lib/api")(app);

const port = process.env.PORT || 3000;

if(process.env.NODE_ENV !== "test") {
    app.listen(port, function() {
        console.log("web-quiz listening on port %d", port);
    });
}

module.exports = app; // for testing
