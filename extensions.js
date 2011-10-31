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
  window.blend = function(start, end, amount) {
    return start * (1 - amount) + end * amount;
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
