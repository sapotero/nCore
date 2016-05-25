var Switch = function Switch( config ) {
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

  // <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-1">
  //   <input type="checkbox" id="switch-1" class="mdl-switch__input" checked>
  //   <span class="mdl-switch__label"></span>
  // </label>

  this.render();
}
Switch.prototype = Object.create( require('./input').prototype );
Switch.prototype.constructor = Switch;

Switch.prototype.setChecked = function( checked ){
  this.checkbox.setAttribute('checked', checked);
}
Switch.prototype.setLabel = function( string ){
  this.label.textContent = string;
};
Switch.prototype.setClass = function( string ){
  this.element.classList.add( string );
};
Switch.prototype.setRequire = function( string ){
  this.checkbox.setAttribute( 'required', string );
};

Switch.prototype.render = function( string ){

  if ( this._config && this._config.hasOwnProperty('class') ) {
    this.setClass( this._config.class );
  };
  if ( this._config && this._config.hasOwnProperty('checked') ) {
    this.setChecked( this._config.checked );
  };
  if ( this._config && this._config.hasOwnProperty('label') ) {
    this.setLabel( this._config.label );
  };
  if ( this._config && this._config.hasOwnProperty('require') ) {
    this.setRequire( this._config.require );
  };

  if ( this._config.hasOwnProperty('toggle') && typeof this._config.toggle.function === 'function' ) {
    this._config.toggle.context = this._config.toggle.context || this;
    this.checkbox.addEventListener( 'change', this._config.toggle.function.bind( this._config.toggle.context ) );
  }

  this.element._config = this._config;
  
  this.element._conf = this;

  return this;
};

Switch.prototype.CSS = {
  INPUT       : "mdl-switch__input",
  CHECKBOX    : "mdl-switch",
  CHECKBOX_JS : "mdl-js-switch",
  LABEL       : "mdl-switch__label",
  RIPPLE      : "mdl-js-ripple-effect",
};

module.exports = Switch;