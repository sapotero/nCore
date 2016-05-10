'use strict';

var Label = function( name ) {
  this.element = document.createElement('label');
  this.element.style.padding = '10px';
  this.element.style.display = 'block';

  if ( name ) {
    this.name = this.setName( name );
  };
}
Label.prototype.setName = function( string ){
  this.name = string;
  this.element.name = string;
  this.element.textContent = string;
};

var Input = function( options ) {
  if ( options.elementType ) {
    this.element = document.createElement( options.elementType );
    this.element.style.margin = '0px 10px';
  };

  if ( options.name ) {
    this.setName( options.name );
  };
  
  if ( options.type ) {
    this.setType( options.type );
  };
  
  if ( options.placeholder ) {
    this.setPlaceholder( options.placeholder );
  };
  
  if ( options.label ) {
    this.setLabel( options.label );
  };

  this.render();
}

Input.prototype.setName = function( string ){
  this.element.name = string;
};

Input.prototype.setType = function( string ){
  this.element.type = string;
};

Input.prototype.setPlaceholder = function( string ){
  this.element.placeholder = string;
};

Input.prototype.setLabel = function( string ){
  this.label = new Label(string);
};

Input.prototype.render = function(){
  var element = {};

  if ( this.label ) {
    element = this.label.element;
    element.insertAdjacentHTML('beforeEnd', this.element.outerHTML );
  } else {
    element = this.element;
  };

  this.element = element;
};

// var CheckBox = function( options ){
//   this.element = document.createElement( options.elementType );
// };
// CheckBox.constructor = Input;
// CheckBox.prototype   = Input.prototype;




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
  return element;
}

module.exports = new Elements();

// var input = core.modules.drag.Elements.create( {
//   elementType : 'input',
//   name : 'test-input',
//   type : 'text',
//   placeholder : 'text',
//   label: 'label'
// } );