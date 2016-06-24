define(["jquery", "particles", "coloring"], function($, particles, coloring) {
    var canvas, ctx;


    $('document').ready(function() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext("2d");
        canvas.width = ctx.canvas.clientWidth;
        canvas.height = ctx.canvas.clientHeight;
        particles.init(canvas.width, canvas.height, 800);

        var loop = function() {
            var diagram = particles.step();
            //console.log("calculation time: "+diagram.execTime);
            coloring.step();
            coloring.draw(ctx, diagram);
            requestAnimationFrame(loop);
        }
        loop();
    });
});