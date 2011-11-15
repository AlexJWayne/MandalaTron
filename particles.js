(function() {
  var Particle;
  var __slice = Array.prototype.slice;

  this.Particles = (function() {

    function Particles() {
      this.count = Random.int(40, 250, {
        curve: Curve.low2
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
        lifetime: [Random.float(stage.beat.bps / 2, stage.beat.bps * 2), Random.float(stage.beat.bps / 2, stage.beat.bps * 2)],
        type: ['circle', 'arc', 'zoom'].random(),
        arcWidth: [
          Random.float(3, 30, {
            curve: Curve.low
          }), Random.float(3, 45, {
            curve: Curve.low
          })
        ]
      };
      if (Random.int(2) === 0) {
        this.style.speed = [0, 0];
        this.style.drag = [Random.float(-100, -300), Random.float(-400, -800)];
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
      this.lastbeat = null;
      this.particles = [];
    }

    Particles.prototype.render = function(ctx) {
      var i, p, _i, _len, _ref, _ref2, _results;
      this.particles = (function() {
        var _i, _len, _ref, _results;
        _ref = this.particles;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
          if (p.alive) _results.push(p);
        }
        return _results;
      }).call(this);
      if (this.expired && this.particles.length === 0) this.dead = true;
      ctx.fillStyle = this.style.color;
      ctx.strokeStyle = this.style.color;
      if (this.lastbeat !== stage.beat.beat() && !this.expired) {
        this.lastbeat = stage.beat.beat();
        for (i = 0, _ref = this.count; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          this.particles.push(new Particle(this.style));
        }
      }
      _ref2 = this.particles;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        p = _ref2[_i];
        _results.push(p.render(ctx));
      }
      return _results;
    };

    return Particles;

  })();

  Particle = (function() {

    function Particle(style) {
      this.style = style;
      this.startedAt = stage.beat.now || now();
      this.lastFrame = stage.beat.now || now();
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
      var livedFor;
      var _this = this;
      livedFor = stage.beat.now - this.startedAt;
      if (livedFor > this.lifetime) {
        return this.alive = false;
      } else {
        this.update();
        return ctx.render(function() {
          ctx.globalAlpha = _this.style.maxAlpha * Curve.high(1 - (livedFor / _this.lifetime));
          ctx.rotate(_this.rotation.deg2rad() * (livedFor / _this.lifetime));
          switch (_this.style.type) {
            case 'circle':
              return _this.renderCircle(ctx);
            case 'arc':
              return _this.renderArc(ctx);
            case 'zoom':
              return _this.renderZoom(ctx);
          }
        });
      }
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
      ctx.lineTo.apply(ctx, polar2rect(r + this.arcWidth * 0.75, a));
      return ctx.stroke();
    };

    Particle.prototype.update = function(ctx) {
      var frameTime, i, _results;
      frameTime = stage.beat.now - this.lastFrame;
      this.lastFrame = stage.beat.now;
      this.dragVel = polar2rect(this.drag, this.angle);
      _results = [];
      for (i = 0; i <= 1; i++) {
        this.vel[i] -= this.dragVel[i] * frameTime;
        _results.push(this.pos[i] += this.vel[i] * frameTime);
      }
      return _results;
    };

    return Particle;

  })();

}).call(this);
