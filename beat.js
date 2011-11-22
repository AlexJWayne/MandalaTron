(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.Beat = (function() {
    function Beat(bpm, perMeasure) {
      this.bpm = bpm;
      this.perMeasure = perMeasure;
      this.bps = this.bpm / 60;
      this.startedAt = now();
      this.update();
      this.started = false;
    }
    Beat.prototype.start = function() {
      var beat;
      this.started = true;
      this.startedAt = now();
      this.update();
      beat = 0;
      setTimeout(__bind(function() {
        return this.intervals = [
          accurateInterval(1000 / this.bps, __bind(function() {
            return stage.onBeat(this.beat());
          }, this)), accurateInterval(1000 * this.perMeasure / this.bps, __bind(function() {
            return stage.onMeasure();
          }, this))
        ];
      }, this), 20);
      return this;
    };
    Beat.prototype.update = function() {
      this.lastFrame = this.now;
      this.now = now();
      this.elapsed = this.now - this.startedAt;
      return this;
    };
    Beat.prototype.beat = function() {
      return Math.floor((this.elapsed * this.bps) % this.perMeasure);
    };
    Beat.prototype.beatProgress = function() {
      return (this.elapsed * this.bps) % 1;
    };
    Beat.prototype.measureProgress = function() {
      return ((this.elapsed * this.bps) % this.perMeasure) / this.perMeasure;
    };
    Beat.prototype.frameTime = function() {
      return this.now - this.lastFrame;
    };
    return Beat;
  })();
}).call(this);
