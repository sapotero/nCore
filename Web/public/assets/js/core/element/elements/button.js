var Button = function Button( config ) {
  this.config = config;

  this.element = document.createElement( 'button' );
  this.element.classList.add( this.CSS.BUTTON );
  this.element.classList.add( this.CSS.BUTTON_JS );
  this.element.id = core.utils.generateId();

  this.render();
}

Button.prototype.CSS = {
  BUTTON      : 'mdl-button',
  BUTTON_JS   : 'mdl-js-button',
  BUTTON_ICON : 'mdl-button-icon',
  FAB         : 'mdl-button--fab',
  FAB_MINI    : 'mdl-button--mini-fab',
  EFFECT      : 'mdl-js-ripple-effect',
  RAISED      : 'mdl-button--raised',
  ACCENT      : 'mdl-button--accent',
  ICON        : 'material-icons',
  RIPPLE      : 'mdl-js-ripple-effect'
}

Button.prototype.setText = function( text ) {
  this.element.textContent = text;
}
Button.prototype.setCallback = function( config ) {
  this.context  = config.context;
  this.function = config.function;
}
Button.prototype.setFab = function() {
  this.element.classList.add( this.CSS.FAB );
  this.element.classList.add( this.CSS.FAB_MINI );
}
Button.prototype.setRipple = function() {
  this.element.classList.add( this.CSS.EFFECT );
}
Button.prototype.setRaised = function() {
  this.element.classList.add( this.CSS.RAISED );
}
Button.prototype.setColor = function() {
  this.element.classList.add( this.CSS.ACCENT );
}
Button.prototype.setFlat = function() {
  return this;
}
Button.prototype.setIcon = function( _icon ) {
  this.element.classList.add( this.CSS.BUTTON_ICON );

  var icon = document.createElement('i');
  icon.classList.add( this.CSS.ICON );
  icon.textContent = _icon;
  
  this.element.appendChild( icon );
}


Button.prototype.render = function() {

  for( var key in this.config ){
    var action = core.utils.toCamelCase( 'set.' + key );

    try{
      this[ action ]( this.config[ key ] );
    } catch(e) {
      // throw new Error('no method in prototype')
      // console.log('no method in prototype', action);
    }
  }

  this.element._config = this.config;

  if ( this.config.hasOwnProperty('callback') && typeof this.config.callback.function === 'function' ) {
    this.config.callback.context = this.config.callback.context || this;
    this.element.addEventListener( 'click', this.config.callback.function.bind( this.config.callback.context ) );
  }

  return this;
};
module.exports = Button;