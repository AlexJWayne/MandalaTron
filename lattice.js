(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  this.Lattice = (function() {
    function Lattice() {
      this.twist = Random.float(20, 360, {
        curve: Curve.low
      }) * [1, -1].random();
      this.segments = Random.int(3, 12);
      this.mirror = [true, false].random({
        curve: Curve.low
      });
      this.color = new HSL((stage.mainHue + 180) % 360, Random.float(100), Random.float(100)).toString();
      this.aplha = Random.float(0.25, 1);
      this.width = Random.float(1, 10, {
        curve: Curve.low
      });
      this.curves = {
        r: [Curve.low, Curve.linear, Curve.high].random(),
        a: [Curve.low, Curve.linear, Curve.high].random()
      };
    }
    Lattice.prototype.render = function(ctx) {
      var i, points, step;
      step = 0.01;
      points = (function() {
        var _results, _step;
        _results = [];
        for (i = step, _step = step; step <= 1 ? i < 1 : i > 1; i += _step) {
          _results.push(polar2rect(this.curves.r(i) * 150, this.curves.a(i) * this.twist));
        }
        return _results;
      }).call(this);
      this.renderFan(ctx, points);
      if (this.mirror) {
        return ctx["do"](__bind(function() {
          ctx.scale(-1, 1);
          return this.renderFan(ctx, points);
        }, this));
      }
    };
    Lattice.prototype.renderFan = function(ctx, points) {
      return ctx["do"](__bind(function() {
        var i, _ref, _results;
        ctx.rotate(Math.TAU / this.segments * stage.beat.beatProgress());
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.globalAlpha = this.alpha;
        _results = [];
        for (i = 0, _ref = this.segments; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          this.renderCurve(ctx, points);
          _results.push(ctx.rotate(Math.TAU / this.segments));
        }
        return _results;
      }, this));
    };
    Lattice.prototype.renderCurve = function(ctx, points) {
      var i, _ref, _step;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (i = 0, _ref = points.length, _step = 2; 0 <= _ref ? i <= _ref : i >= _ref; i += _step) {
        if (points[i] && points[i + 1]) {
          ctx.quadraticCurveTo.apply(ctx, __slice.call(points[i]).concat(__slice.call(points[i + 1])));
        }
      }
      return ctx.stroke();
    };
    return Lattice;
  })();
}).call(this);
