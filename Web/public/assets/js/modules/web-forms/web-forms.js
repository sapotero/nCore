"use strict";

var WebFormSettings = function(config){
  this.current_date = new Date();
  this.currentYear  = this.current_date.getFullYear();
  this.periodStart  = this.current_date;
  this.periodEnd    = this.current_date;
  this.main         = this.current_date.getFullYear();
  this.compare      = this.current_date.getFullYear()-1;
  this.isYearWebForm = config.isYearWebForm || false;
  this.isTemplate   = config.isTemplate || false;
  this.isNew        = config.isNew || true;
};

var WebForm = function(config){
  this.element     = {};
  this._id         = config._id         || '';
  this.name        = config.name        || '';
  this.description = config.description || '';
  this.author      = config.author;
  this.providerId  = config.provider_id;
  this.query       = {};
  this.globalQuery = {};
  this.settings    = new WebFormSettings(config.settings);
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
WebForm.prototype.update = function(html){
  console.log( 'WebForm -> update' );
  this.element.innerHTML = html;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
  this.render();
};
WebForm.prototype.load = function(){
  console.log( 'WebForm -> bindEvents' );
};
WebForm.prototype.detachEvents = function(){
  core.events.remove("core:template:web-forms:editor");
  core.events.remove("core:web-form:loaded");
};
WebForm.prototype.destroyEditor = function() {
  if ($('div#paper').data('froala.editor')) {
    $('div#paper').froalaEditor('destroy');
  }
};

WebForm.prototype.loadEditor = function(body) {
  var html = core.utils.Base64.decode(body);

  var initialize = new Promise(function(resolve, reject) {
    window.jQuery('div#paper').froalaEditor({
      toolbarButtons   : ['file-o', 'floppy-o', 'adjust', 'phone',  'textRotate', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', /*'formatOL'*/, 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', /*'cog', 'rotateDocument' */, 'customCalculationCell'/*, '|', 'zoom-out', 'zoom-in'*/ ],
      language         : 'ru',
      charCounterCount : false,
      toolbarSticky    : false
    });
    resolve(true);
  });

  initialize.then(function(editor) {
    $('div#paper').froalaEditor('html.set', (html ? html : '<p>') + '<p>');
  }).then(function(editor) {
    // var parent = document.querySelector('.fr-wrapper').parentNode;
    // parent.removeChild( document.querySelector('.fr-wrapper').nextSibling ) ;
    // return editor;
  }).catch(function(result) {

    console.log("ERROR!", result);
  });

};
WebForm.prototype.loadEditors = function(body) {
  var html = core.utils.Base64.decode(body);
  console.log( 'decoded:', html );
}


WebForm.prototype.attachEvents = function(){
  var webForm = this;
  
  core.events.subscribe("core:template:web-forms:editor", function(template){
    web-form.update( template.raw );
  });
  
  core.events.subscribe("core:web-form:loaded", function(data){
    web-form.loadEditor( data.raw.body );
  });
  
};
WebForm.prototype.render = function(){
  console.log( 'WebForm -> render', this );

  var helper = {
    '_id': {
      text: function (params) {
        return this._id || '-_id-';
      }
    },
    'name': {
      text: function (params) {
        return this.name || '-name-';
      }
    },
    'description': {
      text: function (params) {
        return this.description || '-description-';
      }
    },
    'providerId': {
      text: function (params) {
        return this.providerId || '-providerId-';
      }
    },
    'query': {
      text: function (params) {
        return this.query || '-query-';
      }
    },
    'globalQuery': {
      text: function (params) {
        return this.globalQuery || '-globalQuery-';
      }
    }
  };

  Transparency.render( this.element.querySelector('#web-form'), this, helper );
};


var WebForms = function(){
  this.element   = {};
  this.documents = {};
  this.bindEvents();
};
WebForms.prototype.WebForm = WebForm;
WebForms.prototype.init = function(){
  core.events.publish( "[ + ] core:web-forms:init" );

  this.element = document.createElement('div');
  // core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
  
  core.events.publish("core:web-forms:template");
};
WebForms.prototype.bindEvents = function(){
};
WebForms.prototype.updateRootElement = function(html){
  this.element.innerHTML = html;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
  this.render();
};

WebForms.prototype.render = function(){
  if ( !Object.keys(this.documents).length ){
    return false;
  }

  for (var type in this.documents) {
    // console.log( 'render -> type, documents', type,this.element.querySelector('.'+type),   this.documents[type] );
    var helper = {
      type: {
        text: function (params) {
          return this.type;
        }
      }
    };
    helper[type] = {
        '_id': {
          text: function (params) {
            return this._id || '-id-';
          }
        },
        name: {
          text: function (params) {
            return this.name || '-name-';
          }
        },
        link: {
          href: function (params) {
            return '#web-forms/' + this._id;
          }
        }
    };

    var config = {
      type: type
    };
    config[type] = this.documents[type];

    Transparency.render( this.element.querySelector('.web-form-'+type), config, helper );
  }
};

WebForms.prototype.add = function( type, config ) {

  if ( !this.documents.hasOwnProperty(type) ) {
    this.documents[type] = [];
  }

  this.documents[type].push( new this.WebForm(config) );
};
WebForms.prototype.clear = function(config) {
  this.documents = {};
};
WebForms.prototype.find = function(id) {
  for (var type in this.documents) {
    for (var i = this.documents[type].length - 1; i >= 0; i--) {
      if( this.documents[type][i]._id === id ){
        return this.documents[type][i];
      }
    }
  }
};

WebForms.prototype.show = function(id) {
  console.log( 'WebForms: show -> ', id);
  var webForm = this.find(id);
  if ( web-form ) {
    web-form.init();
  } else {
    throw new Error('template not found!');
  }
};

WebForms.prototype.start = function() {
  console.log( 'WebForms: start' );
  this.init();
};
WebForms.prototype.stop = function() {
  console.log( 'WebForms: stop' );
};
WebForms.prototype.destroy = function() {
  console.log( 'WebForms: destroy' );
  this.element = [];
};

module.exports = WebForms;