"use strict";
/**
 * core module
 * @module nCore/templates
 */

var nCore = nCore || {};
nCore.templates = (function(){
  var template = '';

  var Template = function(template){
    if ( !arguments.length ) {
      template = {};
    }
    this.template = template.template || '';
  };

  Template.prototype = {
    render: function (callback){
      return nCore.query.getTemplate( 'templates/' + this.template + '.html', {})
      .success(function(data){
        // console.log('getTemplate', data);
        if (callback && typeof(callback) === 'function') {
          callback.call(this, data);
        }
      }).error(function(data){
        console.error('[!] getTemplate', data)
      });
    },
    notPermit: function(callback){
      var template = this instanceof nCore.templates.render ? this : new nCore.templates.render();
      return nCore.query.getTemplate( 'templates/shared/notPermit.html', {})
      .success(function(data){
        // console.log('getTemplate', data);
        if (callback && typeof(callback) === 'function') {
          callback.call(this, data);
        }
      }).error(function(data){
        console.error('[!] notPermit', data)
      });
    }
  };

  return {
    render : Template
  };
})();