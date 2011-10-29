(function() {
  this.Sprite = (function() {
    Sprite.generate = function(options) {
      var bpm, bps, i, measure, style, _results;
      if (options == null) {
        options = {};
      }
      style = {
        speed: Random.float(150, 300, {
          curve: Curve.low
        }),
        baseWidth: Random.float(2, 16),
        beatColor: "hsl(" + (stage.mainHue + 180) + ", 25%, " + ([90 - Random.int(30), Random.int(30)].random()) + "%)",
        emphasisColor: "hsl(" + (stage.mainHue + 180) + ", 100%, 50%)",
        emphasisSpeed: Random.float(1, 4, {
          curve: Curve.low
        }),
        motionCurve: Curve.high
      };
      bpm = options.bpm, measure = options.measure;
      bps = options.bpm / 60;
      _results = [];
      for (i = 1; 1 <= measure ? i <= measure : i >= measure; 1 <= measure ? i++ : i--) {
        _results.push(new this({
          bps: bps,
          measure: measure,
          style: style,
          beat: i
        }));
      }
      return _results;
    };
    function Sprite(options) {
      if (options == null) {
        options = {};
      }
      this.style = options.style;
      this.beat = options.beat;
      this.emphasis = options.beat === 1;
      this.measure = options.measure;
      this.bps = options.bps;
      this.offset = (this.beat - 1) / this.measure;
      this.lifetime = this.measure / this.bps;
      this.startedAt = now() - (this.offset * this.lifetime);
    }
    Sprite.prototype.render = function(ctx) {
      var curve, elapsed, speed;
      if (this.emphasis) {
        ctx.strokeStyle = this.style.emphasisColor;
        ctx.lineWidth = this.style.baseWidth * this.bps * 2 * this.emphasisSpeed;
      } else {
        ctx.strokeStyle = this.style.beatColor;
        ctx.lineWidth = this.style.baseWidth * this.bps;
      }
      elapsed = now() - this.startedAt;
      while (elapsed > this.lifetime) {
        elapsed -= this.lifetime;
        this.startedAt += this.lifetime;
      }
      speed = this.style.speed;
      if (this.emphasis) {
        speed *= this.style.emphasisSpeed;
      }
      curve = [Curve];
      return ctx.strokeCircle(0, 0, speed * this.style.motionCurve(elapsed / this.lifetime));
    };
    return Sprite;
  })();
}).call(this);
