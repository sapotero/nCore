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

    core.events.subscribe('core::dom:build', function(template){
      dom.build(template);
    });

    core.events.subscribe('core::dom:application:clear', function(template){
      // console.log( ' clear ->', dom.application );
      dom.application.querySelector('.core-layout-application').innerHTML = '';
    });
  };
  DomManager.prototype.build = function(template) {
    console.log( 'DomManager: build root', template );
    
    var element = document.createElement('div');
    element.id = template.name;
    element.innerHTML = template.raw;

    this.application = element;
    this.root.body.appendChild(element);

    core.events.publish("core::start:progressbar");
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