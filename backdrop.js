(function() {
  this.Backdrop = (function() {
    function Backdrop() {
      this.ctx = stage.ctx;
      this.hueShift = Random.int(-90, 90);
      this.innerSat = Random.int(0, 100, {
        curve: Curve.low
      });
      this.outerSat = Random.int(0, 100, {
        curve: Curve.high
      });
    }
    Backdrop.prototype.render = function(ctx) {
      var coef, grad;
      if (ctx == null) {
        ctx = this.ctx;
      }
      coef = Curve.low(stage.beat.measureProgress());
      grad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
      grad.addColorStop(0, "hsl(" + (stage.mainHue + this.hueShift * coef) + ", " + this.innerSat + "%, " + ((60 - coef * 60).toFixed(5)) + "%)");
      grad.addColorStop(1, "hsl(" + (stage.mainHue + this.hueShift * coef) + ", " + this.outerSat + "%, " + ((0 + coef * 60).toFixed(5)) + "%)");
      ctx.fillStyle = grad;
      return ctx.fillRect(-100, -100, 200, 200);
    };
    return Backdrop;
  })();
}).call(this);
