'use strict';

var Preloader = function(){
  this.tasks  = {
    start : [ 'progressbar', 'router', 'templates', 'snackbar'/*'reports',*/ ],
    load  : [ 'reports', 'criterias', 'criteriaKeys' ]
  };
  this.total  = 0;
  this.loaded = 0;

  this.bindEvents();
};
Preloader.prototype.bindEvents = function() {
  var preloader = this;

  document.addEventListener('DOMContentLoaded', function(){
    core.events.subscribe( "core::preloader:start", function () {
      console.log( "preloader <-core::preloader:start" );
      preloader.start();
    });

    core.events.subscribe( "core::preloader:finish", function () {
      console.log( "preloader <-core::preloader:finish" );
      // core.events.publish("core::template:start");
    });

    core.events.subscribe( "core::preloader:task:ready", function () {
      console.log("preloader <- core::preloader:ready");
      preloader.count++;
      
      if (preloader.count === preloader.total) {
        core.events.publish("core::progressbar:finish");
      }
    });
  });
};
Preloader.prototype.start = function() {
  console.log( 'Preloader: start' );

  for (var type in this.tasks) {
    
    var tasks = this.tasks[type];

    this.count += tasks.count;

    console.log( type, tasks );

    for (var i = tasks.length - 1; i >= 0; i--) {
      console.log( `Preloader -> core::${tasks[i]}:start` );
      core.events.publish( `core::${tasks[i]}:start` );
    }
  }
};
Preloader.prototype.finish = function() {
  console.log( 'Preloader: finish' );
  // core.events.publish('core::progressbar:start');
};
Preloader.prototype.stop = function() {
  console.log( 'Preloader: stop' );
};
Preloader.prototype.destroy = function() {
  console.log( 'Preloader: destroy' );
};

module.exports = Preloader;
