(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.Stage = (function() {
    Stage.maxSize = 2000;
    function Stage() {
      this.stop = __bind(this.stop, this);
      this.start = __bind(this.start, this);
      this.showFps = __bind(this.showFps, this);
      this.render = __bind(this.render, this);
      this.refresh = __bind(this.refresh, this);      var aspect, windowHeight, windowWidth;
      this.canvas = $('canvas');
      this.setup();
      this.canvas.width = parseInt(this.config.width, 10) || 800;
      if (this.config.fullscreen) {
        windowWidth = window.innerWidth.limit(Stage.maxSize);
        windowHeight = window.innerHeight.limit(Stage.maxSize);
        aspect = windowWidth / windowHeight;
        this.canvas.height = this.canvas.width / aspect;
        this.canvas.style.width = "" + windowWidth + "px";
        this.canvas.style.height = "" + windowHeight + "px";
      } else {
        this.canvas.height = 600;
        aspect = this.canvas.width / this.canvas.height;
      }
      this.iphoneSetup();
      this.ctx = this.canvas.getContext('2d');
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(this.canvas.width / 200, this.canvas.height / (200 / aspect));
      this.frames = 0;
      this.startedAt = now();
      this.layers = [];
      this.totalMeasures = null;
      setInterval(this.showFps, 1000);
      if (!this.config.vid) {
        this.start();
      }
    }
    Stage.prototype.setup = function() {
      var key, n, pair, pairs, query, value, _i, _len, _ref;
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
        if (this.config.transitions) {
          this.config.transitions = (function() {
            var _j, _len2, _ref2, _results;
            _ref2 = this.config.transitions.split(',');
            _results = [];
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              n = _ref2[_j];
              _results.push(parseInt(n, 10));
            }
            return _results;
          }).call(this);
        }
        if (this.config.fullscreen) {
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
    Stage.prototype.iphoneSetup = function() {
      if (window.navigator.userAgent.indexOf('iPhone') !== -1) {
        this.iPhone = true;
        window.onorientationchange = function() {
          return window.location.reload(true);
        };
        this.canvas.ontouchmove = function(e) {
          return e.preventDefault();
        };
        if (document.body.clientWidth === 320) {
          this.canvas.width = 320;
          return this.canvas.height = 460;
        } else {
          this.canvas.width = 480;
          return this.canvas.height = 300;
        }
      }
    };
    Stage.prototype.onBeat = function(beatNumber) {
      var layer, _i, _len, _ref;
      _ref = this.layers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        layer = _ref[_i];
        layer.onBeat(beatNumber);
      }
      return $('beat').innerHTML = beatNumber + 1;
    };
    Stage.prototype.onMeasure = function() {
      var layer, _i, _j, _len, _len2, _ref, _ref2, _ref3;
            if ((_ref = this.totalMeasures) != null) {
        _ref;
      } else {
        this.totalMeasures = 0;
      };
      this.totalMeasures++;
      _ref2 = this.layers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        layer = _ref2[_i];
        layer.onMeasure();
      }
      if (this.totalMeasures > 0) {
        if (this.config.transitions) {
          if (this.totalMeasures === this.config.transitions[0]) {
            this.config.transitions.shift();
            if (this.config.transitions.length > 0) {
              this.refresh();
            } else {
              _ref3 = this.layers.slice(1);
              for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
                layer = _ref3[_j];
                layer.expire();
              }
            }
          }
        } else {
          if (this.totalMeasures % 4 === 0) {
            this.refresh();
          }
        }
      }
      return $('measures').innerHTML = this.totalMeasures || 0;
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
        this.beat = new Beat(parseFloat($('bpm').value), parseFloat($('measure').value));
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
        layer.expire();
      }
      if (options.color || !this.layers[0]) {
        this.layers[0] = new Backdrop();
      }
      maxLayers = Random.int(4, 8);
      if (this.iPhone) {
        maxLayers = 3;
      }
      for (i = 0; 0 <= maxLayers ? i < maxLayers : i > maxLayers; 0 <= maxLayers ? i++ : i--) {
        klass = [Ripples, Lattice, Particles, Orbitals].random();
        this.layers.push(new klass());
      }
      if (!this.beat.started) {
        return this.beat.start();
      }
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
        var link, url;
        this.refresh();
        url = "" + (window.location.href.split('#')[0]) + "#" + Random.seedValue;
        link = $('link');
        link.innerHTML = link.href = url;
        return this.render();
      }, this), 0);
    };
    Stage.prototype.stop = function() {
      return this.render = this.showFps = function() {};
    };
    return Stage;
  })();
}).call(this);
