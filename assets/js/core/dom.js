'use strict';

core.dom = (function(){
  var DomManager = function(){
    this.root        = document;
    this.application = {};
    this.snackbar    = {};

    this.bindEvents();
  };

  DomManager.prototype.bindEvents = function() {
    var dom = this;

    core.events.subscribe("core::start:all", function(){
      console.log('core  > dom > bindEvents > core::start:all');
      manager.start();
    }, { priority: 0 });

    core.events.subscribe("core::dom:updateApplication", function(application){
      dom.root.body.appendChild(application);
    }, { priority: 0 });
  };

  DomManager.prototype.start = function() {
    console.log( 'DomManager: start' );
  };
  DomManager.prototype.stop = function() {
    console.log( 'DomManager: stop' );
  };
  DomManager.prototype.destroy = function() {
    console.log( 'DomManager: destroy' );
  };

  var manager = new DomManager();

  return manager;
})();