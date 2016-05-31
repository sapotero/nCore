var Input = function Input( config ) {
  this.element = document.createElement( 'div' );
  this.element.classList.add( this.CSS.ROOT );
  this.element.classList.add( this.CSS.ROOT_JS );


  this.input = document.createElement( 'input' );
  this.input.classList.add( this.CSS.INPUT );
  this.input.type = 'text';
  this.input.id   = core.utils.generateId();

  this.element.setAttribute( 'for', this.input.id );

  this.label = document.createElement( 'label' );
  this.label.classList.add( this.CSS.LABEL );

  this.element.appendChild( this.input );
  this.element.appendChild( this.label );

  this._config = config;
  this.element._config = config;

  // <!-- Textfield with Floating Label -->
  //   <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
  //     <input class="mdl-textfield__input" type="text" id="sample3">
  //     <label class="mdl-textfield__label" for="sample3">Text...</label>
  //   </div>

  this.render();
}

Input.prototype.setLabel = function( string ){
  this.label.textContent = string;
};
Input.prototype.setFloat = function(){
  this.element.classList.add( this.CSS.LABEL_FLOAT );
};
Input.prototype.setClass = function( string ){
  this.element.classList.add( string );
};
Input.prototype.setValue = function( string ){
  this.input.value = string;
};
Input.prototype.setName = function( string ){
  this.input.name = string;
};
Input.prototype.setRequire = function(){
  this.input.setAttribute( 'required', true );
};

Input.prototype.render = function( string ){

  if ( this._config && this._config.hasOwnProperty('class') ) {
    this.setClass( this._config.class );
  };
  if ( this._config && this._config.hasOwnProperty('label') ) {
    this.setLabel( this._config.label );
  };
  if ( this._config && this._config.hasOwnProperty('float') && this._config.float === true ) {
    this.setFloat();
  };
  if ( this._config && this._config.hasOwnProperty('value') ) {
    this.setValue( this._config.value );
  };
  if ( this._config && this._config.hasOwnProperty('name') ) {
    this.setName( this._config.name );
  };
  if ( this._config && this._config.hasOwnProperty('require') && this._config.require === true ) {
    this.setRequire();
  };

  if ( this._config.hasOwnProperty('input') && typeof this._config.input.function === 'function' ) {
    this._config.input.context = this._config.input.context || this;
    this.input.addEventListener( 'input', this._config.input.function.bind( this._config.input.context, this.input.value ) );
  }

  this.element._conf = this;
  
  return this;
};

Input.prototype.CSS = {
  ROOT        : "mdl-textfield",
  ROOT_JS     : "mdl-js-textfield",
  INPUT       : "mdl-textfield__input",
  LABEL       : "mdl-textfield__label",
  LABEL_FLOAT : "mdl-textfield--floating-label",
};

module.exports = Input;