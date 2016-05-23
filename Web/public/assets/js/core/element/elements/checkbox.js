var Checkbox = function( config ) {
  this.element = document.createElement( 'label' );
  this.element.classList.add( this.CSS.CHECKBOX );
  this.element.classList.add( this.CSS.CHECKBOX_JS );
  this.element.classList.add( this.CSS.RIPPLE );


  this.checkbox = document.createElement( 'input' );
  this.checkbox.classList.add( this.CSS.INPUT );
  this.checkbox.type = 'checkbox';
  this.checkbox.id   = core.utils.generateId();

  this.element.setAttribute( 'for', this.checkbox.id );

  this.label = document.createElement( 'span' );
  this.label.classList.add( this.CSS.LABEL );

  this.element.appendChild( this.checkbox );
  this.element.appendChild( this.label );

  this._config = config;
  this.element._config = config;

  // <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-1">
  //   <input type="checkbox" id="checkbox-1" class="mdl-checkbox__input" checked>
  //   <span class="mdl-checkbox__label">Checkbox</span>
  // </label>

  this.render();
}
Checkbox.prototype = Object.create( require('./input').prototype );
Checkbox.prototype.constructor = Checkbox;

Checkbox.prototype.setChecked = function( checked ){
  this.checkbox.setAttribute('checked', checked);
}

Checkbox.prototype.setLabel = function( string ){
  this.label.textContent = string;
};
Checkbox.prototype.setClass = function( string ){
  this.element.classList.add( string );
};

Checkbox.prototype.render = function( string ){

  if ( this._config && this._config.hasOwnProperty('class') ) {
    this.setClass( this._config.class );
  };
  if ( this._config && this._config.hasOwnProperty('checked') ) {
    this.setChecked( this._config.checked );
  };
  if ( this._config && this._config.hasOwnProperty('label') ) {
    this.setLabel( this._config.label );
  };

  return this;
};

Checkbox.prototype.CSS = {
  INPUT       : "mdl-checkbox__input",
  CHECKBOX    : "mdl-checkbox",
  CHECKBOX_JS : "mdl-js-checkbox",
  LABEL       : "mdl-checkbox__label",
  RIPPLE      : "mdl-js-ripple-effect",
};

module.exports = Checkbox;