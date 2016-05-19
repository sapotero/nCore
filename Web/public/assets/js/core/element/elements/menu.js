var Menu = function Menu( config ) {
  this._config = config;

  this.element = document.createElement('div');
  this.element.classList.add( this.CSS.ROOT );

  this.button = document.createElement('button');
  this.button.id = core.utils.generateId();
  this.button.classList.add( this.CSS.BUTTON );
  this.button.classList.add( this.CSS.BUTTON_JS );

  this.list = document.createElement('ul');
  this.list.setAttribute( 'for', this.button.id );
  this.list.classList.add( this.CSS.MENU );
  this.list.classList.add( this.CSS.MENU_JS );
  this.list.classList.add( this.CSS.MENU_RIGHT );

  this.list.classList.add( this.CSS.RIPPLE );

  this.element.appendChild( this.button );
  this.element.appendChild( this.list );

  this.render();
}
Menu.prototype = Object.create( require('./simple').prototype );
Menu.prototype.constructor = Menu;

Menu.prototype.CSS = {
  ROOT          : 'mdl-menu--wrapper',
  BUTTON        : 'mdl-button',
  BUTTON_JS     : 'mdl-js-button',
  BUTTON_ICON   : 'mdl-button--icon',
  
  FAB           : 'mdl-button--fab',
  FAB_MINI      : 'mdl-button--mini-fab',
  RAISED        : 'mdl-button--raised',
  ACCENT        : 'mdl-button--accent',
  
  MENU          : 'mdl-menu',
  MENU_JS       : 'mdl-js-menu',
  MENU_RIGHT    : 'mdl-menu--bottom-right',
  // MENU_RIGHT : 'mdl-menu--bottom-left',
  MENU_ITEM     : 'mdl-menu__item',
  ICON          : 'material-icons',
  RIPPLE        : 'mdl-js-ripple-effect',
  GRAY          : 'mdl-js-ripple-effect',
  BOLD          : 'mdl-typography--font-bold',
  GRAY_TEXT     : 'mdl-color-text--grey-800',
  INLINE        : 'inline',
  CELL          : 'mdl-cell',
  CELL_HIDE     : 'mdl-cell--hide-phone',
}

Menu.prototype.setIcon = function( icon ){
  this.button.classList.add( this.CSS.BUTTON_ICON );
  this.icon = document.createElement('i');
  this.icon.classList.add( this.CSS.ICON );
  this.icon.textContent = icon;
  this.button.appendChild( this.icon );
};

Menu.prototype.setText = function( string ){
  if ( this.button ) {
    var text = document.createElement('h5');
    text.classList.add( this.CSS.GRAY_TEXT );
    text.classList.add( this.CSS.INLINE );
    // text.classList.add( this.CSS.CELL );
    text.classList.add( this.CSS.CELL_HIDE );
    // text.classList.add( this.CSS.BOLD );
    text.textContent = string;
    this.element.insertBefore( text, this.button );
  } else {
    this.element.textContent = string;
  }
};
Menu.prototype.setFab = function() {
  this.button.classList.add( this.CSS.FAB );
  this.button.classList.add( this.CSS.FAB_MINI );
}
Menu.prototype.setColor = function() {
  this.button.classList.add( this.CSS.ACCENT );
}

Menu.prototype.render = function(){
  
  if ( this._config && this._config.hasOwnProperty('text') ) {
    this.setText( this._config.text );
  };

  if ( this._config && this._config.hasOwnProperty('icon') ) {
    this.setIcon( this._config.icon );
  };

  if ( this._config && this._config.hasOwnProperty('fab') ) {
    this.setFab( this._config.fab );
  };
  if ( this._config && this._config.hasOwnProperty('color') ) {
    this.setColor( this._config.color );
  };
  
  if ( this._config.hasOwnProperty('items') && this._config.items.constructor === Array ) {
    for (var i = 0, length = this._config.items.length; i < length; i++) {
      var item = this._config.items[i];
      // console.log( 'menu item', item );

      if ( item.hasOwnProperty('element') ) {
        this.element.appendChild( item.element );
      }
      var _item = document.createElement('li');
      _item.classList.add( this.CSS.MENU_ITEM );
      _item.textContent = item.text;

      if ( item.hasOwnProperty('callback') && typeof item.callback.function === 'function' ) {
        item.callback.context = item.callback.context || this;
        _item.addEventListener( 'click', item.callback.function.bind( item.callback.context ) );
      }

      this.list.appendChild( _item );
      
    }
  }
  return this;
};


module.exports = Menu;