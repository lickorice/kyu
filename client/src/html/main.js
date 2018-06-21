// electron
const {ipcRenderer} = require('electron')

// Handle DOM:
var btn_next = document.getElementById('next');
var currentn = document.getElementById('current_number');
var counter = document.getElementById('counter');


var fs = require('fs');
var dir = 'config/';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

fs.writeFile('config/config.json', '', { flag: 'wx' }, function (err) {
    if (err) throw err;
    console.log("It's saved!");
});

// Handle DB:
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('config/config.json');
const db = low(adapter);


// Initialize DB:
db.defaults(
  {
    current_counter: 1,
    current_customer: 0,
    max_counters: 7,
    ip_address: "localhost"
  }
).write();

// Open socket connection:
var socket = io.connect('http://'+db.get('ip_address')+':2109')

// Refresh function
function refresh(){
  socket = io.connect('http://'+db.get('ip_address')+':2109')
  if (!db.get('current_customer') || db.get('current_customer') == 0) currentn.innerHTML = '-';
  else currentn.innerHTML = db.get('current_customer');
  counter.innerHTML = "Counter " + db.get('current_counter');
}

// Emit a counter event
btn_next.addEventListener('click', function() {
  cur_cnt = "00" + db.get('current_counter');
  socket.emit('next', {
    counterID: cur_cnt
  });
});

socket.on('connect', function(){
  if (!db.get('current_customer') || db.get('current_customer') == 0) currentn.innerHTML = '-';
  else currentn.innerHTML = db.get('current_customer');
  counter.innerHTML = "Counter " + db.get('current_counter');
})

// Listens for connection
socket.on('connection-ping', function(data){
  console.log("connected")
  var status = document.getElementById('status');
  status.innerHTML = "CONNECTED";
  status.style.color = "#3ec23f";

  socket.emit('connection-confirm', {counterID:"00"+db.get('current_counter')});
})

// Listens for callback
socket.on('callback', function(data){
  if(data.counterID == "00" + db.get('current_counter')){
    currentn.innerHTML = data.counterServing;
    db.set('current_customer', data.counterServing).write();
    console.log(data.counterServing);
  }
});

// Listens for full-restart
socket.on('full-restart', function(data){
  currentn.innerHTML = '-';
});

// Listens for disconnection
socket.on('disconnect', function(){
  var status = document.getElementById('status');
  status.innerHTML = "DISCONNECTED";
  status.style.color = "#db1f1f";

  socket.emit('connection-confirm', {counterID:"00"+db.get('current_counter')});
});

// Title bar aux
const remote = require('electron').remote
let w = remote.getCurrentWindow()


document.getElementById('settings-btn').addEventListener("click", function(e) {
  socket.emit('server-refresh', {});
  ipcRenderer.send('show-preferences', 'controller')
})

document.getElementById("close-btn").addEventListener("click", function(e) {
  socket.emit('server-refresh', {});
  w.close()
});
