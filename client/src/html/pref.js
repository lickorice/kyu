// electron
const {ipcRenderer} = require('electron');

// Handle DB:
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('config/config.json')
const db = low(adapter)

// DOM:
var ip_add = document.getElementById('ip');;
ip_add.setAttribute("value", db.get('ip_address'));
var dropdown = document.getElementById('counter_drp');
var btn_save = document.getElementById('save');
var btn_rest = document.getElementById('restart');

// Init counter dropdown
for(i = 1; i <= db.get('max_counters'); i++){
  var option = document.createElement('option');
  option.innerHTML = "Counter 00"+i
  option.setAttribute("value", "00"+i)

  if(i == db.get('current_counter')){
    option.selected = true;
  }

  dropdown.appendChild(option);
}

// Open socket connection:
var socket = io.connect('http://'+db.get('ip_address')+':2109')

// Save changes:
btn_save.addEventListener('click', function(e){
  db.set('current_counter', parseInt(dropdown.value.substr(dropdown.value.length - 1))).write();
  db.set('ip_address', ip_add.value).write();
  ipcRenderer.send('client-refresh', 'client-controller')
  socket = io.connect('http://'+db.get('ip_address')+':2109')
  socket.emit('server-refresh');
});

// Restart server:
btn_rest.addEventListener('click', function(e){
  console.log("restarting (1/3)");
  db.set('current_customer', 0).write();
  socket.emit('server-restart', {manual:true});
});

// Title bar aux
const remote = require('electron').remote;
let w = remote.getCurrentWindow();


document.getElementById("close-btn").addEventListener("click", function(e) {
  socket.emit('server-refresh', {manual:true});
  w.close();
});
