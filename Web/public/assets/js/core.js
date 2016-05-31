'use strict';

core = (function(){
  var Mediator   = require('./core/mediator/mediator'),
      WebWorker  = require('./core/webworker/webworker'),
      Utils      = require('./core/utils/utils'),
      Dom        = require('./core/dom/dom'),
      Element    = require('./core/element/element'),

      Polygon    = require('./core/polygon.js6').default,
      
      Draggy     = require('./modules/draggy/draggy'),
      Preloader  = require('./modules/preloader/preloader'),
      Router     = require('./modules/router/router'),
      Snackbar   = require('./modules/snackbar/snackbar'),
      Templates  = require('./modules/templates/templates'),
      Reports    = require('./modules/reports/reports'),
      WebForms   = require('./modules/web-forms/web-forms'),
      PrintForms = require('./modules/print-forms/print-forms'),
      User       = require('./modules/user/user'),
      Bps        = require('./modules/bp/bp');

  var Core = function( config ){
    this.events   = new Mediator();
    this.worker   = new WebWorker();
    this.utils    = new Utils();
    this.dom      = new Dom();
    this.elements = new Element();

    this.Polygon    = new Polygon(1,2);

    this.modules  = {
      'preloader'   : new Preloader(),
      'router'      : new Router(),
      'snackbar'    : new Snackbar(),
      'templates'   : new Templates(),
      'reports'     : new Reports(),
      'web-forms'   : new WebForms(),
      'print-forms' : new PrintForms(),
      'bps'         : new Bps(),
      'drag'        : new Draggy(),
      'user'        : new User(),
    };

    // какой модуль активный в данный момент
    this.current  = {};
    this.debug    = true;

    this.config = {
      webforms : {
        index  : '/webforms.json',
        update : '/webforms/'
      },
    };

    this.bindEvents();
  };

  Core.prototype.bindEvents = function() {
    require('./core/events');
  };

  Core.prototype.setCurrent = function( module ) {
    this.current = module;
  };

  Core.prototype.start = function(module) {
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
