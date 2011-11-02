(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.Backdrop = (function() {
    function Backdrop() {
      this.ctx = stage.ctx;
      this.hueShift = Random.int(0, 90, {
        curve: Curve.low
      }) * [1, -1].random();
      this.innerSat = [
        Random.int(20, 80, {
          curve: Curve.low
        }), Random.int(20, 80, {
          curve: Curve.low
        })
      ];
      this.outerSat = [
        Random.int(50, 100, {
          curve: Curve.high
        }), Random.int(50, 100, {
          curve: Curve.high
        })
      ];
      this.innerLum = [Random.int(0, 100), Random.int(0, 100)];
      this.outerLum = [Random.int(0, 100), Random.int(0, 100)];
      this.coefCurve = [Curve.low, Curve.high].random();
    }
    Backdrop.prototype.render = function(ctx) {
      if (ctx == null) {
        ctx = this.ctx;
      }
      return ctx["do"](__bind(function() {
        var coef, grad, innerColor, min, outerColor;
        ctx.globalAlpha = 1.0;
        coef = stage.beat.beat() === 0 ? this.coefCurve(1 - stage.beat.beatProgress()) : (min = 1 / stage.beat.perMeasure, this.coefCurve(stage.beat.measureProgress().normalize(1 / stage.beat.perMeasure, 1)));
        innerColor = new HSL(stage.mainHue + this.hueShift * coef, blend(this.innerSat[0], this.innerSat[1], coef), blend(this.innerLum[0], this.innerLum[1], coef));
        outerColor = new HSL(stage.mainHue + this.hueShift * coef, blend(this.outerSat[0], this.outerSat[1], coef), blend(this.outerLum[0], this.outerLum[1], coef));
        grad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
        grad.addColorStop(0, innerColor.toString());
        grad.addColorStop(1, outerColor.toString());
        ctx.fillStyle = grad;
        return ctx.fillRect(-100, -100, 200, 200);
      }, this));
    };
    return Backdrop;
  })();
}).call(this);
