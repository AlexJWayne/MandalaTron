class @Backdrop
  constructor: ->
    @ctx = stage.ctx
    @grad = @ctx.createRadialGradient 0, 0, 0, 0, 0, 150
    @grad.addColorStop 0, "hsl(#{ stage.mainHue }, 50%, 25%)"
    @grad.addColorStop 1, "hsl(#{ stage.mainHue }, 100%, 50%)"
  
  render: (ctx = @ctx) ->
    ctx.fillStyle = @grad
    ctx.fillRect -100, -100, 200, 200