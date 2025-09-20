const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, "data/data.json");

app.use(express.json());

app.get("/", (req, res) => {
    res.end("Home Page");
});

app.get("/api", (req, res) => {
    res.sendFile(DATA_PATH, (err) => {
        if (err) {
            res.status(500).json({
                status: "error",
                message: "Cannot load file",
            });
        }
    });
});

app.post("/api/:scope", (req, res) => {
    HandlePost(req, res);
});

app.post("/api", (req, res) => {
    HandlePost(req, res);
});

function HandlePost(req, res) {
    const scope = req.params.scope;
    const newData = req.body;

    fs.readFile(DATA_PATH, "utf-8", (err, data) => {
        let fileData = {};
        if (!err) {
            try {
                fileData = JSON.parse(data) || {};
            } catch {}
        }
        if (scope) {
            if (!Array.isArray(fileData[scope])) fileData[scope] = [];
            fileData[scope].push(newData);
        } else {
            if (!Array.isArray(fileData)) fileData = [];
            fileData.push(newData);
        }
        fs.writeFile(DATA_PATH, JSON.stringify(fileData, null, 2), (err) => {
            if (err)
                return res.status(500).json({
                    status: "error",
                    scope: scope || "root",
                    message: "Couldnt save data into file",
                });
            res.json({
                status: "ok",
                scope: scope || "root",
                received: newData,
            });
        });
    });
}   

app.listen(PORT, () => console.log(`Server launch on localhost:${PORT}`));