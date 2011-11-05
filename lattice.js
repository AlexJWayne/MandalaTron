(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  this.Lattice = (function() {
    function Lattice() {
      var i, next, point, step, _ref;
      this.rotation = Random.float(10, 60, {
        curve: Curve.low
      }) * [1, -1].random();
      this.twist = Random.float(20, 360, {
        curve: Curve.low2
      }) * [1, -1].random();
      this.segments = Random.int(3, 12);
      this.color = new HSL((stage.mainHue + 180) % 360, Random.float(100), Random.float(100)).toString();
      this.aplha = Random.float(0.25, 1);
      this.width = Random.float(1, 10, {
        curve: Curve.low
      });
      this.curves = {
        r: [Curve.low2, Curve.low3, Curve.linear, Curve.high2, Curve.high3].random(),
        a: [Curve.low2, Curve.low3, Curve.linear, Curve.high2, Curve.high3].random()
      };
      step = 0.1;
      this.points = {};
      this.points.control = (function() {
        var _results;
        _results = [];
        for (i = 0; 0 <= 1.2 ? i <= 1.2 : i >= 1.2; i += step) {
          _results.push(polar2rect(this.curves.r(i) * 150, this.curves.a(i) * this.twist));
        }
        return _results;
      }).call(this);
      this.points.end = [];
      for (i = 1, _ref = this.points.control.length; 1 <= _ref ? i < _ref : i > _ref; 1 <= _ref ? i++ : i--) {
        point = this.points.control[i - 1];
        next = this.points.control[i];
        if (point && next) {
          this.points.end.push([Math.avg(point[0], next[0]), Math.avg(point[1], next[1])]);
        }
      }
    }
    Lattice.prototype.render = function(ctx) {
      return ctx["do"](__bind(function() {
        ctx.rotate((this.rotation * stage.beat.elapsed / stage.beat.bps).deg2rad() % Math.TAU);
        this.renderFan(ctx);
        return ctx["do"](__bind(function() {
          ctx.scale(-1, 1);
          return this.renderFan(ctx);
        }, this));
      }, this));
    };
    Lattice.prototype.renderFan = function(ctx) {
      return ctx["do"](__bind(function() {
        var i, _ref, _results;
        ctx.rotate(Math.TAU / this.segments * stage.beat.beatProgress());
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.globalAlpha = this.alpha;
        _results = [];
        for (i = 0, _ref = this.segments; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          this.renderCurve(ctx);
          _results.push(ctx.rotate(Math.TAU / this.segments));
        }
        return _results;
      }, this));
    };
    Lattice.prototype.renderCurve = function(ctx) {
      var i, _ref;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (i = 0, _ref = this.points.end.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        ctx.quadraticCurveTo.apply(ctx, __slice.call(this.points.control[i]).concat(__slice.call(this.points.end[i])));
      }
      return ctx.stroke();
    };
    return Lattice;
  })();
}).call(this);
