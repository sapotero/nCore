'use strict';

var Label = function( name ) {
  this.element = document.createElement('label');
  this.element.style.padding  = '10px';
  this.element.style.display  = 'block';

  if ( name ) {
    this.name = this.setName( name );
  };
}
Label.prototype.setName = function( string ){
  this.name = string;
  this.element.name = string;
  this.element.textContent = string;
};

var Input = function( config ) {
  
  if ( config.elementType ) {
    this.element = document.createElement( config.elementType );
  };

  if ( config ) {
    this._config = config;
  };

  if ( config.name ) {
    this.setName( config.name );
  };
  
  if ( config.type ) {
    this.setType( config.type );
  };
  
  if ( config.placeholder ) {
    this.setPlaceholder( config.placeholder );
  };
  
  if ( config.label ) {
    this.setLabel( config.label );
  };

  if ( config && config.hasOwnProperty('class') ) {
    this.setClass(config.class);
  };

  this.render();
}

Input.prototype.setClass = function ( data ) {
  this.element.className = data;
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
    element.insertAdjacentHTML('beforeend', this.element.outerHTML );
  } else {
    element = this.element;
  };


  this.element = element;
  this.element._config = this._config;
};

var List = function (){
  this.element = document.createElement('ul');
  this.element.className = 'panel menu-list mdl-list mdl-cell--hide-phone mdl-shadow--0dp';
  return this;
}

List.prototype.render = function(){
  return this.element;
}


var ListItem = function ( config ){
  this.action = '';
  this.name   = '';
  this.icon   = '';
  this.count  = '';
  this.action = '';

  if ( config ) {
    this._config = config;
  }

  

  if ( config && config.hasOwnProperty('root') ) {
      this.setRoot(config.root);
  };

  if ( config && config.hasOwnProperty('name') ) {
      this.setName(config.name);
  };

  if ( config && config.hasOwnProperty('icon') ) {
      this.setIcon(config.icon);
  };

  if ( config && config.hasOwnProperty('count') ) {
    this.setCount(config.count);
  };

  if ( config && config.hasOwnProperty('action') ) {
      this.setAction(config.action);
  };

  this.render();
}


ListItem.prototype.setRoot = function ( data ) {
  this.root = data;
}
ListItem.prototype.setAction = function ( data ) {
  this.action = data;
}

ListItem.prototype.setName = function ( data ) {
  this.name = data;
}
ListItem.prototype.setIcon = function ( data ) {
  this.icon = data;
}
ListItem.prototype.setCount = function ( data ) {
  this.count = data;
}

ListItem.prototype.render = function () {
  this.element = document.createElement('li');
  this.element.className = 'menu-item mdl-list__item';
  this.element.setAttribute('action', this.action );
  
  var content = document.createElement('span');
  content.className = 'mdl-list__item-primary-content';


  if ( this.icon ) {
    var icon = document.createElement('i');
    icon.className   = 'material-icons mdl-list__item-avatar';
    icon.textContent = this.icon;
    content.appendChild( icon );
  }

  if ( this.name ) {
    var name = document.createElement('span');
    name.className   = 'document-name';
    name.textContent = this.name;
    content.appendChild( name );
  }


  if ( this.count ) {
    var count = document.createElement('span');
    count.className   = 'mdl-list__item-sub-title';
    count.textContent = this.count;
    content.appendChild( count );
  }

  if ( this.name && this.count ) {
    this.element.classList.add('mdl-list__item--two-line');
  }


  this.element.appendChild( content );
  
  if ( this.action ) {
    var action = document.createElement('span');
    var id = core.utils.generateId();

    action.className = 'mdl-list__item-secondary-action';
    action.innerHTML = `
    <span class="mdl-list__item-secondary-action">
      <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="${id}">
        <input type="checkbox" id="${id}" class="mdl-checkbox__input" checked />
      </label>
    </span>`;

    this.element.appendChild( action );
  };
}

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
    case 'list':
      parentClass = List;
      break;
    case 'listItem':
      parentClass = ListItem;
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