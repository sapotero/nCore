"use strict";

// модуль отвечающий за взаимодействие компонентов фреймворка

var nCore = nCore || {};
nCore.events = (function () {
  // var init;
  var activeCell;


  ///////////////////////
  // Cобытия документа //
  ///////////////////////


  // новый документ
  nCore.document.root.subscribe('newDocument', function (data) {
    var overlayEl = mui.overlay('on');
    var options = {
      'keyboard': true, // teardown when <esc> key is pressed (default: true)
      'static': false, // maintain overlay when clicked (default: false)
      'onclose': function () {}
    };

    var m = document.createElement('div');
    m.classList.toggle('mui-panel');
    m.classList.toggle('mui--z5');
    m.classList.toggle('_newDocument');
    m.innerHTML = '<form onsubmit="nCore.document.root.publish(\'saveDocumentToDb\', this); return false;"><legend>Документ</legend><br><br><div class="mui-textfield mui-textfield--float-label"><input required name="nCoreDocumnetName"><label>Название</label></div><div class="mui-textfield mui-textfield--float-label"><input type=text required name="nCoreDocumnetDescription"><label>Описание</label></div><div class="mui--text-right"><button type=button onclick="mui.overlay(\'off\');" class="mui-btn mui-btn--raised mui-btn--danger">отмена</button><button type=submit class="mui-btn mui-btn--raised mui-btn--primary">сохранить</button></div></form>';

    var overlay = mui.overlay('on', options, m);
    overlay.classList.toggle('animated');
    overlay.classList.toggle('fadeIn');
  });

  nCore.document.root.subscribe('showDocumentSettings', function (data) {
    // set overlay options
    var options = {
      'keyboard': true, // teardown when <esc> key is pressed (default: true)
      'static': false, // maintain overlay when clicked (default: false)
      'onclose': function () {
        console.log( 'showDocumentSettings' );
        nCore.document.setShowSettings(false);
      }
    };

    var m = document.createElement('div');
    m.classList.toggle('mui-panel');
    m.classList.toggle('mui--z5');
          
    m.classList.add('_nCoreDocumentSettings');

    nCore.document.setShowSettings(true);

    var text = Transparency.render(document.querySelector('.nCoreDocumentSettings'), {
      nCoreName        : nCore.document.name(),
      nCoreDescription : nCore.document.description(),
      nCorePeriodStart : nCore.document.periodStart(),
      nCorePeriodEnd   : nCore.document.periodEnd(),
      nCoreYearReport  : nCore.document.yearReport(),
      nCoreMain        : nCore.document.main(),
      nCoreCompare     : nCore.document.compare(),
    });
    m.innerHTML = text.innerHTML;

    var main       = m.querySelector('[name="main"]'),
        compare    = m.querySelector('[name="compare"]'),
        yearReport = m.querySelector('[name="yearReport"]');
    
    if ( !nCore.document.yearReport() ) {
      yearReport.checked = false;
      main.disabled    = true;
      compare.disabled = true;
    } else {
      yearReport.checked = true;
      main.disabled    = false;
      compare.disabled = false;
    }

    var overlay = mui.overlay('on', options, m);
    overlay.classList.toggle('animated');
    overlay.classList.toggle('fadeIn');

    var toggleEls = document.querySelectorAll('[data-mui-controls^="document"]');

    function show(ev) {
      for (var z = 0; z < toggleEls.length; z++) {
        toggleEls[z].parentNode.classList.remove('mui--is-active');
        m.querySelector( '#'+toggleEls[z].dataset.muiControls ).classList.remove('mui--is-active');
      }

      m.querySelector( '#'+ev.paneId ).classList.add('mui--is-active');
      m.querySelector('[data-mui-controls="'+ev.paneId+'"]').parentNode.classList.add('mui--is-active');

      nCore.document.setDocumentSettingTab( ev.paneId );
    }

    // attach event handlers
    for (var z = 0; z < toggleEls.length; z++) {
      toggleEls[z].addEventListener('mui.tabs.showstart', show);
    }

    // documentQueryPane по дефолту
    m.querySelector( '#'+nCore.document.documentSettingTab() ).classList.add('mui--is-active');
    m.querySelector('[data-mui-controls="'+nCore.document.documentSettingTab()+'"]').parentNode.classList.add('mui--is-active');

    nCore.core.globalQueryPopulate();

    var tabs_root = text.querySelector('.mui-tabs__bar'),
        tabs      = tabs_root.querySelectorAll('li');

    console.log( tabs );

    for (var z = tabs.length - 1; z >= 0; z--) {
      if ( tabs[z].classList.contains('mui--is-active') ) {
        tabs[z].classList.remove('mui--is-active');
      }
    }

    document.getElementById( nCore.document.documentSettingTab() ).classList.add('mui--is-active');
    
    
  });

  nCore.document.root.subscribe('showGroupModal', function (data) {
    // set overlay options
    var options = {
      'keyboard': true, // teardown when <esc> key is pressed (default: true)
      'static':   false, // maintain overlay when clicked (default: false)
      'onclose':  function () {}
    };
    // initialize with child element
    var m = document.createElement('div');
    m.style.width = '60%';
    m.style.margin = '5% auto';
    m.style.padding = '5% auto';
    m.classList.toggle('mui-panel');
    m.classList.toggle('mui--z5');
    m.innerHTML = '<core-modal limit="20" offset="0" total="100" selected="" from="" source="" caption="Выбор элементов группы"></core-modal>';

    var overlay = mui.overlay('on', options, m);
    overlay.classList.toggle('animated');
    overlay.classList.toggle('fadeIn');
  });

  nCore.document.root.subscribe('addGroupData', function (data) {
    console.log('addGroupData', data);
    nCore.modules.table.fromGroup(data);
  });

  // редактирование настроек документа
  nCore.document.root.subscribe('updateDocument', function (root) {
    console.log(' updateDocument', root);

    if ( nCore.document.getTemplate() ) {
      console.log('try to edit template: ', nCore.document.getTemplate );
      nCore.document.root.publish('tryToEditTemplate');
      return false;
    }
    
    if ( nCore.document.isNewDocument() ){
      nCore.document.root.publish('newDocument');
    } else {
        mui.overlay('off');

        var modalRoot = nCore.core.findUpTag(root, '_nCoreDocumentSettings'),
            data      = modalRoot.querySelector('[name="documentQueryPane"]');

        console.log('update:', data, modalRoot.querySelector("[name='nCoreDescription']").value );
        nCore.document.root.publish('globalCriteriaCalculate', modalRoot);

        var nCoreDocumentAttributes = {
          author_id: document.querySelector('#nCoreDocumentAuthor').dataset.userId,
          provider_id: document.querySelector('#nCoreDocumentAuthor').dataset.providerId,
          name: data.elements.nCoreName.value,
          description: data.elements.nCoreDescription.value,
          periodStart: data.elements.nCorePeriodStart.value,
          periodEnd: data.elements.nCorePeriodEnd.value,
          datetime: new Date().getTime(),
          query: nCore.document.cellQuery() || '',
          body: Base64.encode($('#paper').froalaEditor('html.get') /* на случай если мы сразу говорим сохранить */),
          globalQuery: nCore.document.globalQuery(),
          globalQueryData : JSON.stringify( nCore.document.globalQueryData() )
        };

        nCore.document.setTitle(       data.elements.nCoreName.value );
        nCore.document.setPeriodEnd(   data.elements.nCorePeriodEnd.value );
        nCore.document.setPeriodStart( data.elements.nCorePeriodStart.value );

        nCore.document.setYearReport(  data.elements.yearReport.checked );
        nCore.document.setCompare(     data.elements.compare.value );
        nCore.document.setMain(        data.elements.main.value );

        nCoreDocumentAttributes.yearReport = nCore.document.yearReport();
        nCoreDocumentAttributes.main       = nCore.document.main();
        nCoreDocumentAttributes.compare    = nCore.document.compare();

        nCoreDocumentAttributes.description = modalRoot.querySelector("[name='nCoreDescription']").value;
        nCoreDocumentAttributes.name        = modalRoot.querySelector("[name='nCoreName']").value;

        html2canvas( document.querySelector('div#paper') , {
          onrendered: function(canvas) {

            var nCoreDocumentAttributes = {
              author_id: document.querySelector('#nCoreDocumentAuthor').dataset.userId,
              provider_id: document.querySelector('#nCoreDocumentAuthor').dataset.providerId,
              type: nCore.document.type(),
              description: modalRoot.querySelector("[name='nCoreDescription']").value,
              name:        modalRoot.querySelector("[name='nCoreName']").value,
              datetime: new Date().getTime(),
              body: Base64.encode($('#paper').froalaEditor('html.get')+'&nbsp;'),
              query: nCore.document.cellQuery() || '',
              periodStart: nCore.document.periodStart(),
              periodEnd: nCore.document.periodEnd(),
              globalQuery: nCore.document.globalQuery(),
              image: canvas.toDataURL(),
              globalQueryData : JSON.stringify( nCore.document.globalQueryData() )
            };

            if ( nCore.document.yearReport() ) {
              nCoreDocumentAttributes.yearReport = nCore.document.yearReport();
              nCoreDocumentAttributes.main       = nCore.document.main();
              nCoreDocumentAttributes.compare    = nCore.document.compare();
            }

            nCore.document.setAttributes(nCoreDocumentAttributes);

            nCore.query.put('documents/' + nCore.document.id() + '.json', nCoreDocumentAttributes)
              .success(function (data) {
                console.log('saveDocument', data);
                if (location.hash.match(/new/) !== null) {
                  location.hash = location.hash.replace(/new/, data._id);
                };
              }).error(function (data) {
                console.error('[!] saveDocument', post, data)
              });
          }
        });
    }
  });

  // сохранение документа
  nCore.document.root.subscribe('saveDocument', function (data) {
    console.log('saveDocument');
    // проверяем, не шаблон ли это?
    if ( nCore.document.getTemplate() ) {
      console.log('try to edit template: ', nCore.document.getTemplate );
      nCore.document.root.publish('tryToEditTemplate');
    } else {
      if (nCore.document.isNewDocument()) {
        nCore.document.root.publish('newDocument');
      }
      else {
        nCore.document.root.publish('saveDocumentToDb');
      }
    }
  });

  nCore.document.root.subscribe('tryToEditTemplate', function (data) {
    console.log('tryToEditTemplate');

    mui.overlay('on');
    var options   = {
      'keyboard': false, // teardown when <esc> key is pressed (default: true)
      'static': true, // maintain overlay when clicked (default: false)
      'onclose': function () {
      }
    };
    var render = Transparency.render(document.getElementById('tryToEditTemplate'), {
      errorMessage: "Вы пытаетесь редактировать шаблон!",
      details: "Будет создан новый файл с именем",
      filename : ( document.querySelector('#nCoreDocumentAuthor').textContent + ' - ' + nCore.document.title() ),
      cancel: "Отмена",
      save: "Сохранить"
    });

    var m = document.createElement('div');
    m.style.width = '800px';
    m.style.height = '200px';
    m.style.margin = '10% auto';
    m.style.padding = '10% auto';
    m.style.backgroundColor = '#fff';
    m.classList.toggle('mui-panel');
    m.classList.toggle('mui--z5');

    m.classList.toggle('animated');
    m.classList.toggle('fadeIn');
    
    m.innerHTML = render.innerHTML;

    mui.overlay('on', options, m );

  });
  nCore.document.root.subscribe('tryToSaveFromTemplate', function () {
    html2canvas( document.querySelector('div#paper') , {
      onrendered: function(canvas) {

        var nCoreDocumentAttributes = {
          author_id: document.querySelector('#nCoreDocumentAuthor').dataset.userId,
          provider_id: document.querySelector('#nCoreDocumentAuthor').dataset.providerId,
          type: nCore.document.type(),
          title: document.querySelector('#nCoreDocumentAuthor').textContent.replace(/[\r\n\s+]/, '') + ' - ' + nCore.document.title(),
          name: document.querySelector('#nCoreDocumentAuthor').textContent.replace(/[\r\n\s+]/, '') + ' - ' + nCore.document.title(),
          description: document.querySelector('#nCoreDocumentAuthor').textContent.replace(/[\r\n\s+]/, '') + ' - ' + nCore.document.title(),
          datetime: new Date().getTime(),
          body:  Base64.encode($('#paper').froalaEditor('html.get')+'&nbsp;'),
          query: nCore.document.cellQuery() || '',
          periodStart: nCore.document.periodStart(),
          periodEnd: nCore.document.periodEnd(),
          globalQuery: nCore.document.globalQuery(),
          image: canvas.toDataURL(),
          globalQueryData : JSON.stringify( nCore.document.globalQueryData() )
        };

        if ( nCore.document.yearReport() ) {
          nCoreDocumentAttributes.yearReport = nCore.document.yearReport();
          nCoreDocumentAttributes.main       = nCore.document.main();
          nCoreDocumentAttributes.compare    = nCore.document.compare();
        }

        nCore.document.setAttributes(nCoreDocumentAttributes);

        nCore.query.post('documents.json', nCoreDocumentAttributes)
          .success(function (data) {
            console.log('saveDocument', data);
              location.hash = location.hash.replace(/#\/report\/\w+/, '#/report/'+data._id);
          }).error(function (data) {
            console.error('[!] saveDocument', post, data)
          });
      }
    });
  });


  nCore.document.root.subscribe('saveDocumentToDb', function (data) {
    console.log('data: ', data);
    // nCore.modules.table.event.publish('globalCriteriaCalculate');

    // если передеали значения из формы
    if (data && data.nodeName === 'FORM') {

      nCore.document.setName(data.elements.nCoreDocumnetName.value);
      nCore.document.setDescription(data.elements.nCoreDocumnetDescription.value);
    };

    // если документ новый - показываем модальное окошко с вводом имени
    if (data && data.nodeName == 'FORM') {


      html2canvas( document.querySelector('div#paper') , {
        onrendered: function(canvas) {

          console.log('saveDocument', data);
          nCore.document.root.publish('newDocument', true);

          if (document.getElementById('mui-overlay')) {
            mui.overlay('off');
          };

          // считаем табличку перед сохранением
          // $.FroalaEditor.COMMANDS.calculator.callback()
          var nCoreDocumentAttributes = {
            author_id: document.querySelector('#nCoreDocumentAuthor').dataset.userId,
            provider_id: document.querySelector('#nCoreDocumentAuthor').dataset.providerId,
            type: nCore.document.type(),
            name: nCore.document.name(),
            description: nCore.document.description(),
            datetime: new Date().getTime(),
            body: Base64.encode($('#paper').froalaEditor('html.get')+'&nbsp;'),
            query: nCore.document.cellQuery() || '',
            periodStart: nCore.document.periodStart(),
            periodEnd: nCore.document.periodEnd(),
            globalQuery: nCore.document.globalQuery(),
            image: canvas.toDataURL(),
            globalQueryData : JSON.stringify( nCore.document.globalQueryData() )
          };

          if ( nCore.document.yearReport() ) {
            nCoreDocumentAttributes.yearReport = nCore.document.yearReport();
            nCoreDocumentAttributes.main       = nCore.document.main();
            nCoreDocumentAttributes.compare    = nCore.document.compare();
          }

          nCore.document.setAttributes(nCoreDocumentAttributes);
          console.log(nCoreDocumentAttributes);

          nCore.query.post('documents.json', nCoreDocumentAttributes)
            .success(function (data) {
              console.log('newDocument', data);

              if (location.hash.match(/new/) !== null) {
                location.hash = location.hash.replace(/new/, data._id);
              };

            }).error(function (data) {
              console.error('[!] newDocument', post, data)
            });
        }
      });

    }
    else {
      html2canvas( document.querySelector('div#paper') , {
        onrendered: function(canvas) {

          var nCoreDocumentAttributes = {
            author_id: document.querySelector('#nCoreDocumentAuthor').dataset.userId,
            provider_id: document.querySelector('#nCoreDocumentAuthor').dataset.providerId,
            type: nCore.document.type(),
            name: nCore.document.name(),
            description: nCore.document.description(),
            datetime: new Date().getTime(),
            body: Base64.encode($('#paper').froalaEditor('html.get')+'&nbsp;'),
            query: nCore.document.cellQuery() || '',
            periodStart: nCore.document.periodStart(),
            periodEnd: nCore.document.periodEnd(),
            globalQuery: nCore.document.globalQuery(),
            image: canvas.toDataURL(),
            globalQueryData : JSON.stringify( nCore.document.globalQueryData() )
          };

          if ( nCore.document.yearReport() ) {
            nCoreDocumentAttributes.yearReport = nCore.document.yearReport();
            nCoreDocumentAttributes.main       = nCore.document.main();
            nCoreDocumentAttributes.compare    = nCore.document.compare();
          }

          nCore.document.setAttributes(nCoreDocumentAttributes);

          nCore.query.put('documents/' + nCore.document.id() + '.json', nCoreDocumentAttributes)
            .success(function (data) {
              console.log('saveDocument', data);
              if (location.hash.match(/new/) !== null) {
                location.hash = location.hash.replace(/new/, data._id);
              };
            }).error(function (data) {
              console.error('[!] saveDocument', post, data)
            });
        }
      });
    }
  });
  // изменение свойств документа
  nCore.document.root.subscribe('setDocumentAttributes', function (data) {
    console.log('[main] setDocumentAttributes:', data);
    var author = document.getElementById('nCoreDocumentAuthor');
  });

  nCore.document.root.subscribe('generateNewDocument', function () {
    nCore.document.generateNew();
  });

  // [NEW] изменение свойств документа
  nCore.document.root.subscribe('initEditor', function (body) {
    console.groupCollapsed('initEditor', !!body);
    var BODY = body;
    try{
      $('div#paper').froalaEditor('destroy');
    }catch(e){
      console.log(e);
    }
    var initialize = new Promise(function(resolve, reject) {
      // выполняем асинхронный код
      var editor = $('div#paper').froalaEditor({
        toolbarButtons:   ['file-o', 'floppy-o', 'adjust', 'phone',  'textRotate', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', /*'formatOL'*/, 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', /*'cog', 'rotateDocument' */, 'customCalculationCell'/*, '|', 'zoom-out', 'zoom-in'*/ ],
        toolbarButtonsMD: ['file-o', 'floppy-o', 'adjust', 'phone',  'textRotate', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', /*'formatOL'*/, 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', /*'cog', 'rotateDocument' */, 'customCalculationCell'/*, '|', 'zoom-out', 'zoom-in'*/ ],
        toolbarButtonsSM: ['file-o', 'floppy-o', 'adjust', 'phone',  'textRotate', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', /*'formatOL'*/, 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', /*'cog', 'rotateDocument' */, 'customCalculationCell'/*, '|', 'zoom-out', 'zoom-in'*/ ],
        toolbarButtonsXS: ['file-o', 'floppy-o', 'adjust', 'phone',  'textRotate', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', /*'formatOL'*/, 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', /*'cog', 'rotateDocument' */, 'customCalculationCell'/*, '|', 'zoom-out', 'zoom-in'*/ ],
        language: 'ru',
        charCounterCount: false,
        toolbarSticky: false,
        // toolbarInline: true,
        shortcutsEnabled: ['copyDataCell', 'pasteDataCell']
      });
      $('div#paper').on('froalaEditor.click', function (e, editor, clickEvent) {
        console.log( 'click', editor, clickEvent );
      });
      $('div#paper').on('froalaEditor.commands.before', function (e, editor, cmd, param1, param2) {
        console.log( 'command', e, editor, cmd, param1, param2 );
      });
      
      resolve(editor);
    });

    initialize.then(function(editor) {
      console.log('document loaded', editor);
      $('div#paper').trigger('click');

      var globalEditor;

      editor.on('froalaEditor.initialized', function (e, editor) {
        console.log('e, editor', editor);
        globalEditor = editor;
        // скрываем unregister version
        if (document.querySelector('.fr-wrapper').nextSibling && document.querySelector('.fr-wrapper').nextSibling.nodeName == 'DIV' && document.querySelector('.fr-wrapper').nextSibling.textContent == 'Unlicensed Froala Editor') {
          document.querySelector('.fr-wrapper').nextSibling.textContent = '';
        }
      });

      $('div#paper').froalaEditor('html.set', (BODY ? BODY : '<p>') + '<p>');
      return globalEditor;
    }).then(function(editor) {
      console.log('e, editor', editor);
      

      var parent = document.querySelector('.fr-wrapper').parentNode;
      parent.removeChild( document.querySelector('.fr-wrapper').nextSibling ) ;
      return editor;
    }).then(function(editor){

      // клонируем менюху
      var menu = document.querySelector('.fr-toolbar.fr-ltr.fr-desktop.fr-top.fr-basic');

      var clone = menu.cloneNode(true);

      clone.classList.add('cloned');

      var paperBar = document.querySelector('#paperBar');
      paperBar.innerHTML = '';

      paperBar.appendChild(clone);

      menu.classList.add('mui--hide');
      return editor;
    }).then(function(editor){
      console.log('editor', editor);
      return true;
    }).catch(function(result) {
      console.log("ERROR!", result);
    });
    console.groupEnd();
  });

  // изменение типа документа
  nCore.document.root.subscribe('setDocumentType', function (type) {
    nCore.document.setType(type);
  });

  nCore.document.root.subscribe('go', function (url) {
    location.hash = "#" + url;
  });

  nCore.document.root.subscribe('loadDocument',
    function (id, callback) {
      console.groupCollapsed('Loading document');
      nCore.document.root.publish('populateChosenOrigin');

      var overlayEl = mui.overlay('on'),

      options = {
        'keyboard': false, // teardown when <esc> key is pressed (default: true)
        'static': true, // maintain overlay when clicked (default: false)
        'onclose': function () {
          // after callback
        }
      };
      // initialize with child element
      var m = document.createElement('div');
      m.style.width = '400px';
      m.style.height = '100px';
      m.style.margin = '10% auto';
      m.style.padding = '10% auto';
      m.style.backgroundColor = '#fff';
      m.classList.toggle('mui-panel');
      m.classList.toggle('mui--z5');
      m.innerHTML = '<h4>Загрузка документа</h4><div class="loader"></div>';

      var overlay = mui.overlay('on', options, m);
    overlay.classList.toggle('animated');
    overlay.classList.toggle('fadeIn');

      var load = new Promise(function(resolve, reject) {
        // выполняем асинхронный код
        nCore.query.get('documents/' + id + '.json', { id: id }).success(function (rawDocument) {
          console.log('***raw', rawDocument);
          console.groupEnd();
          
          setTimeout(function () {
            mui.overlay('off');
          }, 1000);

          resolve( rawDocument ) 
        }).error(function (data) {
          mui.overlay('off');
          nCore.document.root.publish('nCoreDocumentFailedToLoad');
          console.error('[!] loadDocument -> get', data)
          reject(data);
        });
      });

      load.then(function(rawDocument) {
        nCore.document.load(rawDocument);
        nCore.document.setPeriodEnd(rawDocument.periodEnd);
        nCore.document.setPeriodStart(rawDocument.periodStart);
        nCore.document.setGlobalQuery(rawDocument.globalQuery);
        nCore.document.setGlobalQueryData(rawDocument.globalQueryData ? rawDocument.globalQueryData : '{}');
        nCore.document.setTitle(rawDocument.name);
        nCore.document.setYearReport(rawDocument.yearReport );
        nCore.document.setMain(rawDocument.main );
        nCore.document.setCompare(rawDocument.compare );
        nCore.document.setTemplate(rawDocument.template );


        callback && typeof (callback) === 'function' ? callback.call(this, rawDocument) : false;
        return rawDocument
      }).then(function(result) {
        // var editor = nCore.document.root.publish('initEditor');
        console.log("allDone!", result);
      }).catch(function(result) {
        console.log("ERROR!", result);
      });

    },
    // before callback
    function (data) {
    },
    // after callback
    function (data) {
    }
  );

  // создание нового документа
  nCore.document.root.subscribe('createNewDocument', function (type) {
    var documentType = nCore.document.type() || type;
    console.log('setDocumentType', documentType);
    nCore.document.setType(documentType);
    nCore.document.reset();

    var overlayEl = mui.overlay('on');

    // set overlay options
    var options = {
      'keyboard': false, // teardown when <esc> key is pressed (default: true)
      'static': true, // maintain overlay when clicked (default: false)
      'onclose': function () {
        // after callback
      }
    };
    // initialize with child element
    var m = document.createElement('div');
    m.style.width = '400px';
    m.style.height = '100px';
    m.style.margin = '10% auto';
    m.style.padding = '10% auto';
    m.style.backgroundColor = '#fff';
    m.classList.toggle('mui-panel');
    m.classList.toggle('mui--z5');
    m.innerHTML = '<h4>Создание нового документа</h4><div class="loader"></div>';

    var overlay = mui.overlay('on', options, m);
    overlay.classList.toggle('animated');
    overlay.classList.toggle('fadeIn');
    
    var render = new Promise(function(resolve, reject) {
      // выполняем асинхронный код
      setTimeout(function () {
        mui.overlay('off');
        document.body.classList.add('hide-sidedrawer');
        nCore.document.root.publish('generateNewDocument');;
        location.hash = "#" + documentType + "/new";
      }, 1000);
      var error = false;

      error == false ? resolve('rendered!') :reject('error');
    });

    render.then(function(data) {
      return data;
    }).then(function(result) {
      console.log("allDone!", result);
    });
  
  });

  nCore.document.root.subscribe('attachListMenu', function (type) {
    nCore.menu.attach('.mui-panel.indexListView', '.menu'); // new Menu().add();
  });


  /////////////////////
  // События рендера //
  /////////////////////
  ///
  nCore.document.root.subscribe('deleteReport', function(element){
    var id   = element.type,
        root = $(element).closest(".document");

    console.log('deleteReport', id, element, root);

    nCore.query.post('documents/' + id + '/remove', { id: id })
    .success(function (rawDocument) {
      console.log('***deleteReport', root, rawDocument);
      root.addClass('animatedSlow');
      root.addClass('fadeOut');
      setTimeout(function (){ root.detach(); }, 400);

    }).error(function (data) {
      mui.overlay('off');
      console.error('[!] deleteReport -> get', data)
    });
  });

  // изменяем тип отображения
  nCore.document.root.subscribe('changeRenderType', function (type) {
    nCore.storage.setItem('indexViewType', type);
    nCore.document.root.publish('renderIndexView', type);
  });

  nCore.document.root.subscribe('populateChosenOrigin', function(){
    var chosenOrigin = document.querySelector('[name="chosenOrigin"]'),
        criteriaKeys = JSON.parse( nCore.storage.criteriaKeys );;

    for ( var q = 0; q < criteriaKeys.length; q++ ) {
      chosenOrigin.appendChild( new Option( criteriaKeys[q].name, criteriaKeys[q].value ) );
    };
  });
  
  nCore.document.root.subscribe('nCoreDocumentFailedToLoad', function (type) {

    var overlayEl = mui.overlay('on'),
        options   = {
          'keyboard': false, // teardown when <esc> key is pressed (default: true)
          'static': true, // maintain overlay when clicked (default: false)
          'onclose': function () {
            // after callback
          }
        };
    var render = Transparency.render(document.getElementById('nCoreDocumentFailedToLoad'), {
      errorMessage: 'Произошла ошибка во время загрузки документа',
      back: "Назад",
      reload: "Обновить"
    });

    var m = document.createElement('div');
    m.style.width = '800px';
    m.style.height = '200px';
    m.style.margin = '10% auto';
    m.style.padding = '10% auto';
    m.style.backgroundColor = '#fff';
    m.classList.toggle('mui-panel');
    m.classList.toggle('mui--z5');
    
    m.innerHTML = render.innerHTML;

    mui.overlay('on', options, m );
  });

  nCore.document.root.subscribe('routeFailedToLoad', function (type) {

    var overlayEl = mui.overlay('on'),
        options   = {
          'keyboard': false, // teardown when <esc> key is pressed (default: true)
          'static': true, // maintain overlay when clicked (default: false)
          'onclose': function () {
            // after callback
          }
        };
    var render = Transparency.render(document.getElementById('routeFailedToLoad'), {
      errorMessage: 'Произошла ошибка во время работы приложения',
      back: "Назад",
      reload: "Обновить"
    });

    var m = document.createElement('div');
    m.style.width = '800px';
    m.style.height = '200px';
    m.style.margin = '10% auto';
    m.style.padding = '10% auto';
    m.style.backgroundColor = '#fff';
    m.classList.toggle('mui-panel');
    m.classList.toggle('mui--z5');
    
    m.innerHTML = render.innerHTML;

    mui.overlay('on', options, m );
  });

  nCore.document.root.subscribe('renderIndexView', function (type) {
   
   function addOverlay() {
      setTimeout( function(){
        var overlayEl = mui.overlay('on'),

        options = {
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
      }, 300);
    };
    
    function removeOverlay() {
      setTimeout( function(){
        mui.overlay('off');
      },300)
    };

    var render = new Promise(function(resolve, reject) {
      addOverlay();
      
      setTimeout(function(){
        document.getElementById('thumb').classList.add('mui--hide');

        // если не был выбран вариант отображения страницы
        if (!nCore.storage.hasOwnProperty('indexViewType')) {
          nCore.storage.setItem('indexViewType', 'thumb');
        };

        // сколько раз проверяем 
        // var reload_count = 2;

        if ( nCore.storage.hasOwnProperty( type ) && JSON.parse( nCore.storage.getItem(type) ).length || JSON.parse(nCore.storage.getItem('templates')).length ) {
          // console.log('storage: ', items);



          ///////////////////////////////
          // РАЗБИВКА ПО ДАТАМ ГОТОВАЯ //
          ///////////////////////////////
          ///
          // var new_items = items.sort(function(a,b) {
          //     return new Date(a.params.created_at) - new Date(b.params.created_at);
          // });
          // сортируем по датам и выводим по дням
          // var document_date = '',
          //     document_date_raw,
          //     document_array = [],
          //     __result = [];

          // var helper = {
          //   documents: {
          //     documentTitle: {
          //       text: function (params) {
          //         console.log('params:',this, params);
          //         return this.params.name || '---';
          //       }
          //     },
          //     documentDate: {
          //       text: function (params) {
          //         console.log('type=list', nCore.storage.getItem('indexViewType') === 'list');
          //         return new Date( this.params.updated_at ).toLocaleString('ru-RU', nCore.storage.getItem('indexViewType') === 'list' ? { 
          //           year  : 'numeric',
          //           month : 'numeric',
          //           day   : 'numeric'
          //         } : {
          //           year   : 'numeric',
          //           month  : 'numeric',
          //           day    : 'numeric',
          //           hour   : 'numeric',
          //           minute : 'numeric'

          //         });
          //       }
          //     },
          //     documentId: {
          //       href: function (params) {
          //         return "#/report/" + this.params._id || Math.random();
          //       },
          //       text: function () {
          //         return ''
          //       }
          //     },
          //     downloadDoc: {
          //       href: function (params) {
          //         return "/" + type + "/" + (this.params._id || Math.random()) + "/download";
          //       }
          //     },
          //     downloadPdf: {
          //       href: function (params) {
          //         return "documents/" + this.params._id + ".pdf";
          //       }
          //     },
          //     removeDocument: {
          //       href: function (params) {
          //         return location.hash;
          //       },
          //       type: function () {
          //         return this.params._id
          //       }
          //     },
          //     documentUser: {
          //       text: function () {
          //         return this.params.user
          //       }
          //     },
          //     documentImage: {
          //       src: function(params){
          //         return ( this.image.length ? this.image : 'assets/img/doc.png' )
          //       }
          //     },
          //     groupTitle: {
          //       text: function () {
          //         return 'Шаблоны'
          //       }
          //     }
          //   }
          // };

          // for (var q = 0; q < new_items.length; q++) {
          //   var doc = new_items[q];
          //   if ( document_date != new Date( doc.params.created_at ).getDate() ) {
              
          //     if ( document_array.length ) {
                
          //       console.log('RENDER:',document_array );

          //       // рендерим за день 
          //       var render = Transparency.render( document.getElementById( nCore.storage.getItem('indexViewType') ), {
          //         date: document_date_raw.toLocaleString().split(',')[0],
          //         documents: document_array
          //       },
          //       helper ).innerHTML;

          //       console.log('-', render);

          //       __result.push ( render );
          //       // }, helper);

          //       document_array = [];
          //     }
          //     document_date     = new Date( doc.params.created_at ).getDate()
          //     document_date_raw = new Date( doc.params.created_at )
          //     document_array.push( doc )
              
          //     console.log( 'New Day: ', document_date_raw.toLocaleString() );
              
          //   } else {
          //     document_array.push( doc )
          //   }
            
          //   // console.log('document_date', document_date.toLocaleString(), document_date.getDate(), document_date.getMonth() );
          // }
          // document.getElementById(nCore.storage.getItem('indexViewType')).innerHTML = '';
          // document.getElementById(nCore.storage.getItem('indexViewType')).innerHTML = __result.join('');
          // 
          // 
          

          
          if ( JSON.parse(nCore.storage.getItem('templates')).length ) {
            var helperTemplate = {
              documentTitle: {
                text: function (params) {
                  // console.log(this);

                  return this.params.name || '---';
                }
              },
              documentDate: {
                text: function (params) {
                  // console.log('type=list', nCore.storage.getItem('indexViewType') === 'list');
                  return new Date( this.params.updated_at ).toLocaleString('ru-RU', nCore.storage.getItem('indexViewType') === 'list' ? { 
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
                  return "#/report/" + this.params._id || Math.random();
                },
                text: function () {
                  return ''
                }
              },
              downloadDoc: {
                href: function (params) {
                  return "/" + type + "/" + (this.params._id || Math.random()) + "/download";
                }
              },
              downloadPdf: {
                href: function (params) {
                  return "documents/" + this.params._id + ".pdf";
                }
              },
              downloadXls: {
                href: function (params) {
                  return "documents/" + this.params._id + ".xlsx";
                }
              },
              removeDocument: {
                href: function (params) {
                  return location.hash;
                },
                type: function () {
                  return this.params._id
                }
              },
              documentUser: {
                text: function () {
                  return this.params.user
                }
              },
              documentImage: {
                src: function(params){
                  return ( this.image.length ? this.image : 'assets/img/doc.png' )
                }
              },
              groupTitle: {
                text: function () {
                  return 'Шаблоны'
                }
              }
            };
            
            var templates = JSON.parse(nCore.storage.getItem('templates'));
            Transparency.render( document.querySelector('#template'), templates, helperTemplate );

            console.log('templates.length');
            
            var _mui_rows = document.querySelector('.mui-row._indexViewTemplate'),
            _active_row = document.querySelector('._indexViewTemplate');

            for (var i = 0; i < _mui_rows.length; i++) {
              _mui_rows[i].classList.add('mui--hide')
            }

            if (_active_row) {
              _active_row.classList.remove('mui--hide');
            };
          }

          if ( JSON.parse(nCore.storage.getItem(type)).length ) {
            var helper = {
              documentTitle: {
                text: function (params) {
                  return this.params.name || '---';
                }
              },
              documentDate: {
                text: function (params) {
                  // console.log('type=list', nCore.storage.getItem('indexViewType') === 'list');
                  return new Date( this.params.updated_at ).toLocaleString('ru-RU', nCore.storage.getItem('indexViewType') === 'list' ? { 
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
                  return "#/report/" + this.params._id || Math.random();
                },
                text: function () {
                  return ''
                }
              },
              downloadDoc: {
                href: function (params) {
                  return "/" + type + "/" + (this.params._id || Math.random()) + "/download";
                }
              },
              downloadPdf: {
                href: function (params) {
                  return "documents/" + this.params._id + ".pdf";
                }
              },
              downloadXls: {
                href: function (params) {
                  return "documents/" + this.params._id + ".xlsx";
                }
              },
              removeDocument: {
                href: function (params) {
                  return location.hash;
                },
                type: function () {
                  return this.params._id
                }
              },
              documentUser: {
                text: function () {
                  return this.params.user
                }
              },
              documentImage: {
                src: function(params){
                  return ( this.image.length ? this.image : 'assets/img/doc.png' )
                }
              },
              groupTitle: {
                text: function () {
                  return 'Шаблоны'
                }
              }
            };

            var items = JSON.parse(nCore.storage.getItem(type));
            Transparency.render(document.getElementById(nCore.storage.getItem('indexViewType')), items, helper);

            document.body.classList.add('hide-sidedrawer');
            document.getElementById('thumb').classList.remove('mui--hide')

            var _mui_rows = document.getElementsByClassName('mui-row _indexView'),
              _active_row = document.querySelector('._indexView.' + nCore.storage.getItem('indexViewType'));

            for (var i = 0; i < _mui_rows.length; i++) {
              _mui_rows[i].classList.add('mui--hide')
            }

            if (_active_row) {
              _active_row.classList.remove('mui--hide');
            };
          }
          resolve(true)
        } else {
          reject(false)
        };
      }, 1000); 
    });

    render.then(function(data) {
      removeOverlay()
    }).catch(function(result) {
      console.log("ERROR renderCellSettings!", result);
    });
  });

  nCore.document.root.subscribe('renderNotPermit', function (data) {
    Transparency.render(document.getElementById('content-wrapper'), { 'textBad': 'Operation not permited' });
  });

  // проверяем что показывать
  nCore.document.root.subscribe('onRouteChange', function (data) {
    console.groupCollapsed('onRouteChange');
    console.log('params: ', data);
    console.groupEnd();
  });

  /////////////////////////
  // Cобытия для таблицы //
  /////////////////////////

  // создание критериев поиска
  nCore.document.root.subscribe('generateQuery', function (data) {

    var data = {
      message: 'Отчет начал считаться.',
      timeout: 2000
      // actionHandler: function(){},
      // actionText: 'Отмена'
    };

    var _tables = document.querySelectorAll('.fr-element.fr-view > table'),
        _cells  = document.querySelectorAll('.calculationCell');

    if ( _tables.length || _cells.length ) {
      console.log( '_tables', _tables.length );
      // отправляем считаться и отправляем
      nCore.modules.table.factory.execute();
    } else {
      var data = {
        message: 'Нечего расчитывать',
        timeout: 2000
        // actionHandler: function(){},
        // actionText: 'Отмена'
      };
    }
    nCore.snackbar.showSnackbar(data);
  });

  // расчёт критериев поиска и отправление их на сервер
  nCore.modules.table.event.subscribe('calculateQuery', function (data) {
    console.log('data: ', data);

    nCore.query.post('queries.json', data).success(function (data) {
      nCore.modules.table.event.publish('insertCellData', data);
    }).error(function (data) {
      console.error('[!] calculateQuery -> post', data);

      var data = {
        message: `Ошибка! [${data.status}] ${data.statusText}`,
        timeout: 2000,
        actionHandler: function(){},
        actionText: ':('
      };
      nCore.snackbar.showSnackbar(data);
    });
  });
  
  // вставка данных в таблицу
  nCore.modules.table.event.subscribe('insertCellData', function (data) {
    console.log('insertCellData', data);


    nCore.modules.table.populate( data.tables );
    nCore.modules.customCell.populate( data.customCells );
    
    var message = {
      message: 'Отчет построен.',
      timeout: 2000
    };
    
    var snack = new nCore.snackbar();
    snack.showSnackbar(message);
    
    nCore.modules.table.event.publish('calculateFormula');

  });

  nCore.modules.table.event.subscribe('calculateFormula', function () {
    nCore.modules.formula.calculate();
  });

  // выбор активной ячейки
  nCore.modules.table.event.subscribe('cellSelect', function (cell) {

    console.groupCollapsed("cellSelect");
    console.dirxml('params: ', cell);

    nCore.document.setShowCellSettings( true )
    var tab     = document.getElementsByClassName('criteriaSelector')[0], cellQuery;
    var formula = document.getElementById('formulaGroupTab');

    activeCell = cell;
    nCore.modules.table.setActive(activeCell);

    tab.textContent = '';
    var __elements_to_update = [], criteriaCondition;
    var overlayTab, overlayFormula;

    function addOverlay() {
      setTimeout( function(){
        overlayTab = document.createElement('div');
        overlayTab.style.top        = '50px';
        overlayTab.style.height     = '94%';
        overlayTab.style.width      = '100%';
        overlayTab.style.overflow   = 'hidden';
        overlayTab.style.position   = 'absolute';
        overlayTab.style.background = 'rgba(255,255,255, .9)';
        overlayTab.style.zIndex    = '2';

        overlayTab.innerHTML = '<div style="top: 50%; left: 50%;text-align: center; position: absolute;height: 100%;text-align: center;"><i class="fa fa-spinner fa-spin fa-2x"></i></div>'
        overlayFormula = overlayTab.cloneNode(true);
        
        tab.appendChild( overlayTab );
        formula.appendChild( overlayFormula );
      }, 100);
    };
    function removeOverlay() {

      overlayTab.classList.add('animatedSlow');
      overlayTab.classList.add('fadeOut');

      setTimeout( function(){

        overlayFormula.classList.add('animatedSlow');
        overlayFormula.classList.add('fadeOut');
        
        formula.removeChild( overlayFormula );
        if ( overlayTab ) {
          console.log('overlayTab',overlayTab, tab );
          tab.removeChild( overlayTab );
        }

      },300)
    };

    var render = new Promise(function(resolve, reject) {
      addOverlay();
      setTimeout(function(){
        if (activeCell) {
        
          if ( activeCell.dataset.hasOwnProperty('query') ) {
            
            try {
              var queryArray = JSON.parse(activeCell.dataset.query);
            } catch (e){
              reject(false);
            };

            var queryArray = JSON.parse(activeCell.dataset.query),
              _selectedIindex = -1;
            
            
            for (var z = 0; z < queryArray.length; z++) {
              console.groupCollapsed("query");

              var group = queryArray[z],
                groupConditions = group.conditions,
                criterias = group.query;


              var _groupTemplate = document.getElementsByClassName('criteriaSelectorGroupTemplate')[0],
                groupTemplate = _groupTemplate.cloneNode(true),
                groupSelectCondition = groupTemplate.getElementsByTagName('select')[0];

              if (groupConditions) {
                for (var v = 0; v < groupSelectCondition.options.length; v++) {
                  // console.log('groupSelectCondition', groupSelectCondition);
                  if (groupSelectCondition[v].value === groupConditions) {
                    _selectedIindex = v;
                    break;
                  }

                }

                groupTemplate.getElementsByClassName('connectionGroup')[0].classList.remove('mui--hide');
              }

              var _group = groupTemplate;
              groupSelectCondition = _group.getElementsByTagName('select')[0].selectedIndex = _selectedIindex;

              _group.classList.remove('criteriaSelectorGroupTemplate');
              _group.classList.remove('mui--hide');
              tab.appendChild(_group);

              for (var b = 0; b < criterias.length; b++) {
                var _elements_to_update = [],
                  item = criterias[b],
                  list = groupTemplate.getElementsByClassName('criteriaSelectorGroupList')[0],
                  cardTemplate = document.getElementsByClassName('criteriaSelectorItemTemplate')[0];

                console.dirxml('criteria -> ', item);

                if (item.source == null && item.origin_name == null) {
                  activeCell.dataset.query = '[]';
                  continue;
                }

                var card = cardTemplate.cloneNode(true);
                card.classList.remove('criteriaSelectorItemTemplate');
                card.classList.remove('mui--hide');

                var form = card.getElementsByClassName('criteriaForm')[0];
                criteriaCondition = card.querySelector('select.itemSelectCondition');

                list.appendChild(card);

                if ( item.origin_name == 'formula' ) {
                  item.value = Base64.decode( item.value );
                }

                var sorted_hash = {};
                sorted_hash.criteria_condition = item.criteria_condition
                sorted_hash.source = item.source
                sorted_hash.origin_name = item.origin_name
                sorted_hash.conditions = item.conditions
                sorted_hash.value = item.value

                console.warn( '*********', item, sorted_hash );

                var render = new Promise(function(resolve, reject){
                  nCore.modules.cell.generateForm( sorted_hash, card )
                  resolve( [sorted_hash, card] )
                });
                
                render.then(function(data){
                  // card.querySelector('.criteriaSelectorItemName').textContent = card.querySelector('[name="source"]').options[ card.querySelector('[name="source"]').selectedIndex ].textContent;
                }).catch(function(error){
                  console.log(error)
                })


                var cr_c = card.querySelector('[name="criteria_condition_group"]');
                cr_c.value = item.criteria_condition;
                cr_c.selectedIndex = item.criteria_condition == 'and' ? 0 : 1;
              }
              console.groupEnd();
              document.querySelector('.firstTimeCriteria').classList.add('mui--hide');
            }
            // nCore.modules.tablee.vent.publish('newCellSettingsChange' );
          }
          else {
            document.querySelector('.firstTimeCriteria').classList.remove('mui--hide');
          }

          var monthSelector = document.querySelector('select[name="month"]');
          if ( monthSelector && parseInt(activeCell.dataset.queryMonth,10) ) {
            // console.log('++++', activeCell.dataset.queryMonth)
            monthSelector.value = activeCell.dataset.queryMonth;
            monthSelector.disabled = false;
          } else {
            if ( monthSelector ) {
              // console.log('----', activeCell.dataset)
              monthSelector.selectedIndex = 0;
              monthSelector.value = 1;
              monthSelector.disabled = true;
            };
          }

          var formulaSelector = document.querySelector('[name="formula"]');
          if ( formulaSelector && activeCell.dataset.formula ) {
            // console.log('++++', activeCell.dataset.formula)
            formulaSelector.value = activeCell.dataset.formula;
            formulaSelector.disabled = false;
          } else {
            if ( formulaSelector ) {
              // console.log('----', activeCell.dataset)
              formulaSelector.value = '';
              formulaSelector.disabled = true;
            };
          }

          var defaultSelector = document.querySelector('select[name="default"]');
          if ( defaultSelector && activeCell.dataset.queryDefault ) {
            // console.log('++++', activeCell.dataset.queryDefault)
            defaultSelector.value = activeCell.dataset.queryDefault;
            defaultSelector.disabled = false;
          } else {
            if ( defaultSelector ) {
              // console.log('----', activeCell.dataset)
              defaultSelector.selectedIndex = 0;
              defaultSelector.value = 'empty';
              defaultSelector.disabled = true;
            };
          }

          var chosenOrigin = document.querySelector('[name="chosenOrigin"]');
          if ( activeCell.dataset.chosenOrigin ) {
            // chosenOrigin.selectedIndex = -1;
            
            var array  = JSON.parse(activeCell.dataset.chosenOrigin),
                values = [];

            for (var r = 0; r < array.length; r++) {
              values.push( array[r].value );
            };
            // console.log('values', values);

            for ( var i = 0, l = chosenOrigin.options.length, o; i < l; i++ ){
              var o = chosenOrigin.options[i];

              if ( values.indexOf( o.value ) != -1 ) {
                o.selected = true;
              }
            }

            // chosenOrigin.value = values;
            chosenOrigin.disabled = false;
          } else {
            if ( chosenOrigin ) {
              // console.log('----', activeCell.dataset)
              // chosenOrigin.selectedIndex = null;
              chosenOrigin.value = null;
              chosenOrigin.disabled = true;
            };
          }
        };
        resolve(true)
      }, 200); 
    });

    render.then(function(data) {
      removeOverlay()
    }).catch(function(result) {
      console.log("ERROR renderCellSettings!", result);
    });

    // nCore.

    nCore.document.root.publish('showSideMenu', nCore.document.showCellSettings() );
    // nCore.modules.table.active().classList.add('active-selected-cell');

    console.groupEnd();
  });

  // показываем боковое меню по нажатию кнопки
  nCore.document.root.subscribe('showSideMenu', function(showCellSettings){
    document.getElementById('cellSettings').classList.add('active');
    document.querySelector('.AddDocument').classList.add('fadeOut');
    document.querySelector('.AddDocument').classList.remove('fadeIn');
  });

  // скрываем боковое меню по нажатию кнопки
  nCore.document.root.subscribe('hideSideMenu', function(showCellSettings){
    if ( !nCore.document.showCellSettings() && document.getElementById('cellSettings') ) {
      document.getElementById('cellSettings').classList.remove('active');
      document.querySelector('.AddDocument').classList.remove('fadeOut');
      document.querySelector('.AddDocument').classList.add('fadeIn');
    }
  });

  nCore.document.root.subscribe('globalCriteriaCalculate', function(body){
    
    // body = body || document.querySelector('._nCoreDocumentSettings');
    console.log( 'globalCriteriaCalculate', body );

    var _query       = [],
        result_query = [],
        criterias    = body.querySelectorAll('.criteriaSelectorItem');
    
    var data = [{
      query: []
    }];

    console.log('GLOBAL CRITERIAS', criterias);

    for (var i = 0; i < criterias.length; i++) {
      var criteria = criterias[i],
          head     = criteria.querySelector('.criteriaSelectorItemHeader'),
          form     = criteria.querySelector('.criteriaForm');

      var _dataQueryHash = {
        criteria_condition : head.querySelector('.criteriaSelectorItemOptions > .criteriaSelectorItemCondition').value,
        source             : form.querySelector('select[name="source"]').value,
        conditions         : form.querySelector('select[name="conditions"]').value,
        origin_name        : form.querySelector('select[name="origin_name"]').value,
        value              : form.querySelector('input[type="date"]') ?
        {
          periodStart : form.querySelector('input[name="date_start"]').value,
          periodEnd : form.querySelector('input[name="date_end"]').value
        } : ( form.querySelector('[name="value"]') ? form.querySelector('[name="value"]').value : '' )
      }

      if ( _dataQueryHash.origin_name == 'formula' ) {
        _dataQueryHash.value = Base64.encode( _dataQueryHash.value );
      }

      if ( nCore.document.yearReport() ) {
        _dataQueryHash.yearReport = {
          main: nCore.document.main(),
          compare: nCore.document.compare()
        }
      }

      data[0].query.push(_dataQueryHash);

      _query.push(data);
    };

    // for (var c = _query.length - 1; c >= 0; c--) {
    //   if (_query[c].query.length) {
    //     result_query.push(_query[c]);
    //   };
    // };

    console.log('GLOBAL QUERY:', result_query, _query);

    nCore.document.setGlobalQuery( JSON.stringify(data) )
  });

  nCore.modules.table.event.subscribe('cellFormulaChange', function () {
    var formulaSettings      = document.querySelector('.formulaSettings'),
        formulaSettingsItems = [].slice.call(formulaSettings.querySelectorAll('input'));
    
    // Обновляем все галки
    for (var v = 0; v < formulaSettingsItems.length; v++) {
      var checkbox = formulaSettingsItems[v];
      activeCell.dataset[checkbox.name] = checkbox.checked;
    };

    // обновляем галку с месяцами
    var monthSelector = formulaSettings.querySelector('[name="month"]');

    if ( activeCell.dataset.useMonth === 'true' ) {
      //console.log('activeCell.dataset.useMonth ++', activeCell.dataset);
      activeCell.dataset.queryMonth = monthSelector.value;
    } else {
      //console.log('activeCell.dataset.useMonth --', activeCell.dataset);
      delete activeCell.dataset.queryMonth
      monthSelector.selectedIndex = 0;
      monthSelector.disabled = true;
    }

    // обновляем галку с формулой
    var formulaSelector = document.querySelector('[name="formula"]');

    if ( activeCell.dataset.useFormula === 'true' ) {
      //console.log('activeCell.dataset.useFormula ++', activeCell.dataset);
      activeCell.dataset.formula = formulaSelector.value;
    } else {
      //console.log('activeCell.dataset.useFormula --', activeCell.dataset);
      delete activeCell.dataset.formula
      formulaSelector.value = '';
      formulaSelector.disabled = true;
    }

    // обновляем галку с дефолтным значением
    var defaultSelector = formulaSettings.querySelector('[name="default"]');

    if ( activeCell.dataset.useDefault === 'true' ) {
      //console.log('activeCell.dataset.useDefault ++', activeCell.dataset);
      activeCell.dataset.queryDefault = defaultSelector.value;
    } else {
      //console.log('activeCell.dataset.useDefault --', activeCell.dataset);
      delete activeCell.dataset.queryDefault
      defaultSelector.selectedIndex = 0;
      defaultSelector.disabled = true;
    }

    // обновляем источники
    var chosenOrigin = formulaSettings.querySelector('[name="chosenOrigin"]');

    if ( activeCell.dataset.useChosenOrigin === 'true' ) {
      var tmp_array = [];
      var origins = chosenOrigin.selectedOptions;
      for (var i = 0; i < origins.length; i++) {
        
        tmp_array.push({
          value: origins[i].value,
          name:  origins[i].name
        })
      };

      //console.log('activeCell.dataset.useChosenOrigin ++', chosenOrigin.selectedOptions);
      activeCell.dataset.useChosenOrigin = true;
      activeCell.dataset.chosenOrigin = JSON.stringify( tmp_array );
    } else {
      //console.log('activeCell.dataset.useChosenOrigin --', activeCell.dataset);
      delete activeCell.dataset.useChosenOrigin
      delete activeCell.dataset.chosenOrigin
      chosenOrigin.selectedIndex = 0;
      chosenOrigin.disabled = true;
    }

  });

  nCore.modules.table.event.subscribe('setMonth', function(){
    var monthSelector = document.querySelector('[name="month"]');
    console.log('set month', monthSelector.value);

    if ( activeCell.dataset.queryMonth ) {
      monthSelector.value = activeCell.dataset.queryMonth;
      monthSelector.disabled = false;
    } else {
      monthSelector.disabled = true;
      monthSelector.selectedIndex = 0;
      $('[name="useMonth"]').trigger('change')
    }
  });

  nCore.modules.table.event.subscribe('setDefault', function(){
    var defaultSelector = document.querySelector('[name="default"]');
    console.log('set default', defaultSelector.value);

    if ( activeCell.dataset.queryDefault ) {
      defaultSelector.value = activeCell.dataset.queryDefault;
      defaultSelector.disabled = false;
    } else {
      defaultSelector.disabled = true;
      defaultSelector.selectedIndex = 0;
      $('[name="useDefault"]').trigger('change')
    }
  });

  nCore.modules.table.event.subscribe('setChosenOrigin', function(){
    var chosenOrigin = document.querySelector('[name="chosenOrigin"]');
    console.log('set month', chosenOrigin.value);

    if ( activeCell.dataset.chosenOrigin ) {
      chosenOrigin.value = activeCell.dataset.chosenOrigin;
      chosenOrigin.disabled = false;
    } else {
      chosenOrigin.disabled = true;
      chosenOrigin.selectedIndex = 0;
      $('[name="useChosenOrigin"]').trigger('change')
    }
  });

  nCore.modules.table.event.subscribe('cellFormulaClear', function () {
    var formulaSettings = document.querySelector('.formulaSettings'),
      formulaSettingsItems = [].slice.call(formulaSettings.querySelectorAll('input'));
    for (var v = 0; v < formulaSettingsItems.length; v++) {
      var checkbox = formulaSettingsItems[v];
      checkbox.checked = activeCell.dataset[checkbox.name] === 'true' ? activeCell.dataset[checkbox.name] : null;
    };
  });

  nCore.modules.table.event.subscribe('newCellSettingsChange', function (NAME, URL) {
    console.groupCollapsed("newCellSettingsChange");
    
    var _query = [],
      list = document.querySelector(".criteriaSelector"),
      criterias = list.querySelectorAll('div');

    console.log(list, criterias);

    for (var i = 0; i < criterias.length; i++) {
      var criteria = $(criterias[i]),
        criteriaItemsRoot = criteria.children('.criteriaSelectorGroup'),
        criteriaItems = criteriaItemsRoot.children('.criteriaSelectorGroupList').children('.criteriaSelectorItem');

      var data = {
        query: [],
        conditions: criteria.children('.connectionGroup').children('select').val()
      };

      var criteriaItemQuery = {};



      for (var z = 0; z < criteriaItems.length; z++) {
        var item = $(criteriaItems[z]),
          head = item.children('.criteriaSelectorItemHeader'),
          form = item.children('.criteriaForm');

        console.log('ITEM', item );

        var _select = head[0].querySelector('.criteriaSelectorItemOptions > .criteriaSelectorItemCondition');

        var cellQuery = {
          criteria_condition : head.find('[name="criteria_condition_group"]').val(),
          source             : form.children('select[name="source"]').val(),
          conditions         : form.children('select[name="conditions"]').val(),
          origin_name        : form.children('select[name="origin_name"]').val(),
          value              : form.children('input[type="date"]').length ? {
            periodStart      : form.children('input[name="date_start"]').val(),
            periodEnd        : form.children('input[name="date_end"]').val()
          }                  : form.children('[name="value"]').val()
        };

        // var cr_c = card.querySelector('[name="criteria_condition_group"]');
        // cr_c.value = item.criteria_condition;
        // cr_c.selectedIndex = item.criteria_condition == 'and' ? 0 : 1;
        // head.find('[name="origin_name"]').trigger('change') 
        // head.find('[name="criteria_condition_group"]').trigger('change') 

        if ( cellQuery.origin_name == 'formula' ) {
          cellQuery.value = Base64.encode( cellQuery.value );
        }

        data.query.push( cellQuery );
      };

      _query.push(data);
    };
    // очищаем пустые группы перед добавлением в query
    var _result_query = [];
    for (var c = _query.length - 1; c >= 0; c--) {
      if (_query[c].query.length) {
        _result_query.push(_query[c]);
      };

      // фикс пустых клеток
      // console.log( _query[c].query.source == null );
    };

    if (activeCell) {
      activeCell.dataset.query = JSON.stringify(_result_query);
    };

    if (NAME) {
      activeCell.dataset.name = NAME
    };
    if (URL) {
      activeCell.dataset.url = URL
    };

    console.groupEnd();
  });


  ///////////////////
  // События юзера //
  ///////////////////
  // получаем права доступа юзера
  // nCore.user.event.subscribe('getUserPermissions', function(data){

  //   console.log('getUserPermissions');
  // });
  // // получаем список доков доступных юзеру
  // nCore.user.event.subscribe('getAvailableDocuments', function(data){

  //   console.log('getAvailableDocuments');
  // });

  ////////////////////////
  // События загрузчика //
  ////////////////////////


  // загружаем шаблоны
  nCore.document.root.subscribe('loadItem', function (items) {
    console.log('loadItem', items);

    function load(item) {
      nCore.query.get(item + '.json')
        .success(function (data) {
          console.log('loadData', data);
          if ( item == 'documents') {
            nCore.storage.setItem('documents', JSON.stringify(data.documents));
            nCore.storage.setItem('templates', JSON.stringify(data.templates));
          } else {
            nCore.storage.setItem(item + '', JSON.stringify(data));
          }
          
          nCore.document.root.publish(nCore.storage.getItem('indexViewType'));
        }).error(function (data) {
          console.error('[!] loadItem -> get', data);
        });
    };

    for (var z = 0; z < items.length; z++) {
      var item = items[z];
      console.log('ITEM', item);
      load(item);
    };
  });

  nCore.document.root.subscribe('loadCriteria', function (data) {
    // console.log('loadCriteria', data);

    // если уже есть загруженные справочники
    // то пока ничего не делаем
    // TODO: запилить синхронизацию
    // if (nCore.storage.hasOwnProperty('criteriaKeys')) {
    //   return true;
    // } else {
    nCore.query.get('sources.json').success(function (data) {
      for (var i = 0; i < data.length; i++) {
        var source = data[i];
        nCore.storage.setItem(source.type, JSON.stringify(source.data));
      }

      var keys = [];
      data.filter(function (v, i) {
        // console.log('filter', v, i);
        keys.push({
          value: v.type,
          name: v.name
        });
      });

      nCore.storage.setItem('criteriaKeys', JSON.stringify(keys));
    }).error(function (data) {
      console.error('[!] loadCriteria -> get', data)
    });
    // }
  });

  /////////////
  // Формула //
  /////////////
  
  nCore.document.root.subscribe('addFormulaField', function ( value) {
    var tab     = document.querySelector('.formulaSelectorGroupList'),
        formula = Transparency.render( document.querySelector('.nCoreDocumentFormulaField'), {});

    formula.classList.remove('mui--hide');

    console.log( 'tab, formula', tab, formula );
    tab.appendChild( formula );
  });

  nCore.document.root.subscribe('addToFormula', function ( cell ) {
    console.log('activeCell, cell', activeCell, cell);

    document.querySelector('[name="formula"]').value = activeCell.dataset.formula + ' #' + cell.id
    nCore.modules.table.event.publish('cellFormulaChange');
  });

})();
