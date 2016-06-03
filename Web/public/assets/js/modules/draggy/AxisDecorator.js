'use strict';

var PositionDecorator = require('./PositionDecorator');

var AxisDecorator = function (Positions) {
  PositionDecorator.call(this, Positions);
};
AxisDecorator.prototype = new PositionDecorator();
AxisDecorator.prototype.getX = function() {
  var axisX = this.Positions.getOptions().axisX;

  if (axisX === true) {
    return this.Positions.getX();
  }

  return null;
};
AxisDecorator.prototype.getY = function() {
  var axisY = this.Positions.getOptions().axisY;

  if (axisY === true) {
    return this.Positions.getY();
  }

  return null;
};
module.exports = AxisDecorator;