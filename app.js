var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);
var PUBLIC_DIR = 'public';

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(PUBLIC_DIR));

var mongoose = require('mongoose'),
db = mongoose.connect('mongodb://127.0.0.1:27017/dashboard');

var routes = require('./routes/'),
middleware = require('./middleware');
require('./routes.js').routes.forEach(function(r) {
  var mid = r.middleware || [],
  args = [];
  mid.forEach(function(m) {
    args.push(middleware[m]);
  });
  args.unshift(r.path);
  args.push(routes[r.route]);
  app[r.method || 'get'].apply(app, args);
});

server.listen(3000);
console.log("listening on port 3000");