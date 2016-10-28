window.onload = function () {
    var playing = false;
    var button = document.getElementById("play");

    var begin = function () {
        if (!playing) {
            beginAudio();
            beginVisualization();
            button.parentElement.className = "hidden";
            button.disabled = true;
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

    document.onkeypress = function () {
        if ((event.which || event.keyCode) == 32) {
            begin();
        }
    }
    button.onclick = function () {
        begin();
    }
};