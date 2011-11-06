(function() {
  this.Random = {
    seed: function() {
      var seed, seedField;
      seedField = document.getElementById('seed');
      if (window.location.hash) {
        seedField.value = window.location.hash.slice(1);
      }
      if (seedField.value) {
        return Math.seedrandom(seedField.value);
      } else {
        seed = Math.floor(Math.random() * 1000000);
        Math.seedrandom(seed.toString());
        return seedField.value = seed;
      }
    },
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
}).call(this);
