(function() {
  var fn, name, _fn, _ref;
  var __hasProp = Object.prototype.hasOwnProperty;
  this.Tween = {
    linear: function(t, b, c, d) {
      return c * t / d + b;
    },
    easeInQuad: function(t, b, c, d) {
      t /= d;
      return c * t * t + b;
    },
    easeOutQuad: function(t, b, c, d) {
      t /= d;
      return -c * t * (t - 2) + b;
    },
    easeInOutQuad: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t + b;
      } else {
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }
    },
    easeInCubic: function(t, b, c, d) {
      t /= d;
      return c * t * t * t + b;
    },
    easeOutCubic: function(t, b, c, d) {
      t /= d;
      t--;
      return c * (t * t * t + 1) + b;
    },
    easeInOutCubic: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t * t + b;
      } else {
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
      }
    },
    easeInQuart: function(t, b, c, d) {
      t /= d;
      return c * t * t * t * t + b;
    },
    easeOutQuart: function(t, b, c, d) {
      t /= d;
      t--;
      return -c * (t * t * t * t - 1) + b;
    },
    easeInOutQuart: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t * t * t + b;
      } else {
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
      }
    },
    easeInQuint: function(t, b, c, d) {
      t /= d;
      return c * t * t * t * t * t + b;
    },
    easeOutQuint: function(t, b, c, d) {
      t /= d;
      t--;
      return c * (t * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t * t * t * t + b;
      } else {
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
      }
    },
    easeInSine: function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(t, b, c, d) {
      return c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOutExpo: function(t, b, c, d) {
      return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutExpo: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      } else {
        t--;
        return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
      }
    },
    easeInCirc: function(t, b, c, d) {
      t /= d;
      return -c * (Math.sqrt(1 - t * t) - 1) + b;
    },
    easeOutCirc: function(t, b, c, d) {
      t /= d;
      t--;
      return c * Math.sqrt(1 - t * t) + b;
    },
    easeInOutCirc: function(t, b, c, d) {
      t /= d / 2;
      if (t < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      } else {
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
      }
    }
  };
  this.Tween.low = this.Tween.low2 = this.Tween.easeOutQuad;
  this.Tween.high = this.Tween.high2 = this.Tween.easeInQuad;
  this.Tween.ease = this.Tween.ease2 = this.Tween.easeInOutQuad;
  this.Tween.low3 = this.Tween.easeOutCubic;
  this.Tween.high3 = this.Tween.easeInCubic;
  this.Tween.ease3 = this.Tween.easeInOutCubic;
  this.Tween.low4 = this.Tween.easeOutQuart;
  this.Tween.high4 = this.Tween.easeInQuart;
  this.Tween.ease4 = this.Tween.easeInOutQuart;
  this.Tween.low5 = this.Tween.easeOutQuint;
  this.Tween.high5 = this.Tween.easeInQuint;
  this.Tween.ease5 = this.Tween.easeInOutQuint;
  this.Curve = {};
  _ref = this.Tween;
  _fn = function(name, fn) {
    return this.Curve[name] = function(n) {
      return fn(n, 0, 1, 1);
    };
  };
  for (name in _ref) {
    if (!__hasProp.call(_ref, name)) continue;
    fn = _ref[name];
    _fn(name, fn);
  }
}).call(this);
