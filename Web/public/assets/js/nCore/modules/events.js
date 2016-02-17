"use strict";

// модуль отвечающий за взаимодействие компонентов фреймворка

var nCore = nCore || {};
nCore.events = (function () {
  var init;
  var activeCell;

  // функция которая валидно обрабатывает юникод
  function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
  }

  init = function init() {

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
      m.style.width = '400px';
      m.style.height = '300px';
      m.style.margin = '10% auto';
      m.style.backgroundColor = '#fff';
      m.classList.toggle('mui-panel');
      m.classList.toggle('mui--z5');
      m.innerHTML = '<form onsubmit="nCore.document.root.publish(\'saveDocumentToDb\', this); return false;"><legend>Документ</legend><br><br><div class="mui-textfield mui-textfield--float-label"><input required name="nCoreDocumnetName"><label>Название</label></div><div class="mui-textfield mui-textfield--float-label"><input type=text required name="nCoreDocumnetDescription"><label>Описание</label></div><div class="mui--text-right"><button type=button onclick="mui.overlay(\'off\');" class="mui-btn mui-btn--raised mui-btn--danger">отмена</button><button type=submit class="mui-btn mui-btn--raised mui-btn--primary">сохранить</button></div></form>';

      mui.overlay('on', options, m);
    });

    nCore.document.root.subscribe('showDocumentSettings', function (data) {
      // set overlay options
      var options = {
        'keyboard': true, // teardown when <esc> key is pressed (default: true)
        'static': false, // maintain overlay when clicked (default: false)
        'onclose': function () {
          nCore.document.setShowSettings(false)
        }
      };

      var m = document.createElement('div');
      m.style.width = '800px';
      m.style.height = 'auto';
      m.style.margin = '10% auto';
      m.style.padding = '10% auto';
      m.style.backgroundColor = '#fff';
      m.classList.toggle('mui-panel');
      m.classList.toggle('mui--z5');

      nCore.document.setShowSettings(true)

      var text = Transparency.render(document.querySelector('.nCoreDocumentSettings'), {
        nCoreName        : nCore.document.name(),
        nCoreDescription : nCore.document.description(),
        nCorePeriodStart : nCore.document.periodStart(),
        nCorePeriodEnd   : nCore.document.periodEnd()
      });
      m.innerHTML = text.innerHTML;
      mui.overlay('on', options, m);
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

      mui.overlay('on', options, m);
    });

    nCore.document.root.subscribe('addGroupData', function (data) {
      console.log('addGroupData', data);
      nCore.modules.table.fromGroup(data);
    });

    // редактирование настроек документа
    nCore.document.root.subscribe('updateDocument', function (data, parent) {
      mui.overlay('off');
      console.log('update:', data, data.elements);

      nCore.document.root.publish('globalCriteriaCalculate', parent);

      var nCoreDocumentAttributes = {
        name: data.elements.nCoreName.value,
        description: data.elements.nCoreDescription.value,
        periodStart: data.elements.nCorePeriodStart.value,
        periodEnd: data.elements.nCorePeriodEnd.value,
        datetime: new Date().getTime(),
        query: nCore.document.cellQuery() || '',
        body: Base64.encode($('#paper').froalaEditor('html.get')),
      };
      nCore.document.setPeriodEnd(data.elements.nCorePeriodEnd.value);
      nCore.document.setPeriodStart(data.elements.nCorePeriodStart.value);
      nCore.document.setTitle(data.elements.nCoreName.value);

      nCore.query.put('documents/' + nCore.document.id() + '.json', nCoreDocumentAttributes)
        .success(function (data) {
          console.log('saveDocument', data);
          if (location.hash.match(/new/) !== null) {
            location.hash = location.hash.replace(/new/, data._id);
          };
        }).error(function (data) {
          console.error('[!] saveDocument', post, data)
        });
    });

    // сохранение документа
    nCore.document.root.subscribe('saveDocument', function (data) {
      console.log('saveDocument');

      if (nCore.document.isNewDocument()) {
        nCore.document.root.publish('newDocument');
      }
      else {
        nCore.document.root.publish('saveDocumentToDb');
      }
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
        console.log('saveDocument', data);
        nCore.document.root.publish('newDocument', true);

        if (document.getElementById('mui-overlay')) {
          mui.overlay('off');
        };

        // считаем табличку перед сохранением
        // $.FroalaEditor.COMMANDS.calculator.callback()
        var nCoreDocumentAttributes = {
          type: nCore.document.type(),
          name: nCore.document.name(),
          description: nCore.document.description(),
          datetime: new Date().getTime(),
          body: Base64.encode($('#paper').froalaEditor('html.get')),
          query: nCore.document.cellQuery() || '',
          periodStart: nCore.document.periodStart(),
          periodEnd: nCore.document.periodEnd(),
          globalQuery: nCore.document.globalQuery()
        };


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
      else {
        var nCoreDocumentAttributes = {
          type: nCore.document.type(),
          name: nCore.document.name(),
          description: nCore.document.description(),
          datetime: new Date().getTime(),
          body: Base64.encode($('#paper').froalaEditor('html.get')),
          query: nCore.document.cellQuery() || '',
          periodStart: nCore.document.periodStart(),
          periodEnd: nCore.document.periodEnd(),
          globalQuery: nCore.document.globalQuery()
        };

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
    // изменение свойств документа
    nCore.document.root.subscribe('setDocumentAttributes', function (data) {
      console.log('[main] setDocumentAttributes:', data);
      var author = document.getElementById('nCoreDocumentAuthor');
    });

    nCore.document.root.subscribe('generateNewDocument', function () {
      nCore.document.generateNew();
    });

    // [NEW] изменение свойств документа
    nCore.document.root.subscribe('initEditor', function (data) {
      console.groupCollapsed('initEditor');

      $('div#paper').on('froalaEditor.initialized', function (e, editor) {
        console.log('e, editor', e);

        // скрываем unregister version
        if (document.querySelector('.fr-wrapper').nextSibling && document.querySelector('.fr-wrapper').nextSibling.nodeName == 'DIV' && document.querySelector('.fr-wrapper').nextSibling.textContent == 'Unlicensed Froala Editor') {
          document.querySelector('.fr-wrapper').nextSibling.textContent = '';
        };

        var paper = $.FroalaEditor.INSTANCES[0].$original_element[0].querySelector('.fr-view');
        nCore.x = paper.getBoundingClientRect().left + 'px';
        nCore.y = paper.getBoundingClientRect().top + 'px';
      });

      $('div#paper').froalaEditor({
        toolbarButtons:   ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', 'cog', 'rotateDocument', '|', 'zoom-out', 'zoom-in'],
        toolbarButtonsMD: ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', 'cog', 'rotateDocument', '|', 'zoom-out', 'zoom-in'],
        toolbarButtonsSM: ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', 'cog', 'rotateDocument', '|', 'zoom-out', 'zoom-in'],
        toolbarButtonsXS: ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', 'cog', 'rotateDocument', '|', 'zoom-out', 'zoom-in'],
        language: 'ru',
        charCounterCount: false,
        toolbarSticky: false,
        shortcutsEnabled: ['copyDataCell', 'pasteDataCell']
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

        mui.overlay('on', options, m);

        nCore.query.get('documents/' + id + '.json', {
            id: id
          })
          .success(function (rawDocument) {
            console.log('***raw', rawDocument);
            console.groupEnd();
            setTimeout(function () {
              mui.overlay('off');
            }, 1000);

            nCore.document.load(rawDocument);
            nCore.document.setPeriodEnd(rawDocument.periodEnd);
            nCore.document.setPeriodStart(rawDocument.periodStart);
            nCore.document.setGlobalQuery(rawDocument.globalQuery);
            nCore.document.setTitle(rawDocument.name);

            callback && typeof (callback) === 'function' ? callback.call(this, rawDocument) : false;
          }).error(function (data) {
            mui.overlay('off');
            nCore.document.root.publish('nCoreDocumentFailedToLogin');
            console.error('[!] loadDocument -> get', data)
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

      mui.overlay('on', options, m);
      setTimeout(function () {
        mui.overlay('off');
        document.body.classList.add('hide-sidedrawer');
        nCore.document.root.publish('generateNewDocument');;
        location.hash = "#" + documentType + "/new";
      }, 1000);
    });

    nCore.document.root.subscribe('attachListMenu', function (type) {
      // console.log('attachListMenu', type);
      nCore.menu.attach('.mui-panel.indexListView', '.menu'); // new Menu().add();
    });


    /////////////////////
    // События рендера //
    /////////////////////
    ///
    nCore.document.root.subscribe('deleteReport', function(element){
      var id   = element.type,
          root = $(element).closest(".eachDocument");

      console.log('deleteReport', id, element, root);

      nCore.query.post('documents/' + id + '/remove', { id: id })
      .success(function (rawDocument) {
        console.log('***deleteReport', rawDocument);
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
    
    nCore.document.root.subscribe('nCoreDocumentFailedToLogin', function (type) {

      var overlayEl = mui.overlay('on'),
          options   = {
            'keyboard': false, // teardown when <esc> key is pressed (default: true)
            'static': true, // maintain overlay when clicked (default: false)
            'onclose': function () {
              // after callback
            }
          };
      var render = Transparency.render(document.getElementById('nCoreDocumentFailedToLogin'), {
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

    nCore.document.root.subscribe('renderIndexView', function (type) {

      document.getElementById('thumb').classList.add('mui--hide');
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

      mui.overlay('on', options, m);
      
      // если не был выбран вариант отображения страницы
      if (!nCore.storage.hasOwnProperty('indexViewType')) {
        nCore.storage.setItem('indexViewType', 'thumb');
      };

      // сколько раз проверяем 
      var reload_count = 2;

      var _i = setInterval( function(){
        reload_count--;
        console.log('renderIndexView -> ', type);

        if ( nCore.storage.hasOwnProperty( type ) && JSON.parse(nCore.storage.getItem(type)).length ) {
          var items = JSON.parse(nCore.storage.getItem(type));
          console.log('storage: ', items);

          var helper = {
            documentTitle: {
              text: function (params) {
                return this.name;
              }
            },
            documentDate: {
              text: function (params) {
                return this.date || new Date().toLocaleString();
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
            removeDocument: {
              href: function (params) {
                return location.hash;
              },
              type: function () {
                return this._id
              }
            },
            documentUser: {
              text: function () {
                return this.user
              }
            }
          };

          Transparency.render(document.getElementById(nCore.storage.getItem('indexViewType')), items, helper);

          mui.overlay('off');
          document.body.classList.add('hide-sidedrawer');
          nCore.document.root.publish('generateNewDocument');
          document.getElementById('thumb').classList.remove('mui--hide')

          var _mui_rows = document.getElementsByClassName('mui-row _indexView'),
            _active_row = document.getElementsByClassName('_indexView ' + nCore.storage.getItem('indexViewType'))[0];

          for (var i = 0; i < _mui_rows.length; i++) {
            _mui_rows[i].classList.add('mui--hide')
          }

          if (_active_row) {
            _active_row.classList.remove('mui--hide');
          };

          clearInterval(_i);
        };
        if (reload_count == 0) {
          clearInterval(_i);
          console.log('notFound');
          mui.overlay('off');
          Transparency.render(document.getElementById('noDocumentsFound'), {notFoundMessage: 'Пока нет документов'});
        };
      }, 1000);
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
    nCore.modules.table.event.subscribe('generateQuery', function (data) {
      var table = data.table,
        headClass = data.headClass,
        sideClass = data.sideClass;
      nCore.modules.table.tableQuery(table, headClass, sideClass);
    });

    // расчёт критериев поиска и отправление их на сервер
    nCore.modules.table.event.subscribe('calculateQuery', function (cellData) {
      nCore.document.setCellQuery(cellData);
      nCore.query.post('queries.json', {
        data: cellData,
        global: {
          periodStart: nCore.document.periodStart(),
          periodEnd: nCore.document.periodEnd(),
          providerId: document.querySelector('#nCoreDocumentAuthor').dataset.providerId,
          reportId:  nCore.document.id()
        }
      }).success(function (data) {
        nCore.modules.table.event.publish('insertCellData', data)
      }).error(function (data) {
        console.error('[!] calculateQuery -> post', data)
      });
    });
    // вставка данных в таблицу
    nCore.modules.table.event.subscribe('insertCellData', function (data) {
      console.log('insertCellData', data);
      var table = document.querySelector('.fr-element.fr-view > table');

      for (var i = 0; i < data.length; i++) {
        var cell = table.rows[data[i].rowIndex].cells[data[i].cellIndex];
        
        switch( typeof( data[i].value ) ){
          case 'object':
            console.log('value type: Object')
            
            // проверяем что за объект
            switch( data[i].value.constructor ){
              case Array:
                cell.textContent = data[i].value.join(', ');
                break;
              case Object:
                cell.textContent = JSON.stringify( data[i].value );
                break;
              case Date:
                cell.textContent = data[i].value;
                break;
              default:
                cell.textContent = data[i].value;
                break;
            };

            break;
          case 'string':
            console.log('value type: String')
            var test = Array(10).fill( data[i].value );
            var df = new DocumentFragment(),
                root = document.createElement('div');
                // root.style.border = '1px solid red';
            for (var s = 0; s < test.length; s++) {
              var el = document.createElement('div');
              el.style.borderTop  = '1px solid grey';
              el.style.display = 'block';
              el.style.width   = '100%';
              el.textContent = test[s];
              df.appendChild( el );
            };
            root.appendChild( df );
            cell.appendChild( root );
            break;
          case 'number':
            console.log('value type: Number')
            cell.textContent = data[i].value;
            break;
          default:
            console.error('value type: DEFAULT', data[i].value, typeof( data[i].value ) )
            cell.textContent = data[i].value;
            break;
        };
      }
    });
    
    // выбор активной ячейки
    nCore.modules.table.event.subscribe('cellSelect', function (cell) {
      
      console.groupCollapsed("cellSelect");
      console.dirxml('params: ', cell);

      var showCellSettings = true,
        tab = document.getElementsByClassName('criteriaSelector')[0],
        cellQuery;

      activeCell = cell;
      nCore.modules.table.setActive(activeCell);

      tab.textContent = '';
      var __elements_to_update = [],
        criteriaCondition;

      if (activeCell) {
        if (activeCell.dataset.hasOwnProperty('query')) {
          var queryArray = JSON.parse(activeCell.dataset.query),
            _selectedIindex = -1;
          for (var z = 0; z < queryArray.length; z++) {


            var group = queryArray[z],
              groupConditions = group.conditions,
              criterias = group.query;

            console.groupCollapsed("query");
            console.dir('criterias',  criterias);
            console.dir('conditions', groupConditions);

            var _groupTemplate = document.getElementsByClassName('criteriaSelectorGroupTemplate')[0],
              groupTemplate = _groupTemplate.cloneNode(true),
              groupSelectCondition = groupTemplate.getElementsByTagName('select')[0];

            if (groupConditions) {
              for (var v = 0; v < groupSelectCondition.options.length; v++) {
                console.log('groupSelectCondition', groupSelectCondition);
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

              nCore.modules.cell.generateBlock( item, form, 'source',             item.source );
              nCore.modules.cell.generateBlock( item, form, 'origin_name',        item.origin_name );
              nCore.modules.cell.generateBlock( item, form, 'conditions',         item.conditions );
              nCore.modules.cell.generateBlock( item, form, 'value',              item.value );

              var cr_c = card.querySelector('[name="criteria_condition_group"]');
              cr_c.value = item.criteria_condition;
              cr_c.selectedIndex = item.criteria_condition == 'and' ? 0 : 1;
            }
            console.groupEnd();
            document.querySelector('.firstTimeCriteria').classList.add('mui--hide');
          }
          nCore.modules.table.event.publish('newCellSettingsChange' );
        }
        else {
          document.querySelector('.firstTimeCriteria').classList.add('mui--hide');
        }

        var monthSelector = document.querySelector('select[name="month"]');
        if ( monthSelector && parseInt(activeCell.dataset.queryMonth,10) ) {
          console.log('++++', activeCell.dataset.queryMonth)
          monthSelector.value = activeCell.dataset.queryMonth;
          monthSelector.disabled = false;
        } else {
          if ( monthSelector ) {
            console.log('----', activeCell.dataset)
            monthSelector.selectedIndex = 0;
            monthSelector.value = 1;
            monthSelector.disabled = true;
          };
        }

        var defaultSelector = document.querySelector('select[name="default"]');
        if ( defaultSelector && activeCell.dataset.queryDefault ) {
          console.log('++++', activeCell.dataset.queryDefault)
          defaultSelector.value = activeCell.dataset.queryDefault;
          defaultSelector.disabled = false;
        } else {
          if ( defaultSelector ) {
            console.log('----', activeCell.dataset)
            defaultSelector.selectedIndex = 0;
            defaultSelector.value = 'empty';
            defaultSelector.disabled = true;
          };
        }

        var chosenOrigin = document.querySelector('[name="chosenOrigin"]');
        if ( activeCell.dataset.chosenOrigin ) {
          chosenOrigin.selectedIndex = -1;
          
          var array  = JSON.parse(activeCell.dataset.chosenOrigin),
              values = [];

          for (var r = 0; r < array.length; r++) {
            values.push( array[r].value );
          };
          console.log('values', values);

          for ( var i = 0, l = chosenOrigin.options.length, o; i < l; i++ ){
            var o = chosenOrigin.options[i];

            console.log( o.value, values.indexOf( o.value ) );
            if ( values.indexOf( o.value ) != -1 ) {
              o.selected = true;
            }
          }

          // chosenOrigin.value = values;
          chosenOrigin.disabled = false;
        } else {
          if ( chosenOrigin ) {
            console.log('----', activeCell.dataset)
            chosenOrigin.selectedIndex = 0;
            chosenOrigin.value = 0;
            chosenOrigin.disabled = true;
          };
        }

      };

      // показываем боковое меню по нажатию кнопки
      if (showCellSettings && !document.getElementById('cellSettings').classList.contains('active')) {
        document.getElementById('cellSettings').classList.toggle('active');
      }

      console.groupEnd();
      console.groupEnd();
    });

    nCore.document.root.subscribe('globalCriteriaCalculate', function(body){
      console.log( 'globalCriteriaCalculate', body );
      
      var _query       = [],
          result_query = [],
          criterias    = body.querySelectorAll('.criteriaSelectorItem');
      
      for (var i = 0; i < criterias.length; i++) {
        var criteria = criterias[i],
            head     = criteria.querySelector('.criteriaSelectorItemHeader'),
            form     = criteria.querySelector('.criteriaForm');
        var data = {
          query: []
        };
        
        data.query.push({
          criteria_condition : head.querySelector('.criteriaSelectorItemOptions > .criteriaSelectorItemCondition').value,
          source             : form.querySelector('select[name="source"]').value,
          conditions         : form.querySelector('select[name="conditions"]').value,
          origin_name        : form.querySelector('select[name="origin_name"]').value,
          value              : form.querySelector('input[type="date"]') ?
          {
            periodStart : form.querySelector('input[name="date_start"]').value,
            periodEnd : form.querySelector('input[name="date_end"]').value
          } : form.querySelector('[name="value"]').value
        });

        _query.push(data);
      };

      for (var c = _query.length - 1; c >= 0; c--) {
        if (_query[c].query.length) {
          result_query.push(_query[c]);
        };
      };

      console.log('GLOBAL QUERY:', result_query);

      nCore.document.setGlobalQuery( result_query )
    });

    nCore.modules.table.event.subscribe('cellFormulaChange', function () {
      var formulaSettings      = document.querySelector('.formulaSettings'),
          formulaSettingsItems = [].slice.call(formulaSettings.querySelectorAll('input'));
      
      for (var v = 0; v < formulaSettingsItems.length; v++) {
        var checkbox = formulaSettingsItems[v];
        activeCell.dataset[checkbox.name] = checkbox.checked;
      };

      // обновляем галку с месяцами
      var monthSelector = formulaSettings.querySelector('[name="month"]');

      // обновляем галку с дефолтным значением
      var defaultSelector = formulaSettings.querySelector('[name="default"]');

      // обновляем источники
      var chosenOrigin = formulaSettings.querySelector('[name="chosenOrigin"]');
      
      // если уже были значения в ячейке
      if ( activeCell.dataset.useMonth === 'true' ) {
        console.log('activeCell.dataset.useMonth ++', activeCell.dataset);
        activeCell.dataset.queryMonth = monthSelector.value;
      } else {
        console.log('activeCell.dataset.useMonth --', activeCell.dataset);
        delete activeCell.dataset.queryMonth
        monthSelector.selectedIndex = 0;
        monthSelector.disabled = true;
      }

      if ( activeCell.dataset.useDefault === 'true' ) {
        console.log('activeCell.dataset.useDefault ++', activeCell.dataset);
        activeCell.dataset.queryDefault = defaultSelector.value;
      } else {
        console.log('activeCell.dataset.useDefault --', activeCell.dataset);
        delete activeCell.dataset.queryDefault
        defaultSelector.selectedIndex = 0;
        defaultSelector.disabled = true;
      }

      if ( activeCell.dataset.useChosenOrigin === 'true' ) {
        var tmp_array = [];
        var origins = chosenOrigin.selectedOptions;
        for (var i = 0; i < origins.length; i++) {
          
          tmp_array.push({
            value: origins[i].value,
            name:  origins[i].name
          })
        };

        console.log('activeCell.dataset.useChosenOrigin ++', chosenOrigin.selectedOptions);
        activeCell.dataset.useChosenOrigin = true;
        activeCell.dataset.chosenOrigin = JSON.stringify( tmp_array );
      } else {
        console.log('activeCell.dataset.useChosenOrigin --', activeCell.dataset);
        delete activeCell.dataset.useChosenOrigin
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

          var _select = head[0].querySelector('.criteriaSelectorItemOptions > .criteriaSelectorItemCondition');

          data.query.push({
            criteria_condition : head.children('.criteriaSelectorItemOptions').children('.criteriaSelectorItemCondition')[0].value,
            source             : form.children('select[name="source"]').val(),
            conditions         : form.children('select[name="conditions"]').val(),
            origin_name        : form.children('select[name="origin_name"]').val(),
            value              : form.children('input[type="date"]').length ? {
            periodStart        : form.children('input[name="date_start"]').val(),
            periodEnd          : form.children('input[name="date_end"]').val()
            }                  : form.children('[name="value"]').val()
          });
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
            nCore.storage.setItem(item + '', JSON.stringify(data));
            nCore.document.root.publish(nCore.storage.getItem('indexViewType'));
          }).error(function (data) {
            console.error('[!] loadItem -> get', data)
          });
      };

      for (var z = 0; z < items.length; z++) {
        var item = items[z];
        // console.log('ITEM', item);
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
  };

  return {
    init: init,
  };
})();
