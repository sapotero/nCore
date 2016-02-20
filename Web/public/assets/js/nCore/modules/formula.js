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

    // $('#paper').live('click', function( e ){
    //   console.log( 'click', e );
    // });

  },
  types =function(){
    return types;
  },
  generateFormulaQuery =function(){

  },
  populateFormula =function(){

  },
  calculate =function(){
    var formulas = document.querySelectorAll('[data-formula]'),
        result = '';

    for (var z = 0; z < formulas.length; z++) {
      var cell = formulas[z];

      if ( cell.dataset.formula.length ) {
        var formulaString = cell.dataset.formula;
            result = formulaString;

        var ids =  formulaString.match( /#\b\w+\b/gi );

        if ( ids && ids.length ) {
          for (var q = 0; q < ids.length; q++) {
            result = result.replace( ids[q], parseInt( document.getElementById( ids[q].substr(1) ).textContent, 10) );
          };
        };

        cell.textContent = parseInt( eval(result) , 10);
      };
    };
  };

  return {
    init                 : init,
    types                : types,
    calculate            : calculate,
    populateFormula      : populateFormula,
    generateFormulaQuery : generateFormulaQuery
  }
})();
