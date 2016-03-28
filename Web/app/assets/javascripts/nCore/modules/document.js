"use strict";

// модуль предоставляющий интерфейс для работы с документом (отчет, печатная форма, бизнес-процесс)

var nCore = nCore || {};
nCore.document = (function(){

  var Document = function(){
    this.author               = document.querySelector('#nCoreDocumentAuthor');
    this.author_id            = document.querySelector('#nCoreDocumentAuthor').dataset.userId;
    this.provider_id          = document.querySelector('#nCoreDocumentAuthor').dataset.providerId;
    this.current_date         = new Date();
    this.currentYear          = this.current_date.getFullYear();
    this.periodStart          = this.current_date.formattedDate('yyyy-mm-dd');
    this.periodEnd            = this.current_date.formattedDate('yyyy-mm-dd');
    this.main                 = this.current_date.getFullYear();
    this.compare              = this.current_date.getFullYear()-1;
    this.yearReport           = false;
    this.template             = false;
    this.globalQuery          = '[{"query": []}]';
    this.globalQueryData      = {};
    this.documentSettingTab   = 'documentQueryPane';
    this.id                   = '';
    this.documentEvent        = {};
    this.type                 = 'report';
    this.showSettings         = false;
    this.name                 = '';
    this.description          = '';
    this.documentCellQuery    = {};
    this.isNew                = true;
    this.event = {};
    this.showCellSettings     = false;
    this.providerSelected     = 'optionsCurrent';

    this.init();
  };
  Document.prototype.init = function() {
    var doc = this;
    
    console.log('init doc');

    nCore.attachTo( doc.event );
    // doc.event.publish( 'loadCriteria' );
  };
  Document.prototype.new = function() {
    nCore.document = new Document();
    return nCore.document;
  };
  Document.prototype.windowTitle = function(title) {
    title = title || 'Отчет';
    document.title = title;
    document.getElementById('nCoreDocumentHeadLine').textContent = title;
  };
  Document.prototype.data = function() {
    return {
      id                   : this.id,
      author_id            : this.author_id,
      provider_id          : this.provider_id,
      
      type                 : this.type,
      main                 : this.main,
      compare              : this.compare,
      yearReport           : this.yearReport,
      name                 : this.name,
      description          : this.description,
      body                 : Base64.encode( $('#paper').froalaEditor('html.get')+'&nbsp;'),

      current_date         : this.current_date,
      currentYear          : this.currentYear,
      periodStart          : this.periodStart,
      periodEnd            : this.periodEnd,
      
      globalQuery          : this.globalQuery,
      globalQueryData      : this.globalQueryData,
      
      documentSettingTab   : this.documentSettingTab,
      documentEvent        : this.documentEvent,
      
      documentCellQuery    : this.documentCellQuery,
      providerSelected     : this.providerSelected.replace('options', '').toLowerCase()
    };
  };
  Document.prototype.save = function( data ) {
    console.log('d.p.save', data);
    this.author_id       = document.querySelector('#nCoreDocumentAuthor').dataset.userId;
    this.provider_id     = document.querySelector('#nCoreDocumentAuthor').dataset.providerId;
    this.body            = Base64.encode( $('#paper').froalaEditor('html.get')+'&nbsp;');
    this.globalQueryData = JSON.stringify( data.globalQueryData ) ;
    this.datetime        = new Date().getTime();
    
    for( var key in data ){
      if ( this.hasOwnProperty(key) ) {
        this[ key ] = data[ key ];
      }
    }
  };
  Document.prototype.setAttributes = function(data) {
    console.log( 'setAttributes', data );
    this.name        = data.elements.nCoreDocumnetName.value;
    this.description = data.elements.nCoreDocumnetDescription.value;
  };
  Document.prototype.load = function( config ) {
    console.log( 'load', config );
    this.id                = config._id;
    this.title             = config.title;
    this.type              = config.type;
    this.name              = config.name;
    this.description       = config.description;
    this.documentCellQuery = config.query;
    this.template          = config.template;
    this.isNew             = false;

    try{
      this.providerSelected = JSON.parse( config.providerSelected );
    } catch(e){
      this.providerSelected = config.providerSelected || 'current';
    }

    if ( config.body ) {
      this.event.publish('initEditor', Base64.decode( config.body ));
    }
  };
  Document.prototype.loadIndex = function(items){

    console.log('loadIndex', items);

    var load = new Promise(function(resolve, reject) {
      items.forEach(function(item){
        nCore.query.get(item + '.json')
          .success(function (data) {
            console.log('loadData', data);
            if ( item == 'documents') {
              nCore.storage.setItem('documents', JSON.stringify(data.documents));
              nCore.storage.setItem('templates', JSON.stringify(data.templates));
            } else {
              nCore.storage.setItem(item + '', JSON.stringify(data));
            }
            resolve(data);
          }).error(function (data) {
            console.error('[!] loadItem -> get', data);
            reject(false);
          });
      });
    });

    load.then(function(data) {
     nCore.grid.load(data);
      // nCore.document.event.publish(nCore.storage.getItem('indexViewType'));
    }).catch(function(result) {
      // render.removeOverlay();
      console.log("ERROR renderCellSettings!", result);
    });
  };
  Document.prototype.save = function( config ) {
    console.log( 'load', config );
    this.id        = config._id;
    this.title             = config.title;
    this.type              = config.type;
    this.name              = config.name;
    this.description       = config.description;
    this.documentCellQuery = config.query;
    this.template          = config.template;
    this.isNew             = false;

    if ( config.body ) {
      this.event.publish('initEditor', Base64.decode( config.body ));
    }
  };
  Document.prototype.create = function() {
    try{
      html2canvas( document.querySelector('div#paper') , {
        onrendered: function(canvas) {
          var nCoreDocumentAttributes = {
            author_id       : document.querySelector('#nCoreDocumentAuthor').dataset.userId,
            provider_id     : document.querySelector('#nCoreDocumentAuthor').dataset.providerId,
            type            : nCore.document.type,
            name            : nCore.document.name,
            description     : nCore.document.description,
            datetime        : new Date().getTime(),
            body            : Base64.encode($('#paper').froalaEditor('html.get')+'&nbsp;'),
            query           : nCore.document.cellQuery,
            periodStart     : nCore.document.periodStart,
            periodEnd       : nCore.document.periodEnd,
            globalQuery     : nCore.document.globalQuery,
            globalQueryData : JSON.stringify( nCore.document.globalQueryData ),
            providerSelected: JSON.stringify( nCore.document.providerSelected )
            
          };


          canvas.height = $('div#paper').height() * 0.25;
          canvas.width  = $('div#paper').width() * 0.25;
          nCoreDocumentAttributes.image = canvas.toDataURL();


          if ( nCore.document.yearReport ) {
            nCoreDocumentAttributes.yearReport = nCore.document.yearReport;
            nCoreDocumentAttributes.main       = nCore.document.main;
            nCoreDocumentAttributes.compare    = nCore.document.compare;
          }

        // nCore.document.setAttributes(nCoreDocumentAttributes);

        nCore.query.post('documents.json', nCoreDocumentAttributes)
          .success(function (data) {
            console.log('saveDocument post', data);
              location.hash = location.hash.replace(/new/gim, data._id);
          }).error(function (data) {
            console.error('[!] saveDocument', data );
          });
        }
      });
    } catch (e){
      console.log( 'error', e );
    }
  };
  Document.prototype.update = function( rootNode ) {
    if ( rootNode ) {
      var formRoot = nCore.core.findUpTag(rootNode, '_nCoreDocumentSettings');
      var settings = formRoot.querySelector('#documentQueryPane > form');
      console.log('****UPDATE', rootNode, settings.elements);

      
      for (var z = 0; z < settings.elements.length; z++) {
        var element = settings.elements[z];

        switch( element.name ){
          case 'nCoreName':
            this.name = element.value;
            break;
          case 'nCoreDescription':
            this.description = element.value;
            break;
          case 'nCorePeriodStart':
            this.periodStart = element.value;
            break;
          case 'nCorePeriodEnd':
            this.periodEnd = element.value;
            break;
          case 'yearReport':
            this.yearReport = element.checked ? true : false;
            break;
          case 'main':
            this.main = element.value;
            break;
          case 'compare':
            this.compare = element.value;
            break;
          default:
            continue;
        }
      }
    }

    var render = {};
    
    render.addOverlay = function(){
      console.log('addOverlay');
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
      m.innerHTML = '<h4>Сохранение документа</h4><div class="loader"></div>';

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

    render.promise =  new Promise(function(resolve, reject) {
      html2canvas( document.querySelector('div#paper') , {
        onrendered: function(canvas) {

          var data = nCore.document.data();
          // canvas.height = $('div#paper').height() * 0.25;
          // canvas.width  = $('div#paper').width() * 0.25;
          data.image = canvas.toDataURL();

          nCore.query.put('documents/' + nCore.document.id + '.json', data ).success(function (data) {
            console.log('saveDocument putt', data);
            resolve(data);
          }).error(function (data) {
            console.error('[!] saveDocument', data);
            reject(false);
          });
        }
      });
    });

    render.addOverlay();

    render.promise.then(function(data) {
      setTimeout( render.removeOverlay, 1000 );
      location.hash = location.hash.replace(/new/, data._id);
    }).catch(function(result) {
      // render.removeOverlay();
      console.log("ERROR renderCellSettings!", result);
    });
  };
  Document.prototype.delete = function(element){
    console.log('***deleteReport', element_root, element);

    var id   = element.type,
    element_root = $(element).closest(".document");

    console.log('deleteReport', id, element, element_root);

    nCore.query.post('documents/' + id + '/remove', { id: id }).success(function (rawDocument) {
      
      element_root.addClass('animatedSlow');
      element_root.addClass('fadeOut');
      
      setTimeout(function (){ element_root.detach(); }, 400);
    }).error(function (data) {
      mui.overlay('off');
      console.error('[!] deleteReport -> get', data);
    });
  };

  return new Document();
})();