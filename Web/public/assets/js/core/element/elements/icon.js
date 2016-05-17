var Icon = function Icon( config ) {

  this.element = document.createElement('i');
  this.element.classList.add( this.CSS.ROOT );
  this.element._config = config;

  if ( config && config.hasOwnProperty('icon') ) {
    this.setIcon( config.icon );
  };

  this.render();
}

Icon.prototype.CSS = {
  ROOT: 'material-icons'
}

Icon.prototype.setIcon = function( string ){
  this.element.textContent = string;
};

Icon.prototype.render = function(){
  return this;
};

module.exports = Icon;