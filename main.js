// // Nodejs야 니가 기본적으로 가지고 있는 기능 중에서 http 모듈을 가져와봐! 
var http = require('http');
var url = require('url');
var fs = require('fs');
var server = http.createServer(
     function(request, response){
         
        // favicon.icon는 좀 무시해!
        if(request.url == '/favicon.ico'){
            return response.writeHead(404);
        }
        var parsed_url = url.parse(request.url, true);
        if(request.url === '/') {
            title = 'Welcome';
            desc = 'Hello, Web'; 
        } else {
            var title = parsed_url.query.id;
            var desc = fs.readFileSync('data/'+parsed_url.query.id, 'utf8');
        }
        console.log(desc);
        var content = `
            <!doctype html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>WEB</title>
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    <ul>
                        <li><a href="/?id=html">html</a></li>
                        <li><a href="/?id=css">css</a></li>
                        <li><a href="/?id=javascript">javascript</a></li>
                    </ul>
                    <h2>${title}</h2>
                    ${desc}
                </body>
            </html>
        `;
        response.write(content);
        response.end();
     }
);
server.listen(3000);