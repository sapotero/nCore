"use strict";

// модуль для редактирования формул

var nCore = nCore || {};
nCore.modules.formula = (function(){
  var types = [{
    name:  'Сумма',
    value: 'sum'
  }];

  var init = function(){
    // клик по кнопке добавить в панельке формкла
    // $(".addFormulaToGroup").live('click', function( e ){
    //   console.log( 'addFormulaToGroup' );
    //   nCore.document.root.publish('addFormulaField', {})
    // });

    $('[name="useFormula"]').live('change', function(){
      console.log('formula change');
      document.getElementsByName('formula')[0].disabled = this.checked ? false : true;
      nCore.modules.table.event.publish('cellFormulaChange');
    });
    $('[name="formula"]').live('change', function(){
      nCore.modules.table.event.publish('cellFormulaChange');
    });

  },
  types =function(){
    return types;
  },
  generateFormulaQuery =function(){

  },
  populateFormula =function(){

  },
  calculate =function(){

  };

  return {
    init                 : init,
    types                : types,
    calculate            : calculate,
    populateFormula      : populateFormula,
    generateFormulaQuery : generateFormulaQuery
  }
})();
