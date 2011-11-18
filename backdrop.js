(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.Backdrop = (function() {
    __extends(Backdrop, Layer);
    function Backdrop() {
      Backdrop.__super__.constructor.apply(this, arguments);
      this.hueShift = Random.int(0, 90, {
        curve: Curve.low
      }) * [1, -1].random();
      this.innerSat = [
        Random.int(0, 100, {
          curve: Curve.low
        }), Random.int(0, 100, {
          curve: Curve.low
        })
      ];
      this.outerSat = [
        Random.int(0, 100, {
          curve: Curve.high
        }), Random.int(0, 100, {
          curve: Curve.high
        })
      ];
      this.innerLum = [Random.int(0, 100), Random.int(0, 100)];
      this.outerLum = [Random.int(0, 100), Random.int(0, 100)];
      this.coefCurve = [Curve.low, Curve.high].random();
    }
    Backdrop.prototype.expire = function() {
      Backdrop.__super__.expire.apply(this, arguments);
      return this.kill();
    };
    Backdrop.prototype.render = function(ctx) {
      if (this.expired) {
        this.kill();
      }
      return ctx.render(__bind(function() {
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = this.createGradient(ctx);
        return ctx.fillRect(-stage.canvas.width / 2, -stage.canvas.height / 2, stage.canvas.width, stage.canvas.height);
      }, this));
    };
    Backdrop.prototype.createGradient = function(ctx) {
      var coef, grad, innerColor, min, outerColor;
      coef = stage.beat.beat() === 0 ? this.coefCurve(1 - stage.beat.beatProgress()) : (min = 1 / stage.beat.perMeasure, this.coefCurve(stage.beat.measureProgress().normalize(1 / stage.beat.perMeasure, 1)));
      innerColor = new HSL(stage.mainHue + this.hueShift * coef, blend(this.innerSat[0], this.innerSat[1], coef), blend(this.innerLum[0], this.innerLum[1], coef));
      outerColor = new HSL(stage.mainHue + this.hueShift * coef, blend(this.outerSat[0], this.outerSat[1], coef), blend(this.outerLum[0], this.outerLum[1], coef));
      grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
      grad.addColorStop(0, innerColor.toString());
      grad.addColorStop(1, outerColor.toString());
      return grad;
    };
    return Backdrop;
  })();
}).call(this);
