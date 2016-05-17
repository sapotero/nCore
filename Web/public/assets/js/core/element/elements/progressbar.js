var Progressbar = function Progressbar( config ) {

  this.element = document.createElement('from');
  
  if ( config && config.hasOwnProperty('text') ) {
    this.setText( config.text );
  };
  if ( config && config.hasOwnProperty('class') ) {
    this.setClass( config.class );
  };
  if ( config && config.hasOwnProperty('action') ) {
    this.setAction( config.action );
  };

  this.element._config = config;

  this.render();
}

Progressbar.prototype.setName = function( string ){
  this.element.name = string;
};
Progressbar.prototype.setText = function( string ){
  this.element.textContent = string;
};
Progressbar.prototype.setAction = function( string ){
  this.element.action = string;
};
Progressbar.prototype.setClass = function( string ){
  this.element.className = string;
};
Progressbar.prototype.render = function(){
  return this;
};

module.exports = Progressbar;