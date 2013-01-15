var express = require('express'),
	app = express(),
  	server = require('http').createServer(app),
  	io = require('socket.io').listen(server);
var PUBLIC_DIR = 'public';
	
app.use(express.static(PUBLIC_DIR));

app.get('/', function(req, res){
	res.sendfile(PUBLIC_DIR + '/index.html');
});

server.listen(3000);
console.log("listening");