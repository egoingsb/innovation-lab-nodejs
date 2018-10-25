var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
function templateList() {
    var topics = fs.readdirSync('data');
    var i = 0;
    var listTag = '';
    while (i < topics.length) {
        listTag = listTag + `<li><a href="/topic/${topics[i]}">${topics[i]}</a></li>`;
        i = i + 1;
    }
    return listTag;
}
// //parameter
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
                    <a href="/create">create</a>
                    <h2>${_title}</h2>
                    ${_desc}
                </body>
            </html>
        `;
    return content;
}
server.get('/cookie/set', function(request, response){
    response.append('Set-Cookie', 'isLogined=true;'); 
    response.end('set cookie');
})
server.get('/cookie/get', function(request, response){
    console.log(request.headers.cookie);
    console.log(request.cookies.isLogined);
    response.end('get cookie');
})
server.get('/', function (request, response) {
    var title = 'Hi';
    var desc = 'Hello, web';
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc);
    response.send(content);
});

server.get('/topic/:title', function (request, response) {
    var title = request.params.title;
    var desc = fs.readFileSync('data/' + title, 'utf8');
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc);
    response.write(content);
    response.end();
});
server.get('/create', function (request, response) {
    var title = 'Create';
    var desc = `
        <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="desc" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
        </form>
    `;
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc);
    response.write(content);
    response.end();
});
server.post('/create_process', function(request, response){
    var title = request.body.title;
    var desc = request.body.desc;
    fs.writeFileSync(`data/${title}`, desc);
    response.redirect('/topic/'+title);
});
server.listen(3000);