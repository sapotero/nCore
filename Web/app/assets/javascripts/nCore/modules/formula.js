"use strict";

// модуль для редактирования формул

var nCore = nCore || {};
nCore.modules.formula = (function(){

  var Formula = function(){
    this.types = [{
      name:  'Сумма',
      value: 'sum'
    }];

    this.initialize();
  };

  Formula.prototype.initialize = function() {
    jQuery(function($) {
      if (typeof jQuery.fn.live == 'undefined' || !(jQuery.isFunction(jQuery.fn.live))) {
        jQuery.fn.extend({
            live: function (event, callback) {
               if (this.selector) {
                    jQuery(document).on(event, this.selector, callback);
                }
            }
        });
      }

      $('[name="useFormula"]').live('change', function(){
        document.getElementsByName('formula')[0].disabled = this.checked ? false : true;
        nCore.modules.table.event.publish('cellFormulaChange');
      });

      $('[name="formula"]').live('change', function(){
        nCore.modules.table.event.publish('cellFormulaChange');
      });
    });
  };

  Formula.prototype.calculate = function(){
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
          }
        }

        cell.textContent = parseInt( eval(result) , 10);
      }
    }
  };

  return new Formula();
})();