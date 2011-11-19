
class @Stage
  @maxSize = 2000
  
  constructor: ->
    # Fetch the canvas.
    @canvas = $('canvas')
    
    # Get any url parameters and use them.
    @setup()
    
    # Canvas is always 200 rendered pixels wide.
    @canvas.width = 800  
    
    # Resize the height of the canvas to math the window aspect ratio
    if @config.fullscreen
      # Get window size and aspect ratio.
      # Note that performance TANKS with a size bigger than 2000px.
      windowWidth  = window.innerWidth.limit(Stage.maxSize)
      windowHeight = window.innerHeight.limit(Stage.maxSize)
      aspect = windowWidth / windowHeight
      
      @canvas.height = @canvas.width / aspect
      
      # Assign a style to enlarge the canvas to fit the screen dimensions
      @canvas.style.width = "#{ windowWidth }px"
      @canvas.style.height = "#{ windowHeight }px"
      
    else
      @canvas.height = 600
      aspect = @canvas.width / @canvas.height
    
    # Do iPhone specific setup to make it work on a tiny screen
    @iphoneSetup()    
    
    # Fetch drawing context
    @ctx = @canvas.getContext '2d'
    
    # Center canvas bounds
    @ctx.translate @canvas.width / 2,   @canvas.height / 2
    @ctx.scale     @canvas.width / 200, @canvas.height / (200 / aspect)
    
    # Setup timings
    @frames = 0
    @startedAt  = now()
    @layers = []
    @totalMeasures = null
    
    # Setup FPS reporter
    setInterval @showFps, 1000
    
    # If we aren't playing a video, just start it now
    @start() unless @config.vid
  
  # Read the query string for some initial values
  setup: ->
    @config = {}
    if query = window.location.search[1..-1]
      pairs = query.split '&'
      
      for pair in pairs
        [key, value] = pair.split '='
        @config[key] = value
      
      $('bpm').value     = @config.bpm     if @config.bpm
      $('measure').value = @config.measure if @config.measure
      
      if @config.transitions
        @config.transitions = (parseInt(n, 10) for n in @config.transitions.split ',')
      
      if @config.fullscreen
        @canvas.className = 'fullscreen'
      
      if @config.vid
        $('video').innerHTML =
          '<embed src="http://www.youtube.com/e/' + @config.vid + '?version=3&enablejsapi=1&playerapiid=videoplayer" type="application/x-shockwave-flash" width="853" height="480" allowscriptaccess="always" allowfullscreen="true" id="videoplayer"></embed>'
        
        window.onYouTubePlayerReady = ->
          player = $('videoplayer')
          setTimeout ->
            player.playVideo()
            player.addEventListener 'onStateChange', 'onYouTubePlayerStateChange'            
          , 1500          
        
        window.onYouTubePlayerStateChange = (state) =>
          if state.toString() == '1'
            player = $('videoplayer')
            player.width = 480
            player.height = 32
            
            setTimeout @start, (parseFloat(@config.vidt) * 1000) || 0
    
  
  iphoneSetup: ->
    # setup iPhone web app
    if window.navigator.userAgent.indexOf('iPhone') != -1
      
      #Save iPhone state
      @iPhone = yes
      
      # refresh on orientation change
      window.onorientationchange = -> window.location.reload yes
      
      # disable scrolling
      @canvas.ontouchmove = (e) -> e.preventDefault()
      
      # size canvas properly
      if document.body.clientWidth == 320
        @canvas.width = 320
        @canvas.height = 460
      else
        @canvas.width = 480
        @canvas.height = 300
  
  onBeat: (beatNumber) ->
    layer.onBeat beatNumber for layer in @layers
    $('beat').innerHTML = beatNumber + 1
  
  onMeasure: ->
    @totalMeasures ?= 0
    @totalMeasures++
    layer.onMeasure() for layer in @layers
    
    # Perform a transition
    if @totalMeasures > 0
      if @config.transitions
        if @totalMeasures is @config.transitions[0]
          @config.transitions.shift()
          
          if @config.transitions.length > 0
            @refresh()
          else
            layer.expire() for layer in @layers[1..-1]
            
      else
        @refresh() if @totalMeasures % 4 is 1
    
    $('measures').innerHTML = @totalMeasures || 0
  
  refresh: (options = {}) =>
    if options.randomize or !Random.seedValue
      Random.seed()
    
    if options.beat or !@beat
      @beat = new Beat(
                parseFloat($('bpm').value)
                parseFloat($('measure').value)
              )
    
    # Pick a base color
    if @mainHue
      @mainHue += Random.int -90, 90
      @mainHue -= 360 if @mainHue > 360
      @mainHue += 360 if @mainHue < 0
    else
      @mainHue = Random.int 360
    
    # Expire all current layers
    layer.expire() for layer in @layers[1..-1]
    
    # Make a new backdrop if its doesnt exist
    @layers[0] = new Backdrop() if options.color or !@layers[0]
    
    # Generate some layers
    maxLayers = Random.int(5, 10)
    maxLayers = 3 if @iPhone
    for i in [0...maxLayers]
      klass = [Ripples, Lattice, Particles, Orbitals].random()
      @layers.push new klass()
    
    # # TEMP
    # @layers = [@layers[0]]
    # @layers.push new Lattice()
    
    @beat.start() unless @beat.started
  
  render: =>
    @frames++
    
    # Keep time
    @beat.update()
        
    # Prune dead layers
    @layers = (layer for layer in @layers when not layer.dead)    
    
    # Render all layers
    layer.render @ctx for layer in @layers
    
    # Schedule next render
    requestAnimFrame @render, @canvas
      
  showFps: =>
    @fps ||= $('fpscount')
    rightNow = now()
    fps = Math.round @frames / (rightNow - @startedAt)
    @fps.innerHTML = fps
    
    @frames = 0
    @startedAt  = rightNow
  
  start: =>
    setTimeout =>
      # Create actors
      @refresh()
      
      # Set seed link
      url = "#{ window.location.href.split('#')[0] }##{ Random.seedValue }"
      link = $('link')
      link.innerHTML = link.href = url
      
      # Start the render loop
      @render()
      
    , 0
  
  stop: =>
    @render = @showFps = ->