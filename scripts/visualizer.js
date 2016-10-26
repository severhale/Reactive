var easing = .9;
var scaling = 1 / 400;

window.onload = function () {
    paper.install(window);
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paper.setup(canvas);

    var loops = [];
    for (var i = 0; i < 10; i++) {
        var loop = new Loop(25, 250);
        loop.setColor(new Color(0, 0, 0, Math.random() * .5));
        loops.push(loop);
    }

    var lastVol = 0;
    var lastChange = 0;
    view.onFrame = function (event) {
        analyser.getByteFrequencyData(frequencyData);
        var avg = 0;
        for (var i = 0; i < frequencyData.length; i++) {
            avg += frequencyData[i];
        }
        avg /= frequencyData.length;
        var vol = avg * scaling;
        //        var volChange = Math.abs(vol - lastVol) / (lastVol + 1);
        var volChange = Math.min(Math.abs(vol - lastVol), 20);
        volChange = easing * volChange + (1 - easing) * lastChange;

        for (var i = 0; i < loops.length; i++) {
            loops[i].update(volChange);
        }

        lastChange = volChange;
        lastVol = vol;
    };
};