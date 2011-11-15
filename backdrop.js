
  this.Backdrop = (function() {

    function Backdrop() {
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

    Backdrop.prototype.render = function(ctx) {
      var _this = this;
      if (this.expired) this.dead = true;
      return ctx.render(function() {
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = _this.createGradient(ctx);
        return ctx.fillRect(-stage.canvas.width / 2, -stage.canvas.height / 2, stage.canvas.width, stage.canvas.height);
      });
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
