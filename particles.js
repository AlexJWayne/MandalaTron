(function() {
  var Particle;
  var __slice = Array.prototype.slice;

  this.Particles = (function() {

    function Particles() {
      this.count = Random.int(25, 300);
      this.style = {
        rotation: [[0, 0], [Random.float(-180, 180), Random.float(-180, 180)]].random(),
        color: [new HSL(stage.mainHue + 180, Random.float(75, 100), 50).toString(), new HSL(stage.mainHue + 180, Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()].random(),
        speed: [Random.float(0, 80) * stage.beat.bps, Random.float(120, 400) * stage.beat.bps],
        size: [
          Random.float(1, 2), Random.float(2, 8, {
            curve: Curve.low2
          })
        ],
        drag: [Random.float(0, 200) * stage.beat.bps, Random.float(0, 200) * stage.beat.bps],
        lifetime: [Random.float(stage.beat.bps / 2, stage.beat.bps * 2), Random.float(stage.beat.bps / 2, stage.beat.bps * 2)]
      };
      this.lastbeat = null;
      this.particles = [];
    }

    Particles.prototype.render = function(ctx) {
      var i, p, _ref;
      var _this = this;
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
      if (this.lastbeat !== stage.beat.beat()) {
        this.lastbeat = stage.beat.beat();
        for (i = 0, _ref = this.count; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          this.particles.push(new Particle(this.style));
        }
      }
      return ctx["do"](function() {
        var p, _i, _len, _ref2, _results;
        ctx.fillStyle = _this.style.color;
        _ref2 = _this.particles;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          p = _ref2[_i];
          _results.push(p.render(ctx));
        }
        return _results;
      });
    };

    return Particles;

  })();

  Particle = (function() {

    function Particle(style) {
      this.style = style;
      this.startedAt = stage.beat.now || now();
      this.lastFrame = stage.beat.now || now();
      this.alive = true;
      this.pos = [0, 0];
      this.angle = Random.float(360);
      this.vel = polar2rect(Random.float.apply(Random, this.style.speed), this.angle);
      this.size = Random.float.apply(Random, this.style.size);
      this.drag = Random.float.apply(Random, this.style.drag);
      this.rotation = Random.float.apply(Random, this.style.rotation);
      this.lifetime = Random.float.apply(Random, this.style.lifetime);
    }

    Particle.prototype.render = function(ctx) {
      var frameTime, i, livedFor;
      var _this = this;
      livedFor = stage.beat.now - this.startedAt;
      if (livedFor > this.lifetime) {
        return this.alive = false;
      } else {
        frameTime = stage.beat.now - this.lastFrame;
        this.lastFrame = stage.beat.now;
        this.dragVel = polar2rect(this.drag, this.angle);
        for (i = 0; i <= 1; i++) {
          this.vel[i] -= this.dragVel[i] * frameTime;
          this.pos[i] += this.vel[i] * frameTime;
        }
        return ctx["do"](function() {
          ctx.globalAlpha = Curve.high(1 - (livedFor / _this.lifetime));
          ctx.rotate(_this.rotation.deg2rad() * (livedFor / _this.lifetime));
          return ctx.fillCircle.apply(ctx, __slice.call(_this.pos).concat([_this.size]));
        });
      }
    };

    return Particle;

  })();

}).call(this);
