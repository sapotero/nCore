'use strict';

core.modules.router = (function() {

  var Router = function(){
    this.name = '';
  };

  Router.prototype.start = function() {
    // console.log( 'Router: start' );
  };
  Router.prototype.stop = function() {
    // console.log( 'Router: stop' );
  };
  Router.prototype.destroy = function() {
    // console.log( 'Router: destroy' );
  };

  var router = new Router();

  core.events.subscribe("core::start:all", function(){
    console.log('core::start:router');
    router.start();
  });

  return router;
}());