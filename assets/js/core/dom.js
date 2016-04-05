'use strict';

core.dom = (function(){
  var DomManager = function(){
    this.root        = document;
    this.application = this.root.getElementById('core-application');
    this.snackbar    = this.root.getElementById('core-snackbar');

  };

  DomManager.prototype.start = function() {
    console.log( 'DomManager: start' );
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