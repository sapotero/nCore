"use strict";
core.modules.reports = (function(){

  var ReportSettings = function(config){
    this.current_date = new Date();
    this.currentYear  = this.current_date.getFullYear();
    this.periodStart  = this.current_date;
    this.periodEnd    = this.current_date;
    this.main         = this.current_date.getFullYear();
    this.compare      = this.current_date.getFullYear()-1;
    this.isYearReport = config.isYearReport || false;
    this.isTemplate   = config.isTemplate || false;
    this.isNew        = config.isNew || true;
  };

  var Report = function(config){
    this._id         = config._id         || '';
    this.name        = config.name        || '';
    this.description = config.description || '';
    this.author      = config.author;
    this.providerId  = config.provider_id;
    this.query       = {};
    this.globalQuery = {};
    this.settings    = new ReportSettings(config.settings);
  };

  var Reports = function(){
    this.documents = [];
    
    this.bindEvents();
  };
  Reports.prototype.Report = Report;
  Reports.prototype.init = function(){
    core.events.publish( "core::reports:load" );
  };
  Reports.prototype.bindEvents = function(){
    var reports = this;

    core.events.subscribe("core::reports:loaded", function(rawData){
      console.log( 'RAW REPORTS', rawData );
      for (var type in rawData.raw ) {
        var data = rawData.raw[type];

        // console.log( '***++', type, rawData.raw[type] );
        
        for (var i = data.length - 1; i >= 0; i--) {
          var _d = data[i];
          var report = {
            _id         : _d._id,
            name        : _d.name,
            description : _d.description,
            
            author : {
              id   : _d.author_id,
              name : _d.author_id
            },

            providerId  : _d.provider_id,

            query       : _d.query,
            globalQuery : _d.globalQuery,

            settings : {
              periodStart  : _d.periodStart,
              periodEnd    : _d.periodEnd,
              main         : _d.main,
              compare      : _d.compare,
              isYearReport : _d.yearReport,
              isTemplate   : _d.template,
              providerSelected : _d.providerSelected
            }
          };
          
          reports.add( type, report );
        }

      }
    });
  };
  Reports.prototype.clear = function(config) {
    this.documents = {};
  };
  Reports.prototype.add = function( type, config ) {
    console.log( 'type, config',type, config );

    if ( !this.documents.hasOwnProperty(type) ) {
      this.documents[type] = [];
    }

    this.documents[type].push( new this.Report(config) );
  };
  Reports.prototype.show = function(id) {
    console.log( 'Reports: show -> ', id );
  };

  Reports.prototype.start = function() {
    console.log( 'Reports: start' );
    this.init();
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