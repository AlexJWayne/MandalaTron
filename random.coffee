@Random =
  seed: ->
    @seedValue =
      if window.location.hash
        window.location.hash[1..-1]
      else
        Math.floor Math.random() * 1000000
    
    Math.seedrandom @seedValue.toString()
    
  
  float: (min, max, options = {}) ->
    curve = options.curve || Curve.linear
    unless max?
      max = min
      min = 0
    
    curve(Math.random()) * (max - min) + min
  
  int: ->
    Math.floor @float(arguments...)