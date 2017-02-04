var audioContext = new AudioContext();
var playButton = $("#play-button");
var counter = 0;
var selectedWave;

var audioBuffer;
var getSound = new XMLHttpRequest();

getSound.open("get", "sounds/hat.wav", true);
getSound.responseType = "arraybuffer";

getSound.onload = function() {
  audioContext.decodeAudioData(getSound.response, function(buffer) {
    audioBuffer = buffer;
  });
};

getSound.send();

function playback() {
  var playSound = audioContext.createBufferSource();
  playSound.buffer = audioBuffer;
  playSound.connect(audioContext.destination);
  playSound.start(audioContext.currentTime);
}

window.addEventListener("mousedown", playback);



$('.wave').each(function() {
  $(this).click(function() {
    $('.wave').each(function() {
      $(this).removeClass("active-wave");
    });
    $(this).toggleClass("active-wave");
    selectedWave = $(this).text();
  });
});

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
