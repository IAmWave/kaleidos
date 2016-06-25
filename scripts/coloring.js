"use strict";
define(["jquery", "lodash", "util"], function($, _, util) {
    return {
        images: [],
        iCanvas: null,
        iCtx: null,
        switchTime: 0,
        curImage: -1,

        init: function() {
            this.iCanvas = $("<canvas>")
                .attr("width", util.IMAGE_SIZE)
                .attr("height", util.IMAGE_SIZE)[0];
            this.iCtx = this.iCanvas.getContext("2d");

            this.images = _.times(util.N_IMAGES, function(n) {
                var res = {};
                res = new Image();
                res.onload = function() {
                    res.ready = true;
                };
                res.src = "img/" + (n + 1) + ".jpg";
                return res;
            });
            this.images = _.shuffle(this.images);

            util.SIGMOID_MIN = util.sigmoid(-util.SIGMOID_RANGE);
        },

        step: function(t, ctx, cells) {
            if (t > this.switchTime) {
                var nextImage = (this.curImage + 1) % this.images.length;
                if (!this.images[nextImage].ready) { // wait until image is ready
                    this.switchTime = t + 100;
                    return;
                }
                this.curImage = nextImage;
                this.iCtx.drawImage(this.images[this.curImage], 0, 0);
                this.switchTime = t + util.SWITCH_TIME;

                _.forEach(cells, function(cell) {
                    var site = cell.site;
                    //site.transitionStart = t + _.random(util.TRANSITION_DELAY_MAX); //uniformly random delay

                    // delay increases with distance from center
                    var centerDistance = Math.hypot(site.x / ctx.canvas.width - 0.5, site.y / ctx.canvas.height - 0.5) / 0.707; // roughly 0 - 1
                    site.transitionStart = t + util.TRANSITION_DELAY_MAX * (1 - centerDistance);
                    site.transitionEnd = site.transitionStart + _.random(util.TRANSITION_LENGTH_MIN, util.TRANSITION_LENGTH_MAX);
                });
            }
            var parent = this;
            _.forEach(cells, function(cell) {
                var site = cell.site;
                if (site.inTransition) {
                    var realColor = parent.getColorAt(site.x / ctx.canvas.width, site.y / ctx.canvas.height);
                    if (t > site.transitionEnd) {
                        site.color = realColor;
                        site.displayColor = _.clone(site.color);
                    } else {
                        site.displayColor = _.zipWith(site.color, realColor, function(a, b) {
                            var progress = (t - site.transitionStart) / (site.transitionEnd - site.transitionStart);
                            // sigmoid function interpolation
                            progress = progress * util.SIGMOID_RANGE * 2 - util.SIGMOID_RANGE;
                            progress = util.sigmoid(progress);
                            progress = (progress - util.SIGMOID_MIN) / (1 - 2 * util.SIGMOID_MIN);
                            return (1 - progress) * a + progress * b;
                        });
                    }
                }
                site.inTransition = t > site.transitionStart && t < site.transitionEnd;
            });
        },

        getColorAt: function(x, y) {
            if (!this.iCtx) {
                return "black";
            }
            x = Math.floor(Math.min(0.99999999, Math.max(0, x)) * util.IMAGE_SIZE);
            y = Math.floor(Math.min(0.99999999, Math.max(0, y)) * util.IMAGE_SIZE);
            var pixel = this.iCtx.getImageData(x, y, 1, 1).data;
            return pixel;
            //return 'rgb(' + pixel[0] + ',' + pixel[1] + ',' + pixel[2] + ')';
        },

        draw: function(ctx, diagram) {
            var parent = this;
            _.forEach(diagram.cells, function(cell) {
                if (cell.halfedges.length > 2) {
                    var v = cell.halfedges[0].getStartpoint();
                    ctx.beginPath();
                    ctx.moveTo(v.x, v.y);
                    _.forEach(cell.halfedges, function(halfedge) {
                        var v = halfedge.getEndpoint();
                        ctx.lineTo(v.x, v.y);
                    });
                    var c = cell.site.displayColor;
                    ctx.fillStyle = 'rgb(' + Math.floor(c[0]) + ',' + Math.floor(c[1]) + ',' + Math.floor(c[2]) + ')';
                    ctx.strokeStyle = ctx.fillStyle;
                    ctx.fill();
                    ctx.stroke();
                }
            });

            if (0) { // show sites - debugging purposes
                ctx.beginPath();
                ctx.fillStyle = '#fff';
                _.forEach(diagram.cells, function(cell) {
                    ctx.rect(cell.site.x - 2 / 3, cell.site.y - 2 / 3, 2, 2);
                });
                ctx.fill();
            }
        }
    }
});