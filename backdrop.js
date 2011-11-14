
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
      var _this = this;
      if (ctx == null) ctx = this.ctx;
      return ctx["do"](function() {
        var coef, grad, innerColor, min, outerColor;
        ctx.globalAlpha = 1.0;
        coef = stage.beat.beat() === 0 ? _this.coefCurve(1 - stage.beat.beatProgress()) : (min = 1 / stage.beat.perMeasure, _this.coefCurve(stage.beat.measureProgress().normalize(1 / stage.beat.perMeasure, 1)));
        innerColor = new HSL(stage.mainHue + _this.hueShift * coef, blend(_this.innerSat[0], _this.innerSat[1], coef), blend(_this.innerLum[0], _this.innerLum[1], coef));
        outerColor = new HSL(stage.mainHue + _this.hueShift * coef, blend(_this.outerSat[0], _this.outerSat[1], coef), blend(_this.outerLum[0], _this.outerLum[1], coef));
        grad = _this.ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
        grad.addColorStop(0, innerColor.toString());
        grad.addColorStop(1, outerColor.toString());
        ctx.fillStyle = grad;
        return ctx.fillRect(-stage.canvas.width / 2, -stage.canvas.height / 2, stage.canvas.width, stage.canvas.height);
      });
    };

    return Backdrop;

  })();
