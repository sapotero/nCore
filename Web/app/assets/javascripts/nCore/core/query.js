"use strict";

// модуль предоставляющий интерфейс для взаимодействия по сети
/**
 * core module
 * @module nCore/query
 */
var nCore = nCore || {};
nCore.query = (function(){
  var host = '';

  var request, root, body, button,
  template = ' <form class="form-horizontal fm"> <div class="form-group"> <label for="nCoreTabConfigTextFontSize" class="col-lg-3 control-label">Поле</label> <div class="col-lg-9"> <select class="form-control" id="nCoreTabConfigTextFontSize"> </select> </div></div><div class="form-group" style="padding: 10px auto ;"> <label for="nCoreTabConfigTextFontSize" class="col-lg-3 control-label">Условие</label> <div class="col-lg-9"> <select class="form-control" id="nCoreTabConfigTextFontSize"> </select> </div></div><div class="form-group"> <label class="control-label col-lg-3 " for="focusedInput">Значение</label> <div class="col-lg-9"> <input class="form-control" id="focusedInput" type="text" value=""> </div></div></form>';

  // рисуем форму поиска
  /**
   * @function init
   * @description Выполняется при загрузке модуля
   */
  var init = function(config){
    var config = { nCoreQuery: 'nCoreQuery' }
    root   = document.getElementById( config.nCoreQuery );
   },

  // произвольный пост запрос
  post = function( url, data ){
    return $.post( host + url, data );
   },
  put = function( url, data ){
    return $.ajax({
      type        : "PUT",
      url         : host + url,
      data        : JSON.stringify( data ),
      contentType : 'application/json',
      dataType    : 'json'
    });
   },
  // произвольный гет запрос
  get  = function( url, data ){
    return $.get( host + url, data );
   },
  // произвольный гет запрос
  getTemplate  = function( url, data ){
    return $.get( url, data );
   },

  // получаем критерии поиска
  getQuery  = function( url ){
    console.log('query -> getQuery -> ', url);
   },

  // получаем параметры для выбранного критерия поиска
  getQueryParam  = function( config ){
    console.log('query -> getQueryParam -> ', config);
   },

  // клик на добавление норвого критерия поиска
  createSearchRequestForm = function(data){
    nCore.query.request.publish('createSearchRequestForm', data);
   };

  return {
    init                    : init,
    post                    : post,
    get                     : get,
    put                     : put,
    getTemplate             : getTemplate,
    getQuery                : getQuery,
    getQueryParam           : getQueryParam,
    createSearchRequestForm : createSearchRequestForm,
    request : request
  }
})();
nCore.query.init();