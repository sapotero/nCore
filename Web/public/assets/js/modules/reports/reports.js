"use strict";

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

  this.detachEvents();
  this.attachEvents();
  this.destroyEditor();
  
  
  console.log( 'Report -> init' );

  this.element = document.createElement('div');
  core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
  core.events.publish("core:reports:editor:template");
  core.events.publish("core:report:load", this._id );
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
Report.prototype.detachEvents = function(){
  core.events.remove("core:template:reports:editor");
  core.events.remove("core:report:loaded");
};
Report.prototype.destroyEditor = function() {
  if ($('div#paper').data('froala.editor')) {
    $('div#paper').froalaEditor('destroy');
  }
};

Report.prototype.loadEditor = function(body) {
  var html = core.utils.Base64.decode(body);

  var initialize = new Promise(function(resolve, reject) {
    window.jQuery('div#paper').froalaEditor({
      toolbarButtons   : ['file-o', 'floppy-o', 'adjust', 'phone',  'textRotate', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', /*'formatOL'*/, 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', /*'cog', 'rotateDocument' */, 'customCalculationCell'/*, '|', 'zoom-out', 'zoom-in'*/ ],
      language         : 'ru',
      charCounterCount : false,
      toolbarSticky    : false
    });
    resolve(true);
  });

  initialize.then(function(editor) {
    $('div#paper').froalaEditor('html.set', (html ? html : '<p>') + '<p>');
  }).then(function(editor) {
    // var parent = document.querySelector('.fr-wrapper').parentNode;
    // parent.removeChild( document.querySelector('.fr-wrapper').nextSibling ) ;
    // return editor;
  }).catch(function(result) {

    console.log("ERROR!", result);
  });

};
Report.prototype.loadEditors = function(body) {
  var html = core.utils.Base64.decode(body);
  console.log( 'decoded:', html );
}


Report.prototype.attachEvents = function(){
  var report = this;
  
  core.events.subscribe("core:template:reports:editor", function(template){
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
  this.current   = {};
  this.bindEvents();
};
Reports.prototype.Report = Report;
Reports.prototype.init = function(){
  core.events.publish( "[ + ] core:reports:init" );

  this.element = document.createElement('div');
  core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
  
  core.events.publish("core:reports:template");
};
Reports.prototype.bindEvents = function(){
  var reports = this;

  document.addEventListener('DOMContentLoaded', function(){

    core.events.subscribe("core:report:loaded", function(data){
      
      var report = JSON.parse( data.raw );
      report.settings = {
        isYearReport : report.yearReport,
        isTemplate   : report.template,
        isNew        : report.new
      };

      console.log( 'core:report:loaded', report );
      reports.current = new reports.Report( report );

      core.events.publish("core:events:editor:set:html", core.utils.Base64.decode( report.body ) );

      // report.loadEditor( data.raw.body );
    });

    core.events.subscribe("core:reports:loaded", function(rawData){
      // console.log( 'RAW REPORTS', rawData );
      for (var type in rawData ) {
        var data = rawData[type];
        // console.log( '***++', type, rawData.raw[type] );
        for (var i = data.length - 1; i >= 0; i--) {
          var _d = data[i];
          var report = {
            _id         : _d._id,
            name        : _d.name,
            description : _d.description,
            update_at   : _d.updated_at,
            
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
          
          core.events.publish("core:card:add", {
            type:type,
            report:report
          });
        }
      }
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe("core:reports:start", function( template ){
      console.log('Reports <- core:reports:start');
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe("core:template:reports", function( template ){
      reports.updateRootElement( template.raw );
    });

    // клик по меню с документами
    core.events.subscribe("core:reports:menu:select", function( menuItem ){
      // console.log( 'Reports <- core:reports:menu:select', menuItem );
      core.events.publish( "core:router:go", menuItem.getAttribute('action') );
    });

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

module.exports = Reports;