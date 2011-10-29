# Easy way to add methods to an existing prototype
extendPrototype = (base, methods) ->
  base::[name] = method for name, method of methods
  return

# Tau is more awesome than PI
Math.TAU = Math.PI * 2

# now in seconds
window.now = -> new Date().getTime() / 1000


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