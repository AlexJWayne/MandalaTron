(function() {
  this.Layer = (function() {
    function Layer() {
      this.expired = false;
      this.dead = false;
    }
    Layer.prototype.onBeat = function(beatNumber) {};
    Layer.prototype.onMeasure = function() {};
    Layer.prototype.expire = function() {
      this.expired = true;
      return this.expiredAt = stage.beat.now;
    };
    Layer.prototype.kill = function() {
      return this.dead = true;
    };
    return Layer;
  })();
}).call(this);
