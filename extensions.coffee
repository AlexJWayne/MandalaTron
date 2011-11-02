# Easy way to add methods to an existing prototype
extendPrototype = (base, methods) ->
  base::[name] = method for name, method of methods
  return

# Tau is more awesome than PI
Math.TAU = Math.PI * 2

# requestAnimationFrame shim
window.requestAnimFrame = do ->
   window.requestAnimationFrame       ||
   window.webkitRequestAnimationFrame ||
   window.mozRequestAnimationFrame    ||
   window.oRequestAnimationFrame      ||
   window.msRequestAnimationFrame     ||
   (callback, element) -> window.setTimeout callback, 1000 / 60

# now in seconds
window.now = -> new Date().getTime() / 1000

# Blend 2 values in porportions of a nromalized float
window.blend = (start, end, amount) ->
  start * (1 - amount) + end * amount

# Enhance the 2d rendering context with some convenience methods
extendPrototype CanvasRenderingContext2D,
  
  # Circles!
  circle: (x, y, radius) ->
    @arc x, y, radius, 0, Math.TAU
  
  fillCircle: (x, y, radius) ->
    @beginPath()
    @circle x, y, radius
    @closePath()
    @fill()
  
  strokeCircle: (x, y, radius) ->
    @beginPath()
    @circle x, y, radius
    @closePath()
    @stroke()


extendPrototype Array,
  random: (options = {}) ->
    this[Random.int 0, @length, options]

extendPrototype Number,
  
  # (0.75).normalize(0.5, 1.0) => 0.5
  normalize: (min, max) ->
    unless max?
      max = min
      min = 0
      
    (this - min) / (max - min)

class @HSL
  constructor: (@h, @s, @l) ->
  toString: -> "hsl(#{ @h.toFixed 1 }, #{ @s.toFixed 1 }%, #{ @l.toFixed 1 }%)"
  