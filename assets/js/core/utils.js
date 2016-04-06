'use strict';

core.utils = (function(){
  var Utils = function(){
    this.element = [];
  };
  Utils.prototype.start = function() {
    console.log( 'Utils: start' );
  };
  Utils.prototype.stop = function() {
    console.log( 'Utils: stop' );
  };
  Utils.prototype.destroy = function() {
    console.log( 'Utils: destroy' );
    this.element = [];
  };

  return new Utils();
})();
