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
      nCoreGlobalQuery,
      nCoreDocumentSettingTab = 'documentQueryPane',
      nCoreDocumentId = '',
      nCoreRoot,
      // nCoreDocumentSave,
      nCoreShowCellSettings,
      nCoreDocumentEvent = {},
      nCoreIsNew = true,
      nCoreTitle,
      nCoreType = 'report',
      nCoreShowSettings = false,
      nCoreName = '',
      nCoreDescription = '',
      nCoreDocumentCellQuery = {};

  var init = function (config){

    nCoreRoot = document.getElementById('nCoreDocumentId');
    nCore.attachTo( nCore.document.root );
    
    nCore.document.root.publish( 'loadItem', [ 'documents', 'forms' ] );
    nCore.document.root.publish( 'loadCriteria' );
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
  setShowSettings = function setShowSettings(params){
    nCoreShowSettings = params;
  },
  ShowSettings = function ShowSettings(){
    return nCoreShowSettings;
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
    nCoreDocumentId        = config._id;
    nCoreTitle             = config.title;
    nCoreType              = config.type;
    nCoreName              = config.name;
    nCoreDescription       = config.description;
    nCoreDocumentCellQuery = config.query;
    nCoreIsNew             = false;

    if ( config.body ) {
      nCore.document.root.publish('initEditor', Base64.decode( config.body ));
    };
    
    // nCoreRoot.textContent = config.title;
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
  generateNew = function generateNew(){
    nCoreDocumentId = '',
    nCoreIsNew = true,
    nCoreName = '',
    nCoreDescription = '',
    nCoreDocumentCellQuery = {};
    nCore.document.setTitle('Новый документ');
  },
  save = function save(conf){
    console.log('save conf', conf);
  },
  title = function title(){
    return nCoreTitle;
  },
  setTitle = function setTitle(t){
    nCoreTitle = t ? t : nCoreTitle;
    document.querySelector('#nCoreDocumentHeadLine').textContent = nCoreTitle;
  },
  globalQuery = function globalQuery (){
    return nCoreGlobalQuery
  },
  setGlobalQuery = function setGlobalQuery (query){
    nCoreGlobalQuery = query
  },
  documentSettingTab = function documentSettingTab (){
    return nCoreDocumentSettingTab
  },
  setDocumentSettingTab = function setDocumentSettingTab (tab){
    nCoreDocumentSettingTab = tab
  },
  showCellSettings = function showCellSettings (){
    return nCoreShowCellSettings
  },
  setShowCellSettings = function setShowCellSettings (bool){
    nCoreShowCellSettings = bool
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
    setShowSettings : setShowSettings,
    ShowSettings    : ShowSettings,
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
    setPeriodEnd    : setPeriodEnd,
    globalQuery     : globalQuery,
    setGlobalQuery  : setGlobalQuery,
    
    documentSettingTab     : documentSettingTab,
    setDocumentSettingTab  : setDocumentSettingTab,
    showCellSettings       : showCellSettings,
    setShowCellSettings    : setShowCellSettings,
    
    generateNew     : generateNew
  };
})();
