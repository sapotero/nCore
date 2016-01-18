"use strict";

// resourse roles
/**
 * core module
 * @module nCore/roles
 */

var nCore = nCore || {};
nCore.roles = (function(){
  // права доступа
  /**
 * @function init
 * @description Выполняется при загрузке модуля
 */
  var init = function(){

  },
  check = function(permission){
    return ( nCore.user.permissions().indexOf( permission )==-1  ) ? false : true;
  }

  return {
    init  : init,
    check : check
  }
})();