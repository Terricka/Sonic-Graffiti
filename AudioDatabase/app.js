var express = require('express');
var app = express();
var fs = require("fs");

var Gpio = require('onoff').Gpio;
var leftPad = require('left-pad');
var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;

var MPR121 = require('node-picap');
var mpr121;

// correct address for the Pi Cap - other boards may vary
mpr121 = new MPR121('0x5C');

// set up LED
var gpioRed = new Gpio(6, 'out', 'none', {
  activeLow: true
});
var gpioGreen = new Gpio(5, 'out', 'none', {
  activeLow: true
});
var gpioBlue = new Gpio(26, 'out', 'none', {
  activeLow: true
});

function lightRGB(r, g, b) {
  gpioRed.writeSync(r);
  gpioGreen.writeSync(g);
  gpioBlue.writeSync(b);
}

function playFile(path) {
  execSync('aplay ' + path, {
    stdio: 'ignore'
  });
}

// convert MP3s to WAVs for easier playback - keep a blue LED on during this
lightRGB(0, 0, 1);
execSync('picap-samples-to-wav tracks', {
  stdio: 'inherit'
});
lightRGB(0, 0, 0);

// play an appropriate track when we detect a touch
mpr121.on('data', function(data) {
  data.forEach(function(electrode, i) {
    if (!electrode.isNewTouch) {
      return;
    }

    console.log('playing track: ' + i);

    var path = 'tracks/.wavs/TRACK' + leftPad(i, 3, 0) + '.wav';

    // keep a red LED on during playback
    lightRGB(1, 0, 0);
    playFile(path);
    lightRGB(0, 0, 0);
  });
});

// this allows us to exit the program via Ctrl+C while still exiting elegantly
process.on('SIGINT', function() {
  lightRGB(0, 0, 0);
  process.exit(0);
});


// REST database

app.get('/songs', function(req, res) {
  fs.readFile(__dirname + "/" + "test.json", 'utf8', function(err, data) {
    console.log(data);
    res.end(data);
  });
});

var user = {
  "user5": {
    "name": "wow",
    "password": "supa",
    "profession": "ok",
    "id": 5
  }
}

app.post('/addSongs', function(req, res) {
  // First read existing users.
  fs.readFile(__dirname + "/" + "test.json", 'utf8', function(err, data) {
    data = JSON.parse(data);
    data["user5"] = user["user5"];
    console.log(data);
    fs.writeFile(__dirname + "/" + "test.json", JSON.stringify(data),
      function(err) {
        if (err) {
          return console.log(err);
        }
      });
    res.end(JSON.stringify(data));
  });
})

var id = 2;

app.delete('/deleteSongs', function(req, res) {

  // First read existing users.
  fs.readFile(__dirname + "/" + "test.json", 'utf8', function(err, data) {
    data = JSON.parse(data);
    delete data["user" + 2];

    console.log(data);
    res.end(JSON.stringify(data));
  });
})

var server = app.listen(8081, function() {

  var host = server.address().address
  var port = server.address().port

  console.log(`Example app listening at http://${host}:${port}`, host, port)

});
