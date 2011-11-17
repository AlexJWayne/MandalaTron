(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  this.Lattice = (function() {
    function Lattice() {
      var i, next, point, step, _ref;
      this.rotation = Random.float(10, 60, {
        curve: Curve.low
      }) * [1, -1].random();
      this.rotOffset = Random.float(0, this.rotOffset);
      this.twist = Random.float(30, 450, {
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
        a: [Curve.low5, Curve.low4, Curve.low3, Curve.low2, Curve.linear, Curve.high2, Curve.high3, Curve.high4, Curve.high5].random()
      };
      step = 0.05;
      this.points = {};
      this.points.control = (function() {
        var _results, _step;
        _results = [];
        for (i = 0, _step = step; i <= 1; i += _step) {
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
      if (this.expired && stage.beat.now - this.expiredAt > 1 / stage.beat.bps) {
        return this.dead = true;
      }
      this.bornAt || (this.bornAt = stage.beat.now);
      if (this.expired) {
        this.expiredAt || (this.expiredAt = stage.beat.now);
      }
      return ctx.render(__bind(function() {
        var width;
        width = this.width;
        if (stage.beat.now - this.bornAt < 1 / stage.beat.bps) {
          width *= (stage.beat.now - this.bornAt).normalize(0, 1 / stage.beat.bps).limit(1);
        }
        if (stage.beat.now > this.expiredAt) {
          width *= 1 - (stage.beat.now - this.expiredAt).normalize(0, 1 / stage.beat.bps).limit(1);
        }
        ctx.strokeStyle = this.color;
        ctx.lineWidth = width;
        ctx.globalAlpha = this.alpha;
        ctx.rotate((this.rotOffset + this.rotation * stage.beat.elapsed * stage.beat.bps).deg2rad() % Math.TAU);
        this.renderFan(ctx);
        return ctx.render(__bind(function() {
          ctx.scale(-1, 1);
          return this.renderFan(ctx);
        }, this));
      }, this));
    };
    Lattice.prototype.renderFan = function(ctx) {
      return ctx.render(__bind(function() {
        var curvedProgression, i, _ref, _results;
        curvedProgression = stage.beat.beatProgress();
        curvedProgression = this.twistBeatCurve(curvedProgression);
        ctx.rotate(Math.TAU / this.segments * curvedProgression);
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
