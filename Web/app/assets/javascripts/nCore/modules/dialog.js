"use strict";
/**
 * core module
 * @module nCore/core
 */
var nCore = nCore || {};
nCore.dialog = (function(){
  
  var Dialog = function(config){
    if ( !arguments.length ) {
      config = {};
    }
    this.config = config;
  };

  Dialog.prototype.newDocument = function(){
    var options = {
      'keyboard': true, // teardown when <esc> key is pressed (default: true)
      'static': false, // maintain overlay when clicked (default: false)
      'onclose': function () {}
    };

    var m = document.createElement('div');
    m.classList.toggle('mui-panel');
    m.classList.toggle('mui--z5');
    m.classList.toggle('_newDocument');
    m.innerHTML = '<form onsubmit="nCore.document.event.publish(\'saveDocumentToDb\', this); return false;"><legend>Документ</legend><br><br><div class="mui-textfield mui-textfield--float-label"><input required name="nCoreDocumnetName"><label>Название</label></div><div class="mui-textfield mui-textfield--float-label"><input type=text required name="nCoreDocumnetDescription"><label>Описание</label></div><div class="mui--text-right"><button type=button onclick="mui.overlay(\'off\');" class="mui-btn mui-btn--raised mui-btn--danger">отмена</button><button type=submit class="mui-btn mui-btn--raised mui-btn--primary">сохранить</button></div></form>';

    var overlay = mui.overlay('on', options, m);
    overlay.classList.toggle('animated');
    overlay.classList.toggle('fadeIn');
  };
  Dialog.prototype.clearSelect2 = function(){
    try {
      $('[name="__selected"]').select2('destroy');
    } catch (e){
      // console.log(e);
    }

    try{
      var element = document.querySelector('[name="__selected"]');
      if ( element ) {
        element.parentNode.removeChild(element);
      }
    }catch(e){
      // console.log('error!', e);
    }
  };
  Dialog.prototype.showSettings = function(){
    // set overlay options
    var options = {
      'keyboard': true, // teardown when <esc> key is pressed (default: true)
      'static': false, // maintain overlay when clicked (default: false)
      'onclose': function () {
        console.log( 'showDocumentSettings' );
        nCore.document.setShowSettings = false;
      }
    };

    var m = document.createElement('div');
    m.classList.toggle('mui-panel');
    m.classList.toggle('mui--z5');
    m.classList.add('_nCoreDocumentSettings');

    nCore.document.setShowSettings = true;

    var text = Transparency.render(document.querySelector('.nCoreDocumentSettings'), {
      nCoreName        : nCore.document.name,
      nCoreDescription : nCore.document.description,
      nCorePeriodStart : nCore.document.periodStart,
      nCorePeriodEnd   : nCore.document.periodEnd,
      nCoreYearReport  : nCore.document.yearReport,
      nCoreMain        : nCore.document.main,
      nCoreCompare     : nCore.document.compare,
    });
    m.innerHTML = text.innerHTML;
    
    this.clearSelect2();

    if (nCore.document.providerSelected == 'current' || nCore.document.providerSelected == 'all') {
      m.querySelector('#options_'+nCore.document.providerSelected).checked = true;
    } else {
      m.querySelector('#options_selected').checked = true;

      var load = new Promise(function(resolve, reject){
        nCore.query.get('/documents/providers').success(function (data) {
          console.log('load', data);
          resolve(data);
        }).error(function (data) {
          console.error('[!] input[value="optionsSelected"]', data);
          reject(data);
        });
      });

      var option = m.querySelector('#optionsSelected'),
        parent = option.parentNode.parentNode;

      load.then(function(data){
        var select = document.createElement('select');
        select.name = '__selected';
        select.multiple = true;
        select.style.overflow = 'auto';
        select.classList.add('mui-col-lg-12');
        select.dataset.select2Tags = '[{"id": "1", "text": "One"}, {"id": "2", "text": "Two"}]';

        for (var i = 0; i < data.length; i++) {
          var option = document.createElement('option');
          option.value       = data[i]._id;
          option.textContent = data[i].name;
          select.appendChild(option);
          if ( nCore.document.providerSelected.indexOf(data[i]._id) != -1 ) {
            option.selected = true;
          }
        }

        parent.appendChild(select);

        $(select).select2({
          tags: true
        }).on('change', function(e){
          e.preventDefault();
          e.stopPropagation();
          nCore.document.providerSelected = $(select).val();
        });
      }).catch(function(error){
      throw new Error(error);
      });
    }

    var main       = m.querySelector('[name="main"]'),
        compare    = m.querySelector('[name="compare"]'),
        yearReport = m.querySelector('[name="yearReport"]');
    
    if ( !nCore.document.yearReport ) {
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

    

    // attach event handlers
    for (var z = 0; z < toggleEls.length; z++) {
      toggleEls[z].addEventListener('mui.tabs.showstart', function show(ev) {
        for (var z = 0; z < toggleEls.length; z++) {
          toggleEls[z].parentNode.classList.remove('mui--is-active');
          m.querySelector( '#'+toggleEls[z].dataset.muiControls ).classList.remove('mui--is-active');
        }

        m.querySelector( '#'+ev.paneId ).classList.add('mui--is-active');
        m.querySelector('[data-mui-controls="'+ev.paneId+'"]').parentNode.classList.add('mui--is-active');

        nCore.document.documentSettingTab = ev.paneId;
      });
    }

    // documentQueryPane по дефолту
    m.querySelector( '#'+nCore.document.documentSettingTab ).classList.add('mui--is-active');
    m.querySelector('[data-mui-controls="'+nCore.document.documentSettingTab+'"]').parentNode.classList.add('mui--is-active');

    nCore.core.globalQueryPopulate();

    var tabs_root = text.querySelector('.mui-tabs__bar'),
        tabs      = tabs_root.querySelectorAll('li');

    console.log( tabs );

    for (var z = tabs.length - 1; z >= 0; z--) {
      if ( tabs[z].classList.contains('mui--is-active') ) {
        tabs[z].classList.remove('mui--is-active');
      }
    }

    // document.getElementById( nCore.document.documentSettingTab ).classList.add('mui--is-active');
  };
  Dialog.prototype.showGroup = function(){
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
  };
  Dialog.prototype.editTemplate = function(){
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
      filename : ( document.querySelector('#nCoreDocumentAuthor').textContent + ' - ' + nCore.document.title ),
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
  };
  Dialog.prototype.createNew = function(type){
    var documentType = nCore.document.type || type;
    // console.log('setDocumentType', documentType);
    nCore.document.type = documentType;
    nCore.document.new();

    // set overlay options
    var options = {
      'keyboard': false,
      'static': true,
      'onclose': function () {
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
        nCore.document.event.publish('generateNewDocument');
        location.hash = "#" + documentType + "/new";
      }, 1000);
      var error = false;

      if ( error === false ) {
        resolve('rendered!');
      } else {
        reject('error');
      }
    });

    render.then(function(data) {
      return data;
    }).then(function(result) {
      console.log("allDone!", result);
    }).catch(function(error) {
      console.log("error!", error);
    });
  };
  Dialog.prototype.loadFailed = function(){
    var overlayEl = mui.overlay('on'),
    options   = {
      'keyboard': false,
      'static': true,
      'onclose': function () {
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
  };
  Dialog.prototype.applicationError = function(){
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
  };
  Dialog.prototype.notPermit = function(){
    console.log('notPermit');
    return Transparency.render(document.getElementById('content-wrapper'), { 'textBad': 'Operation not permited' });
  };

  return new Dialog();
})();