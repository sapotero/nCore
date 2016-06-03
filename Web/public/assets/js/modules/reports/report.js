"use strict";

var Report = function(config){
  this.element     = document.createElement('div');
  this.raw         = {};
  this.body        = '';
  this._body       = [];
  this._id         = config._id         || '';
  this.name        = config.name        || '';
  this.image       = config.image       || '';
  this.action      = config.action      || '';
  this.description = config.description || '';
  this.authorId    = config.author_id   || core.global.user.id;
  this.providerId  = config.provider_id || core.global.provider.id;
  this.new         = config.new         || false;
};

Report.prototype.getBody = function(){
  core.events.emit("core:drag:export");
}
Report.prototype.setBody = function( body ){
  // console.log( 'Report.prototype.setBody ->', body );
  this.body = body;
}
Report.prototype.saveImage = function(){
  console.log( 'Report.prototype.saveImage ->' );
  var scope = this;
  domtoimage.toPng( core.dom.content.element, { height: 600, width: 600 } ).then(function ( image ) {
    
    scope.image = image;
    core.utils.put( core.config.reports.update + scope._id + '.json' , { image : image }, function(){} );
    
  }).catch(function (error) {
    console.error('oops, something went wrong!', error);
  });
}


Report.prototype.config = function(){
  this.getBody();
  this.saveImage();

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

Report.prototype.load = function( data ){
  console.log( 'Report -> load', data );
  this.raw = data;

  this.detachEvents();
  this.attachEvents();
  this.initEditor();
};

Report.prototype.save = function(){
  core.utils.put( core.config.reports.update + this._id + '.json' , this.config(), function( data ){
    console.log( 'data' );
  });
}
Report.prototype.create = function(){
  var config = this.config();
  var scope  = this;

  core.utils.post( core.config.reports.index, config, function( data ){
    // console.log( 'data++++', config );
    console.log( 'data', data );

    try{
      var formData = JSON.parse( data );
      scope._id = formData._id;
      location.hash = location.hash.replace( /new/g, formData._id )
    } catch(e) {
      throw new Error( e )
    }
  });
}

Report.prototype.update = function( elements ){
  console.log( 'Report.prototype.update', elements );

  for (var i = 0; i < elements.length; i++) {
    var input = elements[i];
    core.events.emit( "core:report:set:" + input.name, input.value );
    console.log( "core:report:set:" + input.name, input.value );
  }

  this.new ? this.create() : this.save();
};

Report.prototype.reload = function(){
  this.detachEvents();
  this.attachEvents();
  core.events.emit('core:report:show', this );
};

Report.prototype.initEditor = function(){
  this._body = [];

  if ( this.hasOwnProperty('raw') && this.raw.hasOwnProperty('body') ) {
    
    try {
      this.body = JSON.parse( this.raw.body );
      var _render = [];

      if ( this.body.length ) {

        for ( var i = 0, length = this.body.length; i < length; i++ ) {
          var item = this.body[i];
          core.events.emit( "core:drag:create:element", item.element, item.options );
        }
      
        this.body = _render;
      };
    } catch (e) {
      // throw new Error(e);
      this.body = [];
      console.log( e );
    }

  }
  this.bindEditorHotkeys();
}

Report.prototype.bindEditorHotkeys = function(){

  core.events.emit( "core:current:set", this );
  core.events.emit('core:report:content:show', this );

  core.events.emit("core:shortcut:clear");
  core.events.emit( "core:shortcut:add", {
    shortcut: 'shift+s',
    callback: function(){
      core.events.emit('core:report:save');
    }
  });
  core.events.emit( "core:shortcut:add", {
    shortcut: 'shift+n',
    callback: function(){
      core.events.emit('core:reports:new:hash');
    }
  });
  core.events.emit( "core:shortcut:add", {
    shortcut: 'shift+d',
    callback: function(){
      core.events.emit('core:snackbar:show', {message: 'test', timeout: 500})
    }
  });
};

Report.prototype.detachEvents = function(){
  console.log('Report -> detachEvents');
  core.events.remove("core:report:export:result");
  core.events.remove("core:report:add:body");
  core.events.remove("core:report:save");
  core.events.remove("core:report:set:name");
  core.events.remove("core:report:set:body");
  core.events.remove("core:report:set:action");
  core.events.remove("core:report:set:description");

};
Report.prototype.attachEvents = function(){
  console.log('Report -> attachEvents');
  
  var form = this;
  
  // document.addEventListener('DOMContentLoaded', function(){
    core.events.on("core:report:set:name", function( name ){
      console.log( 'Report <- core:report:set:name',  name);
      form.name = name;
      
      form.title = core.elements.create({
        elementType : 'simple',
        type  : 'h5',
        class : [ 'subTitleMenu--item', 'mdl-color-text--grey-800' ],
        text  : name,
      });
      core.events.emit( "core:dom:set:title", form.title );
    });

    core.events.on("core:report:export:result", function( body ){
      // console.log( 'Report <- core:report:export:result', body );
      form.setBody(body);
    });

    core.events.on("core:report:set:action", function( action ){
      console.log( 'Report <- core:report:set:action', action );
      form.action = action;
    });

    core.events.on("core:report:save", function( action ){
      console.log( 'Report <- core:report:save', action );
      form.save();
    });

    core.events.on("core:report:set:description", function( description ){
      console.log( 'Report <- core:report:set:description', description );
      form.description = description;
    });
    core.events.on("core:report:set:body", function( body ){
      console.log( 'Report <- core:report:set:body',  body);
      form.body = body;
    });

    core.events.on('core:report:add:body', function ( _root ) {
      console.log('**** core:report:add:body', _root)
      form._body.push( {element: _root} );

      // core.events.emit( "core:report:content:add", _root );
      
    });
  // });
};


module.exports = Report