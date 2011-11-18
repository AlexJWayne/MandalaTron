class @Layer
  constructor: ->
    @expired = no
    @dead    = no
  
  onBeat: (beatNumber) ->
  onMeasure: -> 
  
  expire: ->
    @expired = yes
    @expiredAt = stage.beat.now
  
  kill: ->
    @dead = yes