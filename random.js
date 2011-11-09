
  this.Random = {
    seed: function() {
      this.seedValue = window.location.hash ? window.location.hash.slice(1) : Math.floor(Math.random() * 1000000);
      return Math.seedrandom(this.seedValue.toString());
    },
    float: function(min, max, options) {
      var curve;
      if (options == null) options = {};
      curve = options.curve || Curve.linear;
      if (max == null) {
        max = min;
        min = 0;
      }
      return curve(Math.random()) * (max - min) + min;
    },
    int: function() {
      return Math.floor(this.float.apply(this, arguments));
    }
  };
