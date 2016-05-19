"use strict";

var WebForm = function(config){
  this.element     = {};
  this._id         = config._id         || '';
  this.name        = config.name        || '';
  this.description = config.description || '';
  this.authorId    = config.author_id;
  this.providerId  = config.provider_id;
  this.raw         = {};
  // this.detachEvents();
  // this.destroyEditor();
  // this.attachEvents();
};

WebForm.prototype.load = function( data ){
  console.log( 'WebForm -> bindEvents', data );
  this.raw = data;
};

WebForm.prototype.detachEvents = function(){
  // core.events.remove("core:template:web-forms:editor");
  // core.events.remove("core:web-form:loaded");
};


module.exports = WebForm