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
  var elements = JSON.parse( '[{"element":{"elementType":"checkbox","class":["_drag"],"label":"checkbox","preventCopy":false},"options":{"top":134,"left":147.515625}}]' );

  var box = this.content.element.getBoundingClientRect();
  console.log( 'import box', box.top, box.left );

  if ( elements.length ) {
    var df = document.createDocumentFragment();

    for(var k = 0, length = elements.length; k < length; k++){
      
      console.log( '+++elements[k]', elements[k] );
      
      var _element = core.elements.create( elements[k].element );

      // core.modules.drag.clonedElementAttachEvents( element );
      core.events.on("core:drag:add", { el: _element.element, options: elements[k].drag } );
      // core.modules.drag.add( element, { snapX: 10,  snapY: 10, activeClass: "active-border" } );
      // _element.element.style.options.top  = box.top  + elements[k].options.top  + 'px';
      // _element.element.style.options.left = box.left + elements[k].options.left + 'px';

      df.appendChild( _element.element );

    }

  this.content.element.appendChild( df );
  core.events.emit( "core:dom:material:update" );
  

  };
};
WebForms.prototype.add = function( config ) {
  var form = new this.WebForm(config);
  this.forms.push( form );
  return form;
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
    class : [ this.CSS.LEFT_PANEL ],
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
            callback : {
              context  : this,
              function : function(e){
                e.preventDefault();
                core.events.publish( "core:router:web-forms:new" );
              },
            }
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
        class: [ this.CSS.CELL, 'mdl-cell--3-col', 'mdl-cell--12-col-phone', 'mdl-cell--4-col-tablet'],
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
      class : [ this.CSS.CELL, "mdl-cell--12-col-phone", "mdl-cell--6-col-desktop", "mdl-cell--3-offset-desktop", "mdl-progress", "mdl-js-progress" ],
      items: [
        this.menu
      ]
    });
  }

  core.events.emit( "core:dom:content:clear" );
  core.events.emit( "core:dom:content:set", this.content );
}
WebForms.prototype.renderInfoPanel = function( element ) {

  var items = [];

  if ( element && element.hasOwnProperty('_conf') ) {
    console.log( 'renderInfoPanel', element.element, element._conf, element._conf.constructor.name );
    
    items.push(
      core.elements.create({
        elementType : 'simple',
        type : 'h3',
        class : [ 'mdl-color-text--grey-400' ],

        text : 'Свойства',
      })
    );

    if ( !element._conf.constructor.name ) {
      throw new Error('no constructor name given');
    }

    switch( element._conf.constructor.name ){
      case 'Checkbox':
        items.push(
          core.elements.create({
            elementType : 'input',
            label : 'Подпись',
            float : true,
            value : element._conf.label.textContent,
            input : {
              function : function( value ){
                element._conf.label.textContent = this.input.value;
              }
            }
          })
        );

        items.push(
          core.elements.create({
            elementType : 'input',
            label : 'Имя',
            float : true,
            value : element._conf.checkbox.name,
            input : {
              function : function( value ){
                element._conf.checkbox.name = this.input.value;
              }
            }
          })
        );

        items.push(
          core.elements.create({
            elementType : 'switch',
            label   : 'Активный',
            checked : element._conf.checkbox.checked,
            toggle  : {
              function : function( value ){
                var _el = element.MaterialCheckbox;
                this.checkbox.checked === true ? _el.check() : _el.uncheck();
              }
            }
          })
        );

        items.push(
          core.elements.create({
            elementType : 'switch',
            label : 'Обязательный параметр',
            require : element._conf.checkbox.getAttribute('required'),
            toggle : {
              function : function( value ){
                console.log( 'required', this.checkbox );
                element._conf.checkbox.setAttribute( 'required', this.checkbox.checked );
              }
            }
          })
        );
        break;
      case 'Radio':
        items.push(
          core.elements.create({
            elementType : 'input',
            label : 'Подпись',
            float : true,
            value : element._conf.label.textContent,
            input : {
              function : function( value ){
                element._conf.label.textContent = this.input.value;
              }
            }
          })
        );

        items.push(
          core.elements.create({
            elementType : 'input',
            label : 'Имя',
            float : true,
            value : element._conf.radio.name,
            input : {
              function : function( value ){
                element._conf.radio.name = this.input.value;
              }
            }
          })
        );

        items.push(
          core.elements.create({
            elementType : 'switch',
            label   : 'Активный',
            checked : element._conf.radio.checked,
            toggle  : {
              function : function( value ){
                var _el = element.MaterialCheckbox;
                this.radio.checked === true ? _el.check() : _el.uncheck();
              }
            }
          })
        );

        items.push(
          core.elements.create({
            elementType : 'switch',
            label : 'Обязательный параметр',
            require : element._conf.radio.getAttribute('required'),
            toggle : {
              function : function( value ){
                console.log( 'required', this.checkbox );
                element._conf.radio.setAttribute( 'required', this.checkbox.checked );
              }
            }
          })
        );
        break;
      case 'Label':
        items.push(
          core.elements.create({
            elementType : 'input',
            label : 'Текст',
            float : true,
            value : element._conf.element.textContent,
            input : {
              function : function( value ){
                element._conf.element.textContent = this.input.value;
              }
            }
          })
        );
        items.push(
          core.elements.create({
            elementType : 'select',
            label : '++Размер шрифта',
            items : [
              {
                text  : '12',
                value : '12',
              },
              {
                text  : '14',
                value : '14',
              },
              {
                text  : '16',
                value : '16',
              },
              {
                text  : '18',
                value : '18',
              },
              {
                text  : '20',
                value : '20',
              },
              {
                text  : '22',
                value : '22',
              },
              {
                text  : '24',
                value : '24',
              },
              {
                text  : '26',
                value : '26',
              },
              {
                text  : '28',
                value : '28',
              },

            ],
            select: {
              // context: this,
              function: function( e ){
                console.log( 'select', this.select.value, element._conf.element );
                element._conf.element.style.fontSize = this.select.value + 'px';
              }
            }
          })
        );
        break;
      case 'Input':
        
        items.push(
          core.elements.create({
            elementType : 'input',
            label : 'Подпись',
            float : true,
            value : element._conf.label.textContent,
            input : {
              function : function( value ){
                element._conf.label.textContent = this.input.value;
              }
            }
          })
        );
        
        items.push(
          core.elements.create({
            elementType : 'input',
            label : 'Имя',
            float : true,
            value : element._conf.input.name,
            input : {
              function : function( value ){
                element._conf.input.name = this.input.value;
              }
            }
          })
        );

        items.push(
          core.elements.create({
            elementType : 'switch',
            label : 'Обязательный параметр',
            require : element._conf.input.getAttribute('required'),
            toggle : {
              function : function( value ){
                console.log( 'required', this.checkbox );
                element._conf.input.setAttribute( 'required', this.checkbox.checked );
              }
            }
          })
        );
        break;
      default:
        break;
    }
  }

  this.infoPanel = core.elements.create({
    elementType : 'simple',
    items : items,
  });

  core.events.emit( "core:dom:infoPanel:clear" );
  core.events.emit( "core:dom:infoPanel:set", this.infoPanel );
  core.events.emit( "core:dom:material:update" );
}

