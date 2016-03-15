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
    this.id   = data.id   || {};
    this.name = data.name || {};
    this.permissions = data.userPermissions || ['viewTable', 'viewTableIndex'];
  };

  return new User({
    id:   document.querySelector('#nCoreDocumentAuthor').dataset.userId,
    name: document.querySelector('#nCoreDocumentAuthor').textContent
  });
})();