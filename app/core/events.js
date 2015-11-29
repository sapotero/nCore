"use strict";

// модуль отвечающий за взаимодействие компонентов фреймворка

var nCore = nCore || {};
nCore.events = (function(){
  var activeCell;

  // функция которая валидно обрабатывает юникод
  function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
  }

  var init = function init (){
    
    /**
     * события документа
     */
    // новый документ
    nCore.document.root.subscribe('newDocument', function(data){
      
      // если документ новый - показываем модальное окошко с вводом имени
      if ( nCore.document.newDocument() ) {
        // console.log('new doc');
        // turn on (returns overlay element)
        var overlayEl = mui.overlay('on');

        // set overlay options
        var options = {
          'keyboard': true,  // teardown when <esc> key is pressed (default: true)
          'static'  : false, // maintain overlay when clicked (default: false)
          'onclose' : function() {
          }
        };
        // initialize with child element
        var m = document.createElement('div');
        m.style.width = '400px';
        m.style.height = '300px';
        m.style.margin = '10% auto';
        m.style.backgroundColor = '#fff';
        m.classList.toggle('mui-panel');
        m.classList.toggle('mui--z5');
        m.innerHTML = '<form onsubmit="nCore.document.root.publish(\'saveDocument\', this); return false;"><legend>Документ</legend><br><br><div class="mui-textfield mui-textfield--float-label"><input required name="nCoreDocumnetName"><label>Название</label></div><div class="mui-textfield mui-textfield--float-label"><input type=text required name="nCoreDocumnetDescription"><label>Описание</label></div><div class="mui--text-right"><button type=button onclick="mui.overlay(\'off\');" class="mui-btn mui-btn--raised mui-btn--danger">отмена</button><button type=submit class="mui-btn mui-btn--raised mui-btn--primary">сохранить</button></div></form>';

        mui.overlay('on', options, m);
      }
      // если не новый  - сохраняем
      else {
        // console.log('old doc');
        nCore.document.root.publish('saveDocument', nCore.document.id() )
      }
    });
    // сохранение документа
    nCore.document.root.subscribe('saveDocument', function(data){
      // если передеали значения из формы
      if ( data.nodeName === 'FORM' ) {
        nCore.document.setName(data.elements.nCoreDocumnetName.value);
        nCore.document.setDescription(data.elements.nCoreDocumnetDescription.value);
      };

      // если документ новый - показываем модальное окошко с вводом имени
      if ( nCore.document.newDocument() && data.nodeName !== 'FORM' ) {
        console.log('saveDocument', data);
        nCore.document.root.publish('newDocument', true);
        // тест
        // nCore.query.post( 'queries.json', {data: 'test'})
        // .success(function(data){
        //   console.log('post', data);
        // }).error(function(data){
        //   console.error('[!] post', post, data)
        // });

        // nCore.query.get( 'queries.json', {data: 'test'})
        // .success(function(data){
        //   console.log('get', data);
        // }).error(function(data){
        //   console.error('[!] post', post, data)
        // });
      }
      // если документ не новый - проверяем атрибуты
      else {
        
        if (document.getElementById('mui-overlay')) {
          mui.overlay('off');
        };

        // считаем табличку перед сохранением
        // $.FroalaEditor.COMMANDS.calculator.callback()
        var nCoreDocumentAttributes = {
          id          : nCore.document.id(),
          type        : 'report',
          name        : nCore.document.name(),
          description : nCore.document.description(),
          datetime    : new Date().getTime(),
          body        : b64EncodeUnicode(document.getElementById('paper').innerHTML),
          query       : nCore.document.cellQuery() || '',
          author      : 'AuthorName'
        };

        nCore.document.setAttributes( nCoreDocumentAttributes );

        nCore.query.post( 'documents.json', nCoreDocumentAttributes)
        .success(function(data){
          console.log('saveDocument', data);
        }).error(function(data){
          console.error('[!] saveDocument', post, data)
        });

      }
    });
    // изменение свойств документа
    nCore.document.root.subscribe('setDocumentAttributes', function(data){
      console.log('[main] setDocumentAttributes:', data);

      // обновляем название и шапку
      var headline = document.getElementById('nCoreDocumentHeadLine'),
          author   = document.getElementById('nCoreDocumentAuthor');

      headline.textContent = [data.type, data.name ].join(' ');
      author.innerHTML   = ' '+data.author;
      
      // всё ок, пришло подтвереие что можно скрывать оверлай и документ сохряненн (+делаем крутилку что идёт процесс сохранения), или выводим ошибку
      // if ( data === true ) {
      //   console.log('setDocumentAttributes true:', data);
      // } else {
      //   console.log('setDocumentAttributes false:', data);
      // }
    });

    /**
     * события для таблицы
     */
    // создание критериев поиска 
    nCore.modules.table.event.subscribe('generateQuery', function(data){
      console.log('generateQuery', data);
      var table     = data.table,
          headClass = data.headClass,
          sideClass = data.sideClass;

      nCore.modules.table.tableQuery(table, headClass, sideClass);
    });
    // расчёт критериев поиска и отправление их на сервер
    nCore.modules.table.event.subscribe('calculateQuery', function(cellData){
      console.log('calculateQuery', cellData);
      nCore.document.setCellQuery(cellData);

      nCore.query.post( 'queries.json', {data: cellData})
        .success(function(data){
          console.log('calculateQuery -> post', data);
          nCore.modules.table.event.publish('insertCellData', data )
        }).error(function(data){
          console.error('[!] calculateQuery -> post', post, data)
        });
    });
    // вставка данных в таблицу
    nCore.modules.table.event.subscribe('insertCellData', function(data){
      console.log('insertCellData', data);
      var table = document.querySelector('.fr-element.fr-view > table');
      for (var i = 0; i < data.length; i++) {
        table.rows[ data[i].rowIndex ].cells[ data[i].cellIndex ].textContent = data[i].value;
      };
    });
    // выбор активной ячейки
    nCore.modules.table.event.subscribe('cellSelect', function(data){
      // console.log('cellSelect', data);
      var showCellSettings = true,
          searchList = {
            conditions  :document.getElementsByName('conditions')[0],
            value       :document.getElementsByName('value')[0],
            origin_name :document.getElementsByName('origin_name')[0]
          };
      activeCell = data;

      data.dataset.hasOwnProperty('value') ? searchList['value'].value = data.dataset.value :searchList['value'].value = '';
      data.dataset.hasOwnProperty('conditions') ? searchList['conditions'].value = data.dataset.conditions :searchList['conditions'].selectedIndex = -1;
      data.dataset.hasOwnProperty('origin_name') ? searchList['origin_name'].value = data.dataset.origin_name :searchList['origin_name'].selectedIndex = -1;

      if ( showCellSettings && !document.getElementById('cellSettings').classList.contains('active') ) {
        document.getElementById('cellSettings').classList.toggle('active');
      };
    });
    // изменение критериев поиска активной ячейки
    nCore.modules.table.event.subscribe('cellSettingsChange', function(input){
      // console.log('cellSettingsChange', input);

      switch( input.target.name ){
        case 'conditions':
          activeCell.dataset.conditions = input.target.value;
          break;
        case 'value':
          activeCell.dataset.value = input.target.value;
          break;
        case 'origin_name':
          activeCell.dataset.origin_name = input.target.value;
          break;
        default:
          break;
      };

      if ( activeCell.dataset.hasOwnProperty('condition') ) {
        // console.log( 'condition:', activeCell.dataset.condition );
      };

      if ( activeCell.dataset.hasOwnProperty('value') ) {
        // console.log( 'value:', activeCell.dataset.value );
      };

      if ( activeCell.dataset.hasOwnProperty('origin_name') ) {
        // console.log( 'origin_name:', activeCell.dataset.origin_name );
      };
    });
  };

  return {
    init  : init,
  };
})();

nCore.events.init();