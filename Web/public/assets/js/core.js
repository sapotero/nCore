'use strict';

core = (function(){
  var Mediator  = require('./core/mediator/mediator'),
      WebWorker = require('./core/webworker/webworker'),
      Utils     = require('./core/utils/utils'),
      Dom       = require('./core/dom/dom'),

      Preloader = require('./modules/preloader/preloader');

  var Core = function( config ){
    this.events   = new Mediator();
    this.worker   = new WebWorker();
    this.utils    = new Utils();
    this.dom      = new Dom();
    this.modules  = {
      preloader : new Preloader()
    };
    this.debug    = true;

    this.bindEvents();
  };

  Core.prototype.bindEvents = function() {
    require('./core/events');
  };

  Core.prototype.start = function(module) {
    // this.events.publish( "core::start:" + module );
    this.events.publish("core::preloader:start")
  };
  
  Core.prototype.destroy = function(module) {
    this.events.publish( "core::destroy:" + module );
  };

  Core.prototype.startAll = function() {
    console.log('core::startAll');
    this.events.publish("core::preloader:start")
    // setTimeout( core.events.publish("core::preloader:start"), 100 );
  };
  Core.prototype.destroyAll = function() {
    this.events.publish("core::destroy:all");
  };

  return new Core();
})();
