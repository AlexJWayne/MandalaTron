class @Sprite
  
  # Class
  # -----
  
  # Returns an array of sprites based on a bpm and beats per measure, with
  # emphasis on the downbeat sprite.
  @generate: (options = {}) ->
    style =
      speed:          Random.float(150, 300, curve:Curve.low)
      baseWidth:      Random.float(2,   20,  curve:Curve.low)
      beatColor:      "hsl(#{ stage.mainHue + 180 }, 25%, #{ [90 - Random.int(30), Random.int(30)].random() }%)"
      emphasisColor:  "hsl(#{ stage.mainHue + 180 }, 100%, 50%)"
      emphasisSpeed:  Random.float(1, 2, curve:Curve.low)
      motionCurve:    [Curve.low, Curve.high].random()
    
    for i in [0...stage.beat.perMeasure]
      new this { style, beat: i }
  
  
  
  # Instance
  # --------
  
  constructor: (options = {}) ->
    @style      = options.style
    @beat       = options.beat
    @emphasis   = options.beat == 0
    @perMeasure = stage.beat.perMeasure
    @bps        = stage.beat.bps
    
    @offset     = (@beat) / @perMeasure
    @lifetime   = @perMeasure / @bps
    
    @startedAt  = stage.beat.startedAt - (@offset * @lifetime)
  
  render: (ctx) ->
    if @emphasis
      ctx.strokeStyle = @style.emphasisColor
      ctx.lineWidth   = @style.baseWidth * @bps * 2 * @style.emphasisSpeed
    else
      ctx.strokeStyle = @style.beatColor
      ctx.lineWidth   = @style.baseWidth * @bps
    
    elapsed = stage.beat.now - @startedAt
    if elapsed > 0
      while elapsed > @lifetime
        elapsed -= @lifetime
        @startedAt += @lifetime
    
      speed = @style.speed
      speed *= @style.emphasisSpeed if @emphasis
    
      curve = [Curve]
      ctx.strokeCircle 0, 0, speed * @style.motionCurve(elapsed/@lifetime)