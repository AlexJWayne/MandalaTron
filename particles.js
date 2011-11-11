(function() {
  var Particle;
  var __slice = Array.prototype.slice;

  this.Particles = (function() {

    function Particles() {
      this.count = Random.int(50, 300);
      this.style = {
        color: [new HSL(stage.mainHue + 180, Random.float(75, 100), 50).toString(), new HSL(stage.mainHue + 180, Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()].random(),
        speed: [Random.float(0, 12), Random.float(5, 15)],
        size: [
          Random.float(0.5, 1), Random.float(1, 6, {
            curve: Curve.low2
          })
        ],
        drag: [[Random.float(0, 1), Random.float(0, 1)], [0, 0]].random()
      };
      this.lastbeat = null;
    }

    Particles.prototype.render = function(ctx) {
      var i;
      var _this = this;
      if (this.lastbeat !== stage.beat.beat()) {
        this.lastbeat = stage.beat.beat();
        this.particles = (function() {
          var _ref, _results;
          _results = [];
          for (i = 0, _ref = this.count; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            _results.push(new Particle(this.style));
          }
          return _results;
        }).call(this);
      }
      return ctx["do"](function() {
        var p, _i, _len, _ref, _results;
        ctx.fillStyle = _this.style.color;
        ctx.globalAlpha = Curve.high(1 - stage.beat.beatProgress());
        _ref = _this.particles;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          p = _ref[_i];
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
      this.pos = [0, 0];
      this.angle = Random.float(360);
      this.vel = polar2rect(Random.float.apply(Random, this.style.speed), this.angle);
      this.startedAt = stage.beat.now || now();
      this.size = Random.float.apply(Random, this.style.size);
      this.drag = Random.float.apply(Random, this.style.drag);
    }

    Particle.prototype.render = function(ctx) {
      var i, progress;
      progress = stage.beat.now - this.startedAt;
      this.dragVel = polar2rect(this.drag * progress, this.angle);
      for (i = 0; i <= 1; i++) {
        this.vel[i] -= this.dragVel[i];
        this.pos[i] += this.vel[i] * progress;
      }
      return ctx.fillCircle.apply(ctx, __slice.call(this.pos).concat([this.size]));
    };

    return Particle;

  })();

}).call(this);
