"use strict";

// модуль предоставляющий интерфейс для управления кастомными ячейками

var nCore = nCore || {};
nCore.modules.customCell = (function(){
  var CustomCell = function(cell){

    if ( cell.hasOwnProperty('nodeName') ){
      this.element = cell;
    }

    this.id      = '';
    this.value   = '';
    this.element = '';

    return this;
  };
  CustomCell.prototype.result = function(){
    return {
      id:   this.element.id,
      data: this.element.dataset
    };
  };
  CustomCell.prototype.find = function(){
    this.element = document.getElementById( this.id );
    return this;
  };
  CustomCell.prototype.populate = function(){
    this.element.textContent = this.value;
  };

  var CustomCellFactory = function(){
    this.cells = {};
    this.query = [];
  };
  CustomCellFactory.prototype.clear = function() {
    this.cells = {};
    this.query = [];
  };
  CustomCellFactory.prototype.populate = function( calculatedCells ) {
    var root = this;

    root.findAll();
    for (var i = 0; i < calculatedCells.length; i++) {
      var calculatedCell = calculatedCells[i];
      if ( root.cells.hasOwnProperty( calculatedCell.id ) ) {
        
        var cell = root.cells[ calculatedCell.id ];
        
        cell.id    = calculatedCell.id;
        cell.value = calculatedCell.value;

        cell.find().populate();
      }
    }
  };
  CustomCellFactory.prototype.findAll = function() {
    var cells = document.querySelectorAll('.calculationCell');
    
    if ( cells.length ) {
      for (var i = 0; i < cells.length; i++) {
        this.add( cells[i] );
      }
    }
    
    return this.cells;
  };
  CustomCellFactory.prototype.exist = function(cell) {
    return this.cells.hasOwnProperty( cell );
  };
  CustomCellFactory.prototype.add = function(cell) {
    this.cells[ cell.id ] = new CustomCell(cell);
    return this.cells[ cell.id ];
  };
  CustomCellFactory.prototype.remove = function(cell) {
    delete this.cells[ cell.id ];
  };
  CustomCellFactory.prototype.calculate = function() {
    var root = this;

    root.clear();
    root.findAll();

    for (var customCell in this.cells) {
      // console.log( 'customCell', customCell );

      root.cells[customCell].id = customCell;

      var formatter = new nCore.format.convert( customCell );
      root.data = {};
      root.data[customCell] = [];

      root.data[customCell].push( formatter.custom() );
    }
    // debugger;
    // console.log( 'root.query',root.query );
    return root.data;
  };

  return new CustomCellFactory();
})();