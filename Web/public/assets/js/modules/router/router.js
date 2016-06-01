'use strict';

var Route = require('./route');

function Router() {
  this.pathRoot = '';
  this.routes = [];
  this.type = 'hash';
  this.path = null;
  this.hash = null;
  this.context = this;
  this.handler = window;

  var namedParam = '([\\w-]+)';
  this.namedParam = {
    match: new RegExp('{(' + namedParam + ')}', 'g'),
    replace: namedParam
  };
  this.bindEvents();
};

Router.prototype.Route = Route;
Router.prototype.add =  function(route, callback) {
  this.routes.push(new this.Route(route, callback, this));
  return this;
};
Router.prototype.empty =  function() {
  this.routes = [];
  return this;
};
Router.prototype.setType =  function(type) {
  this.type = type;
  return this;
};
Router.prototype.setPathRoot =  function(url) {
  this.pathRoot = url;
  return this;
};
Router.prototype.setPath =  function(path) {
  this.path = path;
  return this;
};
Router.prototype.setHash =  function(hash) {
  this.hash = hash;
  return this;
};
Router.prototype.setContext =  function(context) {
  this.context = context;
  return this;
};
Router.prototype.setHandler =  function(handler) {
  this.handler = handler;
  return this;
};
Router.prototype.getUrl =  function(routeType) {

  var url;
  routeType = routeType || this.type;

  if (routeType == 'path') {
    var rootRegex = new RegExp('^' + this.pathRoot + '/?');
    url = this.path || window.location.pathname.substring(1);
    url = url.replace(rootRegex, '');
  } else if (routeType == 'hash') {
    url = this.hash || window.location.hash.substring(1);
  }

  return decodeURI(url);
};
Router.prototype.match =  function(path, callback) {
  var route = new this.Route(path, callback, this);
  if (route.test(this.getUrl())) {
    return route.run();
  }
};
Router.prototype.run =  function() {
  var url   = this.getUrl(),
      route = {};

  for (var i in this.routes) {
    route = this.routes[i];

    if (route.test(url)) {
      route.run();
      return route;
    }
  }

  if ( this.check() === false ) {
    location.hash = '#reports';
  }
};

Router.prototype.check =  function() {
  var url   = this.getUrl(),
      match = false;

  for (var i in this.routes) {
    var route = this.routes[i];
    if (route.test(url)) {
      match = true;
    }
  }
  // console.log('router -> checkDefault', match);
  return match === true ? route : false;
};

Router.prototype.update = function(options) {
  options = options || {};

  if ( options.type ){
    this.setType(options.type)
  }
  if ( options.path ){
    this.setPath(options.path)
  }
  if ( options.pathRoot ){
    this.setPathRoot(options.pathRoot)
  }
  if ( options.hash ){
    this.setHash(options.hash)
  }
  if ( options.context ){
    this.setContext(options.context)
  }
  if ( options.handler ){
    this.setHandler(options.handler)
  }
  if ( options.routes ){
    var route;
    for (route in options.routes) {
      this.add(route, options.routes[route]);
    }
  }
};

Router.prototype.hashChange = function(){
   window.addEventListener('hashchange', this.run.bind(this) );
};

Router.prototype.start = function() {
  this.update({
    pathRoot : '',
    routes   : {

      // отчёты - начальная страница
      'reports' : function(params) {
        console.log('[reports]: ', params);
        core.events.emit( "core:reports:render" );
      },
      // отчёты - шаблоны
      'reports/templates' : function(params) {
        console.log('[reports/templates/]: ', params);
      },
      // отчёты - общие документы провайдера
      'reports/shared' : function(params) {
        console.log('[reports/shared/]: ', params);
      },
      // отчёты - мои документы
      'reports/my' : function(params) {
        console.log('[reports/my/]: ', params);
      },
      'reports/{id}' : function(params) {
        console.log('[reports/{id}]: ', params);
        core.events.emit( "core:report:load", params.id );
        // core.events.emit( "core:dom:application:hide" );
        // core.events.emit( "core:dom:editor:show" );
      },
      
      'bps' : function(params) {
        console.log('[bps]: ', params);
        core.events.emit( "bps:reports:render" );
      },
      'bps/{id}' : function(params) {
        console.log('[bps/{id}]: ', params);
      },
      
      'print-forms' : function(params) {
        console.log('[print-forms]: ', params);
      },
      'print-forms/{id}' : function(params) {
        console.log('[print-forms/{id}]: ', params);
      },
      
      'web-forms' : function(params) {
        core.events.emit( "core:web-forms:render" );
      },
      'web-forms/new' : function(params) {
        console.log('[web-forms/new]: ', params);
        core.events.emit( "core:dom:primaryHeader:hide" );
        core.events.emit( "core:web-forms:new" );
      },
      'web-forms/{id}' : function( params ) {
        console.log( 'params', params );
        core.events.emit( "core:dom:primaryHeader:hide" );
        core.events.emit( "core:web-form:load", params.id );
      },
    }
  });
  this.run();
};
Router.prototype.stop = function() {
  // console.log( 'Router: stop' );
};
Router.prototype.destroy = function() {
  // console.log( 'Router: destroy' );
};
Router.prototype.bindEvents = function() {
  var router = this;
  document.addEventListener('DOMContentLoaded', function(){

    core.events.on("core:router:web-forms:new", function(){
      console.log('Router <- core:router:web-forms:new');
      location.hash = [ '#', core.modules['web-forms'].route, '/', 'new' ].join('');
    });
    

    core.events.on("core:router:web-forms:show", function( _id ){
      console.log('Router <- core:router:web-forms:show', _id );
      location.hash = [ '#', core.modules['web-forms'].route, '/', _id ].join('');
    });
    
    core.events.on( 'core:router:reports:show', function (doc) {
      console.log( 'Router <- core:router:reports:show', doc );
      core.events.emit( "core:dom:set:title", doc.name );
      // location.hash = `#reports/${doc.id}`;
      location.hash = '#reports/'+doc.id;
    });

    core.events.on("core:router:default", function(){
      console.log('Router <- core:router:default');
      location.hash = '#reports';
    });

    core.events.on("core:router:go", function( url ){
      console.log('Router <- core:router:go', url);
      location.hash = [ core.dom.application.application.getAttribute('type'), url ].join('/');
    });

    core.events.on("core:router:check", function(route){
      console.log('Router <- core:router:check', route);
      location.hash = '#' + route;
    });

    core.events.on("core:router:start", function(){
      console.log('Router <- core:router:start');
      core.events.emit( "core:preloader:task:ready" );
      router.hashChange();
    });

    core.events.on("core:router:update", function(){
      console.log('Router <- core:router:update');
      router.start();
    });
  });
};

module.exports = Router