window.onload = function () {
    var button = document.getElementById("play");
    button.onclick = function () {
        beginAudio();
        beginVisualization();
        button.className = "hidden"
    }
};