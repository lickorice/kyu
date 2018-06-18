// Open socket connection:
var socket = io.connect('http://localhost:2109')

// Handle DOM:
var btn_next = document.getElementById('next');
var dropdown = document.getElementById('dropdown');

// Emit a counter event
btn_next.addEventListener('click', function(){
  btn_next.innerHTML = 'LOL'
  socket.emit('next', {
    counterID: dropdown.value
  });
});
