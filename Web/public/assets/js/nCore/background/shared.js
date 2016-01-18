"use strict";

// resourse shared

var nCore = nCore || {};
nCore.shared = (function(){
  var shared = new SharedWorker('assets/js/nCore/background/sharedBack.js');
  
  shared.port.onmessage = function(data) {
    console.log('Message received from worker', data);
  };

  var init = function(){
    return shared
  },
  post = function(data){
    shared.port.postMessage({
      command: 'load',
      data: data
    });
  };

  return {
    init : init,
    // job  : job,
    post : post,
    obj : shared
  }
})();
