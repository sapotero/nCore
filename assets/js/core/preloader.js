'use strict';

core.preloader = (function(){

  var Preloader = function(){
    this.modules = [];
  };
  Preloader.prototype.start = function() {
    console.log( 'Preloader: start' );
    this.modules = ['userInfo', 'userDocs'];
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