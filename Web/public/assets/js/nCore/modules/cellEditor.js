"use strict";

// модуль для редактирования ячеек

var nCore = nCore || {};
nCore.modules.cellEditor = (function(){
  
  var root, fontSize, cellText, activeCell;
  
  function attachEvent(){
    cellText.addEventListener('keyup', function (e) {
      if ( typeof(activeCell) != 'function' ) {
        activeCell.textContent = cellText.value;
      };
    });

    fontSize.addEventListener('click', function (e) {
      if ( typeof(activeCell) != 'function' ) {
        activeCell.style.fontSize = fontSize.value + 'px';
      };
    });
  };

  return {
    init: function(config){
      var config = {
        tab:      'nCoreTabConfigText',
        fontSize: 'nCoreTabConfigTextFontSize',
        cellText: 'nCoreTabConfigCellText'
      };

      root     = document.getElementById( config.tab );
      cellText = document.getElementById( config.cellText );
      fontSize = document.getElementById( config.fontSize );
      // attachEvent();


      // подписываемся на изменения параметров текста и размера
      nCore.attachTo( nCore.modules.cellEditor.cellText );
      nCore.attachTo( nCore.modules.cellEditor.fontSize );

      // nCore.modules.table.activeCell.subscribe('setCell', function(cell){
      //   activeCell = cell;
      //   cellText.value = cell.textContent;
      //   cellText.focus();
      // });
     },

    root     : function(){
      return root;
     },
    cellText : function(){
      return cellText;
     },
    fontSize : function(){
      return fontSize;
     }
  }
})();

