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
    nCore.document.root.subscribe('updateDocument', function (data) {
      mui.overlay('off');
      console.log('update:', data, data.elements);

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
          periodEnd: nCore.document.periodEnd()
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
          periodEnd: nCore.document.periodEnd()
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
        toolbarButtons:   ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', 'cog', '|', 'zoom-out', 'zoom-in'],
        toolbarButtonsMD: ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', 'cog', '|', 'zoom-out', 'zoom-in'],
        toolbarButtonsSM: ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo','cog', '|', 'zoom-out', 'zoom-in'],
        toolbarButtonsXS: ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo','cog', '|', 'zoom-out', 'zoom-in'],
        language: 'ru',
        charCounterCount: false,
        toolbarSticky: false,
        shortcutsEnabled: ['copyDataCell', 'pasteDataCell']
      });
      
      // прототип с масштабированием
      // $('.paperWrappers').on('mousemove', function(e) { 
      //   //if( e.which == 2 ) {
      //   // if(e.which === 1 && !false) e.which = 0;
      //   var paper = $.FroalaEditor.INSTANCES[0].$original_element[0].querySelector('.fr-view');
      //   nCore.w = paper;

      //   if( e.which == 2 ) {
      //     // e.preventDefault();
      //     console.log('middle button clicked', paper, nCore.x, nCore.y);
          
      //     // var dx = e.clientX - nCore.x;
      //     // var dy = e.clientY - nCore.y;
          
      //     var dx = e.clientX - nCore.x;
      //     var dy = e.clientY - nCore.y;
          
      //     nCore.x = e.clientX
      //     nCore.y = e.clientY

      //     console.log('**', dx, dy, e.clientX, e.clientY)

      //     // если nCore.x, nCore.y == 0 то пропускаем шаг
      //     paper.style.left  = (parseInt(paper.style.left, 10)  || 0) + dx + 'px';
      //     paper.style.top = (parseInt(paper.style.top, 10) || 0) + dy + 'px';
          
          
      //     // console.log('mouse', e.clientX, e.clientY, dx, dy);
      //   }
      // })
      // .on('mouseup', function(e) {
      //     var paper = $.FroalaEditor.INSTANCES[0].$original_element[0].querySelector('.fr-view');
      //     nCore.x = ( parseInt( paper.style.left,  10 ) || 0 ) + 'px';
      //     nCore.y = ( parseInt( paper.style.top, 10 ) || 0 ) + 'px';
      //     console.log('mouse up', e.clientX, e.clientY, nCore.x, nCore.y );
      // });

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
            nCore.document.setTitle(rawDocument.name);

            callback && typeof (callback) === 'function' ? callback.call(this, rawDocument) : false;
          }).error(function (data) {
            mui.overlay('off');
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
        var rowIndex = (table.rows[data[i].rowIndex].cells[0].rowSpan > 1) ? 0 : -1,
          cell = table.rows[data[i].rowIndex].cells[data[i].cellIndex];
        cell.textContent = data[i].value;
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

        var monthSelector = document.querySelector('[name="month"]');
        if ( parseInt(activeCell.dataset.queryMonth,10) ) {
          console.log('++++', activeCell.dataset.queryMonth)
          monthSelector.value = activeCell.dataset.queryMonth;
          monthSelector.disabled = false;
        } else {
          console.log('----', activeCell.dataset)
          monthSelector.selectedIndex = 0;
          monthSelector.value = 1;
          monthSelector.disabled = true;
        }
      };

      // показываем боковое меню по нажатию кнопки
      if (showCellSettings && !document.getElementById('cellSettings').classList.contains('active')) {
        document.getElementById('cellSettings').classList.toggle('active');
      }

      console.groupEnd();
      console.groupEnd();
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
      
      // если уже были значения в ячейке
      if ( activeCell.dataset.useMonth === 'true' ) {
        console.log('activeCell.dataset.useMonth ++', activeCell.dataset);
        activeCell.dataset.queryMonth = monthSelector.value;
        // if ( activeCell.dataset.month ) {
        //   monthSelector.selectedIndex = parseInt( activeCell.dataset.month, 10 ) - 1;
        //   monthSelector.value = activeCell.dataset.month;
        //   console.log('activeCell.dataset.month ++', monthSelector.value, activeCell.dataset);
        // } else {
        //   console.log('activeCell.dataset.month --', activeCell.dataset);
        //   activeCell.dataset.month = monthSelector.value;
        // };
      } else {
        console.log('activeCell.dataset.useMonth --', activeCell.dataset);
        delete activeCell.dataset.queryMonth
        monthSelector.selectedIndex = 0;
        monthSelector.disabled = true;

      }
      // if ( activeCell.dataset.hasOwnProperty('useMonth') && activeCell.dataset.hasOwnProperty('month') ) {
      //   useMonth.checked   = activeCell.dataset.useMonth;
      //   month_select.value = activeCell.dataset.month;
      // } else {
      //   // если нет
      //   if ( useMonth.checked ) {
      //     activeCell.dataset.useMonth = useMonth.checked;
      //     activeCell.dataset.month    = month_select.value;
      //   } else {
      //     month_select.disabled      = true;
      //     month_select.selectedIndex = 0;
      //   }
      // };

    });

    nCore.modules.table.event.subscribe('setMonth', function(){
      console.groupEnd();
      console.groupEnd();
      console.groupEnd();
      console.groupEnd();
      console.groupEnd();

      var monthSelector = document.querySelector('[name="month"]');
      console.log('set month', monthSelector.value);

      if ( activeCell.dataset.queryMonth ) {
        monthSelector.value = activeCell.dataset.queryMonth;
        monthSelector.disabled = false;
      } else {
        monthSelector.disabled = true;
        monthSelector.selectedIndex = 0;
        // monthSelector.dispatchEvent( new Event('click') )
        // monthSelector.dispatchEvent( new Event('change') );

        $('[name="useMonth"]').trigger('change')
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
