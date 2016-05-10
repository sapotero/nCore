'use strict';

var Label = function( options ) {
  this.element = document.createElement('label');
}

var Input = function( options ) {
  this.element = document.createElement('input');

  if ( options.name ) {
    this.name = this.setName( options.name );
  };
  
  if ( options.type ) {
    this.type = this.setType( options.type );
  };
  
  if ( options.placeholder ) {
    this.placeholder = this.setPlaceholder( options.placeholder );
  };
  
  if ( options.label ) {
    this.label = this.setLabel( options.label );
  };

  this.render();
}
Input.prototype.setName = function( string ){
  this.name = string;
  this.element.name = string;
};
Input.prototype.setType = function( string ){
  this.type = string;
  this.element.type = string;
};
Input.prototype.setPlaceholder = function( string ){
  this.placeholder = string;
  this.element.placeholder = string;
};
Input.prototype.setLabel = function( string ){
  this.label = string;
};
Input.prototype.render = function(){
  return this.element;
};



var Elements = function(){
  this.elements = [];
};

Elements.prototype.create = function( options ) {
  var parentClass = null;

  switch ( options.elementType ) {
    case 'label':
      parentClass = Label;
      break;
    case 'input':
      parentClass = Input;
      break;
    default:
      break;
  }
  
  if( parentClass === null ) {
    return false;
  }

  
  var element = new parentClass( options );
  this.elements.push( element );
  return new parentClass( options );
}

module.exports = new Elements();

// var input = core.modules.drag.Elements.create( {
//   elementType : 'input',
//   name : 'test-input',
//   type : 'text',
//   placeholder : 'text',
//   label: 'label'
// } );