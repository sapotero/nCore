var Select = function Select( config ) {
  this._config = config;

  this.element = document.createElement( 'div' );
  this.element.classList.add( this.CSS.ROOT );

  this.label = document.createElement( 'label' );
  this.label.classList.add( this.CSS.LABEL );

  this.select = document.createElement( 'select' );
  this.select.classList.add( this.CSS.SELECT );

  this.element.appendChild( this.label );
  this.element.appendChild( this.select );

  this.element._config = config;

  // <div class="mdl-select">
  //   <label class="mdl-select__label">Standard Select</label>
  //   <select class="mdl-select__element">
  //     <option class="mdl-select__element-item" value="" disabled selected>Choose your option</option>
  //     <option class="mdl-select__element-item" value="1">Option 1</option>
  //     <option class="mdl-select__element-item" value="2">Option 2</option>
  //     <option class="mdl-select__element-item" value="3">Option 3</option>
  //   </select>
  // </div>

  this.render();
}

Select.prototype.CSS = {
  ROOT    : "mdl-selectfield",
  LABEL   : "mdl-select__label",
  SELECT  : "mdl-select__element",
  ITEM    : "mdl-select__element-item",
}

Select.prototype.setLabel = function( string ){
  this.label.textContent = string;
};
Select.prototype.setClass = function( classes ){
  if ( classes.length ) {
    for (var i = classes.length - 1; i >= 0; i--) {
      this.element.classList.add( classes[i] );
    }
  } else {
    this.element.className += ' ' + classes;
  }
};

Select.prototype.render = function(){
  if ( this._config && this._config.hasOwnProperty('label') ) {
    this.setLabel( this._config.label );
  };
  if ( this._config && this._config.hasOwnProperty('class') ) {
    this.setClass( this._config.class );
  };

  if ( this._config.hasOwnProperty('items') && this._config.items.constructor === Array ) {
    for (var i = 0, length = this._config.items.length; i < length; i++) {
      var item = this._config.items[i];
      // console.log( 'menu item', item );

      if ( item.hasOwnProperty('element') ) {
        this.element.appendChild( item.element );
      } else {
        var option = document.createElement('option');
        option.textContent = item.text;
        option.name = item.name;

        if ( item.hasOwnProperty('disabled') && item.disabled === true ) {
          option.setAttribute( 'disabled', true );
        }
        if ( item.hasOwnProperty('default') && item.default === true ) {
          option.setAttribute( 'default', true );
        }

        this.select.appendChild( option );
      }
    }
  }


  if ( this._config.hasOwnProperty('select') && typeof this._config.select.function === 'function' ) {
    this._config.select.context = this._config.select.context || this;
    this._config.select.function.bind( this._config.select.context );
  }


  return this;
};

module.exports = Select;