WebForms.prototype.render = function(){
  core.events.emit( "core:current:set", this );
  core.events.emit( "core:dom:application:clear" );

  this.renderLeftPanel();
  this.renderContent();
  this.renderInfoPanel();

  setTimeout(function(){
    core.events.emit( "core:dom:primaryHeader:show" );
  }, 100);

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

WebForms.prototype.renderEditorLeftPanel = function() {
  console.log( 'WebForms: renderEditorLeftPanel' );

    this.headerSubMenu = core.elements.create({
    elementType: 'simple',
    class: ['mdl-navigation'],
    items : [
      core.elements.create({
        elementType: 'button',
        class: [ "mdl-color-text--grey-600" ],
        icon: 'refresh',
        tooltip: 'Обновить страницу++',
        callback : {
          context: this,
          function : function(e){
            e.preventDefault();
            // core.events.emit( 'core:current:reload' );
            this.deleteDialog();
          }
        }
      }),
      core.elements.create({
        elementType: 'button',
        class: [ "mdl-color-text--grey-600" ],
        icon: 'settings',
        tooltip: 'Настройки страницы++',
        callback : {
          context: this,
          function : function(e){
            e.preventDefault();
            this.configDialog();
          }
        }
      }),
    ]
  });

  core.events.emit( "core:dom:headerSubMenu:clear" );
  core.events.emit( "core:dom:headerSubMenu:set", this.headerSubMenu );


  this.leftPanel = core.elements.create({
    elementType : 'simple',
    class : [ this.CSS.LEFT_PANEL ],
    items : [
      core.elements.create({
        elementType : 'input',
        class : [ '_drag' ],
        name : 'test',
        label : 'test',
        float : true,
      }),
      core.elements.create({
        elementType : 'label',
        class : [ '_drag' ],
        text : 'label'
      }),
      core.elements.create({
        elementType : 'checkbox',
        class : [ '_drag' ],
        label : 'checkbox'
      }),
      core.elements.create({
        elementType : 'radio',
        class : [ '_drag' ],
        label : 'radio',
        name  : 'radio',
        value : 'radio',
      }),
      core.elements.create({
        elementType : 'textarea',
        class : [ '_drag' ],
        label : 'radio',
        name  : 'area',
        rows : 2,
        cols : 10,
      }),
      core.elements.create({
        elementType : 'button',
        icon: 'person',
        callback : {
          context: this,
          function : function(e){
            e.preventDefault();
            core.events.emit('core:web-forms:show:saveDialog');
          }
        }
      }),
      core.elements.create({
        elementType : 'button',
        icon: 'star',
        callback : {
          context: this,
          function : function(e){
            e.preventDefault();
            core.events.emit('core:web-forms:show:deleteDialog');
          }
        }
      }),
      core.elements.create({
        elementType : 'button',
        icon: 'sort',
        callback : {
          // context: this,
          function : function(e){
            e.preventDefault();
            core.events.emit('core:web-forms:show:configDialog');
          }
        }
      }),
      
    ]
  });

  core.events.emit( "core:drag:editor:stop" );

  core.events.emit( "core:dom:leftPanel:clear" );
  core.events.emit( "core:dom:leftPanel:set", this.leftPanel );
  core.events.emit( "core:dom:material:update" );
  
  core.events.emit( "core:drag:editor:start" );
};

WebForms.prototype.renderEditorContent = function() {
  console.log( 'WebForms: renderEditorContent' );
  this.content = core.elements.create({
    elementType : 'simple',
    class : [ this.CSS.CONTENT ],
  });

  core.events.emit( "core:drag:editor:stop" );
  
  core.events.emit( "core:dom:content:clear" );
  core.events.emit( "core:dom:content:set", this.content );
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

  setTimeout( function(){
    core.events.emit( "core:dom:content:wrapper:hide");
  }, 500 );
};

WebForms.prototype.saveDialog = function(){
  // core.events.emit( "core:dom:dialog:clear" );

  this.dialog = core.elements.create({
    elementType : 'dialog',
    title : 'Сохранение',
    
    content : core.elements.create({
      elementType: 'simple',
      text: 'Документ был изменен, вы хотите его сохранить?',
      items: [],
    }),

    actions: [
      {
        text: 'Сохранить',
        class : [ 'mdl-color-text--green-500' ],
        submit :  {
          // context  : this,
          function : function(event){
            console.log( 'webforms-leftMenu > renderEditorContent submit  dialog click' );
          },
        }
      },
      {
        text: 'Отмена',
        cancel : {
          context  : this,
          function : function(e){
            console.log( 'webforms-leftMenu > renderEditorContent  cancel dialog click' );
          },
        }
      },
    ],
    after : {
      context  : this,
      function : function(e){
        console.log( 'webforms-leftMenu > renderEditorContent  after dialog click', this );
      },
    }
  });

  core.events.emit( "core:dom:dialog:set", this.dialog );
  core.events.emit( "core:dom:dialog:show" );
  
  // core.events.emit( "core:dom:dialog:set", dialog );
  // this.content.element.appendChild( dialog.element );
  // core.events.emit( "core:dom:dialog:show" );
}

WebForms.prototype.deleteDialog = function(){
  // core.events.emit( "core:dom:dialog:clear" );

  this.dialog = core.elements.create({
    elementType : 'dialog',
    title : 'Удаление',
    
    content : core.elements.create({
      elementType: 'simple',
      text: 'Вы действительно хотите удалалить документ?',
      items: [],
    }),

    actions: [
      {
        text: 'Удалить',
        class : [ 'mdl-color-text--red-500' ],
        submit :  {
          // context  : this,
          function : function(event){
            console.log( 'webforms-leftMenu > renderEditorContent submit  dialog click' );
          },
        }
      },
      {
        text: 'Отмена',
        cancel : {
          context  : this,
          function : function(e){
            console.log( 'webforms-leftMenu > renderEditorContent  cancel dialog click' );
          },
        }
      },
    ],
    after : {
      context  : this,
      function : function(e){
        console.log( 'webforms-leftMenu > renderEditorContent  after dialog click', this );
      },
    }
  });

  core.events.emit( "core:dom:dialog:set", this.dialog );
  core.events.emit( "core:dom:dialog:show" );
  
  // core.events.emit( "core:dom:dialog:set", dialog );
  // this.content.element.appendChild( dialog.element );
  // core.events.emit( "core:dom:dialog:show" );
}

WebForms.prototype.configDialog = function(){
  // core.events.emit( "core:dom:dialog:clear" );

  this.dialog = core.elements.create({
    elementType : 'dialog',
    title : 'Настройки формы',
    big: true,
    
    content : core.elements.create({
      elementType: 'simple',
      text: 'Документ был изменен, вы хотите его сохранить?',
      items: [],
    }),

    actions: [
      {
        text: 'Сохранить',
        class : [ 'mdl-color-text--green-500' ],
        submit :  {
          // context  : this,
          function : function(event){
            console.log( 'webforms-leftMenu > config submit  dialog click' );
          },
        }
      },
      {
        text: 'Отмена',
        cancel : {
          context  : this,
          function : function(e){
            console.log( 'webforms-leftMenu > config  cancel dialog click' );
          },
        }
      },
    ],
    before : {
      context  : this,
      function : function(){
        console.log( 'webforms-leftMenu > config  before callback', this );
      },
    },
    after : {
      // context  : this,
      function : function(){
        console.log( 'webforms-leftMenu > config  after callback', this );
        core.events.emit( "core:dom:dialog:clear" );
      },
    },
  });

  // console.log( this, this.content, this.dialog );
  // this.content.element.appendChild( this.dialog.element );
  // this.dialog.element.showModal();

  core.events.emit( "core:dom:dialog:set", this.dialog );
  core.events.emit( "core:dom:dialog:show" );
  // this.content.element.appendChild( dialog.element );
}


WebForms.prototype.CSS = {
  LEFT_PANEL : 'webforms-leftPanel',
  CELL : 'mdl-cell',
};

WebForms.prototype.CONFIG = {
  EMPTY_FORM : {
    _id         : "__new",
    name        : "Новая форма",
    description : "Новая форма",
    authorId    : '', // core.global.user.id,
    providerId  : '', // core.global.provider.id,
  }
};

WebForms.prototype.createNewForm = function() {
  console.log( 'WebForms: createNewForm' );
  var form = this.add( this.CONFIG.EMPTY_FORM );
  this.active = form;
  this.show( form );
};

WebForms.prototype.reload = function() {
  console.log( 'WebForms: start' );
  // this.detachEvents();
  // this.bindEvents();

  this.render();

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
  
  core.events.remove('core:web-forms:show:saveDialog');
  core.events.remove('core:web-forms:show:deleteDialog');
  core.events.remove('core:web-forms:show:configDialog');
  
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

    core.events.on("core:web-forms:show:saveDialog", function(){
      console.log('WebForm :: core:web-forms:show:saveDialog');
      webForms.saveDialog();
    });

    core.events.on("core:web-forms:show:deleteDialog", function(){
      console.log('WebForm :: core:web-forms:show:deleteDialog');
      webForms.deleteDialog();
    });

    core.events.on("core:web-forms:show:configDialog", function(){
      console.log('WebForm :: core:web-forms:show:configDialog');
      webForms.configDialog();
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
      core.events.emit( "core:dom:content:wrapper:show");
    });

    core.events.on("core:web-forms:new", function(){
      core.events.emit( "core:dom:content:wrapper:show");
      console.log( 'WebForm :: core:web-form:new > ');
      webForms.createNewForm();
    });

  });
};

module.exports = WebForms;