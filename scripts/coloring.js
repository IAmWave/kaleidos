define(["lodash"], function(_) {
    return {
        step: function() {
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
            
            _.forEach(diagram.cells, function(cell) {
                if (cell.halfedges.length > 2) {
                    var v = cell.halfedges[0].getStartpoint();
                    ctx.beginPath();
                    ctx.moveTo(v.x, v.y);
                    _.forEach(cell.halfedges, function(halfedge){
                        var v = halfedge.getEndpoint();
                        ctx.lineTo(v.x, v.y);
                    });

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
            if(0){
                // sites
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