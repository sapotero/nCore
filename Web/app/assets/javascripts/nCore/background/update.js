"use strict";

// resourse update

var nCore = nCore || {};
nCore.update = (function(){
  // обновление кода на живую
  var init = function(){

  },
  update = function(){
    console.log('update');
  };

  return {
    init   : init,
    update : update
  }
})();