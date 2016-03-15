"use strict";

// модуль предоставляющий интерфейс для взаимодействия по сети
/**
 * core module
 * @module nCore/query
 */
var nCore = nCore || {};
nCore.query = (function(){

  var Query = function(config){
    if ( !arguments.length ) {
      config = {};
    }

    this.config = config || { query: 'nCoreQuery' };
    this.root= config.query;
  };

  Query.prototype = {
    // произвольный пост запрос
    post: function( url, data ){
      return $.post( url, data );
    },
    put: function( url, data ){
      return $.ajax({
        type        : "PUT",
        url         : url,
        data        : JSON.stringify( data ),
        contentType : 'application/json',
        dataType    : 'json'
      });
    },
    // произвольный гет запрос
    get: function( url, data ){
      return $.get( url, data );
    },
    // произвольный гет запрос
    getTemplate: function( url, data ){
      return $.get( url, data );
    }
  };

  return new Query();
})();