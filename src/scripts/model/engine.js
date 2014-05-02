var Cell = require('./cell'),
    Tile = require('./tile'),
    settings = require('./settings'),
    engineModule;

engineModule = (function () {
  var self,
      keyActionMap = {};

  var Engine = function () {
    this.size = settings.BOARD_SIZE;
    this.score = 0;
    this.numTilesAtStart = 2;
    this.tileNumbers = [2, 4];
    this.cellWidth = 0;
    this.cellPadding = settings.CELL_PADDING_PERCENT;
    this.cells = [];
    this.createDefaultCells();
    this.createDefaultTiles();
    self = this;
  };

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var moveUp = function (tiles) {
    // sort by y
    tiles.sort(function (a, b) {
      var ay = Math.floor(a.position / self.size);
      var by = Math.floor(b.position / self.size);

      // ascending
      return ay - by;
    });
  };

  var moveLeft = function (tiles) {
    tiles.sort(function (a, b) {
      var ax = a.position % self.size;
      var bx = b.position % self.size;

      // ascending
      return ax - bx;
    });
  };

  var moveRight = function (tiles) {
    tiles.sort(function (a, b) {
      var ax = a.position % self.size;
      var bx = b.position % self.size;

      // descending
      return bx - ax;
    });
  };

  var moveDown = function (tiles) {
    tiles.sort(function (a, b) {
      var ay = Math.floor(a.position / self.size);
      var by = Math.floor(b.position / self.size);

      // descending
      return by - ay;
    });
  };

  Engine.prototype.reset = function () {
    newEngine();
  };

  Engine.prototype.isGameOver = function () {
    var tiles = this.getTiles();

    if (tiles.length < this.size * this.size)
      return false;

    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i];
      if (tile.canMove(settings.keys.UP) ||
          tile.canMove(settings.keys.RIGHT) ||
          tile.canMove(settings.keys.LEFT) ||
          tile.canMove(settings.keys.DOWN)) {
        return false;
      }
    }

    return true;
  };

  Engine.prototype.isFinished = function () {
    var tiles = this.getTiles();
    tiles.forEach(function (tile) {
      if (tile.number === settings.GAME_GOAL)
        return true;
    });

    return false;
  };

  Engine.prototype.createDefaultCells = function () {
    var numCells = this.size * this.size,
        cell,
        i;

    for (i = 0; i < numCells; i++) {
      cell = new Cell(i, null);
      this.cells.push(cell);
    }
  };

  Engine.prototype.getTiles = function () {
    // replace tiles from cells
    var tiles = [];

    for (var i = 0, cell; i < this.cells.length; i++) {
      cell = this.cells[i];
      if (!!cell.tile)
        tiles.push(cell.tile);
    }

    return tiles;
  };

  Engine.prototype.createDefaultTiles = function () {
    var tile,
        i;

    for (i = 0; i < this.numTilesAtStart; i++) {
      this.createNewTile(i === 0 ? 2 : null);
    }
  };

  Engine.prototype.createNewTile = function (num) {
    var emptyCells = [],
        emptyCell,
        tile,
        pos,
        num,
        i;

    // get unoccupied cells
    emptyCells = this.cells.filter(function (cell) {
      return !cell.isOccupied();
    });

    // get a random cell among them
    emptyCell = emptyCells[getRandomInt(0, emptyCells.length - 1)];
    pos = emptyCell.position;
    num = num || this.tileNumbers[getRandomInt(0, 1)];
    tile = new Tile(pos, num, this);

    // insert tile
    this.cells[pos].tile = tile;

    return tile;
  };

  Engine.prototype.setCellWidth = function (boardWidth) {
    var padding = boardWidth * (this.size + 1) * this.cellPadding / 100;
    var width = (boardWidth - padding) / this.size;
    this.cellWidth = width;
  };

  Engine.prototype.move = function (direction) {
    var tiles = this.getTiles(),
        hasAvailableMoves = false;

    keyActionMap[direction](tiles);

    for (var i = 0, tile; i < tiles.length; i++) {
      tile = tiles[i];
      if (tile.canMove(direction)) {
        hasAvailableMoves = true;
        break;
      }
    }

    if (!hasAvailableMoves) return false;

    for (var i = 0, tile; i < tiles.length; i++) {
      tile = tiles[i];
      tile.prevCssPosition = tile.getCssPosition();
      tile.canMove(direction, true);
    }

    tiles.forEach(function (tile) {
      tile.hasMoved = false; // reset
    });

    // check finished
    if (this.isFinished()) {
      alert('You won!');
      return true;
    }

    // add a new tile
    this.createNewTile();

    return true;
  };

  Engine.prototype.getPositionFromXY = function(xy) {
    var position = xy.y * this.size + xy.x;
    return position;
  };

  keyActionMap[settings.keys.UP] = moveUp;
  keyActionMap[settings.keys.RIGHT] = moveRight;
  keyActionMap[settings.keys.DOWN] = moveDown;
  keyActionMap[settings.keys.LEFT] = moveLeft;

  return Engine;

})();

module.exports = engineModule;
