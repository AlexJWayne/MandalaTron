@Random =
  float: (min, max, options = {}) ->
    curve = options.curve || Curve.linear
    unless max?
      max = min
      min = 0
      
    curve(Math.random()) * (max - min) + min
  
  int: ->
    Math.floor @float(arguments...)

@Curve =
  linear: (x) -> x
  low:    (x) -> x*x*x
  high:   (x) -> 1 - (1-x) * (1-x) * (1-x)
  
  test: (fn) ->
    console.log "#{ i } => #{ fn i }" for i in [0..1] by 0.1
    return