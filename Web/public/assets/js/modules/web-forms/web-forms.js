"use strict";

var WebFormSettings = function(config){
  this.current_date = new Date();
  this.currentYear  = this.current_date.getFullYear();
  this.periodStart  = this.current_date;
  this.periodEnd    = this.current_date;
  this.main         = this.current_date.getFullYear();
  this.compare      = this.current_date.getFullYear()-1;
  this.isYearWebForm = config.isYearWebForm || false;
  this.isTemplate   = config.isTemplate || false;
  this.isNew        = config.isNew || true;
};

var WebForm = function(config){
  this.element     = {};
  this._id         = config._id         || '';
  this.name        = config.name        || '';
  this.description = config.description || '';
  this.author      = config.author;
  this.providerId  = config.provider_id;
  this.query       = {};
  this.globalQuery = {};
  this.settings    = new WebFormSettings(config.settings);
};
WebForm.prototype.init = function(){

  this.detachEvents();
  this.attachEvents();
  this.destroyEditor();
  
  
  console.log( 'WebForm -> init' );

  this.element = document.createElement('div');
  core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
  core.events.publish("core:web-forms:editor:template");
  core.events.publish("core:web-form:load", this._id );
};
WebForm.prototype.load = function(){

  console.log( 'WebForm -> bindEvents' );
};
WebForm.prototype.detachEvents = function(){
  core.events.remove("core:template:web-forms:editor");
  core.events.remove("core:web-form:loaded");
};
WebForm.prototype.attachEvents = function(){
  var webForm = this;
  
  core.events.subscribe("core:template:web-forms:editor", function(template){
    webForm.update( template.raw );
  });
  
  core.events.subscribe("core:web-form:loaded", function(data){
    webForm.loadEditor( data.raw.body );
  });
};



var WebForms = function WebForms(){
  this.forms     = {};
  this.leftPanel = {};
  this.content   = {};
  this.infoPanel = {};
  this.bindEvents();
};

WebForms.prototype.WebForm  = WebForm;
WebForms.prototype.Elements = require('./elements');

WebForms.prototype.init = function(){
};
WebForms.prototype.bindEvents = function(){
  var webForms = this;
  document.addEventListener('DOMContentLoaded', function(){ 
    
    core.events.subscribe("core:web-forms:render", function( data ){
      webForms.render();
    });

    core.events.subscribe("core:web-forms:drag:export:result", function( result ){
      console.log( 'core:web-forms:drag:export:result', result );
    });

    core.events.subscribe("core:web-forms:infoPanel:show", function( config ){
      console.log( 'core:web-forms:infoPanel:show', config );
      webForms.renderInfoPanel(config);
    });

  });
};

WebForms.prototype.import = function( data ){
  var data = '[{"element":"<div style=\\"top: 80px; left: 450px; position: absolute;\\" class=\\"\\">label<input name=\\"test-input\\" type=\\"text\\" placeholder=\\"texttium\\" style=\\"margin: 0px 10px;\\"></div>","options":{"drag":{"activeClass":"active-border","snapX":10,"snapY":10,"axisX":true,"axisY":true,"restrict":"document"},"id":"","title":""}},{"element":"<div style=\\"top: 180px; left: 410px; position: absolute;\\" class=\\"drag-active\\">label<input name=\\"test-input\\" type=\\"text\\" placeholder=\\"texttium\\" style=\\"margin: 0px 10px;\\"><div class=\\"drag-config-button\\" style=\\"top: 164px; left: 330.828px; height: 21px; width: 222.594px;\\"></div></div>","options":{"drag":{"activeClass":"active-border","snapX":10,"snapY":10,"axisX":true,"axisY":true,"restrict":"document"},"id":"","title":""}}]';

  var elements = [];
  
  try {
    elements = JSON.parse( data );
  } catch( error ){
    throw new Error( error );
  }

  if ( elements.length ) {
    var df = document.createDocumentFragment();

    for(var k = 0, length = elements.length; k < length; k++){
      
      var element = document.createElement('div');
      element.innerHTML = elements[k].element;

      // core.modules.drag.clonedElementAttachEvents( element );
      core.modules.drag.add( element, elements[k].options.drag );
      // core.modules.drag.add( element, { snapX: 10,  snapY: 10, activeClass: "active-border" } );

      df.appendChild( element );

    }

  core.dom.content.appendChild( df );

  };
};
WebForms.prototype.add = function( type, config ) {

  if ( !this.documents.hasOwnProperty(type) ) {
    this.documents[type] = [];
  }

  this.documents[type].push( new this.WebForm(config) );
};
WebForms.prototype.show = function(id) {
  console.log( 'WebForms: show -> ', id);
  var webForm = this.find(id);
  if ( webForm ) {
    webForm.init();
  } else {
    throw new Error('template not found!');
  }
};
WebForms.prototype.clear = function(config) {
  this.forms = {};
};

WebForms.prototype.renderLeftPanel = function() {
  this.leftPanel = document.createElement('div');
  this.leftPanel.id = 'web-forms-left';

  var df = document.createDocumentFragment();
  var input = this.Elements.create( {
    elementType : 'input',
    name : 'test-input',
    type : 'text',
    placeholder : 'texttium',
    label: 'label'
  } );
  df.appendChild( input.element );

  var date = this.Elements.create( {
    elementType : 'input',
    type : 'date',
    name : 'test-input-date',
    placeholder : 'texttium',
  } );
  df.appendChild( date.element );

  var check = this.Elements.create( {
    elementType : 'input',
    name : 'test-checkbox',
    type : 'checkbox',
    label: 'checkbox'
  } );
  
  df.appendChild( check.element );
  
  this.leftPanel.appendChild( df );

  core.events.publish( "core:dom:leftPanel:set", this.leftPanel );
  core.events.publish( "core:dom:material:update" );
}
WebForms.prototype.renderContent = function() {
  this.content   = document.createElement('div');
  this.content.textContent  = 'this.content';
  this.content.style.height = '800px';
  this.content.id = 'web-forms-container';

  core.events.publish( "core:dom:content:set", this.content );
}
WebForms.prototype.renderInfoPanel = function( config ) {

  if ( config && Object === config.constructor) {
    core.events.publish( "core:dom:infoPanel:clear" );

    var list = this.Elements.create({
      elementType : 'list'
    });

    for ( var key in config ) {
      var item = this.Elements.create({
        elementType : 'listItem',
        action : 'action',
        // icon   : 'event',
        name   : config[key],
        count  : key
      });
      list.element.appendChild( item.element );
    }
    this.infoPanel = list.element;
    
    core.events.publish( "core:dom:infoPanel:set", this.infoPanel );
    core.events.publish( "core:dom:material:update" );
  };
}
WebForms.prototype.render = function(){

  core.events.publish( "core:dom:application:clear" );
  core.events.publish( "core:current:set", this );

  this.renderLeftPanel();
  this.renderContent();
  this.renderInfoPanel();
  
  core.events.publish( "core:drag:attachEvents" );
  core.events.publish( "core:dom:material:update" );
};


WebForms.prototype.start = function() {
  console.log( 'WebForms: start' );
  // this.init();
};
WebForms.prototype.stop = function() {
  console.log( 'WebForms: stop' );
};
WebForms.prototype.destroy = function() {
  console.log( 'WebForms: destroy' );
  this.element = [];
};

module.exports = WebForms;

