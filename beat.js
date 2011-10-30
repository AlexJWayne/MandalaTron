(function() {
  this.Beat = (function() {
    function Beat(bpm, perMeasure) {
      this.bpm = bpm;
      this.perMeasure = perMeasure;
      this.bps = this.bpm / 60;
    }
    Beat.prototype.start = function() {
      this.startedAt = now();
      return this;
    };
    Beat.prototype.update = function() {
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
    return Beat;
  })();
}).call(this);
