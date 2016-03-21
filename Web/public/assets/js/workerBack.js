"use strict";
var shared_ports = [];

onconnect = function(e) {

  var port = e.ports[0];
  shared_ports.push( port );

  port.addEventListener('message', function(e) {
    console.log('SHARED_WORKER_message:', e);


    for (var i = 0; i < shared_ports.length; i++) {
      shared_ports[i].postMessage( e.data );
    }
  });

  port.start();
};