'use strict';

core.modules.template = (function() {
  var Template = function(config){
    this.name = config.name || '';
    this.path = config.path || '';
    this.raw  = config.raw  || '';
    return this;
  };
  Template.prototype.load = function() {
    core.events.publish( "core::template:load", this.name );
    return this;
  };

  var Templates = function(){
    this.templates = {};
    this.ready     = false;
    this.toLoad    = ['core-loading'];
  };
  Templates.prototype.Template = Template;
  
  Templates.prototype.add = function(name) {
    this.templates[ name ] = new this.Template({ name: name }).load();
  };

  Templates.prototype.init = function() {

    for (var i = this.toLoad.length - 1; i >= 0; i--) {
      this.add( this.toLoad[i] );
    };

    core.events.publish( "core::templates:load", this.templates );
  };

  Templates.prototype.bindEvents = function() {
    var templates = this;

    core.events.subscribe("core::templates:load::success", function ( tmp ){
      console.log( 'Load::',tmp );
    });
    
    core.events.subscribe("core::templates:load::fails",   function ( e ){
      throw new Error(e);
    });

    core.events.subscribe("core::template:loaded", function (data) {
       templates.templates[data.name].raw = data.raw;
       
       console.log('***', Object.keys(templates.templates).length, templates.toLoad.length, Object.keys(templates.templates).length == templates.toLoad.length );
       if ( Object.keys(templates.templates).length == templates.toLoad.length ) {
         core.events.publish( "core::progressbar:template:ready", templates.templates[data.name] );
         this.loaded = true;
       }
       // templates.tempates[ data.name ].raw = data.data;
    });
  };
  

  Templates.prototype.start = function() {
    this.init();
    this.bindEvents();
  };

  Templates.prototype.stop = function() {
    // console.log( 'Templates: stop' );
  };

  Templates.prototype.destroy = function() {
    // console.log( 'Templates: destroy' );
  };

  var templates = new Templates();

  core.events.subscribe("core::start:all", function(){
    console.log('core::start:templates');
    templates.start();
  });

  return templates;
}());