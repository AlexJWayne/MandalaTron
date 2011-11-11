class @Particles
  constructor: ->
    @count = Random.int(25, 300)
    
    @style =
      rotation: [
        [0, 0]
        [Random.float(-180, 180), Random.float(-180, 180)]
      ].random()
      
      color: [
        new HSL(stage.mainHue + 180, Random.float(75, 100), 50).toString()
        new HSL(stage.mainHue + 180, Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()
      ].random()
      
      speed:      [Random.float(0, 80) * stage.beat.bps, Random.float(120, 400) * stage.beat.bps]
      size:       [Random.float(1, 2), Random.float(2, 8, curve:Curve.low2)]
      
      drag:       [Random.float(0, 200) * stage.beat.bps, Random.float(0, 200) * stage.beat.bps]
      lifetime:   [Random.float(stage.beat.bps/2, stage.beat.bps*2), Random.float(stage.beat.bps/2, stage.beat.bps*2)]
    
    @lastbeat = null
    @particles = []
  
  render: (ctx) ->
    @particles = (p for p in @particles when p.alive)
    
    if @lastbeat != stage.beat.beat()
      @lastbeat = stage.beat.beat()
      @particles.push new Particle(@style) for i in [0..@count]
    
    ctx.do =>
      ctx.fillStyle = @style.color
      p.render ctx for p in @particles
    
class Particle
  constructor: (@style) ->
    @startedAt = stage.beat.now || now()
    @lastFrame = stage.beat.now || now()
    @alive     = yes
    
    @pos       = [0, 0]
    @angle     = Random.float(360)
    @vel       = polar2rect Random.float(@style.speed...), @angle
    @size      = Random.float(@style.size...)
    @drag      = Random.float(@style.drag...)
    @rotation  = Random.float(@style.rotation...)
    @lifetime  = Random.float(@style.lifetime...)
    
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
        ctx.globalAlpha = Curve.high(1 - (livedFor / @lifetime))
        ctx.rotate @rotation.deg2rad() * (livedFor / @lifetime)
        ctx.fillCircle @pos..., @size
    