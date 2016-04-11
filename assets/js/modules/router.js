'use strict';

core.modules.router = (function() {

  function Route(path, callback, router) {
    this.path     = path;
    this.callback = callback;
    this.router   = router;
    this.values   = [];
  };
  Route.prototype.regex =  function() {

    var path = this.path;

    if (typeof path === 'string') {
      return new RegExp('^' + path.replace(/\//g, '\\/').replace(this.router.namedParam.match, this.router.namedParam.replace) + '$');
    }
    return path;
  };
  Route.prototype.params =  function() {

    var obj = {},
      name, values = this.values,
      params = values,
      i, t = 0,
      path = this.path;

    if (typeof path === 'string') {
      t = 1;
      params = path.match(this.router.namedParam.match);
    }

    for (i in params) {
      name = t ? params[i].replace(this.router.namedParam.match, '$1') : i;
      obj[name] = values[i];
    }

    return obj;
  };
  Route.prototype.test =  function(url) {
    // console.log('Route:test -> url: ', url, this.regex(), url.match(this.regex()) );
    
    var matches;
    if ( matches = url.match(this.regex()) ) {
      this.values = matches.slice(1);
      return true;
    }
    return false;
  };
  Route.prototype.run =  function() {
    if (typeof this.callback === 'string') {
      return this.router.handler[this.callback](this.params());
    }
    return this.callback.apply(this.router.context, [this.params()]);
  };

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
  };
  Router.prototype.bindEvents = function() {
    window.addEventListener('hashchange', this.run.bind(this) );
  };
  Router.prototype.start = function() {
    
    this.update({
      pathRoot : '',
      routes   : {
        reports : function(params) {
          console.log('[reports]: ', params);
          core.modules.reports.start();
        },
        'reports/{id}' : function(params) {
          console.log('[reports/{id}]: ', params);
          core.modules.reports.show( params.id );
        }
      }
    });
    this.bindEvents();
    this.run();
  };
  Router.prototype.stop = function() {
    // console.log( 'Router: stop' );
  };
  Router.prototype.destroy = function() {
    // console.log( 'Router: destroy' );
  };

  var router = new Router();

  core.events.subscribe("core::start:all", function(){
    console.log('core::start:router');
    router.start();
  });

  return router;
}());