/** @jsx React.DOM */
'use strict';
var React = require('react'),
    Tile;

Tile = React.createClass({
  componentDidMount: function () {
    var tile = this.props.tile,
        position = tile.getCssPosition(),
        prevPosition = tile.prevCssPosition,
        $elmt = $(this.getDOMNode()),
        width = parseInt($elmt.css('width'), 10),
        height = parseInt($elmt.css('height'), 10);

    // for animation
    if (!!prevPosition && (
      prevPosition.top != position.top ||
      prevPosition.left != position.left)) {
      $elmt.animate({
        top: position.top,
        left: position.left
      }, {
        duration: 80,
        specialEasing: {
          width: "linear",
          height: "linear"
        }
      });

      if (tile.isMerged) {
        $elmt.animate({
          opacity: 0.7,
          width: width * 1.2,
          height: height * 1.2,
          top: position.top - height * 0.1,
          left: position.left - width * 0.1
        }, {
          duration: 80,
          specialEasing: {
            width: "linear",
            height: "linear",
            top: 'linear',
            left: 'linear',
            opacity: 'linear'
          }
        }).animate({
          opacity: 1,
          width: width,
          height: height,
          top: position.top,
          left: position.left
        }, {
          duration: 80,
          specialEasing: {
            width: "linear",
            height: "linear",
            top: 'linear',
            left: 'linear',
            opacity: 'linear'
          }
        });
      }
    }

    if (tile.isNew) {
      $elmt.animate({
        opacity: 1
      }, {
        duration: 500,
        specialEasing: {
          width: "linear",
          height: "linear"
        }
      });
    }

    tile.isMerged = false;
    tile.isNew = false;
  },
  render: function () {
    var tile = this.props.tile,
        position = tile.getCssPosition(),
        prevPosition = tile.prevCssPosition,
        width = tile.getWidth(),
        className = 'tile tile-color-' + tile.number,
        opacity = tile.isNew ? '0' : '1';

    var styles = {
      top: !!prevPosition ? prevPosition.top : position.top,
      left: !!prevPosition ? prevPosition.left : position.left,
      width: width,
      height: width,
      lineHeight: width + 'px',
      fontSize: width / 2,
      fontWeight: 'bold',
      opacity: opacity
    };

    return (
      <div className={className} style={styles}>
        {tile.number}
      </div>
    );
  }
});


module.exports = Tile;
