class @Lattice
  constructor: ->
    @rotation       = Random.float(10, 60, curve:Curve.low) * [1, -1].random()
    @rotOffset      = Random.float(0, @rotOffset)
    @twist          = Random.float(30, 450, curve: Curve.low) * [1, -1].random()
    @twistBeatCurve = [Curve.linear, Curve.ease2, Curve.ease3].random(curve:Curve.low2)
    @segments       = Random.int 3, 12
    @color          = new HSL((stage.mainHue + 180) % 360, Random.float(100), Random.float(100)).toString()
    @aplha          = Random.float 0.25, 1
    @width          = Random.float(1, 6, curve: Curve.low3)
    @alpha          = Random.float(0.35, 1)
    @curves =
      r: Curve.low3
      a: [Curve.low5, Curve.low4, Curve.low3, Curve.low2, Curve.linear, Curve.high2, Curve.high3, Curve.high4, Curve.high5].random()
    
    step = 0.05
    
    @points = {}
    @points.control =
      for i in [0..1] by step
        polar2rect @curves.r(i) * 175, @curves.a(i) * @twist
      
    @points.end = []
    for i in [1...@points.control.length]
      point = @points.control[i-1]
      next  = @points.control[i]
      @points.end.push [Math.avg(point[0], next[0]), Math.avg(point[1], next[1])] if point && next
    
  render: (ctx) ->
    return @dead = yes if @expired && stage.beat.now - @expiredAt > 1/stage.beat.bps
    
    @bornAt    ||= stage.beat.now
    @expiredAt ||= stage.beat.now if @expired
    
    ctx.render =>
      width = @width
      width *=     (stage.beat.now - @bornAt).normalize(0, 1/stage.beat.bps).limit(1)    if stage.beat.now - @bornAt < 1/stage.beat.bps
      width *= 1 - (stage.beat.now - @expiredAt).normalize(0, 1/stage.beat.bps).limit(1) if stage.beat.now > @expiredAt
      
      ctx.strokeStyle = @color
      ctx.lineWidth   = width
      ctx.globalAlpha = @alpha
      ctx.rotate (@rotOffset + @rotation * stage.beat.elapsed / stage.beat.bps).deg2rad() % Math.TAU
      
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
    ctx.beginPath()
    ctx.moveTo 0, 0
    
    for i in [0...@points.end.length]
      ctx.quadraticCurveTo @points.control[i]..., @points.end[i]...
      
    ctx.stroke()    