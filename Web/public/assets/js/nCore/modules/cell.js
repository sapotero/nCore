"use strict";

// модуль предоставляющий интерфейс для "ячейки"

var nCore = nCore || {};
nCore.modules.cell = (function(){
  var cells = [], activeCell;

  // nCore.modules.table.activeCell.subscribe('setCell', function(cell){
  //   activeCell = cell;
  // });

  var Cell = function(data) {
    this.index     = 0;
    this.element   = activeCell;
    this.items     = data.items       || [];
    this.query     = data.query       || undefined;
    this.caption   = data.caption     || undefined;
    this.parent    = data.parent      || this;
    this.childs    = data.childrens   || [];

    if ( data.parent ) {
      this.parent.addChild(this); 
    };
  };
   
  Cell.prototype = {
    // get/set parent/childrens
    parent        : function(data){
      return this.parent;
     },
    childrens     : function(){
      return this.childs;
     },
    setParent     : function(data){
      this.parent = data;
     },
    setChilds     : function(data){
      this.childrens = data;
     },
    addChild      : function(data){
      this.childs.push(data);
     },
    hasChilds     : function() {
      return this.childs.length > 0;
     },
    hasParent     : function() {
      return this.parent == this;
     },
    // iterator template
    add           : function(data) {
      this.items.push(data);
      return this.next();
     },
    first         : function() {
      this.reset();
      return this.next();
     },
    next          : function() {
      return this.items[this.index++];
     },
    hasNext       : function() {
      return this.index <= this.items.length;
     },
    reset         : function() {
      this.index = 0;
     },
    each          : function(callback) {
      for (var item = this.first(); this.hasNext(); item = this.next()) {
        callback(item);
      }
     }
  };

  var newCell = function(config){
    var cell = new Cell(config);
    cells.push(cell);
    return cell;
  };

  var init = function(){
  };

  return {
    newCell: newCell,
    cells: cells,
    init: init
  }
})();