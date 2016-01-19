if (typeof jQuery.fn.live == 'undefined' || !(jQuery.isFunction(jQuery.fn.live))) {
  jQuery.fn.extend({
      live: function (event, callback) {
         if (this.selector) {
              jQuery(document).on(event, this.selector, callback);
          }
      }
  });
}
jQuery(function($) {
  var $bodyEl              = $('body'),
  $sidedrawerEl            = $('#sidedrawer'),
  $cellSettings            = $('#cellSettings'),
  $rotatePage              = $('#rotatePage'),
  $paper                   = $('#paper');
  
  
  // ==========================================================================
  // Toggle Sidedrawer
  // ==========================================================================
  function showSidedrawer() {
    // show overlay
    var options = {
      onclose: function() {
        $sidedrawerEl
          .addClass('active')
          .appendTo(document.body);
      }
    };
    $('#sidedrawer-brand').toggleClass('mui--z5');
    
    var $overlayEl = $(mui.overlay('on', options));
    
    // show element
    $sidedrawerEl.appendTo($overlayEl);

    setTimeout(function() {
      $sidedrawerEl.addClass('active');
    }, 20);
  }
  
  
  function hideSidedrawer() {
    $bodyEl.toggleClass('hide-sidedrawer');
    $('#sidedrawer-brand').removeClass('mui--z5');
  }
  
  
  $('.js-show-sidedrawer').on('click', showSidedrawer);
  $('.js-hide-sidedrawer').on('click', hideSidedrawer);
  
  
  // ==========================================================================
  // Animate menu
  // ==========================================================================
  var $titleEls = $('strong', $sidedrawerEl);
  
  $titleEls.next().hide();
  
  $titleEls.on('click', function() {
    $(this).next().slideToggle(200);
  });

  $rotatePage.click(function(){
    $paper.toggleClass('book');
  });

  // клик по ячейке в таблице
  $('td.fr-selected-cell').live('click', function(e){
    nCore.modules.table.event.publish('cellSelect', this );
    nCore.modules.table.event.publish('cellFormulaClear' );
  });
  
  // $('#cellSettingsForm').change(function(e){
  //   nCore.modules.table.event.publish('cellSettingsChange', e );
  // })

  // добвление нового документа
  $('.AddDocument').live('click', function(){
    nCore.document.root.publish('createNewDocument');
  })

  // добавление группы критериев
  $('.addCriteriaGroupButton').live('click', function(){
    var list  = $(".criteriaSelector"),
        groupTemplate  = $('.criteriaSelectorGroupTemplate').first();

    var group = groupTemplate.clone();
    group.removeClass('criteriaSelectorGroupTemplate');
    group.removeClass('mui--hide');

    if (  $('.firstTimeCriteria').hasClass('mui--hide') ) {
      $('.criteriaSelector > div> .connectionGroup').last().toggleClass('mui--hide');
    };
    $('.firstTimeCriteria').addClass('mui--hide');

    list.append( group );

    // черновой вариант как мы обходим ноды для 
    // того чтобы собрать критерии в один запрос
    nCore.modules.table.event.publish('newCellSettingsChange' );
  });

  // изменения типа связи у критерия в группе
  $('.criteriaSelectorItemCondition').live('click', function(){
    nCore.modules.table.event.publish('newCellSettingsChange' );
    return false;
  });

  // добавление критерия в группу
  $('.addCriteriaItemToGroup').live('click', function(){
    var root  = $(this).parents('.criteriaSelectorGroup'),
        list  = root.children('.criteriaSelectorGroupList'),
        cardTemplate  = $('.criteriaSelectorItemTemplate').first();
    var card = cardTemplate.clone();
    card.removeClass('criteriaSelectorItemTemplate');
    card.removeClass('mui--hide');

    list.append( card );
    nCore.modules.table.event.publish('newCellSettingsChange' );
  });

  // изменение значения полей -> обновляем значения в ячейке
  $('select[name="value"], input[name="value"]').live('change', function(){
    nCore.modules.table.event.publish('newCellSettingsChange' );
    return false;
  })

  // выбор справочника -> меняем значения в origin_name
  $('select[name="table_name"]').live('change', function(e){
    
    // console.log('select[name="table_name"]', this);

    if ( !this.dataset.old) {
      var select = this.nextElementSibling.nextElementSibling;
      select.innerHTML = '';
      

      var _df = new DocumentFragment();
      var originTable = JSON.parse( nCore.storage.getItem( this.value) );
      
      // console.log('**originTable', originTable);

      for (var q = 0; q < originTable.length; q++) {
        var option = document.createElement('option');
        option.value = originTable[q]._id;
        option.text  = originTable[q].russian_name;

        originTable[q].autocomplete_url ? option.dataset.auto = originTable[q].autocomplete_url : false;
        _df.appendChild(option);
      };
      select.appendChild(_df);
      return false;
    };
  })

  // удаление критерия
  $('.criteriaMenuItem.remove').live('click', function(){
    $(this).parents('.criteriaSelectorItem').detach();
  })
  


  function formatRepoSelection (data) {
    return data.full_name || data.text;
  }
  function formatRepo (data) {
    if (data.loading) return data.text;

    return data;
  };

  // клик по критерию
  $('.criteriaMenuItem.settings, .criteriaSelectorItemHeader').live('click', function(e){

    // убрать из прода
    nCore.preloader.event.publish('loadCriteria');
    
    var el = ( $(this).hasClass('criteriaSelectorItem') ? $(this) : $(this).parents('.criteriaSelectorItem') );
    var child    = el.children('.criteriaForm');

    $.each( child.children('select'), function(i, el){
      if ( !$(el).hasClass('s2')) {
        if ( el.name === 'table_name' ) {
          var _df = new DocumentFragment();
          var criteriaKeys = JSON.parse(nCore.storage.criteriaKeys);
          for (var q = 0; q < criteriaKeys.length; q++) {
            var option = document.createElement('option');
            option.value = criteriaKeys[q].value;
            option.text  = criteriaKeys[q].name;
            _df.appendChild(option);
          };
          el.appendChild(_df);
        };

        $(el).addClass('s2');

        $(el).select2().on('change', function(){
          
          var __url = '';
          
          // приоритет группы вне зависимости от автокомплитеров навешанных на поле
          if ( /*this.name === 'conditions' &&*/ this.value === 'group' ) {
            __url = 'classifiers/groups/groups.json';
          };


          var _options = this.options[this.selectedIndex];
          // console.log('select:', this);

          if ( _options.dataset.hasOwnProperty('auto') || __url !== '' ){

            var parent = this.parentNode,
                input  = parent.querySelectorAll('[name="value"]');
            
            if (__url === '') {
              __url  = this.options[this.selectedIndex].dataset.auto;
            };

            $.each(input, function(i, el){
              // console.log(i,el)
              $(el).select2({});
              $(el).select2('destroy');
              parent.removeChild( el );
            });
            
            // parent.removeChild( input );
            var element   = document.createElement('select');
            element.type         = 'text';
            element.name         = 'value';
            element.placeholder  = 'Значение';
            element.style.paddingBottom = '15px';
            element.style.marginBottom = '20px;';
            element.style.width   = '92%';
            element.dataset.name  = 'value';
            
            // console.log('emenet', element)


            parent.appendChild(element);

            input = element;

            // console.log('input', input, "/", this.options[this.selectedIndex]);

            // /classifiers/groups/groups.json
            $( input ).select2({
              ajax: {
                url: __url,
                dataType: 'json',
                delay: 250,
                data: function (data) {
                  // console.log('data', data);
                  return { id: data._id, term: data.term };
                },
                processResults: function (data, params) {
                  // console.log('*****', data, params);
                  
                   return {
                      results: $.map(data, function(p) {
                        var val = p.hasOwnProperty('to_s') ? p.to_s : p.full_title;
                        return {
                          id: p._id,
                          text: val,
                          value: val
                        };
                      })
                    };
                },
                cache: true
              },
              // escapeMarkup: function (markup) { return markup; },
              minimumInputLength: 1,
              placeholder: "Начните ввод"
              // templateResult: function(data){
              //   if (data.loading) return data.text;
              //   var markup = "<div class='select2-result-datasitory__forks'><i class='fa fa-flash'></i> " + data._id + "</div>"
              //   return markup;
              // },
              // templateSelection: function(data){
              //   return data.short_title || data.text;
              // }
            }).on('change', function(){
              // this.dataset.name = this.options[this.selectedIndex].value;
              // nCore.modules.table.activeCell().dataset.name = this.options[this.selectedIndex].value;
              
              if (this.nodeName === 'SELECT') {
                nCore.modules.table.event.publish('newCellSettingsChange',this.options[this.selectedIndex].textContent);
              };

              nCore.modules.table.event.publish('newCellSettingsChange');
            });
          } else {
            var parent = this.parentNode,
                input  = parent.querySelectorAll('[name="value"]');
            $.each(input, function(i, el){
              console.log(i,el)
              $(el).select2({});
              $(el).select2('destroy');
              parent.removeChild( el );
            });

            
            // console.log('input', input);

            // input.parentNode.removeChild( input );
            
            // console.log('input*', input.parentNode);

            var element   = document.createElement('input');
            element.type          = 'text';
            element.name          = 'value';
            element.placeholder   = 'Значение';
            element.classList.add('muiFieldField');
            
            parent.appendChild(element);

            input = element;
          }
          
          // console.log('select[name="table_name"]', this);
          if ( this.name === 'table_name' ) {
            var select = this.nextElementSibling.nextElementSibling;
            select.innerHTML = '';
            
            // console.log('**', this.value);

            var _df = new DocumentFragment();
            var originTable = JSON.parse( nCore.storage.getItem( this.value ) );
            for (var q = 0; q < originTable.length; q++) {
              var option = document.createElement('option');
              option.value = originTable[q]._id;
              option.text  = originTable[q].russian_name;
              
              if ( originTable[q].autocomplete_url ){
                option.dataset.auto = originTable[q].autocomplete_url;
              }

              _df.appendChild(option);
            };
            select.appendChild(_df);
          };
          
          nCore.modules.table.event.publish('newCellSettingsChange',  $(".criteriaSelector") )
        });

      };
    });
    child[0].classList.toggle('hide');
    
    // e.preventDefault();
    nCore.modules.table.event.publish('newCellSettingsChange' );
    return false;
  })

  // изменение отображение элементов на странице
  $('.indexViewChange').live('click', function(){
    var type = this.dataset.viewType;
    nCore.document.root.publish('attachListMenu');
    nCore.document.root.publish('changeRenderType', type)
  })

  $('.layoutSideMenuItem').live('click', function(){
    if ( this.dataset.hasOwnProperty('type') ) {
      $bodyEl.toggleClass('hide-sidedrawer');
      nCore.document.root.publish('setDocumentType', this.dataset.type);
      nCore.document.root.publish('go', this.dataset.type);
    };
  });

  $('.formula').live('change', function(){
    nCore.modules.table.event.publish('cellFormulaChange' );
  });
});