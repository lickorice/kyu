// Handle DB:
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('data/data.json');
const db = low(adapter);

// Initialize DB:
db.defaults({
  001: 0,
  002: 0,
  003: 0,
  004: 0,
  005: 0,
  006: 0,
  007: 0,
  current_array: [],
  current_array_others: []
}).write();

// Express and socket.io
var express = require('express');
var express_app = express();
var server = express_app.listen(2109, function() {
  console.log('Started to listen on port 2109.')
});

var lstr = '[ LSVR ] '

// Socket integration
var socket = require('socket.io');

// Serverside files (to use on a display screen)
express_app.use(express.static('static'));

// Open sockets:
var io = socket(server);

// Loads local file dependencies:
let scrolltext;
fs = require('fs')
fs.readFile('./static/shared/scrolling-text.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  scrolltext = data;
});

// Handle videos
let videoArray = [];
fs.readdir('./static/shared/videos/', (err, files) => {
  files.forEach(file => {
    console.log(file);
    videoArray.push(file);
  });
})

// Handle photos
let photoArray = [];
fs.readdir('./static/shared/photos/', (err, files) => {
  files.forEach(file => {
    console.log(file);
    photoArray.push(file);
  });
})

io.on('connection', function(socket) {
  console.log(lstr + 'Connection established with ID: ' + socket.id);

  socket.emit('load-data', {
    counter: [
      db.get('001'),
      db.get('002'),
      db.get('003'),
      db.get('004'),
      db.get('005'),
      db.get('006'),
      db.get('007')
    ],
    current_array: db.get('current_array'),
    current_array_others: db.get('current_array_others'),
    scroll_text: scrolltext,
    photo_array: photoArray,
    video_array: videoArray
  });

  socket.emit('connection-ping', {});
  socket.on('connection-ping', function(data) {
    io.sockets.emit('connection-ping', data);
    // Send persistent data to server

  });

  socket.on('server-refresh', function() {
    io.sockets.emit('server-refresh', {});
  });

  socket.on('next', function(data) {
    io.sockets.emit('next', data);
  })

  socket.on('repeat', function(data) {
    io.sockets.emit('repeat', data);
  })

  socket.on('callback', function(data) {
    io.sockets.emit('callback', data);
  })

  // Restart everything
  socket.on('server-restart', function(data) {
    console.log("restarting(2/3)");
    io.sockets.emit('full-restart', data);
    for(i=1;i<=7;i++){
      db.set('00'+i, 0).write();
    }
  });

  socket.on('connection-confirm', function(data) {
    io.sockets.emit('server-confirm', data);
  });

  // Save methods
  socket.on('save-counter', function(data) {
    db.set(data.counterID, data.current_customer).write();
  });
  socket.on('save-array', function(data) {
    db.set('current_array', data.array).write();
  })
  socket.on('save-array-others', function(data) {
    db.set('current_array_others', data.array).write();
  })
});
