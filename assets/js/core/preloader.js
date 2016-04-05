'use strict';

core.preloader = (function(){

  var Preloader = function(){
    this.element = [];
  };
  Preloader.prototype.start = function() {
    console.log( 'Preloader: start' );
  };

  return new Preloader();
})();