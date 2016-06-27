requirejs.config({
    baseUrl: 'scripts',
    paths: {
        voronoi: "lib/rhill-voronoi-core.min",
        jquery: "lib/jquery",
        lodash: "lib/lodash.min"
    }
});

requirejs(["app"]);