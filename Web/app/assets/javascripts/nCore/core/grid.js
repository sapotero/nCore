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

  var GridFactory = function(){
    this.thumbs   = {};
    this.viewType = this.Constant.THUMB;
  };

  GridFactory.prototype.Constant = {
    THUMB : 'thumb',
    LIST  : 'list',
    ROOT  : {
      DOCUMENTS : document.querySelector('#documents'),
      TEMPLATES : document.querySelector('#templates')
    }
  };

  GridFactory.prototype.load = function(data){
    var factory = this;

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

  GridFactory.prototype.render = function(){
    
    var factory = this;
    // factory.clear();
    console.log( 'render' );
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
      console.log('removeOverlay');
      try {
        mui.overlay('off');
      } catch(error){
        throw new Error(error);
      }
    };
    
    render.addOverlay();


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
          console.log( _root );
          Transparency.render( _root, res, helperTemplate );
        }
        resolve(true);
      } else {
        reject(false);
      }
      // if ( nCore.storage.hasOwnProperty( type ) && JSON.parse( nCore.storage.getItem(type) ).length || JSON.parse(nCore.storage.getItem('templates')).length ) {

          
          // var templates = JSON.parse(nCore.storage.getItem('templates'));
          

          // console.log('templates.length');
          
          // var _mui_rows = document.querySelector('.mui-row._indexViewTemplate'),
          // _active_row = document.querySelector('._indexViewTemplate');

          // for (var i = 0; i < _mui_rows.length; i++) {
          //   _mui_rows[i].classList.add('mui--hide');
          // }

          // if (_active_row) {
          //   _active_row.classList.remove('mui--hide');
          // }
        

      //   // if ( JSON.parse(nCore.storage.getItem(type)).length ) {
      //   //   var helper = {
      //   //     documentTitle: {
      //   //       text: function (params) {
      //   //         return this.name || '---';
      //   //       }
      //   //     },
      //   //     documentDate: {
      //   //       text: function (params) {
      //   //         // console.log('type=list', nCore.storage.getItem('indexViewType') === 'list');
      //   //         return new Date( this.updated_at ).toLocaleString('ru-RU', nCore.storage.getItem('indexViewType') === 'list' ? { 
      //   //           year  : 'numeric',
      //   //           month : 'numeric',
      //   //           day   : 'numeric'
      //   //         } : {
      //   //           year   : 'numeric',
      //   //           month  : 'numeric',
      //   //           day    : 'numeric',
      //   //           hour   : 'numeric',
      //   //           minute : 'numeric'

      //   //         });
      //   //       }
      //   //     },
      //   //     documentId: {
      //   //       href: function (params) {
      //   //         return "#/report/" + this._id || Math.random();
      //   //       },
      //   //       text: function () {
      //   //         return ''
      //   //       }
      //   //     },
      //   //     downloadDoc: {
      //   //       href: function (params) {
      //   //         return "/" + type + "/" + (this._id || Math.random()) + "/download";
      //   //       }
      //   //     },
      //   //     downloadPdf: {
      //   //       href: function (params) {
      //   //         return "documents/" + this._id + ".pdf";
      //   //       }
      //   //     },
      //   //     downloadXls: {
      //   //       href: function (params) {
      //   //         return "documents/" + this._id + ".xlsx";
      //   //       }
      //   //     },
      //   //     removeDocument: {
      //   //       href: function (params) {
      //   //         return location.hash;
      //   //       },
      //   //       type: function () {
      //   //         return this._id
      //   //       }
      //   //     },
      //   //     documentUser: {
      //   //       text: function () {
      //   //         return this.user
      //   //       }
      //   //     },
      //   //     // documentImage: {
      //   //     //   src: function(params){
      //   //     //     return ( this.image.length ? this.image : 'assets/img/doc.png' )
      //   //     //   }
      //   //     // },
      //   //     groupTitle: {
      //   //       text: function () {
      //   //         return 'Шаблоны'
      //   //       }
      //   //     }
      //   //   };

      //   //   var items = JSON.parse(nCore.storage.getItem(type));
      //   //   Transparency.render(document.getElementById(nCore.storage.getItem('indexViewType')), items, helper);

      //   //   document.body.classList.add('hide-sidedrawer');
      //   //   document.getElementById('thumb').classList.remove('mui--hide')

      //   //   var _mui_rows = document.getElementsByClassName('mui-row _indexView'),
      //   //     _active_row = document.querySelector('._indexView.' + nCore.storage.getItem('indexViewType'));

      //   //   for (var i = 0; i < _mui_rows.length; i++) {
      //   //     _mui_rows[i].classList.add('mui--hide')
      //   //   }

      //   //   if (_active_row) {
      //   //     _active_row.classList.remove('mui--hide');
      //   //   };
      //   // }
      //   resolve(true);
      // } else {
      //   reject(false);
      // }
      resolve(true);
    });
    

    render.promise.then(function(data) {
      setTimeout( function(){
        render.removeOverlay();
      }, 1000 );
      // console.log( 'after', factory.thumbs.templates );
    }).catch(function(result) {
      console.log("ERROR renderCellSettings!", result);
    });
  };
  
  GridFactory.prototype.add = function(data){
    var factory = this,
        thumb = new Thumb( data.thumb );

    if ( !factory.thumbs.hasOwnProperty( data.type ) ) {
      factory.thumbs[ data.type ] = {};
    }

    // console.log('add', data);
    factory.thumbs[ data.type ][ thumb._id ] = thumb;
  };
  GridFactory.prototype.remove = function(thumb){
    delete this.thumbs[thumb._id];
  };
  GridFactory.prototype.clear = function(){
    this.thumbs = {};
  };

  return new GridFactory();
})();