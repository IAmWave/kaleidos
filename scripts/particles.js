"use strict";
define(["lodash", "voronoi", "util", "lloyd"], function(_, _voronoi, util, lloyd) {
    return {
        voronoi: new Voronoi(),
        sites: [],
        width: 100,
        height: 100,
        diagram: null,

        init: function(width, height, nSites) {
            this.width = width;
            this.height = height;
            this.sites = _.times(nSites, function() {
                var res = {
                    x: _.random(width),
                    y: _.random(height),
                };
                var angle = _.random(Math.PI * 2, true);
                var v = _.random(util.SPEED_MIN, util.SPEED_MAX, true) * width;
                res.xv = Math.cos(angle) * v;
                res.yv = Math.sin(angle) * v;
                res.color = res.displayColor = [0, 0, 0];
                return res;
            });
        },

        step: function() {
            if(this.diagram) lloyd.relax(this.sites, this.diagram);
            var parent = this;
            _.forEach(this.sites, function(site){
                var margin = util.MARGIN * parent.width;
                site.x = (site.x + site.xv + parent.width + 3 * margin) % (parent.width + 2 * margin) - margin;
                site.y = (site.y + site.yv + parent.height + 3 * margin) % (parent.height + 2 * margin) - margin;
            });

            this.voronoi.recycle(this.diagram);
            this.diagram = this.voronoi.compute(this.sites, {
                xl: 0,
                xr: this.width,
                yt: 0,
                yb: this.height
            });
            
            return this.diagram;
        },
    };
});