'use strict';

var RestrictionDecorator = require('./RestrictionDecorator');
var AxisDecorator        = require('./AxisDecorator');
var SnapDecorator        = require('./SnapDecorator');
var PositionDecorator    = require('./PositionDecorator');
var Positions            = require('./Positions');

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

  this.delay   = 1000;
  this.timeout = {};
  
  // var box     = this.el.getBoundingClientRect();
  // var content = core.dom.content.element.getBoundingClientRect();

  // this.el.style.top      = box.top  + 'px';
  // this.el.style.left     = box.left + 'px';
  this.el.style.position = "absolute";

  if ( this.el.hasOwnProperty('_options') ) {
    
    // console.log( '-----------' );
    // console.log( content );
    // console.log( this.el._options );

    // var __content = core.dom.content.element.getBoundingClientRect();
    this.el.style.top  = this.el._options.top  + 'px';
    this.el.style.left = this.el._options.left + 'px';
  }

  this.Positions = new Positions(this.options);

  if (this.options.axisX === false || this.options.axisY === false) {
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

  if (event.preventDefault && !this.el.nodeName === 'INPUT') {
    // event.preventDefault();
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

  this.isDrag = true;
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

  this.saveForm();
};

Drag.prototype.mousemoveHandler = function(e) {
  var mouseX = document.all ? window.event.clientX : e.pageX,
      mouseY = document.all ? window.event.clientY : e.pageY;

  this.Positions.setPoints({
    lastMouseX: mouseX,
    lastMouseY: mouseY
  });

  if (this.isDrag === false){
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
  if (this.isDrag === false){
    return;
  }

  var event = document.all ? window.event : e;

  // console.log( 'mouseupHandler', event );
  event.preventDefault();
  event.stopPropagation();

  if ( this.options.activeClass ) {
    this.el.classList.remove( this.options.activeClass );
  }

  e['distanceX'] = this.Positions.getDistanceX();
  e['distanceY'] = this.Positions.getDistanceY();

  if (typeof this.options.onStop === 'function') {
    this.options.onStop(e, this.el);
  }

  this.el.style.zIndex = '';
  this.isDrag = false;
};

Drag.prototype.saveFormEvent = function() {
  core.events.publish( "core:web-form:save" );
  core.events.publish( "core:snackbar:show", { message: 'save!' } );
}
Drag.prototype.saveForm = function() {
  clearTimeout( this.timeout );
  this.timeout = setTimeout( this.saveFormEvent, this.delay);
};

var Draggy = function( config ){
  this.elements = [];
  this.active   = {};
  this.events   = true;
  
  this.top  = 0;
  this.left = 0;

  this.detachEvents();
  this.attachEvents();
};

Draggy.prototype.Constant = {
  ACTIVE    : 'drag-active',
  DRAG_OVER : 'drag-over',
  DRAG_END  : 'drag-end'
}

Draggy.prototype.Drag = Drag;

Draggy.prototype.editorStart = function () {
  
  console.log( 'EDITOR START', this.elements );

  this.dropZone     = core.dom.content.element;
  this.dragElements = core.dom.leftPanel.element.querySelectorAll('._drag');
  this.elementDragged = null;

  var box = this.dropZone.getBoundingClientRect();
  this.top  = box.top;
  this.left = box.left;

  for (var i = 0; i < this.dragElements.length; i++) {
    
    console.log( 'el++ ', this.dragElements[i] );

    this.dragElementAttachEvents( this.dragElements[i] );
  };
  
  if ( this.events ) {
    this.dropZoneAttachEvents();
    this.events = false
  }

}
Draggy.prototype.editorCheck = function () {
  var _elements = [];

  for (var v = 0; v < this.elements.length; v++) {
    console.log( '**', this.elements[v] );
    if ( document.body.contains( this.elements[v].el ) ) {
      _elements.push( this.elements[v] )
    }
  }
  this.elements = _elements;

  console.log( 'EDITOR CHECK', this.elements, _elements );
}

Draggy.prototype.editorStop = function () {
  // this.elements = [];
  console.log( 'EDITOR STOP', this.elements );
  this.dropZoneRemoveEvents();
  this.detachEvents();
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
  // console.log('dragstart', element, element._config);
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
  this.dropZone.addEventListener('click',     this.dropZoneClearSelection.bind( this, this.dropZone ) );
};

Draggy.prototype.dropZoneRemoveEvents = function(){
  // console.log( 'dropZoneRemoveEvents' );
  this.dropZone = core.dom.content.element;

  this.dropZone.removeEventListener('dragover',  this.dropZoneDragOver.bind(this) );
  this.dropZone.removeEventListener('dragenter', this.dropZoneDragEnter.bind(this) );
  this.dropZone.removeEventListener('dragleave', this.dropZoneDragLeave.bind(this) );
  this.dropZone.removeEventListener('drop',      this.dropZoneDrop.bind(this) );
  this.dropZone.removeEventListener('click',     this.dropZoneClearSelection.bind(this) );
};


Draggy.prototype.dropZoneClearSelection  = function( element, e ){
  // console.log('dropZoneClearSelection', element, e);
  // e.preventDefault();
  core.events.emit("core:dom:infoPanel:clear");
  core.events.emit("core:dom:infoPanel:hide");
}

Draggy.prototype.dropZoneDragOver  = function( element, e ){
  // console.log('dragover');
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

Draggy.prototype.dropZoneDragEnter = function( element , e ){
  // console.log('dragenter');
  element.classList.add(this.Constant.DRAG_OVER)
  // element.classList.remove(this.Constant.DRAG_END)
}

Draggy.prototype.dropZoneDragLeave = function( element, e ){
  // console.log('dragleave');
  element.classList.remove(this.Constant.DRAG_OVER)
  // element.classList.remove(this.Constant.DRAG_END)
}

Draggy.prototype.dropZoneDrop = function( element, e ){
  element.classList.remove(this.Constant.DRAG_OVER)

  e.preventDefault();
  e.stopPropagation();
  
  // _drag.innerHTML = e.dataTransfer.getData('text');
  // _drag._config   = JSON.parse( e.dataTransfer.getData('config') );
  var _config = JSON.parse( e.dataTransfer.getData('config') );
  _config.preventCopy = false;
  
  console.log('drop', _config );

  this.createDragElement( _config );
  
}

Draggy.prototype.createDragElement = function( _config, position ){
  // console.warn( 'Draggy.prototype.createDragElement', _config, position );

  var _element = core.elements.create( _config );
  var _createdElement = core.elements.create( _element._config );

  var _drag = document.createElement('div');
  _drag.appendChild( _createdElement.element );

  _drag._DragOptions = {
    snapX: 10,
    snapY: 10,
    activeClass: "active-border",
    restrict : this.dropZone,
  };

  core.events.emit( "core:web-form:add:body", _drag );


  this.dragElementRemoveEvents( _drag );
  this.clonedElementAttachEvents( _drag );

  // var box = core.dom.content.element.getBoundingClientRect();

  if ( position ) {
    _drag._options = position;
  }

  core.events.emit( "core:drag:add", { el: _drag , options: _drag._DragOptions } )
  core.events.emit( "core:dom:material:update" );
  
  core.events.emit( "core:web-form:content:add", _drag );
};


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
  // var box = element.getBoundingClientRect();

  var config = document.createElement('div');
  config.classList.add('drag-config-button')

  var configButton = core.elements.create({
    elementType : 'button',
    icon : 'settings',
    flex : true,
  });
  var deleteButton = core.elements.create({
    elementType : 'button',
    icon : 'clear',
    flex : true,
  });

  configButton.element.addEventListener( 'click', this.showInfoPanel.bind(this, element ) );
  deleteButton.element.addEventListener( 'click', this.deleteElement.bind(this, element ) );
  
  config.appendChild( configButton.element );
  config.appendChild( deleteButton.element );

  element.appendChild( config );
}

Draggy.prototype.showInfoPanel = function( element, e ){
  e.preventDefault();
  e.stopPropagation();

  // console.log('---------------');
  // console.log( 'showInfoPanel', element, element.firstElementChild._config );
  
  core.events.emit("core:web-forms:infoPanel:show", element.firstElementChild );
  core.events.emit("core:dom:infoPanel:show");
}

Draggy.prototype.deleteElement = function( element, e ){
  // console.log( 'deleteElement', element );
  this.remove( element );
}

Draggy.prototype.remove = function( element ){
  // console.log( 'Draggy.prototype.remove', element );
  
  for (var i = 0, length = this.elements.length; i < length; i++) {
    
    if ( this.elements[i].el == element ) {
      this.elements[i].el.remove();
      this.elements.splice(i, 1);

      core.events.emit("core:dom:infoPanel:hide");
      setTimeout( function(){ core.events.emit("core:dom:infoPanel:clear") } , 500);
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
  if ( element.classList.contains( this.Constant.ACTIVE ) ) {
    return false;
  }

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
  // console.log( 'Draggy.prototype.add', element, element._config );
  
  // debugger

  this.elements.push( new this.Drag( element, config ) );
  element.addEventListener('mouseover', this.setActive.bind(this, element) );
};

Draggy.prototype.export = function(){
  
  // console.log( this.elements );
  // var _elements = [],
  //     _temp = [];
  // for(var z = 0, length = this.elements.length; z < length; z++){
  //   document.body.contains( this.elements[z].el ) ? _elements.push[ this.elements[z] ] : false ;
  // }
  
  // _temp = this.elements;
  // this.elements = _elements;

  var result = [];

  for(var k = 0, length = this.elements.length; k < length; k++){
    console.log( 'export el', this.elements[k].el.firstElementChild._conf.constructor.name );
    var box = this.elements[k].el.getBoundingClientRect();

    var elementConfig   = this.elements[k].el.firstElementChild._config;
  //   elementConfig.label = this.elements[k].el.firstElementChild._conf.label.textContent;

  //   switch( this.elements[k].el.firstElementChild._conf.constructor.name ){
  //     case 'Checkbox':
  //       elementConfig.name    = this.elements[k].el.firstElementChild._conf.checkbox.name;
  //       elementConfig.checked = this.elements[k].el.firstElementChild._conf.checkbox.checkbox;
  //       elementConfig.require = this.elements[k].el.firstElementChild._conf.checkbox.required;
  //       break;
  //     case 'Radio':
  //       elementConfig.name    = this.elements[k].el.firstElementChild._conf.radio.name;
  //       elementConfig.value   = this.elements[k].el.firstElementChild._conf.radio.value;
  //       elementConfig.checked = this.elements[k].el.firstElementChild._conf.radio.checkbox;
  //       elementConfig.require = this.elements[k].el.firstElementChild._conf.radio.required;

  //       break;
  //     case 'Input':
  //       elementConfig.name    = this.elements[k].el.firstElementChild._conf.input.name;
  //       elementConfig.value   = this.elements[k].el.firstElementChild._conf.input.value;
  //       elementConfig.require = this.elements[k].el.firstElementChild._conf.input.required;

  //       break;
  //     case 'Textarea':
  //       elementConfig.name    = this.elements[k].el.firstElementChild._conf.textarea.name;
  //       elementConfig.value   = this.elements[k].el.firstElementChild._conf.textarea.value;
  //       elementConfig.require = this.elements[k].el.firstElementChild._conf.textarea.required;

  //       break;
  //     default:
  //       break;
  //   }
  //   // elementConfig.name  = this.elements[k].el.firstElementChild._conf.checkbox.textContent;

    result.push({
      element : elementConfig,
      options : {
        top    : box.top  - this.top,
        left   : box.left - this.left,
        width  : this.width,
        height : this.height,
      },
      drag : {
        snapX: 10,
        snapY: 10,
        activeClass: "active-border"
      },
    });
  }

  // this.elements = [];

  return JSON.stringify(result);
};


Draggy.prototype.detachEvents = function(){
  document.addEventListener('DOMContentLoaded', function(){
    core.events.remove( "core:drag:add" );
    core.events.remove( "core:drag:export" );
    core.events.remove( "core:drag:editor:start" );
    core.events.remove( "core:drag:editor:stop" );
    core.events.remove( "core:drag:editor:check" );
    core.events.remove( "core:drag:create:element" );
  });
};

Draggy.prototype.attachEvents = function(){
  var draggy = this;
  document.addEventListener('DOMContentLoaded', function(){

    core.events.on("core:drag:add", function( config ){
      draggy.add( config.el , config.options );
    });

    core.events.on("core:drag:editor:start", function(){
      console.log('Draggy <- core:drag:editor:start');
      draggy.editorStart();
    });

    core.events.on("core:drag:editor:stop", function(){
      console.log('Draggy <- core:drag:editor:stop');
      draggy.editorStop();
    });

    core.events.on("core:drag:editor:check", function(){
      console.log('Draggy <- core:drag:editor:check');
      draggy.editorCheck();
    });

    

    core.events.on("core:drag:export", function(){
      console.log('Draggy <- core:drag:export');
      
      var _export = draggy.export();

      core.events.emit("core:web-form:export:result", _export );
    });

    core.events.on("core:drag:create:element", function( config, position ){
      // console.info('Draggy <- core:drag:create:element', config, position );
      draggy.createDragElement( config, position );
    });


  });
};



module.exports = Draggy;