// Open socket connection:
var socket = io.connect('http://localhost:2109')

// Handle DOM:
var customer_number_1 = document.getElementById('customer_01');
var customer_number_2 = document.getElementById('customer_02');
var customer_number_3 = document.getElementById('customer_03');
var customer_number_4 = document.getElementById('customer_04');
var customer_number_5 = document.getElementById('customer_05');
var customer_number_6 = document.getElementById('customer_06');
var customer_number_7 = document.getElementById('customer_07');

var counter_values = []

socket.on('load-data', function(data) {
  console.log(data);
  queue_numbers = data.current_array;

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
  for (i = 0; i <= 79; i++) {
    queue_numbers.push(80 - i);
  }
  socket.emit('save-array', {
    array: queue_numbers
  })
}

function refresh() {
  for (i = 1; i <= 7; i++) {
    csts = document.getElementById('counter_sts_' + i);
    csts.innerHTML = 'CLOSED';
    csts.style.color = "#8a1c1c";
    document.getElementById('customer_0' + i).style.color = "rgb(70, 70, 70)"
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
  socket.emit('connection-ping', {})
}
socket.on('server-confirm', function(data) {
  cID = data.counterID.substr(data.counterID.length - 1);
  csts = document.getElementById('counter_sts_' + cID);
  csts.innerHTML = 'NOW SERVING';
  csts.style.color = "#3cd763";
  document.getElementById('customer_0' + cID).style.color = "#cdcdcd";
  if(!counter_values[parseInt(cID) - 1]) document.getElementById('customer_0' + cID).innerHTML = '-';
  else document.getElementById('customer_0' + cID).innerHTML = counter_values[parseInt(cID) - 1];
});

// Listen for counter events:
socket.on('next', function(data) {
  console.log('[ -SVR ] Calling for "next" method. ID: ' + data.counterID)
  switch (data.counterID) {
    case '001':
      checkEmpty(queue_numbers);
      nextinline = queue_numbers.pop();
      customer_number_1.innerHTML = nextinline;
      socket.emit('callback', {
        counterID: '001',
        counterServing: nextinline
      });
      socket.emit('save-counter', {
        counterID: data.counterID,
        current_customer: nextinline
      })
      counter_values[0] = nextinline
      socket.emit('save-array', {
        array: queue_numbers
      });
      break;
    case '002':
      checkEmpty(queue_numbers);
      nextinline = queue_numbers.pop();
      customer_number_2.innerHTML = nextinline;
      socket.emit('callback', {
        counterID: '002',
        counterServing: nextinline
      });
      socket.emit('save-counter', {
        counterID: data.counterID,
        current_customer: nextinline
      })
      counter_values[1] = nextinline
      socket.emit('save-array', {
        array: queue_numbers
      });
      break;
    case '003':
      checkEmpty(queue_numbers);
      nextinline = queue_numbers.pop();
      customer_number_3.innerHTML = nextinline;
      socket.emit('callback', {
        counterID: '003',
        counterServing: nextinline
      });
      socket.emit('save-counter', {
        counterID: data.counterID,
        current_customer: nextinline
      })
      counter_values[2] = nextinline
      socket.emit('save-array', {
        array: queue_numbers
      });
      break;
    case '004':
      checkEmpty(queue_numbers);
      nextinline = queue_numbers.pop();
      customer_number_4.innerHTML = nextinline;
      socket.emit('callback', {
        counterID: '004',
        counterServing: nextinline
      });
      socket.emit('save-counter', {
        counterID: data.counterID,
        current_customer: nextinline
      })
      counter_values[3] = nextinline
      socket.emit('save-array', {
        array: queue_numbers
      });
      break;
    case '005':
      checkEmpty(queue_numbers);
      nextinline = queue_numbers.pop();
      customer_number_5.innerHTML = nextinline;
      socket.emit('callback', {
        counterID: '005',
        counterServing: nextinline
      });
      socket.emit('save-counter', {
        counterID: data.counterID,
        current_customer: nextinline
      })
      counter_values[4] = nextinline
      socket.emit('save-array', {
        array: queue_numbers
      });
      break;
    case '006':
      checkEmpty(queue_numbers);
      nextinline = queue_numbers.pop();
      customer_number_6.innerHTML = nextinline;
      socket.emit('callback', {
        counterID: '006',
        counterServing: nextinline
      });
      socket.emit('save-counter', {
        counterID: data.counterID,
        current_customer: nextinline
      })
      counter_values[5] = nextinline
      socket.emit('save-array', {
        array: queue_numbers
      });
      break;
    case '007':
      checkEmpty(queue_numbers);
      nextinline = queue_numbers.pop();
      customer_number_7.innerHTML = nextinline;
      socket.emit('callback', {
        counterID: '007',
        counterServing: nextinline
      });
      socket.emit('save-counter', {
        counterID: data.counterID,
        current_customer: nextinline
      })
      counter_values[6] = nextinline
      socket.emit('save-array', {
        array: queue_numbers
      });
      break;
    default:
      socket.emit('save-array', {
        array: queue_numbers
      })
      break;

  }

  function checkEmpty(array) {
    if (array === undefined || array.length == 0) {
      arrayInit();
    }
  }
})

socket.on('full-restart', function(data) {
  console.log("restarting(3/3)");

  for (i = 1; i <= 7; i++) {
    document.getElementById('customer_0' + i).innerHTML = '-';
  }
  arrayInit();

  counter_values = []
});
