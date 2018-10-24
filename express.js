var fs = require('fs');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var express = require('express');
var server = express();
server.use(session({
    secret: 'jdasghkjsdahfksdaf',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    },
    store:new FileStore()
}));
server.use(bodyParser.urlencoded({
    extended: false
}));
var authData = {
    username: 'a@a.com',
    password: '111111',
    displayName: 'egoing'
}

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
//parameter
function templateHTML(_listTag, _title, _desc, _displayName) {
    var authUI = '<a href="/login">login</a>';
    if(_displayName){
        authUI = '<a href="/logout_process">logout</a>';
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

server.get('/', function (request, response) {
    var title = 'Hi';
    var desc = 'Hello, web';
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc, request.session.displayName);
    response.write(content);
    response.end();
});
server.get('/login', function (request, response) {
    var title = 'Login';
    var desc = `
        <form action="/login_process" method="post">
            <p><input type="text" name="username" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit"></p>
        </form>
    `;
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc, request.session.displayName);
    response.write(content);
    response.end();
});
server.get('/topic/:title', function (request, response) {
    var title = request.params.title;
    var desc = fs.readFileSync('data/' + title, 'utf8');
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc, request.session.displayName);
    response.write(content);
    response.end();
});
server.get('/create', function (request, response) {
    if(!request.session.isLogin){
        return response.redirect('/login');
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
    var content = templateHTML(listTag, title, desc, request.session.displayName);
    response.write(content);
    response.end();
});
server.post('/create_process', function (request, response) {
    if(!request.session.isLogin){
        return response.redirect('/login');
    }
    var title = request.body.title;
    var desc = request.body.desc;
    fs.writeFileSync(`data/${title}`, desc);
    response.redirect('/topic/' + title);
});
server.post('/login_process', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username === authData.username && password === authData.password) {
        request.session.isLogin = true;
        request.session.displayName = authData.displayName;
        response.redirect('/');
    } else {
        response.send('뉘신지?');
    }
});
server.get('/logout_process', function(request, response){
    request.session.destroy(function(err){
        response.redirect('/');
    });
});
server.get('/session/set', function(request, response){
    var rand = Math.random();
    request.session.rand = rand;
    response.send(rand.toString());
});
server.get('/session/get', function(request, response){
    response.send(request.session.rand.toString());
});
server.listen(3000);