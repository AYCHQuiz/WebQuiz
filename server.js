const express = require("express");
const path = require("path");

const app = express();

require("./lib/api")(app);

app.get("/spectre.css", (req, res) => {
    res.sendFile(path.join(__dirname, "node_modules", "spectre.css",
        "dist", "spectre.min.css"));
});

app.use(express.static("app"));

app.listen(3000, function() {
    console.log("web-quiz listening on port 3000");
});
