(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.Stage = (function() {
    function Stage() {
      this.stop = __bind(this.stop, this);
      this.showFps = __bind(this.showFps, this);
      this.render = __bind(this.render, this);
      this.refresh = __bind(this.refresh, this);      this.canvas = document.getElementById('canvas');
      if (document.body.clientWidth < this.canvas.width) {
        this.canvas.width = this.canvas.height = document.body.clientWidth;
      }
      this.ctx = canvas.getContext('2d');
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(this.canvas.width / 200, this.canvas.height / 200);
      this.frames = 0;
      this.start = now();
      setInterval(this.showFps, 5000);
      setTimeout(__bind(function() {
        this.refresh();
        return this.render();
      }, this), 0);
    }
    Stage.prototype.refresh = function(newBeat) {
      var i, _ref;
      if (newBeat == null) {
        newBeat = true;
      }
      Random.seed();
      if (newBeat) {
        this.beat = new Beat(parseFloat(document.getElementById('bpm').value), parseFloat(document.getElementById('measure').value)).start();
      }
      this.mainHue = Random.int(360);
      this.layers = [];
      this.layers.push(new Backdrop());
      for (i = 0, _ref = Random.int(1, 5, {
        curve: Curve.low
      }); 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        this.layers = this.layers.concat(new Ripples());
      }
    };
    Stage.prototype.render = function() {
      var layer, _i, _len, _ref;
      this.frames++;
      this.beat.update();
      this.ctx.clearRect(-100, -100, 200, 200);
      this.ctx.fillStyle = "hsl(" + this.mainHue + ", 75%, 25%)";
      this.ctx.fillRect(-100, -100, 200, 200);
      _ref = this.layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        layer.render(this.ctx);
      }
      return requestAnimFrame(this.render, canvas);
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
