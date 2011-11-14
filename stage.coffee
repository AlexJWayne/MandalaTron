
class @Stage
  constructor: ->
    # Fetch canvas
    @canvas = document.getElementById 'canvas'
    @canvas.width = 800
    @canvas.height = 600
    
    # setup iPhone web app
    if window.navigator.userAgent.indexOf('iPhone') != -1
      
      #Save iPhone state
      @iPhone = yes
      
      # Turn on autocycler
      document.getElementById('cycle').checked = yes
      
      # refresh on orientation change
      window.onorientationchange = -> window.location.reload yes
      
      # disable scrolling
      @canvas.ontouchmove = (e) -> e.preventDefault()
      
      # Remove the music iframe
      music = document.getElementById('music')
      music.parentNode.removeChild music
      
      # size canvas properly
      if document.body.clientWidth == 320
        @canvas.width = 320
        @canvas.height = 460
      else
        @canvas.width = 480
        @canvas.height = 300
    
    
    # Fetch drawing context
    @ctx = @canvas.getContext '2d'
    
    # Center canvas bounds
    aspect = @canvas.width / @canvas.height
    @ctx.translate @canvas.width / 2,   @canvas.height / 2
    @ctx.scale     @canvas.width / 200, @canvas.height / (200 / aspect)
    
    # Setup timings
    @frames = 0
    @start  = now()
        
    # Setup FPS reporter
    setInterval @showFps, 5000
    
    setTimeout =>
      # Create actors
      @refresh()
      
      # Set seed link
      document.getElementById('link').innerHTML = "#{ window.location.href.split('#')[0] }##{ Random.seedValue }"
      
      # Start the render loop
      @render()
      
    , 0
      
    
  refresh: (options = {}) =>
    
    if options.randomize or !Random.seedValue?
      Random.seed()
    
    if options.beat or !@beat?
      @beat = new Beat(
                parseFloat(document.getElementById('bpm').value)
                parseFloat(document.getElementById('measure').value)
              ).start()
    
    @mainHue = Random.int 360
    @layers = []
    
    # Backdrop
    @layers.push new Backdrop()
    
    maxLayers = Random.int(3, 6)
    maxLayers = 3 if @iPhone
    for i in [0..Random.int(3, 6)]
      klass = [Ripples, Lattice, Particles].random()
      @layers.push new klass()
    
    # @layers = [new Particles()]
    
    clearTimeout @swapTimeout if @swapTimeout
    @swapTimeout = setInterval =>
      if document.getElementById('cycle').checked
        @refresh randomize: yes, beat: no
    , @beat.perMeasure/@beat.bps * 4 * 1000
  
  render: =>
    @frames++
    
    # Keep time
    @beat.update()
    
    # Clear
    @ctx.clearRect -100, -100, 200, 200
    
    @ctx.fillStyle = "hsl(#{ @mainHue }, 75%, 25%)"
    @ctx.fillRect -100, -100, 200, 200
    
    # Render all sprites
    layer.render @ctx for layer in @layers
    
    # Schedule next render
    requestAnimFrame @render, @canvas
      
  showFps: =>
    rightNow = now()
    fps = @frames / (rightNow - @start)
    console.log "#{ Math.round fps }fps"
    
    @frames = 0
    @start  = rightNow
  
  stop: =>
    @render = @showFps = ->