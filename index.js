var http = require('http');
var express = require('express');
var fs = require('fs');
var server = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
var template = {
    list: function () {
        var listTag = '';
        var files = fs.readdirSync('data');
        var i = 0;
        while (i < files.length) {
            listTag = listTag + `<li><a href="/topic/${files[i]}">${files[i]}</a></li>`;
            i++;
        }
        return listTag;
    },
    html:function(listTag, title, desc, nickname) {
        var authUI = '';
        if(nickname){
            authUI = `<a href="/logout">logout</a>`;
        } else {
            authUI = `<a href="/login">login</a>`;
        }
        return `
        <!doctype html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>WEB</title>
        </head>
        <body>
            ${authUI}
            <h1><a href="/">WEB</a></h1>
            <ol>
                ${listTag}
            </ol>
            <a href="/create">create</a>
            <h2>${title}</h2>
            ${desc}
        </body>
    </html>
        `;
    }
}
var authData = {
    username:'egoing', 
    password:'1111',
    nickname:'이고잉'
}
server.get('/', function (request, response) {
    var username = request.cookies.username;
    var password= request.cookies.password;
    var nickname = null;
    if(username === authData.username && password === authData.password){
        nickname = authData.nickname;
    }
    
    var title = 'Welcome';
    var desc = 'Hello, web';
    var listTag = template.list();
    response.send(template.html(listTag, title, desc, nickname));
});
server.get('/topic/:title', function (request, response) {
    var username = request.cookies.username;
    var password= request.cookies.password;
    var nickname = null;
    if(username === authData.username && password === authData.password){
        nickname = authData.nickname;
    }

    var title = request.params.title;
    var desc = fs.readFileSync(`data/${title}`, 'utf8');
    var listTag = template.list();
    response.send(template.html(listTag, title, desc, nickname));
});
server.get('/create', function(request, response){
    var username = request.cookies.username;
    var password= request.cookies.password;
    var nickname = null;
    if(username === authData.username && password === authData.password){
        nickname = authData.nickname;
    } else {
        return response.redirect('/login');
    }

    var title = 'Create';
    var desc = `
        <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p><textarea name="desc" placeholder="description"></textarea></p>
            <p><input type="submit" value="글작성"></p>
        </form>
    `;
    var listTag = template.list();
    response.send(template.html(listTag, title, desc, nickname));
})
server.post('/create_process', function(request, response){
    var username = request.cookies.username;
    var password= request.cookies.password;
    if(username === authData.username && password === authData.password){
    } else {
        return response.redirect('/login');
    }

    var title = request.body.title;
    var desc = request.body.desc;
    fs.writeFileSync(`data/${title}`, desc);
    response.redirect(`/topic/${title}`);
})
server.get('/login', function(request, response){
    var title = 'Login';
    var desc = `
        <form action="/login_process" method="post">
            <p><input type="text" name="username" placeholder="username"></p>
            <p><input type="password" name="password" placeholder="password"></textarea></p>
            <p><input type="submit" value="login"></p>
        </form>
    `;
    var listTag = template.list();
    response.send(template.html(listTag, title, desc));
})
server.post('/login_process', function(request, response){
    var username = request.body.username;
    var password = request.body.password;
    if(username === authData.username && password === authData.password){
        response.append('Set-Cookie', `username=${username};`);
        response.append('Set-Cookie', `password=${password};`);
        return response.redirect('/');
    } else {
        response.end('뉘슈?');
    }
})
server.get('/logout', function(request, response){
    response.append('Set-Cookie', 'username=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'); 
    response.append('Set-Cookie', 'password=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'); 
    response.redirect('/');
})
server.listen(3000);