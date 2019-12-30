// init libs
var express = require('express');
var app = express();

app.use(express.static('views'));
app.use(express.static('node_modules/p5/lib'));
app.use(express.static('node_modules/p5/lib/addons'));

// listen for requests :)
var server = app.listen(process.env.PORT || 3033);
var io = require('socket.io').listen(server);

// Is this an object? WTF javascript?
io.on('connection', function (socket) {

  console.log("new connection: " + socket.id)

  socket.on('newShell', function (shellData) {
    socket.broadcast.emit('newShell', shellData);
    console.log("Shell broadcast");
  });

  socket.on('playerPosUpdate', function (playerPosData) {
    socket.broadcast.emit('playerPosUpdate', playerPosData);
  });
});

console.log('listening...');
