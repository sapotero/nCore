var Radio = function( config ) {
  this.element      = document.createElement( 'input' );
  this.element.type = 'radio';
  this.element.id   = core.utils.generateId();

  this.config = config;

  this.render();
}
Radio.prototype = Object.create( require('./super').prototype );
Radio.prototype.constructor = Radio;

Radio.prototype.render = function() {
  console.log('Radio.prototype.render');

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


module.exports = Radio;