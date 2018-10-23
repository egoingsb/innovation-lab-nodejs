// // // // Nodejs야 니가 기본적으로 가지고 있는 기능 중에서 http 모듈을 가져와봐! 
var http = require('http');
var url = require('url');
var fs = require('fs');

function templateList() {
    var topics = fs.readdirSync('data');
    var i = 0;
    var listTag = '';
    while (i < topics.length) {
        listTag = listTag + `<li><a href="/?id=${topics[i]}">${topics[i]}</a></li>`;
        i = i + 1;
    }
    return listTag;
}
//parameter
function templateHTML(_listTag, _title, _desc) {
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
                        ${_listTag}
                    </ul>
                    <h2>${_title}</h2>
                    ${_desc}
                </body>
            </html>
        `;
    return content;
}

var server = http.createServer(
    function (request, response) {

//         //         // favicon.icon는 좀 무시해!
        if (request.url == '/favicon.ico') {
            return response.writeHead(404);
        }
        var parsed_url = url.parse(request.url, true);

        if (request.url === '/') {
            var title = 'Hi'; 
            var desc = 'Hello, web';
        } else {

            var title = parsed_url.query.id;
            var desc = fs.readFileSync('data/' + parsed_url.query.id, 'utf8');
        }

        var listTag = templateList();
        var content = templateHTML(listTag, title, desc);

        response.write(content);
        response.end();
    }
);
server.listen(3000);