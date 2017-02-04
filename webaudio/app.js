var bodyParser = require('body-parser');
var express = require("express");
var app = express();
var port = 8000;
var url = 'localhost';
var server = app.listen(port);
var io = require("socket.io").listen(server);
// var SerialPort = require("serialport");
// var port = new SerialPort("/dev/ttyUSB0", {
//   baudRate: 115200,
//   parser: SerialPort.parsers.readline("\n")
// });

app.use(express.static(__dirname + '/'));
console.log('Simple static server listening at ' + url + ':' + port);

// socket.io stuff
io.sockets.on('connection', function(socket) {
  socket.on('news', function(data) {
    console.log(data);
    socket.emit('news', {
      hello: data
    });

  });
});

io.sockets.on('connection', function(socket) {

  // port.on('data', function(data) {
  //
  //   // console.log(data);
  //   result = data.split('\n');
  //
  //
  //   // console.log("Success")
  //
  //   socket.emit('connection', function(data) {
  //     //console.log(result);
  //   });
  //
  //   socket.emit('led', {
  //     value: result[0]
  //   });
  //
  //   //io.sockets.emit('led', {value: result[0]});
  //
  // });
  //
  //
  // socket.on('column1color', function(data) {
  //
  //
  // });



});

io.sockets.on('connection', function(socket) {
  console.log('A client is connected!');
});

io.sockets.on('connection', function(socket) {
  socket.emit('message', 'You are connected!');
  // port.on('data', function(data) {
  //   // socket.emit
  // })
});


// port.on('error', function(err) {
//   console.log('Error: ', err.message);
// });
