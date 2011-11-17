(function() {
  this.Beat = (function() {
    function Beat(bpm, perMeasure) {
      this.bpm = bpm;
      this.perMeasure = perMeasure;
      this.bps = this.bpm / 60;
    }
    Beat.prototype.start = function() {
      this.startedAt = now();
      return this;
    };
    Beat.prototype.update = function() {
      this.now = now();
      this.elapsed = this.now - this.startedAt;
      return this;
    };
    Beat.prototype.beat = function() {
      return Math.floor((this.elapsed * this.bps) % this.perMeasure);
    };
    Beat.prototype.beatProgress = function() {
      return (this.elapsed * this.bps) % 1;
    };
    Beat.prototype.measureProgress = function() {
      return ((this.elapsed * this.bps) % this.perMeasure) / this.perMeasure;
    };
    Beat.musicUrl = function() {
      var bpm, id, notesPerBeat;
      bpm = [60, 120].random();
      notesPerBeat = [2, 4].random();
      id = ['NKM', 'G', [40, 45, 30, 60, 70].random(), [7, 15, 30, 31, 55, 61, 62, 79, 91, 103, 110, 157, 167, 773, 1047].random(), Random.int(10000000000), [0, 1].random(), Random.int(100000), bpm * 5 * notesPerBeat, bpm, notesPerBeat, 3799, 51, 0, 35, 510, 27, 153, 35, 514, 27, 154, 3, 304, [0, 1, 101, 102, 121, 122, 123, 127, 128, 129, 131, 132, 133, 301, 311, 322, 323, 325, 321, 324, 361, 362, 331, 332, 333, 334, 341, 342, 343, 344, 345, 346, 347, 348, 349, 351, 352, 353, 501, 401, 402, 403, 404, 431, 432, 433, 434, 551, 552, 553, 555, 554, 556, 571, 572, 573, 574, 575, 576, 577, 578, 579, 584, 586, 581, 582, 583, 585, 112, 113, 114, 115, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 651, 652, 681, 682, 711, 712, 713, 714, 601, 715, 721, 722, 723, 801, 803, 804, 805, 807, 808, 809, 810, 821, 822, 823, 830, 901, 911].random()].join('-');
      return "http://tones.wolfram.com/id/" + id + "&abmnk=2";
    };
    return Beat;
  })();
}).call(this);
