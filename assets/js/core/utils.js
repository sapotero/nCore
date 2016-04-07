'use strict';

core.utils = (function(){
  var Utils = function(){
    this.element = [];
  };
  Utils.prototype.merge = function (from, to) {
    var result = {};

    for ( var key in from ) {
      if ( from.hasOwnProperty(key) ) {
        if ( !result.hasOwnProperty(key) ) {
          result[key] = from[key]
        };
      }
    }
    for (var key in to) {
      if (to.hasOwnProperty(key)) {
        if ( !result.hasOwnProperty(key) ) {
          result[key] = to[key]
        };
      }
    }
    return result;
  }
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
