var cellModule = (function () {
  var Cell = function(position, tile) {
    this.position = position;
    this.tile = tile;
    this.element;
  }

  Cell.prototype.isOccupied = function () {
    return !!this.tile;
  };

  Cell.prototype.setElement = function (element) {
    this.element = element;
  };

  Cell.prototype.getX = function (size) {
    return this.position % size;
  };

  Cell.prototype.getY = function (size) {
    return Math.floor(this.position / size);
  };

  return Cell;
})();

module.exports = cellModule;
