var Spacer = function Spacer( config ) {

  this.element = document.createElement('div');
  this.element.classList.add( this.CSS.ROOT );
  this.element._config = config;

  if ( config && config.hasOwnProperty('text') ) {
    this.setText( config.text );
  };
  if ( config && config.hasOwnProperty('class') ) {
    this.setClass( config.class );
  };

  this.render();
}

Spacer.prototype.CSS = {
  ROOT: 'mdl-layout-spacer'
}

Spacer.prototype.setText = function( string ){
  this.element.textContent = string;
};
Spacer.prototype.setClass = function( string ){
  this.element.className = string;
};

Spacer.prototype.render = function(){
  return this;
};

module.exports = Spacer;