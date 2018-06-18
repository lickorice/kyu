// Open socket connection:
var socket = io.connect('http://localhost:2109')

// Handle DOM:
var customer_number_1 = document.getElementById('customer_01');
var customer_number_2 = document.getElementById('customer_02');
var customer_number_3 = document.getElementById('customer_03');
var customer_number_4 = document.getElementById('customer_04');
var customer_number_5 = document.getElementById('customer_05');
var customer_number_6 = document.getElementById('customer_06');

var queue_numbers = []

function arrayInit() {
  for (i = 0; i <= 79; i++) {
    queue_numbers.push(80 - i);
  }
}

placeholder_p.innerHTML = queue_numbers.join(' ');

// Listen for counter events:
socket.on('next', function(data) {
  console.log('[ -SVR ] Calling for "next" method.')
  switch (data.counterID) {
    case '001':
      checkEmpty(queue_numbers);
      nextinline = queue_numbers.pop();
      customer_number_1.innerHTML = nextinline;
      socket.emit('callback', {
        counterID: '001',
        counterServing: nextinline
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
      break;
    case '003':
      checkEmpty(queue_numbers);
      nextinline = queue_numbers.pop();
      customer_number_3.innerHTML = nextinline;
      socket.emit('callback', {
        counterID: '003',
        counterServing: nextinline
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
      break;
    case '005':
      checkEmpty(queue_numbers);
      nextinline = queue_numbers.pop();
      customer_number_5.innerHTML = nextinline;
      socket.emit('callback', {
        counterID: '005',
        counterServing: nextinline
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
      break;
    default:

  }

  function checkEmpty(array) {
    if (array === undefined || array.length == 0) {
      arrayInit();
    }
  }
})
