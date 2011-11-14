(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Stage = (function() {

    function Stage() {
      this.stop = __bind(this.stop, this);
      this.showFps = __bind(this.showFps, this);
      this.render = __bind(this.render, this);
      this.refresh = __bind(this.refresh, this);
      var aspect, music;
      var _this = this;
      this.canvas = document.getElementById('canvas');
      this.canvas.width = 800;
      this.canvas.height = 600;
      if (window.navigator.userAgent.indexOf('iPhone') !== -1) {
        this.iPhone = true;
        document.getElementById('cycle').checked = true;
        window.onorientationchange = function() {
          return window.location.reload(true);
        };
        this.canvas.ontouchmove = function(e) {
          return e.preventDefault();
        };
        music = document.getElementById('music');
        music.parentNode.removeChild(music);
        if (document.body.clientWidth === 320) {
          this.canvas.width = 320;
          this.canvas.height = 460;
        } else {
          this.canvas.width = 480;
          this.canvas.height = 300;
        }
      }
      this.ctx = this.canvas.getContext('2d');
      aspect = this.canvas.width / this.canvas.height;
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(this.canvas.width / 200, this.canvas.height / (200 / aspect));
      this.frames = 0;
      this.start = now();
      setInterval(this.showFps, 5000);
      setTimeout(function() {
        _this.refresh();
        document.getElementById('link').innerHTML = "" + (window.location.href.split('#')[0]) + "#" + Random.seedValue;
        return _this.render();
      }, 0);
    }

    Stage.prototype.refresh = function(options) {
      var i, klass, maxLayers;
      var _this = this;
      if (options == null) options = {};
      if (options.randomize || !(Random.seedValue != null)) Random.seed();
      if (options.beat || !(this.beat != null)) {
        this.beat = new Beat(parseFloat(document.getElementById('bpm').value), parseFloat(document.getElementById('measure').value)).start();
      }
      this.mainHue = Random.int(360);
      this.layers = [];
      this.layers.push(new Backdrop());
      maxLayers = Random.int(3, 6);
      if (this.iPhone) maxLayers = 3;
      for (i = 0; 0 <= maxLayers ? i <= maxLayers : i >= maxLayers; 0 <= maxLayers ? i++ : i--) {
        klass = [Ripples, Lattice, Particles].random();
        this.layers.push(new klass());
      }
      if (this.swapTimeout) clearTimeout(this.swapTimeout);
      return this.swapTimeout = setInterval(function() {
        if (document.getElementById('cycle').checked) {
          return _this.refresh({
            randomize: true,
            beat: false
          });
        }
      }, this.beat.perMeasure / this.beat.bps * 4 * 1000);
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
      return requestAnimFrame(this.render, this.canvas);
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
