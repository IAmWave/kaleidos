"use strict";
define(["jquery", "particles", "coloring", "util"], function($, particles, coloring, util) {
    var canvas, ctx;


    $('document').ready(function() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext("2d");
        canvas.width = ctx.canvas.clientWidth;
        canvas.height = ctx.canvas.clientHeight;
        coloring.init();
        particles.init(canvas.width, canvas.height, util.N_SITES);

        var loop = function(timestamp) {
            var diagram = particles.step(timestamp);
            coloring.step(timestamp, ctx, diagram.cells, diagram.execTime);
            coloring.draw(ctx, diagram);
            requestAnimationFrame(loop);
        }
        loop();
    });
});