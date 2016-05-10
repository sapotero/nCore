'use strict';

function PositionDecorator(Positions) {
  this.Positions = Positions;
}
PositionDecorator.prototype.getOptions = function() {
  return this.Positions.getOptions();
};
PositionDecorator.prototype.setPoints = function(points) {
  this.Positions.setPoints(points);
};
PositionDecorator.prototype.getPoints = function() {
  return this.Positions.getPoints();
};
PositionDecorator.prototype.getDistanceX = function() {
  return this.Positions.getDistanceX();
};
PositionDecorator.prototype.getDistanceY = function() {
  return this.Positions.getDistanceY();
};
PositionDecorator.prototype.getX = function() {
  return this.Positions.getX();
};
PositionDecorator.prototype.getY = function() {
  return this.Positions.getY();
};
module.exports = PositionDecorator;