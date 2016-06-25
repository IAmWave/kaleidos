"use strict";
define(["lodash", "voronoi", "util"], function(_, _voronoi, util) {
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
            if(this.diagram) this.relax();
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

        // Lloyd's relaxation adapted from Raymond Hill's Voronoi Demo 5: http://www.raymondhill.net/voronoi/rhill-voronoi-demo5.html

        relax: function() {
            var parent = this;
            _.forEach(this.diagram.cells, function(cell) {
                var next = parent.cellCentroid(cell);
                cell.site.x = (1 - util.LLOYD_WEIGHT) * cell.site.x + util.LLOYD_WEIGHT * next.x;
                cell.site.y = (1 - util.LLOYD_WEIGHT) * cell.site.y + util.LLOYD_WEIGHT * next.y;
            });
        },

        cellCentroid: function(cell) {
            var x = 0, y = 0, area = 0;
            _.forEach(cell.halfedges, function(halfedge){
                var p1 = halfedge.getStartpoint();
                var p2 = halfedge.getEndpoint();
                var v = p1.x * p2.y - p2.x * p1.y;
                area += v;
                x += (p1.x + p2.x) * v;
                y += (p1.y + p2.y) * v;
            });
            area *= 3;
            if(area === 0) return {
                x: cell.site.x,
                y: cell.site.y
            };
            return {
                x: x / area,
                y: y / area
            };
        },
    };
});