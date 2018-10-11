// Open socket connection:
var socket = io.connect('http://localhost:2109')

const valid_counters = ['001', '002', '003', '004', '005', '006', '007'];

var counter_values = [];
let queue_numbers = [];
let queue_numbers_2 = [];
let queue_numbers_others = [];

let videoArray = [];
let photoArray = [];
let cur_videoArray = [];
let cur_photoArray = [];

socket.on('load-data', function(data) {
  queue_numbers = data.current_array;
  queue_numbers_2 = data.current_array_2;
  queue_numbers_others = data.current_array_others;

  for (i = 1; i <= 7; i++) {
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

  videoArray = data.video_array.slice();
  cur_videoArray = data.video_array.slice();
  photoArray = data.photo_array.slice();
  cur_photoArray = data.photo_array.slice();

  // FIT TO SCROLLBAR:
  document.getElementById('scrolling').innerHTML = data.scroll_text
});

function arrayInit() {
  queue_numbers = []
  queue_numbers_2 = []
  queue_numbers_others = []
  for (i = 0; i <= 79; i++) {
    queue_numbers.push(80 - i);
  }
  for (i = 0; i <= 79; i++) {
    queue_numbers.push(280 - i);
  }
  for (i = 0; i <= 49; i++) {
    queue_numbers_others.push(150 - i);
  }
  socket.emit('save-array', {
    array: queue_numbers
  })
  socket.emit('save-array-2', {
    array: queue_numbers_2
  })
  socket.emit('save-array-others', {
    array: queue_numbers_others
  })
}

function arrayInitMain() {
  queue_numbers = []
  for (i = 0; i <= 79; i++) {
    queue_numbers.push(80 - i);
  }
  socket.emit('save-array', {
    array: queue_numbers
  })
}

function arrayInitMain2() {
  queue_numbers_2 = []
  for (i = 0; i <= 79; i++) {
    queue_numbers_2.push(280 - i);
  }
  socket.emit('save-array-22', {
    array: queue_numbers_2
  })
}

function arrayInitOthers() {
  queue_numbers_others = []
  for (i = 0; i <= 49; i++) {
    queue_numbers_others.push(150 - i);
  }
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

  // Photo controls:
  var photo_1 = document.getElementById('image1');
  var photo_2 = document.getElementById('image2');
  var photo_3 = document.getElementById('image3');
  var photo_4 = document.getElementById('image4');

  function changePhoto(photoElement) {
    if (cur_photoArray === undefined || cur_photoArray.length == 0) {
      cur_photoArray = photoArray.slice();
      photoElement.src = "shared/photos/sample-2.png";
    } else {
    photoElement.src = "shared/photos/" + cur_photoArray.pop();
    }
  }

  setInterval(function(){
    changePhoto(photo_2);
  }, 6000);
  setInterval(function(){
    changePhoto(photo_3);
  }, 7000);
  setInterval(function(){
    changePhoto(photo_4);
  }, 8000);
}

// on ping confirmation:
socket.on('server-confirm', function(data) {
  cID = data.counterID.substr(data.counterID.length - 1);
  csts = document.getElementById('counter_sts_' + cID);
  csts.innerHTML = 'NOW SERVING';
  csts.style.color = "#3cd763";
  document.getElementById('customer_0' + cID).style.color = "var(--text-visible-2-1)";
  if (!counter_values[parseInt(cID) - 1]) document.getElementById('customer_0' + cID).innerHTML = '-';
  else document.getElementById('customer_0' + cID).innerHTML = counter_values[parseInt(cID) - 1];
});

function checkEmpty(array) {
  if (array === undefined || array.length == 0) {
    arrayInitMain();
  }
}

function checkEmpty2(array) {
  if (array === undefined || array.length == 0) {
    arrayInitMain2();
  }
}

function checkEmptyOthers(array) {
  if (array === undefined || array.length == 0) {
    arrayInitOthers();
  }
}

function handleQueue(counterID) {
  console.log(queue_numbers_2)
  if (counterID == '007') {
    checkEmptyOthers(queue_numbers_others);
    var nextinline = queue_numbers_others.pop();
  } else if (counterID == '003' || counterID == '004') {
    checkEmpty2(queue_numbers_2);
    var nextinline = queue_numbers_2.pop();
  } else {
    checkEmpty(queue_numbers);
    var nextinline = queue_numbers.pop();
  }

  cID = counterID.substr(counterID.length - 1);
  document.getElementById('customer_0' + cID).innerHTML = nextinline;

  counter_values[parseInt(cID) - 1] = nextinline;

  document.getElementById("overlaycounter").innerHTML = "Counter " + cID;

  var overlayNum = $("#overlaynumber")
  var overlayCnr = $("#overlaycounter")

  socket.emit('callback', {
    counterID: counterID,
    counterServing: nextinline
  });
  socket.emit('save-counter', {
    counterID: counterID,
    current_customer: nextinline
  })
  if (counterID == '007') {
    socket.emit('save-array-others', {
      array: queue_numbers_others
    });
  } else if (counterID == '003' || counterID == '004') {
    socket.emit('save-array-2', {
      array: queue_numbers_2
    });
  } else {
    socket.emit('save-array', {
      array: queue_numbers
    });
  }

    console.log(nextinline)
  // Effects:
  // Lower volume
  var videoPlayerJ = $('#videoPlayer')
  var overlayJ = $('#overlay')
  var overlaytextJ = $('#overlaytext')
  videoPlayerJ.queue(function(n){
    $('#overlaynumber').html(nextinline);
    $('#overlaycounter').html("Counter " + cID);
    n();
  }).animate({
    volume: 0.2
  }, 1000).delay(2000);
  overlayJ.animate({
    'background-color': 'rgba(0, 0, 0, 0.9)'
  }, 1000).delay(2000)
  overlaytextJ.animate({
    'color': 'rgba(255, 255, 255, 1.0)'
  }, 1000).delay(2000)
  // Play sfx
  var audio = new Audio('assets/notification.mp3');
  audio.play();

  var target = document.getElementById('customer_0' + cID)
  var times = 0
  var flasher = setInterval(function() {
    if (times == 5) clearInterval(flasher);
    target.style.textShadow = (target.style.textShadow == 'var(--text-flashing) 0px 0px 1vh' ? 'black 0px 0px 1vh' : 'var(--text-flashing) 0px 0px 1vh');
    target.style.color = (target.style.color == 'var(--text-visible-2-1)' ? 'var(--text-flashing)' : 'var(--text-visible-2-1)');
    times++;
  }, 500);

  videoPlayerJ.animate({
    volume: 1.0
  }, 1000);
  overlayJ.animate({
    'background-color': 'rgba(0, 0, 0, 0)'
  }, 1000)
  overlaytextJ.animate({
    'color': 'rgba(255, 255, 255, 0.0)'
  }, 1000)
}

function alertQueue(counterID) {

  cID = counterID.substr(counterID.length - 1);
  cust_number = counter_values[parseInt(cID) - 1]

  document.getElementById("overlaynumber").innerHTML = cust_number;
  document.getElementById("overlaycounter").innerHTML = "Counter " + cID;

  // Effects:
  // Lower volume
  var videoPlayerJ = $('#videoPlayer')
  var overlayJ = $('#overlay')
  var overlaytextJ = $('#overlaytext')
  videoPlayerJ.animate({
    volume: 0.2
  }, 1000).delay(2000);
  overlayJ.animate({
    'background-color': 'rgba(0, 0, 0, 0.9)'
  }, 1000).delay(2000)
  overlaytextJ.animate({
    'color': 'rgba(255, 255, 255, 1.0)'
  }, 1000).delay(2000)
  // Play sfx
  var audio = new Audio('assets/notification.mp3');
  audio.play();

  var target = document.getElementById('customer_0' + cID)
  var times = 0
  var flasher = setInterval(function() {
    if (times == 5) clearInterval(flasher);
    target.style.textShadow = (target.style.textShadow == 'var(--text-flashing) 0px 0px 1vh' ? 'black 0px 0px 1vh' : 'var(--text-flashing) 0px 0px 1vh');
    target.style.color = (target.style.color == 'var(--text-visible-2-1)' ? 'var(--text-flashing)' : 'var(--text-visible-2-1)');
    times++;
  }, 500);

  videoPlayerJ.animate({
    volume: 1.0
  }, 1000);
  overlayJ.animate({
    'background-color': 'rgba(0, 0, 0, 0)'
  }, 1000)
  overlaytextJ.animate({
    'color': 'rgba(255, 255, 255, 0.0)'
  }, 1000)
}

// Listen for counter events:
socket.on('next', function(data) {
  if (valid_counters.includes(data.counterID)) handleQueue(data.counterID);
});

socket.on('repeat', function(data) {
  if (valid_counters.includes(data.counterID)) alertQueue(data.counterID);
});

socket.on('full-restart', function(data) {

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
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dayWeek = dayNames[date.getDay()];
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return 'Today is ' + dayWeek + ', ' + monthNames[monthIndex] + ' ' + day + ', ' + year;
}

document.getElementById('date').innerHTML = formatDate(new Date())

// Video controls:
var videoPlayer = document.getElementById('videoPlayer');
videoPlayer.onended = function() {
  if (cur_videoArray === undefined || cur_videoArray.length == 0) {
    cur_videoArray = videoArray.slice();
    videoPlayer.src = "shared/default/SMPI.mov";
  } else {
    videoPlayer.src = "shared/videos/" + cur_videoArray.pop();
  }
}
