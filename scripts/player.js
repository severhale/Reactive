// Written by Simon Ever-Hale, October 2016


// reference to html5 audio element
var audioElement = null;
// tbh do not totally understand the whole javascript audio player layout but i know that you need this
var context;
// the module that tracks frequency levels
var analyser;
// how many frequency ranges do we want to keep track of
var numFreqs = 1024;
// where we're gonna save the frequency data
var frequencyData = new Uint8Array(numFreqs);
// reference to the data source (an audio file)
var source = null;

var localFile = true;

// in a function so we can call it with a button or keypress
var beginAudio = function () {
    // getting audio element, hooking it up to audio analyser and audio source, starting the song
    if (audioElement === null) {
      audioElement = document.getElementById("player");
      audioElement.crossOrigin = "anonymous";
      context = new(window.AudioContext || window.webkitAudioContext)();
      analyser = context.createAnalyser();
      analyser.fftSize = numFreqs * 2;
    }

    audioElement.load();

    audioElement.addEventListener("canplay", function(event) {

      if (localFile) {
          if (source === null) {
            source = context.createMediaElementSource(audioElement);
          }

          // audioElement.load();
      } else {
          navigator.getUserMedia({
                  audio: true
              },
              function (stream) {
                  source = context.createMediaStreamSource(stream);
              },
              function (e) {
                  alert('Error capturing audio.');
              }
          );
      }

      source.connect(analyser);
      analyser.connect(context.destination);
      audioElement.play();
    });
};

// pause audio
var pauseAudio = function () {
    audioElement.pause();
}

// resume audio
var resumeAudio = function () {
    audioElement.play();
}

// save analyser data into the parameter fData
var updateData = function () {
    if (analyser != null) {
        analyser.getByteFrequencyData(frequencyData);
    }
}
