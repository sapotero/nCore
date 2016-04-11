'use strict';

core.preloader = (function(){

  var Preloader = function(){
    this.modules = ['userInfo', 'userDocs'];
    this.bindEvents();
  };
  Preloader.prototype.bindEvents = function() {
    var preloader = this;
    
    core.events.subscribe( "core::preloader:start", function () {
      core.events.publish("core::template:start");
    });

    core.events.subscribe( "core::preloader:ready", function () {
      console.log("++ core::preloader:ready");
      core.events.publish("core::start:progressbar");
    });

  };
  Preloader.prototype.start = function() {
    console.log( 'Preloader: start' );
    this.modules = ['userInfo', 'userDocs'];
  };
  Preloader.prototype.finish = function() {
    console.log( 'Preloader: finish' );
    core.events.publish('core::progressbar:start');
  };
  Preloader.prototype.stop = function() {
    console.log( 'Preloader: stop' );
  };
  Preloader.prototype.destroy = function() {
    console.log( 'Preloader: destroy' );
    delete this.modules;
  };

  return new Preloader();
})();