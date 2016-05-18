var Button = function Button( config ) {
  this.element = document.createElement( 'button' );
  this.element.className = 'mdl-button mdl-js-button';
  this.element.id = core.utils.generateId();

  this.config = config;

  this.render();
}

Button.prototype.setText = function( text ) {
  this.element.textContent = text;
}
Button.prototype.setCallback = function( config ) {
  this.context  = config.context;
  this.function = config.function;
}
Button.prototype.setFab = function() {
  this.element.classList.add('mdl-button--fab');
}
Button.prototype.setRipple = function() {
  this.element.classList.add('mdl-js-ripple-effect');
}
Button.prototype.setRaised = function() {
  this.element.classList.add('mdl-button--raised');
}
Button.prototype.setColor = function() {
  this.element.classList.add('mdl-button--accent');
}
Button.prototype.setFlat = function() {
  return this;
}
Button.prototype.setIcon = function( _icon ) {
  this.element.classList.add('mdl-button--icon');

  var icon = document.createElement('i');
  icon.classList.add('material-icons');
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
  
  if ( typeof this.function === 'function' ) {
    this.element.addEventListener( 'click', this.function.bind( this.context ) );
  }

  return this;
};
module.exports = Button;