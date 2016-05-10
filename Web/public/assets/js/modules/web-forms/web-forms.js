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
  this.forms     = {};
  this.leftPanel = {};
  this.content   = {};
  this.infoPanel = {};
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

var links = document.querySelectorAll('a');
for(var i = 0, length1 = links.length; i < length1; i++){
  links[i].addEventListener( 'click', function (e) {
    e.preventDefault();
    console.log( this );
  });
}


WebForms.prototype.renderLeftPanel = function() {
  this.leftPanel = document.createElement('div');
  // this.leftPanel.textContent = 'this.leftPanel';
  this.leftPanel.innerHTML = `<div class="demo-list-action mdl-list">
    <div class="drag mdl-list__item">
      <span class="mdl-list__item-primary-content">
        <i class="material-icons mdl-list__item-avatar">person</i>
        <span>Bryan Cranston</span>
      </span>
      <a class="mdl-list__item-secondary-action" href="#"><i class="material-icons">star</i></a>
    </div>
    <div class="drag mdl-list__item">
      <span class="mdl-list__item-primary-content">
        <i class="material-icons mdl-list__item-avatar">person</i>
        <span>Aaron Paul</span>
      </span>
      <a class="mdl-list__item-secondary-action" href="#"><i class="material-icons">star</i></a>
    </div>
    <div class="drag mdl-list__item">
      <span class="mdl-list__item-primary-content">
        <i class="material-icons mdl-list__item-avatar">person</i>
        <span>Bob Odenkirk</span>
      </span>
      <span class="mdl-list__item-secondary-content">
        <a class="mdl-list__item-secondary-action" href="#"><i class="material-icons">star</i></a>
    </span>
    </div>
  </div>`;
  this.leftPanel.style.height = '800px';
  core.dom.leftPanel.appendChild( this.leftPanel );
}
WebForms.prototype.renderContent = function() {
  this.content   = document.createElement('div');
  this.content.textContent  = 'this.content';
  this.content.style.height = '800px';

  var dnds = document.querySelectorAll('.drag');
  
  for(var i = 0, length1 = dnds.length; i < length1; i++){
    core.modules.draggy.add( dnds[i], { snapX: 10,  snapY: 10, activeClass: "active-border" } );
  }

  core.dom.content.appendChild( this.content );
}
WebForms.prototype.renderInfoPanel = function() {
  this.infoPanel = document.createElement('div');
  this.infoPanel.textContent = 'this.infoPanel';
  core.dom.infoPanel.appendChild( this.infoPanel );
}

WebForms.prototype.render = function(){
  core.events.publish( "core:dom:application:clear" );

  this.renderLeftPanel();
  this.renderContent();
  this.renderInfoPanel();

  componentHandler.upgradeAllRegistered();
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