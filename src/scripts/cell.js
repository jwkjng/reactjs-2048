/** @jsx React.DOM */
'use strict';
var React = require('react'),
    Cell = require('./model/cell'),
    CellComponent;


CellComponent = React.createClass({
  componentDidMount: function () {
    var cell = this.props.cell;
    cell.setElement(this.getDOMNode());
  },
  render: function () {
    var styles = {
      width: this.props.width,
      height: this.props.width
    };

    return (
      <div className="cell" style={styles}></div>
    );
  }
});


module.exports = CellComponent;
