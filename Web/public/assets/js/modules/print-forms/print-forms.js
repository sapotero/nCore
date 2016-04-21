"use strict";

var PrintFormSettings = function(config){
  this.current_date = new Date();
  this.currentYear  = this.current_date.getFullYear();
  this.periodStart  = this.current_date;
  this.periodEnd    = this.current_date;
  this.main         = this.current_date.getFullYear();
  this.compare      = this.current_date.getFullYear()-1;
  this.isYearPrintForm = config.isYearPrintForm || false;
  this.isTemplate   = config.isTemplate || false;
  this.isNew        = config.isNew || true;
};

var PrintForm = function(config){
  this.element     = {};
  this._id         = config._id         || '';
  this.name        = config.name        || '';
  this.description = config.description || '';
  this.author      = config.author;
  this.providerId  = config.provider_id;
  this.query       = {};
  this.globalQuery = {};
  this.settings    = new PrintFormSettings(config.settings);
};
PrintForm.prototype.init = function(){

  this.detachEvents();
  this.attachEvents();
  this.destroyEditor();
  
  
  console.log( 'PrintForm -> init' );

  this.element = document.createElement('div');
  core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
  core.events.publish("core:print-forms:editor:template");
  core.events.publish("core:print-form:load", this._id );
};
PrintForm.prototype.update = function(html){
  console.log( 'PrintForm -> update' );
  this.element.innerHTML = html;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
  this.render();
};
PrintForm.prototype.load = function(){
  console.log( 'PrintForm -> bindEvents' );
};
PrintForm.prototype.detachEvents = function(){
  core.events.remove("core:template:print-forms:editor");
  core.events.remove("core:print-form:loaded");
};
PrintForm.prototype.destroyEditor = function() {
  if ($('div#paper').data('froala.editor')) {
    $('div#paper').froalaEditor('destroy');
  }
};

PrintForm.prototype.loadEditor = function(body) {
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
PrintForm.prototype.loadEditors = function(body) {
  var html = core.utils.Base64.decode(body);
  console.log( 'decoded:', html );
}


PrintForm.prototype.attachEvents = function(){
  var print-form = this;
  
  core.events.subscribe("core:template:print-forms:editor", function(template){
    print-form.update( template.raw );
  });
  
  core.events.subscribe("core:print-form:loaded", function(data){
    print-form.loadEditor( data.raw.body );
  });
  
};
PrintForm.prototype.render = function(){
  console.log( 'PrintForm -> render', this );

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

  Transparency.render( this.element.querySelector('#print-form'), this, helper );
};


var PrintForms = function(){
  this.element   = {};
  this.documents = {};
  this.bindEvents();
};
PrintForms.prototype.PrintForm = PrintForm;
PrintForms.prototype.init = function(){
  core.events.publish( "[ + ] core:print-forms:init" );

  this.element = document.createElement('div');
  core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
  
  core.events.publish("core:print-forms:template");
};
PrintForms.prototype.bindEvents = function(){
  var print-forms = this;

  document.addEventListener('DOMContentLoaded', function(){
    core.events.subscribe("core:print-forms:loaded", function(rawData){
      // console.log( 'RAW REPORTS', rawData );
      for (var type in rawData ) {
        var data = rawData[type];

        // console.log( '***++', type, rawData.raw[type] );
        
        for (var i = data.length - 1; i >= 0; i--) {
          var _d = data[i];
          var print-form = {
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
              isYearPrintForm : _d.yearPrintForm,
              isTemplate   : _d.template,
              providerSelected : _d.providerSelected
            }
          };
          print-forms.add( type, print-form );
          
          core.events.publish("core:card:add", {
            type:type,
            print-form:print-form
          });
        }
      }
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe("core:print-forms:start", function( template ){
      console.log('PrintForms <- core:print-forms:start');
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe("core:template:print-forms", function( template ){
      print-forms.updateRootElement( template.raw );
    });

    // клик по меню с документами
    core.events.subscribe("core:print-forms:menu:select", function( menuItem ){
      console.log( 'PrintForms <- core:print-forms:menu:select', menuItem );
      core.events.publish( "core:router:default" );
    });

  });
};
PrintForms.prototype.updateRootElement = function(html){
  this.element.innerHTML = html;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
  this.render();
};

PrintForms.prototype.render = function(){
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
            return '#print-forms/' + this._id;
          }
        }
    };

    var config = {
      type: type
    };
    config[type] = this.documents[type];

    Transparency.render( this.element.querySelector('.print-form-'+type), config, helper );
  }
};

PrintForms.prototype.add = function( type, config ) {

  if ( !this.documents.hasOwnProperty(type) ) {
    this.documents[type] = [];
  }

  this.documents[type].push( new this.PrintForm(config) );
};
PrintForms.prototype.clear = function(config) {
  this.documents = {};
};
PrintForms.prototype.find = function(id) {
  for (var type in this.documents) {
    for (var i = this.documents[type].length - 1; i >= 0; i--) {
      if( this.documents[type][i]._id === id ){
        return this.documents[type][i];
      }
    }
  }
};

PrintForms.prototype.show = function(id) {
  console.log( 'PrintForms: show -> ', id);
  var print-form = this.find(id);
  if ( print-form ) {
    print-form.init();
  } else {
    throw new Error('template not found!');
  }
};

PrintForms.prototype.start = function() {
  console.log( 'PrintForms: start' );
  this.init();
};
PrintForms.prototype.stop = function() {
  console.log( 'PrintForms: stop' );
};
PrintForms.prototype.destroy = function() {
  console.log( 'PrintForms: destroy' );
  this.element = [];
};

module.exports = PrintForms;