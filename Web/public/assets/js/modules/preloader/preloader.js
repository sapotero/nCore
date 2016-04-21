'use strict';

var Preloader = function(){
  this.tasks  = {
    start  : [ 'progressbar', 'router', 'snackbar'/*'reports' ,'templates' */ ],
    load   : [ 'reports', 'criterias', 'criteriaKeys', 'bps', 'web-forms', 'print-forms' ],
  };
  this.total   = 0;
  this.loaded  = 0;
  this.percent = 0;
  this.element = {};
  this.bindEvents();
};
Preloader.prototype.bindEvents = function() {
  var preloader = this;

  document.addEventListener('DOMContentLoaded', function(){
    core.events.subscribe( "core:preloader:start", function () {
      console.log( "Preloader <-core:preloader:start" );
      preloader.start();
    });

    core.events.subscribe( "core:preloader:task:ready", function () {
      preloader.loaded++;
      console.log("* Preloader <- core:preloader:ready | " + `${parseInt( preloader.loaded, 10 )} ${parseInt( preloader.total, 10 )}` +  ` | ${parseInt( preloader.loaded, 10 ) === parseInt( preloader.total, 10 )}` +"\n\n");
      
      preloader.percent = Math.round( (preloader.loaded/preloader.total*100) / 10) * 10;
      // console.log( "core:dom:progressbar:update", preloader.percent );
      core.events.publish( "core:dom:progressbar:update", preloader.percent );

      if ( parseInt( preloader.loaded, 10 ) === parseInt( preloader.total, 10 ) ) {
        core.events.publish("core:preloader:finish");

        core.dom.splashscreen.hide();
        setTimeout(function(){
          core.dom.splashscreen.remove();
          core.dom.splashscreen = {};
        }, 1000);
      }
    });
  });
};

Preloader.prototype.start = function() {
  console.log( 'Preloader: start' );

  for (var type in this.tasks) {
    this.total += this.tasks[type].length;
  }

  for (var type in this.tasks) {
    var tasks = this.tasks[type];
    for (var i = tasks.length - 1; i >= 0; i--) {
      console.log( `Preloader -> core:${tasks[i]}:${type}` );
      core.events.publish( `core:${tasks[i]}:${type}` );
    }
  }
};
Preloader.prototype.stop = function() {
  console.log( 'Preloader: stop' );
};
Preloader.prototype.finish = function() {
  console.log( 'Preloader: finish' );
  // core.events.publish('core:progressbar:start');
};
Preloader.prototype.destroy = function() {
  console.log( 'Preloader: destroy' );
};

module.exports = Preloader;
