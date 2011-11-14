(function() {
  var __slice = Array.prototype.slice;

  this.Lattice = (function() {

    function Lattice() {
      var i, next, point, step, _ref;
      this.rotation = Random.float(10, 60, {
        curve: Curve.low
      }) * [1, -1].random();
      this.rotOffset = Random.float(0, this.rotOffset);
      this.twist = Random.float(45, 450, {
        curve: Curve.low
      }) * [1, -1].random();
      this.twistBeatCurve = [Curve.linear, Curve.ease2, Curve.ease3].random({
        curve: Curve.low2
      });
      this.segments = Random.int(3, 12);
      this.color = new HSL((stage.mainHue + 180) % 360, Random.float(100), Random.float(100)).toString();
      this.aplha = Random.float(0.25, 1);
      this.width = Random.float(1, 6, {
        curve: Curve.low3
      });
      this.alpha = Random.float(0.35, 1);
      this.curves = {
        r: Curve.low3,
        a: [Curve.low2, Curve.low3, Curve.linear, Curve.high2, Curve.high3].random()
      };
      step = 0.05;
      this.points = {};
      this.points.control = (function() {
        var _results;
        _results = [];
        for (i = 0; i <= 1; i += step) {
          _results.push(polar2rect(this.curves.r(i) * 175, this.curves.a(i) * this.twist));
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
      var _this = this;
      return ctx.render(function() {
        ctx.rotate((_this.rotOffset + _this.rotation * stage.beat.elapsed / stage.beat.bps).deg2rad() % Math.TAU);
        _this.renderFan(ctx);
        return ctx.render(function() {
          ctx.scale(-1, 1);
          return _this.renderFan(ctx);
        });
      });
    };

    Lattice.prototype.renderFan = function(ctx) {
      var _this = this;
      return ctx.render(function() {
        var curvedProgression, i, _ref, _results;
        curvedProgression = stage.beat.beatProgress();
        curvedProgression = _this.twistBeatCurve(curvedProgression);
        ctx.rotate(Math.TAU / _this.segments * curvedProgression);
        ctx.strokeStyle = _this.color;
        ctx.lineWidth = _this.width;
        ctx.globalAlpha = _this.alpha;
        _results = [];
        for (i = 0, _ref = _this.segments; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          _this.renderCurve(ctx);
          _results.push(ctx.rotate(Math.TAU / _this.segments));
        }
        return _results;
      });
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
