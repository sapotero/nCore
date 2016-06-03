'use strict';

var Shortcut = function( options ){
  if ( typeof options === 'undefined' ) {
    throw new Error( 'Can`t create shortcut without options' );
  }

  if ( !options.hasOwnProperty('manager') && options.manager.constructor.name !== 'ShortcutManager' ) {
    throw new Error( 'No ShortcutManager present' );
  }
  if ( !options.hasOwnProperty('shortcut') ) {
    throw new Error( 'No shortcut key combination present' );
  }
  if ( !options.hasOwnProperty('callback') ) {
    throw new Error( 'No callback present' );
  }

  this.manager  = options.manager;
  this.shortcut = options.shortcut.toLowerCase();
  this.callback = options.callback;
  this.options  = options.options;
  this.element  = {};
  this.modifiers = {
    shift : { wanted:false, pressed:false },
    ctrl  : { wanted:false, pressed:false },
    alt   : { wanted:false, pressed:false },
    meta  : { wanted:false, pressed:false }
  };

  this.bindShortcut();
};

Shortcut.prototype.setOptions = function() {
  if( !this.options ){
    this.options = this.manager.CONFIG.DEFAULT_OPTIONS;
  } else {
    for( var option in this.manager.CONFIG.DEFAULT_OPTIONS) {
      if( typeof this.options[ option ] == 'undefined' ){
        this.options[option] = this.manager.CONFIG.DEFAULT_OPTIONS[option];
      }
    }
  }
}
Shortcut.prototype.setElement = function() {
  this.element = this.options.target;
  if(typeof this.options.target == 'string'){
    this.element = document.getElementById(this.options.target);
  }
}

Shortcut.prototype.setCallback = function( e ) {
  // console.log( 'Shortcut.prototype.setCallback', e );
  var event    = e || window.event,
      _element = {},
      code;
  
  if( this.options['disableOnInput'] ) {
    
    if( event.target ){
      _element = event.target;
    } else if( event.srcElement ){
      _element = event.srcElement;
    }
    
    if( _element.nodeType == 3 ){
      _element = _element.parentNode;
    }

    if( _element.tagName == 'INPUT' || _element.tagName == 'TEXTAREA' ){
      return false;
    }
  }

  if ( event.keyCode ){
    code = event.keyCode;
  } else if (event.which){
    code = event.which;
  }

  var character = String.fromCharCode(code).toLowerCase();
  
  if(code == 188){
    character = ",";
  }
  if(code == 190){
    character = ".";
  }

  var keys = this.shortcut.split("+");
  var keyPressedCounter = 0;
  

  if( event.ctrlKey ){
    this.modifiers.ctrl.pressed = true;
  }
  if( event.shiftKey ){
    this.modifiers.shift.pressed = true;
  }
  if( event.altKey ){
    this.modifiers.alt.pressed = true;
  }
  if( event.metaKey ){
    this.modifiers.meta.pressed = true;
  }

  for( var i=0; i < keys.length; i++ ) {
    var k = keys[i];

    if( k == 'ctrl' || k == 'control') {
      keyPressedCounter++;
      this.modifiers.ctrl.wanted = true;

    } else if( k == 'shift' ) {
      keyPressedCounter++;
      this.modifiers.shift.wanted = true;

    } else if( k == 'alt' ) {
      keyPressedCounter++;
      this.modifiers.alt.wanted = true;
    } else if( k == 'meta' ) {
      keyPressedCounter++;
      this.modifiers.meta.wanted = true;
    } else if( k.length > 1 ) {
      if( this.manager.CONFIG.SPECIAL_KEYS[ k ] == code){
        keyPressedCounter++;
      }
    } else if( this.options['keycode'] ) {
      if( this.options['keycode'] == code ){
        keyPressedCounter++;
      }
    } else {
      if ( character == k ){
        keyPressedCounter++;
      }
      else {
        //shift key bug created by using lowercase
        if( this.manager.CONFIG.SHIFT_NUMS[character] && event.shiftKey ) {
          character = this.manager.CONFIG.SHIFT_NUMS[character];
          if( character == k ){
            keyPressedCounter++;
          }
        }
      }
    }
  }
  
  if( keyPressedCounter == keys.length &&
      this.modifiers.ctrl.pressed  == this.modifiers.ctrl.wanted &&
      this.modifiers.shift.pressed == this.modifiers.shift.wanted &&
      this.modifiers.alt.pressed   == this.modifiers.alt.wanted &&
      this.modifiers.meta.pressed  == this.modifiers.meta.wanted ) {
    this.callback(e);

    if( !this.options['propagate'] ) {
      event.cancelBubble = true;
      event.returnValue = false;

      if ( event.stopPropagation ) {
        event.stopPropagation();
        event.preventDefault();
      }
      return false;
    }
  }
}

