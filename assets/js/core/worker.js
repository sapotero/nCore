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

  var Template = function () {
    return this;
  }
  Template.prototype.request = Request;

  Template.prototype.load = function(tmp) {
    console.log('tmp', tmp, this);
    var request = new this.request({
      type : 'get',
      url  : '/assets/templates/' + tmp + '.html'
    });

    return request.send(
      function ( response ) {
        console.log( 'WORKER REQUEST: ', response );
      },
      function ( error ) {
        throw new Error(error);
      }
    );
  };

  var Command = function(config) {
    this.action = config.action || '';
    this.data   = config.data   || '';
    
    return this;
  }
  Command.prototype.template = Template;
  Command.prototype.return   = postMessage

  Command.prototype.do = function() {
    if (this.action !== '') {
      var tmp = this.action.split(':');
      var module = tmp[0],
          action = tmp[1];

      // if ( this.hasOwnProperty(module) ) {
        module = new this[module];
        module[action].call(module, this.data);
      // };
    };
  };

  console.log('recv', e.data);

  console.log();
  new Command({
    action : e.data[0],
    data   : e.data[1]
  }).do();

  // postMessage( e.data );
};