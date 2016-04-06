'use strict';

core.dom = (function(){
  var DomManager = function(){
    this.root        = document;
    this.application = {};
    this.snackbar    = {};

  };

  DomManager.prototype.start = function() {
    console.log( 'DomManager: start' );
    
    var application = document.createElement('div');
    application.id = 'core-application';
    this.application = application;

    this.root.body.appendChild( application );

  };
  DomManager.prototype.stop = function() {
    console.log( 'DomManager: stop' );
  };
  DomManager.prototype.destroy = function() {
    console.log( 'DomManager: destroy' );
  };

  var manager = new DomManager();
  
  core.events.subscribe("dom:getElement", function( selector ){
    console.log( 'dom:getElement', selector );
    // return manager.root.querySelector( selector );
  });
  core.events.subscribe("getSnackbar", function( selector ){
    return manager.snackbar;
  });

  return manager;
})();