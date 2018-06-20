// Open socket connection:
var socket = io.connect('http://localhost:2109')

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

// Listens for connection
socket.on('connection', function(data){
  console.log("connected")
  var status = document.getElementById('status');
  status.innerHTML = "CONNECTED";
  status.style.color = "#3ec23f";
})

// Listens for callback
socket.on('callback', function(data){
  if(data.counterID = dropdown.value){
    currentn.innerHTML = data.counterServing;
  }
});

// Title bar aux
const remote = require('electron').remote
const { ipcRenderer } = require('electron')
let w = remote.getCurrentWindow()


document.getElementById('settings-btn').addEventListener("click", function(e) {
  ipcRenderer.send('show-preferences', 'controller')
})

document.getElementById("close-btn").addEventListener("click", function(e) {
  w.close()
});