Shortcut.prototype.setEvents = function() {
  if( this.element.addEventListener ){
    this.element.addEventListener( this.options['type'], this.setCallback.bind(this), false);
  } else if( this.element.attachEvent ){
    this.element.attachEvent('on' + this.options['type'], this.setCallback.bind(this) );
  } else{
    this.element[ 'on' + this.options['type'] ] = this.setCallback.bind(this);
  }
}

Shortcut.prototype.bindShortcut = function() {
  this.setOptions();
  this.setElement();
  this.setEvents();
}

var ShortcutManager = function ShortcutManager(){
  this.shortcuts = [];
  this.bindEvents();
};

ShortcutManager.prototype.CONFIG = {
  SHIFT_NUMS : {
    "`"  : "~",
    "1"  : "!",
    "2"  : "@",
    "3"  : "#",
    "4"  : "$",
    "5"  : "%",
    "6"  : "^",
    "7"  : "&",
    "8"  : "*",
    "9"  : "(",
    "0"  : ")",
    "-"  : "_",
    "="  : "+",
    ";"  : ":",
    "'"  : "\"",
    ","  : "<",
    "."  : ">",
    "/"  : "?",
    "\\" : "|"
  },
  SPECIAL_KEYS : {
    'esc'         : 27,
    'escape'      : 27,
    'tab'         : 9,
    'space'       : 32,
    'return'      : 13,
    'enter'       : 13,
    'backspace'   : 8,

    'scrolllock'  : 145,
    'scroll_lock' : 145,
    'scroll'      : 145,
    'capslock'    : 20,
    'caps_lock'   : 20,
    'caps'        : 20,
    'numlock'     : 144,
    'num_lock'    : 144,
    'num'         : 144,
    
    'pause'       : 19,
    'break'       : 19,
    
    'insert'      : 45,
    'home'        : 36,
    'delete'      : 46,
    'end'         : 35,
    
    'pageup'      : 33,
    'page_up'     : 33,
    'pu'          : 33,

    'pagedown'    : 34,
    'page_down'   : 34,
    'pd'          : 34,

    'left'        : 37,
    'up'          : 38,
    'right'       : 39,
    'down'        : 40,

    'f1'          : 112,
    'f2'          : 113,
    'f3'          : 114,
    'f4'          : 115,
    'f5'          : 116,
    'f6'          : 117,
    'f7'          : 118,
    'f8'          : 119,
    'f9'          : 120,
    'f10'         : 121,
    'f11'         : 122,
    'f12'         : 123
  },
  DEFAULT_OPTIONS : {
    'type'             : 'keydown',
    'propagate'        : false,
    'disable_in_input' : false,
    'target'           : document,
    'keycode'          : false
  }
}

ShortcutManager.prototype.Shortcut = Shortcut;
ShortcutManager.prototype.add = function( shortcut, callback, options ){
  var shortcut = new this.Shortcut({
    shortcut: shortcut,
    callback: callback,
    options: options,
    manager: this,
  });

  this.shortcuts.push( shortcut );
}

ShortcutManager.prototype.start = function() {
  core.events.emit( "core:preloader:task:ready" );
};
ShortcutManager.prototype.stop = function() {
  // console.log( 'ShortcutManager: stop' );
};

ShortcutManager.prototype.stop = function() {
  console.log( 'ShortcutManager: stop' );
  this.detachEvents();
};
ShortcutManager.prototype.destroy = function() {
  console.log( 'ShortcutManager: destroy' );
  this.element.remove();

  for( var key in this ){
    delete this[ key ];
  }

  this.detachEvents();
};

ShortcutManager.prototype.detachEvents = function() {
  document.addEventListener('DOMContentLoaded', function(){
    core.events.remover( "core:shortcut:add" );
    core.events.remover( "core:shortcut:start" );
    core.events.remover( "core:shortcut:stop" );
    core.events.remover( "core:shortcut:restart" );
  });
}

ShortcutManager.prototype.bindEvents = function() {
  var shortcut = this;

  document.addEventListener('DOMContentLoaded', function(){
    core.events.on("core:shortcut:add", function( config ){
      console.log('core:shortcut:add', config);
      shortcut.add( config.shortcut, config.callback, config.options );
    });

    core.events.on("core:shortcut:load", function(){
      console.log('core:shortcut:load');
      shortcut.start();
    });
    
    core.events.on("core:shortcut:start", function(){
      console.log('core:shortcut:start');
      shortcut.start();
    });
    
    core.events.on("core:shortcut:stop", function(){
      console.log('core:shortcut:stop');
      shortcut.stop();
    });
    
    core.events.on("core:shortcut:restart", function(){
      console.log('core:shortcut:restart');
      shortcut.restart();
    });
  });
};


module.exports = ShortcutManager;

