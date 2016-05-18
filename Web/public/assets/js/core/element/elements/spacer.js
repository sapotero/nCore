var Spacer = function Spacer( config ) {

  this.element = document.createElement('div');
  this.element.classList.add( this.CSS.ROOT );
  this.element._config = config;

  this.populate();
  this.render();
}
Spacer.prototype = Object.create( require('./simple').prototype );
Spacer.prototype.constructor = Spacer;

Spacer.prototype.CSS = {
  ROOT: 'mdl-layout-spacer'
}
module.exports = Spacer;