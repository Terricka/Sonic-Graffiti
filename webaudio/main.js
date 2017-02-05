var audioContext = new AudioContext();
var playButton = $("#on-off");
var counter = 0;
var selectedWave;

var soundDirectory = "sounds/";

var audioBuffer;

$(function() {
  var nextBeat = audioContext.currentTime;
  var counter = 1;
  var tempo = 120;
  var osc = audioContext.createOscillator();
  var metroVol = audioContext.createGain();
  timerID = undefined;
  isPlaying = false;

  var drum = audioFileLoad("sounds/drum.wav");
  var hat = audioFileLoad("sounds/hat.wav");

  var drumTrack = [];
  var hatTrack = [];

  function playSchedule(trackArray, sound, count, time) {
    for (var i = 0; i < trackArray.length; i++) {
      if (count === trackArray[i]) {
        sound.play(time);
      }
    }
  }

  function metronome(time, playing) {
    if (playing) {

      osc = audioContext.createOscillator();
      osc.connect(metroVol);
      metroVol.connect(audioContext.destination);
      if (counter === 1) {
        osc.frequency.value = 500;
      } else {
        osc.frequency.value = 300;
      }

      osc.start(time);
      osc.stop(time + 0.1);

    }

  }

  function schedule() {
    if (nextBeat < audioContext.currentTime + 0.1) {
      metronome(nextBeat, true);

      playSchedule(drumTrack, drum, counter, nextBeat - audioContext.currentTime);
      playSchedule(hatTrack, hat, counter, nextBeat - audioContext.currentTime);

      playBeat();
    }
    timerID = window.setTimeout(schedule, 0);
  }

  // schedule();

  function play() {
    isPlaying = !isPlaying;

    if (isPlaying) {
      counter = 1;
      nextBeat = audioContext.currentTime;
      schedule();
    } else {
      window.clearTimeout(timerID);
    }
  }

  for (var i = 1; i <= 4; i++) {
    var grid = $(".app-grid");
    $(grid).append("<div class='track-" + i + "-container'></div>");
    for (var j = 1; j < 17; j++) {
      $(".track-" + i + "-container").append(
        "<div class='grid-item track-step step-" + j + "'></div>");
    }
  }

  function sequenceGrid(domEle, arr) {
    $(domEle).on("mousedown", ".grid-item", function() {
      // get index of grid item
      var gridIndex = $(this).index();
      console.log(gridIndex);
      // add one at start instead of 0
      var offset = gridIndex + 1;
      // checks if value is in array
      var index = arr.indexOf(offset);

      if (index > -1) {
        arr.splice(index, 1);
        // set color to default
        $(this).css("background-color", "");
      } else {
        // if item doesn exist
        arr.push(offset);

        $(this).css("background-color", "purple");
      }

    });
  }

  sequenceGrid(".track-1-container", drumTrack);
  sequenceGrid(".track-2-container", hatTrack);

  $(".play-stop-button").on("click", function() {
    play();
  });

  function playBeat() {
    var secs = 60 / tempo;
    var counterTime = (secs / 4);
    counter++;
    nextBeat += counterTime;
    if (counter > 16) {
      counter = 1;
    }
  }

  $("#metronome").on("click", function() {
    if (metroVol.gain.value) {
      metroVol.gain.value = 0;
    } else {
      metroVol.gain.value = 1;
    }
  });

  $("#tempo").on("change", function() {
    tempo = this.value;
    $("#showTempo").html(tempo);
  });



});

function audioFileLoad(soundDirectory, callback) {
  var sounds = {};
  var playSound = undefined;
  var getSound = new XMLHttpRequest();
  sounds.soundDirectory = soundDirectory;
  getSound.open("GET", sounds.soundDirectory, true);
  getSound.responseType = "arraybuffer";
  getSound.onload = function() {
    audioContext.decodeAudioData(getSound.response, function(buffer) {
      sounds.playThis = buffer;
    });
  };

  getSound.send();

  sounds.play = function(time, soundStart, soundDuration) {
    playSound = audioContext.createBufferSource();
    playSound.buffer = sounds.playThis;
    // playSound.connect(audioContext.destination);
    playSound.start(audioContext.currentTime + time ||
      audioContext.currentTime);
    // callback(playSound);

    if (typeof callback === "function") {
      return callback(playSound);
    } else {
      return playSound.connect(audioContext.destination);
    }

  };

  sounds.stop = function(time, setStart, setDuration) {
    playSound.stop(audioContext.currentTime + time ||
      audioContext.currentTime);
  };

  return sounds;

}

function audioBatchLoad(obj) {
  var callback;
  var prop;

  for (prop in obj) {
    if (typeof obj[prop] === "function") {
      callback = obj[prop];
      delete obj[prop];
    }
  }

  for (prop in obj) {
    obj[prop] = audioFileLoad(obj[prop], callback);
  }

  return obj;
}

var sounds = {

  kick: "sounds/drum.wav",
  hat: "sounds/hat.wav",
  nos: "sounds/Nostalgia.mp3",
  nodeGraph: function nodeGraph(sound) {
    var gain = audioContext.createGain();
    gain.gain.value = 1;
    sound.connect(gain);
    gain.connect(audioContext.destination);
  }


};

var sound = audioBatchLoad(sounds);

window.addEventListener("mousedown", function() {
  sounds.kick.play();
});

// var getSound = new XMLHttpRequest();
// sounds.fileDirectory = soundDirectory;
//
//
// getSound.open("get", sounds.soundDirectory, true);
// getSound.responseType = "arraybuffer";
//
// getSound.onload = function() {
//   audioContext.decodeAudioData(getSound.response, function(buffer) {
//     audioBuffer = buffer;
//   });
// };
//
// getSound.send();
//
// function playback() {
//   var playSound = audioContext.createBufferSource();
//   playSound.buffer = audioBuffer;
//   playSound.connect(audioContext.destination);
//   playSound.start(audioContext.currentTime);
// }
//
// window.addEventListener("mousedown", playback);
