const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("Home page");
    } else if (req.method === "GET" && req.url === "/api") {
        fs.readFile(__dirname + "/data/data.json", "utf-8", (err, data) => {
            if (err) {
                res.writeHead(500, { "content-type": "text/plain" });
                res.end("Cannot load data");
                return;
            }

            res.writeHead(200, { "content-type": "application/json" });
            res.end(data);
        });
    } else if (req.method === "POST" && req.url === "/api") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                let new_data = JSON.parse(body);
                const data_path = __dirname + "/data/data.json";

                fs.readFile(data_path, "utf-8", (err, data) => {
                    let file_data = [];

                    if (!err && data) {
                        try {
                            file_data = JSON.parse(data);
                            if (!Array.isArray(file_data)) {
                                file_data = [];
                            }
                        } catch (e) {
                            file_data = [];
                        }
                    }

                    file_data.push(new_data);

                    fs.writeFile(
                        data_path,
                        JSON.stringify(file_data, null, 2),
                        (err) => {
                            if (err) {
                                res.writeHead(500, {
                                    "content-type": "application/json",
                                });
                                res.end(
                                    JSON.stringify({
                                        status: "error",
                                        message: "problems while saving file",
                                    })
                                );
                                return;
                            }
                            res.writeHead(200, {
                                "content-type": "application/json",
                            });
                            res.end(
                                JSON.stringify({
                                    status: "ok",
                                    received: new_data,
                                })
                            );
                        }
                    );
                });
            } catch (e) {
                res.writeHead(400, { "content-type": "application/json" });
                res.end(
                    JSON.stringify({ status: "error", message: "invalid JSON" })
                );
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404");
    }
});

server.listen(3000, "localhost", () => {
    console.log("Started server at 3000 port");
});
