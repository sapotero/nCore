"use strict";

var WebForms = function WebForms(){
  this.forms     = [];
  this.leftPanel = {};
  this.content   = {};
  this.infoPanel = {};
  this.route     = 'web-forms';
  this.title     = 'Экранные формы';
  
  this.active    = {};
  
  this.bindEvents();
};

WebForms.prototype.WebForm = require('./web-form');

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
WebForms.prototype.find = function( id ) {
  var form = {};

  for (var i = 0; i < this.forms.length; i++) {
    if ( this.forms[i]._id === id ) {
      form = this.forms[i];
    }
  }
  return form;
};
WebForms.prototype.show = function( form ) {
  var webForm = this.find( form._id );
  // console.log( 'WebForms: show -> ', form, webForm );

  if ( webForm ) {
    webForm.load(form);
    this.active = webForm;
  } else {
    throw new Error('web-form not found!');
  }
};
WebForms.prototype.clear = function(config) {
  this.forms = {};
};

WebForms.prototype.renderLeftPanel = function() {


  this.leftPanel = core.elements.create({
    elementType : 'simple',
    class : ['webforms-leftPanel'],
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
          title    : 'Шаблоны',
          subTitle : '0 форм',
          icon     : 'event',
          action   : {
            icon     : 'add',
            color    : true,
            callback : {
              context  : this,
              function : function(e){
                e.preventDefault();
                console.log( 'webforms-leftMenu > template icon click' );
              },
            }
          },
          // callback : {
          //   context  : this,
          //   function : function(e){
          //     e.preventDefault();
          //     console.log( 'webforms-leftMenu > template click' );
          //   },
          // }
        },
        {
          title    : 'Общие формы',
          subTitle : '0 форм',
          icon     : 'event',
          action   : {
            icon     : 'add',
            color    : true,
          },
          callback : {
            context  : this,
            function : function(e){
              e.preventDefault();
              console.log( 'webforms-leftMenu > shared click' );
            },
          }
        },
        {
          title    : 'Мои формы',
          subTitle : '0 форм',
          icon     : 'event',
          action   : {
            icon     : 'add',
            color    : true,
          },
          callback : {
            context  : this,
            function : function(e){
              e.preventDefault();
              console.log( 'webforms-leftMenu > my click' );
            },
          }
        },
      ]
    })
    ]
  });

  core.events.emit( "core:dom:leftPanel:clear" );
  core.events.emit( "core:dom:leftPanel:set", this.leftPanel );
  core.events.emit( "core:dom:material:update" );
}
WebForms.prototype.renderContent = function() {
  this.content = {};

  if ( this.forms.length ) {

    var df = document.createDocumentFragment();
    // this.menu = core.elements.create({
    //   elementType: 'simple',
    //   class : ["mdl-cell", "mdl-cell--12-col", "page-content-panel-animation", "menu-content"],
    //   text: 'menu-panel'
    // });

    for (var i = this.forms.length - 1; i >= 0; i--) {
      var data = this.forms[i];

      var form = core.elements.create({
        elementType : 'card',
        class: [ 'mdl-cell', 'mdl-cell--3-col', 'mdl-cell--12-col-phone', 'mdl-cell--4-col-tablet'],
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
                    core.events.emit('core:dom:infoPanel:hide');
                  }
                }
              },
              {
                text: 'show',
                callback : {
                  context: this,
                  function : function(e){
                    core.events.emit('core:dom:infoPanel:show');
                  }
                }
              }
            ]
          })
        ],
        _data : data,
        callback : {
          // context  : this,
          function : function(e){
            // console.log('event handler', this._config._data._id);
            core.events.emit("core:router:web-forms:show", this._config._data._id);
          }
        }
      });

      df.appendChild( form.element );
    }
    this.content = core.elements.create({
      elementType : 'simple',
      class : ['mdl-grid']
    });
    // this.content.element.appendChild( this.menu.element );
    this.content.element.appendChild( df );
    core.events.emit('core:dom:material:update');
  } else {
    // empty forms
    this.content = core.elements.create({
      elementType: 'simple',
      class : [ "mdl-cell", "mdl-cell--12-col-phone", "mdl-cell--6-col-desktop", "mdl-cell--3-offset-desktop", "mdl-progress", "mdl-js-progress" ],
      items: [
        this.menu
      ]
    });
  }

  core.events.emit( "core:dom:content:clear" );
  core.events.emit( "core:dom:content:set", this.content );
}
WebForms.prototype.renderInfoPanel = function( element ) {
  // var table = core.elements.create({
  //   elementType : 'table',
  //   selectable: true,
  //   class : [ 'webforms-infopanel-table' ],
  //   head  : [ 'id', 'name', 'test' ],
  //   body  : [
  //     [4 , 5, 5],
  //     [1 , 2, 2],
  //     [1 , 2, 2],
  //     [1 , 2, 2],
  //     [1 , 2, 2],
  //     [1 , 2, 2],
  //     [1 , 2, 2],
  //   ]
  // });

  // var button = core.elements.create({
  //   elementType : 'button',
  //   class       : [ 'menu-content-button' ],
  //   text        : 'Создать',
  //   color       : true,
  //   raised      : true
  // });

  // this.infoPanel = core.elements.create({
  //   elementType : 'simple',
  //   // text        : 'Создать',
  //   items : [
  //     button,
  //     table
  //   ]
  // });

  core.events.emit( "core:dom:infoPanel:clear" );
  // core.events.emit( "core:dom:infoPanel:set", this.infoPanel );
}

