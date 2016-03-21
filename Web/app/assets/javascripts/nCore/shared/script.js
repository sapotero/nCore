
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
  $('div#paper').on('froalaEditor.initialized', function (e, editor) {
    document.querySelector('.fr-wrapper').nextSibling.textContent += 'test';
  });

  var $bodyEl   = $('body'),
  $sidedrawerEl = $('#sidedrawer'),
  $cellSettings = $('#cellSettings'),
  $rotatePage   = $('#rotatePage'),
  $paper        = $('#paper');
  
  
  // ==========================================================================
  // Toggle Sidedrawer
  // ==========================================================================
  function showSidedrawer() {
    // show overlay
    var options = {
      onclose: function() {
        // $sidedrawerEl.removeClass('active');
        hideSidedrawer()
      }
    };
    // $('#sidedrawer-brand').toggleClass('mui--z5');
    var $overlayEl = $( mui.overlay('on', options)) ;
    // $sidedrawerEl.appendTo($overlayEl);
    setTimeout(function() {
      $sidedrawerEl.addClass('active');
    }, 200);
  }

  function hideSidedrawer() {
    $bodyEl.toggleClass('hide-sidedrawer');
    $('#sidedrawer-brand').removeClass('mui--z5');
    // $sidedrawerEl.removeClass('active'); 
  }

  $('.js-hide-sidedrawer').on('click', showSidedrawer);
  $('.js-hide-sidedrawer').on('click', hideSidedrawer);
  
  
  // ==========================================================================
  // Animate menu
  // ==========================================================================
  var $titleEls = $('strong', $sidedrawerEl);
  
  $titleEls.next().hide();

  $titleEls.on('click', function() {

    console.log('click');
    $(this).next().slideToggle(200);
    $sidedrawerEl.removeClass('active');
    mui.overlay('off');

  });

  // поворот страницы
  $rotatePage.click(function(){
    $paper.toggleClass('book');
  });

  // клик по ячейке в таблице
  $('td.fr-selected-cell').live('click', function(e){
    "use strict";
    e.preventDefault();

    // console.log( 'clicked', this );


    nCore.core.hightlightCell(this);
    

    // если произошел клик по клетке с данными с нажатым ctrl
    if ( e.ctrlKey ) {
      // console.log( 'clicked', e.target.dataset )
      // если есть формула но нет айдишника
      // if ( e.target.dataset.useFormula == 'true' ) {
      if ( !e.target.id ) {
        var id = nCore.modules.table.generateId();
        e.target.id = id;
        console.log( 'generate id', id );
      };
      nCore.document.root.publish('addToFormula', e.target );
      // };
    } else {
      nCore.modules.table.event.publish('cellSelect', this );
      nCore.modules.table.event.publish('cellFormulaClear' );
    }
    return false;
  });

  $('.calculationCell').live('click', function(e){
    e.preventDefault();
    nCore.modules.table.event.publish('cellSelect', this );
    return false;
  });

  $cellSettings.live('click', function(e){
    e.stopPropagation();
  });

  $('#content-wrapper').live('click', function(e){
    nCore.document.showCellSettings = false;
    nCore.modules.table.event.publish('hideSideMenu');
  });

  // добвление нового документа
  $('.AddDocument').live('click', function(){
    nCore.document.root.publish('createNewDocument');
  })

  // добавление группы критериев
  $('.addCriteriaGroupButton').live('click', function(e){
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
    document.querySelector('.firstTimeCriteria').classList.add('mui--hide');
    e.stopPropagation();
  });

  // изменения типа связи у критерия в группе
  $('.criteriaSelectorItemCondition').live('click', function(){
    nCore.modules.table.event.publish('newCellSettingsChange' );
    return false;
  });
  
  // удаление документа
  $('.removeDocument').live('click', function(e){
    // e.preventDefault();
    nCore.document.root.publish('deleteReport', this);
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

    console.log( source );
    
    var sourceSelect = new Promise(function(resolve, reject){
      if ( source.options.length ) {
        source.selectedIndex = 1;
        resolve(true);
      } else {
        reject(-1)
      }
    })

    sourceSelect.then(function(data){
      $(source).select2().trigger('change');
      origin_name.selectedIndex = 1;
      return true
    }).then(function(){
      $(origin_name).select2().trigger('change');
      $(conditions).select2()
      $(value).select2()
    }).catch(function(error){});

    // console.log('ADD', form);
    nCore.modules.table.event.publish('newCellSettingsChange' );
  });

  // изменение значения полей -> обновляем значения в ячейке
  $('select[name="value"], [name="value"]').live('change', function(){
    nCore.modules.table.event.publish('newCellSettingsChange' );
    return false;
  })

  // изменение значения полей -> обновляем значения в ячейке
  $('input[type="date"]').live('change', function(){
    nCore.modules.table.event.publish('newCellSettingsChange' );
    return false;
  });
  
  // изменение значения полей -> обновляем значения в ячейке
  $('select[name="connectionGroup"]').live('change', function(){
    nCore.modules.table.event.publish('newCellSettingsChange' );
    return false;
  })

  // выбор справочника -> меняем значения в origin_name
  $('select[name="source"]').live('change', function(e){
    
    console.log('select[name="table_name"]', this, this.parentNode.querySelector('[name="origin_name"]') );


      var select = this.parentNode.querySelector('[name="origin_name"]');
      select.innerHTML = '';
      
      var _df = new DocumentFragment();
      var originTable = JSON.parse( nCore.storage.getItem(this.value) );
      
      console.log('**originTable', originTable);


      for (var q = 0; q < originTable.length; q++) {
        var option = document.createElement('option');
        option.value = originTable[q].origin_name;
        option.text  = originTable[q].russian_name;

        originTable[q].autocomplete_url ? option.dataset.auto = originTable[q].autocomplete_url : false;
        originTable[q].data_type        ? option.dataset.type = originTable[q].data_type : false;
        _df.appendChild(option);
      };

      // добавляем формулу для того чтобы считать сложные запросы
      var option = document.createElement('option');
      option.value = 'formula';
      option.text  = 'Формула';
      _df.appendChild(option);
      
      select.appendChild(_df);

      // console.log('**', select, select.selectedIndex);

      select.selectedIndex = 1;
      $(select).select2();
      $(select).trigger("change");
      
      return false;
  });

  // выбор справочника -> меняем значения в origin_name
  $('select[name="origin_name"]').live('change', function(e){
    console.groupCollapsed('select[name="origin_name"] -> change');

    
    var _root = $(this).closest('.criteriaSelectorItem')[0];
    var _val = this.value;
    var select = this.parentNode.querySelector('[name="conditions"]');
    console.log( 'params ', _root, this, this.value );

    var field_array  = JSON.parse( nCore.storage.getItem( _root.querySelector('[name="source"]').value ) ),
        field_type,
        autocomplete_title,
        autocomplete_value,
        autocomplete_url;
    
    select.innerHTML = '';
    // console.info(' select value ', field_array );

    field_array.forEach(function(obj){
      // if ( obj['_id'] == _val || obj['id'] == _val ) {
      if ( obj['origin_name'] == _val ) {
        console.log( '+++++++', obj );
        autocomplete_title = obj['autocomplete_title'];
        autocomplete_value = obj['autocomplete_value'];
        autocomplete_url   = obj['autocomplete_url'];
        field_type         = obj['data_type'];
      };
    });

    // формула
    field_type = field_type ? field_type : 'Formula';

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
    $(select).select2();
    $(this.parentNode.querySelector('[name="conditions"]')).trigger('change');
    
    console.groupEnd();

    return false;
  });

  // выбор справочника -> меняем значения в origin_name
  $('select[name="conditions"]').live('change', function(e){
    console.groupCollapsed('select[name="conditions"] -> change');
    var element  = this.parentNode.querySelector('[name="value"], [name="date_start"]')
    console.log('params', this, element );


    try{
      var element = this.parentNode.querySelector('[name="value"]');
      if ( element ) {
        element.parentNode.removeChild(element);
      }
    }catch(e){
      console.log('error!', e);
    }

    try{
      $(element).select2('destroy');
    }catch(e){
      console.log(e);
    }
    
    var _root = $(this).closest('.criteriaSelectorItem')[0];

    var sorted_hash = {};
    sorted_hash.source      = _root.querySelector('[name="source"]').value;
    sorted_hash.origin_name = _root.querySelector('[name="origin_name"]').value;
    sorted_hash.conditions  = _root.querySelector('[name="conditions"]').value;
    sorted_hash.value       = '';

    var builder = new nCore.modules.cell.builder( sorted_hash, _root );

    console.log('builder', builder);
    builder.value(true);

    // element, name, value 
    // nCore.modules.cell.updateBlock(element, 'value', null );
    console.groupEnd();
    
    try {
      _root.querySelector('[name="value"]').value = '';
    } catch (e){
      console.log('value bad')
    }


    nCore.modules.table.event.publish('newCellSettingsChange' );
    return false;
  })

  // удаление критерия
  $('.criteriaMenuItem.remove').live('click', function(){
    console.groupCollapsed('.criteriaMenuItem.remove -> click');
    console.log('detach criteria');
    $(this).parents('.criteriaSelectorItem').detach();
    nCore.modules.table.event.publish('newCellSettingsChange' );
    console.groupEnd();
  })

  // клик по критерию
  $('.criteriaMenuItem.settings, .criteriaSelectorItemHeader').live('click', function(e){

    // убрать из прода | каждый раз грузим справочники и критерии
    nCore.document.root.publish('loadCriteria');

    var el = ( $(this).hasClass('criteriaSelectorItem') ? $(this) : $(this).parents('.criteriaSelectorItem') );
    var child = el.children('.criteriaForm');

    // console.error('BEFORE', child.children('select, input'));
    child[0].classList.toggle('hide');

    return false;
  })

  // изменение отображение элементов на странице
  $('.indexViewChange').live('click', function(){
    var type = nCore.storage.getItem('indexViewType'),
        icon = this.querySelector('i.fa');

    switch(type){
      case 'thumb':
        nCore.storage.setItem('indexViewType', 'list');
        break;
      case 'list':
        nCore.storage.setItem('indexViewType', 'thumb');
        break;
      default:
        nCore.storage.setItem('indexViewType', 'thumb');
        break;
    };

    console.log(' icon ', icon.classList );

    icon.classList.toggle('fa-th-large');
    icon.classList.toggle('fa-list');

    nCore.document.root.publish('renderIndexView', 'documents');
  })
  

  $('.layoutSideMenuItem').live('click', function(){
    if ( this.dataset.hasOwnProperty('type') ) {
      $bodyEl.toggleClass('hide-sidedrawer');
      nCore.document.root.publish('setDocumentType', this.dataset.type);
      nCore.document.root.publish('go', this.dataset.type);
    };
  });


  // обновление свойств аппг, всего итд
  $('.formula').live('change', function(){
    nCore.modules.table.event.publish('cellFormulaChange' );
  });

  // обновлдение конкретно галки с месяцами
  // activeCell -> update dataset -> use_month = true && month = 1..12
  $('[name="useMonth"]').live('change', function(){
    console.log('month change');
    document.getElementsByName('month')[0].disabled = this.checked ? false : true;
    nCore.modules.table.event.publish('cellFormulaChange');
  });
  $('[name="month"]').live('change', function(){
    nCore.modules.table.event.publish('cellFormulaChange');
  });

  $('[name="useDefault"]').live('change', function(){
    console.log('default change');
    document.getElementsByName('default')[0].disabled = this.checked ? false : true;
    nCore.modules.table.event.publish('cellFormulaChange');
  });
  $('[name="default"]').live('change', function(){
    nCore.modules.table.event.publish('cellFormulaChange');
  });

  // обновлдение конкретно галки с месяцами
  // activeCell -> update dataset -> use_month = true && month = 1..12
  $('[name="useChosenOrigin"]').live('change', function(){
    console.log('chosenOrigin change');
    document.getElementsByName('chosenOrigin')[0].disabled = this.checked ? false : true;
    nCore.modules.table.event.publish('cellFormulaChange');
  });
  $('[name="chosenOrigin"]').live('change', function(){
    nCore.modules.table.event.publish('cellFormulaChange');
  });

  $('[name="documentGlobalSettings"]').live('click', function(){
    nCore.modules.table.event.publish('globalCriteriaCalculate');
    nCore.document.root.publish( 'updateDocument', this );
  });

  $('[name="yearReport"]').live('change', function(){
    var main    = this.parentNode.parentNode.parentNode.querySelector('[name="main"]');
    var compare = this.parentNode.parentNode.parentNode.querySelector('[name="compare"]');

    if ( !this.checked ) {
      main.disabled    = true;
      compare.disabled = true;
    } else {
      main.disabled    = false;
      compare.disabled = false;
    }
  });

  $('.cloned > button').live('click', function(){
    var button = this;
    var dropdown = $(button).next();
    console.log( this.dataset.cmd,  button, $(button).next() , dropdown );

    if ( $.FroalaEditor.hasOwnProperty( this.dataset.cmd ) ) {

      $.FroalaEditor[ this.dataset.cmd ]
      return true;
    }

    if ( $.FroalaEditor.COMMANDS.hasOwnProperty( this.dataset.cmd ) && $.FroalaEditor.COMMANDS[ this.dataset.cmd ].hasOwnProperty('callback') ) {
      $.FroalaEditor.COMMANDS[ this.dataset.cmd ].callback.call( globalEditor );
    } else {
      try{
        $('div#paper').froalaEditor(`commands.${this.dataset.cmd}`);
      }
      catch(e){
      }
    }
  });
});