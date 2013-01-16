var express = require('express'),
  app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    cta = require("./cta-fetcher.js").ctaJSON;

var PUBLIC_DIR = 'public';

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(PUBLIC_DIR));

var mongoose = require('mongoose'),
    mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb',
    db = mongoose.connect(mongoUri);

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

io.sockets.on('connection', function (socket) {
  socket.on('cta-refresh', function (params) {
    console.log(params);
    cta(function(data) {
      socket.emit('cta-update', data);
    }, params.busNo, params.stopId, params.maxResults);
  });
});

server.listen(3000);
console.log("listening on port 3000");