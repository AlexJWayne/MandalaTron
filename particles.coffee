class @Particles
  constructor: ->
    @count = Random.int(50, 300)
    
    @style =
      color: [
        new HSL(stage.mainHue + 180, Random.float(75, 100), 50).toString()
        new HSL(stage.mainHue + 180, Random.float(0, 80), [90 - Random.int(30), Random.int(30)].random()).toString()
      ].random()
      speed:      [Random.float(0, 12), Random.float(5, 15)]
      size:       [Random.float(0.5, 1), Random.float(1, 6, curve:Curve.low2)]
      drag: [
        [Random.float(0, 1), Random.float(0, 1)]
        [0, 0]
      ].random()
    
    @lastbeat = null
  
  render: (ctx) ->
    if @lastbeat != stage.beat.beat()
      @lastbeat = stage.beat.beat()
      @particles = (new Particle(@style) for i in [0..@count])
    
    ctx.do =>
      ctx.fillStyle = @style.color
      ctx.globalAlpha = Curve.high(1 - stage.beat.beatProgress())
      p.render ctx for p in @particles
    
class Particle
  constructor: (@style) ->
    @pos       = [0, 0]
    @angle     = Random.float(360)
    @vel       = polar2rect Random.float(@style.speed...), @angle
    @startedAt = stage.beat.now || now()
    @size      = Random.float(@style.size...)
    @drag      = Random.float(@style.drag...)
  
  render: (ctx) ->
    progress = stage.beat.now - @startedAt
    @dragVel = polar2rect @drag * progress, @angle
    for i in [0..1]
      @vel[i] -= @dragVel[i]
      @pos[i] += @vel[i] * progress
      
    ctx.fillCircle @pos..., @size