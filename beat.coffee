class @Beat
  constructor: (@bpm, @perMeasure) ->
    @bps = @bpm/60
    
  start: ->
    @startedAt = now()
    # setInterval =>
    #   @update()
    #   console.log @beat(), @measureProgress(), @beatProgress()
    # , 100
    this
  
  update: ->
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
  