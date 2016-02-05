// "use strict";



//////////////////////////////////////
//                                  //
//          БИЗНЕС_ПРОЦЕССЫ         //
// git@github.com:sapotero/view.git //
//                                  //
//          view.localhost          //
//                                  //
//////////////////////////////////////



// наш микро фреймворк nCore

/**
 * nCore - framework
 * @module nCore
 * @class nCore
 */
var nCore = nCore || {};

nCore = (function(){
  /**
   * @function storageAvailable
   * @description проверка, на доступность локальной базы данных на клиенте (по умолчанию *localStorage* )
   * @param  {String}  type localstorage
   * @return {Boolean}      true | false
   * @memberOf nCore
   */
  function storageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);

      nCore.storage = window[type];
      // nCore.storage.clear();
      return true;
    }
    catch(e) {
      return false;
    }
  }

  /**
   * @function load
   * @memberOf nCore
   * @description загружает скрипты
   * @param  {String}   type       Папка, из которой будут загружаться файлы
   * @param  {Array}   scriptArray Массив файлов
   * @param  {Function} callback   Коллбек
   */
  function load(type, scriptArray, callback) {
    console.log('load', type, scriptArray);

    var head        = document.getElementsByTagName('body')[0],
        scriptArray = scriptArray,
        toLoad      = scriptArray.length,
        hasCallback = callback.call;
    function onScriptLoaded(scriptName) {
      var readyState = this.readyState;
      if (!readyState || /ded|te/.test(readyState)) {
        toLoad--;
        if (!toLoad && hasCallback) {
          if (type !== 'shared') {
            callback(type, scriptArray);
          };
        }
      }
    }
    function addToStorage(url, script){
      jqxhr = $.ajax( url )
      .done(function(data) {
        nCore.storage.setItem( script, data );
      })
      .fail(function(data) {
        var js_source = data.responseText;
        nCore.storage.setItem( script, js_source );
      });
    };


    var script, _storageAvailable = storageAvailable('localStorage');

    for (var i = 0; i < toLoad; i++) {
      script = document.createElement('script');
      var scriptName = scriptArray[i];

      if ( _storageAvailable && [ 'shared', 'background' ].indexOf(type) === -1 ) {

        if( nCore.storage.hasOwnProperty( scriptName ) ){
          script.src = 'data:text/javascript,' + encodeURIComponent( nCore.storage[ scriptName ] );
        }
        else {
          var url = 'assets/js/nCore/'+type+'/'+scriptName+'.js';
          script.src = url;
          // script.async = true;
          script.onload = script.onerror = script.onreadystatechange = onScriptLoaded;
          // addToStorage(url, scriptName);
        }
      }
      else {
        script.src = 'assets/js/nCore/'+type+'/'+scriptName+'.js';
        // script.async = true;
        script.onload = script.onerror = script.onreadystatechange = onScriptLoaded;
      }

      head.appendChild(script);
    }
  };

  /**
   * @function loadModules
   * @memberOf nCore
   * @description Обертка над @load
   */
  function loadModules(){
    var dependencies = {
      shared     : [ "jquery", "mui.min", "transparency.min", "froala_v2", "script", "select2.full", "m", "pikaday.min" /* , "moment.min",  */ ],
      core       : [ "user", "query", "core", "roles", "templates", "router", "preloader"],
      background : [ "worker", "workerBack", "shared", "sharedBack", "update" ],
      modules    : [ "document", "table", "cellEditor", "cell", "events", "menu" ]
    };
    var _init = [];
    
    for (var type in dependencies){
      dependencies.hasOwnProperty(type) ? load( type, dependencies[type], function(type, array){
        for(var index in array ){
          var module = array[ index ];

          if ( nCore.hasOwnProperty(module) && nCore[ module ].hasOwnProperty('init') ) {
            nCore[module].init();
          }
          else if( nCore.modules.hasOwnProperty( module ) ){
            nCore.modules[module].init()
          };
        };
      }) : false;
    };

    // хак для медленного соединения
    var _i = setInterval(function(){
      if ( nCore.preloader.hasOwnProperty('init') && typeof(nCore.preloader.init) === 'function' ) {
        nCore.preloader.init();
        clearInterval(_i);
      };
    }, 100);
  };

  /**
   * @function init
   * @memberOf nCore
   * @description Выполняется при загрузке фреймворка
   */
  function init(){
    nCore.modules   = {};
    nCore.core      = {};
    nCore.query     = {};
    nCore.router    = {};
    nCore.templates = {};
    nCore.user      = {};
    nCore.roles     = {};
    nCore.update    = {};
    nCore.preloader = {};
    nCore.storage   = {};

    // раскоментировать для standalone приложения 
    loadModules();
    
    // if ( !nCore.storage.getItem('indexViewType') ) {
    //   nCore.storage.setItem('indexViewType', 'renderThumbIndexView')
    // };
    //       dev only         // 
    // nCore.storage.clear(); //
    bind();
  }

    /**
   * @function subscribe
   * @memberOf nCore
   * @description Подписка на изменение объекта
   * @param {object} channel На что подписываемся
   * @param {function} fn Функция, выполняемая после изменени
   * @param {function} before Функция, выполняемая перед подпиской
   * @param {function} after  Функция, выполняемая после подписки
   */
  var subscribe = function(channel, fn, before, after ) {
    if ( !nCore.channels[channel] ) {
      nCore.channels[channel] = [];
    }

    nCore.channels[channel].push({ context: this, callback: fn });
        // before event
    if ( before && typeof(before) === 'function' ) {
      console.log('**before', channel);
      before.call(this, arguments);
    };

    // after event
    if ( after && typeof(after) === 'function' ) {
      console.log('**after', channel);
      after.call(this,  arguments);
    };

    return this;
   },
  publish = function( channel) {
    if ( !nCore.channels[channel] ) {
      return false;
    }

    var args = Array.prototype.slice.call(arguments, 1);
    // console.log('  -> ', channel);

    for (var i = 0, l = nCore.channels[channel].length; i < l; i++) {
      var subscription = nCore.channels[channel][i];
      subscription.callback.apply(subscription.context, args);
    };

    return this;
   },
  bind = function(){

    var nodeIterator = document.createNodeIterator(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      function(node) {
         return node.dataset.hasOwnProperty('bind') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
      false
    );

    var pars = [], currentNode;

    while (currentNode = nodeIterator.nextNode()) {
      // pars.push({
      //   el    : currentNode.dataset.bind,
      //   name  : currentNode.dataset.name,
      //   action: currentNode.dataset.action
      // });

      if ( document.querySelector('input[name="'+currentNode.dataset.name+'"') ) {
        document.querySelector('input[name="'+currentNode.dataset.name+'"')
        .addEventListener( currentNode.dataset.action , 
          function(e, currentNode){
            document.querySelector('[data-name="'+e.target.name+'"]') .textContent = e.target.value;
          });
      };
    };

    // console.log(pars);
   };

  return {
    types : {
      String: [
        {
          value: "equal",
          caption: "Точное совпадение"
        },
        {
          value: "not_equal",
          caption: "Не"
        },
        {
          value: "regexp",
          caption: "Частичное совпадение"
        },
        {
          value: "full_text",
          caption: "Ключевые слова"
        },
        {
          value: "group",
          caption: "Группа"
        },
        {
          value: "not_in_group",
          caption: "Исключая группу"
        }
      ],
      DateTime: [
        {
          value: "equal",
          caption: "Точное совпадение"
        },
        {
          value: "range",
          caption: "За период"
        }
      ],
      Boolean:  [
        {
          value: "equal",
          caption: "Точное совпадение"
        },
        {
          value: "exist",
          caption: "Присутствует"
        }
      ],
      Default:  [
        {
          value: "equal",
          caption: "Точное совпадение"
        },
        {
          value: "not_equal",
          caption: "Не"
        },
        {
          value: "regexp",
          caption: "Частичное совпадение"
        },
        {
          value: "full_text",
          caption: "Ключевые слова"
        },
        {
          value: "group",
          caption: "Группа"
        },
        {
          value: "not_in_group",
          caption: "Исключая группу"
        }
      ]
    },
    channels  : {},
    init      : init,
    
    publish   : publish,
    subscribe : subscribe,

    attachTo  : function(obj){
      obj.publish   = publish;
      obj.subscribe = subscribe;
    }
  };
})();

nCore.init();