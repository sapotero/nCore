"use strict";

var WebForm = function(config){
  this.element     = {};
  this.raw         = {};
  this.body        = '';
  this._id         = config._id         || '';
  this.name        = config.name        || '';
  this.description = config.description || '';
  this.authorId    = config.author_id   || '';
  this.providerId  = config.provider_id || '';

};

WebForm.prototype.load = function( data ){
  console.log( 'WebForm -> load', data );
  this.raw = data;

  this.detachEvents();
  this.attachEvents();
  this.initEditor();
};


WebForm.prototype.reload = function(){
  this.detachEvents();
  this.attachEvents();
  core.events.emit('core:web-form:show', this );
};

WebForm.prototype.initEditor = function(){
  if ( this.hasOwnProperty('raw') && this.raw.hasOwnProperty('body') ) {
    this.body = core.utils.Base64.decode( this.raw.body );
  }
  // console.log( 'web-form -> initEditor : ', this );
  core.events.emit( "core:current:set", this );
  core.events.emit('core:web-form:show', this );
}

WebForm.prototype.detachEvents = function(){
  console.log('WebForm -> detachEvents');
  // core.events.remove("core:template:web-forms:editor");
  // core.events.remove("core:web-form:loaded");
};
WebForm.prototype.attachEvents = function(){
  console.log('WebForm -> attachEvents');
  // core.events.remove("core:template:web-forms:editor");
  // core.events.remove("core:web-form:loaded");
};


module.exports = WebForm