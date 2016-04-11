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
  Utils.prototype.formattedDate = function(pattern) {
    // var formattedDate = pattern.replace( 'yyyy', this.getFullYear().toString() );
    
    // var mm = (this.getMonth() + 1).toString();
    // mm = mm.length > 1 ? mm : '0' + mm;
    // formattedDate = formattedDate.replace('mm', mm);
    
    // var dd = this.getDate().toString();
    // dd = dd.length > 1 ? dd : '0' + dd;
    // formattedDate = formattedDate.replace('dd', dd);
    
    // return formattedDate;
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
