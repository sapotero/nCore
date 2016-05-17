var Form = function Form( config ) {

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

Form.prototype.setName = function( string ){
  this.element.name = string;
};
Form.prototype.setText = function( string ){
  this.element.textContent = string;
};
Form.prototype.setAction = function( string ){
  this.element.action = string;
};
Form.prototype.setClass = function( string ){
  this.element.className = string;
};
Form.prototype.render = function(){
  return this;
};

module.exports = Form;