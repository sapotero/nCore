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
  // $('div#paper').on('froalaEditor.initialized', function (e, editor) {
  //   document.querySelector('.fr-wrapper').nextSibling.textContent += 'test';
  // });

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
    var list = $(".criteriaSelector"),
        groupTemplate  = $('.criteriaSelectorGroupTemplate').first();

    var group = groupTemplate.clone();
    group.removeClass('criteriaSelectorGroupTemplate');
    group.removeClass('mui--hide');

    // if (  $('.firstTimeCriteria').hasClass('mui--hide') ) {
      // var criteria = $('.criteriaSelector > div > .connectionGroup').last();
      // criteria.hasClass('mui--hide') ? criteria.removeClass('mui--hide') : criteria.addClass('mui--hide') ;
    // };
    // $('.firstTimeCriteria').addClass('mui--hide');

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

  // изменение значения полей -> обновляем значения в ячейке
  $('input[type="date"]').live('change', function(){
    nCore.modules.table.event.publish('newCellSettingsChange' );
    return false;
  })

  // изменение значения полей -> обновляем значения в ячейке
  $('select[name="connectionGroup"]').live('change', function(){
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
      
      console.log('**originTable', originTable);

      for (var q = 0; q < originTable.length; q++) {
        var option = document.createElement('option');
        option.value = originTable[q]._id;
        option.text  = originTable[q].russian_name;

        originTable[q].autocomplete_url ? option.dataset.auto = originTable[q].autocomplete_url : false;
        originTable[q].data_type        ? option.dataset.type = originTable[q].data_type : false;
        _df.appendChild(option);
      };
      select.appendChild(_df);

      console.log(select, select.selectedIndex);

      select.selectedIndex = 1;

      $(select).trigger("change");
      
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

    // убрать из прода | каждый раз грузим справочники и критерии
    nCore.preloader.event.publish('loadCriteria');

    var el = ( $(this).hasClass('criteriaSelectorItem') ? $(this) : $(this).parents('.criteriaSelectorItem') );
    var child = el.children('.criteriaForm');

    $.each( child.children('select'), function(i, el){

      if ( !$(el).hasClass('s2')) {
        // fix for autocomplite
        if ( el.name == 'hidden_autocomplete_value' ) {
          console.log('++');
          return false;
        } else {



        if ( el.name === 'table_name' ) {
          var _df = new DocumentFragment();
          var criteriaKeys = JSON.parse( nCore.storage.criteriaKeys );
          for (var q = 0; q < criteriaKeys.length; q++) {
            var option = document.createElement('option');
            option.value = criteriaKeys[q].value;
            option.text  = criteriaKeys[q].name;
            _df.appendChild(option);
          };
          el.appendChild(_df);
        };

        $(el).addClass('s2');


        $(el).select2({ placeholder: "Выберете поле" }).on('change', function(){
          
          var __url = '';
          
          // приоритет группы вне зависимости от автокомплитеров навешанных на поле
          if ( this.value === 'group' || this.value === 'not_in_group' ) {
            __url = 'classifiers/groups/groups.json';
          };
          var _options = this.options[this.selectedIndex];
          // console.log('select:', this);

          if ( _options.dataset.hasOwnProperty('auto') && _options.dataset.auto.length || __url !== '' ){

            var parent = this.parentNode,
                input  = parent.querySelectorAll('[name="value"], [type="date"]');
            
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
            
            // $('select[name="conditions"]').val('equal').trigger("change");
            if ( parent.querySelector('input[name="value"]') ) {
              parent.querySelector('input[name="value"]').parentNode.removeChild( parent.querySelector('input[name="value"]') );
            };
            if ( parent.querySelector('[name="hidden_autocomplete_value"]') ) {
              console.log('select+');
              $(parent.querySelector('[name="hidden_autocomplete_value"]')).select2('destroy');
              parent.querySelector('[name="hidden_autocomplete_value"]').parentNode.removeChild( parent.querySelector('[name="hidden_autocomplete_value"]') );
            };
 
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
              // console.warn( 'change ', this.options[this.selectedIndex].value, this.options[this.selectedIndex].textContent );
              
              if (this.nodeName === 'SELECT') {
                nCore.modules.table.event.publish( 'newCellSettingsChange',this.options[this.selectedIndex].textContent );
              };

              // console.log('change event', this);

              nCore.modules.table.event.publish('newCellSettingsChange');
            });
            
          } else {

            var parent = this.parentNode,
                input  = parent.querySelectorAll('[name="value"], [type="date"]');
           
            $.each(input, function(i, el){
              // console.log(i,el)
              $(el).select2({});
              $(el).select2('destroy');
              parent.removeChild( el );
            });



            if ( this.options[this.selectedIndex].dataset.type === 'DateTime' ) {
              console.log( 'conditions', parent,  parent.querySelector('select[name="conditions"]'), nCore.types['DateTime'] );

              // delete parent.querySelector('option[value="range"]').disabled;

              
              var _parent =  parent.querySelector('select[name="conditions"]');

              // убираем все options и добавляем их туда из nCore.types
              while (_parent.firstChild) {
                  _parent.removeChild(_parent.firstChild);
              }

              var _options = nCore.types['DateTime'],
                  _result = [];
              for (var z = 0; z < _options.length; z++) {
                _result.push( new Option(_options[z].caption, _options[z].value) );
              };
              $(_parent).append( _result ).val("range").trigger("change");
              $(_parent).select2();

              if ( parent.querySelector('input[name="value"]') ) {
                parent.querySelector('input[name="value"]').parentNode.removeChild( parent.querySelector('input[name="value"]') );
              };

            }  else if ( this.options[this.selectedIndex].dataset.type === 'Boolean' ) {
              console.log('Boolean');

              var _parent =  parent.querySelector('select[name="conditions"]');

              // убираем все options и добавляем их туда из nCore.types
              while (_parent.firstChild) {
                  _parent.removeChild(_parent.firstChild);
              }

              var _options = nCore.types['Boolean'],
                  _result = [];
              for (var z = 0; z < _options.length; z++) {
                _result.push( new Option(_options[z].caption, _options[z].value) );
              };
              $(_parent).append( _result ).val("").trigger("change");
              $(_parent).select2();

              if ( parent.querySelector('input[name="value"]') ) {
                parent.querySelector('input[name="value"]').parentNode.removeChild( parent.querySelector('input[name="value"]') );
              };
              
            }  else if ( this.options[this.selectedIndex].dataset.type === 'String' ) {
              console.log('String');

              var _parent =  parent.querySelector('select[name="conditions"]');

              // убираем все options и добавляем их туда из nCore.types
              while (_parent.firstChild) {
                  _parent.removeChild(_parent.firstChild);
              }

              var _options = nCore.types['String'],
                  _result = [];
              for (var z = 0; z < _options.length; z++) {
                _result.push( new Option(_options[z].caption, _options[z].value) );
              };
              $(_parent).append( _result ).val("").trigger("change");
              $(_parent).select2();
              
            }
            else {
              // input.parentNode.removeChild( input );
              
              var origin = parent.querySelector('select[name="origin_name"]');
              // console.log('input*', origin, origin.selectedIndex , origin.options[origin.selectedIndex].dataset.type, el.value );


              if ( el.value == 'range' && origin.options[origin.selectedIndex].dataset.type === 'DateTime'  ) {
                var element           = document.createElement('input');
                element.type          = 'date';
                element.name          = 'date_start';
                element.placeholder   = 'Start';
                element.style.width   = "44%";
                element.style.marginRight = "2%";
                element.style.display = "inline-block";
                element.classList.toggle('muiFieldField');
                parent.appendChild(element);

                var element           = document.createElement('input');
                element.type          = 'date';
                element.name          = 'date_end';
                element.placeholder   = 'End';
                element.style.width   = "44%";
                element.style.display = "inline-block";
                element.classList.toggle('muiFieldField');
                parent.appendChild(element);

                console.log('parent', parent);
              } else if ( el.value == 'equal' && origin.options[origin.selectedIndex].dataset.type === 'DateTime' ){
                console.log('Date eq');
                var element           = document.createElement('input');
                element.type          = 'date';
                element.name          = 'date_start';
                element.placeholder   = 'Start';
                element.style.width   = "92%";
                element.style.display = "inline-block";
                element.classList.toggle('muiFieldField');
                parent.appendChild(element);

              } else if ( el.value == 'equal' && origin.options[origin.selectedIndex].dataset.type === 'Boolean' ){

                var parent  = this.parentNode,
                element = document.createElement('select');
                element.type          = 'text';
                element.name          = 'value';
                element.placeholder   = 'Значение';
                element.style.width   = "92%";

                parent.appendChild(element);

                console.warn( 'exist', element, parent, parent.querySelector('input[name="value"]')  );
                if ( parent.querySelector('input[name="value"]') ) {
                  parent.querySelector('input[name="value"]').parentNode.removeChild( parent.querySelector('input[name="value"]') );
                };


                $(element).append( [new Option('Да', 'true', true), new Option('Нет', 'false')] ).val("").trigger("change");
                $(element).select2()
                .on('change', function(){
                  nCore.modules.table.event.publish('newCellSettingsChange',this.options[this.selectedIndex].textContent);
                })
              } else if ( ( el.value == 'equal' || el.value == 'not_equal' || el.value == 'regexp' || el.value == 'full_text' ) && origin.options[origin.selectedIndex].dataset.type === 'String' && origin.options[origin.selectedIndex].dataset.hasOwnProperty('auto')  && origin.options[origin.selectedIndex].dataset.auto.length){
                
                console.warn('****', origin.options[origin.selectedIndex].dataset.auto);
                
                var parent = this.parentNode,
                input  = parent.querySelectorAll('[name="value"], [type="date"], [name="hidden_autocomplete_value"]');

                
                $.each(input, function(i, el){
                  // console.log(i,el)
                  $(el).select2({});
                  $(el).select2('destroy');
                  parent.removeChild( el );
                });
                
                // parent.removeChild( input );
                
                // $('select[name="conditions"]').val('equal').trigger("change");
                if ( parent.querySelector('input[name="value"]') ) {
                  parent.querySelector('input[name="value"]').parentNode.removeChild( parent.querySelector('input[name="value"]') );
                };
                if ( parent.querySelector('[name="hidden_autocomplete_value"]') ) {
                  console.log('select+');
                  $(parent.querySelector('[name="hidden_autocomplete_value"]')).select2('destroy');
                  parent.querySelector('[name="hidden_autocomplete_value"]').parentNode.removeChild( parent.querySelector('[name="hidden_autocomplete_value"]') );
                };

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

                // /classifiers/groups/groups.json
                $( input ).select2({
                  ajax: {
                    url: origin.options[origin.selectedIndex].dataset.auto,
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
                  
                  console.warn( 'change ', this.options[this.selectedIndex].value, this.options[this.selectedIndex].textContent );
                  
                  if (this.nodeName === 'SELECT') {
                    nCore.modules.table.event.publish( 'newCellSettingsChange',this.options[this.selectedIndex].textContent );
                  };

                  // console.log('change event', this);

                  nCore.modules.table.event.publish('newCellSettingsChange');
                });

              } else {
                if ( parent.querySelector('[name="hidden_autocomplete_value"]') ) {
                  // parent.removeChild(parent.querySelector('[name="hidden_autocomplete_value"]'));
                } else {
                  console.log( '** default ', parent.querySelector('[name="hidden_autocomplete_value"]') );
                  console.log('input-> create: ', this);
                  var element   = document.createElement('input');
                  element.type          = 'text';
                  element.name          = 'value';
                  element.placeholder   = 'Значение';
                  element.classList.add('muiFieldField');
                  parent.appendChild(element);
                };


              };
            };
          }

          if( this.value === 'exist' ) {
            var parent  = this.parentNode,
                element = document.createElement('select');
            element.type          = 'text';
            element.name          = 'value';
            element.placeholder   = 'Значение';
            element.style.width   = "92%";

            parent.appendChild(element);

            console.warn( 'exist', element, parent, parent.querySelector('input[name="value"]')  );
            if ( parent.querySelector('input[name="value"]') ) {
              parent.querySelector('input[name="value"]').parentNode.removeChild( parent.querySelector('input[name="value"]') );
            };
            

            $(element).append( [new Option('Да', 'true', true), new Option('Нет', 'false')] ).val("").trigger("change");
            $(element).select2()
              .on('change', function(){
                console.log('update', this);
                nCore.modules.table.event.publish('newCellSettingsChange',this.options[this.selectedIndex].textContent );
              })
          };
          
          nCore.modules.table.event.publish('newCellSettingsChange')
        });

        };
      };

      if ( el.name == 'table_name') {
        el.selectedIndex = 1;
        $(el).trigger("change")
      };

      if ( el.name == 'table_name') {
        el.selectedIndex = 1;
        $(el).trigger("change")
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