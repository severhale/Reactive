// Written by Simon Ever-Hale, October 2016


// only run this code once the entire window is loaded
window.onload = function () {
    var button = document.getElementById("play");

    var backButton = document.getElementById("back");

    var begin = function () {
        if (!playing) {
            var songFile = document.getElementById("song_upload");
            if (songFile.files.length > 0) {
              var selectedFile = songFile.files[0];
              var fileUrl = URL.createObjectURL(selectedFile);
              document.getElementById("player").src = fileUrl;
              console.log(fileUrl);
            }

            beginAudio();
            beginVisualization();
            playing = true;

            // show back button
            backButton.className = "";
            backButton.disabled = false;

            // once we start playing, want to get rid of splash screen and allow playing and pausing with space bar
            button.parentElement.className = "hidden";
            button.disabled = true;
            // overwriting onkeypress function to pause and resume rather than begin
            document.onkeypress = function (event) {
                if ((event.which || event.keyCode) == 32) {
                    if (playing) {
                        pauseAudio();
                    } else {
                        resumeAudio();
                    }
                    playing = !playing;
                }
            }
        }
    };

    // initially, want audio to begin on space bar
    document.onkeypress = function () {
        if ((event.which || event.keyCode) == 32) {
            begin();
        }
    }

    // setting button to start visualization
    button.onclick = function () {
        begin();
    }

    // stop playing and show splash screen
    backButton.onclick = function() {
      console.log("Button clicked");
      playing = false;
      pauseAudio();
      backButton.disabled = true;
      backButton.className = "hidden";

      button.disabled = false;
      button.parentElement.className = "";
    }
};
