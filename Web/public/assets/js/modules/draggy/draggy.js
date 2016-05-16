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
  var box = this.el.getBoundingClientRect();

  this.el.style.top      = box.top  + 'px';
  this.el.style.left     = box.left + 'px';
  this.el.style.position = "absolute";

  this.Positions = new Positions(this.options);

  if (this.options.axisX == false || this.options.axisY == false) {
    this.Positions = new AxisDecorator(this.Positions);
  }

  if (this.options.snapX != 1 || this.options.snapY != 1) {
    this.Positions = new SnapDecorator(this.Positions);
  }

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
  this.attachEvents();
};

Draggy.prototype.Constant = {
  'ACTIVE'   : 'drag-active',
  'DRAG_OVER': 'drag-over',
  'DRAG_END':  'drag-end'
}

Draggy.prototype.Drag = Drag;

Draggy.prototype.copy = function () {
  
  this.dropZone     = core.dom.content.querySelector('#web-forms-container');
  this.dragElements = core.dom.leftPanel.querySelectorAll('#web-forms-left > *');
  this.elementDragged = null;

  for (var i = 0; i < this.dragElements.length; i++) {
    // console.log( 'el++ ', this.dragElements[i]._config );
    this.dragElementAttachEvents( this.dragElements[i] );
  };

  this.dropZoneAttachEvents();
}

Draggy.prototype.dragElementAttachEvents = function( element ){
  element.setAttribute( 'draggable', true );
  element.addEventListener('dragstart', this.dragElementDragStart.bind( this, element ) );
  element.addEventListener('dragend',   this.dragElementDragEnd.bind(   this, element ) );
};

Draggy.prototype.dragElementRemoveEvents = function( element ){
  element.removeAttribute( 'draggable' );
  element.removeEventListener('dragstart', this.dragElementDragStart );
  element.removeEventListener('dragend',   this.dragElementDragEnd );
};

Draggy.prototype.dragElementDragStart = function( element, e ){
  console.log('dragstart', element, element._config);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text', element.outerHTML);
  e.dataTransfer.setData('config', JSON.stringify(element._config) );
  element.elementDragged = element;
}

Draggy.prototype.dragElementDragEnd   = function( element, e ){
  // console.log('dragend', element, element._config, e);
  element.elementDragged = null;
}

Draggy.prototype.dropZoneAttachEvents = function(){
  this.dropZone.addEventListener('dragover',  this.dropZoneDragOver.bind( this, this.dropZone ) );
  this.dropZone.addEventListener('dragenter', this.dropZoneDragEnter.bind( this, this.dropZone ) );
  this.dropZone.addEventListener('dragleave', this.dropZoneDragLeave.bind( this, this.dropZone ) );
  this.dropZone.addEventListener('drop',      this.dropZoneDrop.bind( this, this.dropZone ) );
};

