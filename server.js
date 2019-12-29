// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('views'));
app.use(express.static('node_modules/p5/lib'));
app.use(express.static('node_modules/p5/lib/addons'));

// listen for requests :)
var server = app.listen(3033);
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
  console.log("new connection: " + socket.id)

  socket.on('newShell', function (shellData) {
    socket.broadcast.emit('newShell', shellData);
  });
});

console.log('listening on port 3033');
