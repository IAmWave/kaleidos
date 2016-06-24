define(["lodash"], function (_) {
    var util = {
        INF: 1e9,
        tileSize: 40,
        size: 15,
        row: 5,
        Tile: Object.freeze({
            A: "#F00",
            B: "#00F",
            NONE: "#FFF"
        })
    };

    util.equals = function (a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    util.emptyPos = function () {
        return _.chain(_.range(util.size))
            .map(function () {
                return _.map(_.range(util.size), function () {
                    return util.Tile.NONE;
                });
            }).value();
    };

    util.makeMove = function (pos, x, y, p) {
        var res = _.cloneDeep(pos);
        res[x][y] = (p === 0) ? util.Tile.A : util.Tile.B;
        return res;
    };

    return util;
});