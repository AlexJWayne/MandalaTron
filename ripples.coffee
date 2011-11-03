class @Ripples
  constructor: ->
    @rotation = Random.float(30, 360, curve:Curve.low) * [1, -1].random()
    
    @style =
      speed:          Random.float(160, 300, curve:Curve.low)
      baseWidth:      [Random.float(1, 8, curve:Curve.low), Random.float(1, 8, curve:Curve.low)]
      beatColor:      new HSL(stage.mainHue + 180, Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()
      emphasisColor:  new HSL(stage.mainHue + 180, Random.float(75, 100), 50).toString()
      emphasisSpeed:  Random.float(1, 2, curve:Curve.low)
      motionCurve:    [Curve.low, Curve.high].random()
      alpha:          Random.float(0.35, 1, curve:Curve.high)
      outward:        [yes, yes, no].random()
      shape:          ['circle', 'ngon', 'star'].random()
      ngon:           Random.int(3, 12)
      starRadiusDiff: [Random.float(0.5, 2), Random.float(0.5, 2)]
      twist:          Random.float(5, 45) * [1, -1].random()
      lineJoin:       ['round', 'miter', 'bevel'].random()
    
    @style.starRadiusDiff = [@style.starRadiusDiff[0]] if Random.float(1) < 0.25
    
    @elements = for i in [0...stage.beat.perMeasure]
      new Ripple { @style, beat: i }
  
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
    return if radius < 0
    ctx.beginPath()
    
    switch @style.shape
      when 'circle'
        ctx.circle 0, 0, radius
    
      when 'ngon'
        for i in [0...@style.ngon]
          angle = i * 360 / @style.ngon
          method = if i == 0 then 'moveTo' else 'lineTo'
          ctx[method] polar2rect(radius, angle)...
        ctx.closePath()
      
      when 'star'
        completion = (stage.beat.now - @startedAt)/@lifetime
        points = @style.ngon * 2
        
        for i in [0...points]
          angle = i * 360 / points
          pRadius = radius
          pRadius *= @style.starRadiusDiff.blend(completion) if i % 2 == 0
          
          method = if i == 0 then 'moveTo' else 'lineTo'
          ctx[method] polar2rect(pRadius, angle)...
        ctx.closePath()
    
    ctx.stroke()
  
  render: (ctx) ->
    elapsed = stage.beat.now - @startedAt    
    while elapsed > @lifetime
      elapsed -= @lifetime
      @startedAt += @lifetime
    
    completion = elapsed / @lifetime
    
    if elapsed > 0      
      speed = @style.speed
      speed *= @style.emphasisSpeed if @emphasis
      
      if @style.outward
        speed *= @style.motionCurve completion
      else
        speed *= @style.motionCurve 1 - completion
      
      ctx.do =>
        ctx.globalAlpha = @style.alpha
        ctx.rotate @style.twist.deg2rad() * @beat
        ctx.lineJoin = @style.lineJoin
        
        if @emphasis
          ctx.strokeStyle = @style.emphasisColor
          ctx.lineWidth   = @style.baseWidth.blend(completion) * @bps * 3 * @style.emphasisSpeed
          
        else
          ctx.strokeStyle = @style.beatColor
          ctx.lineWidth   = @style.baseWidth.blend(completion) * @bps
                
        @drawShape ctx, speed