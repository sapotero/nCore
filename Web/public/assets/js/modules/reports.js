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
    this.element     = {};
    this._id         = config._id         || '';
    this.name        = config.name        || '';
    this.description = config.description || '';
    this.author      = config.author;
    this.providerId  = config.provider_id;
    this.query       = {};
    this.globalQuery = {};
    this.settings    = new ReportSettings(config.settings);
  };
  Report.prototype.init = function(){
    core.events.remove("core::template:reports:editor");

    this.bindEvents();
    
    console.log( 'Report -> init' );

    this.element = document.createElement('div');
    core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
    core.events.publish("core::reports:editor:template");
  };
  Report.prototype.update = function(html){
    console.log( 'Report -> update' );
    this.element.innerHTML = html;
    this.element.classList.add('animated');
    this.element.classList.add('fadeIn');
    this.render();
  };
  Report.prototype.load = function(){
    console.log( 'Report -> bindEvents' );
  };
  Report.prototype.bindEvents = function(){
    var report = this;
    core.events.subscribe("core::template:reports:editor", function(template){
      // console.log('core::template:reports:editor', template );
      console.log( 'Report -> bindEvents -> loadTemplate' );
      report.update( template.raw );
    });
    
  };
  Report.prototype.render = function(){
    console.log( 'Report -> render', this );

    var helper = {
      '_id': {
        text: function (params) {
          return this._id || '-_id-';
        }
      },
      'name': {
        text: function (params) {
          return this.name || '-name-';
        }
      },
      'description': {
        text: function (params) {
          return this.description || '-description-';
        }
      },
      'providerId': {
        text: function (params) {
          return this.providerId || '-providerId-';
        }
      },
      'query': {
        text: function (params) {
          return this.query || '-query-';
        }
      },
      'globalQuery': {
        text: function (params) {
          return this.globalQuery || '-globalQuery-';
        }
      }
    };

    Transparency.render( this.element.querySelector('#report'), this, helper );
  };





  var Reports = function(){
    this.element   = {};
    this.documents = {};
    this.bindEvents();
  };
  Reports.prototype.Report = Report;
  Reports.prototype.init = function(){
    core.events.publish( "[ + ] core::reports:init" );

    this.element = document.createElement('div');
    core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
    
    core.events.publish("core::reports:template");
  };
  Reports.prototype.bindEvents = function(){
    var reports = this;

    core.events.subscribe("core::reports:loaded", function(rawData){
      // console.log( 'RAW REPORTS', rawData );
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
    
    core.events.subscribe("core::template:reports", function(template){
      reports.updateRootElement( template.raw );
    });
  };
  Reports.prototype.updateRootElement = function(html){
    this.element.innerHTML = html;
    this.element.classList.add('animated');
    this.element.classList.add('fadeIn');
    this.render();
  };
  Reports.prototype.render = function(){
    if ( !Object.keys(this.documents).length ){
      return false;
    }

    for (var type in this.documents) {
      // console.log( 'render -> type, documents', type,this.element.querySelector('.'+type),   this.documents[type] );
      var helper = {
        type: {
          text: function (params) {
            return this.type;
          }
        }
      };
      helper[type] = {
          '_id': {
            text: function (params) {
              return this._id || '-id-';
            }
          },
          name: {
            text: function (params) {
              return this.name || '-name-';
            }
          },
          link: {
            href: function (params) {
              return '#reports/' + this._id;
            }
          }
      };

      var config = {
        type: type
      };
      config[type] = this.documents[type];

      Transparency.render( this.element.querySelector('.report-'+type), config, helper );
    }
  };

  Reports.prototype.add = function( type, config ) {
    // console.log( 'type, config',type, config );

    if ( !this.documents.hasOwnProperty(type) ) {
      this.documents[type] = [];
    }

    this.documents[type].push( new this.Report(config) );
  };
  Reports.prototype.clear = function(config) {
    this.documents = {};
  };
  Reports.prototype.find = function(id) {
    for (var type in this.documents) {
      for (var i = this.documents[type].length - 1; i >= 0; i--) {
        if( this.documents[type][i]._id === id ){
          return this.documents[type][i];
        }
      }
    }
  };

  Reports.prototype.show = function(id) {
    console.log( 'Reports: show -> ', id);
    var report = this.find(id);
    if ( report ) {
      report.init();
    } else {
      throw new Error('template not found!');
    }
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