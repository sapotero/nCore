"use strict";
core.modules.reports = (function(){

  var ReportSettings = function(config){
    this.current_date = new Date();
    this.currentYear  = config.current_date.getFullYear();
    this.periodStart  = config.current_date.formattedDate('yyyy-mm-dd');
    this.periodEnd    = config.current_date.formattedDate('yyyy-mm-dd');
    this.main         = config.current_date.getFullYear();
    this.compare      = config.current_date.getFullYear()-1;
    this.isYearReport = false;
    this.isTemplate   = false;
    this.isNew        = true;
  };

  var Report = function(config){
    this.id          = config.id          || '';
    this.name        = config.name        || '';
    this.description = config.description || '';
    
    this.author = {
      id   : config.author.id,
      name : config.author.name
    };
    this.provider_id  = config.provider_id;

    this.query       = {};
    this.globalQuery = {};

    this.settings    = new ReportSettings(config.settings);
  };

  var Reports = function(){
    this.documents = [];
  };
  Reports.prototype.load = function(config) {
    // this.documents = [];
  };
  Reports.prototype.clear = function(config) {
    this.documents = [];
  };
  Reports.prototype.add = function(config) {
    var config = {};
    this.documents.push( new Report(config) );
  };
  Reports.prototype.show = function(id) {
    console.log( 'Reports: show -> ', id );
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