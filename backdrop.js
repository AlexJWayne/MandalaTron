(function() {
  this.Backdrop = (function() {
    function Backdrop() {
      this.ctx = stage.ctx;
      this.grad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
      this.grad.addColorStop(0, "hsl(" + stage.mainHue + ", 50%, 25%)");
      this.grad.addColorStop(1, "hsl(" + stage.mainHue + ", 100%, 50%)");
    }
    Backdrop.prototype.render = function(ctx) {
      if (ctx == null) {
        ctx = this.ctx;
      }
      ctx.fillStyle = this.grad;
      return ctx.fillRect(-100, -100, 200, 200);
    };
    return Backdrop;
  })();
}).call(this);
