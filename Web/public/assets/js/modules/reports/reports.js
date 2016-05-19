"use strict";

var ReportSettings = function ReportSettings(config){
  this.currentDate = new Date();
  this.currentYear  = this.currentDate.getFullYear();
  this.periodStart  = this.currentDate;
  this.periodEnd    = this.currentDate;
  this.main         = this.currentDate.getFullYear();
  this.compare      = this.currentDate.getFullYear()-1;
  
  this.isYearReport = config.isYearReport || false;
  this.isTemplate   = config.isTemplate || false;
  this.isNew        = config.isNew || true;
};

var Report = function Report(config){
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

Report.prototype.attachEvents = function(){
  var report = this;
  
  core.events.subscribe("core:template:reports:editor", function(template){
    report.update( template.raw );
  });
};

Report.prototype.cardClickHandler = function(e){
  console.log( 'Report: cardClickHandler', e, this );
  location.hash = '#reports/' + this._id;
};

Report.prototype.editor = function( config ){
};


Report.prototype.render = function( config ){

  this.element = core.elements.create({
    elementType : 'card',
    preventCopy : true,

    // height : 200,
    // width  : 200,
    class: [ "mdl-cell", "mdl-cell--4-col" ],
    title    : this.name,
    // subTitle : this.description,
    shadow : 8,
    // media  : {
    //   // image src
    //   src: '',
    // },
    description : this.name,
    actions : [
      core.elements.create({
        elementType : 'button',
        preventCopy : true,
        name        : 'test-check',
        icon        : 'star'
      }),

      core.elements.create({
        elementType : 'spacer'
      }),

      core.elements.create({
        elementType : 'icon',
        icon: 'star'
      }),
    ],
    menu : [
      core.elements.create({
        elementType : 'button',
        preventCopy : true,
        name        : 'test-check',
        icon        : 'star'
      }),
    ]
  })

  return this.element.element;
};


var Reports = function Reports(){
  this.element   = {};
  this.documents = [];
  this.current   = {};

  this.leftPanel = {};
  this.content   = {};
  this.infoPanel = {};

  this.bindEvents();
};


Reports.prototype.renderLeftPanel = function(){
  var list = core.elements.create( {
    elementType : 'list',
    items: [
      // минимальный вариант
      {
        title : 'menu item'
      },

      // минимальный вариант + иконка
      {
        title : 'menu item',
        icon  : 'event'
      },

      {
        title : 'menu item',
        icon  : 'event',
        subTitle : 'menu item',
      },

      {
        title : 'menu item',
        icon  : 'event',
        action : {
          icon : 'star',
        },
      },
      {
        title : 'menu item',
        icon  : 'event',
        action : {
          href : '#',
          icon : 'star',
          title : 'tesst'
        },
      },
      {
        title : 'menu item',
        subTitle : 'menu item',
        icon  : 'event',
        action : {
          href : '#',
          icon : 'star',
          title : 'tesst'
        },
      },
      {
        title : 'menu item',
        subTitle : 'menu item',
        icon  : 'event',
        action : {
          element: core.elements.create({
            elementType : 'button',
            preventCopy : true,
            name        : 'test-check',
            fab         : true,
            icon        : 'star'
          })
        },
      },
    ]
  });

  core.dom.leftPanel.element.appendChild( list.element );
}

Reports.prototype.renderInfoPanel = function(){
  var list = core.elements.create( {
    elementType : 'list',
    items: [
      // минимальный вариант
      {
        title : 'menu item'
      },

      // минимальный вариант + иконка
      {
        title : 'menu item',
        icon  : 'event'
      },

      {
        title : 'menu item',
        icon  : 'event',
        subTitle : 'menu item',
      },

      {
        title : 'menu item',
        icon  : 'event',
        action : {
          icon : 'star',
        },
      },
      {
        title : 'menu item',
        icon  : 'event',
        action : {
          href : '#',
          icon : 'star',
          title : 'tesst'
        },
      },
      {
        title : 'menu item',
        subTitle : 'menu item',
        icon  : 'event',
        action : {
          href : '#',
          icon : 'star',
          title : 'tesst'
        },
      },
      {
        title : 'menu item',
        subTitle : 'menu item',
        icon  : 'event',
        action : {
          element: core.elements.create({
            elementType : 'button',
            preventCopy : true,
            name        : 'test-check',
            fab         : true,
            icon        : 'star'
          })
        },
      },
    ]
  });

  core.dom.infoPanel.element.appendChild( list.element );

}


Reports.prototype.renderContent = function(){
  var reports = this;

  this.content = document.createElement('div');
  this.content.className = 'mdl-spinner mdl-js-spinner mdl-spinner--single-color is-active';

  core.dom.content.element.appendChild( this.content );
  core.events.publish('core:dom:material:update');
  

  var load = new Promise( function( resolve, reject ){
     setTimeout( function(){
       if ( reports.documents.length ) {
         var df = document.createDocumentFragment();
         
         for(var j = 0, length = reports.documents.length; j < length; j++){
           console.log( reports.documents[j] );
           var report = reports.documents[j];
           df.appendChild( report.render() );
         }

         resolve( df );
       } else {
         reject( false );
       }
      
     }, 5000 );
  });

  load.then( function( documentFragment ){
    reports.content.className   = 'mdl-grid documentCards animated';
    reports.content.textContent = '';
    reports.content.appendChild( documentFragment );
  }).catch( function ( error ) {
    reports.content.className = '';
    reports.content.innerHTML = 'no elements';
    throw new Error( 'Reports -> renderContent', error );
  });
}

Reports.prototype.render = function() {
  
  core.events.publish( "core:dom:application:clear" );
  core.events.publish( "core:current:set", this );


  this.renderLeftPanel();
  this.renderContent();
  this.renderInfoPanel();

  core.events.publish('core:dom:material:update');
}

Reports.prototype.Report = Report;
Reports.prototype.init = function(){
  core.events.publish( "[ + ] core:reports:init" );

  this.element = document.createElement('div');
  this.render();
};
Reports.prototype.bindEvents = function(){
  var reports = this;

  document.addEventListener('DOMContentLoaded', function(){

    
    core.events.subscribe("core:reports:render", function(){
      reports.render();
    });

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

    core.events.subscribe("core:reports:loaded", function(data){
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
        reports.add( report );
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

Reports.prototype.add = function(  config ) {
  this.documents.push( new this.Report(config) );
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