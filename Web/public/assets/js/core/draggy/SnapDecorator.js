var PositionDecorator = require('./PositionDecorator');

var SnapDecorator = function (Positions) {
  PositionDecorator.call(this, Positions);
};
SnapDecorator.prototype = new PositionDecorator();
SnapDecorator.prototype.getX = function() {
  var snapX = this.Positions.getOptions().snapX;

  return (Math.round(
    this.Positions.getX() / snapX
  ) * snapX);
};
SnapDecorator.prototype.getY = function() {
  var snapY = this.Positions.getOptions().snapY;

  return (Math.round(
    this.Positions.getY() / snapY
  ) * snapY);
};

module.exports = SnapDecorator;