/** @jsx React.DOM */
'use strict';
var React = require('react'),
    Header;

Header = React.createClass({
  render: function () {
    return (
      <header id="header">
        <h1>React JS 2048</h1>
        <span className="score">
          {this.props.score}
        </span>
      </header>
    );
  }
});


module.exports = Header;
