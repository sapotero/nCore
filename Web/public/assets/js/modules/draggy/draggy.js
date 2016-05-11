'use strict';

var RestrictionDecorator = require('./RestrictionDecorator');
var AxisDecorator        = require('./AxisDecorator');
var SnapDecorator        = require('./SnapDecorator');
var PositionDecorator    = require('./PositionDecorator');
var Positions            = require('./Positions');

var isDrag = false;

var Drag = function(el, config) {
  var scope = this;

  this.el = el;
  this.options = {
    activeClass : config && config.hasOwnProperty('activeClass') ? config.activeClass : '',
    snapX       : config && config.hasOwnProperty('snapX')       ? config.snapX       : 1,
    snapY       : config && config.hasOwnProperty('snapY')       ? config.snapY       : 1,
    axisX       : config && config.hasOwnProperty('axisX')       ? config.axisX       : true,
    axisY       : config && config.hasOwnProperty('axisY')       ? config.axisY       : true,
    restrict    : config && config.hasOwnProperty('restrict')    ? config.restrict    : 'document',
    onStart     : config && config.hasOwnProperty('onStart')     ? config.onStart     : function(e, obj) {},
    onDrag      : config && config.hasOwnProperty('onDrag')      ? config.onDrag      : function(e, obj) {},
    onStop      : config && config.hasOwnProperty('onStop')      ? config.onStop      : function(e, obj) {}
  };

  this.el.style.top      = this.el.getBoundingClientRect().top  + 'px';
  this.el.style.left     = this.el.getBoundingClientRect().left + 'px';
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
Drag.prototype.mousedownHandler = function(e) {

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
Drag.prototype.mousemoveHandler = function(e) {
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
Drag.prototype.mouseupHandler = function(e) {
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



var Draggy = function( config ){
  this.elements = [];
  this.active   = {};
};

Draggy.prototype.Constant = {
  'ACTIVE' : 'drag-active'
}

Draggy.prototype.Drag = Drag;

Draggy.prototype.copy = function () {
  
  this.dropZone     = core.dom.content;
  this.dragElements = core.dom.leftPanel.querySelectorAll('#web-forms-left > *');
  this.elementDragged = null;


  for (var i = 0; i < this.dragElements.length; i++) {

    this.dragElements[i].setAttribute( 'draggable', true );

    this.dragElements[i].addEventListener('dragstart', function(e) {
      console.log('dragstart');

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text', this.outerHTML);
      this.elementDragged = this;
    });

    this.dragElements[i].addEventListener('dragend', function(e) {
      console.log('dragend');
      
      this.elementDragged = null;
    });
  };

  this.dropZoneAttachEvents();
}

Draggy.prototype.dropZoneAttachEvents = function(){
  this.dropZone.addEventListener('dragover',  this.dropZoneDragOver.bind( this, this.dropZone ) );
  this.dropZone.addEventListener('dragenter', this.dropZoneDragEnter.bind( this, this.dropZone ) );
  this.dropZone.addEventListener('dragleave', this.dropZoneDragLeave.bind( this, this.dropZone ) );
  this.dropZone.addEventListener('drop',      this.dropZoneDrop.bind( this, this.dropZone ) );
};

Draggy.prototype.dropZoneDragOver  = function( element, e ){
  console.log('dragover');
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

Draggy.prototype.dropZoneDragEnter = function( element, e ){
  console.log('dragenter');
  element.className = "over";
}

Draggy.prototype.dropZoneDragLeave = function( element, e ){
  console.log('dragleave');
  element.className = "";
}

Draggy.prototype.dropZoneDrop = function( element, e ){
  e.preventDefault();
  e.stopPropagation();

  console.log('drop');

  console.log( 'addEventListener -> drop : ', e.dataTransfer.getData('text'), element );

  element.insertAdjacentHTML('afterbegin', e.dataTransfer.getData('text') );
  element.elementDragged = null;
}



Draggy.prototype.setActive = function( element, e ){
  console.log( 'setActive', e, element);
  
  for(var k = 0, length = this.elements.length; k < length; k++){
    console.log();
    this.elements[k].el.classList.remove( this.Constant.ACTIVE );
  }
  
  element.classList.add( this.Constant.ACTIVE );
};

Draggy.prototype.add = function( element, config ){
  this.elements.push( new this.Drag( element, config ) );
  element.addEventListener('click', this.setActive.bind(this, element) );

};

module.exports = Draggy;