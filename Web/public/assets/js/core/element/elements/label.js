var Label = function Label( config ) {
  // console.log( 'Label', config );

  this.element = document.createElement('label');
  // this.element.className = 'mdl-textfield__label';
  
  if ( config && config.hasOwnProperty('text') ) {
    this.setText( config.text );
  };
  if ( config && config.hasOwnProperty('class') ) {
    this.setClass( config.class );
  };
  if ( config && config.hasOwnProperty('for') ) {
    this.setFor( config.for );
  };

  this._config = config;
  this.element._config = config;

  this.render();
}

Label.prototype.setName = function( string ){
  this.element.name = string;
};
Label.prototype.setText = function( string ){
  this.element.textContent = string;
};
Label.prototype.setClass = function( string ){
  this.element.className = string;
};
Label.prototype.setFor = function( element ){
  this.element.setAttribute( 'for', element.id );
};
Label.prototype.render = function(){
  this.element._conf = this;
  return this;
};

module.exports = Label;