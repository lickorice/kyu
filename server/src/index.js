var express = require('express');
var express_app = express();
var server = express_app.listen(2109, function(){
  console.log('Started to listen on port 2109.')
});

var lstr = '[ LSVR ] '

// Socket integration
var socket = require('socket.io');

// Serverside files (to use on a display screen)
express_app.use(express.static('static'));

// Open sockets:
var io = socket(server);

io.on('connection', function(socket){
  console.log(lstr + 'Connection established with ID: ' + socket.id);

  socket.emit('connection', {});

  socket.on('next', function(data){
    io.sockets.emit('next', data)
  })

  socket.on('callback', function(data){
    io.sockets.emit('callback', data)
  })
});
