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
  var Roles = function(data){
    if ( !arguments.length ) {
      data = {};
    }

    this.user = data.user || new nCore.user.new();
  };
  Roles.prototype.check = function(permission){
    return ( this.user.permissions.indexOf( permission )==-1  ) ? false : true;
  };

  var init = function(){
  };

  return {
    init  : init,
    new   : Roles
  };
})();
nCore.roles.init();