WebForms.prototype.render = function(){
  core.events.emit( "core:current:set", this );
  core.events.emit( "core:dom:application:clear" );

  this.renderLeftPanel();
  this.renderContent();
  this.renderInfoPanel();
  
  core.events.emit( "core:dom:infoPanel:hide" );
  core.events.emit( "core:dom:material:update" );
  core.events.emit( "core:dom:set:title", this.title );
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
      core.events.emit( "core:dom:infoPanel:clear" );

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
      
      core.events.emit( "core:dom:infoPanel:set", this.infoPanel );
      core.events.emit( "core:dom:material:update" );
    };
  }
}

WebForms.prototype.renderWrapper = function() {
  console.log( 'WebForms: renderWrapper' );
  core.events.emit( "core:dom:content:wrapper:show", this );
  // core.events.emit( "core:dom:content:wrapper:hide" );
  this.renderEditor();
};

WebForms.prototype.renderEditorLeftPanel = function() {
  console.log( 'WebForms: renderEditorLeftPanel' );
};
WebForms.prototype.renderEditorContent = function() {
  console.log( 'WebForms: renderEditorContent' );
};
WebForms.prototype.renderEditorInfoPanel = function() {
  console.log( 'WebForms: renderEditorInfoPanel' );
};

WebForms.prototype.renderEditor = function( form ) {
  core.events.emit( "core:dom:application:clear" );

  this.renderEditorLeftPanel();
  this.renderEditorContent();
  this.renderEditorInfoPanel();
  
  core.events.emit( "core:dom:infoPanel:hide" );
  core.events.emit( "core:dom:material:update" );

  core.events.emit( "core:dom:set:title", form.name );
};


WebForms.prototype.start = function() {
  console.log( 'WebForms: start' );
  this.bindEvents();
};
WebForms.prototype.stop = function() {
  console.log( 'WebForms: stop' );
  this.detachEvents();
};
WebForms.prototype.destroy = function() {
  console.log( 'WebForms: destroy' );
  this.element.remove();

  for( var key in this ){
    delete this[ key ];
  }

  this.detachEvents();
};
WebForms.prototype.detachEvents = function(){
  core.events.remove("core:web-forms:start");
  core.events.remove("core:web-forms:stop");
  core.events.remove("core:web-forms:destroy");
  core.events.remove("core:web-forms:render");
  core.events.remove("core:web-forms:drag:export:result");
  core.events.remove("core:web-forms:infoPanel:show");
  core.events.remove("core:web-forms:loaded");
  core.events.remove("core:web-form:show");
  core.events.remove("core:web-form:ready");
  core.events.remove("core:web-form:render");
  core.events.remove("core:web-form:new");
}

WebForms.prototype.bindEvents = function(){
  var webForms = this;
  document.addEventListener('DOMContentLoaded', function(){ 
    
    core.events.on("core:web-forms:render", function(){
      webForms.render();
    });

    core.events.on("core:web-forms:start", function(){
      webForms.start();
    });

    core.events.on("core:web-forms:stop", function(){
      webForms.stop();
    });

    core.events.on("core:web-forms:destroy", function(){
      webForms.destroy();
    });

    core.events.on("core:web-form:show", function( form ){
      console.log('WebForm :: core:web-form:show', form );
      webForms.renderEditor( form );
    });

    core.events.on("core:web-forms:drag:export:result", function( result ){
      console.log( 'core:web-forms:drag:export:result', result );
    });

    core.events.on("core:web-forms:infoPanel:show", function( config ){
      console.log( 'core:web-forms:infoPanel:show', config );
      webForms.renderInfoPanel(config);
    });

    core.events.on("core:web-forms:loaded", function( data ){
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

    core.events.on("core:web-form:ready", function( data ){
      // console.log( 'WebForm :: core:web-form:ready > ', data );
      var webForm = {};

      try {
        webForm = JSON.parse( data );
        webForms.show( webForm );
      } catch (e) {
        // throw new Error(e);
      }
    });
    
    core.events.on("core:web-form:render", function( form ){
      console.log( 'WebForm :: core:web-form:render > ', form );
    });

    core.events.on("core:web-form:new", function( form ){
      console.log( 'WebForm :: core:web-form:new > ', form );
    });
  });
};

module.exports = WebForms;