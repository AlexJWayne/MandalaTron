(function() {
  var extendPrototype;
  extendPrototype = function(base, methods) {
    var method, name;
    for (name in methods) {
      method = methods[name];
      base.prototype[name] = method;
    }
  };
  Math.TAU = Math.PI * 2;
  window.now = function() {
    return new Date().getTime() / 1000;
  };
  extendPrototype(CanvasRenderingContext2D, {
    circle: function(x, y, radius) {
      return this.arc(x, y, radius, 0, Math.TAU);
    },
    fillCircle: function(x, y, radius) {
      this.beginPath();
      this.circle(x, y, radius);
      this.closePath();
      return this.fill();
    },
    strokeCircle: function(x, y, radius) {
      this.beginPath();
      this.circle(x, y, radius);
      this.closePath();
      return this.stroke();
    }
  });
  extendPrototype(Array, {
    random: function(options) {
      if (options == null) {
        options = {};
      }
      return this[Random.int(0, this.length, options)];
    }
  });
}).call(this);
