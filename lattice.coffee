class @Lattice
  constructor: ->
    @rotation   = Random.float(10, 60, curve:Curve.low) * [1, -1].random()
    @twist      = Random.float(20, 360, curve: Curve.low2) * [1, -1].random()
    @segments   = Random.int 3, 12
    @color      = new HSL((stage.mainHue + 180) % 360, Random.float(100), Random.float(100)).toString()
    @aplha      = Random.float 0.25, 1
    @width      = Random.float 1, 10, curve: Curve.low
    @curves =
      r: [Curve.low2, Curve.low3, Curve.linear, Curve.high2, Curve.high3].random()
      a: [Curve.low2, Curve.low3, Curve.linear, Curve.high2, Curve.high3].random()
    
    step = 0.01
    @points = for i in [step...1] by step
      polar2rect @curves.r(i) * 150, @curves.a(i) * @twist
    
  render: (ctx) ->
    ctx.do =>
      ctx.rotate (@rotation * stage.beat.elapsed / stage.beat.bps).deg2rad() % Math.TAU
      @renderFan ctx
      
      ctx.do =>
        ctx.scale -1, 1
        @renderFan ctx
  
  renderFan: (ctx) ->
    ctx.do =>
      ctx.rotate Math.TAU/@segments * stage.beat.beatProgress()
      ctx.strokeStyle = @color
      ctx.lineWidth   = @width
      ctx.globalAlpha = @alpha
      
      for i in [0...@segments]
        @renderCurve ctx
        ctx.rotate Math.TAU / @segments
  
  renderCurve: (ctx) ->
    ctx.beginPath()
    ctx.moveTo 0, 0
    for i in [0..@points.length] by 2
      if @points[i] && @points[i+1]
        ctx.quadraticCurveTo @points[i]..., @points[i+1]...
    ctx.stroke()