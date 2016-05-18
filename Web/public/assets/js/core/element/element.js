'use strict';

var Element = function Element(){
  this.elements = [];
};

Element.prototype.create = function( options ) {
  var element = null;

  switch ( options.elementType ) {
    // forms
    
    case 'form':
      element = this.Form;
      break;
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
    case 'switch':
      element = this.Switch;
      break;

    case 'list':
      element = this.List;
      break;
    case 'button':
      element = this.Button;
      break;
    case 'card':
      element = this.Card;
      break;
    case 'progressbar':
      element = this.Progressbar;
      break;
    
    case 'spacer':
      element = this.Spacer;
      break;
    case 'simple':
      element = this.Simple
      break;
    case 'icon':
      element = this.Icon;
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
Element.prototype.Form     = require('./elements/form');
Element.prototype.Input    = require('./elements/input');
Element.prototype.Checkbox = require('./elements/checkbox');
Element.prototype.Radio    = require('./elements/radio');
Element.prototype.Switch   = require('./elements/switch');
Element.prototype.Textarea = require('./elements/textarea');
Element.prototype.Label    = require('./elements/label');

// Element.prototype.Header   = require('./elements/header');
Element.prototype.Simple   = require('./elements/simple');
// Element.prototype.Span     = require('./elements/span');
Element.prototype.Icon     = require('./elements/icon');
Element.prototype.Spacer   = require('./elements/spacer');

Element.prototype.Button   = require('./elements/button');
Element.prototype.List     = require('./elements/list');
Element.prototype.Card     = require('./elements/card');
// Element.prototype.Progressbar = require('./elements/progressbar');


module.exports = Element;