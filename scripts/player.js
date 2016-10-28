var audioElement;
var volumeDisplay;
var context;
var analyser;
var numBins = 16;
var frequencyData = new Uint8Array(numBins);
var source = null;


var beginAudio = function () {
    audioElement = document.getElementById("player");
    volumeDisplay = document.getElementById("volume");
    context = new(window.AudioContext || window.webkitAudioContext)();
    analyser = context.createAnalyser();
    analyser.fftSize = numBins * 2;

    source = context.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(context.destination);
    audioElement.load();
    audioElement.play();
};

var updateData = function (fData) {
    if (analyser != null) {
        analyser.getByteFrequencyData(fData);
    }
}