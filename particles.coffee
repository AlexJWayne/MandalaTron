class @Particles
  constructor: ->
    @count = Random.int(40, 300, curve:Curve.low2)
    
    @style =
      rotation: [
        [Random.float(-270, 270), Random.float(-270, 270)]
        [0, 0]
      ].random(curve:Curve.low2)
      
      color: [
        new HSL(stage.mainHue + Random.float(150, 210), Random.float(75, 100), 50).toString()
        new HSL(stage.mainHue + Random.float(150, 210), Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()
      ].random()
      maxAlpha: Random.float(0.25, 1, curve:Curve.high)
      
      size:       [Random.float(1, 2), Random.float(2, 8, curve:Curve.low3)]
      lifetime:   [Random.float(stage.beat.bps/2, stage.beat.bps*2), Random.float(stage.beat.bps/2, stage.beat.bps*2)]
      
      type:       ['circle', 'arc'].random()
      arcWidth:   [Random.float(3, 30, curve:Curve.low), Random.float(3, 45, curve:Curve.low)]
    
    # Repel from center
    if Random.int(2) == 0
      @style.speed = [0, 0]
      @style.drag = [Random.float(-100, -300), Random.float(-400, -800)]
      @style.spawnRadius = [0, 0]
    
    # Attract to center
    else
      @style.speed = [Random.float(0, 80) * stage.beat.bps, Random.float(100, 400) * stage.beat.bps]
      @style.drag  = [Random.float(0, 200) * stage.beat.bps, Random.float(0, 200) * stage.beat.bps]
      @style.spawnRadius = [Random.float(0, 20, curve:Curve.low2), Random.float(0, 40, curve:Curve.low2)]
    
    @lastbeat = null
    @particles = []
  
  render: (ctx) ->
    @particles = (p for p in @particles when p.alive)
    
    if @lastbeat != stage.beat.beat()
      @lastbeat = stage.beat.beat()
      @particles.push new Particle(@style) for i in [0..@count]
    
    p.render ctx for p in @particles
    
class Particle
  constructor: (@style) ->
    @startedAt = stage.beat.now || now()
    @lastFrame = stage.beat.now || now()
    @alive     = yes
    
    @angle     = Random.float(360)
    @pos       = polar2rect Random.float(@style.spawnRadius...), @angle
    @vel       = polar2rect Random.float(@style.speed...), @angle
    @size      = Random.float(@style.size...)
    @drag      = Random.float(@style.drag...)
    @rotation  = Random.float(@style.rotation...)
    @lifetime  = Random.float(@style.lifetime...)
    @arcWidth  = Random.float(@style.arcWidth...)
    
  render: (ctx) ->
    livedFor = stage.beat.now - @startedAt
    if livedFor > @lifetime
      @alive = no
      
    else
      frameTime = stage.beat.now - @lastFrame
      @lastFrame = stage.beat.now
    
      @dragVel = polar2rect @drag, @angle
    
      for i in [0..1]
        @vel[i] -= @dragVel[i] * frameTime
        @pos[i] += @vel[i]     * frameTime
    
      ctx.do =>
        ctx.globalAlpha = @style.maxAlpha * Curve.high(1 - (livedFor / @lifetime))
        ctx.rotate @rotation.deg2rad() * (livedFor / @lifetime)
        
        switch @style.type
          when 'circle'
            ctx.fillStyle = @style.color
            ctx.fillCircle @pos..., @size
            
          when 'arc'
            ctx.strokeStyle = @style.color
            ctx.lineWidth = @size/2
            ctx.lineCap = 'round'
            
            [r, a] = rect2polar @pos...
            ctx.beginPath()
            ctx.arc 0, 0, r, (a-@arcWidth).deg2rad(), (a+@arcWidth).deg2rad()
            ctx.stroke()
          
    