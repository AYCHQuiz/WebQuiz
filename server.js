"use strict";
const express = require("express");
const path = require("path");

const app = express();

require("./lib/api")(app);

app.get("/spectre.css", (req, res) => {
    res.sendFile(path.join(__dirname, "node_modules", "spectre.css",
        "dist", "spectre.min.css"));
});

app.use(express.static("app"));

const port = process.env.PORT || 3000;

if(process.env.NODE_ENV !== "test") {
    app.listen(port, function() {
        console.log("web-quiz listening on port %d", port);
    });
}

module.exports = app; // for testing