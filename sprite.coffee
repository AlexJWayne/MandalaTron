class @Sprite
  
  # Class
  # -----
  
  # Returns an array of sprites based on a bpm and beats per measure, with
  # emphasis on the downbeat sprite.
  @generate: (options = {}) ->
    style =
      speed:          Random.float(150, 300, curve:Curve.low)
      baseWidth:      Random.float(2,   10,  curve:Curve.low)
      beatColor:      new HSL(stage.mainHue + 180, Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()
      emphasisColor:  new HSL(stage.mainHue + 180, 100, 50).toString()
      emphasisSpeed:  Random.float(1, 2, curve:Curve.low)
      motionCurve:    [Curve.low, Curve.high].random()
      alpha:          Random.float(0.25, 1, curve:Curve.high)
      outward:        [yes, yes, no].random()
    
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
    ctx.globalAlpha = @style.alpha
    
    if @emphasis
      ctx.strokeStyle = @style.emphasisColor
      ctx.lineWidth   = @style.baseWidth * @bps * 3 * @style.emphasisSpeed
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
      
      if @style.outward
        speed *= @style.motionCurve(elapsed/@lifetime)
      else
        speed *= @style.motionCurve(1 - elapsed/@lifetime)
    
      ctx.strokeCircle 0, 0, speed