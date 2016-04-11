"use strict";
core.modules.reports = (function(){
  var Report = function(){
    this.name = '';
  };
  var Report = function(){
    this.element = [];
  };

  var Reports = function(){
    this.element = [];
  };
  Reports.prototype.show = function(id) {
    console.log( 'Reports: show -> ', id );
  };

  Reports.prototype.start = function() {
    console.log( 'Reports: start' );
  };
  Reports.prototype.stop = function() {
    console.log( 'Reports: stop' );
  };
  Reports.prototype.destroy = function() {
    console.log( 'Reports: destroy' );
    this.element = [];
  };

  return new Reports();
})();