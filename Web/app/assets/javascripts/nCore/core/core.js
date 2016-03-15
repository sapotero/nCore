"use strict";
/**
 * core module
 * @module nCore/core
 */
var nCore = nCore || {};
nCore.core = (function(){
  
  var Core = function(config){
    if ( !arguments.length ) {
      config = {};
    }
    this.event  = {};
    this.progress = document.getElementById('loaderProgress');

  };

  Core.prototype.globalQueryPopulate = function(){
    console.groupCollapsed("globalQueryPopulate");

    console.log( 'globalQuery', JSON.parse( nCore.document.globalQuery() ) );

    var tab = document.querySelector('._nCoreDocumentSettings .criteriaSelectorGroupGlobal');
    tab.innerHTML = '';

    var __elements_to_update = [], criteriaCondition;
    var overlayTab;

    function addOverlay() {
      setTimeout( function(){
        overlayTab = document.createElement('div');
        overlayTab.style.height     = '320px';
        overlayTab.style.width      = '39%';
        overlayTab.style.overflow   = 'hidden';
        overlayTab.style.position   = 'absolute';
        overlayTab.style.background = 'rgba(255,255,255, .9)';
        overlayTab.style.zIndex    = '2';

        overlayTab.innerHTML = '<div style="top: 45%; left: 50%;position: absolute;"><i class="fa fa-spinner fa-spin fa-2x"></i></div>'
        
        tab.appendChild( overlayTab );
      }, 100);
    };
    function removeOverlay() {

      overlayTab.classList.add('animatedSlow');
      overlayTab.classList.add('fadeOut');

      setTimeout( function(){
        if ( overlayTab ) {
          console.log('overlayTab',overlayTab, tab );
          tab.removeChild( overlayTab );
        }
      },300)
    };

    var render = new Promise(function(resolve, reject) {
      addOverlay();
      setTimeout(function(){
        if ( nCore.document.globalQuery() ) {
        console.log('nCore.document.globalQuery() ->', nCore.document.globalQuery());
        
          
            var queryArray = JSON.parse( nCore.document.globalQuery() ),
              _selectedIindex = -1;
            for (var z = 0; z < queryArray.length; z++) {


              var group     = queryArray[z],
                  criterias = group.query,
                  groupConditions = group.conditions;

              console.groupCollapsed("query");
              console.log('criterias',  criterias);
              console.log('conditions', groupConditions);

              var _groupTemplate = document.getElementsByClassName('criteriaSelectorGroupTemplate')[0],
                groupTemplate = _groupTemplate.cloneNode(true),
                groupSelectCondition = groupTemplate.getElementsByTagName('select')[0];

              console.log( groupTemplate );

              if (groupConditions) {
                for (var v = 0; v < groupSelectCondition.options.length; v++) {
                  console.log('groupSelectCondition', groupSelectCondition);
                  if (groupSelectCondition[v].value === groupConditions) {
                    _selectedIindex = v;
                    break;
                  }

                }

                groupTemplate.querySelector('.connectionGroup').classList.remove('mui--hide');
              }

              var _group = groupTemplate;
              groupSelectCondition = _group.getElementsByTagName('select')[0].selectedIndex = _selectedIindex;

              _group.classList.remove('criteriaSelectorGroupTemplate');
              _group.classList.remove('mui--hide');
              tab.appendChild(_group);
              
              if ( criterias && criterias.length ) {
                for (var b = 0; b < criterias.length; b++) {
                  var _elements_to_update = [],
                    item = criterias[b],
                    list = groupTemplate.querySelector('.criteriaSelectorGroupList'),
                    cardTemplate = document.querySelector('.criteriaSelectorItemTemplate');

                  console.table(item)
                  // console.log('criteria -> ', item);

                  if (item.source == null && item.origin_name == null) {
                    activeCell.dataset.query = '[]';
                    continue;
                  }

                  var card = cardTemplate.cloneNode(true);
                  card.classList.remove('criteriaSelectorItemTemplate');
                  card.classList.remove('mui--hide');

                  var form = card.querySelector('.criteriaForm');
                  criteriaCondition = card.querySelector('select.itemSelectCondition');

                  list.appendChild(card);

                  console.log('list card form',list, card, form);

                  if ( item.origin_name == 'formula' ) {
                    item.value = Base64.decode( item.value );
                  }

                  var sorted_hash = {};
                  sorted_hash.criteria_condition = item.criteria_condition;
                  sorted_hash.source = item.source;
                  sorted_hash.origin_name = item.origin_name;
                  sorted_hash.conditions = item.conditions;
                  sorted_hash.value = item.value;

                  console.warn( '*********', item, sorted_hash );

                  var render = new Promise(function(resolve, reject){
                    nCore.modules.cell.generateForm( sorted_hash, card );
                    resolve( [sorted_hash, card] );
                  });
                  
                  render.then(function(data){
                    // card.querySelector('.criteriaSelectorItemName').textContent = card.querySelector('[name="source"]').options[ card.querySelector('[name="source"]').selectedIndex ].textContent;
                  }).catch(function(error){
                    console.log(error);
                  })

                  // card.querySelector('.criteriaSelectorItemName').textContent = card.querySelector('[name="source"]').options[ card.querySelector('[name="source"]').selectedIndex ].textContent;

                  var cr_c = card.querySelector('[name="criteria_condition_group"]');
                  cr_c.value = item.criteria_condition;
                  cr_c.selectedIndex = item.criteria_condition == 'and' ? 0 : 1;
                }
              }
              console.groupEnd();
              // document.querySelector('.firstTimeCriteria').classList.add('mui--hide');
            }
            // nCore.modules.table.event.publish('newCellSettingsChange' );
        resolve(true)
        }
      reject(false)
      }, 200); 
    });

    render.then(function(data) {
      removeOverlay()
    }).catch(function(result) {
      console.log("ERROR renderCellSettings!", result);
    });

    console.groupEnd();
  };

  return new Core();
})();