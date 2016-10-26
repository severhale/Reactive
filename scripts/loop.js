var Loop = function (numPoints, smoothness) {

    var xSeed = Math.random() * 1000 - 500;
    var ySeed = Math.random() * 1000 - 500;

    var path = new Path();
    path.fillColor = new Color(0, 0, 0, .5);
    path.closed = true;

    function getPoint(i, numPoints) {
        var x = view.size.width * noise.periodicNoise(i / smoothness, xSeed, numPoints / smoothness);
        var y = view.size.height * noise.periodicNoise(i / smoothness, ySeed, numPoints / smoothness);
        return new Point(x, y);
    }

    function init() {
        for (var i = 0; i < numPoints; i++) {
            path.add(getPoint(i, numPoints));
        }
        //        path.add(path.segments[0].point);
        path.smooth();
    }

    init();

    function update(amount) {
        xSeed += amount;
        ySeed += amount;
        for (var i = 0; i < numPoints; i++) {
            path.segments[i].point = getPoint(i, numPoints);
        }
        //        path.add(path.segments[0].point);
        path.smooth();
    }

    function setColor(color) {
        path.fillColor = color;
    }

    return {
        update: update,
        setColor: setColor
    }
};