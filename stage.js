(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.Stage = (function() {
    function Stage() {
      this.stop = __bind(this.stop, this);
      this.start = __bind(this.start, this);
      this.showFps = __bind(this.showFps, this);
      this.render = __bind(this.render, this);
      this.refresh = __bind(this.refresh, this);      var aspect;
      this.canvas = $('canvas');
      this.canvas.width = 800;
      this.canvas.height = 600;
      if (window.navigator.userAgent.indexOf('iPhone') !== -1) {
        this.iPhone = true;
        $('cycle').checked = true;
        window.onorientationchange = function() {
          return window.location.reload(true);
        };
        this.canvas.ontouchmove = function(e) {
          return e.preventDefault();
        };
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
      this.startedAt = now();
      this.layers = [];
      setInterval(this.showFps, 1000);
      this.setup();
      if (!this.config.vid) {
        this.start();
      }
    }
    Stage.prototype.setup = function() {
      var key, pair, pairs, query, value, _i, _len, _ref;
      this.config = {};
      if (query = window.location.search.slice(1)) {
        pairs = query.split('&');
        for (_i = 0, _len = pairs.length; _i < _len; _i++) {
          pair = pairs[_i];
          _ref = pair.split('='), key = _ref[0], value = _ref[1];
          this.config[key] = value;
        }
        if (this.config.bpm) {
          $('bpm').value = this.config.bpm;
        }
        if (this.config.measure) {
          $('measure').value = this.config.measure;
        }
        if (this.config.fullscreen) {
          $('fullscreen').checked = true;
          this.canvas.className = 'fullscreen';
        }
        if (this.config.vid) {
          $('video').innerHTML = '<embed src="http://www.youtube.com/e/' + this.config.vid + '?version=3&enablejsapi=1&playerapiid=videoplayer" type="application/x-shockwave-flash" width="853" height="480" allowscriptaccess="always" allowfullscreen="true" id="videoplayer"></embed>';
          window.onYouTubePlayerReady = function() {
            var player;
            player = $('videoplayer');
            return setTimeout(function() {
              player.playVideo();
              return player.addEventListener('onStateChange', 'onYouTubePlayerStateChange');
            }, 1500);
          };
          return window.onYouTubePlayerStateChange = __bind(function(state) {
            var player;
            if (state.toString() === '1') {
              player = $('videoplayer');
              player.width = 480;
              player.height = 32;
              return setTimeout(this.start, (parseFloat(this.config.vidt) * 1000) || 0);
            }
          }, this);
        }
      }
    };
    Stage.prototype.refresh = function(options) {
      var i, klass, layer, maxLayers, _i, _len, _ref;
      if (options == null) {
        options = {};
      }
      if (options.randomize || !Random.seedValue) {
        Random.seed();
      }
      if (options.beat || !this.beat) {
        this.beat = new Beat(parseFloat($('bpm').value), parseFloat($('measure').value)).start();
      }
      if (this.mainHue) {
        this.mainHue += Random.int(-90, 90);
        if (this.mainHue > 360) {
          this.mainHue -= 360;
        }
        if (this.mainHue < 0) {
          this.mainHue += 360;
        }
      } else {
        this.mainHue = Random.int(360);
      }
      _ref = this.layers.slice(1);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        layer.expired = true;
      }
      if (options.color || !this.layers[0]) {
        this.layers[0] = new Backdrop();
      }
      maxLayers = Random.int(4, 7);
      if (this.iPhone) {
        maxLayers = 3;
      }
      for (i = 0; 0 <= maxLayers ? i < maxLayers : i > maxLayers; 0 <= maxLayers ? i++ : i--) {
        klass = [Ripples, Lattice, Particles, Orbitals].random();
        this.layers.push(new klass());
      }
      if (this.swapTimeout) {
        clearTimeout(this.swapTimeout);
      }
      return this.swapTimeout = setInterval(__bind(function() {
        if ($('cycle').checked) {
          return this.refresh({
            randomize: true,
            beat: false
          });
        }
      }, this), this.beat.perMeasure / this.beat.bps * 4 * 1000);
    };
    Stage.prototype.render = function() {
      var layer, _i, _len, _ref;
      this.frames++;
      this.beat.update();
      this.layers = (function() {
        var _i, _len, _ref, _results;
        _ref = this.layers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          layer = _ref[_i];
          if (!layer.dead) {
            _results.push(layer);
          }
        }
        return _results;
      }).call(this);
      _ref = this.layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        layer.render(this.ctx);
      }
      return requestAnimFrame(this.render, this.canvas);
    };
    Stage.prototype.showFps = function() {
      var fps, rightNow;
      this.fps || (this.fps = $('fpscount'));
      rightNow = now();
      fps = Math.round(this.frames / (rightNow - this.startedAt));
      this.fps.innerHTML = fps;
      this.frames = 0;
      return this.startedAt = rightNow;
    };
    Stage.prototype.start = function() {
      return setTimeout(__bind(function() {
        this.refresh();
        $('link').innerHTML = "" + (window.location.href.split('#')[0]) + "#" + Random.seedValue;
        return this.render();
      }, this), 0);
    };
    Stage.prototype.stop = function() {
      return this.render = this.showFps = function() {};
    };
    return Stage;
  })();
}).call(this);
