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

  var _criteria = {},
      _root     = {};

  var Builder = function( criteria, root ){
    this.criterias = criteria;
    this.root      = root;
  };
  Builder.prototype.clear = function(){
    try {
      $(element).select2('destroy');
    } catch (e){
      console.log(e);
    }

    try{
      var element = this.root.querySelector('[name="value"]');
      if ( element ) {
        element.parentNode.removeChild(element);
      }
    }catch(e){
      console.log('error!', e);
    }

    try{
      if ( this.root.querySelector('[type="date"]') ) {
        var dates = this.root.querySelectorAll('[type="date"]');
        for (var x = dates.length - 1; x >= 0; x--) {
          console.log( 'dates[x]', dates[x] );
          $( dates[x] ).remove();
        }
      }
    } catch(e){
      console.log('dates');
    }
  };
  Builder.prototype.criteria_condition = function(empty) {
     this.root.querySelector('[name="criteria_condition_group"]').value = this.criterias.criteria_condition;
  };
  Builder.prototype.source = function(empty) {
    var df         = new DocumentFragment(),
      criteriaKeys = JSON.parse( nCore.storage.criteriaKeys ),
      element      = document.createElement('select');

    // select2 will not override this
    element.name             = 'source';
    element.style.display    = "block";
    element.style.width      = "92%";
    element.style.paddingTop = "15px";
    element.style.textAlign  = "left";

    for ( var q = 0; q < criteriaKeys.length; q++ ) {
    df.appendChild( new Option( criteriaKeys[q].name, criteriaKeys[q].value ) );
    }

    element.appendChild(df);
    element.value = this.criterias.source;

    this.root.querySelector('.criteriaForm').appendChild( element );

    $(element).select2().on('change', function(){
      nCore.modules.table.event.publish('newCellSettingsChange');
    });
  };
  Builder.prototype.conditions = function(empty) {
    var field_array  = JSON.parse( nCore.storage.getItem( this.criterias.source ) ),
        field_type,
        autocomplete_title,
        autocomplete_value,
        autocomplete_url,
    
    element      = document.createElement('select');
    element.name = 'conditions';
    element.style.display    = "block";
    element.style.width      = "92%";
    element.style.paddingTop = "15px";
    element.style.textAlign  = "left";

    for (var z = field_array.length - 1; z >= 0; z--) {
      var field = field_array[z];
      if ( field._id == this.criterias.origin_name || field.id == this.criterias.origin_name ) {
        autocomplete_title = field.autocomplete_title;
        autocomplete_value = field.autocomplete_value;
        autocomplete_url   = field.autocomplete_url;
        field_type         = field.data_type;
      }
    }

    field_type = field_type ? field_type : 'Formula';

    var types = nCore.types[ field_type ],
        df    = new DocumentFragment();

    for (var z = 0; z < types.length; z++) {
      var option = document.createElement('option');
      option.value = types[z].value;
      option.text = types[z].caption;
      df.appendChild(option);
    }
    
    element.appendChild(df);
    element.value = this.criterias.conditions;
    
    this.root.querySelector('.criteriaForm').appendChild( element );
    
    $(element).select2().on('change', function(){
      nCore.modules.table.event.publish('newCellSettingsChange');
    });
  };
  Builder.prototype.origin_name = function(empty) {
    var df          = new DocumentFragment(),
    originTable = JSON.parse( nCore.storage.getItem( this.criterias.source ) ),
    element     = document.createElement('select');
    
    // select2 will not override this
    element.name = 'origin_name';
    element.style.display    = "block";
    element.style.width      = "92%";
    element.style.paddingTop = "15px";
    element.style.textAlign  = "left";

    for (var q = 0; q < originTable.length; q++) {
      var option = document.createElement('option');
      option.value = originTable[q]._id;
      option.text  = originTable[q].russian_name;
      
      option.dataset.auto = originTable[q].autocomplete_url;
      option.dataset.type = originTable[q].data_type;
      df.appendChild(option);
    }
    
    // добавляем формулу для того чтобы считать сложные запросы
    var option = document.createElement('option');
    option.value = 'formula';
    option.text  = 'Формула';
    df.appendChild(option);


    element.appendChild(df);
    element.value = this.criterias.origin_name;
    
    this.root.querySelector('.criteriaForm').appendChild( element );
    
    $(element).select2().on('change', function(){
      nCore.modules.table.event.publish('newCellSettingsChange');
    });
  };
  Builder.prototype.value = function(empty) {
    empty = empty || false;


    var field_array  = JSON.parse( nCore.storage.getItem( this.criterias.source ) ),
        field_type,
        autocomplete_title,
        autocomplete_value,
        autocomplete_url;

    for (var x = field_array.length - 1; x >= 0; x--) {
      var field = field_array[x];
      if ( field._id == this.criterias.origin_name || field.id == this.criterias.origin_name ) {
        autocomplete_title = field.autocomplete_title;
        autocomplete_value = field.autocomplete_value;
        autocomplete_url   = field.autocomplete_url;
        field_type         = field.data_type;
      }
    }

    field_type = field_type || 'Formula';

    console.info( this, this.criterias, this.criterias.value, autocomplete_title, autocomplete_value, autocomplete_url, field_type );


    switch( field_type ){
      
      case "String":
        var generateSelect2 = function(group){
          this.clear();
          // console.log( 'STRING equal', this.criterias, autocomplete_url, nCore.modules.table.active().dataset[ this.criterias.value ] );
          
          group = group || false;
          if ( group ) {
            autocomplete_url = 'classifiers/groups/groups.json';
            // хуйня с регистратором и редактором в обращениях граждан ( см. настройки расширенного поиска эластика )
            autocomplete_value = "_id";
          }

          if ( autocomplete_url ) {
            var element  = document.createElement('select');
            element.name = 'value';
            element.style.display    = "block";
            element.style.width      = "92%";
            element.style.paddingTop = "15px";
            element.style.textAlign  = "left";

            console.log( !empty,  nCore.modules.table.active() && nCore.modules.table.active().hasOwnProperty('dataset') );

            // conditions.log
            if ( nCore.document.ShowSettings() && nCore.document.globalQueryData().hasOwnProperty(this.criterias.value) ) {
              console.log('globalQuery');
              $(element).append( [ new Option( nCore.document.globalQueryData()[ this.criterias.value ] , this.criterias.value, true) ] );
            } else if ( !empty && nCore.modules.table.active() && nCore.modules.table.active().dataset.hasOwnProperty( this.criterias.value ) ) {
              console.log('not globalQuery');
              $(element).append( [ new Option( nCore.modules.table.active().dataset[ this.criterias.value ] , this.criterias.value, true) ] );
            }


            this.root.querySelector('.criteriaForm').appendChild( element );

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
                      // //console.log('recv', p, select2);
                      
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
              console.log('element', e, element, element.value,element);

              if ( nCore.document.ShowSettings() ) {
                console.log( 'globalQuery' );
                nCore.document.globalQueryData()[ element.value ] = '';
                nCore.document.globalQueryData()[ element.value ] = element.textContent;
              } else {
                nCore.modules.table.active().dataset[ element.value ] = '';
                nCore.modules.table.active().dataset[ element.value ] = element.textContent;
              }
              
              nCore.modules.table.event.publish('newCellSettingsChange');
            });
          } else {
            
            var element  = document.createElement('input');
            element.name = 'value';
            element.style.display    = "block";
            element.style.width      = "92%";
            element.style.paddingTop = "15px";
            element.style.textAlign  = "left";
            element.placeholder      = 'Введите текст';
            element.classList.toggle('muiFieldField');

            element.value = this.criterias.value;
            this.root.querySelector('.criteriaForm').appendChild( element );
          }
        },
        generatePlain = function(){
          this.clear();
          var element      = document.createElement('input');
          element.name = 'value';
          element.style.display    = "block";
          element.style.width      = "92%";
          element.style.paddingTop = "15px";
          element.style.textAlign  = "left";
          element.classList.toggle('muiFieldField');
          element.placeholder        = 'Введите текст';
          element.value = this.criterias.value;
          this.root.querySelector('.criteriaForm').appendChild( element );

          console.log( 'STRING regexp', this.criterias ); 
        },
        generateBool = function(){
          this.clear();

          var element             = document.createElement('select');
          element.style.width     = '92%';
          element.style.padding   = '15px auto';
          element.style.textAlign = 'left';
          element.name            = "value";

          // parent.appendChild(element);
          
          var _default = new Option( 'Выберете', '' );
            _default.disabled = true;
            _default.selected = true;

          $(element).append( [ _default, new Option('Да', 'true'), new Option('Нет', 'false') ] ).val( this.criterias.value ).trigger("change");

          this.root.querySelector('.criteriaForm').appendChild( element );
          $(element).select2();
        };

        switch( this.criterias.conditions ){
          case "equal":
            generateSelect2.call(this);
            break;
          case "not_equal":
            generateSelect2.call(this);
            break;
          case "regexp":
            console.log( 'STRING regexp', this.criterias ); 
            generatePlain.call(this);
            break;
          case "full_text":
            console.log( 'STRING full_text', this.criterias ); 
            generatePlain.call(this);
            break;
          case "group":
            generateSelect2.call(this, true);
            break;
          case "not_in_group":
            generateSelect2.call(this, true);
            break;
          case "exist":
            console.log( 'STRING exist', this.criterias );
            generateBool.call(this);
            break;
          default:
            console.log(''); 
            break;
        }
        break;
      case "DateTime":
        var generateEqual = function(group){
          this.clear();
          var element           = document.createElement('input');
          element.type          = 'date';
          element.name          = 'date_start';
          element.placeholder   = 'Выберете дату';
          element.style.width   = "92%";
          element.classList.toggle('muiFieldField');
          element.classList.toggle('muiFieldFieldDate');
          element.value = this.criterias.value.periodStart == undefined ? '' : this.criterias.value.periodStart;
          this.root.querySelector('.criteriaForm').appendChild(element);
        },
        generateRange = function(){
          this.clear();
          
          var df = new DocumentFragment();
          
          var element  = document.createElement('input');
          element.type = 'date';
          element.name = 'date_start';
          element.classList.toggle('muiFieldField');
          element.classList.toggle('muiFieldFieldDate');
          element.value = this.criterias.value.periodStart == undefined ? '' : this.criterias.value.periodStart;
          df.appendChild(element);

          element      = document.createElement('input');
          element.type = 'date';
          element.name = 'date_end';
          element.classList.toggle('muiFieldField');
          element.classList.toggle('muiFieldFieldDate');
          element.value = this.criterias.value.periodEnd == undefined ? '' : this.criterias.value.periodEnd;
          df.appendChild(element);

          this.root.querySelector('.criteriaForm').appendChild( df );
        },
        generateBool = function(){
          this.clear();

          var element             = document.createElement('select');
          element.style.width     = '92%';
          element.style.padding   = '15px auto';
          element.style.textAlign = 'left';
          element.name            = "value";

          // parent.appendChild(element);
          
          var _default = new Option( 'Выберете', '' );
            _default.disabled = true;
            _default.selected = true;

          $(element).append( [ _default, new Option('Да', 'true'), new Option('Нет', 'false') ] ).val( this.criterias.value ).trigger("change");

          this.root.querySelector('.criteriaForm').appendChild( element );
          $(element).select2();
        };

        switch( this.criterias.conditions ){
          case "equal":
            generateEqual.call(this);
            break;
          case "range":
            generateRange.call(this);
            break;
          case "month":
            generateBool.call(this);
            break;
          default:
            break;
        }

        if(!Modernizr.inputtypes.date ) {
          $('[name="date_start"],[name="date_end"]').fdatepicker({format: 'yyyy-mm-dd'});
        }

        break;
      case "Boolean":
        var generate = function() {
          this.clear();

          var element             = document.createElement('select');
          element.style.width     = '92%';
          element.style.padding   = '15px auto';
          element.style.textAlign = 'left';
          element.name            = "value";

          // parent.appendChild(element);
          
          var _default = new Option( 'Выберете', '' );
            _default.disabled = true;
            _default.selected = true;

          $(element).append( [ _default, new Option('Да', 'true'), new Option('Нет', 'false') ] ).val( this.criterias.value ).trigger("change");

          this.root.querySelector('.criteriaForm').appendChild( element );
          $(element).select2();
        };

        switch( this.criterias.conditions ){
          case 'equal':
            generate.call(this);
            break;
          case "not_equal":
            generate.call(this);
            break;
          case "exist":
            generate.call(this);
        }
        break;
      case "Fixnum":
        generatePlain = function(){
          this.clear();
          element      = document.createElement('input');
          element.name = 'value';
          element.style.display    = "block";
          element.style.width      = "92%";
          element.style.paddingTop = "15px";
          element.style.textAlign  = "left";
          element.classList.toggle('muiFieldField');
          element.placeholder        = 'Введите текст';
          element.value = this.criterias.value;
          this.root.querySelector('.criteriaForm').appendChild( element );

          console.log( 'STRING regexp', this.criterias ); 
        };

        switch( this.criterias.conditions ){

          case "exist":
            generatePlain.call(this);
            break;
          case "equal":
            generatePlain.call(this);
            break;
          case "gt":
            generatePlain.call(this);
            break;
          case "gte":
            generatePlain.call(this);
            break;
          case "lt":
            generatePlain.call(this);
            break;
          case "lte":
            generatePlain.call(this);
            break;
          case "sum":
            generatePlain.call(this);
            break;
          default:
            console.log( 'unknown conditions' );
            break;
        }
        break;
      case "Formula":
        var generate = function(){
          this.clear();

          var element           = document.createElement('textarea');
          element.rows          = 10;
          element.cols          = 70;
          element.name          = 'value';
          element.placeholder   = 'Формула...';
          element.value         = this.criterias.value;
          element.classList.toggle('textreaGenerate');

          this.root.querySelector('.criteriaForm').appendChild( element );
        };

        switch( this.criterias.conditions ){
          case "equal":
            generate.call(this);
            break;
          case "sum":
            generate.call(this);
            break;
        }
        break;
      default:
        console.warn( 'unknown type', field_type );
        break;
    }

  };


  var init = function(){
  },
  generateForm = function( criteria, root, globalQuery ){
    console.groupCollapsed("generateForm");
    
    globalQuery = globalQuery || false;

    console.info( 'criteria:'    , criteria );
    console.info( 'root:'        , root );
    console.info( 'globalQuery:' , globalQuery );

    _criteria = criteria;
    this.root   = root;

    var builder = new Builder( _criteria, this.root);

    console.log('builder', builder);

    for( var key in criteria ){
      console.log('key: ', key, ' -> ',_criteria[ key ] );

      switch( key ){
        case 'criteria_condition':
          builder.criteria_condition();
          break;
        case 'source':
          builder.source();
          break;
        case 'origin_name':
          builder.origin_name();
          break;
        case 'conditions':
          builder.conditions();
          break;
        case 'value':
          builder.value();
          break;
      }
    }

    console.groupEnd();
  };

  return {
    init              : init,
    builder           : Builder,
    generateForm      : generateForm

  }
})();
nCore.modules.cell.init();