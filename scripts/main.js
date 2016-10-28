window.onload = function () {
    var playing = false;
    var button = document.getElementById("play");

    var begin = function () {
        beginAudio();
        beginVisualization();
        button.parentElement.className = "hidden";
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