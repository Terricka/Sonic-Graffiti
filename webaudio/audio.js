var sound = audioFileLoad("sounds/Nostalgia.mp3", function(sound){
  var gain = audioContext.createGain();
  gain.gain.value = 0.2;
  sound.connect(gain);
  gain.connect(audioContext.destination);
});

window.addEventListener("mousedown", function(){
  sound.play();
});

window.addEventListener("mouseup", function(){
  sound.stop();
});
