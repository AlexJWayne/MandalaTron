class @Stage
  constructor: ->
    # Fetch canvas
    @canvas = document.getElementById 'canvas'
    
    # Size canvas
    if document.body.clientWidth < @canvas.width
      @canvas.width = @canvas.height = document.body.clientWidth
    
    # Fetch drawing context
    @ctx = @canvas.getContext '2d'
    
    # Center canvas bounds
    @ctx.translate @canvas.width/2,   @canvas.height/2
    @ctx.scale     @canvas.width/200, @canvas.height/200
    
    # Setup timings
    @frames = 0
    @start  = now()
    
    # Setup FPS reporter
    setInterval @showFps, 5000
    
    setTimeout =>
      # Create actors
      @refresh()
      
      # Start the render loop
      @render()
      
    , 0
      
    
  refresh: (newBeat = yes) =>
    Random.seed()    
    document.getElementById('link').innerHTML = "#{ window.location.href.split('#')[0] }##{ document.getElementById('seed').value }"
    
    if newBeat
      @beat = new Beat(
                parseFloat(document.getElementById('bpm').value)
                parseFloat(document.getElementById('measure').value)
              ).start()
    
    @mainHue = Random.int 360
    @layers = []
    
    # Backdrop
    @layers.push new Backdrop()
    
    for i in [0..Random.int(1, 5, curve:Curve.low)]
      klass = [Ripples, Lattice].random()
      @layers.push new klass()    
    
    return
  
  render: =>
    @frames++
    
    # Keep time
    @beat.update()
    
    # Clear
    @ctx.clearRect -100, -100, 200, 200
    
    @ctx.fillStyle = "hsl(#{ @mainHue }, 75%, 25%)"
    @ctx.fillRect -100, -100, 200, 200
    
    # @layers = [@layers[0], @layers[1]] # TEMP
    
    # Render all sprites
    layer.render @ctx for layer in @layers
    
    # Schedule next render
    requestAnimFrame @render, canvas
    
    # @stop() # TEMP
      
  showFps: =>
    rightNow = now()
    fps = @frames / (rightNow - @start)
    console.log "#{ Math.round fps }fps"
    
    @frames = 0
    @start  = rightNow
  
  stop: =>
    @render = @showFps = ->