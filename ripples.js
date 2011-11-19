(function() {
  var Ripple;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
  this.Ripples = (function() {
    __extends(Ripples, Layer);
    function Ripples() {
      var i;
      Ripples.__super__.constructor.apply(this, arguments);
      this.rotation = Random.float(30, 210, {
        curve: Curve.low2
      }) * [1, -1].random();
      this.composite = ['source-over', 'lighter', 'darker', 'xor'].random({
        curve: Curve.low2
      });
      this.style = {
        speed: Random.float(160, 300, {
          curve: Curve.low
        }),
        baseWidth: [
          Random.float(0.5, 8, {
            curve: Curve.low
          }), Random.float(0.5, 8, {
            curve: Curve.low
          })
        ],
        beatColor: new HSL(stage.mainHue + 180, Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString(),
        emphasisColor: new HSL(stage.mainHue + 180, Random.float(75, 100), 50).toString(),
        emphasisSpeed: Random.float(1, 2, {
          curve: Curve.low
        }),
        motionCurve: [Curve.low, Curve.high].random(),
        alpha: Random.float(0.35, 1, {
          curve: Curve.high2
        }),
        outward: [true, true, false].random(),
        shape: ['circle', 'ngon', 'star'].random(),
        ngon: Random.int(3, 12),
        ngonCurve: [
          0, Random.float(0.2, 1, {
            curve: Curve.high2
          }), Random.float(1, 2.5, {
            curve: Curve.low2
          })
        ].random(),
        starRadiusDiff: [Random.float(0.4, 2), Random.float(0.4, 2)],
        twist: Random.float(5, 45) * [1, -1].random(),
        lineJoin: ['round', 'miter'].random(),
        echoes: [
          Random.int(3, 10, {
            curve: Curve.low
          }), 0
        ].random({
          curve: Curve.low3
        }),
        echoDepth: [
          1, Random.float(1, 1.5, {
            curve: Curve.low
          })
        ].random({
          curve: Curve.low
        }) * [-1, 1].random()
      };
      if (Random.float(1) < 0.25) {
        this.style.starRadiusDiff = [this.style.starRadiusDiff[0]];
      }
      this.elements = (function() {
        var _ref, _results;
        _results = [];
        for (i = 0, _ref = stage.beat.perMeasure; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          _results.push(new Ripple({
            style: this.style,
            beat: i
          }));
        }
        return _results;
      }).call(this);
    }
    Ripples.prototype.expire = function() {
      var e, _i, _len, _ref;
      Ripples.__super__.expire.apply(this, arguments);
      _ref = this.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (!e.dead) {
          e.expired = true;
        }
      }
    };
    Ripples.prototype.render = function(ctx) {
      var e;
      if (this.expired) {
        this.elements = (function() {
          var _i, _len, _ref, _results;
          _ref = this.elements;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            e = _ref[_i];
            if (!e.dead) {
              _results.push(e);
            }
          }
          return _results;
        }).call(this);
        if (this.elements.length === 0) {
          this.kill();
        }
      }
      return ctx.render(__bind(function() {
        var element, _i, _len, _ref, _results;
        ctx.globalCompositeOperation = this.composite;
        ctx.rotate((this.rotation * stage.beat.elapsed * stage.beat.bps).deg2rad() % Math.TAU);
        _ref = this.elements;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          _results.push(element.render(ctx));
        }
        return _results;
      }, this));
    };
    return Ripples;
  })();
  Ripple = (function() {
    function Ripple(options) {
      if (options == null) {
        options = {};
      }
      this.style = options.style;
      this.beat = options.beat;
      this.emphasis = options.beat === 0;
      this.perMeasure = stage.beat.perMeasure;
      this.bps = stage.beat.bps;
      this.alive = false;
      this.offset = -this.beat / this.perMeasure;
      this.lifetime = this.perMeasure / this.bps;
      this.startedAt = stage.beat.startedAt - (this.offset * this.lifetime);
    }
    Ripple.prototype.drawShape = function(ctx, radius, echo) {
      var angle, completion, controlPointAngle, endPointAngle, i, method, pRadius, points, _ref;
      if (radius < 0) {
        return;
      }
      ctx.beginPath();
      radius += echo * ctx.lineWidth * this.style.echoDepth;
      if (radius < 0) {
        radius = 0;
      }
      ctx.globalAlpha = this.style.alpha * Curve.low((this.style.echoes - echo) / this.style.echoes);
      switch (this.style.shape) {
        case 'circle':
          ctx.circle(0, 0, radius);
          break;
        case 'ngon':
          for (i = 0, _ref = this.style.ngon; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
            endPointAngle = i * 360 / this.style.ngon;
            if (i === 0) {
              ctx.moveTo.apply(ctx, polar2rect(radius, endPointAngle));
            } else {
              if (this.style.ngonCurve === 0) {
                ctx.lineTo.apply(ctx, polar2rect(radius, endPointAngle));
              } else {
                controlPointAngle = (i - 0.5) * 360 / this.style.ngon;
                ctx.quadraticCurveTo.apply(ctx, __slice.call(polar2rect(radius * this.style.ngonCurve, controlPointAngle)).concat(__slice.call(polar2rect(radius, endPointAngle))));
              }
            }
          }
          ctx.closePath();
          break;
        case 'star':
          completion = (stage.beat.now - this.startedAt) / this.lifetime;
          points = this.style.ngon * 2;
          for (i = 0; 0 <= points ? i < points : i > points; 0 <= points ? i++ : i--) {
            angle = i * 360 / points;
            pRadius = radius;
            if (i % 2 === 0) {
              pRadius *= this.style.starRadiusDiff.blend(completion);
            }
            method = i === 0 ? 'moveTo' : 'lineTo';
            ctx[method].apply(ctx, polar2rect(pRadius, angle));
          }
          ctx.closePath();
      }
      return ctx.stroke();
    };
    Ripple.prototype.render = function(ctx) {
      var completion, elapsed, speed;
      if (stage.beat.beat() === this.beat) {
        this.alive = true;
      }
      if (!this.alive) {
        return;
      }
      elapsed = stage.beat.now - this.startedAt;
      while (elapsed > this.lifetime) {
        elapsed -= this.lifetime;
        this.startedAt += this.lifetime;
      }
      completion = elapsed / this.lifetime;
      if (completion < this.lastCompletion && this.expired) {
        this.dead = true;
        return;
      }
      this.lastCompletion = completion;
      if (elapsed > 0) {
        speed = this.style.speed;
        if (this.emphasis) {
          speed *= this.style.emphasisSpeed;
        }
        if (this.style.outward) {
          speed *= this.style.motionCurve(completion);
        } else {
          speed *= this.style.motionCurve(1 - completion);
        }
        return ctx.render(__bind(function() {
          var echo, _ref, _results;
          ctx.globalAlpha = this.style.alpha;
          ctx.rotate(this.style.twist.deg2rad() * this.beat);
          ctx.lineJoin = this.style.lineJoin;
          this.setupStroke(ctx, completion);
          _results = [];
          for (echo = 0, _ref = this.style.echoes; 0 <= _ref ? echo <= _ref : echo >= _ref; 0 <= _ref ? echo++ : echo--) {
            _results.push(this.drawShape(ctx, speed, echo));
          }
          return _results;
        }, this));
      }
    };
    Ripple.prototype.setupStroke = function(ctx, completion) {
      if (this.emphasis) {
        ctx.strokeStyle = this.style.emphasisColor;
        return ctx.lineWidth = this.style.baseWidth.blend(completion) * 2 * this.style.emphasisSpeed;
      } else {
        ctx.strokeStyle = this.style.beatColor;
        return ctx.lineWidth = this.style.baseWidth.blend(completion);
      }
    };
    return Ripple;
  })();
}).call(this);
