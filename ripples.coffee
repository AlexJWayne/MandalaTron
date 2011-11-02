class @Ripples
  constructor: ->
    @rotation = Random.float(30, 360, curve:Curve.low) * [1, -1].random()
    
    style =
      speed:          Random.float(160, 300, curve:Curve.low)
      baseWidth:      Random.float(2,   10,  curve:Curve.low)
      beatColor:      new HSL(stage.mainHue + 180, Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()
      emphasisColor:  new HSL(stage.mainHue + 180, 100, 50).toString()
      emphasisSpeed:  Random.float(1, 2, curve:Curve.low)
      motionCurve:    [Curve.low, Curve.high].random()
      alpha:          Random.float(0.35, 1, curve:Curve.high)
      outward:        [yes, yes, no].random()
      shape:          ['circle', 'ngon'].random(curve:Curve.low)
      ngon:           Random.int(3, 8)
      twist:          [0, Random.float(5, 45)].random() * [1, -1].random()
      lineCap:        ['round', 'square', 'butt'].random(curve:Curve.low)
    
    @elements = for i in [0...stage.beat.perMeasure]
      new Ripple { style, beat: i }
  
  render: (ctx) ->
    ctx.do =>
      ctx.rotate (@rotation * stage.beat.elapsed / stage.beat.bps).deg2rad() % Math.TAU
      element.render ctx for element in @elements
  

class Ripple
  constructor: (options = {}) ->
    @style      = options.style
    @beat       = options.beat
    @emphasis   = options.beat == 0
    @perMeasure = stage.beat.perMeasure
    @bps        = stage.beat.bps
    
    @offset     = @beat / @perMeasure
    @lifetime   = @perMeasure / @bps
    
    @startedAt  = stage.beat.startedAt - (@offset * @lifetime)
  
  drawShape: (ctx, radius) ->
    ctx.beginPath()
    
    switch @style.shape
      when 'circle'
        ctx.circle 0, 0, radius
    
      when 'ngon'
        for i in [0...@style.ngon]
          angle = i * Math.TAU / @style.ngon
          method = if i == 0 then 'moveTo' else 'lineTo'
          ctx[method] radius*Math.cos(angle), radius*Math.sin(angle)
        ctx.closePath()
    
    ctx.stroke()
  
  render: (ctx) ->
    ctx.do =>
      ctx.globalAlpha = @style.alpha
      ctx.rotate @style.twist.deg2rad() * @beat
      # ctx.lineCap = @style.lineCap # Why doesn't this work?
    
      if @emphasis
        ctx.strokeStyle = @style.emphasisColor
        ctx.lineWidth   = @style.baseWidth * @bps * 3 * @style.emphasisSpeed
      else
        ctx.strokeStyle = @style.beatColor
        ctx.lineWidth   = @style.baseWidth * @bps
    
      elapsed = stage.beat.now - @startedAt
      if elapsed > 0
        while elapsed > @lifetime
          elapsed -= @lifetime
          @startedAt += @lifetime
        
        speed = @style.speed
        speed *= @style.emphasisSpeed if @emphasis
        
        if @style.outward
          speed *= @style.motionCurve(elapsed/@lifetime)
        else
          speed *= @style.motionCurve(1 - elapsed/@lifetime)
        
        @drawShape ctx, speed