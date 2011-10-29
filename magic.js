(function() {
  var extendPrototype;
  extendPrototype = function(base, methods) {
    var method, name;
    for (name in methods) {
      method = methods[name];
      base.prototype[name] = method;
    }
  };
  Math.TAU = Math.PI * 2;
  window.now = function() {
    return new Date().getTime() / 1000;
  };
  extendPrototype(CanvasRenderingContext2D, {
    circle: function(x, y, radius) {
      return this.arc(x, y, radius, 0, Math.TAU);
    },
    fillCircle: function(x, y, radius) {
      this.beginPath();
      this.circle(x, y, radius);
      this.closePath();
      return this.fill();
    },
    strokeCircle: function(x, y, radius) {
      this.beginPath();
      this.circle(x, y, radius);
      this.closePath();
      return this.stroke();
    }
  });
  window.refresh = function() {
    return window.sprites = Sprite.generate({
      bpm: parseFloat(document.getElementById('bpm').value),
      measure: parseFloat(document.getElementById('measure').value)
    });
  };
  window.onLoad = function() {
    var canvas, canvasHeight, canvasWidth, ctx, draw, frames, showFps, start;
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.scale(canvasWidth / 200, canvasHeight / 200);
    frames = 0;
    start = now();
    refresh();
    draw = function() {
      var grad, sprite, _i, _len;
      frames++;
      ctx.clearRect(-100, -100, 200, 200);
      grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
      grad.addColorStop(0.0, '#f00');
      grad.addColorStop(0.02, '#000');
      grad.addColorStop(1.0, '#00f');
      ctx.fillStyle = grad;
      ctx.fillRect(-100, -100, 200, 200);
      for (_i = 0, _len = sprites.length; _i < _len; _i++) {
        sprite = sprites[_i];
        sprite.render(ctx);
      }
      return webkitRequestAnimationFrame(draw, canvas);
    };
    showFps = function() {
      var fps, rightNow;
      rightNow = now();
      fps = frames / (rightNow - start);
      console.log("" + (Math.round(fps)) + "fps");
      frames = 0;
      return start = rightNow;
    };
    draw();
    setInterval(showFps, 2000);
    return window.stop = function() {
      return draw = function() {};
    };
  };
  this.Sprite = (function() {
    Sprite.generate = function(options) {
      var bpm, bps, i, measure, _results;
      if (options == null) {
        options = {};
      }
      bpm = options.bpm, measure = options.measure;
      bps = options.bpm / 60;
      _results = [];
      for (i = 1; 1 <= measure ? i <= measure : i >= measure; 1 <= measure ? i++ : i--) {
        _results.push(new this({
          bps: bps,
          measure: measure,
          beat: i
        }));
      }
      return _results;
    };
    function Sprite(options) {
      if (options == null) {
        options = {};
      }
      this.beat = options.beat;
      this.emphasis = options.beat === 1;
      this.measure = options.measure;
      this.bps = options.bps;
      this.offset = (this.beat - 1) / this.measure;
      this.lifetime = this.measure / this.bps;
      this.startedAt = now() - (this.offset * this.lifetime);
    }
    Sprite.prototype.render = function(ctx) {
      var elapsed;
      if (this.emphasis) {
        ctx.strokeStyle = 'rgba(255,255,0, 0.75)';
        ctx.lineWidth = 10 * this.bps;
      } else {
        ctx.strokeStyle = 'rgba(255,255,255, 0.5)';
        ctx.lineWidth = 5 * this.bps;
      }
      elapsed = now() - this.startedAt;
      while (elapsed > this.lifetime) {
        elapsed -= this.lifetime;
        this.startedAt += this.lifetime;
      }
      return ctx.strokeCircle(0, 0, 150 * (elapsed / this.lifetime));
    };
    return Sprite;
  })();
}).call(this);
