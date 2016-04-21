"use strict";

var BusinessFormSettings = function(config){
  this.current_date = new Date();
  this.currentYear  = this.current_date.getFullYear();
  this.periodStart  = this.current_date;
  this.periodEnd    = this.current_date;
  this.main         = this.current_date.getFullYear();
  this.compare      = this.current_date.getFullYear()-1;
  this.BsYearbusinessForm = config.BsYearbusinessForm || false;
  this.isTemplate   = config.isTemplate || false;
  this.isNew        = config.isNew || true;
};

var BusinessForm = function(config){
  this.element     = {};
  this._id         = config._id         || '';
  this.name        = config.name        || '';
  this.description = config.description || '';
  this.author      = config.author;
  this.providerId  = config.provider_id;
  this.query       = {};
  this.globalQuery = {};
  this.settings    = new BusinessFormSettings(config.settings);
};
BusinessForm.prototype.init = function(){

  this.detachEvents();
  this.attachEvents();
  this.destroyEditor();
  
  
  console.log( 'BusinessForm -> init' );

  this.element = document.createElement('div');
  core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
  core.events.publish("core:bps:editor:template");
  core.events.publish("core:bp:load", this._id );
};
BusinessForm.prototype.update = function(html){
  console.log( 'BusinessForm -> update' );
  this.element.innerHTML = html;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
  this.render();
};
BusinessForm.prototype.load = function(){
  console.log( 'BusinessForm -> bindEvents' );
};
BusinessForm.prototype.detachEvents = function(){
  core.events.remove("core:template:bps:editor");
  core.events.remove("core:bp:loaded");
};
BusinessForm.prototype.destroyEditor = function() {
  if ($('div#paper').data('froala.editor')) {
    $('div#paper').froalaEditor('destroy');
  }
};

BusinessForm.prototype.loadEditor = function(body) {
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
BusinessForm.prototype.loadEditors = function(body) {
  var html = core.utils.Base64.decode(body);
  console.log( 'decoded:', html );
}


BusinessForm.prototype.attachEvents = function(){
  var bp = this;
  
  core.events.subscribe("core:template:bps:editor", function(template){
    bp.update( template.raw );
  });
  
  core.events.subscribe("core:bp:loaded", function(data){
    bp.loadEditor( data.raw.body );
  });
  
};
BusinessForm.prototype.render = function(){
  console.log( 'BusinessForm -> render', this );

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

  Transparency.render( this.element.querySelector('#bp'), this, helper );
};


var BusinessForms = function(){
  this.element   = {};
  this.documents = {};
  this.bindEvents();
};
BusinessForms.prototype.BusinessForm = BusinessForm;
BusinessForms.prototype.init = function(){
  core.events.publish( "[ + ] core:bps:init" );

  this.element = document.createElement('div');
  core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
  
  core.events.publish("core:bps:template");
};
BusinessForms.prototype.bindEvents = function(){
  var bps = this;

  document.addEventListener('DOMContentLoaded', function(){
    core.events.subscribe("core:bps:loaded", function(rawData){
      // console.log( 'RAW REPORTS', rawData );
      for (var type in rawData ) {
        var data = rawData[type];

        // console.log( '***++', type, rawData.raw[type] );
        
        for (var i = data.length - 1; i >= 0; i--) {
          var _d = data[i];
          var bp = {
            _id         : _d._id,
            name        : _d.name,
            description : _d.description,
            update_at   : _d.updated_at,
            
            author : {
              id   : _d.author_id,
              name : _d.author_id
            },

            providerId  : _d.provider_id,

            query       : _d.query,
            globalQuery : _d.globalQuery,

            settings : {
              periodStart  : _d.periodStart,
              periodEnd    : _d.periodEnd,
              main         : _d.main,
              compare      : _d.compare,
              BsYearbusinessForm : _d.BearbusinessForm,
              isTemplate   : _d.template,
              providerSelected : _d.providerSelected
            }
          };
          bps.add( type, bp );
          
          core.events.publish("core:card:add", {
            type:type,
            bp:bp
          });
        }
      }
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe("core:bps:start", function( template ){
      console.log('BusinessForms <- core:bps:start');
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe("core:template:bps", function( template ){
      bps.updateRootElement( template.raw );
    });

    // клик по меню с документами
    core.events.subscribe("core:bps:menu:select", function( menuItem ){
      console.log( 'BusinessForms <- core:bps:menu:select', menuItem );
      core.events.publish( "core:router:default" );
    });

  });
};
BusinessForms.prototype.updateRootElement = function(html){
  this.element.innerHTML = html;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
  this.render();
};

BusinessForms.prototype.render = function(){
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
            return '#bps/' + this._id;
          }
        }
    };

    var config = {
      type: type
    };
    config[type] = this.documents[type];

    Transparency.render( this.element.querySelector('.bp-'+type), config, helper );
  }
};

BusinessForms.prototype.add = function( type, config ) {

  if ( !this.documents.hasOwnProperty(type) ) {
    this.documents[type] = [];
  }

  this.documents[type].push( new this.BusinessForm(config) );
};
BusinessForms.prototype.clear = function(config) {
  this.documents = {};
};
BusinessForms.prototype.find = function(id) {
  for (var type in this.documents) {
    for (var i = this.documents[type].length - 1; i >= 0; i--) {
      if( this.documents[type][i]._id === id ){
        return this.documents[type][i];
      }
    }
  }
};

BusinessForms.prototype.show = function(id) {
  console.log( 'BusinessForms: show -> ', id);
  var bp = this.find(id);
  if ( bp ) {
    bp.init();
  } else {
    throw new Error('template not found!');
  }
};

BusinessForms.prototype.start = function() {
  console.log( 'BusinessForms: start' );
  this.init();
};
BusinessForms.prototype.stop = function() {
  console.log( 'BusinessForms: stop' );
};
BusinessForms.prototype.destroy = function() {
  console.log( 'BusinessForms: destroy' );
  this.element = [];
};

module.exports = BusinessForms;