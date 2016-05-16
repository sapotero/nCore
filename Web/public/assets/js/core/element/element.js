'use strict';

var Element = function(){
  this.elements = [];
};

Element.prototype.create = function( options ) {
  var element = null;

  switch ( options.elementType ) {
    // forms
    case 'label':
      element = this.Label;
      break;
    
    case 'input':
      element = this.Input;
      break;
    case 'checkbox':
      element = this.Checkbox;
      break;
    case 'radio':
      element = this.Radio;
      break;
    case 'textarea':
      element = this.Textarea;
      break;
    
    case 'form':
      element = this.Form;
      break;
    case 'switch':
      element = this.Switch;
      break;
    
    case 'list':
      element = this.List;
      break;
    case 'listItem':
      element = this.ListItem;
      break;
    default:
      break;
  }
  
  if( element === null ) {
    return false;
  }

  
  var _element = new element( options );

  if ( options.hasOwnProperty('preventCopy') && !options.preventCopy ) {
    this.elements.push( _element );
  }
  return _element;
}
Element.prototype.Input    = require('./elements/input');
Element.prototype.Checkbox = require('./elements/checkbox');
Element.prototype.Radio    = require('./elements/radio');
Element.prototype.Switch   = require('./elements/switch');
Element.prototype.Label    = require('./elements/label');
Element.prototype.Textarea = require('./elements/textarea');

module.exports = Element;