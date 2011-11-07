class @Lattice
  constructor: ->
    @rotation       = Random.float(10, 60, curve:Curve.low) * [1, -1].random()
    @twist          = Random.float(30, 360, curve: Curve.low2) * [1, -1].random()
    @twistBeatCurve = [Curve.linear, Curve.ease2, Curve.ease3].random(curve:Curve.low2)
    @segments       = Random.int 3, 12
    @color          = new HSL((stage.mainHue + 180) % 360, Random.float(100), Random.float(100)).toString()
    @aplha          = Random.float 0.25, 1
    @width          = Random.float(1, 8, curve: Curve.low3)
    @alpha          = Random.float(0.35, 1)
    @curves =
      r: [Curve.low2, Curve.low3, Curve.linear, Curve.high2, Curve.high3].random()
      a: [Curve.low2, Curve.low3, Curve.linear, Curve.high2, Curve.high3].random()
    
    step = 0.05
    
    @points = {}
    @points.control = 
      for i in [0..1.2] by step
        polar2rect @curves.r(i) * 175, @curves.a(i) * @twist
      
    @points.end = []
    for i in [1...@points.control.length]
      point = @points.control[i-1]
      next  = @points.control[i]
      @points.end.push [Math.avg(point[0], next[0]), Math.avg(point[1], next[1])] if point && next
    
  render: (ctx) ->
    ctx.do =>
      ctx.rotate (@rotation * stage.beat.elapsed / stage.beat.bps).deg2rad() % Math.TAU
      @renderFan ctx
      
      ctx.do =>
        ctx.scale -1, 1
        @renderFan ctx
  
  renderFan: (ctx) ->
    ctx.do =>
      curvedProgression = stage.beat.beatProgress()
      curvedProgression = @twistBeatCurve curvedProgression
      
      ctx.rotate Math.TAU/@segments * curvedProgression
      ctx.strokeStyle = @color
      ctx.lineWidth   = @width
      ctx.globalAlpha = @alpha
      
      for i in [0...@segments]
        @renderCurve ctx
        ctx.rotate Math.TAU / @segments
  
  renderCurve: (ctx) ->
    ctx.beginPath()
    ctx.moveTo 0, 0
    
    for i in [0...@points.end.length]
      ctx.quadraticCurveTo @points.control[i]..., @points.end[i]...
      
    ctx.stroke()    