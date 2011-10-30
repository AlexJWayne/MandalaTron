class @Stage
  constructor: ->
    # Fetch canvas
    @canvas = document.getElementById 'canvas'
    @ctx    = canvas.getContext '2d'
    
    # Center canvas bounds
    @ctx.translate @canvas.width/2,   @canvas.height/2
    @ctx.scale     @canvas.width/200, @canvas.height/200
    
    # Setup timings
    @frames = 0
    @start  = now()
    
    # Setup FPS reporter
    # setInterval @showFps, 2000
    
    setTimeout =>
      # Create actors
      @refresh()
      
      # Start the render loop
      @render()
      
    , 0
    
    # setInterval @refresh, 12000
      
    
  refresh: =>
    @beat   = new Beat(
                parseFloat(document.getElementById('bpm').value)
                parseFloat(document.getElementById('measure').value)
              ).start()
    
    @mainHue = Random.int 360
    @sprites = []
    
    # Backdrop
    @sprites.push new Backdrop()
    
    # Beat sprites
    @sprites = @sprites.concat Sprite.generate()
  
  render: =>
    @frames++
    
    # Keep time
    @beat.update()
    
    # Clear
    @ctx.clearRect -100, -100, 200, 200
    
    @ctx.fillStyle = "hsl(#{ @mainHue }, 75%, 25%)"
    @ctx.fillRect -100, -100, 200, 200
    
    # Render all sprites
    sprite.render @ctx for sprite in @sprites
    
    # Schedule next render
    webkitRequestAnimationFrame @render, canvas
  
  showFps: =>
    rightNow = now()
    fps = @frames / (rightNow - @start)
    console.log "#{ Math.round fps }fps"
    
    @frames = 0
    @start  = rightNow
  
  stop: =>
    @render = @showFps = ->