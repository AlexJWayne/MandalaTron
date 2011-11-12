class @Beat
  constructor: (@bpm, @perMeasure) ->
    @bps = @bpm/60
    
  start: ->
    @startedAt = now()
    # setInterval =>
    #   @update()
    #   console.log @beat(), @measureProgress(), @beatProgress()
    # , 100
    this
  
  update: ->
    @now = now()
    @elapsed = @now - @startedAt
    this
  
  # Return the integer beat number zero-indexed of the current measure.
  beat: ->
    Math.floor (@elapsed * @bps) % @perMeasure
  
  # Return how done we are with the current beat. 0.0 - 1.0
  beatProgress: ->
    (@elapsed * @bps) % 1
  
  # Return how done we are with the current measure. 0.0 - 1.0
  measureProgress: ->
    ((@elapsed * @bps) % @perMeasure) / @perMeasure
  
  @musicUrl: ->
    # Hack a 60bpm fr now...
    bpm = [60, 120].random()
    notesPerBeat = [2, 4].random()

    id = [
      'NKM' # constant
      'G'   # constant
      [40, 45, 30, 60, 70].random()    # genre
      [7, 15, 30, 31, 55, 61, 62, 79, 91, 103, 110, 157, 167, 773, 1047].random() # ruletype
      Random.int(10000000000) # rule (10 digits)
      [0, 1].random() # cycle boundaries (0 1)
      Random.int(100000) # seed (5 digits)
      bpm * 5 * notesPerBeat # length (bpm * 5 * notesperbeat)
      bpm # bpm
      notesPerBeat  # notes per beat
      
      # No idea what these do yet. Probably instruments, scales notes.  Too lazy to figure it out.
      3799
      51
      0
      35
      510
      27
      153
      35
      514
      27
      154
      3
      304
      
      # percussion type ()
      [0, 1, 101, 102, 121, 122, 123, 127, 128, 129, 131, 132, 133, 301, 311, 322, 323, 325, 321, 324, 361, 362, 331, 332, 333, 334, 341, 342, 343, 344, 345, 346, 347, 348, 349, 351, 352, 353, 501, 401, 402, 403, 404, 431, 432, 433, 434, 551, 552, 553, 555, 554, 556, 571, 572, 573, 574, 575, 576, 577, 578, 579, 584, 586, 581, 582, 583, 585, 112, 113, 114, 115, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 651, 652, 681, 682, 711, 712, 713, 714, 601, 715, 721, 722, 723, 801, 803, 804, 805, 807, 808, 809, 810, 821, 822, 823, 830, 901, 911].random()
    ].join('-')
    
    "http://tones.wolfram.com/id/#{ id }&abmnk=2"