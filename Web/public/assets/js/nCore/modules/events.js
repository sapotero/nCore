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

      // console.log('new doc');
      // turn on (returns overlay element)
      var overlayEl = mui.overlay('on');

      // set overlay options
      var options = {
        'keyboard': true, // teardown when <esc> key is pressed (default: true)
        'static': false, // maintain overlay when clicked (default: false)
        'onclose': function () {}
      };
      // initialize with child element
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
        'onclose': function () {}
      };
      // initialize with child element
      var m = document.createElement('div');
      m.style.width = '400px';
      m.style.height = 'auto';
      m.style.margin = '10% auto';
      m.style.padding = '10% auto';
      m.style.backgroundColor = '#fff';
      m.classList.toggle('mui-panel');
      m.classList.toggle('mui--z5');

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

      // nCore.document.setAttributes(nCoreDocumentAttributes);

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

      // если новый документ, показываем форму
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
        // nCore.document.setTitle( rawDocument.name );

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

      // обновляем название и шапку
      var author = document.getElementById('nCoreDocumentAuthor');


      // headline.textContent = [data.type, data.name].join(' ');
      // author.textContent = ' ' + data.author;

      // всё ок, пришло подтвереие что можно скрывать оверлай и документ сохряненн (+делаем крутилку что идёт процесс сохранения), или выводим ошибку
      // if ( data === true ) {
      //   console.log('setDocumentAttributes true:', data);
      // } else {
      //   console.log('setDocumentAttributes false:', data);
      // }
    });

    nCore.document.root.subscribe('generateNewDocument', function () {
      nCore.document.generateNew();
    });

    // [NEW] изменение свойств документа
    nCore.document.root.subscribe('initEditor', function (data) {
      console.log('initEditor');

      // var _i = setInterval(function(){
      //   if ( nCore.preloader.hasOwnProperty('init') && typeof(nCore.preloader.init) === 'function' ) {
      //     nCore.preloader.init();
      //     clearInterval(_i);
      //   };
      // }, 500);
      
      $('div#paper').on('froalaEditor.initialized', function (e, editor) {
        console.log('e, editor', e);

        // скрываем unregister version
        if (document.querySelector('.fr-wrapper').nextSibling && document.querySelector('.fr-wrapper').nextSibling.nodeName == 'DIV' && document.querySelector('.fr-wrapper').nextSibling.textContent == 'Unlicensed Froala Editor') {
          document.querySelector('.fr-wrapper').nextSibling.textContent = '';
        };
      });

      $('div#paper').froalaEditor({
        toolbarButtons:   ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', 'cog'],
        toolbarButtonsMD: ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', 'cog'],
        toolbarButtonsSM: ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo','cog'],
        toolbarButtonsXS: ['file-o', 'floppy-o', 'adjust', 'phone', 'flask', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', 'formatOL', 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo','cog'],
        language: 'ru',
        charCounterCount: false,
        toolbarSticky: false
      });


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
        console.log('loadDocument', id);
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
        // console.log( '** -> **', data );
      },

      // after callback
      function (data) {
        // console.log( '** <- **', data );
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
      // initialize with child element
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
              },
              // text: function () {
              //   return ''
              // }
            },
            downloadPdf: {
              href: function (params) {
                return "documents/" + this._id + ".pdf";
              },
              // text: function () {
              //   return ''
              // }
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
          // когда б
          // _active_row = document.getElementsByClassName('_indexView ' + nCore.storage.getItem('indexViewType'))[0];

          for (var i = 0; i < _mui_rows.length; i++) {
            _mui_rows[i].classList.add('mui--hide')
          }

          // падает firefox
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

     // }
    });

    nCore.document.root.subscribe('renderNotPermit', function (data) {
      // console.log('renderNotPermit', data);
      var data = {
        'textBad': 'Operation not permited'
      };

      Transparency.render(document.getElementById('content-wrapper'), data);
    });

    // проверяем что показывать
    nCore.document.root.subscribe('onRouteChange', function (data) {

      console.log('onRouteChange', data);
    });

    /////////////////////////
    // Cобытия для таблицы //
    /////////////////////////

    // создание критериев поиска
    nCore.modules.table.event.subscribe('generateQuery', function (data) {
      // console.log('generateQuery', data);
      var table = data.table,
        headClass = data.headClass,
        sideClass = data.sideClass;

      nCore.modules.table.tableQuery(table, headClass, sideClass);
    });

    // расчёт критериев поиска и отправление их на сервер
    nCore.modules.table.event.subscribe('calculateQuery', function (cellData) {
      // console.log('calculateQuery', JSON.stringify(cellData));
      nCore.document.setCellQuery(cellData);
      // console.log( '****', nCore.document.cellQuery() );

      nCore.query.post('queries.json', {
        data: cellData,
        global: {
          periodStart: nCore.document.periodStart(),
          periodEnd: nCore.document.periodEnd(),
          providerId: document.querySelector('#nCoreDocumentAuthor').dataset.providerId,
          reportId:  nCore.document.id()
        }
      }).success(function (data) {
        // console.log('calculateQuery -> post', data);

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
      
      console.log('cellSelect', cell);
      
      var showCellSettings = true,
        tab = document.getElementsByClassName('criteriaSelector')[0],
        cellQuery;

      activeCell = cell;
      nCore.modules.table.setActive(activeCell);

      tab.textContent = '';
      var __elements_to_update = [],
        criteriaCondition;

      if (activeCell) {
        // если есть query
        if (activeCell.dataset.hasOwnProperty('query')) {
          var queryArray = JSON.parse(activeCell.dataset.query),
            _selectedIindex = -1;


          // console.error('*** queryArray', queryArray)
          for (var z = 0; z < queryArray.length; z++) {

            var group = queryArray[z],
              groupConditions = group.conditions,
              criterias = group.query;

            console.log('criterias',  criterias);
            console.log('conditions', groupConditions);

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

              // проверка на незаполненые поля в критерии
              console.warn('!! criteria', item);

              if (item.source == null && item.origin_name == null) {
                activeCell.dataset.query = '[]';
                continue;
              }

              var card = cardTemplate.cloneNode(true);
              card.classList.remove('criteriaSelectorItemTemplate');
              card.classList.remove('mui--hide');
              // console.log('ITEM', item, 'CARD', card);

              var form = card.getElementsByClassName('criteriaForm')[0];

              // var table_name  = form.querySelector('select[name="table_name"]'),
              //     origin_name = form.querySelector('select[name="origin_name"]'),
              //     conditions  = form.querySelector('select[name="conditions"]'),
              //     value       = form.querySelector('[name="value"]');


              criteriaCondition = card.querySelector('select.itemSelectCondition');
              console.error( 'criteriaCondition', criteriaCondition );

              list.appendChild(card);

              
              // nCore.modules.cell.generateBlock( item, form, 'criteria_condition', item.criteria_condition );
              nCore.modules.cell.generateBlock( item, form, 'source',             item.source );
              nCore.modules.cell.generateBlock( item, form, 'origin_name',        item.origin_name );
              nCore.modules.cell.generateBlock( item, form, 'conditions',         item.conditions );
              nCore.modules.cell.generateBlock( item, form, 'value',              item.value );

              var cr_c = card.querySelector('[name="criteria_condition_group"]');
              cr_c.value = item.criteria_condition;
              cr_c.selectedIndex = item.criteria_condition == 'and' ? 0 : 1;
              // console.error( '***', cr_c, cr_c.value, cr_c.selectedIndex )


            }


            document.querySelector('.firstTimeCriteria').classList.add('mui--hide');
          }

          nCore.modules.table.event.publish('newCellSettingsChange' );
        }
        else {
          document.querySelector('.firstTimeCriteria').classList.add('mui--hide');
        }
      };

    
      // показываем боковое меню по нажатию кнопки
      if (showCellSettings && !document.getElementById('cellSettings').classList.contains('active')) {
        document.getElementById('cellSettings').classList.toggle('active');
      }

    });

    nCore.modules.table.event.subscribe('cellFormulaChange', function () {
      var formulaSettings = document.querySelector('.formulaSettings'),
        formulaSettingsItems = [].slice.call(formulaSettings.querySelectorAll('input'));
      for (var v = 0; v < formulaSettingsItems.length; v++) {
        var checkbox = formulaSettingsItems[v];
        activeCell.dataset[checkbox.name] = checkbox.checked;
      };
    });

    nCore.modules.table.event.subscribe('cellFormulaClear', function () {
      var formulaSettings = document.querySelector('.formulaSettings'),
        formulaSettingsItems = [].slice.call(formulaSettings.querySelectorAll('input'));
      for (var v = 0; v < formulaSettingsItems.length; v++) {
        var checkbox = formulaSettingsItems[v];

        console.log('activeCell.dataset[checkbox.name]', activeCell.dataset[checkbox.name]);

        checkbox.checked = activeCell.dataset[checkbox.name] === 'true' ? activeCell.dataset[checkbox.name] : null;
      };
    });

    // изменение критериев поиска активной ячейки
    nCore.modules.table.event.subscribe('newCellSettingsChange', function (NAME, URL) {

      // переписать с jQuery на js

      var _query = [],
        list = document.querySelector(".criteriaSelector"),
        criterias = list.querySelectorAll('div');

      console.error('----- newCellSettingsChange -----');
      console.log(list, criterias);

      for (var i = 0; i < criterias.length; i++) {
        var criteria = $(criterias[i]),
          criteriaItemsRoot = criteria.children('.criteriaSelectorGroup'),
          criteriaItems = criteriaItemsRoot.children('.criteriaSelectorGroupList').children('.criteriaSelectorItem');

        // console.error('!!!!!!  newCellSettingsChange -> criteria['+i+']', criteria, criteriaItems );


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
          // console.error( '---', _select, criteriaItemsRoot[0].parentNode.querySelector('[name="connectionGroup"]').value );

          data.query.push({
            criteria_condition : head.children('.criteriaSelectorItemOptions').children('.criteriaSelectorItemCondition')[0].value,
            // criteria_condition : criteriaItemsRoot[0].querySelector('[name="connectionGroup"]').value,
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

      // console.log('_query', _query);
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

      // console.log('newCellSettings | activeCell -> ',activeCell,  JSON.stringify(_query) )
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
            console.log('loadItem -> get', item, data);
            nCore.storage.setItem(item + '', JSON.stringify(data));
            nCore.document.root.publish(nCore.storage.getItem('indexViewType'));
          }).error(function (data) {
            console.error('[!] loadItem -> get', data)
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
        // console.warn('loadCriteria -> get', data);

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
