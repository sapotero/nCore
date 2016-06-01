"use strict";

var WebForm = function(config){
  this.element     = document.createElement('div');
  this.raw         = {};
  this.body        = '';
  this._body       = [];
  this._id         = config._id         || '';
  this.name        = config.name        || '';
  this.action      = config.action      || '';
  this.description = config.description || '';
  this.authorId    = config.author_id   || core.global.user.id;
  this.providerId  = config.provider_id || core.global.provider.id;
  this.new         = config.new         || false;
};

WebForm.prototype.getBody = function(){
  core.events.emit("core:drag:export");
}
WebForm.prototype.setBody = function( body ){
  console.log( 'WebForm.prototype.setBody ->', body );
  this.body = body;
}

WebForm.prototype.config = function(){
  this.getBody();

  var config = {
    name        : this.name,
    action      : this.action,
    description : this.description,
    authorId    : core.global.user.id,
    providerId  : core.global.provider.id,
    body        : this.body,
  }

  this._id ? ( config._id = this._id ) : false ;

  return config;
}

WebForm.prototype.load = function( data ){
  console.log( 'WebForm -> load', data );
  this.raw = data;

  this.detachEvents();
  this.attachEvents();
  this.initEditor();
};

WebForm.prototype.save = function(){
  core.utils.put( core.config.webforms.update + this._id + '.json' , this.config(), function( data ){
    console.log( 'data' );
  });
}
WebForm.prototype.create = function(){
  var config = this.config();

  core.utils.post( core.config.webforms.index, config, function( data ){
    console.log( 'data++++', config );
    console.log( 'data', data );
  });
}

WebForm.prototype.update = function( elements ){
  console.log( 'WebForm.prototype.update', elements );

  for (var i = 0; i < elements.length; i++) {
    var input = elements[i];
    core.events.emit( "core:web-form:set:" + input.name, input.value );
    console.log( "core:web-form:set:" + input.name, input.value );
  }

  this.new ? this.create() : this.save();
};

WebForm.prototype.reload = function(){
  this.detachEvents();
  this.attachEvents();
  core.events.emit('core:web-form:show', this );
};

WebForm.prototype.initEditor = function(){
  if ( this.hasOwnProperty('raw') && this.raw.hasOwnProperty('body') ) {
    
    try {
      this.body = JSON.parse( this.raw.body );
      var _render = [];

      if ( this.body.length ) {

        for ( var i = 0, length = this.body.length; i < length; i++ ) {
          
          var item = this.body[i];
          
          console.log( 'elements', item );
          core.events.emit( "core:drag:create:element", item.element, item.options );

          // var _element = core.elements.create( item.element );
          // _element._options = item.options;
          
          // console.info( '_element', _element, item );
          // _element.element.style.position = 'absolute';
          // _element.element.style.top = item.options.top + 'px';
          // _element.element.style.left = item.options.left + 'px';
          // _render.push( _element );
        }
      
        this.body = _render;
      };
    } catch (e) {
      // throw new Error(e);
      console.log( e );
    }

  }
  // console.log( 'web-form -> initEditor : ', this );
  core.events.emit( "core:current:set", this );
  core.events.emit('core:web-form:content:show', this );
}

WebForm.prototype.detachEvents = function(){
  console.log('WebForm -> detachEvents');
  // core.events.remove("core:template:web-forms:editor");
  core.events.remove("core:web-form:set:name");
  core.events.remove("core:web-form:set:action");
  core.events.remove("core:web-form:set:description");
  core.events.remove("core:web-form:set:body");
  core.events.remove("core:web-form:add:body");
  core.events.remove("core:web-form:export:result");

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

    core.events.on("core:web-form:export:result", function( body ){
      console.log( 'WebForm <- core:web-form:export:result', body );
      form.setBody(body);
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

    core.events.on('core:web-form:add:body', function ( _root ) {
      console.log('**** core:web-form:add:body', _root)
      form._body.push( {element: _root} );

      // core.events.emit( "core:web-form:content:add", _root );
      
    });
  // });
};


module.exports = WebForm