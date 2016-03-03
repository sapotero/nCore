"use strict";

// модуль предоставляющий интерфейс для взаимодействия по сети
/**
 * core module
 * @module nCore/storage
 */
var nCore = nCore || {};
nCore.storage = (function(){
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

  var init = function(config){
    storageAvailable('localStorage');
  };

  return {
    init : init
  }
})();
nCore.storage.init();