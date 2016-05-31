var Textarea = function( config ) {
  this.element = document.createElement( 'div' );
  this.element.classList.add( this.CSS.TEXTAREA );
  this.element.classList.add( this.CSS.TEXTAREA_JS );


  this.textarea = document.createElement( 'textarea' );
  this.textarea.classList.add( this.CSS.INPUT );
  this.textarea.id   = core.utils.generateId();

  this.element.setAttribute( 'for', this.textarea.id );

  this.label = document.createElement( 'label' );
  this.label.classList.add( this.CSS.LABEL );

  this.element.appendChild( this.textarea );
  this.element.appendChild( this.label );

  this._config = config;
  this.element._config = config;

  // <div class="mdl-textfield mdl-js-textfield">
  //   <textarea class="mdl-textfield__input" type="text" rows= "10" cols="200" id="sample5" ></textarea>
  //   <label class="mdl-textfield__label" for="sample5">Text lines...</label>
  // </div>

  this.render();
}
Textarea.prototype.setRows = function( string ){
  this.textarea.rows = string;
};
Textarea.prototype.setCols = function( string ){
  this.textarea.cols = string;
};
Textarea.prototype.setLabel = function( string ){
  this.label.textContent = string;
};
Textarea.prototype.setClass = function( string ){
  this.element.classList.add( string );
};
Textarea.prototype.setName = function( string ){
  this.textarea.name = string;
};
Textarea.prototype.setValue = function( string ){
  this.textarea.value = string;
};

Textarea.prototype.render = function( string ){

  if ( this._config && this._config.hasOwnProperty('class') ) {
    this.setClass( this._config.class );
  };
  if ( this._config && this._config.hasOwnProperty('label') ) {
    this.setLabel( this._config.label );
  };
  if ( this._config && this._config.hasOwnProperty('rows') ) {
    this.setRows( this._config.rows );
  };
  if ( this._config && this._config.hasOwnProperty('cols') ) {
    this.setCols( this._config.cols );
  };
  if ( this._config && this._config.hasOwnProperty('name') ) {
    this.setName( this._config.name );
  };
  if ( this._config && this._config.hasOwnProperty('value') ) {
    this.setValue( this._config.value );
  };

  return this;
};

Textarea.prototype.CSS = {
  INPUT       : "mdl-textfield__input",
  TEXTAREA    : "mdl-textfield",
  TEXTAREA_JS : "mdl-js-textfield",
  LABEL       : "mdl-textfield__label"
};

module.exports = Textarea;