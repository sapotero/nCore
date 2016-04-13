'use strict';

var Preloader = function(){
  this.tasks = {
    init: {
      modules: [ 'progressbar', 'router', 'templates', 'reports', 'snackbar' ]
    },
    load: [ 'reports', 'criterias', 'criteriaKeys' ]
  };
  this.bindEvents();
};
Preloader.prototype.bindEvents = function() {
  require('./events');
};
Preloader.prototype.start = function() {
  console.log( 'Preloader: start' );
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
