"use strict";

// модуль предоставляющий интерфейс для управления кастомными ячейками

var nCore = nCore || {};
nCore.grid = (function(){
  var Thumb = function(data){
    this._id         = data._id         || '';
    this.created     = data.created_at  || '';
    this.description = data.description || '';
    this.name        = data.name        || '';
    this.type        = data.type        || '';
    this.updated     = data.updated_at  || '';
    this.img         = data.img         || 'assets/img/doc.png';
    this.isTemplate  = data.template    || false;
  };

  var Menu = function(){
    this.element = document.querySelector('.bar');
    this.buttons = [];
    this.active  = {};
  };
  Menu.prototype.clear = function(){
    this.buttons = [];
  };
  Menu.prototype.attach = function(){
    var menu = this;
    var buttons = menu.element.querySelectorAll("[data-command]");

    if ( buttons.length ) {
      for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        menu.buttons.push( button );
      }
      menu.event();
    }
  };

  Menu.prototype.event = function(){
    var menu = this;
    for (var i = 0; i < menu.buttons.length; i++) {
      var button = menu.buttons[i];

      button.addEventListener('click', function(event){
        try {
          menu[ button.dataset.command ]( button.dataset );
          menu.active = event.target;
          menu.updateState();
        } catch(e){
          throw new Error(e);
        }
      });
    }
  };
  Menu.prototype.sort = function( dataset ){
    var param     = dataset.sortField,
        direction = dataset.sortDirection;

    nCore.grid.order( param, direction );
    nCore.grid.render(true);
  };
  Menu.prototype.changeView = function( dataset ){
    console.log( 'changeView dataset', dataset);
    // menu.active = button;
    // menu.updateState();
    // nCore.grid.order( param, direction );
    // nCore.grid.render(true);
  };
  Menu.prototype.updateState = function(){
    var buttons = this.buttons;
    var menu = this;

    for (var i = 0; i < buttons.length; i++) {
      var icon = buttons[i].parentNode.querySelector('.material-icons.mdPosition');


      if ( buttons[i] == menu.active ) {
        // console.log('icon+', icon);
        if ( icon.classList.contains( 'white' ) ) {
          icon.classList.remove('white');
        }
      } else {
        // console.log('icon-', icon);
        buttons[i].dataset.active = false;
        if ( !icon.classList.contains( 'white' ) ) {
          icon.classList.add('white');
        }
      }
    }
  };

  var GridFactory = function(){
    this.thumbs    = {};
    this.menu      = {};
    this.viewType  = this.Constant.THUMB;
    this.sortType  = this.Constant.SORT.TYPE.NAME;
    this.sortOrder = this.Constant.SORT.ORDER.ASC;
  };

  GridFactory.prototype.Constant = {
    THUMB : 'thumb',
    LIST  : 'list',
    ROOT  : {
      DOCUMENTS : document.querySelector('#documents'),
      TEMPLATES : document.querySelector('#templates')
    },
    SORT  : {
      TYPE : {
        NAME : 'name'
      },
      ORDER : {
        ASC  :  1,
        DESC : -1
      }
    }
  };

  GridFactory.prototype.load = function(data){
    var factory = this;
    factory.clear();

    var load = new Promise(function(resolve, reject){
      if ( data ) {

        for( var _type in data ){
          var thumbs = data[_type];
          if ( thumbs.length ) {
            for (var i = 0; i < thumbs.length; i++) {
              var thumb = thumbs[i];

              factory.add({
                thumb : thumb,
                type  : _type
              });
            }
          }
        }

        resolve(true);
      } else {
        reject(false);
      }
    });
    
    load.then(function(data){
      // console.log( factory, factory.thumbs );

      // factory.order();

      factory.render();
    }).catch(function(error){
      throw new Error(error);
    });
  };
  GridFactory.prototype.clear = function(){
    for( var selector in this.Constant.ROOT ){
      document.querySelector( selector ).innertHTML = '';
    }
  };
  GridFactory.prototype.compare = function(a,b,dir){
    return a > b ? 1 : a < b ? -1 : 0;
  };
  GridFactory.prototype.order = function( param, direction ){
    var factory = this;

    var _sort      = param     || factory.sortType,
        _direction = direction || factory.sortOrder;

    for( var type in factory.thumbs){
      factory.thumbs[type].sort(function(a,b) {
        return _direction * (factory.compare(a[_sort], b[_sort] ) < factory.compare(b[_sort], a[_sort] ) ? -1:1) ;
      });
    }
  };

  GridFactory.prototype.render = function( _update ){
    
    var factory = this;

    // factory.clear();
    // console.log( 'render' );
    var render = {};
    render.addOverlay = function(){
      // console.log('addOverlay');
      var options = {
        'keyboard': false, // teardown when <esc> key is pressed (default: true)
        'static': true, // maintain overlay when clicked (default: false)
        'onclose': function () {
          // after callback
        }
      };

      var m = document.createElement('div');
      m.style.width = '400px';
      m.style.height = '100px';
      m.style.margin = '10% auto';
      m.style.padding = '10% auto';
      m.style.backgroundColor = '#fff';
      m.classList.toggle('mui-panel');
      m.classList.toggle('mui--z5');
      m.innerHTML = '<h4>Загрузка документов</h4><div class="loader"></div>';

      var overlay = mui.overlay('on', options, m);
      overlay.classList.toggle('animated');
      overlay.classList.toggle('fadeIn');
    };
    render.removeOverlay = function(){
      // console.log('removeOverlay');
      try {
        mui.overlay('off');
      } catch(error){
        throw new Error(error);
      }
    };

    if ( !_update ) {
      render.addOverlay();
    }

    render.promise = new Promise(function(resolve, reject) {
      
      if ( factory.thumbs ) {

        for(var _type in factory.thumbs ){
          var _type_elements = [];

          var helperTemplate = {
            type: {
              text: function (params) {
                return this.types;
              }
            }
          };
          helperTemplate[_type] = {
              documentTitle: {
                text: function (params) {
                  // console.log('+++', this);

                  return this.name || '---';
                }
              },
              documentDate: {
                text: function (params) {
                  return new Date( this.updated ).toLocaleString('ru-RU', _type === 'list' ? { 
                    year  : 'numeric',
                    month : 'numeric',
                    day   : 'numeric'
                  } : {
                    year   : 'numeric',
                    month  : 'numeric',
                    day    : 'numeric',
                    hour   : 'numeric',
                    minute : 'numeric'

                  });
                }
              },
              documentId: {
                href: function (params) {
                  return "#/report/" + this._id || Math.random();
                },
                text: function () {
                  return ''
                }
              },
              downloadDoc: {
                href: function (params) {
                  return "/" + type + "/" + (this._id || Math.random()) + "/download";
                }
              },
              downloadPdf: {
                href: function (params) {
                  return "documents/" + this._id + ".pdf";
                }
              },
              downloadXls: {
                href: function (params) {
                  return "documents/" + this._id + ".xlsx";
                }
              },
              removeDocument: {
                href: function (params) {
                  return location.hash;
                },
                type: function () {
                  return this._id;
                }
              },
              documentUser: {
                text: function () {
                  return this.user;
                }
              },
              documentImage: {
                src: function(params){
                  return this.img;
                }
              }
            };

          for(var _element in factory.thumbs[_type] ){
            _type_elements.push( factory.thumbs[_type][_element] );
          }


          var res = {};
          res[ _type] = _type_elements;
          res['type'] = _type;
          // console.log( res );

          var _root = document.getElementById('_'+_type);
          _root.classList.remove('mui--hide');
          // console.log( _root );
          Transparency.render( _root, res, helperTemplate );
        }
        resolve(true);
      } else {
        reject(false);
      }
      resolve(true);
    });
    

    render.promise.then(function() {
      if ( !_update ) {
        setTimeout( function(){
          render.removeOverlay();
        }, 1000 );
        factory.menu = new Menu();
        factory.menu.attach();
      }
    }).catch(function(result) {
      console.log("ERROR renderCellSettings!", result);
    });
  };
  
  GridFactory.prototype.add = function(data){
    var factory = this,
        thumb = new Thumb( data.thumb );

    if ( !factory.thumbs.hasOwnProperty( data.type ) ) {
      factory.thumbs[ data.type ] = [];
    }

    // console.log('add', data);
    factory.thumbs[ data.type ].push( thumb );
  };
  GridFactory.prototype.remove = function(){
    delete this.thumbs;
  };
  GridFactory.prototype.clear = function(){
    this.thumbs = {};
  };

  return new GridFactory();
})();