'use strict';

core.utils = (function(){
  var Utils = function(){
    this.element = [];
  };
  Utils.prototype.start = function() {
    console.log( 'Utils: start' );
  };

  return new Utils();
})();
