class @Lattice
  constructor: ->
    @twist      = Random.float(20, 360, curve: Curve.low) * [1, -1].random()
    @segments   = Random.int 3, 12
    @mirror     = [yes, no].random curve:Curve.low
    @color      = new HSL((stage.mainHue + 180) % 360, Random.float(100), Random.float(100)).toString()
    @aplha      = Random.float 0.25, 1
    @width      = Random.float 1, 10, curve: Curve.low
    @curves =
      r: [Curve.low, Curve.linear, Curve.high].random()
      a: [Curve.low, Curve.linear, Curve.high].random()
    
  render: (ctx) ->
    step = 0.01
    points = for i in [step...1] by step
      polar2rect @curves.r(i) * 150, @curves.a(i) * @twist
    
    @renderFan ctx, points
    if @mirror
      ctx.do =>
        ctx.scale -1, 1
        @renderFan ctx, points
  
  renderFan: (ctx, points) ->
    ctx.do =>
      ctx.rotate Math.TAU/@segments * stage.beat.beatProgress()
      ctx.strokeStyle = @color
      ctx.lineWidth   = @width
      ctx.globalAlpha = @alpha
      
      for i in [0...@segments]
        @renderCurve ctx, points
        ctx.rotate Math.TAU / @segments
  
  renderCurve: (ctx, points) ->
    ctx.beginPath()
    ctx.moveTo 0, 0
    for i in [0..points.length] by 2
      ctx.quadraticCurveTo points[i]..., points[i+1]... if points[i] && points[i+1]
    ctx.stroke()