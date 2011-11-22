(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  this.Lattice = (function() {
    __extends(Lattice, Layer);
    function Lattice() {
      var i, next, point, step, _ref;
      Lattice.__super__.constructor.apply(this, arguments);
      this.composite = ['source-over', 'lighter', 'darker'].random();
      if (Random.float(1) < 0.1) {
        this.composite = 'xor';
      }
      this.rotation = Random.float(10, 60, {
        curve: Curve.low
      }) * [1, -1].random();
      this.rotOffset = Random.float(0, this.rotOffset);
      this.twist = Random.float(30, 500, {
        curve: Curve.low
      }) * [1, -1].random();
      this.twistBeatCurve = [Curve.linear, Curve.ease2, Curve.ease3].random({
        curve: Curve.low2
      });
      this.segments = Random.int(3, 12, {
        curve: Curve.low
      });
      this.color = new HSL((stage.mainHue + 180) % 360, Random.float(100), Random.float(100)).toString();
      this.aplha = Random.float(0.25, 1);
      this.width = Random.float(1, 6, {
        curve: Curve.low3
      });
      this.alpha = Random.float(0.35, 1);
      this.taper = [
        Random.float(0.2, 0.75, {
          curve: Curve.low3
        }), false
      ].random({
        curve: Curve.low5
      });
      this.curves = {
        r: Curve.low3,
        a: [Curve.low5, Curve.low4, Curve.low3, Curve.low2, Curve.linear, Curve.high2, Curve.high3, Curve.high4, Curve.high5].random()
      };
      this.bornAt = stage.beat.now;
      step = 0.04;
      this.points = {};
      this.points.control = (function() {
        var _results, _step;
        _results = [];
        for (i = 0, _step = step; i <= 1; i += _step) {
          _results.push(polar2rect(this.curves.r(i) * 200, this.curves.a(i) * this.twist));
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
      if (this.composite === 'lighter' || this.composite === 'darker') {
        this.alpha /= 2;
      }
    }
    Lattice.prototype.render = function(ctx) {
      if (this.expired && stage.beat.now - this.expiredAt > 1 / stage.beat.bps) {
        return this.kill();
      }
      return ctx.render(__bind(function() {
        var width, widthScalar;
        ctx.globalCompositeOperation = this.composite;
        width = this.width;
        if (stage.beat.now - this.bornAt < 1 / stage.beat.bps) {
          widthScalar = (stage.beat.now - this.bornAt).normalize(0, 1 / stage.beat.bps).limit(1);
        }
        if (stage.beat.now > this.expiredAt) {
          widthScalar = 1 - (stage.beat.now - this.expiredAt).normalize(0, 1 / stage.beat.bps).limit(1);
        }
        this.taperScalar = this.taper * (widthScalar || 1);
        if (this.taper) {
          ctx.fillStyle = this.color;
        } else {
          ctx.strokeStyle = this.color;
        }
        ctx.lineWidth = this.width * (widthScalar || 1);
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
      return ctx.render(__bind(function() {
        var i, _ref, _ref2, _ref3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        if (this.taper) {
          for (i = 0, _ref = this.points.end.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
            ctx.quadraticCurveTo.apply(ctx, __slice.call(this.points.control[i]).concat(__slice.call(this.points.end[i])));
          }
          ctx.rotate((this.taperScalar * this.taper * 360 / this.segments).deg2rad());
          for (i = _ref2 = this.points.end.length - 1; _ref2 <= 1 ? i <= 1 : i >= 1; _ref2 <= 1 ? i++ : i--) {
            ctx.quadraticCurveTo.apply(ctx, __slice.call(this.points.control[i]).concat(__slice.call(this.points.end[i - 1])));
          }
          ctx.closePath();
          return ctx.fill();
        } else {
          for (i = 0, _ref3 = this.points.end.length; 0 <= _ref3 ? i < _ref3 : i > _ref3; 0 <= _ref3 ? i++ : i--) {
            ctx.quadraticCurveTo.apply(ctx, __slice.call(this.points.control[i]).concat(__slice.call(this.points.end[i])));
          }
          return ctx.stroke();
        }
      }, this));
    };
    return Lattice;
  })();
}).call(this);
