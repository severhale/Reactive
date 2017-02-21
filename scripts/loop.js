// Written by Simon Ever-Hale, October 2016


var Loop = function (numPoints, smoothness) {

    // define two seeds which determine exactly what the shape of the loop will be
    var xSeed = Math.random() * 1000 - 500;
    var ySeed = Math.random() * 1000 - 500;

    var rad = 75;

    // creating actual paper.js shape for this loop
    var path = new Path();
    path.fillColor = new Color(0, 0, 0, .5);
    path.closed = true;

    // get the ith point in the path
    function getPoint(i, numPoints) {
        // this is dependent on a function i wrote calle periodicNoise, defined in perlin.js
        // basically allows to generate a set of perlin-noise based values which end up at the same place they started smoothly
        var x = view.size.width * noise.periodicNoise(i / smoothness, xSeed, numPoints / smoothness);
        var y = view.size.height * noise.periodicNoise(i / smoothness, ySeed, numPoints / smoothness);
        return new Point(x, y);
    }

    function init() {
        for (var i = 0; i < numPoints; i++) {
            path.add(getPoint(i, numPoints));
        }
        path.smooth();
    }

    // gotta call the init function otherwise there will be no points in the path
    init();

    // update by amount. larger amount is, the more the loop will change
    function update(amount, volume, maxVolume, basePos) {
        // we change xSeed and ySeed by amount. that means that the next time we generate the loop
        // the seed parameters for the noise function will be slightly different, and so the loop will be slightly different.
        // this is how you get smooth movement of the loops over time
        xSeed += amount;
        ySeed += amount;
        var t = Math.min(volume / maxVolume, 1);
        for (var i = 0; i < numPoints; i++) {
            var angle = i / numPoints * 2 * Math.PI;
            // re-generate each point in the path
            path.segments[i].point = getPoint(i, numPoints).multiply(t).add(new Point(basePos.x + rad * Math.cos(angle), basePos.y + rad * Math.sin(angle)).multiply(1 - t));
        }
        // smooth the path to make it real nice.
        path.smooth();
    }

    // set color (paper.js color object)
    function setColor(color) {
        path.fillColor = color;
    }

    // set brightness
    function setBrightness(brightness) {
        path.fillColor.brightness = brightness;
    }

    // set sasturation
    function setSaturation(saturation) {
        path.fillColor.saturation = saturation;
    }

    // set opacity (alpha)
    function setAlpha(alpha) {
        path.fillColor.alpha = alpha;
    }

    // returning references to all the functions that modify this loop
    return {
        update: update,
        setColor: setColor,
        setBrightness: setBrightness,
        setSaturation: setSaturation,
        setAlpha: setAlpha
    }
};