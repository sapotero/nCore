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
WebForm.prototype.update = function(html){
  console.log( 'WebForm -> update' );
  this.element.innerHTML = html;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
  this.render();
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


var WebForms = function(){
  this.element   = {};
  this.documents = {};
  this.bindEvents();
};
WebForms.prototype.WebForm = WebForm;
WebForms.prototype.init = function(){
  core.events.publish( "[ + ] core:web-forms:init" );
  // core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
};
WebForms.prototype.bindEvents = function(){
  var webForms = this;
  document.addEventListener('DOMContentLoaded', function(){ 
    core.events.subscribe("core:web-forms:render", function(data){
      webForms.render();
    });
  });
};
WebForms.prototype.updateRootElement = function(html){
  this.element.innerHTML = html;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
  this.render();
};

WebForms.prototype.render = function(){
  core.events.publish( "core:dom:application:clear" );
};

WebForms.prototype.add = function( type, config ) {

  if ( !this.documents.hasOwnProperty(type) ) {
    this.documents[type] = [];
  }

  this.documents[type].push( new this.WebForm(config) );
};
WebForms.prototype.clear = function(config) {
  this.documents = {};
};
WebForms.prototype.find = function(id) {
  for (var type in this.documents) {
    for (var i = this.documents[type].length - 1; i >= 0; i--) {
      if( this.documents[type][i]._id === id ){
        return this.documents[type][i];
      }
    }
  }
};

WebForms.prototype.show = function(id) {
  console.log( 'WebForms: show -> ', id);
  var webForm = this.find(id);
  if ( web-form ) {
    webForm.init();
  } else {
    throw new Error('template not found!');
  }
};

WebForms.prototype.start = function() {
  console.log( 'WebForms: start' );
  this.init();
};
WebForms.prototype.stop = function() {
  console.log( 'WebForms: stop' );
};
WebForms.prototype.destroy = function() {
  console.log( 'WebForms: destroy' );
  this.element = [];
};

module.exports = WebForms;