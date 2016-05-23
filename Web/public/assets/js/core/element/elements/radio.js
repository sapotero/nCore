var Radio = function( config ) {
  this.element = document.createElement( 'label' );
  this.element.classList.add( this.CSS.CHECKBOX );
  this.element.classList.add( this.CSS.CHECKBOX_JS );
  this.element.classList.add( this.CSS.RIPPLE );


  this.radio = document.createElement( 'input' );
  this.radio.classList.add( this.CSS.INPUT );
  this.radio.type = 'radio';
  this.radio.id   = core.utils.generateId();

  this.element.setAttribute( 'for', this.radio.id );

  this.label = document.createElement( 'span' );
  this.label.classList.add( this.CSS.LABEL );

  this.element.appendChild( this.radio );
  this.element.appendChild( this.label );

  this._config = config;
  this.element._config = config;

  // <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-1">
  //   <input type="radio" id="option-1" class="mdl-radio__button" name="options" value="1" checked>
  //   <span class="mdl-radio__label">First</span>
  // </label>

  this.render();
}
Radio.prototype = Object.create( require('./input').prototype );
Radio.prototype.constructor = Radio;

Radio.prototype.setChecked = function( checked ){
  this.radio.setAttribute('checked', checked);
}
Radio.prototype.setLabel = function( string ){
  this.label.textContent = string;
};
Radio.prototype.setClass = function( string ){
  this.element.classList.add( string );
};
Radio.prototype.setName = function( string ){
  this.radio.name = string;
};
Radio.prototype.setValue = function( string ){
  this.radio.value = string;
};

Radio.prototype.render = function( string ){

  if ( this._config && this._config.hasOwnProperty('class') ) {
    this.setClass( this._config.class );
  };
  if ( this._config && this._config.hasOwnProperty('checked') ) {
    this.setChecked( this._config.checked );
  };
  if ( this._config && this._config.hasOwnProperty('label') ) {
    this.setLabel( this._config.label );
  };
  if ( this._config && this._config.hasOwnProperty('name') ) {
    this.setName( this._config.name );
  };
  if ( this._config && this._config.hasOwnProperty('value') ) {
    this.setValue( this._config.value );
  };

  return this;
};

Radio.prototype.CSS = {
  INPUT       : "mdl-radio__button",
  CHECKBOX    : "mdl-radio",
  CHECKBOX_JS : "mdl-js-radio",
  LABEL       : "mdl-radio__label",
  RIPPLE      : "mdl-js-ripple-effect",
};

module.exports = Radio;