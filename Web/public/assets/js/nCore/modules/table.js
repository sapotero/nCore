"use strict";

// модуль предоставляющий интерфейс для управления таблицами

var nCore = nCore || {};
nCore.modules.table = (function(){
  var nCoreTableEvent = {},
      table,
      maxCells = 0,
      currentCell,
      currentRow,
      activeCell = {},
      mergeCells = [],
  init = function(config){
    var config = { table: 'nCoreTable' };
    
    nCore.attachTo( nCore.modules.table.event );
    var initialTable = document.getElementById(config.table);
    
    if ( typeof(initialTable) !== 'undefined' && initialTable !== null ) {
      console.log( 'error init: table undefined', typeof(initialTable), initialTable );
      table = ( initialTable ? initialTable : undefined);
      countMaxCells();
      addEventListener();

      nCore.attachTo( nCore.modules.table.activeCell );
    } else {
      return false;
    }


   },
  config = function(){
    console.log(table, max_cells)
   },
  row    = function(mode, index){
    var index = parseInt( parseInt(index) == NaN ? 0 : index );
    
    console.log(currentRow, index);

    switch (mode) {
      case 'insert':
        row = table.insertRow( currentRow + index );
        for (var i = 0; i < maxCells; i++) {
          row.insertCell(0);
        };

        currentRow = (index == 0 ? currentRow + 1 : currentRow);

        break;
      case 'delete':
        row = table.deleteRow( currentRow );
        break;
      default:
        console.log('default')
        break;
    };
   },
  column = function(mode, index){

    switch (mode) {
      case 'insert':
        for (var i = table.rows.length - 1; i >= 0; i--) {
          table.rows[i].insertCell( currentCell + index );
        };
        currentCell = (index == 0 ? currentCell + 1 : currentCell);
        break;
      case 'delete':
        for (var i = table.rows.length - 1; i >= 0; i--) {
          table.rows[i].deleteCell( currentCell + index );
        };
        currentCell = (index == 0 ? currentCell + 1 : currentCell);
        break;
      default:
        console.log('default column')
        break;
    };
    mergeCells = {};
    countMaxCells();
   },
  merge = function(mode){
    switch (mode) {
      case 'h':
        for (var r = table.rows.length - 1; r >= 0; r--) {
          var row   = table.rows[r],
              cells = [];

          for (var i = row.cells.length - 1; i >= 0; i--) {

            var cell = row.cells[i];
            if ( cell.classList.contains('info') ) {
              cells.push(cell);
            };
          };

          if (cells.length) {
            var firstCell = cells.shift();
            firstCell.colSpan = cells.length + 1;

            for (var i = cells.length - 1; i >= 0; i--) {
              cells[i].parentNode.removeChild(cells[i]);
            };
          };
        };
        break;
      case 'v':
        var cells = [];

        for (var r = table.rows.length - 1; r >= 0; r--) {
          var row   = table.rows[r],
              cells = [];

          for (var i = row.cells.length - 1; i >= 0; i--) {
            var cell = row.cells[i];
            if ( cell.classList.contains('info') ) {
              cells.push(cell);
            };
          };
        };

        // if (cells.length) {
        var ids       = table.getElementsByClassName("info"),
            idsLength = ids.length,
            top       = ids[0];

        for (var i = 1; i < idsLength; i++) {
          ids[i].parentNode.removeChild(ids[i])
        };
        top.rowSpan = idsLength;
        break;
      default:
        break;
    }


    clearSelection();
   },
  clearSelection = function(){
    console.log('clearSelection');
    mergeCells = {};

    var ids = table.getElementsByTagName('td');
    for(var i = 0; i<ids.length; i++){
      var td = ids[i];
      td.className = '';
    };
    // for(var i = 0; i<table.rows.length; i++){
    //   var row = table.rows[i];
    //   row.className = '';
    // };
   },
  countMaxCells = function(){
    for(var i = 0; i<table.rows.length; i++){
      var row = table.rows[i];
      if ( row.cells.length ) {
        maxCells = row.cells.length;
      };
    }
   },
  activeCell = function(){
    return activeCell;
   },
  addEventListener = function(){
    table.addEventListener('click', function(e){
      var el = e.path[0];
      activeCell = el;

      if ( el.nodeName != 'TBODY' ) {
        currentRow  = el.parentNode.rowIndex;
        currentCell = el.cellIndex;
        if (e.ctrlKey) {
            el.classList.toggle('info');

            var mergeCellName = currentRow + '_' + currentCell;

            if ( mergeCells.hasOwnProperty( mergeCellName ) ) {
              delete mergeCells[ mergeCellName ];
            } else {
              mergeCells[ mergeCellName ]  = {
                row:  currentRow,
                cell: currentCell
              };
            };
            activeCell.classList.toggle('primary');
            console.log(currentCell, currentRow, mergeCells);
        } else {
          mergeCells = {};
          clearSelection();
          el.classList.toggle('success');
        }
      };

      el.parentNode.className = 'active';
      activeCell.classList.toggle('primary');
      nCore.modules.table.activeCell.publish('setCell', el);
      console.log( activeCell );
    });
   },
  generateQueryFromTable = function (table, headClass, sideClass, total){
    var table          = table,
        headClass      = headClass,
        sideClass      = sideClass,
        maxCells       = 0,
        headRows       = [],
        sideRows       = [],
        headRowsCenter = [],
        sideRowsCenter = [],
        dataRowsCenter = [],
        cellData       = [],
        head_elements,
        side_elements;

    function cleanArray(actual) {
      var newArray = new Array();
      for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
          newArray.push(actual[i]);
        }
      }
      return newArray;
    };
    function findUpTag(el, tag) {
      while (el.parentNode) {
        el = el.parentNode;
        if (el.tagName === tag)
          return el;
      }
      return null;
    }

    // считаем макс. кол-во ячеек в таблице
    for(var i=0;i<table.rows.length;i++) {
      var cells = table.rows[i].cells, max = 0;
      for (var c = 0; c < cells.length; c++) {
        max += cells[c].colSpan;
      };
      if (max > maxCells) {
        maxCells = max;
      };
    }
    // console.log('max:', maxCells);

    // выбираем все элементы, которые отметил пользователь
    head_elements = table.getElementsByClassName( headClass );
    // получаем уникальные строки из шапки таблицы
    for (var z = 0; z < head_elements.length; z++) {
      headRows.push(head_elements[z].parentNode)
    };
    headRows = uniq(headRows);

    // выбираем все элементы, которые отметил пользователь
    side_elements = table.getElementsByClassName( sideClass );
    // console.log( 'side_elements', side_elements, table.rows, table.rows.length, table.rows[ table.rows.length-1 ] );
    
    if ( side_elements.length == 0 ){
      // в последней строке - будут посчитанные данные, в предпоследней - данные которые будут вставлятся без боковины
      side_elements = [ table.rows[ table.rows.length-1 ] ];

      for (var z = 0; z < side_elements.length; z++) {
        sideRows.push(side_elements[z])
      };
    } else {
      for (var z = 0; z < side_elements.length; z++) {
        sideRows.push( side_elements[z].parentNode );
      };
    }

    sideRows = uniq(sideRows);

    var _tmp = document.getElementById('dataRowForDelete');
    // console.log('tmp', _tmp);

    if ( _tmp !== null ) {
      _tmp.parentNode.removeChild( _tmp );
    };

    // добавляем специальную строку с данными
    var dataRow = document.createElement('tr');
    dataRow.className        = 'data';
    dataRow.id               = 'dataRowForDelete';
    dataRow.dataset.cellType = 'data';
    table.querySelector('tbody').appendChild(dataRow);

    // считаем середины строк шапки
    for (var v = 0; v < headRows.length; v++) {
      var coordinates = headRows[v].getBoundingClientRect();
      headRowsCenter.push( (coordinates.top+coordinates.bottom)/2 );
    };

    // считаем середины строк боковины
    for (var v = 0; v < sideRows.length; v++) {
      var coordinates = sideRows[v].getBoundingClientRect();
      // console.log('coordinates',coordinates);
      // // проверяем строки
      // var point = document.createElement('div');
      // point.className  = "point-side";
      // point.style.top  = (coordinates.top+coordinates.bottom)/2 + 'px';
      // point.style.left = (coordinates.left+coordinates.right)/2 + 'px';
      // document.body.appendChild(point);
      sideRowsCenter.push( {center: (coordinates.top+coordinates.bottom)/2, el: sideRows[v] } );
    };

    for (var i = 0; i < maxCells; i++) {
      var queryArray = [],
      dataCell                    = document.createElement('td');
      dataCell.style.whiteSpace   = 'nowrap';
      dataCell.style.textOverflow = 'ellipsis';
      dataCell.style.overflow     = 'hidden';
      dataCell.style.maxWidth     = 0;

      dataRow.appendChild(dataCell);
      coordinates = dataCell.getBoundingClientRect();

      dataRowsCenter.push( (coordinates.top+coordinates.bottom)/2 );
    };


    for (var i = dataRow.cells.length - 1; i >= 0; i--) {
      var _cell = dataRow.cells[i],
          coordinates = _cell.getBoundingClientRect(),
          query = [],
          previousElement;

      for (var z = headRowsCenter.length - 1; z >= 0; z--) {
        var center = headRowsCenter[z];

        var headCell = document.elementFromPoint( (coordinates.left + coordinates.right)/2 , center );

        if ( !previousElement || previousElement == headCell ) {
          previousElement = headCell;
          // console.log( previousElement, headCell );
        }


        if ( headCell.dataset.hasOwnProperty('query') ) {
          query.push( headCell.dataset.query );
        };
        if ( headCell.dataset.hasOwnProperty('appg') ) {
          _cell.dataset.appg = headCell.dataset.appg;
        };
        if ( headCell.dataset.hasOwnProperty('total') ) {
          _cell.dataset.total = headCell.dataset.total;
        };
        if ( headCell.dataset.hasOwnProperty('percent') ) {
          _cell.dataset.percent = headCell.dataset.percent;
        };
        if ( headCell.dataset.hasOwnProperty('group') ) {
          _cell.dataset.group = headCell.dataset.group;
        };

      };

      query = uniq(query);
      if ( query.length ) {
        _cell.dataset.query = query;
      };
    };

    var rowSpan  = 0,
        rowQuery = [],
        cellData = [];
    for (var d = 0; d < sideRows.length; d++) {
      
      var row   = sideRows[d],
          group = '',
          query = [],
          cellSettings = {};
      // console.log('row', row);

      for (var a = 0; a < row.cells.length; a++) {
        var cell = row.cells[a];

        if ( cell.dataset.hasOwnProperty('group') ) {
          group = cell.dataset.group
        };

        if ( cell.rowSpan > 1 ) {
          rowQuery = [];

          rowSpan = cell.rowSpan;
          if ( cell.dataset.hasOwnProperty('query') ) {
            rowQuery.push( cell.dataset.query );
            rowQuery = uniq(rowQuery);
          };
        };

        if ( cell.classList.contains(sideClass) ) {

          if ( cell.dataset.hasOwnProperty('query') ) {
            query.push( cell.dataset.query );
          };
          if ( rowQuery.length ) {
            query.concat( rowQuery );
          };

        }
        else {

          var coordinates = cell.getBoundingClientRect(),
              ___dataCell = document.elementFromPoint( (coordinates.left + coordinates.right)/2 , dataRowsCenter[a] ),
              ___query = [];

          if (rowQuery.length) {
            ___query = ___query.concat(rowQuery);
          };

          ___query = uniq(query);

          var result = [],
              appg   = false;

          result = result.concat(___query);
          result = result.concat(rowQuery);
          // result = result.concat(___dataCell.dataset.query);

          var __q = [];
          __q.push(uniq(result));
          
          var _cellData = {
            rowIndex  : row.rowIndex,
            cellIndex : cell.cellIndex,
            query     : {
              head: [],
              side: uniq(result)
            }
          };
          // console.log('group', group);
          
          if ( group ) {
            _cellData.group = group;
          };

          //////////
          // test //
          //////////
          
          // var div        = document.createElement('div');
          // div.style.position = 'absolute';
          // div.style.border = '2px solid red';
          // div.style.width = '2px';
          // div.style.height = '2px';
          // div.style.top  = dataRowsCenter[a]+'px';
          // div.style.left = ((coordinates.left + coordinates.right)/2)+'px';
          // div.classList.add('POINT');
          // document.body.appendChild(div);
          // console.log('**row', ___dataCell, document.elementFromPoint( (coordinates.left + coordinates.right)/2 , dataRowsCenter[a] ) );
          
          if ( ___dataCell ) {
            if ( ___dataCell.dataset.query ) {
              _cellData.query.head.push(___dataCell.dataset.query);
            };

            if ( ___dataCell.dataset.appg ) {
              _cellData.appg = ___dataCell.dataset.appg
            };
            if ( ___dataCell.dataset.total ) {
              _cellData.total = ___dataCell.dataset.total
            };
            if ( ___dataCell.dataset.percent ) {
              _cellData.percent = ___dataCell.dataset.percent
            };
          };


          cellData.push( _cellData );
        };
      };

      // console.log('row query -> ', query);
      rowSpan  = 0;
      // rowQuery = [];
    };

    dataRow.style.display = 'none';
    dataRow.parentNode.removeChild(dataRow);
    
    console.log( 'cellData:', cellData );
    // console.log( 'str', JSON.stringify(cellData) );
    nCore.modules.table.event.publish('calculateQuery', cellData);
   },
  event = function event(){
    return nCoreTableEvent;
   },
  uniq = function (a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
      var type = typeof item;
      if(type in prims)
        return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
      else
        return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
   },
  fromGroup = function(data){
    var table    = document.querySelector('.fr-element.fr-view > table > tbody'),
        maxCells = 0;

    // считаем макс. кол-во ячеек в таблице
    for(var i=0;i<table.rows.length;i++) {
      var cells = table.rows[i].cells, max = 0;
      for (var c = 0; c < cells.length; c++) {
        max += cells[c].colSpan;
      };
      if (max > maxCells) {
        maxCells = max;
      };
    };

    var _clone = table.querySelector('tr:last-child');

    for (var i = data.length - 1; i >= 0; i--) {
      var _data = data[i],
          clone = _clone.cloneNode(true),
          dataCell = clone.querySelector('.fr-thick:first-child');
      
      // очищаем ячейки
      var _td    = clone.cells;
      for (var z = _td.length - 1; z >= 0; z--) {
        _td[z].textContent = '';
        // console.log('td', _td[i]);
      };

      console.log( 'dataCell', dataCell, _data, _clone, table );

      dataCell.dataset.group = JSON.stringify( {
        group_id    : _data.group_id,
        member_id   : _data.member_id,
        provider_id : _data.provider_id,
        name        : _data.name
      })
      dataCell.textContent = _data.name;
      dataCell.dataset.query = JSON.stringify(_data.query);

      table.appendChild(clone);
    };
  };

  return {
    init       : init,
    merge      : merge,
    config     : config,
    row        : row,
    column     : column,
    event      : event,
    fromGroup  : fromGroup,
    activeCell : activeCell,
    tableQuery : generateQueryFromTable
  }
})();