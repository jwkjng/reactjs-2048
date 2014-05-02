var settings = require('./settings');

var tileModule = (function () {

  var Tile = function(position, number, engine) {
    this.number = number;
    this.position = position;
    this.engine = engine;
    this.hasMoved = false;
    this.isMerged = false;
    this.isNew = true;
    this.prevCssPosition = null;
  }

  Tile.prototype.getXyByDirection = function (direction) {
    var newX, newY;

    switch (direction) {
      case settings.keys.UP:
        newX = 0;
        newY = -1;
        break;
      case settings.keys.LEFT:
        newX = -1;
        newY = 0;
        break;
      case settings.keys.DOWN:
        newX = 0;
        newY = 1;
        break;
      case settings.keys.RIGHT:
        newX = 1;
        newY = 0;
        break;
    }

    return { x: newX, y: newY };
  };

  Tile.prototype.getNewXY = function (direction) {
    var xy = this.getXyByDirection(direction),
        cell = this.engine.cells[this.position],
        newX = cell.getX(this.engine.size) + xy.x,
        newY = cell.getY(this.engine.size) + xy.y;

    return { x: newX, y: newY };
  };

  Tile.prototype.isWithinBounds = function (xy) {
    var size = this.engine.size;
    return xy.x >= 0 && xy.x < size &&
           xy.y >= 0 && xy.y < size;
  }

  Tile.prototype.canMerge = function (cellFrom, cellTo, direction) {
    return !cellFrom.tile.hasMoved &&
            !!cellTo.tile &&
            (cellTo.tile.hasMoved || !cellTo.tile.canMove(direction)) &&
            !cellTo.tile.isMerged &&
            cellFrom.tile.number == cellTo.tile.number;
  };

  Tile.prototype.getCssPosition = function() {
    var top = 0,
        left = 0;

    var cell = this.engine.cells[this.position];
    var pos = $(cell.element).position();

    return pos;
  };

  Tile.prototype.getWidth = function () {
    return this.engine.cellWidth;
  };

  Tile.prototype.getX = function () {
    return this.position % this.engine.size;
  };

  Tile.prototype.getY = function () {
    return this.position / this.engine.size;
  };

  Tile.prototype.canMove = function (direction, doMove) {
    var xy = this.getNewXY(direction),
        cellToPos,
        cellTo,
        cellFrom;

    if (!this.isWithinBounds(xy)) {
      if (doMove) this.hasMoved = true;
      return false;
    }

    cellToPos = this.engine.getPositionFromXY(xy);
    cellTo = this.engine.cells[cellToPos];
    cellFrom = this.engine.cells[this.position];

    if (cellTo.isOccupied() &&
        !this.canMerge(cellFrom, cellTo, direction)) {
      if (doMove) this.hasMoved = true;
      return false;
    }

    // skip moving since we're only doing check
    if (!doMove) {
      return true;
    }

    if (cellTo.isOccupied()) {
      // merge
      // console.log('merging tile: ' + this.position + '-' + this.number);
      // console.log('into tile: ' + cellTo.tile.position + '-' + cellTo.tile.number);

      this.number = this.number + cellTo.tile.number;
      this.position = cellTo.position;
      cellTo.tile = this;
      cellFrom.tile = null;

      // console.log('merged tile:' + this.number + '-' + this.position);
      this.hasMoved = true;
      this.isMerged = true;
      this.engine.score += this.number;
    } else {
      // move
      // console.log('moving tile: ' + this.position + '-' + this.number);
      this.position = cellTo.position;
      cellTo.tile = this;
      cellFrom.tile = null;
      // console.log('moving from ' + cellFrom.position +
      //           ' to ' + cellTo.position);
      // recursively move in the same direction
      // until you can't
      return this.canMove(direction, doMove);
    }

    return true;
  };

  return Tile;
})();

module.exports = tileModule;
