// Written by Simon Ever-Hale, October 2016


// easing constant for smoothing movement of loops
var easing = .9;
// scaling constant for slowing movement of loops
var scaling = 1 / 400;
// number of loops
var numLoops = 3;

// put it all in a function so it can be triggered by a button or a key press
var beginVisualization = function () {
    // initializing paper.js
    paper.install(window);
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paper.setup(canvas);

    // constructing a color pallete and assinging each loop a color
    var loops = [];
    var base = new Color(255, 0, 0, .2);
    base.saturation = .8;
    base.brightness = .8;
    for (var i = 0; i < numLoops; i++) {
        // create new loop. first parameter is number of points in the loop, second is how smooth it is
        var loop = new Loop(50, 250);
        // all loops have same saturation and brightness, but evenly spaced hue
        base.hue += 360 / numLoops;
        loop.setColor(base.clone());
        loops.push(loop);
    }

    // save array of all previous states so that we can find the differences
    // lastBrightnesses are saved so that there can be brightness and opacity smoothing, otherwise it would look like a strobe light
    // lastChanges is saved for same reason - smoothing of volume changes to prevent jerkiness
    var lastVols = [];
    var lastChanges = [];
    var lastBrightnesses = [];
    var smoothedVols = [];
    var lastIndices = [];

    // add one value to each array for each loop (visual loop blob thing, not iteration of the for-loop. i know that will get confusing - poor naming on my part)
    for (var i = 0; i < loops.length; i++) {
        lastVols.push(0);
        lastChanges.push(0);
        lastBrightnesses.push(0);
        smoothedVols.push(0);
        lastIndices.push(i / loops.length * frequencyData.length);
    }
    lastIndices.push(frequencyData.length);

    var binIndices = function (data, n) {
        var total = data.reduce(function (a, b) {
            return a + b;
        });
        var indices = [];
        for (var i = 0; i < n + 1; i++) {
            indices.push(0);
        }
        var currSum = 0;
        var currIndex = 1;
        for (var i = 0; i < data.length; i++) {
            currSum += data[i];
            if (currSum > currIndex / n * total) {
                indices[currIndex] = i;
                currIndex++;
            }
        }
        indices[n] = data.length;
        return indices;

        //        return [0, 100, 300, 1024];
    };

    view.onFrame = function (event) {
        // call player.js updateData function so that frequencyData will have new frequency data
        updateData();

        var indices = binIndices(frequencyData, loops.length);
        //        if (indices.length !== 4) {
        console.log(lastIndices);
        //        }

        for (var i = 0; i < loops.length; i++) {
            indices[i + 1] = .9 * indices[i + 1] + .1 * lastIndices[i + 1];
            //            console.log(indices[i + 1]);
            var vol = 0;

            // sum all frequencies which correspond to this loop
            var numBins = 0;
            for (var j = parseInt(indices[i]); j < indices[i + 1]; j++) {
                vol += frequencyData[j];
                numBins++;
            }

            if (numBins === 0) {
                numBins = 1;
            }

            // multiply by scaling constant and divide by binsPerLoop to find average
            vol = vol * scaling / numBins;
            //            console.log(vol);
            //            vol = vol * scaling;


            var volChange = Math.min(Math.abs(vol - lastVols[i]) / (lastVols[i] + .55), .09);

            // experiment: makes it a little more jerky but maybe feels more responsive to music. not using for now
            // idea was to de-emphasize times when volume gets quieter and emphasize times where volume increases
            //            var vDif = vol - lastVols[i];
            //            var volChange = Math.min((.75 * Math.abs(vDif) + .25 * vDif) / (lastVols[i] + 1), .09);

            // use last changes and easing constant to smooth volume change and make it more similar to previous values
            volChange = easing * volChange + (1 - easing) * lastChanges[i];

            // smooth volume over time so it's not jerky
            var newVol = .05 * vol + (1 - .05) * smoothedVols[i];

            // pass volume change to loop as parameter for its next movement
            if (i === loops.length - 1) {
                //                console.log(newVol);
            }
            loops[i].update(volChange, newVol, .55, new Point(view.size.width * (i + 1) / (loops.length + 1), view.size.height / 2));
            //            loops[i].update(volChange, newVol, .55, new Point(view.size.width / 2, view.size.height / 2));

            // gross hard coded thing to find brightness proportional to volume
            var brightness = vol / .7;

            // serious brightness smoothing to prevent strobe effect
            brightness = .5 * brightness + .5 * lastBrightnesses[i];

            loops[i].setBrightness(brightness);
            loops[i].setAlpha(brightness + .1);

            lastChanges[i] = volChange;
            lastVols[i] = vol;
            lastBrightnesses[i] = brightness;
            smoothedVols[i] = newVol;
        }
        lastIndices = indices;
    };
};