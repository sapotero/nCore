"use strict";

// resourse user
/**
 * core module
 * @module nCore/user
 */

var nCore = nCore || {};
nCore.user = (function(){

  var userPermissions = ['viewTable', 'viewTableIndex'],
      userEvent       = {},
      userName        = {},
      userActive      = true;

  var init = function(){
    nCore.attachTo( nCore.user.event );
  },
  permissions = function(){
    return userPermissions;
  },
  setPermissions = function(data){
    // после первого раза запрещаем изменять права доступа
    userPermissions = Object.freeze(data);
  },
  event = function(){
    return userEvent;
  };

  return {
    init           : init,
    event          : event,
    setPermissions : setPermissions,
    permissions    : permissions
  }
})();