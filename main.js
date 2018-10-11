// Nodejs야 니가 기본적으로 가지고 있는 기능 중에서 http 모듈을 가져와봐! 
var http = require('http');
var server = http.createServer(
    function(request, response){
        console.log('hihi');
        response.write('hi');
        response.end();
    }
);
server.listen(3000);