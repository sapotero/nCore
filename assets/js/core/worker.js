'use strict';

onmessage = function(e) {
  
  var Request = function (config) {
    this.type = config.type.toUpperCase() || 'GET';
    this.url  = config.url;
    this.data = config.data || {};
    return this
  };
  Request.prototype.send = function( callback, error ) {
    var request = new XMLHttpRequest();
    request.open( this.type , this.url, true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var response = this.response;
        callback( response );
      } else {
        callback( response );
      }
    };

    request.onerror = function() {
      error(this);
    };

    request.send( this.data );
  };

  var Command = function(config) {
    this.action = config.action || '';
    this.data   = config.data   || '';
    return this;
  }
  Command.prototype.do = function() {
    if (this.action !== '') {
      
    };
  };

  new Command({
    action : e.data[0],
    data   : e.data[1]
  }).do();

  new Request({
    type : 'get',
    url  : '/'
  }).send(
    function ( response ) {
      console.log( 'WORKER REQUEST: ', response );
    },
    function ( error ) {
      throw new Error(error);
    }
  );

  // postMessage( e.data );
};