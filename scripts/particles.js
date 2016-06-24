define(["lodash", "voronoi", "options", "lloyd"], function(_, _voronoi, options, lloyd) {
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
                    x: Math.floor(Math.random() * width),
                    y: Math.floor(Math.random() * height),
                };
                var angle = Math.random() * Math.PI * 2;
                var v = options.SPEED_MIN + Math.random() * (options.SPEED_MAX - options.SPEED_MIN) * width;
                res.xv = Math.cos(angle) * v;
                res.yv = Math.sin(angle) * v;
                
                var r = Math.floor(127 * (1 + Math.sin((res.x + res.y * 3) / 70)));
                res.color = 'rgb(' + r + ',0,70)';
                return res;
            });
        },

        step: function() {
            if(this.diagram) lloyd.relax(this.sites, this.diagram);
            var parent = this;
            _.forEach(this.sites, function(site){
                var margin = options.MARGIN * parent.width;
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
    };
});