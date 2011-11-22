(function() {
  var Orbital;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.Orbitals = (function() {
    __extends(Orbitals, Layer);
    function Orbitals() {
      Orbitals.__super__.constructor.apply(this, arguments);
      this.orbitals = [];
      this.beats = 0;
      this.composite = ['source-over', 'lighter', 'darker'].random();
      this.rotation = Random.float(0, 360);
      while (!(Math.abs(this.twist + 360 / stage.beat.perMeasure) > 30)) {
        this.twist = Random.float(20, 270) * [1, -1].random();
      }
      this.count = Random.int(3, 12, {
        curve: Curve.low2
      });
      this.mirror = [true, false].random();
      this.style = {
        color: [new HSL(stage.mainHue + Random.float(150, 210), Random.float(75, 100), 50).toString(), new HSL(stage.mainHue + Random.float(150, 210), Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()].random(),
        size: Random.float(8, 20, {
          curve: Curve.low3
        }),
        radius: [],
        radiusCurve: [Curve.low3, Curve.low2, Curve.low, Curve.linear, Curve.high, Curve.high2, Curve.high3].random(),
        lifetime: Random.float(0.5, stage.beat.perMeasure, {
          curve: Curve.high2
        }) / stage.beat.bps,
        alpha: Random.float(0.4, 0.8),
        alphaBlendPoint: Random.float(0.15, 0.85),
        shape: ['circle', 'square'].random(),
        shapeAspect: Random.float(0.5, 2),
        beatRotation: Random.float(5, 45, {
          curve: Curve.low3
        }),
        strokeWidth: [0, Random.float(0.5, 5)].random(),
        echoes: Random.int(1, 5),
        echoScalar: Random.float(0.05, 0.5, {
          curve: Curve.low2
        })
      };
      this.style.alpha /= this.style.echoes + 1;
      if (this.composite === 'lighter' || this.composite === 'darker') {
        this.style.alpha *= 0.65;
      }
      while (!(Math.abs(this.style.radius[0] - this.style.radius[1]) > 50)) {
        this.style.radius = [Random.float(10, 150), Random.float(10, 150)];
      }
    }
    Orbitals.prototype.onBeat = function() {
      if (this.expired) {
        return;
      }
      this.orbitals.push(new Orbital(this.style, this.beats));
      return this.beats++;
    };
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
        this.kill();
      }
      return ctx.render(__bind(function() {
        ctx.globalCompositeOperation = this.composite;
        this.renderGroup(ctx);
        if (this.mirror) {
          return ctx.render(__bind(function() {
            ctx.scale(-1, 1);
            ctx.rotate(this.rotation.deg2rad());
            return this.renderGroup(ctx);
          }, this));
        }
      }, this));
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
    function Orbital(style, beats) {
      this.style = style;
      this.alive = true;
      this.startedAt = stage.beat.now;
      this.a = 360 / stage.beat.perMeasure * stage.beat.beat();
      this.a += this.style.beatRotation * beats;
    }
    Orbital.prototype.render = function(ctx) {
      var alphaScalar, i, lifetimeProgress, livedFor, size, x, y, _ref, _ref2, _results;
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
      _results = [];
      for (i = 0, _ref2 = this.style.echoes; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
        _results.push((function() {
          switch (this.style.shape) {
            case 'circle':
              size = this.style.size + this.style.size * this.style.echoScalar * i;
              return ctx.fillCircle(x, y, size);
            case 'square':
              size = this.style.size + this.style.size * this.style.echoScalar * i;
              return ctx.fillRect(x - size, y - size, size * 2, size * 2);
          }
        }).call(this));
      }
      return _results;
    };
    return Orbital;
  })();
}).call(this);
