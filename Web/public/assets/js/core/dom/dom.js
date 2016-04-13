'use strict';

var Dom = function(){
  this.root        = document;
  this.application = {};
  this.snackbar    = {};

  this.bindEvents();
};

Dom.prototype.bindEvents = function() {
  var dom = this;
  require('./events');
};
Dom.prototype.build = function(template) {
  console.log( 'Dom: build root', template );
  
  var element = document.createElement('div');
  element.id = template.name;
  element.innerHTML = template.raw;

  this.application = element;
  this.root.body.appendChild(element);

  core.events.publish("core::start:progressbar");
};
Dom.prototype.start = function() {
  console.log( 'Dom: start' );
};
Dom.prototype.stop = function() {
  console.log( 'Dom: stop' );
};
Dom.prototype.destroy = function() {
  console.log( 'Dom: destroy' );
};

module.exports = Dom;
