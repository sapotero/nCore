var Input = function( config ) {
  this.element = document.createElement( 'input' );
  this.element.id = core.utils.generateId();

  this.config = config;

  this.render();
}
Input.prototype = Object.create( require('./super').prototype );
Input.prototype.constructor = Input;

Input.prototype.render = function() {
  console.log('Input.prototype.render');

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


module.exports = Input;