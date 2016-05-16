'use strict';





// var Input = function( config ) {
//   this.form = false;

//   if ( config.elementType ) {
//     this.element = document.createElement( 'input' );
//     this.element.className = 'mdl-textfield__input'
//     this.element.id = core.utils.generateId();
//   };

//   if ( config ) {
//     this._config = config;
//   };

//   if ( config.form ) {
//     this.form = config.form;
//   };

//   if ( config.name ) {
//     this.setName( config.name );
//   };
  
//   if ( config.type ) {
//     this.setType( config.type );
//   };
  
//   if ( config.placeholder ) {
//     this.setPlaceholder( config.placeholder );
//   };
  
//   if ( config.label ) {
//     this.setLabel( config.label );
//   };

//   if ( config && config.hasOwnProperty('class') ) {
//     this.setClass(config.class);
//   };

//   this.render();
// }

// Input.prototype.setClass = function ( data ) {
//   this.element.className = data;
// }

// Input.prototype.setName = function( string ){
//   this.element.name = string;
// };

// Input.prototype.setType = function( string ){
//   this.type = string;
//   this.element.type = string;
// };

// Input.prototype.setPlaceholder = function( string ){
//   // this.element.placeholder = string;
// };

// Input.prototype.setLabel = function( string ){
  
//   var labelConfig = {
//     name  : '',
//     text  : string,
//     for   : this.element.id,
//     // span  : this.form
//   };


//   if ( this.type == 'checkbox' || this.type == 'radio' ) {
//     console.log( '++++setType', this.type );

//     this.element.className = `mdl-${this.type}__input`;
//     labelConfig.class = `mdl-${this.type} mdl-js-${this.type}`;
//     labelConfig.span  = this.type;
//   };

//   this.label = new Label( labelConfig );
// };

// Input.prototype.render = function(){

//   // <!-- Textfield with Floating Label -->
//   // <form action="#">
//   //   <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
//   //     <input class="mdl-textfield__input" type="text" id="sample3">
//   //     <label class="mdl-textfield__label" for="sample3">Text...</label>
//   //   </div>
//   // </form>

//   //////////////
//   // Checkbox //
//   //////////////
//   // <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-1">
//   //   <input type="checkbox" id="checkbox-1" class="mdl-checkbox__input" checked>
//   //   <span class="mdl-checkbox__label">Checkbox</span>
//   // </label>
//   var wrapper = document.createElement('div');

//   var element = {};

//   if ( this.type === 'checkbox' || this.type === 'radio' ) {
//     console.log( 'checkbox++', this.label.element, this.element );

//     // this.label.element.insertBefore( this.element, this.label.element.firstChild );
//     this.label.element.appendChild( this.element );
//     element = this.label.element
//     wrapper.appendChild( this.label.element );

//   } else {
//     wrapper.className = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label';
//     wrapper.appendChild( this.element );
//     wrapper.appendChild( this.label.element );
//   }
//   console.log( '+++', element );

//   // var label = this.label,
//   //      _el  = this.element;
//   // if ( this.span ) {
//   //   console.log('span+');
//   //   element = label.element.insertBefore( _el, label.firstChild );
//   // } else {
//   //   console.log('span-');
//   //   element = this.label.element;
//   //   // element.insertAdjacentHTML('beforeend', this.element.outerHTML );
//   // };


//   // var element = label.insertBefore( _el, span );


//   // <!-- Floating Multiline Textfield -->
//   // <form action="#">
//   //   <div class="mdl-textfield mdl-js-textfield">
//   //     <textarea class="mdl-textfield__input" type="text" rows= "3" id="sample5" ></textarea>
//   //     <label class="mdl-textfield__label" for="sample5">Text lines...</label>
//   //   </div>
//   // </form>


//   this.element = wrapper;
//   this.element._config = this._config;
// };




// var List = function (){
//   this.element = document.createElement('ul');
//   this.element.className = 'panel menu-list mdl-list mdl-cell--hide-phone mdl-shadow--0dp';
//   return this;
// }

// List.prototype.render = function(){
//   return this.element;
// }

// var Form = function ( config ){
//   this.element = document.createElement('form');

//   if ( config && config.hasOwnProperty('class') ){
//     this.setClass( config.class );
//   };

//   return this;
// }
// Form.prototype.setClass = function( string ){
//   this.element.className = string;
// }
// Form.prototype.render = function(){
//   return this.element;
// }


// var ListItem = function ( config ){
//   this.action = '';
//   this.name   = '';
//   this.icon   = '';
//   this.count  = '';
//   this.action = '';

//   if ( config ) {
//     this._config = config;
//   }

  

//   if ( config && config.hasOwnProperty('root') ) {
//       this.setRoot(config.root);
//   };

//   if ( config && config.hasOwnProperty('name') ) {
//       this.setName(config.name);
//   };

//   if ( config && config.hasOwnProperty('icon') ) {
//       this.setIcon(config.icon);
//   };

//   if ( config && config.hasOwnProperty('count') ) {
//     this.setCount(config.count);
//   };

//   if ( config && config.hasOwnProperty('action') ) {
//       this.setAction(config.action);
//   };

//   this.render();
// }

// ListItem.prototype.setRoot = function ( data ) {
//   this.root = data;
// }
// ListItem.prototype.setAction = function ( data ) {
//   this.action = data;
// }

// ListItem.prototype.setName = function ( data ) {
//   this.name = data;
// }
// ListItem.prototype.setIcon = function ( data ) {
//   this.icon = data;
// }
// ListItem.prototype.setCount = function ( data ) {
//   this.count = data;
// }

// ListItem.prototype.render = function () {
//   this.element = document.createElement('li');
//   this.element.className = 'menu-item mdl-list__item';
//   this.element.setAttribute('action', this.action );
  
//   var content = document.createElement('span');
//   content.className = 'mdl-list__item-primary-content';


//   if ( this.icon ) {
//     var icon = document.createElement('i');
//     icon.className   = 'material-icons mdl-list__item-avatar';
//     icon.textContent = this.icon;
//     content.appendChild( icon );
//   }

//   if ( this.name ) {
//     var name = document.createElement('span');
//     name.className   = 'document-name';
//     name.textContent = this.name;
//     content.appendChild( name );
//   }


//   if ( this.count ) {
//     var count = document.createElement('span');
//     count.className   = 'mdl-list__item-sub-title';
//     count.textContent = this.count;
//     content.appendChild( count );
//   }

//   if ( this.name && this.count ) {
//     this.element.classList.add('mdl-list__item--two-line');
//   }


//   this.element.appendChild( content );
  
//   if ( this.action ) {
//     var action = document.createElement('span');
//     var id = core.utils.generateId();

//     action.className = 'mdl-list__item-secondary-action';
//     action.innerHTML = `
//     <span class="mdl-list__item-secondary-action">
//       <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="${id}">
//         <input type="checkbox" id="${id}" class="mdl-checkbox__input" checked />
//       </label>
//     </span>`;

//     this.element.appendChild( action );
//   };
// }

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

    
    case 'form':
      element = this.Form;
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

  this.elements.push( _element );
  return _element;
}
Element.prototype.Input    = require('./elements/input');
Element.prototype.Checkbox = require('./elements/checkbox');
Element.prototype.Radio    = require('./elements/radio');
Element.prototype.Label    = require('./elements/label');
// Element.prototype.Textarea = require('./elements/textarea');

module.exports = Element;