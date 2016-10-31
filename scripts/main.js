// Written by Simon Ever-Hale, October 2016


// only run this code once the entire window is loaded
window.onload = function () {
    var playing = false;
    var button = document.getElementById("play");

    var begin = function () {
        if (!playing) {
            beginAudio();
            beginVisualization();

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
};