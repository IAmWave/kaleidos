"use strict";
define(function() {
    // the lengths are specified relative to canvas width
    return {
        SPEED_MIN: 0.0000,
        SPEED_MAX: 0.0008,
        MARGIN: 0.05,
        LLOYD_MAX_DISTANCE_INNER: 0.0006,
        LLOYD_MAX_DISTANCE_OUTER: 0.0003,
        N_SITES: 500,
        //--------- image options ---------
        N_IMAGES: 10,
        IMAGE_SIZE: 500,
        SIGMOID_RANGE: 2, // what portion of the sigmoid function is used to interpolate transitions: -SIGMOID_RANGE to SIGMOID_RANGE. Lower => more linear
        SWITCH_TIME: 15000,
        TRANSITION_DELAY_MAX: 1500,
        TRANSITION_LENGTH_MIN: 1000,
        TRANSITION_LENGTH_MAX: 4000,
        //--------- debug ---------
        SHOW_FPS: false,
        FRAMES_SAVED: 100,
        
        sigmoid: function(x) {
            return 1 / (1 + Math.exp(-x));
        },

        interpolate: function(progress, a, b) { // sigmoid function interpolation
            progress = progress * this.SIGMOID_RANGE * 2 - this.SIGMOID_RANGE;
            progress = this.sigmoid(progress);
            progress = (progress - this.SIGMOID_MIN) / (1 - 2 * this.SIGMOID_MIN);
            return (1 - progress) * a + progress * b;
        },
    };
});