// Open socket connection:
var socket = io.connect('http://localhost:2109')

const valid_counters = ['001', '002', '003', '004', '005', '006', '007'];

var counter_values = []
var queue_numbers = []
var queue_numbers_others = []

socket.on('load-data', function(data) {
  console.log(data);
  queue_numbers = data.current_array;
  queue_numbers_others = data.current_array_others;

  for (i = 1; i <= 7; i++) {
    console.log(data.counter[i - 1]);
    document.getElementById('customer_0' + i).innerHTML = '-';
  }

  counter_values = [
    data.counter[0],
    data.counter[1],
    data.counter[2],
    data.counter[3],
    data.counter[4],
    data.counter[5],
    data.counter[6],
  ]
});

function arrayInit() {
  queue_numbers = []
  queue_numbers_others = []
  for (i = 0; i <= 79; i++) {
    queue_numbers.push(80 - i);
  }
  for (i = 0; i <= 49; i++) {
    queue_numbers_others.push(150 - i);
  }
  socket.emit('save-array', {
    array: queue_numbers
  })
  socket.emit('save-array-others', {
    array: queue_numbers_others
  })
}

function refresh() {
  for (i = 1; i <= 7; i++) {
    csts = document.getElementById('counter_sts_' + i);
    csts.innerHTML = 'CLOSED';
    csts.style.color = "#8a1c1c";
    document.getElementById('customer_0' + i).style.color = "var(--color-neutral)"
    document.getElementById('customer_0' + i).innerHTML = "-";
  }
  socket.emit('connection-ping', {})
}

// Handle refresh:
socket.on('server-refresh', function(data) {
  refresh();
})

// Handle connection events:
window.onload = function() {
  // Clock:

  function formatAMPM() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'P.M.' : 'A.M.';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('time').innerHTML = hours + ':' + minutes + ' ' + ampm;
    var t = setTimeout(formatAMPM, 500);
  }

  formatAMPM();

  socket.emit('connection-ping', {})
}

// on ping confirmation:
socket.on('server-confirm', function(data) {
  cID = data.counterID.substr(data.counterID.length - 1);
  csts = document.getElementById('counter_sts_' + cID);
  csts.innerHTML = 'NOW SERVING';
  csts.style.color = "#3cd763";
  document.getElementById('customer_0' + cID).style.color = "var(--text-visible-2)";
  if (!counter_values[parseInt(cID) - 1]) document.getElementById('customer_0' + cID).innerHTML = '-';
  else document.getElementById('customer_0' + cID).innerHTML = counter_values[parseInt(cID) - 1];
});

function checkEmpty(array) {
  if (array === undefined || array.length == 0) {
    arrayInit();
  }
}

function handleQueue(counterID) {
  if (counterID == '007') {
    checkEmpty(queue_numbers_others);
    var nextinline = queue_numbers_others.pop();
  } else {
    checkEmpty(queue_numbers);
    var nextinline = queue_numbers.pop();
  }

  cID = counterID.substr(counterID.length - 1);
  document.getElementById('customer_0' + cID).innerHTML = nextinline;

  counter_values[parseInt(cID) - 1] = nextinline;

  socket.emit('callback', {
    counterID: counterID,
    counterServing: nextinline
  });
  socket.emit('save-counter', {
    counterID: counterID,
    current_customer: nextinline
  })
  if (counterID == '007') {
    socket.emit('save-array', {
      array: queue_numbers
    });
  } else {
    socket.emit('save-array-others', {
      array: queue_numbers_others
    });
  }

  // Effects:
  var audio = new Audio('assets/notification.mp3');
  audio.play();

  var target = document.getElementById('customer_0' + cID)
  var times = 0
  var flasher = setInterval(function() {
    if (times == 11) clearInterval(flasher);
    target.style.textShadow = (target.style.textShadow == 'var(--text-flashing) 0px 0px 1vh' ? 'black 0px 0px 1vh' : 'var(--text-flashing) 0px 0px 1vh');
    console.log(target.style.textShadow)
    target.style.color = (target.style.color == 'var(--text-visible-2)' ? 'var(--text-flashing)' : 'var(--text-visible-2)');
    console.log(target.style.color)
    console.log(target.style.textShadow)
    times++;
  }, 500);
}

// Listen for counter events:
socket.on('next', function(data) {
  console.log('[ -SVR ] Calling for "next" method. ID: ' + data.counterID)
  if (valid_counters.includes(data.counterID)) handleQueue(data.counterID);
});

socket.on('full-restart', function(data) {
  console.log("restarting(3/3)");

  for (i = 1; i <= 7; i++) {
    document.getElementById('customer_0' + i).innerHTML = '-';
  }
  arrayInit();

  counter_values = []

  // Effects:
  var audio = new Audio('assets/notification-restart.mp3');
  audio.play();
});

// Clock:
function formatDate(date) {
  var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var dayWeek = dayNames[date.getDay()];
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return 'Today is ' + dayWeek + ', ' + monthNames[monthIndex] + ' ' + day + ', ' + year;
}

document.getElementById('date').innerHTML = formatDate(new Date())
