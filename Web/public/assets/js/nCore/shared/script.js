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

  //$('[type="date"]').live('click', function(){
	//	$(this).fdatepicker({format: 'yyyy-mm-dd'});
  //})
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

    var form = card[0].querySelector('.criteriaForm');

    // создаем критериии
    form.innerHTML = '<select name="source" style="width: 92%; padding: 15px auto;padding-top: 15px; margin-bottom: 20px;"> <option disabled="true">Выберете журнал</option> </select> <select name="origin_name" style="width: 92%; padding: 15px auto;padding-top: 15px; margin-bottom: 20px;"> <option disabled="true">Выберете поле</option> </select> <select name="conditions" style="width: 92%; padding: 15px auto;padding-top: 15px; margin-bottom: 20px; text-align: left;"> <option data-available=\'["String", "DateTime"]\' value="equal">Точное совпадение</option> <option data-available=\'["String"]\' value="not_equal" style="display: none">Не</option> <option data-available=\'["String"]\' value="regexp">Частичное совпадение</option> <option data-available=\'["String"]\' value="full_text">Ключевые слова</option> <option data-available=\'["String"]\' value="group">Группа</option> <option data-available=\'["String"]\' value="not_in_group">Исключая группу</option> <option data-available=\'["Boolean"]\' value="exist">Присутствует</option> <option data-available=\'["DateTime"]\' value="range" >За период</option> </select> <select style="width: 92%" class="muiFieldField" type="text" name="value" placeholder="Значение">';
    
    
    var source      = form.querySelector('[name="source"]'),
        origin_name = form.querySelector('[name="origin_name"]'),
        conditions  = form.querySelector('[name="conditions"]'),
        value       = form.querySelector('[name="value"]');

     var df           = new DocumentFragment(),
        criteriaKeys = JSON.parse( nCore.storage.criteriaKeys );
    
    for ( var q = 0; q < criteriaKeys.length; q++ ) {
      df.appendChild( new Option( criteriaKeys[q].name, criteriaKeys[q].value ) );
    };
    source.appendChild(df);
    
    $(source).select2().val('').trigger('change');
    $(origin_name).select2().val('').trigger('change');
    $(conditions).select2()
    $(value).select2()

    console.log('ADD', form);
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
  $('select[name="source"]').live('change', function(e){
    
    // console.log('select[name="table_name"]', this, this.parentNode.querySelector('[name="origin_name"]') );


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
  });

  // выбор справочника -> меняем значения в origin_name
  $('select[name="origin_name"]').live('change', function(e){
    console.log( '----- select[name="origin_name"] ----- ' );
    console.log( this, this.value );

    var _val = this.value;

    var select = this.parentNode.querySelector('[name="conditions"]');

    console.error('***', this, select );
    select.innerHTML = '';


    var field_array  = JSON.parse( nCore.storage.getItem( this.parentNode.querySelector('[name="source"]').value ) ),
        field_type,
        autocomplete_title,
        autocomplete_value,
        autocomplete_url;
    
    console.info(' select value ', field_array );

    field_array.forEach(function(obj){
      if ( obj['_id'] == _val || obj['id'] == _val ) {
        console.log( '+++++++', obj );
        autocomplete_title = obj['autocomplete_title'];
        autocomplete_value = obj['autocomplete_value'];
        autocomplete_url   = obj['autocomplete_url'];
        field_type         = obj['data_type'];
      };
    });
    
    var types   = nCore.types[ field_type ],
        options = [],
        df       = new DocumentFragment();

    console.log( 'types', types );

    for (var z = 0; z < types.length; z++) {
      var option = document.createElement('option');
      option.value = types[z].value;
      option.text = types[z].caption;
      df.appendChild(option);
    };

    select.appendChild(df);
    select.value = _val;

    this.parentNode.querySelector('[name="conditions"]').selectedIndex = 0;

    $(this.parentNode.querySelector('[name="conditions"]')).trigger('change');
    
    console.log( '----- select[name="origin_name"] ----- ' );

    return false;
  });

  // выбор справочника -> меняем значения в origin_name
  $('select[name="conditions"]').live('change', function(e){

    var element  = this.parentNode.querySelector('[name="value"], [name="date_start"]')
    console.log('select[name="conditions"]', this, element );

    // element, name, value 
    nCore.modules.cell.updateBlock(element, 'value', null );
    
    return false;
  })




  // удаление критерия
  $('.criteriaMenuItem.remove').live('click', function(){
    console.log('detach criteria');
    $(this).parents('.criteriaSelectorItem').detach();
    nCore.modules.table.event.publish('newCellSettingsChange' );
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

    console.error('BEFORE', child.children('select, input'));

    child[0].classList.toggle('hide');
    
    // nCore.modules.table.event.publish('newCellSettingsChange' );

    if(!Modernizr.inputtypes.date) {
      $('[type="date"]').fdatepicker({format: 'yyyy-mm-dd'});
    }
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

  // if (!Modernizr.inputtypes.date) {
  //   $.each($('input[type=date]'), function(i, el){
  //     $(el).pickadate({
  //       format: 'yyyy-mm-dd',
  //       closeOnSelect: true,
  //       closeOnClear: true
  //     });
  //   });
  // };
});
