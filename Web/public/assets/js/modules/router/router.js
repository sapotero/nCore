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
Router.prototype.update = function(options) {
  options = options || {};

  if (options.type){
    this.setType(options.type)
  }
  if (options.path){
    this.setPath(options.path)
  }
  if (options.pathRoot){
    this.setPathRoot(options.pathRoot)
  }
  if (options.hash){
    this.setHash(options.hash)
  }
  if (options.context){
    this.setContext(options.context)
  }
  if (options.handler){
    this.setHandler(options.handler)
  }
  if (options.routes) {
    var route;
    for (route in options.routes) {
      this.add(route, options.routes[route]);
    }
  }
};
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

Router.prototype.start = function() {
  
  this.update({
    pathRoot : '',
    routes   : {
      reports : function(params) {
        console.log('[reports]: ', params);
        core.events.publish("core:dom:application:clear");
        core.modules.reports.start();
      },
      'reports/{id}' : function(params) {
        console.log('[reports/{id}]: ', params);
        core.events.publish("core:dom:application:clear");
        core.modules.reports.show( params.id );
      }
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
  window.addEventListener('hashchange', router.run.bind(this) );

  document.addEventListener('DOMContentLoaded', function(){
    
    core.events.subscribe( "router:checkDefault", function (url) {
      if ( router.check() === false ) {
        location.hash = '#reports';
      }
    });

    core.events.subscribe("core:router:start", function(){
      console.log('Router <- core:router:start');
      core.events.publish( "core:preloader:task:ready" );
    });

  });
};

module.exports = Router