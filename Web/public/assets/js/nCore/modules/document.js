"use strict";

// модуль предоставляющий интерфейс для работы с документом (отчет, печатная форма, бизнес-процесс)

var nCore = nCore || {};
nCore.document = (function(){
  var _current_date    = new Date(),
      nCoreCurrentYear = _current_date.getFullYear(),
      nCorePeriodStart = (_current_date.getFullYear() + "-" + ("0"+_current_date.getMonth()+1).slice(-2) + "-" + ("0"+_current_date.getDate()).slice(-2) ),
      nCorePeriodEnd   = (_current_date.getFullYear() + "-" + ("0"+_current_date.getMonth()+1).slice(-2) + "-" + ("0"+_current_date.getDate()).slice(-2) ),
      nCoreDocumentUserId       = null,
      nCoreDocumentDepartmentId = null,

      nCoreDocumentId = '',
      nCoreRoot = {},
      nCoreDocumentSave,
      nCoreDocumentEvent = {},
      nCoreIsNew = true,
      nCoreTitle,
      nCoreType = 'report',
      nCoreName = '',
      nCoreDescription = '',
      nCoreDocumentCellQuery = {};

  var init = function (config){
    var config = {
      nCoreDocumentId   : 'nCoreDocumentId',
      nCoreDocumentSave : 'nCoreDocumentSave'
    };

    nCoreRoot         = document.getElementById( config.nCoreDocumentId );
    nCoreDocumentSave = document.getElementById( config.nCoreDocumentSave );

    nCoreRoot.textContent += "_" + nCoreDocumentId;
    nCore.attachTo( nCore.document.root );
  },
  id = function () {
    return nCoreDocumentId;
  },
  userId = function () {
    return nCoreDocumentUserId;
  },
  setUserId = function (id) {
    nCoreDocumentUserId = id;
  },
  departmentId = function () {
    return nCoreDocumentDepartmentId;
  },
  setDepartmentId = function (id) {
    nCoreDocumentDepartmentId = id;
  },
  periodStart = function () {
    return nCorePeriodStart;
  },
  setPeriodStart = function (date) {
    nCorePeriodStart = date;
  },
  periodEnd = function () {
    return nCorePeriodEnd;
  },
  setPeriodEnd = function (date) {
    nCorePeriodEnd = date;
  },
  root = function root(){
    return nCoreRoot;
  },
  setName = function setName(name){
    nCoreName = name;
  },
  name = function name(){
    return nCoreName;
  },
  type = function type(){
    return nCoreType;
  },
  setType = function setType(type){
    nCoreType = type;
  },
  setDescription = function setDescription(description){
    nCoreDescription = description;
  },
  description = function description(){
    return nCoreDescription;
  },
  setCellQuery = function setCellQuery(data){
    console.log('setCellQuery', data);
    nCoreDocumentCellQuery = data;
  },
  cellQuery = function cellQuery(){
    return nCoreDocumentCellQuery;
  },
  event = function event(){
    return nCoreDocumentEvent;
  },
  newDocument = function newDocument() {
    return nCoreIsNew;
  },
  reset = function reset() {
    nCoreIsNew = true;
  },
  setAttributes = function setAttributes(data){
    // nCoreIsNew = false;
    
    if ( data.hasOwnProperty('periodStart') ) {
      nCorePeriodStart = data.periodStart;
    };
    if ( data.hasOwnProperty('periodEnd') ) {
      nCorePeriodEnd = data.periodEnd;
    };

    nCore.document.root.publish('setDocumentAttributes', data);
    

  },
  load = function load(config){
    console.log('+++', config);

    nCoreDocumentId        = config._id
    nCoreTitle             = config.title
    nCoreType              = config.type
    nCoreName              = config.name
    nCoreDescription       = config.description
    nCoreDocumentCellQuery = config.query
    nCoreIsNew             = false

    document.querySelector( '.fr-wrapper' ).classList.remove('show-placeholder');
    document.querySelectorAll( '.fr-element.fr-view' )[ document.querySelectorAll( '.fr-element.fr-view' ).length-1 ].innerHTML = Base64.decode( config.body );
  },
  createNew = function createNew(url){
    var overlayEl = mui.overlay('on');

    // set overlay options
    var options = {
      'keyboard': true,  // teardown when <esc> key is pressed (default: true)
      'static'  : false, // maintain overlay when clicked (default: false)
      'onclose' : function() {
      }
    };
    // initialize with child element
    var m = document.createElement('div');
    m.style.width = '400px';
    m.style.height = '100px';
    m.style.margin = '10% auto';
    m.style.padding = '10% auto';
    m.style.backgroundColor = '#fff';
    m.classList.toggle('mui-panel');
    m.classList.toggle('mui--z5');
    m.innerHTML = '<h4>Создание нового документа</h4><div class="loader"></div>';

    mui.overlay('on', options, m);
    setTimeout( function(){ 
      mui.overlay('off');
      $bodyEl.addClass('hide-sidedrawer');
      location.hash = "#tables/"+ ( url ? url: "new" )
    },1000);
  },
  save = function save(conf){
    console.log('save conf', conf);
  },
  title = function title(){
    return nCoreTitle;
  },
  setTitle = function setTitle(t){
    nCoreTitle = t;
    document.querySelector('#nCoreDocumentHeadLine').textContent = nCoreTitle;
  };

  
  return {
    init            : init,
    id              : id,
    name            : name,
    description     : description,
    type            : type,
    root            : root,
    event           : event,
    load            : load,
    reset           : reset,
    isNewDocument   : newDocument,
    cellQuery       : cellQuery,
    setName         : setName,
    setType         : setType,
    title           : title,
    setTitle        : setTitle,
    setDescription  : setDescription,
    setAttributes   : setAttributes,
    setCellQuery    : setCellQuery,
    userId          : userId,
    setUserId       : setUserId,
    departmentId    : departmentId,
    setDepartmentId : setDepartmentId,
    periodStart     : periodStart,
    setPeriodStart  : setPeriodStart,
    periodEnd       : periodEnd,
    setPeriodEnd    : setPeriodEnd
  };
})();
