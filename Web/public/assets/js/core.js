'use strict';

core = (function(){
  var Mediator  = require('./core/mediator/mediator'),
      WebWorker = require('./core/webworker/webworker'),
      Utils     = require('./core/utils/utils'),
      Dom       = require('./core/dom/dom'),
      Draggy    = require('./core/draggy/draggy'),
      
      Preloader   = require('./modules/preloader/preloader'),
      Router      = require('./modules/router/router'),
      Snackbar    = require('./modules/snackbar/snackbar'),
      Templates   = require('./modules/templates/templates'),
      Reports     = require('./modules/reports/reports'),
      WebForms    = require('./modules/web-forms/web-forms'),
      PrintForms  = require('./modules/print-forms/print-forms'),
      Bps         = require('./modules/bp/bp');

  var Core = function( config ){
    this.events   = new Mediator();
    this.worker   = new WebWorker();
    this.utils    = new Utils();
    this.dom      = new Dom();
    this.modules  = {
      'preloader'   : new Preloader(),
      'router'      : new Router(),
      'snackbar'    : new Snackbar(),
      'templates'   : new Templates(),
      'reports'     : new Reports(),
      'web-forms'   : new WebForms(),
      'print-forms' : new PrintForms(),
      'bps'         : new Bps(),
      'drag'        : new Draggy()
    };
    this.debug    = true;

    this.bindEvents();
  };

  Core.prototype.bindEvents = function() {
    require('./core/events');
  };
  Core.prototype.loadCustomElements = function(elements){
    console.log( 'Core :: loadCustomElements', elements );
  };

  Core.prototype.start = function(module) {
    // this.events.publish( "core:start:" + module );
    // this.events.publish("core:preloader:start")
  };

  Core.prototype.destroy = function(module) {
    this.events.publish( "core:destroy:" + module );
  };
  
  Core.prototype.build = function(module) {
  };

  Core.prototype.startAll = function() {
    console.log('core:startAll');
    this.events.publish("core:dom:build:application")
    // setTimeout( core.events.publish("core:preloader:start"), 100 );
  };
  Core.prototype.destroyAll = function() {
    this.events.publish("core:destroy:all");
  };

  return new Core();
})();
