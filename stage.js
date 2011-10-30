(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.Stage = (function() {
    function Stage() {
      this.stop = __bind(this.stop, this);
      this.showFps = __bind(this.showFps, this);
      this.render = __bind(this.render, this);
      this.refresh = __bind(this.refresh, this);      this.canvas = document.getElementById('canvas');
      this.ctx = canvas.getContext('2d');
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(this.canvas.width / 200, this.canvas.height / 200);
      this.frames = 0;
      this.start = now();
      setTimeout(__bind(function() {
        this.refresh();
        return this.render();
      }, this), 0);
    }
    Stage.prototype.refresh = function() {
      this.beat = new Beat(parseFloat(document.getElementById('bpm').value), parseFloat(document.getElementById('measure').value)).start();
      this.mainHue = Random.int(360);
      this.sprites = [];
      this.sprites.push(new Backdrop());
      return this.sprites = this.sprites.concat(Sprite.generate());
    };
    Stage.prototype.render = function() {
      var sprite, _i, _len, _ref;
      this.frames++;
      this.beat.update();
      this.ctx.clearRect(-100, -100, 200, 200);
      this.ctx.fillStyle = "hsl(" + this.mainHue + ", 75%, 25%)";
      this.ctx.fillRect(-100, -100, 200, 200);
      _ref = this.sprites;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sprite = _ref[_i];
        sprite.render(this.ctx);
      }
      return webkitRequestAnimationFrame(this.render, canvas);
    };
    Stage.prototype.showFps = function() {
      var fps, rightNow;
      rightNow = now();
      fps = this.frames / (rightNow - this.start);
      console.log("" + (Math.round(fps)) + "fps");
      this.frames = 0;
      return this.start = rightNow;
    };
    Stage.prototype.stop = function() {
      return this.render = this.showFps = function() {};
    };
    return Stage;
  })();
}).call(this);
