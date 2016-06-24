define(["lodash"], function(_) {
    return {
        x: 3,
        step: function() {
            this.x += 3;
        },

        draw: function(ctx, diagram) {
            // background
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = '#888';
            ctx.stroke();
            // voronoi
            if (!diagram) {
                return;
            }

            _.forEach(diagram.cells, function(cell) {
                var halfedges = cell.halfedges,
                    nHalfedges = halfedges.length;
                if (nHalfedges > 2) {
                    v = halfedges[0].getStartpoint();
                    ctx.beginPath();
                    ctx.moveTo(v.x, v.y);
                    for (var iHalfedge = 0; iHalfedge < nHalfedges; iHalfedge++) {
                        v = halfedges[iHalfedge].getEndpoint();
                        ctx.lineTo(v.x, v.y);
                    }
                    if (cell.site.color) {
                        ctx.fillStyle = cell.site.color;
                    } else {
                        var r = Math.floor(127 * (1 + Math.sin((cell.site.x + cell.site.y * 3) / 70)));
                        ctx.fillStyle = 'rgb(' + r + ',0,0)';
                    }
                    ctx.strokeStyle = ctx.fillStyle;
                    ctx.fill();
                    ctx.stroke();
                }
            });

            // edges
            /*ctx.beginPath();
            ctx.strokeStyle = '#000';
            _.forEach(diagram.edges, function(edge){
                ctx.moveTo(edge.va.x, edge.va.y);
                ctx.lineTo(edge.vb.x, edge.vb.y);
            });
            ctx.stroke();
            */

            /*
            // edges - endpoints
            ctx.beginPath();
            ctx.fillStyle = 'red';
            _.forEach(diagram.vertices, function(v) {
                ctx.rect(v.x - 1, v.y - 1, 3, 3);
            });
            ctx.fill();
            */

            // sites
            /*ctx.beginPath();
            ctx.fillStyle = '#fff';
            _.forEach(diagram.cells, function(cell) {
                ctx.rect(cell.site.x - 2 / 3, cell.site.y - 2 / 3, 2, 2);
            });
            ctx.fill();*/
        }
    }
});