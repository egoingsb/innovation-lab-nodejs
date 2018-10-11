// Nodejs야 니가 기본적으로 가지고 있는 기능 중에서 http 모듈을 가져와봐! 
var http = require('http');
var server = http.createServer(
    function(request, response){
        // favicon.icon는 좀 무시해!
        if(request.url == '/favicon.ico'){
            return response.writeHead(404);
        }
        console.log(request.url);
        var content = `
            <!doctype html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>WEB</title>
                </head>
                <body>
                    <h1><a href="index.html">WEB</a></h1>
                    <ol>
                        <li><a href="1.html">html</a></li>
                        <li><a href="2.html">css</a></li>
                        <li><a href="3.html">JavaScript</a></li>
                        <li><a href="4.html">Nodejs</a></li>
                    </ol>
                    <h2>html</h2>
                    HTML is HyperText Markup Language.
                </body>
            </html>
        `;
        response.write(content);
        response.end();
    }
);
server.listen(3000);