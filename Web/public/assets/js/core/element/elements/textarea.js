var Label = function( config ) {
  this.element = document.createElement('label');
  this.element.className = 'mdl-textfield__label';
  
  console.log('Label = function( config ) {', config);

  if ( config && config.hasOwnProperty('name') ) {
    this.setName( config.name );
  };
  if ( config && config.hasOwnProperty('text') ) {
    this.setText( config.text );
  };
  if ( config && config.hasOwnProperty('class') ) {
    this.setClass( config.class );
  };
  if ( config && config.hasOwnProperty('for') ) {
    this.setFor( config.for );
  };
  if ( config && config.hasOwnProperty('span') ) {
    this.span = config.span;
  };
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
Label.prototype.setFor = function( string ){
  this.element.setAttribute( 'for', string );
};
Label.prototype.render = function( string ){
  if ( this.span ) {
    var span = document.createElement('span');
    span.className = `mdl-${this.span}__label`;
    span.textContent = this.element.textContent;
    
    this.element.textContent = '';
    this.element.appendChild( span );
  };
  return this;
};

module.exports = Label;