(function() {
  var Particle;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  this.Particles = (function() {
    __extends(Particles, Layer);
    function Particles() {
      Particles.__super__.constructor.apply(this, arguments);
      this.count = Random.int(40, 200, {
        curve: Curve.low
      });
      this.composite = ['source-over', 'lighter', 'darker'].random({
        curve: Curve.low
      });
      this.style = {
        rotation: [[Random.float(-270, 270), Random.float(-270, 270)], [0, 0]].random({
          curve: Curve.low2
        }),
        color: [new HSL(stage.mainHue + Random.float(150, 210), Random.float(75, 100), 50).toString(), new HSL(stage.mainHue + Random.float(150, 210), Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()].random(),
        maxAlpha: Random.float(0.25, 1, {
          curve: Curve.high
        }),
        size: [
          Random.float(1, 2), Random.float(2, 8, {
            curve: Curve.low3
          })
        ],
        lifetime: [Random.float(0.5, 2) / stage.beat.bps, Random.float(0.5, 2) / stage.beat.bps],
        type: ['circle', 'arc', 'zoom'].random(),
        arcWidth: [
          Random.float(3, 30, {
            curve: Curve.low
          }), Random.float(3, 45, {
            curve: Curve.low
          })
        ],
        zoomLengthScalar: Random.float(40, 130, {
          curve: Curve.low
        })
      };
      if (this.composite === 'lighter' || this.composite === 'darker') {
        this.style.alpha /= 2;
      }
      if (Random.int(2) === 0) {
        this.style.speed = [0, 0];
        this.style.drag = [Random.float(-100, -300) * stage.beat.bps, Random.float(-400, -800) * stage.beat.bps];
        this.style.spawnRadius = [0, 0];
      } else {
        this.style.speed = [Random.float(0, 80) * stage.beat.bps, Random.float(100, 400) * stage.beat.bps];
        this.style.drag = [Random.float(0, 200) * stage.beat.bps, Random.float(0, 200) * stage.beat.bps];
        this.style.spawnRadius = [
          Random.float(0, 15, {
            curve: Curve.low2
          }), Random.float(0, 30, {
            curve: Curve.low2
          })
        ];
      }
      switch (this.style.type) {
        case 'zoom':
          this.style.spawnRadius[0] /= 2;
          this.style.spawnRadius[1] /= 2;
          this.count *= 0.75;
          break;
        case 'arc':
          this.count *= 0.6;
      }
      this.particles = [];
    }
    Particles.prototype.onBeat = function() {
      var i, _ref;
      if (this.expired) {
        return;
      }
      for (i = 0, _ref = this.count; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        this.particles.push(new Particle(this.style));
      }
    };
    Particles.prototype.render = function(ctx) {
      return ctx.render(__bind(function() {
        var p, _i, _len, _ref, _results;
        this.particles = (function() {
          var _i, _len, _ref, _results;
          _ref = this.particles;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            p = _ref[_i];
            if (p.alive) {
              _results.push(p);
            }
          }
          return _results;
        }).call(this);
        if (this.expired && this.particles.length === 0) {
          this.kill();
        }
        ctx.fillStyle = this.style.color;
        ctx.strokeStyle = this.style.color;
        ctx.globalCompositeOperation = this.composite;
        _ref = this.particles;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          _results.push(p.render(ctx));
        }
        return _results;
      }, this));
    };
    return Particles;
  })();
  Particle = (function() {
    function Particle(style) {
      this.style = style;
      this.startedAt = stage.beat.now || now();
      this.alive = true;
      this.angle = Random.float(360);
      this.pos = polar2rect(Random.float.apply(Random, this.style.spawnRadius), this.angle);
      this.vel = polar2rect(Random.float.apply(Random, this.style.speed), this.angle);
      this.size = Random.float.apply(Random, this.style.size);
      this.drag = Random.float.apply(Random, this.style.drag);
      this.rotation = Random.float.apply(Random, this.style.rotation);
      this.lifetime = Random.float.apply(Random, this.style.lifetime);
      this.arcWidth = Random.float.apply(Random, this.style.arcWidth);
    }
    Particle.prototype.render = function(ctx) {
      var lifeProgession, livedFor;
      livedFor = stage.beat.now - this.startedAt;
      lifeProgession = livedFor / this.lifetime;
      if (livedFor > this.lifetime) {
        return this.alive = false;
      }
      this.update();
      return ctx.render(__bind(function() {
        ctx.globalAlpha = this.style.maxAlpha * Curve.high(1 - lifeProgession);
        ctx.rotate(this.rotation.deg2rad() * lifeProgession);
        switch (this.style.type) {
          case 'circle':
            return this.renderCircle(ctx);
          case 'arc':
            return this.renderArc(ctx);
          case 'zoom':
            return this.renderZoom(ctx);
        }
      }, this));
    };
    Particle.prototype.renderCircle = function(ctx) {
      return ctx.fillCircle.apply(ctx, __slice.call(this.pos).concat([this.size]));
    };
    Particle.prototype.renderArc = function(ctx) {
      var a, r, _ref;
      ctx.lineWidth = this.size * 0.75;
      ctx.lineCap = 'round';
      _ref = rect2polar.apply(null, this.pos), r = _ref[0], a = _ref[1];
      ctx.beginPath();
      ctx.arc(0, 0, r, (a - this.arcWidth).deg2rad(), (a + this.arcWidth).deg2rad());
      return ctx.stroke();
    };
    Particle.prototype.renderZoom = function(ctx) {
      var a, r, _ref;
      ctx.lineWidth = this.size * 0.75;
      ctx.lineCap = 'round';
      _ref = rect2polar.apply(null, this.pos), r = _ref[0], a = _ref[1];
      ctx.beginPath();
      ctx.moveTo.apply(ctx, this.pos);
      ctx.lineTo.apply(ctx, polar2rect(r + this.arcWidth * r.normalize(this.style.zoomLengthScalar), a));
      return ctx.stroke();
    };
    Particle.prototype.update = function(ctx) {
      var i, _results;
      this.dragVel = polar2rect(this.drag, this.angle);
      _results = [];
      for (i = 0; i <= 1; i++) {
        this.vel[i] -= this.dragVel[i] * stage.beat.frameTime();
        _results.push(this.pos[i] += this.vel[i] * stage.beat.frameTime());
      }
      return _results;
    };
    return Particle;
  })();
}).call(this);
