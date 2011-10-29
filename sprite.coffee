class @Sprite
  
  # Class
  # -----
  
  # Returns an array of sprites based on a bpm and beats per measure, with
  # emphasis on the downbeat sprite.
  @generate: (options = {}) ->
    style =
      speed:          Random.float(150, 300, curve:Curve.low)
      baseWidth:      Random.float(2, 16)
      beatColor:      "hsl(#{ stage.mainHue + 180 }, 25%, #{ [90 - Random.int(30), Random.int(30)].random() }%)"
      emphasisColor:  "hsl(#{ stage.mainHue + 180 }, 100%, 50%)"
      emphasisSpeed:  Random.float(1, 4, curve:Curve.low)
      motionCurve:    Curve.high
    
    { bpm, measure } = options
    bps = options.bpm / 60
    
    for i in [1..measure]
      new this { bps, measure, style, beat: i }
  
  
  
  # Instance
  # --------
  
  constructor: (options = {}) ->
    @style    = options.style
    @beat     = options.beat
    @emphasis = options.beat == 1
    @measure  = options.measure
    @bps      = options.bps
    
    # assume 4 beats per measure for now...
    @offset   = (@beat-1) / @measure
    @lifetime = @measure / @bps
    
    @startedAt = now() - (@offset * @lifetime)
  
  render: (ctx) ->
    if @emphasis
      ctx.strokeStyle = @style.emphasisColor
      ctx.lineWidth   = @style.baseWidth * @bps * 2 * @emphasisSpeed
    else
      ctx.strokeStyle = @style.beatColor
      ctx.lineWidth   = @style.baseWidth * @bps
    
    elapsed = now() - @startedAt
    while elapsed > @lifetime
      elapsed -= @lifetime
      @startedAt += @lifetime
    
    speed = @style.speed
    speed *= @style.emphasisSpeed if @emphasis
    
    curve = [Curve]
    ctx.strokeCircle 0, 0, speed * @style.motionCurve(elapsed/@lifetime)