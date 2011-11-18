class @Lattice extends Layer
  constructor: ->
    super
    
    @composite      = ['source-over', ['lighter', 'darker', 'xor'].random()].random()
    @rotation       = Random.float(10, 60, curve:Curve.low) * [1, -1].random()
    @rotOffset      = Random.float(0, @rotOffset)
    @twist          = Random.float(30, 500, curve: Curve.low) * [1, -1].random()
    @twistBeatCurve = [Curve.linear, Curve.ease2, Curve.ease3].random(curve:Curve.low2)
    @segments       = Random.int(3, 12, curve:Curve.low)
    @color          = new HSL((stage.mainHue + 180) % 360, Random.float(100), Random.float(100)).toString()
    @aplha          = Random.float 0.25, 1
    @width          = Random.float(1, 6, curve: Curve.low3)
    @alpha          = Random.float(0.35, 1)
    @taper          = [Random.float(0.2, 0.85, curve:Curve.low2), no].random(curve:Curve.low5)
    @curves =
      r: Curve.low3
      a: [Curve.low5, Curve.low4, Curve.low3, Curve.low2, Curve.linear, Curve.high2, Curve.high3, Curve.high4, Curve.high5].random()
    
    @bornAt = stage.beat.now
    
    step = 0.04
    @points = {}
    @points.control =
      for i in [0..1] by step
        polar2rect @curves.r(i) * 200, @curves.a(i) * @twist
      
    @points.end = []
    for i in [1...@points.control.length]
      point = @points.control[i-1]
      next  = @points.control[i]
      @points.end.push [Math.avg(point[0], next[0]), Math.avg(point[1], next[1])] if point && next
    
    # If compositing lighter or darker, dont be so opaque
    @alpha /= 2 if @composite is 'lighter' or @composite is 'darker'
    
    
  render: (ctx) ->
    return @kill() if @expired && stage.beat.now - @expiredAt > 1/stage.beat.bps
    
    ctx.render =>
      ctx.globalCompositeOperation = @composite
      width = @width
      
      widthScalar =     (stage.beat.now - @bornAt).normalize(0, 1/stage.beat.bps).limit(1)    if stage.beat.now - @bornAt < 1/stage.beat.bps
      widthScalar = 1 - (stage.beat.now - @expiredAt).normalize(0, 1/stage.beat.bps).limit(1) if stage.beat.now > @expiredAt
      
      @taperScalar = @taper * (widthScalar || 1)
      
      if @taper
        ctx.fillStyle = @color
      else
        ctx.strokeStyle = @color
      
      ctx.lineWidth   = @width * (widthScalar || 1)
      ctx.globalAlpha = @alpha
      ctx.rotate (@rotOffset + @rotation * stage.beat.elapsed * stage.beat.bps).deg2rad() % Math.TAU
      
      @renderFan ctx
      
      ctx.render =>
        ctx.scale -1, 1
        @renderFan ctx
  
  renderFan: (ctx) ->
    ctx.render =>
      curvedProgression = stage.beat.beatProgress()
      curvedProgression = @twistBeatCurve curvedProgression
      
      ctx.rotate Math.TAU/@segments * curvedProgression
      
      for i in [0...@segments]
        @renderCurve ctx
        ctx.rotate Math.TAU / @segments
  
  renderCurve: (ctx) ->
    ctx.render =>
      ctx.beginPath()
      ctx.moveTo 0, 0
      
      # Tapered fill
      if @taper
        for i in [0...@points.end.length]
          ctx.quadraticCurveTo @points.control[i]..., @points.end[i]...
        
        ctx.rotate (@taperScalar * @taper * 360/@segments).deg2rad()
        for i in [@points.end.length-1..1]
          ctx.quadraticCurveTo @points.control[i]..., @points.end[i-1]...
        
        ctx.closePath()
        ctx.fill()
      
      # Simple stroke
      else
        for i in [0...@points.end.length]
          ctx.quadraticCurveTo @points.control[i]..., @points.end[i]...
      
        ctx.stroke()