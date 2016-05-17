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

  this.element = document.createElement('div');
  this.element.className = 'report-card-full mdl-cell mdl-cell--3-col mdl-cell--12-col-phone mdl-card';

  var card = document.createElement('div');
  card.className = 'report-card mdl-card--border mdl-shadow--2dp';
  this.element.appendChild( card );

  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title mdl-card--expand';
  card.appendChild( cardTitle );
  cardTitle.addEventListener( 'click', this.cardClickHandler.bind(this) );

  var titleText = document.createElement('div');
  titleText.className = 'mdl-card__title-text';
  titleText.textContent = this.name;
  cardTitle.appendChild( titleText );

  var subTitleText = document.createElement('div');
  subTitleText.className = 'mdl-card__subtitle-text';
  // subTitleText.textContent = this.description;
  cardTitle.appendChild( subTitleText );




  var supportingText = document.createElement('div');
  supportingText.className = 'mdl-card__supporting-text';
  supportingText.textContent = this.description;
  card.appendChild( supportingText );

  var actions = document.createElement('div');
  actions.className = 'mdl-card__actions mdl-card--border';
  // actions.textContent = this.description;
  card.appendChild( actions );

  var button = document.createElement('a');
  button.className = 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect';
  button.textContent = 'добавить';
  actions.appendChild( button );

  var spacer = document.createElement('div');
  spacer.className = 'mdl-layout-spacer';
  actions.appendChild( spacer );

  var icon = document.createElement('i');
  icon.className = 'material-icons';
  icon.textContent = 'stars'
  actions.appendChild( icon );

  var supportingTextDate = document.createElement('div');
  supportingTextDate.className = 'mdl-card__supporting-text mdl-card__supporting-text-date';
  supportingTextDate.textContent = this.settings.currentDate.toLocaleString();
  actions.appendChild( supportingTextDate );



  var cardMenu = document.createElement('div');
  cardMenu.className = 'mdl-card__menu';
  card.appendChild( cardMenu );

  var button = document.createElement('button');
  button.className = 'mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect';
  cardMenu.appendChild( button );

  var icon = document.createElement('i');
  icon.className = 'material-icons';
  icon.textContent = 'star'
  button.appendChild( icon );

  return this.element;
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

  core.dom.leftPanel.appendChild( list.element );
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

  core.dom.infoPanel.appendChild( list.element );

}


Reports.prototype.renderContent = function(){
  var reports = this;

  this.content = document.createElement('div');
  this.content.className = 'mdl-spinner mdl-js-spinner mdl-spinner--single-color is-active';

  core.dom.content.appendChild( this.content );
  componentHandler.upgradeElement( this.content );

  var load = new Promise( function( resolve, reject ){
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

  componentHandler.upgradeAllRegistered();
  // core.dom.content
  // core.dom.infoPanel
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