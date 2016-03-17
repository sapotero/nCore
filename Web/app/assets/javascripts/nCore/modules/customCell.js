"use strict";

// модуль предоставляющий интерфейс для управления кастомными ячейками

var nCore = nCore || {};
nCore.modules.customCell = (function(){
  var CustomCell = function(cell){
    if ( !arguments.length ) {
      cell = '';
    }

    this.element = cell;
  };
  CustomCell.prototype.result = function(){
    return {
      id:   this.element.id,
      data: this.element.dataset
    };
  };

  var CustomCellFactory = function(){
    this.cells = {};
  };
  CustomCellFactory.prototype.clear = function() {
    this.cells = {};
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
    var customCellsQuery = [],
        root = this;

    root.clear();

    var customCells = document.querySelectorAll('.calculationCell');

    for (var z = 0; z < customCells.length; z++) {
      root.add( customCells[z] );
    }

    for (var customCell in this.cells) {
      customCellsQuery.push( root.cells[customCell].result() );
    }
    return customCellsQuery;
  };

  return new CustomCellFactory();
})();