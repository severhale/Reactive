var audioElement = document.getElementById("player");
var volumeDisplay = document.getElementById("volume");
var context = new(window.AudioContext || window.webkitAudioContext)();
var analyser = context.createAnalyser();
analyser.frequencyBinCount = 2;
var frequencyData = new Uint8Array(analyser.frequencyBinCount);

audioElement.addEventListener("canplay", function () {
    var source = context.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(context.destination);
    audioElement.play();
});