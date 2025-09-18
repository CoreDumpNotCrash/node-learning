const http = require("http");

const server = http.createServer((req, res)=>{
    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, {"content-type": "text/plain"});
        res.end("Hello World!");
    } else if (req.method === "GET" && req.url === "/404") {
        res.writeHead(404, {"content-type": "text/plain"});
        res.end("404");
    } else {
        res.writeHead(302, {"Location": "/404"});
        res.end();
    }
});

server.listen(3000, 'localhost', ()=>{
    console.log("Started server at 3000 port")
});