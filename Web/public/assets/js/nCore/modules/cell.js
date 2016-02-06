"use strict";

// модуль предоставляющий интерфейс для "ячейки"

var nCore = nCore || {};
nCore.modules.cell = (function(){
  var cells = [], activeCell;

  // nCore.modules.table.activeCell.subscribe('setCell', function(cell){
  //   activeCell = cell;
  // });

  var Cell = function(data) {
    this.index     = 0;
    this.element   = activeCell;
    this.items     = data.items       || [];
    this.query     = data.query       || undefined;
    this.caption   = data.caption     || undefined;
    this.parent    = data.parent      || this;
    this.childs    = data.childrens   || [];

    if ( data.parent ) {
      this.parent.addChild(this); 
    };
  };
   
  Cell.prototype = {
    // get/set parent/childrens
    parent        : function(data){
      return this.parent;
     },
    childrens     : function(){
      return this.childs;
     },
    setParent     : function(data){
      this.parent = data;
     },
    setChilds     : function(data){
      this.childrens = data;
     },
    addChild      : function(data){
      this.childs.push(data);
     },
    hasChilds     : function() {
      return this.childs.length > 0;
     },
    hasParent     : function() {
      return this.parent == this;
     },
    // iterator template
    add           : function(data) {
      this.items.push(data);
      return this.next();
     },
    first         : function() {
      this.reset();
      return this.next();
     },
    next          : function() {
      return this.items[this.index++];
     },
    hasNext       : function() {
      return this.index <= this.items.length;
     },
    reset         : function() {
      this.index = 0;
     },
    each          : function(callback) {
      for (var item = this.first(); this.hasNext(); item = this.next()) {
        callback(item);
      }
     }
  };

  var newCell = function(config){
    var cell = new Cell(config);
    cells.push(cell);
    return cell;
  };

  var init = function(){
  },
  generateFromQuery = function( element, query ){
    console.log( 'generateFromQuery', query );
  },
  changeBlockAtributes = function( criteria, element, name, value ){
    // console.log( 'changeBlockAtributes', criteria, element, name, value );
    
    var select_query = {};
    
    element.name = name;

    switch(name){
       case 'criteria_condition':
        var df           = new DocumentFragment();
        
        df.appendChild( new Option('И',  'and' ) );
        df.appendChild( new Option('ИЛИ', 'or') );
        
        element.appendChild(df);
        element.value = value;

        break;

      case 'source':
        var df           = new DocumentFragment(),
            criteriaKeys = JSON.parse( nCore.storage.criteriaKeys );
        
        for ( var q = 0; q < criteriaKeys.length; q++ ) {
          df.appendChild( new Option( criteriaKeys[q].name, criteriaKeys[q].value ) );
        };
        element.appendChild(df);
        element.value = value;

        select_query.available = true;

        break;
      case 'origin_name':
        var df          = new DocumentFragment(),
            originTable = JSON.parse( nCore.storage.getItem( criteria.source) );

        for (var q = 0; q < originTable.length; q++) {
          var option = document.createElement('option');
          option.value = originTable[q]._id;
          option.text = originTable[q].russian_name;
          option.dataset.auto = originTable[q].autocomplete_url;
          option.dataset.type = originTable[q].data_type;
          df.appendChild(option);
        }
        element.appendChild(df);
        element.value = value;

        select_query.available = true;

        break;
      case 'conditions':
        // узнаем свойства поля по выбраному журналу
        var field_array  = JSON.parse( nCore.storage.getItem( criteria.source ) ),
            field_type,
            autocomplete_title,
            autocomplete_value,
            autocomplete_url;
        
        // console.info(' select value ', criteria.origin_name );

        field_array.forEach(function(obj){
          if ( obj['_id'] == criteria.origin_name || obj['id'] == criteria.origin_name ) {
            autocomplete_title = obj['autocomplete_title'];
            autocomplete_value = obj['autocomplete_value'];
            autocomplete_url   = obj['autocomplete_url'];
            field_type         = obj['data_type'];
          };
        });

        // теперь у нас есть вся информация по полю, можно строить критерии поиска
        
          // var df          = new DocumentFragment(),
          //     originTable = JSON.parse( nCore.storage.getItem( criteria.source) );

          // for (var q = 0; q < originTable.length; q++) {
          //   var option = document.createElement('option');
          //   option.value = originTable[q]._id;
          //   option.text = originTable[q].russian_name;
          //   option.dataset.auto = originTable[q].autocomplete_url;
          //   option.dataset.type = originTable[q].data_type;
          //   df.appendChild(option);
          // }
          // element.appendChild(df);
          // element.value = value;

        var types   = nCore.types[ field_type ],
            options = [],
            df       = new DocumentFragment();

        for (var z = 0; z < types.length; z++) {
          var option = document.createElement('option');
          option.value = types[z].value;
          option.text = types[z].caption;
          df.appendChild(option);
        };
        element.appendChild(df);
        element.value = value;

        select_query.available = true;

        break;
      case 'value':
        // узнаем свойства поля по выбраному журналу
        var field_array  = JSON.parse( nCore.storage.getItem( criteria.source ) ),
            field_type,
            autocomplete_title,
            autocomplete_value,
            autocomplete_url;
        
        console.info(' select value ', criteria.origin_name );

        field_array.forEach(function(obj){
          if ( obj['_id'] == criteria.origin_name || obj['id'] == criteria.origin_name ) {
            autocomplete_title = obj['autocomplete_title'];
            autocomplete_value = obj['autocomplete_value'];
            autocomplete_url   = obj['autocomplete_url'];
            field_type         = obj['data_type'];
          };
        });

        if ( criteria.conditions == 'range' ) {
          console.log('+range');
          // select_query.url   =  autocomplete_url;
          // select_query.value =  autocomplete_value;
          // select_query.title =  autocomplete_title;
          // parent.removeChild(element);
          var df                = new DocumentFragment();
          var element           = document.createElement('input');
          element.type          = 'date';
          element.name          = 'date_start';
          element.placeholder   = 'Start';
          element.style.width   = "44%";
          element.style.marginRight = "2%";
          element.style.display = "inline-block";
          element.classList.toggle('muiFieldField');
          element.value = criteria.value.periodStart;
          df.appendChild(element);

          var element           = document.createElement('input');
          element.type          = 'date';
          element.name          = 'date_end';
          element.placeholder   = 'End';
          element.style.width   = "44%";
          element.style.display = "inline-block";
          element.classList.toggle('muiFieldField');
          element.value = criteria.value.periodEnd;
          df.appendChild(element);
          element = df;
        };

        if ( criteria.conditions == 'exist' ) {
          switch(field_type){
            case "String":
              console.log('+exist String');
                select_query.bool = true
                select_query.plain_value = value
              break
            case 'DateTime':
              console.log('+exist DateTime');
              var el           = document.createElement('input');
              el.type          = 'date';
              el.name          = 'date_start';
              el.placeholder   = 'Start';
              el.style.width   = "92%";
              el.style.display = "inline-block";
              el.classList.toggle('muiFieldField');
              el.value = criteria.value.periodStart;
              element = el;
              break;
            case 'Boolean':
              console.log('+exist Boolean');
              var el           = document.createElement('input');
              el.type          = 'date';
              el.name          = 'date_start';
              el.placeholder   = 'Start';
              el.style.width   = "92%";
              el.style.display = "inline-block";
              el.classList.toggle('muiFieldField');
              el.value = criteria.value.periodStart;
              element = el;
              break;
            default:
              break;
          };
        };

        if ( criteria.conditions == 'equal' ) {
          console.log('+equal', field_type, criteria.value, autocomplete_url);
          
          switch(field_type){
            case "String":
              if ( autocomplete_url ) {
                select_query.url   =  autocomplete_url;
                select_query.value =  autocomplete_value;
                select_query.title =  autocomplete_title;
              } else {
                select_query.plain = true
                select_query.plain_value = value
              };
              break
            case "Boolean":
              // select_query.plain = true
              // select_query.plain_value = value
              select_query.bool = true
              select_query.plain_value = value
              break
            case 'DateTime':
              var el           = document.createElement('input');
              el.type          = 'date';
              el.name          = 'date_start';
              el.placeholder   = 'Start';
              el.style.width   = "92%";
              el.style.display = "inline-block";
              el.classList.toggle('muiFieldField');
              el.value = criteria.value.periodStart;
              element = el;
              break;
            default:
              break;
          };
          // select_query.url   =  autocomplete_url;
          // select_query.value =  autocomplete_value;
          // select_query.title =  autocomplete_title;


        };

        if ( criteria.conditions == 'not_equal' ) {
          console.log('+not_equal');

          switch(field_type){
            case "String":
              if ( autocomplete_url ) {
                select_query.url   =  autocomplete_url;
                select_query.value =  autocomplete_value;
                select_query.title =  autocomplete_title;
              } else {
                select_query.plain = true
                select_query.plain_value = value
              };
              break
            default:
              break;
          };
        };

        if ( criteria.conditions == 'regexp' ) {
          console.log('+regexp');
          select_query.url   =  autocomplete_url;
          select_query.value =  autocomplete_value;
          select_query.title =  autocomplete_title;
        };

        if ( criteria.conditions == 'full_text' ) {
          console.log('+full_text');
        };

        if ( criteria.conditions == 'group' ) {
          console.error('+group', field_type, autocomplete_title, autocomplete_value, autocomplete_url);

          select_query.url   =  'classifiers/groups/groups.json';
          select_query.value =  autocomplete_value;
          select_query.title =  autocomplete_title;

        };

        if ( criteria.conditions == 'not_in_group' ) {
          select_query.url   =  'classifiers/groups/groups.json';
          select_query.value =  autocomplete_value;
          select_query.title =  autocomplete_title;

          console.log('+not_in_group');
        };

        select_query.id = value;


        break;
      default:
        console.log(' warn! changeBlockAtributes default ');
        break;
    }

    return [ element, select_query ];
  },
  generateBlock = function( criteria, parent, name, value ){
    console.log( '----- generateBlock', criteria, parent, name, value );
    var _criteria = criteria,
        _parent   = parent,
        _name     = name,
        _value    = value;

    var element = document.createElement('select');
        element.style.display      = 'block';
        element.style.width        = ' 92%';
        element.style.padding      = ' 15px auto';
        element.style.paddingTop   = ' 15px';
        element.style.marginBottom = ' 20px';
        element.style.textAlign    = ' left';

    var element_properties = [];
    element_properties = changeBlockAtributes( criteria, element, name, value );
    
    var select2 = element_properties[1];
        element = element_properties[0];

    if ( select2.hasOwnProperty('plain') ) {
      
      var el = document.createElement('input');
      el.style.display      = 'block';
      el.style.width        = ' 92%';
      el.style.padding      = ' 15px auto';
      el.style.paddingTop   = ' 15px';
      el.style.marginBottom = ' 20px';
      el.classList.toggle('muiFieldField');
      el.style.textAlign    = ' left';
      el.name   = 'value';
      el.value = select2.plain_value;

      console.log('plain!', select2, el)
      parent.appendChild( el );
    } else if ( select2.hasOwnProperty('bool') ) {
      
      var e = generateBoolSelect2(element, value, true);

      console.log('bool!', select2, e)
      parent.appendChild( e );

      $(e).select2()
      .on('change', function(){
        nCore.modules.table.event.publish('newCellSettingsChange' );
      })
    } else {
      parent.appendChild( element );
    };



    if ( nCore.modules.table.active().dataset.hasOwnProperty( value ) ) {
      // console.log( 'ID ', nCore.modules.table.active().dataset, value );
      $(element).append( [ new Option( nCore.modules.table.active().dataset[ value ] , select2.id, true) ] ).val("").trigger("change");
    };

    if ( select2.hasOwnProperty('url') ){
      console.log('has url', select2.url);
      $( element ).select2({
        ajax: {
          url: select2.url,
          dataType: 'json',
          delay: 250,
          data: function (data) {
            return { id: data[ select2.value ], term: data.term };
          },
          processResults: function (data, params) {
            return {
              results: $.map(data, function(p) {
                // console.log('recv', p, select2);
                
                var val = p.hasOwnProperty( select2.title ) ? p[ select2.title ] : p.full_title;

                return {
                  id:    p[ select2.value ],
                  text:  val,
                  value: val
                };
              })
            };
          },
          cache: false
        },
        minimumInputLength: 1,
        placeholder: "Начните ввод"
      }).on('change', function(e){
        nCore.modules.table.active().dataset[ element.value ] = element.options[element.selectedIndex].textContent;
        nCore.modules.table.event.publish('newCellSettingsChange');
      });
    };

    if ( select2.hasOwnProperty('default') ) {
      // console.log( 'ID ', nCore.modules.table.active().dataset[ select2.id ], value );
      $(element).append( [ new Option( select2.default , select2.id, true) ] ).val("").trigger("change");
    };

    if ( select2.hasOwnProperty('available') ) {
      $(element).select2({ placeholder: "Выберете поле" }).on('change', function(){
        
        if( select2.action ){
          select2.action.call(this);
        };

        nCore.modules.table.event.publish('newCellSettingsChange');
      });
    };
  },
  generateSelect2 = function( element, autocomplete_url, autocomplete_value, autocomplete_title, value){
    console.log('     -------- generateSelect2 ---------', element, autocomplete_url, autocomplete_value, autocomplete_title, value, element.nodeName ); 
    
    var parent = element.parentNode;

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    };
    $(element).select2();
    $(element).select2('destroy');

    if ( element.nodeName == 'INPUT' ) {
      parent.removeChild(element);
      var element = document.createElement('select');
      element.style.display      = 'block';
      element.style.width        = ' 92%';
      element.style.padding      = ' 15px auto';
      element.style.paddingTop   = ' 15px';
      element.style.marginBottom = ' 20px';
      element.style.textAlign    = ' left';
      element.name               = 'value';
      parent.appendChild(element)

    };

    $( element ).select2({
      ajax: {
        url: autocomplete_url,
        dataType: 'json',
        delay: 250,
        data: function (data) {
          return { id: data[ autocomplete_value ], term: data.term };
        },
        processResults: function (data, params) {
          return {
            results: $.map(data, function(p) {
              // console.log('recv', p, select2);
              
              var val = p.hasOwnProperty( autocomplete_title ) ? p[ autocomplete_title ] : p.full_title;

              return {
                id:    p[ autocomplete_value ],
                text:  val,
                value: val
              };
            })
          };
        },
        cache: false
      },
      minimumInputLength: 1,
      placeholder: "Начните ввод"
    }).on('change', function(e){
      console.log('element',element,element.value,element)
      nCore.modules.table.active().dataset[ element.value ] = element.options[element.selectedIndex].textContent;
      nCore.modules.table.event.publish('newCellSettingsChange');
    });
    console.log('     -------- generateSelect2 ---------'); 
  },
  generateInput = function( element, value, r){
    var parent = element.parentNode;

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    };
    $(element).select2();
    $(element).select2('destroy');

    var el = document.createElement('input');
    el.style.display      = 'block';
    el.style.width        = ' 92%';
    el.style.padding      = ' 15px auto';
    el.style.paddingTop   = ' 15px';
    el.style.marginBottom = ' 20px';
    el.classList.toggle('muiFieldField');
    el.style.textAlign    = ' left';
    el.name   = 'value';
    el.value = value ? value : '';

    if ( r ) {
      return el
    };

    parent.removeChild(element);
    parent.appendChild(el);
  },
  generateBoolSelect2 = function( element, value, r){
    console.log('generateBoolSelect2 begin', element, value, r);
    var parent = element.parentNode,
        _new = false,
        _el;

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    };
    if ( element.nodeName == 'INPUT' ) {
      console.warn('input!', element, element.parentNode);
      // parent.removeChild(element);
      _new = true;

      
      $(element).select2();
      $(element).select2('destroy');
      parent.removeChild( parent.querySelector('[name="value"]') );

      var _el                = document.createElement('select');
      // _el.style.display      = 'block';
      _el.style.width        = ' 92%';
      _el.style.padding      = ' 15px auto';
      _el.style.paddingTop   = ' 15px';
      _el.style.marginBottom = ' 20px';
      _el.style.textAlign    = ' left';
      _el.name               = "value";

      $(_el).append( [new Option('Да', 'true'), new Option('Нет', 'false')] );
      parent.appendChild(_el);
      $(_el).select2().val( value ).trigger('change');;
    };



    // parent.appendChild(element);
    
    $(element).append( [new Option('Да', 'true'), new Option('Нет', 'false')] ).val( value ).trigger("change");

    var usedNames = {};
    $().each(function () {
      usedNames[this.text] ? $(this).remove(): usedNames[this.text] = this.value;
    });

    console.log('generateBoolSelect2 end', element);
    if ( _new ) {
      return _el;
    };
    if (r) {
      return element
    };
  },
  updateBlock = function( element, name, value  ){
    console.log( '----- updateBlock ----- ', element );
    var element = element;
        parent  = element.parentNode;


    // console.info( element );
    
    // if ( element.name == 'date_start') {
    //   parent.removeChild( parent.querySelector('[name="date_end"]') )
    //   parent.removeChild( parent.querySelector('[name="date_start"]') )
    //   element.name = 'value';
    // };

    var field_array  = JSON.parse( nCore.storage.getItem( parent.querySelector('[name="source"]').value ) ),
        origin_name  = parent.querySelector('[name="origin_name"]').value,
        conditions   = parent.querySelector('[name="conditions"]').value,
        field_type = '',
        autocomplete_title = '',
        autocomplete_value = '',
        autocomplete_url = '';
    

    field_array.forEach(function(obj){
      if ( obj['_id'] == origin_name || obj['id'] == origin_name ) {
        console.log( '+++++++', obj );
        autocomplete_title = obj['autocomplete_title'];
        autocomplete_value = obj['autocomplete_value'];
        autocomplete_url   = obj['autocomplete_url'];
        field_type         = obj['data_type'];
      };
    });
    console.error(' ---- conditions', conditions );
    
    // если есть дефолтное значение то обновляем поле
    if ( value ) {

      true;
    }
    // если нет то строим заново
    else {
      var el = document.createElement('input');
      el.style.display      = 'block';
      el.style.width        = ' 92%';
      el.style.padding      = ' 15px auto';
      el.style.paddingTop   = ' 15px';
      el.style.marginBottom = ' 20px';
      el.style.textAlign    = ' left';
      el.name   = 'value';

      // $(element).select2('destroy');

      // parent.replaceChild( el, element );
      // parent.appendChild( el );
    };

    switch( conditions ){
      case 'range':
        parent.removeChild(element);

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
        console.log('+range');
        break;
      case 'exist':
        // if ( autocomplete_url ){
          // console.log('auto');
          // generateBoolSelect2(element, value);
          $(element).select2();
          $(element).select2('destroy');

          element = generateBoolSelect2(element, value, true);
          $(element).select2()
          .on('change', function(){
            nCore.modules.table.event.publish('newCellSettingsChange' );
          })
        // };
        // console.log('+exist');
        break;
      case 'equal':
        console.log('+equal', field_type);

        // если есть автокомплитер
        switch(field_type){
          case 'Boolean':
            console.log('bool');
            element = generateBoolSelect2(element, value, true);
            break;
          case 'DateTime':
            console.log('datetime', parent, element);
            parent.removeChild(element);

            var element           = document.createElement('input');
            element.type          = 'date';
            element.name          = 'date_start';
            element.placeholder   = 'Start';
            element.style.width   = "92%";
            element.style.display = "inline-block";
            element.classList.toggle('muiFieldField');
            parent.appendChild(element);
            break;
          case 'String':
            if ( autocomplete_url ){
              console.log('auto', element, autocomplete_url, autocomplete_value, autocomplete_title);
              generateSelect2(element, autocomplete_url, autocomplete_value, autocomplete_title);
            } else {
              console.log('not auto', element);
              generateInput(element, value);
            }
            break;
          default:
            console.log('---')
            break;
        };
        break;
      case 'not_equal':
        console.log('+not_equal');
        if ( autocomplete_url.length ){
          generateSelect2(element, autocomplete_url, autocomplete_value, autocomplete_title);
        } else {

        };
        break;
      case 'regexp':
        console.log('+regexp');
        if ( autocomplete_url ){
          generateSelect2(element, autocomplete_url, autocomplete_value, autocomplete_title);
        };
        break;
      case 'full_text':
        console.log('+full_text');
        if ( autocomplete_url ){
          generateSelect2(element, autocomplete_url, autocomplete_value, autocomplete_title);
        };
        break;
      case 'group':
        console.error('+group', field_type, autocomplete_title, autocomplete_value, autocomplete_url);
        
        autocomplete_url = 'classifiers/groups/groups.json';
        generateSelect2(element, autocomplete_url, autocomplete_value, autocomplete_title);

        break;
      case 'not_in_group':
        console.log('+not_in_group');
        autocomplete_url = 'classifiers/groups/groups.json';
        if ( autocomplete_url ){
          generateSelect2(element, autocomplete_url, autocomplete_value, autocomplete_title);
        };
        break;
      default:
        console.warn('default');
        break;
    };

    // select_query.id = value;

    console.log( '----- updateBlock ----- ' );
  };

  return {
    newCell           : newCell,
    cells             : cells,
    generateFromQuery : generateFromQuery,
    generateBlock     : generateBlock,
    updateBlock       : updateBlock,
    init              : init
  }
})();