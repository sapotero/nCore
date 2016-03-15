"use strict";

// resourse user
/**
 * core module
 * @module nCore/user
 */

var nCore = nCore || {};
nCore.user = (function(){

  var User = function(data){
    if ( !arguments.length ) {
      data = {};
    }
    this.permissions = data.userPermissions ||  ['viewTable', 'viewTableIndex'];
    this.userEvent   = data.userEvent       ||  {};
    this.userName    = data.userName        ||  {};
    this.userActive  = data.userActive      ||  true;
  };

  var userEvent       = {};

  var init = function(){
    nCore.attachTo( nCore.user.event );
  },
  event = function(){
    return userEvent;
  };

  return {
    init           : init,
    event          : event,
    new            : User
  };
})();
nCore.user.init();