'use strict';

var preloader = require('./preloader');

module.exports = function(){
  document.addEventListener('DOMContentLoaded', function(){ 
    
    core.events.subscribe( "core::preloader:start", function () {
      console.log( "preloader <-core::preloader:start" );
      // core.events.publish("core::preloader:start");
    });

    core.events.subscribe( "core::preloader:finish", function () {
      console.log( "preloader <-core::preloader:finish" );
      // core.events.publish("core::template:start");
    });

    core.events.subscribe( "core::preloader:ready", function () {
      console.log("preloader <- core::preloader:ready");
      // core.events.publish("core::progressbar:build");
    });

  }, false);
}(window);