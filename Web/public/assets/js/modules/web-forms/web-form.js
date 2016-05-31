"use strict";

var WebForm = function(config){
  this.element     = {};
  this.raw         = {};
  this.body        = '';
  this._id         = config._id         || '';
  this.name        = config.name        || '';
  this.action      = config.action      || '';
  this.description = config.description || '';
  this.authorId    = config.author_id   || core.global.user.id;
  this.providerId  = config.provider_id || core.global.provider.id;
};

WebForm.prototype.load = function( data ){
  console.log( 'WebForm -> load', data );
  this.raw = data;

  this.detachEvents();
  this.attachEvents();
  this.initEditor();
};

WebForm.prototype.update = function( elements ){
  console.log( 'WebForm.prototype.update', elements );

  for (var i = 0; i < elements.length; i++) {
    var input = elements[i];
    core.events.emit( "core:web-form:set:" + input.name, input.value );
    console.log( "core:web-form:set:" + input.name, input.value );
  }
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
  core.events.remove("core:web-form:set:name");
  core.events.remove("core:web-form:set:action");
  core.events.remove("core:web-form:set:description");
  core.events.remove("core:web-form:set:body");
};
WebForm.prototype.attachEvents = function(){
  console.log('WebForm -> attachEvents');
  
  var form = this;
  
  // document.addEventListener('DOMContentLoaded', function(){
    core.events.on("core:web-form:set:name", function( name ){
      console.log( 'WebForm <- core:web-form:set:name',  name);
      form.name = name;
      
      form.title = core.elements.create({
        elementType : 'simple',
        type  : 'h5',
        class : [ 'subTitleMenu--item', 'mdl-color-text--grey-800' ],
        text  : name,
      });
      core.events.emit( "core:dom:set:title", form.title );

    });
    core.events.on("core:web-form:set:action", function( action ){
      console.log( 'WebForm <- core:web-form:set:action', action );
      form.action = action;
    });
    core.events.on("core:web-form:set:description", function( description ){
      console.log( 'WebForm <- core:web-form:set:description', description );
      form.description = description;
    });
    core.events.on("core:web-form:set:body", function( body ){
      console.log( 'WebForm <- core:web-form:set:body',  body);
      form.body = body;
    });
  // });
};


module.exports = WebForm