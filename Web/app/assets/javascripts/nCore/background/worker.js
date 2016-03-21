"use strict";

// resourse worker

var nCore = nCore || {};
nCore.worker = (function(){
  
  var worker = '';

  var initialize = new Promise(function(resolve, reject){
    worker = new SharedWorker('/assets/js/workerBack.js');
    
    worker.port.onmessage = function(e) {
      console.log('Message received from worker', e);
    };

    if (worker) {
      resolve(worker);
    } else {
      reject(worker);
    }
  });

  initialize.then(function(worker){
    console.log( 'NEW WORKER', worker );
  }).catch(function(error){
    console.error( error );
  });

  return worker;
})();