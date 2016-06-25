// Adapted from Raymond Hill's Voronoi Demo 5: http://www.raymondhill.net/voronoi/rhill-voronoi-demo5.html
define(["lodash", "util"], function(_, util) {
    return {
        relax: function(sites, diagram) {
            var parent = this;
            _.forEach(diagram.cells, function(cell) {
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