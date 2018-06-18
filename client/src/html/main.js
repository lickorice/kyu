// Open socket connection:
var socket = io.connect('http://192.168.2.138:2109')

// Handle DOM:
var btn_next = document.getElementById('next');
var dropdown = document.getElementById('dropdown');
var currentn = document.getElementById('current_number');

// Emit a counter event
btn_next.addEventListener('click', function() {
  socket.emit('next', {
    counterID: dropdown.value
  });
});

// Listens for callback
socket.on('callback', function(data){
  if(data.counterID = dropdown.value){
    currentn.innerHTML = data.counterServing;
  }
});

// Title bar aux
const remote = require('electron').remote
let w = remote.getCurrentWindow()

document.getElementById("close-btn").addEventListener("click", function(e) {
  w.close()
});
