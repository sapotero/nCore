var RestrictionDecorator = require('./RestrictionDecorator');
var AxisDecorator        = require('./AxisDecorator');
var SnapDecorator        = require('./SnapDecorator');
var PositionDecorator    = require('./PositionDecorator');
var Positions            = require('./Positions');

var isDrag = false;

Draggy = function(el, config) {
  var scope = this;

  this.el = el;
  this.options = {
    activeClass : config && config.hasOwnProperty('activeClass') ? config.activeClass : ''                  ,
    snapX       : config && config.hasOwnProperty('snapX')       ? config.snapX       : 1                   ,
    snapY       : config && config.hasOwnProperty('snapY')       ? config.snapY       : 1                   ,
    axisX       : config && config.hasOwnProperty('axisX')       ? config.axisX       : true                ,
    axisY       : config && config.hasOwnProperty('axisY')       ? config.axisY       : true                ,
    restrict    : config && config.hasOwnProperty('restrict')    ? config.restrict    : 'document'          ,
    onStart     : config && config.hasOwnProperty('onStart')     ? config.onStart     : function(e, obj) {} ,
    onDrag      : config && config.hasOwnProperty('onDrag')      ? config.onDrag      : function(e, obj) {} ,
    onStop      : config && config.hasOwnProperty('onStop')      ? config.onStop      : function(e, obj) {}
  };

  this.el.style.position = "absolute";

  this.Positions = new Positions(this.options);

  // Set AxisDecorator
  if (this.options.axisX == false || this.options.axisY == false) {
    this.Positions = new AxisDecorator(this.Positions);
  }

  // Set SnapDecorator
  if (this.options.snapX != 1 || this.options.snapY != 1) {
    this.Positions = new SnapDecorator(this.Positions);
  }

  // set RestrictionDecorator
  this.Positions = new RestrictionDecorator(
    this.Positions,
    this.el,
    this.options.restrict
  );

  this.el.onmousedown = function(e) {
    scope.mousedownHandler(e);
  };

  this.el.ontouchstart = function(e) {
    e.preventDefault();
    scope.mousedownHandler(e.changedTouches[0]);
  };
};
Draggy.prototype.mousedownHandler = function(e) {

  var event = document.all ? window.event : e,
    scope   = this,
    mouseX  = document.all ? window.event.clientX : e.pageX,
    mouseY  = document.all ? window.event.clientY : e.pageY;

  if (event.preventDefault) {
    event.preventDefault();
  }
  else {
    document.onselectstart = function() {
      return false;
    };
  }

  if ( this.options.activeClass ) {
    this.el.classList.add( this.options.activeClass );
  }

  if (typeof this.options.onStart === 'function') {
    this.options.onStart(event, this.el);
  }

  isDrag = true;
  this.el.style.zIndex = 99999;

  this.Positions.setPoints({
    firstMouseX : mouseX,
    firstMouseY : mouseY,
    elementX    : (mouseX - this.el.offsetLeft),
    elementY    : (mouseY - this.el.offsetTop)
  });

  document.onmousemove = function(e) {
    var event = document.all ? window.event : e;
    scope.mousemoveHandler(event);
  };

  document.ontouchmove = function(e) {
    var event = e.changedTouches[0];
    scope.mousemoveHandler(event);
  };

  document.onmouseup = function(e) {
    var event = document.all ? window.event : e;
    scope.mouseupHandler(event);
  };

  document.ontouchend = function(e) {
    var event = e.changedTouches[0];
    scope.mouseupHandler(event);
  };
};
Draggy.prototype.mousemoveHandler = function(e) {
  var mouseX = document.all ? window.event.clientX : e.pageX,
    mouseY = document.all ? window.event.clientY : e.pageY;

  this.Positions.setPoints({
    lastMouseX: mouseX,
    lastMouseY: mouseY
  });

  if (isDrag === false){
    return;
  }

  if (this.Positions.getX() !== null) {
    this.el.style.left = this.Positions.getX() + 'px';
  }

  if (this.Positions.getY() !== null) {
    this.el.style.top = this.Positions.getY() + 'px';
  }

  e['distanceX'] = this.Positions.getDistanceX();
  e['distanceY'] = this.Positions.getDistanceY();

  if (typeof this.options.onDrag === 'function') {
    this.options.onDrag(e, this.el);
  }
};
Draggy.prototype.mouseupHandler = function(e) {
  if (isDrag === false)
    return;

  if ( this.options.activeClass ) {
    this.el.classList.remove( this.options.activeClass );
  }

  e['distanceX'] = this.Positions.getDistanceX();
  e['distanceY'] = this.Positions.getDistanceY();

  if (typeof this.options.onStop === 'function') {
    this.options.onStop(e, this.el);
  }

  this.el.style.zIndex = '';
  isDrag = false;
};

module.exports = Draggy;