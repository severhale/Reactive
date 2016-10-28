var easing = .9;
var scaling = 1 / 400;
var numLoops = 3;
var beginVisualization = function () {
    paper.install(window);
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paper.setup(canvas);

    var loops = [];
    var base = new Color(255, 0, 0, .2);
    base.saturation = .8;
    base.brightness = .8;
    for (var i = 0; i < numLoops; i++) {
        var loop = new Loop(50, 250);
        base.hue += 360 / numLoops;
        console.log(base.hue);
        loop.setColor(base.clone());
        loops.push(loop);
        console.log("Added loop");
    }

    var lastVols = [];
    var lastChanges = [];
    var lastBrightnesses = [];
    for (var i = 0; i < loops.length; i++) {
        lastVols.push(0);
        lastChanges.push(0);
        lastBrightnesses.push(0);
    }

    var binsPerLoop = frequencyData.length / loops.length;
    console.log("Bins per loop: " + binsPerLoop);

    view.onFrame = function (event) {
        updateData(frequencyData);

        for (var i = 0; i < loops.length; i++) {
            var vol = 0;
            for (var j = parseInt(i * binsPerLoop); j < i * binsPerLoop + binsPerLoop; j++) {
                vol += frequencyData[j];
            }
            vol = vol * scaling / binsPerLoop;
            var volChange = Math.min(Math.abs(vol - lastVols[i]) / (lastVols[i] + 1), .09);
            volChange = easing * volChange + (1 - easing) * lastChanges[i];
            loops[i].update(volChange);

            var brightness = vol / .7;
            brightness = .5 * brightness + .5 * lastBrightnesses[i];
            loops[i].setBrightness(brightness);
            //            loops[i].setSaturation(brightness);
            loops[i].setAlpha(brightness);

            lastChanges[i] = volChange;
            lastVols[i] = vol;
            lastBrightnesses[i] = brightness;
        }
    };
};