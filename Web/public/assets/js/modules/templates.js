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
    this.loaded    = 0;
    this.toLoad    = [ 'reports-index', 'core-progressbar', 'core-layout' ];

    this.bindEvents();
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
      console.log('***', data.name, Object.keys(templates.templates).length, templates.toLoad.length);
      
      templates.templates[data.name].raw = data.raw;
       
      var dataNameParse = data.name.split('-');

      var moduleRoot = dataNameParse[0],
          moduleName = dataNameParse[1];

      console.log('templates -> bindEvents > core::template:loaded : ', moduleRoot + "::" + moduleName + ":template:ready");
      
      core.events.publish( moduleRoot + "::" + moduleName + ":template:ready", templates.templates[data.name] );
      templates.loaded++;

      if ( templates.loaded === templates.toLoad.length ) {
        core.events.publish("core::preloader:ready");
      }
       // templates.tempates[ data.name ].raw = data.data;
    });

    core.events.publish("");

    core.events.subscribe("core::progressbar:template", function(){
      core.events.publish("core::template:progressbar", templates.templates['core-progressbar']);
    });

    core.events.subscribe("core::reports:template", function(){
      core.events.publish("core::template:reports", templates.templates['reports-index']);
    });

    core.events.subscribe("core::template:start", function(){
      console.log('core::template:start');
      templates.start();
    });

    core.events.subscribe("core::start:all", function(){
      console.log('core::start:templates');
      templates.start();
    });
  };
  

  Templates.prototype.start = function() {
    this.init();
  };

  Templates.prototype.stop = function() {
    // console.log( 'Templates: stop' );
  };

  Templates.prototype.destroy = function() {
    // console.log( 'Templates: destroy' );
  };

  var templates = new Templates();

  return templates;
}());