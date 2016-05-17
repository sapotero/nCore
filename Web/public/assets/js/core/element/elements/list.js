var List = function List( config ) {

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

List.prototype.setName = function( string ){
  this.element.name = string;
};
List.prototype.setText = function( string ){
  this.element.textContent = string;
};
List.prototype.setAction = function( string ){
  this.element.action = string;
};
List.prototype.setClass = function( string ){
  this.element.className = string;
};
List.prototype.render = function(){
  return this;
};

module.exports = List;