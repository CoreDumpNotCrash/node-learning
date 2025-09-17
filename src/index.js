const http = require("http");

const server = http.createServer((req, res)=>{
    res.writeHead(200, {"content-type": "text/plain"});
    res.end("Hello World!");
});

server.listen(3000, 'localhost', ()=>{
    console.log("Started server at 3000 port")
});