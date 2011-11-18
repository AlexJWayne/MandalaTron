class @Beat
  constructor: (@bpm, @perMeasure) ->
    @bps = @bpm/60
    @startedAt = now()
    @update()
    @started = no
    
  start: ->
    @started = yes
    @startedAt = now()
    @update()
    
    beat = 0
    
    setTimeout =>
      @intervals = [
        accurateInterval 1000 / @bps,               => stage.onBeat @beat()
        accurateInterval 1000 * @perMeasure / @bps, => stage.onMeasure()
      ]
      
      stage.onBeat beat
      stage.onMeasure()
      
    , 20
    this
  
  update: ->
    @lastFrame = @now
    @now = now()
    @elapsed = @now - @startedAt
    this
  
  # Return the integer beat number zero-indexed of the current measure.
  beat: ->
    Math.floor (@elapsed * @bps) % @perMeasure
  
  # Return how done we are with the current beat. 0.0 - 1.0
  beatProgress: ->
    (@elapsed * @bps) % 1
  
  # Return how done we are with the current measure. 0.0 - 1.0
  measureProgress: ->
    ((@elapsed * @bps) % @perMeasure) / @perMeasure
  
  frameTime: ->
    @now - @lastFrame