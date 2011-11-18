
class @Stage
  constructor: ->
    # Fetch canvas
    @canvas = $('canvas')
    @canvas.width = 800
    @canvas.height = 600
    
    # setup iPhone web app
    if window.navigator.userAgent.indexOf('iPhone') != -1
      
      #Save iPhone state
      @iPhone = yes
      
      # Turn on autocycler
      $('cycle').checked = yes
      
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
    
    
    # Fetch drawing context
    @ctx = @canvas.getContext '2d'
    
    # Center canvas bounds
    aspect = @canvas.width / @canvas.height
    @ctx.translate @canvas.width / 2,   @canvas.height / 2
    @ctx.scale     @canvas.width / 200, @canvas.height / (200 / aspect)
    
    # Setup timings
    @frames = 0
    @startedAt  = now()
    @layers = []
    @totalMeasures = 0
    
    # Setup FPS reporter
    setInterval @showFps, 1000
    
    @setup()
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
      
      if @config.fullscreen
        $('fullscreen').checked = yes
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
    
  
  onBeat: (beatNumber) ->
    layer.onBeat beatNumber for layer in @layers
    return
  
  onMeasure: ->
    @totalMeasures++
    layer.onMesure for layer in @layers
    
    # Setup a timeout to autocycle if the autocycle box is ticked
    if @totalMeasures % 4 is 0
      if $('cycle').checked
        @refresh randomize: yes, beat: no
  
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
      $('link').innerHTML = "#{ window.location.href.split('#')[0] }##{ Random.seedValue }"
      
      # Start the render loop
      @render()
      
    , 0
  
  stop: =>
    @render = @showFps = ->