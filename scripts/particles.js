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
            var margin = util.MARGIN * parent.width;
            _.forEach(this.sites, function(site){
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
                var site = cell.site;
                if(site.x < 0 || site.y < 0 || site.x >= parent.width || site.y >= parent.height) return;
                var next = parent.cellCentroid(cell);
                var angle = Math.atan2(next.y - site.y, next.x - site.x);
                var distance = Math.hypot(next.x - site.x, next.y - site.y);
                var centerDistance = Math.hypot(site.x / parent.width - 0.5, site.y / parent.height - 0.5) / 0.707; // roughly 0 - 1
                var maxDistance = (centerDistance * util.LLOYD_MAX_DISTANCE_OUTER + (1 - centerDistance) * util.LLOYD_MAX_DISTANCE_INNER) * parent.width;
                cell.pushing = distance > maxDistance;
                if(cell.pushing) distance = maxDistance;
                site.x += Math.cos(angle) * distance;
                site.y += Math.sin(angle) * distance;
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