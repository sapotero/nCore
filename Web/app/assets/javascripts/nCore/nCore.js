"use strict";

//////////////////////////////////////
//                                  //
//          БИЗНЕС_ПРОЦЕССЫ         //
// git@github.com:sapotero/view.git //
//                                  //
//          view.localhost          //
//                                  //
//////////////////////////////////////

// наш микро фреймворк nCore

var nCore = nCore || {};

nCore = (function(){
  Date.prototype.formattedDate = function (pattern) {
    var formattedDate = pattern.replace( 'yyyy', this.getFullYear().toString() );
    
    var mm = (this.getMonth() + 1).toString();
    mm = mm.length > 1 ? mm : '0' + mm;
    formattedDate = formattedDate.replace('mm', mm);
    
    var dd = this.getDate().toString();
    dd = dd.length > 1 ? dd : '0' + dd;
    formattedDate = formattedDate.replace('dd', dd);
    
    return formattedDate;
  };

  var nCore = function(){
    var nCore = this;

    nCore.cellQuery = '';

    this.modules   = {};
    this.core      = {};
    this.query     = {};
    this.router    = {};
    this.templates = {};
    this.user      = {};
    this.roles     = {};
    this.update    = {};
    this.preloader = {};
    this.storage   = {};
    this.commands  = {};
    
    this.types     = {
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
        },
        {
          value: "exist",
          caption: "Присутствует"
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
        },
        {
          value: "month",
          caption: "Месяц"
        }
      ],
      Boolean:  [
        {
          value: "equal",
          caption: "Точное совпадение"
        },
        {
          value: "not_equal",
          caption: "Не"
        },
        {
          value: "exist",
          caption: "Присутствует"
        }
      ],
      Fixnum:  [
        {
          value: "exist",
          caption: "Присутствует"
        },
        {
          value: "equal",
          caption: "Равно"
        },
        {
          value: "gt",
          caption: "Больше"
        },
        {
          value: "gte",
          caption: "Больше или равно"
        },
        {
          value: "lt",
          caption: "Меньше"
        },
        {
          value: "lte",
          caption: "Меньше или равно"
        },
        {
          value: "sum",
          caption: "Сумма"
        },
      ],
      Formula:  [
        {
          value: "equal",
          caption: "Точное совпадение"
        },
        {
          value: "sum",
          caption: "Сумма"
        }
      ],
      Default:  []
    };

    this.channels  = {};
    nCore.noop = function(){};
  };

  nCore.prototype.init = function(){
    console.groupCollapsed('nCore::Init');

    this.disableCopyPaste(document);
    
    console.groupEnd();
  };

  nCore.prototype.attachTo  = function(obj){
    var nCore = this;

    obj.publish   = function( channel) {
      if ( !nCore.channels[channel] ) {
        return false;
      }

      var args = Array.prototype.slice.call(arguments, 1);
      // console.log('  -> ', channel);

      for (var i = 0, l = nCore.channels[channel].length; i < l; i++) {
        var subscription = nCore.channels[channel][i];
        subscription.callback.apply(subscription.context, args);
      }

      return this;
    };

    obj.subscribe = function(channel, fn, before, after ) {
      if ( !nCore.channels[channel] ) {
        nCore.channels[channel] = [];
      }

      nCore.channels[channel].push({ context: this, callback: fn });
          // before event
      if ( before && typeof(before) === 'function' ) {
        // console.log('**before', channel);
        before.call(this, arguments);
      }

      // after event
      if ( after && typeof(after) === 'function' ) {
        // console.log('**after', channel);
        after.call(this,  arguments);
      }

      return this;
     };
  };

  nCore.prototype.disableCopyPaste = function(elm) {
    elm.onkeydown = this.interceptKeys;
    // elm.oncontextmenu = function() {
    //   // return false
    // };
  };
  nCore.prototype.interceptKeys = function(evt) {
    // var nCore = this;

    evt = evt || window.event;
    var target = evt.target || evt.srcElement;

    var c = evt.keyCode, ctrlDown = evt.ctrlKey || evt.metaKey;

    if (ctrlDown && evt.altKey){
      return true;
    }

    else if (ctrlDown && c==67){
      console.log('ctrl + c event', evt, target );
      window['nCore'].copyCellQuery();
      // return false
    }
    else if (ctrlDown && c==86){
      console.log('ctrl + v event', evt, target );
      window['nCore'].pasteCellQuery();
      // return false
    }
    else if (ctrlDown && c==88){
      console.log('ctrl + x event', evt, target );
      // запрещаем копирование
      // return false
    }

    return true;
  };
  nCore.prototype.copyCellQuery = function() {
    this.cellQuery = this.modules.table.active.dataset;
    console.log( 'copyCellQuery', this.cellQuery );
  };
  nCore.prototype.pasteCellQuery = function() {
    var nCore = this;
    // console.log( this );
    for( var key in nCore.cellQuery){
      // console.log( key);
      nCore.modules.table.active.dataset[key] = nCore.cellQuery[key];
    }
  };


  return new nCore();
})();
nCore.init();