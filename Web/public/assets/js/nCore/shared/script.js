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
    
    // console.log('select[name="table_name"]', this, );


      var select = this.parentNode.querySelector('[name="origin_name"]');
      select.innerHTML = '';
      

      var _df = new DocumentFragment();
      var originTable = JSON.parse( nCore.storage.getItem(this.value) );
      
      // console.log('**originTable', originTable);

      for (var q = 0; q < originTable.length; q++) {
        var option = document.createElement('option');
        option.value = originTable[q]._id;
        option.text  = originTable[q].russian_name;

        originTable[q].autocomplete_url ? option.dataset.auto = originTable[q].autocomplete_url : false;
        originTable[q].data_type        ? option.dataset.type = originTable[q].data_type : false;
        _df.appendChild(option);
      };
      select.appendChild(_df);

      // console.log('**', select, select.selectedIndex);

      select.selectedIndex = 1;

      $(select).trigger("change");
      
      return false;

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

    // console.info('before', child.children('select, input'));

    $.each( child.children('select'), function(i, el){

      if ( !$(el).hasClass('s2')) {
        // fix for autocomplite
        if ( el.name == 'hidden_autocomplete_value' ) {
          console.log('++');
          return false;
        } 

        if ( el.name === 'table_name' ) {
          console.log('table_name++', el);
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

        // console.log('select2 created', el);

        $(el).select2({ placeholder: "Выберете поле" }).on('change', function(){
          
          var __url = '';
          
          // приоритет группы вне зависимости от автокомплитеров навешанных на поле
          if ( this.value === 'group' || this.value === 'not_in_group' ) {
            __url = 'classifiers/groups/groups.json';
          };

          var _options = this.options[this.selectedIndex];
          // console.log('select:', this);

          if ( _options.dataset.hasOwnProperty('auto') && _options.dataset.auto.length || __url !== '' ){
            console.error('has autocomplete');
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


            parent.appendChild(element);

            input = element;

            var field_array  = JSON.parse( nCore.storage.getItem( parent.querySelector('[name="table_name"]').value ) ),
                origin       = parent.querySelector('[name="origin_name"]'),
                autocomplete_title,
                autocomplete_value,
                autocomplete_url;
            
            console.info(' select value ', origin.value );

            field_array.forEach(function(obj){
              if ( obj['_id'] == origin.value || obj['id'] == origin.value ) {
                // console.log('Fiels', obj);
                autocomplete_title = obj['autocomplete_title'];
                autocomplete_value = obj['autocomplete_value'];
                autocomplete_url   = obj['autocomplete_url'];
              };
            })

            var condition    = parent.querySelector('[name="conditions"]');
            if ( condition.value === 'group' || condition.value === 'not_in_group' ) {
              autocomplete_url   = 'classifiers/groups/groups.json';
              autocomplete_title = 'full_title'
            };

            $( element ).select2({
              ajax: {
                url: autocomplete_url,
                dataType: 'json',
                delay: 250,
                data: function (data) {
                  console.log('change', data)
                  return { id: data[ autocomplete_value ], term: data.term };
                },
                processResults: function (data, params) {
                  return {
                    results: $.map(data, function(p) {
                      // console.log('recv', p);
                      var val = p.hasOwnProperty('to_s') ? p.to_s : p.full_title;
                      return {
                        id:    p[ autocomplete_value ],
                        text:  p[ autocomplete_title ],
                        value: p[ autocomplete_title ]
                      };
                    })
                  };
                },
                cache: false
              },
              minimumInputLength: 1,
              placeholder: "Начните ввод"
            }).on('change', function(e){

              console.log('[335]change', this, nCore.modules.table.active(), element.value,'**', element.textContent);
              nCore.modules.table.active().dataset[element.value+'Name'] = element.options[element.selectedIndex].textContent;

              if (this.nodeName === 'SELECT') {
                nCore.modules.table.event.publish( 'newCellSettingsChange',this.options[this.selectedIndex].textContent );
              };



              nCore.modules.table.event.publish('newCellSettingsChange');
            });
          } else {
            console.log('has not autocomplete');

            var parent = this.parentNode,
                input  = parent.querySelectorAll('[name="value"], [type="date"]');
           
            $.each(input, function(i, el){
              // console.log(i,el)
              $(el).select2({});
              $(el).select2('destroy');
              parent.removeChild( el );
            });



            if ( this.options[this.selectedIndex].dataset.type === 'DateTime' ) {
              console.error( 'DateTime conditions++', parent,  parent.querySelector('select[name="conditions"]'), nCore.types['DateTime'] );

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
              if ( parent.querySelector('[name="hidden_autocomplete_value"]') ) {
                console.log('select+');
                $(parent.querySelector('[name="hidden_autocomplete_value"]')).select2('destroy');
                parent.querySelector('[name="hidden_autocomplete_value"]').parentNode.removeChild( parent.querySelector('[name="hidden_autocomplete_value"]') );
              };
              
            }  else if ( this.options[this.selectedIndex].dataset.type === 'String' ) {
              console.log('String++');

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
              console.error('input*', el.value, origin, origin.selectedIndex , origin.options[origin.selectedIndex].dataset.type, el.value );


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
              } else if ( el.value === 'equal' && origin.options[origin.selectedIndex].dataset.type === 'DateTime' ){
                console.log('Date eq');
                var element           = document.createElement('input');
                element.type          = 'date';
                element.name          = 'date_start';
                element.placeholder   = 'Start';
                element.style.width   = "92%";
                element.style.display = "inline-block";
                element.classList.toggle('muiFieldField');
                parent.appendChild(element);
              } else if ( el.value === 'equal' && origin.options[origin.selectedIndex].dataset.type === 'Boolean' ){

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
              } else if ( ( el.value === 'equal' || el.value === 'not_equal' || el.value === 'regexp' || el.value === 'full_text' ) && origin.options[origin.selectedIndex].dataset.type === 'String' && origin.options[origin.selectedIndex].dataset.hasOwnProperty('auto') && origin.options[origin.selectedIndex].dataset.auto.length){
                
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

            var field_array  = JSON.parse( nCore.storage.getItem( parent.querySelector('[name="table_name"]').value ) ),
                origin       = parent.querySelector('[name="origin_name"]'),
                autocomplete_title,
                autocomplete_value,
                autocomplete_url;
            
            // console.info(' select value ', origin.value );
            var condition    = parent.querySelector('[name="conditions"]');
            if ( condition.value === 'group' || condition.value === 'not_in_group' ) {
              autocomplete_url   = 'classifiers/groups/groups.json';
              autocomplete_title = 'full_title'
            };

            field_array.forEach(function(obj){
              if ( obj['_id'] == origin.value || obj['id'] == origin.value ) {
                // console.log('Fiels', obj);
                autocomplete_title = obj['autocomplete_title'];
                autocomplete_value = obj['autocomplete_value'];
                autocomplete_url   = obj['autocomplete_url'];
              };
            })

            $( element ).select2({
              ajax: {
                url: autocomplete_url,
                dataType: 'json',
                delay: 250,
                data: function (data) {
                  console.log('change', data)
                  return { id: data[ autocomplete_value ], term: data.term };
                },
                processResults: function (data, params) {
                  return {
                    results: $.map(data, function(p) {
                      console.log('recv', p);
                      var val = p.hasOwnProperty('to_s') ? p.to_s : p.full_title;
                      return {
                        id: p[ autocomplete_value ],
                        text:  p[ autocomplete_title ] /*val*/,
                        value: p[ autocomplete_title ] /*val*/
                      };
                    })
                  };
                },
                cache: false
              },
              minimumInputLength: 1,
              placeholder: "Начните ввод"
                }).on('change', function(e){
                  console.log('[586]change', nCore.modules.table.active(), element.value, '++',element.options[element.selectedIndex].textContent);

                  nCore.modules.table.active().dataset[element.value+'Name'] = element.options[element.selectedIndex].textContent;

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
                  // console.warn( '** default ', parent.querySelector('[name="hidden_autocomplete_value"]') );
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

          // console.error('!! EL', el);
          // if( el && el.parentNode.querySelector('[name="conditions"]').value === 'exist' ) {
          //   var parent  = this.parentNode,
          //       element = document.createElement('select');
          //   element.type          = 'text';
          //   element.name          = 'value';
          //   element.placeholder   = 'Значение';
          //   element.style.width   = "92%";

          //   parent.appendChild(element);

          //   console.warn( 'exist', element, parent, parent.querySelector('input[name="value"]')  );
          //   if ( parent.querySelector('input[name="value"]') ) {
          //     parent.querySelector('input[name="value"]').parentNode.removeChild( parent.querySelector('input[name="value"]') );
          //   };
            

          //   $(element).append( [new Option('Да', 'true', true), new Option('Нет', 'false')] ).val("").trigger("change");
          //   $(element).select2()
          //     .on('change', function(){
          //       console.log('update', this);
          //       nCore.modules.table.event.publish('newCellSettingsChange',this.options[this.selectedIndex].textContent );
          //     })
          // };

          
          nCore.modules.table.event.publish('newCellSettingsChange')
        });

        // console.log('after_all', this)
      }
    });

    
    var _tmp = this.parentNode.querySelector('[name="hidden_autocomplete_value"]');
    if ( _tmp ) {
      _tmp.name = 'value';
    };

    child[0].classList.toggle('hide');
    
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

  if (!Modernizr.inputtypes.date) {
    $.each($('input[type=date]'), function(i, el){
      $(el).pickadate({
        format: 'yyyy-mm-dd',
        closeOnSelect: true,
        closeOnClear: true
      });
    });
  };
});
