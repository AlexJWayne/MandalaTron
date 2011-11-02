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
  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
      return setTimeout(callback, 1000 / 60);
    };
  })();
  window.now = function() {
    return new Date().getTime() / 1000;
  };
  window.blend = function(start, end, amount) {
    return start * (1 - amount) + end * amount;
  };
  extendPrototype(CanvasRenderingContext2D, {
    "do": function(fn) {
      this.save();
      fn();
      return this.restore();
    },
    circle: function(x, y, radius) {
      return this.arc(x, y, radius, 0, Math.TAU);
    },
    fillCircle: function(x, y, radius) {
      this.beginPath();
      this.circle(x, y, radius);
      return this.fill();
    },
    strokeCircle: function(x, y, radius) {
      this.beginPath();
      this.circle(x, y, radius);
      return this.stroke();
    },
    rect: function(x, y, width, height) {
      this.beginPath();
      this.moveTo(x, y);
      this.lineTo(x + width, y);
      this.lineTo(x + width, y + height);
      this.lineTo(x, y + height);
      return this.closePath();
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
  extendPrototype(Number, {
    normalize: function(min, max) {
      if (max == null) {
        max = min;
        min = 0;
      }
      return (this - min) / (max - min);
    },
    limit: function() {
      return function(min, max) {
        if (max == null) {
          max = min;
          min = 0;
        }
        if (this < min) {
          return min;
        } else if (this > max) {
          return max;
        } else {
          return this;
        }
      };
    },
    deg2rad: function() {
      return this * Math.TAU / 360;
    },
    rad2deg: function() {
      return this * 360 / Math.TAU;
    }
  });
  this.HSL = (function() {
    function HSL(h, s, l) {
      this.h = h;
      this.s = s;
      this.l = l;
    }
    HSL.prototype.toString = function() {
      return "hsl(" + (this.h.toFixed(1)) + ", " + (this.s.toFixed(1)) + "%, " + (this.l.toFixed(1)) + "%)";
    };
    return HSL;
  })();
}).call(this);
