"use strict";

var WebForm = function(config){
  this.element     = {};
  this._id         = config._id         || '';
  this.name        = config.name        || '';
  this.description = config.description || '';
  this.authorId    = config.author_id;
  this.providerId  = config.provider_id;
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

var WebForms = function WebForms(){
  this.forms     = [];
  this.leftPanel = {};
  this.content   = {};
  this.infoPanel = {};
  
  this.active    = {};
  
  this.bindEvents();
};

WebForms.prototype.WebForm = WebForm;

WebForms.prototype.init = function(){
};
WebForms.prototype.import = function( data ){
  var data = '[{"element":"<div style=\\"top: 80px; left: 450px; position: absolute;\\" class=\\"\\">label<input name=\\"test-input\\" type=\\"text\\" placeholder=\\"texttium\\" style=\\"margin: 0px 10px;\\"></div>","options":{"drag":{"activeClass":"active-border","snapX":10,"snapY":10,"axisX":true,"axisY":true,"restrict":"document"},"id":"","title":""}},{"element":"<div style=\\"top: 180px; left: 410px; position: absolute;\\" class=\\"drag-active\\">label<input name=\\"test-input\\" type=\\"text\\" placeholder=\\"texttium\\" style=\\"margin: 0px 10px;\\"><div class=\\"drag-config-button\\" style=\\"top: 164px; left: 330.828px; height: 21px; width: 222.594px;\\"></div></div>","options":{"drag":{"activeClass":"active-border","snapX":10,"snapY":10,"axisX":true,"axisY":true,"restrict":"document"},"id":"","title":""}}]';

  var elements = [];
  
  try {
    elements = JSON.parse( data );
  } catch( error ){
    throw new Error( error );
  }

  if ( elements.length ) {
    var df = document.createDocumentFragment();

    for(var k = 0, length = elements.length; k < length; k++){
      
      var element = document.createElement('div');
      element.innerHTML = elements[k].element;

      // core.modules.drag.clonedElementAttachEvents( element );
      core.modules.drag.add( element, elements[k].options.drag );
      // core.modules.drag.add( element, { snapX: 10,  snapY: 10, activeClass: "active-border" } );

      df.appendChild( element );

    }

  core.dom.content.appendChild( df );

  };
};
WebForms.prototype.add = function( config ) {
  this.forms.push( new this.WebForm(config) );
};
WebForms.prototype.show = function(id) {
  console.log( 'WebForms: show -> ', id);
  var webForm = this.find(id);
  if ( webForm ) {
    webForm.init();
  } else {
    throw new Error('template not found!');
  }
};
WebForms.prototype.clear = function(config) {
  this.forms = {};
};

WebForms.prototype.renderLeftPanel = function() {


  this.leftPanel = core.elements.create({
    elementType : 'simple',
    class : 'webforms-leftPanel',
    items : [
      core.elements.create({
      elementType : 'list',
      items: [
        {
          title : core.elements.create({
            elementType : 'button',
            text        : 'Создать',
            raised: true,
            color: true,
          }),
        },
        {
          title : 'menu item',
          icon  : 'event'
        },
        {
          title : 'menu item',
          icon  : 'event',
          subTitle : 'menu item',
        },
        {
          title : 'menu item',
          subTitle : 'menu item',
          icon  : 'event',
          action : {
            href : '#',
            icon : 'star',
            title : 'tesst'
          },
        },
        {
          title : 'menu item',
          subTitle : 'menu item',
          icon  : 'event',
          action : {
            element: core.elements.create({
              elementType : 'button',
              preventCopy : true,
              name        : 'test-check',
              fab         : true,
              icon        : 'star'
            })
          },
        },
      ]
    })
    ]
  });

  core.events.publish( "core:dom:leftPanel:clear" );
  core.events.publish( "core:dom:leftPanel:set", this.leftPanel );
  core.events.publish( "core:dom:material:update" );
}
WebForms.prototype.renderContent = function() {
  this.content = {};

  if ( this.forms.length ) {

    var df = document.createDocumentFragment();

    for (var i = this.forms.length - 1; i >= 0; i--) {
      var data = this.forms[i];

      var form = core.elements.create({
        elementType : 'card',
        class: [ 'mdl-cell', 'mdl-cell--3-col'],
        shadow : 8,
        // height : 200,
        // width  : 300,
        media: 'assets/img/doc.png',
        title : data.name,
        // title : '',
        // subTitle: data.name,
        description: data.description,
        menu: [
          core.elements.create( {
            elementType : 'menu',
            position    : 'right',
            icon: 'more_vert',
            // color: true,
            items: [
              {
                text: 'hide',
                callback : {
                  context: this,
                  function : function(e){
                    e.preventDefault();
                    core.events.publish('core:dom:infoPanel:hide');
                  }
                }
              },
              {
                text: 'show',
                callback : {
                  context: this,
                  function : function(e){
                    e.preventDefault();
                    core.events.publish('core:dom:infoPanel:show');
                  }
                }
              }
            ]
          })
        ]
      });

      df.appendChild( form.element );
    }
    this.content = core.elements.create({
      elementType : 'simple',
      class : ['mdl-grid']
    });

    this.content.element.appendChild( df );
    core.events.publish('core:dom:material:update');
  } else {
    // empty forms
    this.content = core.elements.create({
      elementType: 'simple',
      class : [ "mdl-cell", "mdl-cell--12-col-phone", "mdl-cell--6-col-desktop", "mdl-cell--3-offset-desktop", "mdl-progress", "mdl-js-progress" ]
    });
  }

  core.events.publish( "core:dom:content:clear" );
  core.events.publish( "core:dom:content:set", this.content );
}
WebForms.prototype.renderInfoPanel = function( element ) {
  this.infoPanel = core.elements.create({
    elementType : 'simple',
    preventCopy : true,
    name        : 'test-check',
    fab         : true,
    icon        : 'star'
  });

  core.events.publish( "core:dom:infoPanel:clear" );
  core.events.publish( "core:dom:infoPanel:set", this.infoPanel );
}

WebForms.prototype.render = function(){

  core.events.publish( "core:dom:application:clear" );
  core.events.publish( "core:current:set", this );

  this.renderLeftPanel();
  this.renderContent();
  this.renderInfoPanel();
  
  // core.events.publish( "core:drag:attachEvents" );
  core.events.publish( "core:dom:material:update" );
};

WebForms.prototype.preview = function() {
  var params = "menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,height=500,width=500,left=100,top=100"
  var _window = window.open( '#preview/123' , "Preview", params );
  console.log( _window.document.body.innerHTML );
};
WebForms.prototype.showElementInfo = function( element ) {
  if ( element ) {
    
    this.active = element;

    var config  = element._config;
    console.log( 'renderInfoPanel render ->', element );

    if ( config && Object === config.constructor) {
      core.events.publish( "core:dom:infoPanel:clear" );

      var form = document.createElement('div');

      for ( var key in config ) {
        var item = core.elements.create({
          elementType : 'input',
          name   : config[key],
          value  : key + '__' +  config[key],
        });
        form.appendChild( item.element );
      }
      this.infoPanel = form;
      
      core.events.publish( "core:dom:infoPanel:set", this.infoPanel );
      core.events.publish( "core:dom:material:update" );
    };
  }
}

WebForms.prototype.start = function() {
  console.log( 'WebForms: start' );
  // this.init();
};
WebForms.prototype.stop = function() {
  console.log( 'WebForms: stop' );
};
WebForms.prototype.destroy = function() {
  console.log( 'WebForms: destroy' );
  this.element = [];
};

WebForms.prototype.bindEvents = function(){
  var webForms = this;
  document.addEventListener('DOMContentLoaded', function(){ 
    
    core.events.subscribe("core:web-forms:render", function( data ){
      webForms.render();
    });

    core.events.subscribe("core:web-forms:drag:export:result", function( result ){
      console.log( 'core:web-forms:drag:export:result', result );
    });

    core.events.subscribe("core:web-forms:infoPanel:show", function( config ){
      console.log( 'core:web-forms:infoPanel:show', config );
      webForms.renderInfoPanel(config);
    });

    core.events.subscribe("core:web-forms:loaded", function( data ){
      var forms = [];
      
      try{
        forms = JSON.parse( data );
      } catch (e){
        throw new Error( 'Error while web-forms loading', e );
      }

      if ( forms.length ) {
        for (var i = forms.length - 1; i >= 0; i--) {
          webForms.add( forms[i] );
        }

        // webForms.renderContent();
      }
    });
  });
};

module.exports = WebForms;