Draggy.prototype.dropZoneDragOver  = function( element, e ){
  // console.log('dragover');
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

Draggy.prototype.dropZoneDragEnter = function( element , e ){
  // console.log('dragenter');
  element.classList.add(this.Constant.DRAG_OVER)
  element.classList.remove(this.Constant.DRAG_END)
}

Draggy.prototype.dropZoneDragLeave = function( element, e ){
  // console.log('dragleave');
  element.classList.remove(this.Constant.DRAG_OVER)
  element.classList.add(this.Constant.DRAG_END)
}

Draggy.prototype.dropZoneDrop = function( element, e ){
  console.log('drop', element, element._config );
  e.preventDefault();
  e.stopPropagation();
  
  // _drag.innerHTML = e.dataTransfer.getData('text');
  // _drag._config   = JSON.parse( e.dataTransfer.getData('config') );
  var _config = JSON.parse( e.dataTransfer.getData('config') );
  _config.preventCopy = false;

  var _element = core.elements.create( _config );

  var _drag = document.createElement('div');
  _drag.appendChild( _element.element );

  _drag._DragOptions = { snapX: 10,  snapY: 10, activeClass: "active-border" };

  element.appendChild( _drag );

  this.dragElementRemoveEvents( _drag );
  this.clonedElementAttachEvents( _drag );
  core.modules.drag.add( _drag , _drag._DragOptions );
  
  element.elementDragged = null;
  core.events.publish( "core:dom:material:update" );
  
}


Draggy.prototype.clonedElementAttachEvents = function( element ){
  element.addEventListener('mouseover',   this.clonedElementMouseOn.bind(  this, element ) );
  element.addEventListener('mouseout',  this.clonedElementMouseOut.bind( this, element ) );
};

Draggy.prototype.clonedElementMouseOn = function( element, e ){
  
  // console.log( 'clonedElementMouseOn -> ', element, e );

  if ( !element.querySelector('.drag-config-button') ) {
    this.addConfigButton( element );
  }
}

Draggy.prototype.clonedElementMouseOut = function( element, e ){
  // console.log( 'Draggy.prototype.clonedElementMouseOut ->', element, e );
  if ( !!element.querySelector('.drag-config-button') && element !== this.active ) {
    this.removeConfigButton( element );
  }
}

Draggy.prototype.addConfigButton = function( element ){
  var box = element.getBoundingClientRect();

  var config = document.createElement('div');
  config.classList.add('drag-config-button')

  config.style.positions = 'absolute';
  config.style.top       = box.top + 'px';
  config.style.left      = box.left + 'px';
  config.style.height    = box.height + 'px';
  config.style.width     = box.width + 20 + 'px';

  // <button class="mdl-button mdl-js-button mdl-button--icon">
  //   <i class="material-icons">mood</i>
  // </button>
  
  var configButton = document.createElement('button');
  configButton.className = 'mdl-button mdl-js-button mdl-button--icon';
  var icon = document.createElement('icon');
  icon.className = 'material-icons drag-small-font';
  icon.textContent = 'settings';
  configButton.appendChild( icon );

  var deleteButton = document.createElement('button');
  deleteButton.className = 'mdl-button mdl-js-button mdl-button--icon';
  var icon = document.createElement('icon');
  icon.className = 'material-icons drag-small-font';
  icon.textContent = 'clear';
  deleteButton.appendChild( icon );

  configButton.addEventListener( 'click', this.showInfoPanel.bind(this, element ) );
  deleteButton.addEventListener( 'click', this.deleteElement.bind(this, element ) );
  
  config.appendChild( configButton );
  config.appendChild( deleteButton );

  element.appendChild( config );
}

Draggy.prototype.showInfoPanel = function( element, e ){
  console.log( 'showInfoPanel', element, element._DragOptions, element._config );
  
  core.events.publish("core:web-forms:infoPanel:show", element.firstElementChild );
  core.events.publish("core:dom:infoPanel:show");
}

Draggy.prototype.deleteElement = function( element, e ){
  console.log( 'deleteElement', element );
  this.remove( element );
}

Draggy.prototype.remove = function( element ){
  console.log( 'Draggy.prototype.remove', element );
  
  for (var i = 0, length = this.elements.length; i < length; i++) {
    
    if ( this.elements[i].el == element ) {
      this.elements[i].el.remove();
      this.elements.splice(i, 1);

      core.events.publish("core:dom:infoPanel:hide");
      setTimeout( function(){ core.events.publish("core:dom:infoPanel:clear") } , 500);
      break;
    };

  };
}

Draggy.prototype.removeConfigButton = function( element ){
  // console.log( 'Draggy.prototype.removeConfigButton ->', element );
  if ( !!element.querySelector('.drag-config-button') ) {
    element.querySelector('.drag-config-button').remove();
  }
}

Draggy.prototype.setActive = function( element, e ){
  // console.log( 'setActive', e, element, element._config);

  for(var k = 0, length = this.elements.length; k < length; k++){
    if ( this.elements[k].el !== element ) {
      this.elements[k].el.classList.remove( this.Constant.ACTIVE );
      this.removeConfigButton( this.elements[k].el );
    } else {
      element.classList.add( this.Constant.ACTIVE );
      this.active = element;
    }
  }
};

Draggy.prototype.add = function( element, config ){
  console.log( 'Draggy.prototype.add', element, element._config );
  
  this.elements.push( new this.Drag( element, config ) );
  element.addEventListener('click', this.setActive.bind(this, element) );
};

Draggy.prototype.export = function(){
  var result = [];

  for(var k = 0, length = this.elements.length; k < length; k++){
    result.push({
      element : this.elements[k].el.outerHTML,
      options : {
        drag    : this.elements[k].options,
        id      : this.elements[k].el.id,
        name    : this.elements[k].el.name,
        title   : this.elements[k].el.title,
        require : this.elements[k].el.require
      }
    });
  }

  return JSON.stringify(result);
};

Draggy.prototype.attachEvents = function(){
  var draggy = this;
  document.addEventListener('DOMContentLoaded', function(){

    core.events.subscribe("core:drag:attachEvents", function(){
      console.log('Draggy <- core:drag:attachEvents');
      draggy.copy();
    });

    core.events.subscribe("core:drag:export", function(){
      console.log('Draggy <- core:drag:export');

      core.events.publish("core:web-forms:drag:export:result", draggy.export() );
    });

  });
};



module.exports = Draggy;