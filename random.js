(function() {
  this.Random = {
    float: function(min, max, options) {
      var curve;
      if (options == null) {
        options = {};
      }
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
  this.Curve = {
    linear: function(x) {
      return x;
    },
    low: function(x) {
      return x * x * x;
    },
    high: function(x) {
      return 1 - (1 - x) * (1 - x) * (1 - x);
    },
    test: function(fn) {
      var i;
      for (i = 0; i <= 1; i += 0.1) {
        console.log("" + i + " => " + (fn(i)));
      }
    }
  };
}).call(this);
