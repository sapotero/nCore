"use strict";

// resourse preloader

/**
 * core module
 * @module nCore/preloader
 * @see module:nCore/core
 * @see {@link http://github.com|GitHub}
 */

var nCore = nCore || {};
nCore.preloader = (function(){
  // предзагрузка всех справочников и шаблонов перед стартом приложульки
  // получаем права доступа юзера
  
  var Preloader = function(config){
    if ( !arguments.length ) {
      config = {};
    }
    this.event  = {};
    this.progress = document.getElementById('loaderProgress');
  };

  Preloader.prototype = {
    event: function event(){
      return this.event;
    },
    progress: function(){
      return this.progress.style.width;
    },
    setProgress:  function(data){
      this.progress.style.width = data+'%';
    },
    dropProgress: function(){
      this.progress.style.width = '0px';
    }
  };

  var preloader = new Preloader();
  preloader.dropProgress();
  return preloader;
})();
