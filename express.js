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
function templateHTML(_listTag, _title, _desc, _nickname) {
    var authUI = '';
    if(_nickname){
        authUI = `<a href="/logout">logout</a>`;
    } else {
        authUI = `<a href="/login">login</a>`;
    }
    var content = `
            <!doctype html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>WEB</title>
                </head>
                <body>
                    ${authUI}
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
var authData = {username:'egoing', password:'1111', nickname:'이고잉'}
server.get('/', function (request, response) {
    var username = request.cookies.username;
    var password = request.cookies.password;
    var nickname = null;
    if(username === authData.username && password === authData.password){
        nickname = authData.nickname;
        console.log('주인님');
    }
    var title = 'Hi';
    var desc = 'Hello, web';
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc, nickname);
    response.send(content);
});

server.get('/topic/:title', function (request, response) {
    var username = request.cookies.username;
    var password = request.cookies.password;
    var nickname = null;
    if(username === authData.username && password === authData.password){
        nickname = authData.nickname;
        console.log('주인님');
    }

    var title = request.params.title;
    var desc = fs.readFileSync('data/' + title, 'utf8');
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc, nickname);
    response.write(content);
    response.end();
});
server.get('/create', function (request, response) {

    var username = request.cookies.username;
    var password = request.cookies.password;
    var nickname = null;
    if(username === authData.username && password === authData.password){
        nickname = authData.nickname;
        console.log('주인님');
    } else {
        response.redirect('/');
    }


    var title = 'Create';
    var desc = `
        <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="desc" placeholder="description"></textarea></p>
            <p><input type="submit"></p>
        </form>
    `;
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc, nickname);
    response.write(content);
    response.end();
});
server.get('/login', function (request, response) {
    var title = 'login';
    var desc = `
        <form action="/login_process" method="post">
            <p><input type="text" name="username" placeholder="title"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit" value="login"></p>
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

server.post('/login_process', function(request, response){
    var username = request.body.username; // 2
    var password = request.body.password;
    if(username === authData.username) {
        console.log('아이디를 맞음');
        if(password === authData.password){
            console.log('비밀번호 맞음');
            response.append('Set-Cookie', `username=${username};`);
            response.append('Set-Cookie', `password=${password};`);
            return response.redirect('/');
        }
    }
    return response.send('뉘슈?');
});
server.get('/logout', function(request, response){
    response.append('Set-Cookie', 'username=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'); 
    response.append('Set-Cookie', 'password=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'); 
    response.redirect('/');
});
server.listen(3000);