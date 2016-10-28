var easing = .9;
var scaling = 1 / 400;
var numLoops = 3;
window.onload = function () {
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

    //    var lastVol = 0;
    //    var lastChange = 0;
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
        analyser.getByteFrequencyData(frequencyData);

        for (var i = 0; i < loops.length; i++) {
            var vol = 0;
            for (var j = parseInt(i * binsPerLoop); j < i * binsPerLoop + binsPerLoop; j++) {
                vol += frequencyData[j];
            }
            vol = vol * scaling / binsPerLoop;
            var volChange = Math.min(Math.abs(vol - lastVols[i]), .09);
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

        //        var avg = 0;
        //        for (var i = 0; i < frequencyData.length; i++) {
        //            avg += frequencyData[i];
        //        }
        //        avg /= frequencyData.length;
        //        var vol = avg * scaling;
        //        //        var volChange = Math.abs(vol - lastVol) / (lastVol + 1);
        //        //        var volChange = Math.min(Math.abs(vol - lastVol), 20);
        //        var volChange = Math.min(Math.abs(vol - lastVol) / (lastVol + 1), 10);
        //        volChange = easing * volChange + (1 - easing) * lastChange;
        //
        //        for (var i = 0; i < loops.length; i++) {
        //            loops[i].update(volChange);
        //        }
        //
        //        lastChange = volChange;
        //        lastVol = vol;
    };
};