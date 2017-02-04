var audioContext = new AudioContext();
var playButton = $("#on-off");
var counter = 0;
var selectedWave;

var soundDirectory = "sounds/";

var audioBuffer;
var soundTime = 0;

function audioFileLoad(soundDirectory) {
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
    soundTime = playSound.buffer.duration;
    // playSound.loopStart = 2;
    // playSound.loop = true;
    playSound.connect(audioContext.destination);
    playSound.start(audioContext.currentTime + time ||
      audioContext.currentTime);
  };

  sounds.stop = function(time) {
    playSound.stop(audioContext.currentTime + time ||
      audioContext.currentTime, soundStart || 0, soundDuration ||
      sounds.playThis.duration);
  };

  return sounds;

}

function audioBatchLoad(obj) {
  for (var prop in obj) {
    obj[prop] = audioFileLoad(obj[prop]);
  }

  return obj;
}

var sounds = audioBatchLoad({

  kick: "sounds/drum.wav",
  hat: "sounds/hat.wav",


});

window.addEventListener("mousedown", function() {
  sounds.kick.play(0, 1, 3);
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



// $('.wave').each(function() {
//   $(this).click(function() {
//     $('.wave').each(function() {
//       $(this).removeClass("active-wave");
//     });
//     $(this).toggleClass("active-wave");
//     selectedWave = $(this).text();
//   });
// });

// window.onload = function() {
//
//
//   var onOff = $('#on-off');
//   var osc = false;
//
//   var freqSlider = $("#wave-range").val();
//   // console.log(freqSlider);
//
//   setInterval(function() {
//     if (!osc) {
//       // console.log("Oscillator stopped. Waiting...");
//     } else {
//       freqSlider = $("#wave-range").val();
//       osc.frequency.value = freqSlider;
//       osc.type = selectedWave;
//       // console.log("Oscillator playing on: " + freqSlider);
//     }
//   }, 50);
//
//   $(onOff).click(function() {
//     if (!osc) {
//
//       osc = audioContext.createOscillator();
//       osc.type = selectedWave;
//       osc.frequency.value = freqSlider;
//       osc.connect(audioContext.destination);
//       osc.start(audioContext.currentTime);
//
//       counter++;
//
//     } else {
//       osc.stop(audioContext.currentTime);
//       osc = false;
//       counter++;
//     }
//
//
//     if (counter % 2 === 0) {
//       $("#on-off .fa-stop").hide();
//       $(".fa-play").show();
//     } else {
//       $("#on-off .fa-stop").show();
//       $(".fa-play").hide();
//     }
//   });
//
//
//
// };
