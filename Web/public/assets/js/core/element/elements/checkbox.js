var Checkbox = function( config ) {
  this.element      = document.createElement( 'input' );
  this.element.type = 'checkbox';
  this.element.id   = core.utils.generateId();

  this.config = config;

  this.render();
}
Checkbox.prototype = Object.create( require('./super').prototype );
Checkbox.prototype.constructor = Checkbox;

Checkbox.prototype.render = function() {
  console.log('Checkbox.prototype.render');

  for( var key in this.config ){
    var action = core.utils.toCamelCase( `set.${key}` );

    try{
      this[ action ]( this.config[ key ] );
    } catch(e) {
      // throw new Error('no method in prototype')
      console.log('no method in prototype', action);

    }
  }

  return this;
};


module.exports = Checkbox;