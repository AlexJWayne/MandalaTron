class @Orbitals extends Layer
  constructor: ->
    super
    
    @orbitals = []
    @beats = 0
    
    @composite = ['source-over', ['lighter', 'darker'].random()].random()
    @rotation = Random.float(0, 360)
    @twist    = Random.float(20, 270) * [1, -1].random() until Math.abs(@twist + 360/stage.beat.perMeasure) > 30
    @count    = Random.int(3, 12, curve:Curve.low2)
    @mirror   = [yes, no].random()
    
    @style =
      color: [
        new HSL(stage.mainHue + Random.float(150, 210), Random.float(75, 100), 50).toString()
        new HSL(stage.mainHue + Random.float(150, 210), Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()
      ].random()
      
      size:             Random.float(8, 20, curve:Curve.low2)
      radius:           [] # Calculated below
      radiusCurve:      [Curve.low3, Curve.low2, Curve.low, Curve.linear, Curve.high, Curve.high2, Curve.high3].random()
      lifetime:         Random.float(0.5, stage.beat.perMeasure) / stage.beat.bps
      alpha:            Random.float(0.4, 0.75)
      alphaBlendPoint:  Random.float(0.1, 0.9)
      shape:            ['circle', 'square'].random()
      shapeAspect:      Random.float(0.5, 2)
      beatRotation:     Random.float(5, 45, curve:Curve.low3)
      strokeWidth:      [0, Random.float(0.5, 5)].random()
      echoes:           [Random.int(0, 4)].random()
    
    # If compositing lighter or darker, dont be so opaque
    @style.alpha /= 2 if @composite is 'lighter' or @composite is 'darker'
    
    # Ensure some travel in the radii
    until Math.abs(@style.radius[0] - @style.radius[1]) > 50
      @style.radius = [Random.float(10, 150), Random.float(10, 150)]
  
  onBeat: ->
    return if @expired
    @orbitals.push new Orbital(@style, @beats)
    @beats++
  
  render: (ctx) ->
    @orbitals = (orbital for orbital in @orbitals when orbital.alive)
    @kill() if @expired and @orbitals.length is 0
    
    ctx.render =>
      ctx.globalCompositeOperation = @composite
      
      @renderGroup ctx
    
      if @mirror
        ctx.render =>
          ctx.scale -1, 1
          ctx.rotate @rotation.deg2rad()
          @renderGroup ctx
    
  
  renderGroup: (ctx) ->
    for i in [0...@count]
      twist = @twist * stage.beat.elapsed * stage.beat.bps
      ctx.render =>
        ctx.rotate (@rotation + twist + i * 360/@count).deg2rad()
        orbital.render ctx for orbital in @orbitals
    
    return
  
class Orbital
  constructor: (@style, beats)->
    @alive = yes
    @startedAt = stage.beat.now
    
    @a = 360/stage.beat.perMeasure * stage.beat.beat()
    @a += @style.beatRotation * beats
    
  render: (ctx) ->
    livedFor = stage.beat.now - @startedAt
    return @alive = no if livedFor > @style.lifetime
    lifetimeProgress = livedFor / @style.lifetime
    
    alphaScalar = if lifetimeProgress < @style.alphaBlendPoint
      lifetimeProgress.normalize 0, @style.alphaBlendPoint
    else
      lifetimeProgress.normalize 1, @style.alphaBlendPoint
    
    ctx.globalAlpha = @style.alpha * alphaScalar
    ctx.fillStyle = @style.color
        
    [x, y] = Math.polar2rect(@style.radius.blend(lifetimeProgress, curve:@style.radiusCurve), @a)
    
    for i in [0..@style.echoes]
      switch @style.shape
        when 'circle'
          ctx.fillCircle x, y, @style.size + @style.size * 0.2 * i
        
        when 'square'
          size = @style.size + @style.size * 0.2 * i
          ctx.fillRect x-size, y-size, size*2, size*2
