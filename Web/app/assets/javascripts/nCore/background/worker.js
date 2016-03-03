"use strict";

// resourse worker

var nCore = nCore || {};
nCore.worker = (function(){
  var worker = new Worker('assets/js/nCore/background/workerBack.js');
  
  var init = function(){
    // job(worker);
    return worker
  },
  post = function(data){
    worker.postMessage({
      command: 'foobard',
      data: ''
    });
  };

  return {
    init : init,
    // job  : job,
    post : post
  }
})();