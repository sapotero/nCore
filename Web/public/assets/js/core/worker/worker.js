'use strict';

onmessage = function(e) {
  
  var Request = function (config) {
    this.template = config.template || '';
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
        
        if ( root.template ){
          root.template.raw = response;
        }
        
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


  var Reports = function(){
    this.data = {};
  };
  Reports.prototype.request = Request;
  Reports.prototype.add = function(config){
    this.elements.push( new this.Report(config) );
  };
  Reports.prototype.load = function(data){
    var data = [];

    var request = new this.request({
      type : 'GET',
      url  : '/documents.json'
    });

    var load = new Promise(function(resolve, reject){
      request.send( function (data) {
         resolve(data);
      });
    });

    load.then(function (data) {
      var _data = JSON.parse(data);
      // console.log( 'Reports WORKER REQUEST: ', _data );
      postMessage({
        "reports:loaded": _data
      });
    }).catch(function (e) {
       throw new Error(e);
    });
  };
  Reports.prototype.id = function(id){
    var data = [];

    var request = new this.request({
      type : 'GET',
      url  : '/documents/' + id + '.json'
    });

    var load = new Promise(function(resolve, reject){
      request.send( function (data) {
         resolve(data);
      });
    });

    load.then(function (data) {
      // console.log( 'Reports WORKER REQUEST: ', data );
      postMessage({
        "report:loaded": data
      });
    }).catch(function (e) {
       throw new Error(e);
    });
  };
   var Criterias = function(){};
   Criterias.prototype.request = Request;
   Criterias.prototype.load = function() {
    var data = [];

    var request = new this.request({
      type : 'GET',
      url  : '/documents.json'
    });

    var load = new Promise(function(resolve, reject){
      request.send( function (data) {
         resolve(data);
      });
    });

    load.then(function (data) {
      // console.log( 'Reports WORKER REQUEST: ', data );
      postMessage({
        "criterias:loaded": data
      });
    }).catch(function (e) {
       throw new Error(e);
    });
  };
  
  var CriteriaKeys = function(){};
  CriteriaKeys.prototype.request = Request;
  CriteriaKeys.prototype.load = function() {
    var data = [];

    var request = new this.request({
      type : 'GET',
      url  : '/documents.json'
    });

    var load = new Promise(function(resolve, reject){
      request.send( function (data) {
         resolve(data);
      });
    });

    load.then(function (data) {
      // console.log( 'Reports WORKER REQUEST: ', data );
      postMessage({
        "criteriaKeys:loaded": data
      });
    }).catch(function (e) {
       throw new Error(e);
    });
  };

  var Command = function(config) {
    this.action = config.action || '';
    this.data   = config.data   || '';
    
    return this;
  }
  Command.prototype.template     = Template;
  Command.prototype.reports      = Reports;
  Command.prototype.return       = postMessage;
  Command.prototype.criterias    = Criterias;
  Command.prototype.criteriaKeys = CriteriaKeys;

  Command.prototype.do = function() {
    if (this.action !== '') {
      var tmp = this.action.split(':');
      var module = tmp[0],
          action = tmp[1];
      
      module = new this[module];
      module[action].call(module, this.data);
    };
  };

  console.log('Worker <- ', e.data);

  console.log();
  new Command({
    action : e.data[0],
    data   : e.data[1]
  }).do();
};