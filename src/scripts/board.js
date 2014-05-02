/** @jsx React.DOM */
'use strict';
var React = require('react'),
    Header = require('./header'),
    Tile = require('./tile'),
    Cell = require('./cell'),
    Engine = require('./model/engine'),
    Board,
    engine;

Board = React.createClass({
  startNew: function () {
    engine = new Engine();

    return { engine: engine };
  },
  handleKeyUp: function (e) {
    var state = this.state;

    switch (e.which) {
      case 37: // left
      case 38: // up
      case 39: // right
      case 40: // down
        e.preventDefault();

        if (!engine.move(e.which + ''))
          return;

        break;

      default: return;
    }

    state.tiles = engine.getTiles();
    state.cells = engine.cells;
    state.cellsUpdated = false;
    state.score = engine.score;
    this.setState(state);
  },
  componentDidMount: function () {
    engine.setCellWidth($('.board').width());

    $(document).keydown(this.handleKeyUp);

    this.state.cellsUpdated = true;
    this.setState(this.state);
  },
  getInitialState: function () {
    var engine = this.startNew().engine,
        cells = engine.cells,
        tiles = engine.getTiles();

    return {
      cells: cells,
      tiles: tiles,
      score: 0,
      cellsUpdated: false
    };
  },
  componentDidUpdate: function (prevProps, prevState) {
    var state = this.state;
    if (!state.cellsUpdated) {
      state.cellsUpdated = true;
      this.setState(state);
    } else {
      // check game over
      if (engine.isGameOver()) {
        setTimeout(function () {
          alert('You lost!');
        }, 2000);
      }
    }
  },
  render: function () {
    var cells = this.state.cells,
        tiles = this.state.tiles,
        score = this.state.score,
        cellElements,
        tileElements;

    cellElements = cells.map(function (cell, index) {
      return (
        <Cell cell={cell} key={index} width={engine.cellWidth} />
      );
    });

    // Render cells first, then render tiles
    if (this.state.cellsUpdated) {
      tileElements = tiles.map(function (tile, index) {
        return <Tile tile={tile} key={index} />;
      });
    }

    return (
      <div id="main">
        <Header score={score} />
        <div className="board">
          <div className="cell-container">
          {cellElements}
          {tileElements}
          </div>
        </div>
      </div>

    );
  }
});


React.renderComponent(
  <Board />,
  document.getElementById('app'));
