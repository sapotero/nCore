"use strict";
// модуль отвечающий за взаимодействие компонентов фреймворка

var nCore = nCore || {};
nCore.events = (function () {
  // var init;
  // var nCore.modules.table.active;


  ///////////////////////
  // Cобытия документа //
  ///////////////////////


  // новый документ
  nCore.document.event.subscribe('newDocument', function () {
    nCore.dialog.newDocument();
  });

  nCore.document.event.subscribe('showDocumentSettings', function (data) {
    nCore.dialog.showSettings();
  });

  nCore.document.event.subscribe('showGroupModal', function (data) {
    nCore.dialog.showGroup();
  });

  nCore.document.event.subscribe('addGroupData', function (data) {
    // console.log('addGroupData', data);
    nCore.modules.table.fromGroup(data);
  });

  // редактирование настроек документа
  nCore.document.event.subscribe('updateDocument', function (rootNode) {
    nCore.document.update( rootNode );
  });

  // сохранение документа
  nCore.document.event.subscribe('saveDocument', function (data) {
    console.log('saveDocument sub');
    // проверяем, не шаблон ли это?
    if ( nCore.document.template ) {
      console.log('try to edit template: ', nCore.document.template );
      nCore.document.event.publish('tryToEditTemplate');
    } else {
      if (nCore.document.isNew ) {
        nCore.document.event.publish('newDocument');
      }
      else {
        nCore.document.event.publish('saveDocumentToDb');
      }
    }
  });

  nCore.document.event.subscribe('tryToEditTemplate', function () {
    nCore.dialog.editTemplate();
  });


  nCore.document.event.subscribe('tryToSaveFromTemplate', function () {
    nCore.document.create();
  });


  nCore.document.event.subscribe('saveDocumentToDb', function (data) {
    console.log('data++: ', data);
    // если передеали значения из формы
    // если документ новый - показываем модальное окошко с вводом имени
    if (data && data.nodeName == 'FORM') {
      nCore.document.setAttributes( data );
      nCore.document.create();
    }
    else {
      nCore.document.update();
    }
  });

  nCore.document.event.subscribe('generateNewDocument', function () {
    nCore.document.new();
  });

  // [NEW] изменение свойств документа
  nCore.document.event.subscribe('initEditor', function (body) {
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
        nCore.core.hightlightCell();
      });
      // $('div#paper').on('froalaEditor.commands.before', function (e, editor, cmd, param1, param2) {
      //   console.log( 'command', e, editor, cmd, param1, param2 );
      // });
      
      resolve(editor);
    });

    initialize.then(function(editor) {
      console.log('document loaded', editor);
      $('div#paper').trigger('click');

      var globalEditor;

      editor.on('froalaEditor.initialized', function (e, editor) {
        // console.log('e, editor', editor);
        globalEditor = editor;
        // скрываем unregister version
        if (document.querySelector('.fr-wrapper').nextSibling && document.querySelector('.fr-wrapper').nextSibling.nodeName == 'DIV' && document.querySelector('.fr-wrapper').nextSibling.textContent == 'Unlicensed Froala Editor') {
          document.querySelector('.fr-wrapper').nextSibling.textContent = '';
        }
      });

      $('div#paper').froalaEditor('html.set', (BODY ? BODY : '<p>') + '<p>');
      return globalEditor;
    }).then(function(editor) {
      // console.log('e, editor', editor);
      

      var parent = document.querySelector('.fr-wrapper').parentNode;
      parent.removeChild( document.querySelector('.fr-wrapper').nextSibling ) ;
      return editor;
    }).then(function(editor){

      // клонируем менюху
      // var menu = document.querySelector('.fr-toolbar.fr-ltr.fr-desktop.fr-top.fr-basic');

      // var clone = menu.cloneNode(true);

      // clone.classList.add('cloned');

      // var paperBar = document.querySelector('#paperBar');
      // paperBar.innerHTML = '';

      // paperBar.appendChild(clone);

      // menu.classList.add('mui--hide');
      // return editor;
    }).then(function(editor){
      console.log('editor', editor);
      return true;
    }).catch(function(result) {
      console.log("ERROR!", result);
    });
    console.groupEnd();
  });

  // изменение типа документа
  // nCore.document.event.subscribe('setDocumentType', function (type) {
  //   nCore.document.type = type;
  // });

  nCore.document.event.subscribe('go', function (url) {
    location.hash = "#" + url;
  });

  nCore.document.event.subscribe('loadDocument', function (id, callback) {
      console.groupCollapsed('Loading document');

      var load = new Promise(function(resolve, reject) {
        var overlayEl = mui.overlay('on'),

        options = {
          'keyboard': false, // teardown when <esc> key is pressed (default: true)
          'static': true, // maintain overlay when clicked (default: false)
          'onclose': function () {}
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

        // выполняем асинхронный код
        nCore.query.get('documents/' + id + '.json', { id: id }).success(function (rawDocument) {
          console.log('***raw', rawDocument);
          console.groupEnd();
          
          setTimeout(function () {
            mui.overlay('off');
          }, 1000);

          resolve( rawDocument );
        }).error(function (data) {
          mui.overlay('off');
          nCore.document.event.publish('nCoreDocumentFailedToLoad');
          console.error('[!] loadDocument -> get', data);
          reject(data);
        });
      });

      load.then(function(rawDocument) {
        nCore.document.load( rawDocument );
        nCore.document.periodEnd       = rawDocument.periodEnd;
        nCore.document.periodStart     = rawDocument.periodStart;
        nCore.document.globalQuery     = rawDocument.globalQuery;
        nCore.document.globalQueryData = rawDocument.globalQueryData ? rawDocument.globalQueryData : '{}';
        nCore.document.title           = rawDocument.name;
        nCore.document.yearReport      = rawDocument.yearReport;
        nCore.document.setMain         = rawDocument.main;
        nCore.document.compare         = rawDocument.compare;
        nCore.document.template        = rawDocument.template;

        nCore.document.windowTitle( rawDocument.name );

        nCore.document.event.publish('populateChosenOrigin');

        callback && typeof (callback) === 'function' ? callback.call(this, rawDocument) : false;
        return rawDocument;
      }).then(function(result) {
        // var editor = nCore.document.event.publish('initEditor');
        console.log("allDone!", result);
      }).catch(function(result) {
        console.log("ERROR!", result);
      });
    },
    // before callback
    function () {
    },
    // after callback
    function () {
    }
  );

  // создание нового документа
  nCore.document.event.subscribe('createNewDocument', function (type) {
    nCore.dialog.createNew(type);
  });

  nCore.document.event.subscribe('attachListMenu', function (type) {
    nCore.menu.attach('.mui-panel.indexListView', '.menu');
  });


  /////////////////////
  // События рендера //
  /////////////////////
  ///
  nCore.document.event.subscribe('deleteReport', function(element){
    nCore.document.delete( element );
  });

  // изменяем тип отображения
  nCore.document.event.subscribe('changeRenderType', function (type) {
    nCore.storage.setItem('indexViewType', type);
    nCore.document.event.publish('renderIndexView', type);
  });

  nCore.document.event.subscribe('populateChosenOrigin', function(){
    var chosenOrigin = document.querySelector('[name="chosenOrigin"]'),
        criteriaKeys = JSON.parse( nCore.storage.criteriaKeys );

    for ( var q = 0; q < criteriaKeys.length; q++ ) {
      chosenOrigin.appendChild( new Option( criteriaKeys[q].name, criteriaKeys[q].value ) );
    };
  });
  
  nCore.document.event.subscribe('nCoreDocumentFailedToLoad', function () {
    nCore.dialog.loadFailed();
  });

  nCore.document.event.subscribe('routeFailedToLoad', function () {
    nCore.dialog.applicationError();
  });

  nCore.document.event.subscribe('renderIndexView', function () {
    nCore.grid.render();
  });

  nCore.document.event.subscribe('renderNotPermit', function (data) {
    nCore.dilaog.notPermit();
  });

  // проверяем что показывать
  nCore.document.event.subscribe('onRouteChange', function (data) {
    console.groupCollapsed('onRouteChange');
    console.log('params: ', data);
    console.groupEnd();
  });

  /////////////////////////
  // Cобытия для таблицы //
  /////////////////////////

  // создание критериев поиска
  nCore.document.event.subscribe('generateQuery', function (data) {

    var data = {
      message: 'Отчет начал считаться.',
      timeout: 2000
    };

    var _tables = document.querySelectorAll('.fr-element.fr-view > table'),
        _cells  = document.querySelectorAll('.calculationCell');

    if ( _tables.length || _cells.length ) {
      nCore.modules.table.factory.execute();
      nCore.modules.formula.calculate();
    } else {
      var data = {
        message: 'Нечего расчитывать',
        timeout: 2000
      };
    }
    nCore.snackbar.showSnackbar(data);
  });

  // расчёт критериев поиска и отправление их на сервер
  nCore.modules.table.event.subscribe('calculateQuery', function (data) {
    console.log('data: ', JSON.parse(JSON.stringify( data ))  );

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

    var publish = new Promise(function(resolve, reject){
      console.log('insertCellData', data);
      if (data) {
        try{
          nCore.modules.table.factory.populate( data.tables );
          nCore.modules.customCell.populate( data.customCells );
          resolve(true);
        } catch (error){
          reject(error);
        }
      } else {
        reject( new Error('NO DATA') );
      }
    });

    publish.then(function(){
      var message = {
        message: 'Отчет построен.',
        timeout: 2000
      };
      nCore.snackbar.showSnackbar(message);
      nCore.modules.table.event.publish('calculateFormula');
    }).catch(function(error){
      console.log('error', error);
    });
  });

  nCore.modules.table.event.subscribe('calculateFormula', function () {
    nCore.modules.formula.calculate();
  });

  // выбор активной ячейки
  nCore.modules.table.event.subscribe('cellSelect', function (cell) {

    // console.groupCollapsed("cellSelect");
    // console.dirxml('params: ', cell);

    nCore.document.showCellSettings = true;
    var tab     = document.getElementsByClassName('criteriaSelector')[0], cellQuery;
    var formula = document.getElementById('formulaGroupTab');

    nCore.modules.table.active = cell;

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
          // console.log('overlayTab',overlayTab, tab );
          tab.removeChild( overlayTab );
        }

      },300)
    };

    var render = new Promise(function(resolve, reject) {
      addOverlay();
      setTimeout(function(){
        if (nCore.modules.table.active) {
        
          if ( nCore.modules.table.active.dataset.hasOwnProperty('query') ) {
            
            try {
              var queryArray = JSON.parse(nCore.modules.table.active.dataset.query);
            } catch (e){
              reject(false);
            };

            var queryArray = JSON.parse(nCore.modules.table.active.dataset.query),
              _selectedIindex = -1;
            
            
            for (var z = 0; z < queryArray.length; z++) {
              // console.groupCollapsed("query");

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

                // console.dirxml('criteria -> ', item);

                if (item.source == null && item.origin_name == null) {
                  nCore.modules.table.active.dataset.query = '[]';
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

                // console.warn( '*********', item, sorted_hash );

                var render = new Promise(function(resolve, reject){
                  nCore.modules.cell.generateForm( sorted_hash, card )
                  resolve( [sorted_hash, card] )
                });
                
                render.then(function(data){
                }).catch(function(error){
                  console.log(error)
                })
                card.querySelector('.criteriaSelectorItemName').textContent = card.querySelector('[name="source"]').options[ card.querySelector('[name="source"]').selectedIndex ].textContent;


                var cr_c = card.querySelector('[name="criteria_condition_group"]');
                cr_c.value = item.criteria_condition;
                cr_c.selectedIndex = item.criteria_condition == 'and' ? 0 : 1;
              }
              // console.groupEnd();
              document.querySelector('.firstTimeCriteria').classList.add('mui--hide');
            }
            // nCore.modules.tablee.vent.publish('newCellSettingsChange' );
          }
          else {
            document.querySelector('.firstTimeCriteria').classList.remove('mui--hide');
          }

          var monthSelector = document.querySelector('select[name="month"]');
          if ( monthSelector && parseInt(nCore.modules.table.active.dataset.queryMonth,10) ) {
            // console.log('++++', nCore.modules.table.active.dataset.queryMonth)
            monthSelector.value = nCore.modules.table.active.dataset.queryMonth;
            monthSelector.disabled = false;
          } else {
            if ( monthSelector ) {
              // console.log('----', nCore.modules.table.active.dataset)
              monthSelector.selectedIndex = 0;
              monthSelector.value = 1;
              monthSelector.disabled = true;
            };
          }

          var formulaSelector = document.querySelector('[name="formula"]');
          if ( formulaSelector && nCore.modules.table.active.dataset.formula ) {
            // console.log('++++', nCore.modules.table.active.dataset.formula)
            formulaSelector.value = nCore.modules.table.active.dataset.formula;
            formulaSelector.disabled = false;
          } else {
            if ( formulaSelector ) {
              // console.log('----', nCore.modules.table.active.dataset)
              formulaSelector.value = '';
              formulaSelector.disabled = true;
            };
          }

          var defaultSelector = document.querySelector('select[name="default"]');
          if ( defaultSelector && nCore.modules.table.active.dataset.queryDefault ) {
            // console.log('++++', nCore.modules.table.active.dataset.queryDefault)
            defaultSelector.value = nCore.modules.table.active.dataset.queryDefault;
            defaultSelector.disabled = false;
          } else {
            if ( defaultSelector ) {
              // console.log('----', nCore.modules.table.active.dataset)
              defaultSelector.selectedIndex = 0;
              defaultSelector.value = 'empty';
              defaultSelector.disabled = true;
            };
          }

          var chosenOrigin = document.querySelector('[name="chosenOrigin"]');
          if ( nCore.modules.table.active.dataset.chosenOrigin ) {
            // chosenOrigin.selectedIndex = -1;
            
            var array  = JSON.parse(nCore.modules.table.active.dataset.chosenOrigin),
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
              // console.log('----', nCore.modules.table.active.dataset)
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

    nCore.document.event.publish('showSideMenu', nCore.document.showCellSettings );
    console.groupEnd();
  });

  // показываем боковое меню по нажатию кнопки
  nCore.document.event.subscribe('showSideMenu', function(showCellSettings){
    try{
      document.querySelector('#cellSettings').classList.add('active');
      document.querySelector('.AddDocument').classList.add('fadeOut');
      document.querySelector('.AddDocument').classList.remove('fadeIn');
    } catch(e){
      throw new Error(e);
    }
  });

  // скрываем боковое меню по нажатию кнопки
  nCore.document.event.subscribe('hideSideMenu', function(showCellSettings){
    try{
      document.querySelector('#cellSettings').classList.remove('active');
      document.querySelector('.AddDocument').classList.remove('fadeOut');
      document.querySelector('.AddDocument').classList.add('fadeIn');
    } catch(e){
      throw new Error(e);
    }
  });

  nCore.document.event.subscribe('globalCriteriaCalculate', function(body){
    
    body = body || document.querySelector('._nCoreDocumentSettings');
    // console.log( 'globalCriteriaCalculate', body );

    var _query       = [],
        result_query = [],
        criterias    = body.querySelectorAll('.criteriaSelectorItem');
    
    var data = [{
      query: []
    }];

    // console.log('GLOBAL CRITERIAS', criterias);

    for (var i = 0; i < criterias.length; i++) {
      var criteria = criterias[i],
          head     = criteria.querySelector('.criteriaSelectorItemHeader'),
          form     = criteria.querySelector('.criteriaForm');

      var _dataQueryHash = {
        criteria_condition : head.querySelector('.criteriaSelectorItemOptions > .criteriaSelectorItemCondition').value,
        source             : form.querySelector('select[name="source"]').value,
        conditions         : form.querySelector('select[name="conditions"]').value,
        origin_name        : form.querySelector('select[name="origin_name"]').value,
      }

      if ( form.querySelector('input[type="date"]') ) {

        if ( form.querySelector('input[name="date_end"]') ) {
          _dataQueryHash.value = {
            periodStart : form.querySelector('input[name="date_start"]').value,
            periodEnd : form.querySelector('input[name="date_end"]').value
          }
        } else {
          _dataQueryHash.value = form.querySelector('input[type="date"]')
        }
      }
      if ( form.querySelector('[name="value"]') ) {
        _dataQueryHash.value = form.querySelector('[name="value"]').value ? form.querySelector('[name="value"]').value : ''
      }

      if ( _dataQueryHash.origin_name == 'formula' ) {
        _dataQueryHash.value = Base64.encode( _dataQueryHash.value );
      }

      if ( nCore.document.yearReport ) {
        _dataQueryHash.yearReport = {
          main: nCore.document.main,
          compare: nCore.document.compare
        }
      }

      data[0].query.push(_dataQueryHash);

      _query.push(data);
    };
    // console.log('GLOBAL QUERY:', result_query, _query);

    nCore.document.globalQuery =  JSON.stringify(data);
  });

  nCore.modules.table.event.subscribe('cellFormulaChange', function () {
    var formulaSettings      = document.querySelector('.formulaSettings'),
        formulaSettingsItems = [].slice.call(formulaSettings.querySelectorAll('input'));
    
    // Обновляем все галки
    for (var v = 0; v < formulaSettingsItems.length; v++) {
      var checkbox = formulaSettingsItems[v];
      nCore.modules.table.active.dataset[checkbox.name] = checkbox.checked;
    };

    // обновляем галку с месяцами
    var monthSelector = formulaSettings.querySelector('[name="month"]');

    if ( nCore.modules.table.active.dataset.useMonth === 'true' ) {
      //console.log('nCore.modules.table.active.dataset.useMonth ++', nCore.modules.table.active.dataset);
      nCore.modules.table.active.dataset.queryMonth = monthSelector.value;
    } else {
      //console.log('nCore.modules.table.active.dataset.useMonth --', nCore.modules.table.active.dataset);
      delete nCore.modules.table.active.dataset.queryMonth
      monthSelector.selectedIndex = 0;
      monthSelector.disabled = true;
    }

    // обновляем галку с формулой
    var formulaSelector = document.querySelector('[name="formula"]');

    if ( nCore.modules.table.active.dataset.useFormula === 'true' ) {
      //console.log('nCore.modules.table.active.dataset.useFormula ++', nCore.modules.table.active.dataset);
      nCore.modules.table.active.dataset.formula = formulaSelector.value;
    } else {
      //console.log('nCore.modules.table.active.dataset.useFormula --', nCore.modules.table.active.dataset);
      delete nCore.modules.table.active.dataset.formula
      formulaSelector.value = '';
      formulaSelector.disabled = true;
    }

    // обновляем галку с дефолтным значением
    var defaultSelector = formulaSettings.querySelector('[name="default"]');

    if ( nCore.modules.table.active.dataset.useDefault === 'true' ) {
      //console.log('nCore.modules.table.active.dataset.useDefault ++', nCore.modules.table.active.dataset);
      nCore.modules.table.active.dataset.queryDefault = defaultSelector.value;
    } else {
      //console.log('nCore.modules.table.active.dataset.useDefault --', nCore.modules.table.active.dataset);
      delete nCore.modules.table.active.dataset.queryDefault
      defaultSelector.selectedIndex = 0;
      defaultSelector.disabled = true;
    }

    // обновляем источники
    var chosenOrigin = formulaSettings.querySelector('[name="chosenOrigin"]');

    if ( nCore.modules.table.active.dataset.useChosenOrigin === 'true' ) {
      var tmp_array = [];
      var origins = chosenOrigin.selectedOptions;
      for (var i = 0; i < origins.length; i++) {
        
        tmp_array.push( origins[i].value )
      };

      //console.log('nCore.modules.table.active.dataset.useChosenOrigin ++', chosenOrigin.selectedOptions);
      nCore.modules.table.active.dataset.useChosenOrigin = true;
      nCore.modules.table.active.dataset.chosenOrigin = JSON.stringify( tmp_array );
    } else {
      //console.log('nCore.modules.table.active.dataset.useChosenOrigin --', nCore.modules.table.active.dataset);
      delete nCore.modules.table.active.dataset.useChosenOrigin
      delete nCore.modules.table.active.dataset.chosenOrigin
      chosenOrigin.selectedIndex = 0;
      chosenOrigin.disabled = true;
    }
  });

  nCore.modules.table.event.subscribe('cellFormulaClear', function () {
    var formulaSettings = document.querySelector('.formulaSettings'),
      formulaSettingsItems = [].slice.call(formulaSettings.querySelectorAll('input'));
    for (var v = 0; v < formulaSettingsItems.length; v++) {
      var checkbox = formulaSettingsItems[v];
      checkbox.checked = nCore.modules.table.active.dataset[checkbox.name] === 'true' ? nCore.modules.table.active.dataset[checkbox.name] : null;
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
          origin_name        : form.children('select[name="origin_name"]').val()
        };

        var _form = form[0];
        if ( _form.querySelector('input[type="date"]') ) {

          if ( _form.querySelector('input[name="date_end"]') ) {
            cellQuery.value = {
              periodStart : _form.querySelector('input[name="date_start"]').value,
              periodEnd : _form.querySelector('input[name="date_end"]').value
            }
          } else {
            cellQuery.value = _form.querySelector('input[type="date"]')
          }
           

        }
        if ( _form.querySelector('[name="value"]') ) {
          cellQuery.value = _form.querySelector('[name="value"]').value ? _form.querySelector('[name="value"]').value : ''
        }
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

    if (nCore.modules.table.active) {
      nCore.modules.table.active.dataset.query = JSON.stringify(_result_query);
    };

    if (NAME) {
      nCore.modules.table.active.dataset.name = NAME
    };
    if (URL) {
      nCore.modules.table.active.dataset.url = URL
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

  nCore.document.event.subscribe('loadCriteria', function (data) {
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
  
  nCore.document.event.subscribe('addFormulaField', function ( value) {
    var tab     = document.querySelector('.formulaSelectorGroupList'),
        formula = Transparency.render( document.querySelector('.nCoreDocumentFormulaField'), {});

    formula.classList.remove('mui--hide');

    console.log( 'tab, formula', tab, formula );
    tab.appendChild( formula );
  });

  nCore.document.event.subscribe('addToFormula', function ( cell ) {
    console.log('nCore.modules.table.active, cell', nCore.modules.table.active, cell);

    document.querySelector('[name="formula"]').value = nCore.modules.table.active.dataset.formula + ' #' + cell.id
    nCore.modules.table.event.publish('cellFormulaChange');
  });

})();
