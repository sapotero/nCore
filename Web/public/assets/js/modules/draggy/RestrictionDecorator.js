'use strict';

var PositionDecorator = require('./PositionDecorator');


var RestrictionDecorator = function (Positions, el, restrictEl) {
  PositionDecorator.call(this, Positions);

  restrictEl = restrictEl || 'document';
  this.el = el;

  if (restrictEl == 'document') {
    this.restrictWidth = window.innerWidth || document.body.clientWidth;
    this.restrictHeight = window.innerHeight || document.body.clientHeight;
  }
  else {

    if (typeof restrictEl != 'object'){
      throw new Error('Restrict must be object: document.getElementById("obj_id")');
    }

    restrictEl.style.position = 'relative';

    this.restrictWidth = restrictEl.offsetWidth;
    this.restrictHeight = restrictEl.offsetHeight;
  }
}
RestrictionDecorator.prototype = new PositionDecorator();
RestrictionDecorator.prototype.getX = function() {
  if (this.Positions.getX() < 0) {
    return 0;
  }
  else if (this.Positions.getX() >
    (this.restrictWidth - this.el.offsetWidth)) {
    return (this.restrictWidth - this.el.offsetWidth);
  }

  return this.Positions.getX();
};
RestrictionDecorator.prototype.getY = function() {
  if (this.Positions.getY() < 0) {
    return 0;
  }
  else if (this.Positions.getY() >
    (this.restrictHeight - this.el.offsetHeight)) {
    return (this.restrictHeight - this.el.offsetHeight);
  }

  return this.Positions.getY();
};
module.exports = RestrictionDecorator;