define(function () {
    // the lengths are specified relative to canvas width
    return {
        SPEED_MIN: 0.0000,
        SPEED_MAX: 0.0008,
        MARGIN: 0.07,
        LLOYD_WEIGHT: 0.1,
        N_SITES: 800,
        //--------- image options ---------
        N_IMAGES: 10,
        IMAGE_SIZE: 500,
        SIGMOID_RANGE: 2, // what portion of the sigmoid function is used to interpolate transitions: -SIGMOID_RANGE to SIGMOID_RANGE. Lower => more linear
        SWITCH_TIME: 17500,
        TRANSITION_DELAY_MAX: 1500,
        TRANSITION_LENGTH_MIN: 1000,
        TRANSITION_LENGTH_MAX: 4000,

        sigmoid: function(x) {
            return 1 / (1 + Math.exp(-x));
        },
    };
});