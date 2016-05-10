'use strict';

var Positions = function(options) {
  this.options = options;
  this.points = {
    elementX: 0,
    elementY: 0,
    firstMouseX : 0,
    firstMouseY : 0,
    lastMouseX  : 0,
    lastMouseY  : 0
  };
}

Positions.prototype.getOptions = function() {
  return this.options;
};
Positions.prototype.setPoints =  function(points) {
  
  if (points.elementX){
    this.points.elementX = points.elementX;
  }

  if (points.elementY){
    this.points.elementY = points.elementY;
  }

  if (points.firstMouseX){
    this.points.firstMouseX = points.firstMouseX;
  }

  if (points.firstMouseY){
    this.points.firstMouseY = points.firstMouseY;
  }

  if (points.lastMouseX){
    this.points.lastMouseX = points.lastMouseX;
  }

  if (points.lastMouseY){
    this.points.lastMouseY = points.lastMouseY;
  }
};
Positions.prototype.getPoints = function() {
  return this.points;
};
Positions.prototype.getDistanceX = function() {
  return Math.abs(this.points.lastMouseX - this.points.firstMouseX);
};
Positions.prototype.getDistanceY = function() {
  return Math.abs(this.points.lastMouseY - this.points.firstMouseY);
};
Positions.prototype.getX = function() {
  return (this.points.lastMouseX - this.points.elementX);
};
Positions.prototype.getY = function() {
  return (this.points.lastMouseY - this.points.elementY);
};

module.exports = Positions;