"use strict";

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
module.exports = Route