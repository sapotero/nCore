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

  this.render();
}

Label.prototype.setName = function( string ){
  // console.log('Label.prototype.setName', string);
  this.element.name = string;
};
Label.prototype.setText = function( string ){
  // console.log('Label.prototype.setText', string);
  this.element.textContent = string;
};
Label.prototype.setClass = function( string ){
  // console.log('Label.prototype.setClass', string);
  this.element.className = string;
};
Label.prototype.setFor = function( element ){
  // console.log('Label.prototype.setFor', element);
  this.element.setAttribute( 'for', element.id );
};
Label.prototype.render = function(){
  // console.log( 'Label.prototype.render' );
  return this;
};

module.exports = Label;