"use strict";

var nCore = nCore || {};
nCore.templates = (function(){
  
  function init (){
  };
  function render(template, callback){
    return nCore.query.getTemplate( 'templates/' + template + '.html', {})
    .success(function(data){
      console.log('getTemplate', data);
      if (callback && typeof(callback) === 'function') {
        callback.call(this, data);
      };
    }).error(function(data){
      console.error('[!] getTemplate', data)
    });
  }

  return {
    init   : init,
    render : render
  }
})();
nCore.templates.init();