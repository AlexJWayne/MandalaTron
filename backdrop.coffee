class @Backdrop
  constructor: ->
    @ctx = stage.ctx
    @hueShift = Random.int -90, 90
    @innerSat = Random.int 0, 100, curve: Curve.low
    @outerSat = Random.int 0, 100, curve: Curve.high
    
  render: (ctx = @ctx) ->
    
    coef = Curve.low stage.beat.measureProgress()
        
    grad = @ctx.createRadialGradient 0, 0, 0, 0, 0, 150
    grad.addColorStop 0, "hsl(#{ stage.mainHue + @hueShift*coef }, #{ @innerSat }%, #{ (60 - coef*60).toFixed(5) }%)"
    grad.addColorStop 1, "hsl(#{ stage.mainHue + @hueShift*coef }, #{ @outerSat }%, #{ (0  + coef*60).toFixed(5) }%)"
    
    ctx.fillStyle = grad
    ctx.fillRect -100, -100, 200, 200