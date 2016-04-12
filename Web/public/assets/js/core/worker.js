'use strict';

onmessage = function(e) {
  
  var Request = function (config) {
    this.template = config.template;
    this.type     = config.type.toUpperCase() || 'GET';
    this.url      = config.url;
    this.data     = config.data || {};
    return this
  };
  Request.prototype.send = function( callback ) {
    var root = this;

    var request = new XMLHttpRequest();
    request.open( this.type , this.url, true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var response = this.response;
        root.template.raw = response;
        callback( response );
      } else {
        callback( response );
      }
    };

    request.onerror = function() {
      callback(this);
    };

    request.send( this.data );
  };

  var Template = function () {
    this.raw = {};
    return this;
  }
  Template.prototype.request = Request;

  Template.prototype.load = function(tmp) {
    console.log('tmp', tmp, this);
    var template = this;

    var request = new template.request({
      type     : 'get',
      url      : '/assets/templates/' + tmp + '.html',
      template : template
    });

    var load = new Promise(function(resolve, reject){
      request.send( function (data) {
         resolve(data);
      });
    });

    load.then(function (data) {
      // console.log( 'WORKER REQUEST: ', tmp, data, template );
      
      var _data  = {};
      _data[tmp] = data;

      postMessage({
        "template:loaded": _data
      });
    }).catch(function (e) {
       throw new Error(e);
    });
    return this;
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