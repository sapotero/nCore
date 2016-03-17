"use strict";

// модуль предоставляющий интерфейс для управления таблицами

var nCore = nCore || {};
nCore.modules.table = (function(){
  var Table = function(init){
    
    if ( !arguments.length ) {
      init = {
        table     : '',
        headClass : 'fr-highlighted',
        sideClass : 'fr-thick'
      };
    }

    if ( !init.hasOwnProperty('table') ) {
      init.table = '';
    }
    if ( !init.hasOwnProperty('headClass') ) {
      init.sideClass = 'fr-highlighted';
    }
    if ( !init.hasOwnProperty('sideClass') ) {
      init.sideClass = 'fr-thick';
    }


    this.table          = init.table;
    this.headClass      = init.headClass;
    this.sideClass      = init.sideClass;
    this.maxCells       = 0;
    this.activeCell     = undefined;
    this.currentRow     = undefined;
    this.headRows       = [];
    this.sideRows       = [];
    this.headRowsCenter = [];
    this.headCellCenter = [];
    this.sideRowsCenter = [];
    this.dataRowsCenter = [];
    this.cellData       = [];
    this.dataRow        = undefined;

    this.customCells      = [];
    this.customCellsQuery = [];
  };

  Table.prototype.calculateMaxCells = function(){
    var table = this.table;
    for(var i=0;i<table.rows.length;i++) {
      var cells = table.rows[i].cells, max = 0;
      for (var c = 0; c < cells.length; c++) {
        max += cells[c].colSpan;
      }
      if (max > maxCells) {
        this.maxCells = max;
      }
    }
    // console.info('1) maxCells:', maxCells);
    return this.maxCells;
  };
  Table.prototype.calculateHeadRows = function() {
    // выбираем все элементы, которые отметил пользователь
    var head_elements = this.table.getElementsByClassName( this.headClass );
    var headRows = [];

    for (var z = 0; z < head_elements.length; z++) {
      headRows.push(head_elements[z].parentNode);
    }
    this.headRows = nCore.core.uniq(headRows);
    // console.dirxml( '2) headRows', this.headRows );
    
    // считаем середины строк шапки
    for (var v = 0; v < this.headRows.length; v++) {
      var coordinates = this.headRows[v].getBoundingClientRect();
      this.headRowsCenter.push( {
        center  : (coordinates.top  + coordinates.bottom)/2,
        left    : coordinates.left,
        right   : coordinates.right,
        element : this.headRows[v]
      });

      for (var t = 0; t < this.headRows[v].cells.length; t++) {
        var element     = this.headRows[v].cells[t],
            coordinates = element.getBoundingClientRect();
        this.headCellCenter.push( {
          left    : coordinates.left,
          right   : coordinates.right,
          element : element
        });
      }
    }
    // console.info( '2.1) headRowsCenter:', this.headRowsCenter );
    // console.info( '2.2) headCellCenter:', this.headCellCenter );
  };
  Table.prototype.calculateSideRows = function() {
    
    // выбираем все элементы, которые отметил пользователь
    var side_elements = this.table.getElementsByClassName( this.sideClass ),
        sideRows = [];
    
    // console.log( 'side_elements', side_elements, table.rows, table.rows.length, table.rows[ table.rows.length-1 ] );
    if ( side_elements.length === 0 ){
      // в последней строке - будут посчитанные данные, в предпоследней - данные которые будут вставлятся без боковины
      side_elements = [ this.table.rows[ this.table.rows.length-1 ] ];

      for (var z = 0; z < side_elements.length; z++) {
        sideRows.push(side_elements[z]);
      }
    } else {
      for (var x = 0; x < side_elements.length; x++) {
        sideRows.push( side_elements[x].parentNode );
      }
    }

    this.sideRows = nCore.core.uniq(sideRows);
    // console.dirxml('3) sideRows', this.sideRows);
    
    // считаем середины строк боковины
    for (var v = 0; v < this.sideRows.length; v++) {
      var coordinates = this.sideRows[v].getBoundingClientRect();
      this.sideRowsCenter.push({
        center: (coordinates.top+coordinates.bottom)/2,
        el: this.sideRows[v]
      });
    };
    // console.info('3.1) sideRowsCenter:', this.sideRowsCenter);
  };
  Table.prototype.calculateDataRow = function(){
    var _tmp = this.table.querySelector('#dataRowForDelete');

    if ( _tmp !== null ) {
      _tmp.parentNode.removeChild( _tmp );
    }

    this.dataRow                  = document.createElement('tr');
    this.dataRow.className        = 'data';
    this.dataRow.id               = 'dataRowForDelete';
    this.dataRow.dataset.cellType = 'data';

    this.table.querySelector('tbody').appendChild( this.dataRow );

    // console.info('4) dataRow:', this.dataRow);

    for (var i = 0; i < this.maxCells; i++) {
      var dataCell                = document.createElement('td');
      dataCell.style.whiteSpace   = 'nowrap';
      dataCell.style.textOverflow = 'ellipsis';
      dataCell.style.overflow     = 'hidden';
      dataCell.style.maxWidth     = 0;
      dataCell.style.border       = '1px solid green';
      this.dataRow.appendChild( dataCell );
      
      var coordinates = dataCell.getBoundingClientRect();

      this.dataRowsCenter.push({
        top     : (coordinates.top  + coordinates.bottom)/2,
        left    : (coordinates.left + coordinates.right)/2,
        element : dataCell
      });
    }
    // console.info('5) dataRowsCenter:', this.dataRowsCenter);
  };
  Table.prototype.removeDataRow = function() {
    this.dataRow.style.display = 'none';
    this.dataRow.parentNode.removeChild(this.dataRow); 
  };
  Table.prototype.datasetPopulate = function( cell, dataCell ){
    var settings = {
      settings: {
      appg : true,
      compare : true,
      total : true,
      percent : true,
      includeSubordinates : true,
      includeSubthemes : true,
      includeThemesAp : true,
      group : true,
      formula : true,
      queryDefault : true,
      chosenOrigin : false,
      queryMonth : false
      }
    };

    var dataSettings = nCore.modules.cell.self.prototype.settings.call(settings);
    // console.log( 'item', item, dataCellSettings[ item ] );
    for ( var item in dataSettings ) {
      if ( dataCell.dataset.hasOwnProperty( item ) ) {
        // если не надо проверять, то добавим сразу
        if ( dataSettings[ item ] === false ){
          cellData.queryMonth = dataCell.dataset.queryMonth;
          cell.dataset[ item ] = dataCell.dataset[ item ];
        } else {
          // перед добавлением проверим что стоит галка у свойства
          if ( dataCell.dataset[ item ] == "true" ) {
            cell.dataset[ item ] = dataCell.dataset[ item ];
          }
        }
      }
    }
  };
  Table.prototype.copyHeadCellAttributes = function() {
    for (var i = this.dataRow.cells.length - 1; i >= 0; i--) {
      var _cell = this.dataRow.cells[i],
          coordinates = _cell.getBoundingClientRect(),
          query = [],
          previousElement;

      for (var z = this.headCellCenter.length - 1; z >= 0; z--) {
        var headCellIterator         = this.headCellCenter[z],
            dataCellHorizontalCenter = (coordinates.left + coordinates.right)/2;

        if ( !(dataCellHorizontalCenter > headCellIterator.left && headCellIterator.right > dataCellHorizontalCenter) ) {
          continue;
        }

        var headCell = headCellIterator.element;
        
        if ( !previousElement || previousElement == headCell ) {
          previousElement = headCell;
        }

        if ( headCell.dataset.hasOwnProperty('query') ) {
          query.push( headCell.dataset.query );
        }
        
        this.datasetPopulate( _cell, headCell );

        query = nCore.core.uniq(query);
        // console.log(' result ', query);

        _cell.dataset.query = JSON.stringify(query);
      }
    }
  };
  Table.prototype.tableCalculate = function() {
    // console.info('query', query);
    var rowSpan   = 0,
        cellIndex = 0,
        rowQuery  = [];

    for (var d = 0; d < this.sideRows.length; d++) {
      
      var row   = this.sideRows[d],
          group = '',
          cellDatasetChosenOrigin,
          query = [];

      // console.group('row');
      // console.info('row', row);

      var diff = 0;

      for (var a = 0; a < row.cells.length; a++) {
        var cell = row.cells[a];

        // console.dirxml('cell', cell);

        if ( cell.dataset.hasOwnProperty('group') ) {
          group = cell.dataset.group;
        }
        if ( cell.dataset.hasOwnProperty('chosenOrigin') ) {
          cellDatasetChosenOrigin = cell.dataset.chosenOrigin;
        }

        if ( cell.rowSpan > 1 ) {
          rowQuery  = [];
          cellIndex = cell.rowSpan;
          rowSpan   = cell.rowSpan;
          
          if ( cell.dataset.hasOwnProperty('query') ) {
            rowQuery.push( cell.dataset.query );
            rowQuery = nCore.core.uniq(rowQuery);
          }
        }

        if ( cell.classList.contains( this.sideClass ) ) {
          if ( cell.dataset.hasOwnProperty('query') && cell.dataset.query != '[]' ) {
            query.push( cell.dataset.query );
          }
          if ( rowQuery.length ) {
            query.concat( rowQuery );
          }
        }
        else {

          
          if ( cell.parentNode.cells.length < this.maxCells ) {
            diff = this.maxCells - cell.parentNode.cells.length;
          }
          
          var ___dataCell = this.dataRowsCenter[a+diff].element,
              ___query = [];


          // console.log( 'without sideClass', cell, cell.cellIndex, cell.parentNode.rowIndex, maxCells, diff, cell.parentNode.cells.length );

          if (rowQuery.length) {
            ___query = ___query.concat(rowQuery);
          }

          ___query = nCore.core.uniq(query);

          var result = [];

          result = result.concat(___query);
          result = result.concat(rowQuery);
          // result = result.concat(___dataCell.dataset.query);

          var __q = [];
          __q.push(nCore.core.uniq(result));
          
          var _cellData = {
            rowIndex  : row.rowIndex,
            cellIndex : cell.cellIndex,
            query     : {
              head: [],
              side: nCore.core.uniq(result)
            }
          };
          // console.log('group', group);
          
          if ( group ) {
            _cellData.group = group;
          };
          
          if ( ___dataCell ) {
            // console.log( 'datacell', ___dataCell.dataset );
            
            if ( ___dataCell.dataset.query ) {
              // console.log( 'datacell', JSON.parse(___dataCell.dataset.query) );
              try { 
                if ( JSON.parse( ___dataCell.dataset.query ) ){
                  _cellData.query.head.push( ___dataCell.dataset.query );
                } 
              }
              catch(e){
                console.log(e);
                _cellData.query.head.push( '['+___dataCell.dataset.query+']' );
              }
              
              _cellData.query.head = JSON.parse(___dataCell.dataset.query);
              // console.log('*****', ___dataCell.dataset.query);
            }

            this.datasetPopulate( _cellData, ___dataCell );

            if ( ___dataCell.dataset.chosenOrigin ) {
              _cellData.origin      = _cellData.hasOwnProperty('origin') ? _cellData.origin : {};
              _cellData.origin.head = ___dataCell.dataset.chosenOrigin;
            }
          }

          // выбраные элементы "Указать источник" из боковины
          if ( cellDatasetChosenOrigin ) {
            _cellData.origin      = _cellData.hasOwnProperty('origin') ? _cellData.origin : {};
            _cellData.origin.side = cellDatasetChosenOrigin;
          }

          this.cellData.push( _cellData );
        }
      }

      console.groupEnd();
      rowSpan  = 0;
    }

    console.groupEnd();
  };
  Table.prototype.calculateTable = function() {
    // generateQueryFromTable = function (table, headClass, sideClass, total){
    // console.group( 'generateQueryFromTable' );
    // console.log( 'params ', this.table, this.headClass, this.sideClass, this.total );

    // считаем макс. кол-во ячеек в таблице
    this.calculateMaxCells();

    // получаем строки из шапки таблицы
    this.calculateHeadRows();

    // получаем строки из боковины таблицы
    this.calculateSideRows();

    // добавляем специальную строку с данными
    this.calculateDataRow();

    // console.groupCollapsed('dateCell query calculate');

    // копируем свойства в ячейках шапки сверху вниз
    this.copyHeadCellAttributes();

    // копируем свойства в ячейках боковины и клеи с шапкой
    this.tableCalculate();

    // console.groupEnd();

    this.removeDataRow();
  };

  // Тут хранятся все таблички, через фабрику создаем новые таблички для расчёта
  var TableFactory = function(){
    this.tables = {};
  };
  TableFactory.prototype.clear = function() {
    this.tables = {};
  };
  TableFactory.prototype.exist = function(table) {
    return this.tables.hasOwnProperty( table );
  };
  TableFactory.prototype.add    = function(table) {
    var config = {
      table: table,
      headClass: 'fr-highlighted',
      sideClass: 'fr-thick'
    };

    if ( table.id === '' ){
      table.id =  nCore.modules.table.generateId();
    }
    if ( !this.exist() ) {
      this.tables[ table.id ] = new Table(config);
    }
    return this.tables[ table.id ];
  };
  TableFactory.prototype.remove = function(table) {
    delete this.tables[ table.id ];
  };
  TableFactory.prototype.last = function(table) {
    return this.tables[ Object.keys( this.tables )[0] ];
  };
  TableFactory.prototype.execute = function() {
    console.log('execute start!');
    var tables = {};

    // считаем таблицы
 
    this.clear();

    var _tables = document.querySelectorAll('.fr-element.fr-view > table');

    for (var i = 0; i < _tables.length; i++) {
      this.add( _tables[i] );
    }

    for (var id in this.tables) {

      var table = this.tables[id];
      table.calculateTable();

      console.log('tables', id, table);

      var newCellFormat = [];
      table.cellData.forEach( function( cell, i ,array ){
        var formatter = new nCore.format.convert( cell );
        newCellFormat.push( formatter.table() );
      });
      tables[table.table.id] = newCellFormat;
    }

    // // считаем кастомные ячейки
    // var custom = this.last();
    // custom.calculateCustomCells();

    // custom.customCellsQuery.forEach( function( cell, i ,array ){
    //   var formatter = new nCore.format.convert( cell );
    //   cells.push( formatter.custom() );
    // });
    var cells = nCore.modules.customCell.calculate();


    var data = {
      data        : tables,
      customCells : cells
    };

    nCore.modules.table.event.publish('calculateQuery', data);
  };



  var nCoreTableEvent = {},
      maxCells = 0,
      activeCell = {},
      tf = new TableFactory(),
  init = function(){
    nCore.attachTo( nCore.modules.table.event );
   },
  active = function(){
    return activeCell;
  },
  setActive = function(el){
    activeCell = el;
  },
  event = function event(){
    return nCoreTableEvent;
  },
  random = function() {
    return ( window.performance.now().toString(36).slice(6,-1) + Math.random().toString(36).slice(2,-1) ).toString(36);
  };

  return {
    init       : init,
    event      : event,
    active     : active,
    setActive  : setActive,
    generateId : random,
    factory    : new TableFactory()
  };
})();
nCore.modules.table.init();