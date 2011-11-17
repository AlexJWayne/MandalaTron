(function() {
  var Orbital;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.Orbitals = (function() {
    function Orbitals() {
      this.orbitals = [];
      this.lastbeat = -1;
      this.rotation = Random.float(0, 360);
      while (!(Math.abs(this.twist + 360 / stage.beat.perMeasure) > 30)) {
        this.twist = Random.float(20, 270) * [1, -1].random();
      }
      this.count = Random.int(3, 9);
      this.mirror = [true, false].random();
      this.style = {
        color: [new HSL(stage.mainHue + Random.float(150, 210), Random.float(75, 100), 50).toString(), new HSL(stage.mainHue + Random.float(150, 210), Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()].random(),
        size: Random.float(8, 25, {
          curve: Curve.low2
        }),
        radius: [],
        radiusCurve: [Curve.low3, Curve.low2, Curve.low, Curve.linear, Curve.high, Curve.high2, Curve.high3].random(),
        lifetime: Random.float(0.5, stage.beat.perMeasure) / stage.beat.bps,
        alpha: Random.float(0.4, 0.9),
        alphaBlendPoint: Random.float(0.1, 0.9),
        shape: ['circle', 'square'].random(),
        shapeAspect: Random.float(0.5, 2)
      };
      while (!(Math.abs(this.style.radius[0] - this.style.radius[1]) > 50)) {
        this.style.radius = [Random.float(20, 150), Random.float(20, 150)];
      }
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
        twist = this.twist * stage.beat.elapsed * stage.beat.bps;
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
      var alphaScalar, lifetimeProgress, livedFor, x, y, _ref;
      livedFor = stage.beat.now - this.startedAt;
      if (livedFor > this.style.lifetime) {
        return this.alive = false;
      }
      lifetimeProgress = livedFor / this.style.lifetime;
      alphaScalar = lifetimeProgress < this.style.alphaBlendPoint ? lifetimeProgress.normalize(0, this.style.alphaBlendPoint) : lifetimeProgress.normalize(1, this.style.alphaBlendPoint);
      ctx.globalAlpha = this.style.alpha * alphaScalar;
      ctx.fillStyle = this.style.color;
      _ref = Math.polar2rect(this.style.radius.blend(lifetimeProgress, {
        curve: this.style.radiusCurve
      }), this.a), x = _ref[0], y = _ref[1];
      switch (this.style.shape) {
        case 'circle':
          return ctx.fillCircle(x, y, this.style.size);
        case 'square':
          return ctx.fillRect(x - this.style.size, y - this.style.size, this.style.size * 2, this.style.size * 2);
      }
    };
    return Orbital;
  })();
}).call(this);
