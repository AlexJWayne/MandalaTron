(function() {
  var Orbital;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  this.Orbitals = (function() {
    function Orbitals() {
      this.orbitals = [];
      this.lastbeat = -1;
      this.rotation = Random.float(0, 360);
      while (!(Math.abs(this.twist + 360 / stage.beat.perMeasure) > 30)) {
        this.twist = Random.float(20, 270) * [1, -1].random();
      }
      this.count = Random.int(1, 6);
      this.mirror = [true, false].random();
      this.style = {
        color: [new HSL(stage.mainHue + Random.float(150, 210), Random.float(75, 100), 50).toString(), new HSL(stage.mainHue + Random.float(150, 210), Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()].random(),
        size: Random.float(5, 40, {
          curve: Curve.low2
        }),
        radius: [Random.float(20, 150), Random.float(20, 150)],
        radiusCurve: [Curve.low3, Curve.low2, Curve.low, Curve.linear, Curve.high, Curve.high2, Curve.high3].random(),
        lifetime: Random.float(0.5, stage.beat.perMeasure) / stage.beat.bps,
        alpha: Random.float(0.4, 1)
      };
    }
    Orbitals.prototype.render = function(ctx) {
      var orbital;
      this.orbitals = (function() {
        var _i, _len, _ref, _results;
        _ref = this.orbitals;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          orbital = _ref[_i];
          if (orbital.alive) {
            _results.push(orbital);
          }
        }
        return _results;
      }).call(this);
      if (this.expired && this.orbitals.length === 0) {
        this.dead = true;
      }
      if (stage.beat.beat() !== this.lastbeat && !this.expired) {
        this.lastbeat = stage.beat.beat();
        this.orbitals.push(new Orbital(this.style));
      }
      this.renderGroup(ctx);
      if (this.mirror) {
        return ctx.render(__bind(function() {
          ctx.scale(-1, 1);
          ctx.rotate(this.rotation.deg2rad());
          return this.renderGroup(ctx);
        }, this));
      }
    };
    Orbitals.prototype.renderGroup = function(ctx) {
      var i, twist, _ref;
      for (i = 0, _ref = this.count; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        twist = this.twist * stage.beat.elapsed / stage.beat.bps;
        ctx.render(__bind(function() {
          var orbital, _i, _len, _ref2, _results;
          ctx.rotate((this.rotation + twist + i * 360 / this.count).deg2rad());
          _ref2 = this.orbitals;
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            orbital = _ref2[_i];
            _results.push(orbital.render(ctx));
          }
          return _results;
        }, this));
      }
    };
    return Orbitals;
  })();
  Orbital = (function() {
    function Orbital(style) {
      this.style = style;
      this.alive = true;
      this.startedAt = stage.beat.now;
      this.a = 360 / stage.beat.perMeasure * stage.beat.beat();
    }
    Orbital.prototype.render = function(ctx) {
      var alphaScalar, lifetimeProgress, livedFor;
      livedFor = stage.beat.now - this.startedAt;
      if (livedFor > this.style.lifetime) {
        return this.alive = false;
      }
      lifetimeProgress = livedFor / this.style.lifetime;
      alphaScalar = lifetimeProgress < 0.1 ? lifetimeProgress.normalize(0, 0.1) : lifetimeProgress.normalize(1, 0.1);
      ctx.globalAlpha = this.style.alpha * alphaScalar;
      ctx.fillStyle = this.style.color;
      return ctx.fillCircle.apply(ctx, __slice.call(Math.polar2rect(this.style.radius.blend(lifetimeProgress, {
        curve: this.style.radiusCurve
      }), this.a)).concat([this.style.size]));
    };
    return Orbital;
  })();
}).call(this);
