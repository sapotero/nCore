var List = function List( config ) {

  this.element = document.createElement('ul');
  this.element.classList.add( this.CSS.LIST )
  
  if ( config && config.hasOwnProperty('class') ) {
    this.setClass( config.class );
  };

  this._config = config;
  this.element._config = config;
  
  this.render();
}

List.prototype.setClass = function( string ){
  this.element.classList.add( string );
};

List.prototype.CSS = {
  LIST                     : 'mdl-list',
  LIST_ITEM                : "mdl-list__item",
  LIST_ITEM_TWO_LINE       : "mdl-list__item--two-line",
  SUB_TITLE                : "mdl-list__item-sub-title",
  PRIMARY_CONTENT          : "mdl-list__item-primary-content",
  PRIMARY_CONTENT_HOVER    : "mdl-list__item-primary-content__hover",
  SECONDARY_CONTENT        : "mdl-list__item-secondary-content",
  SECONDARY_INFO           : "mdl-list__item-secondary-info",
  SECONDARY_ACTION         : "mdl-list__item-secondary-action",
  SECONDARY_ACTION_PRIMARY : "mdl-color-text--grey-400",
  SECONDARY_ACTION_ACCENT  : "mdl-color-text--accent",
  MATERIAL_ICONS           : "material-icons",
  ITEM_ICON                : "mdl-list__item-icon",
  ITEM_AVATAR              : "mdl-list__item-avatar",
  BUTTON                   : 'mdl-button',
  BUTTON_JS                : 'mdl-button-js',
  BUTTON_ICON              : 'mdl-button--icon',
}

List.prototype.render = function(){
  
  if ( this._config.hasOwnProperty('items') && this._config.items.constructor === Array ) {
    var df = document.createDocumentFragment();

    for (var i = 0, length = this._config.items.length; i < length; i++) {
      var item = this._config.items[i];

      var element = document.createElement('li');
      element.classList.add( this.CSS.LIST_ITEM );

      if ( item.hasOwnProperty('title') ) {
        var title = document.createElement('span');
        title.classList.add( this.CSS.PRIMARY_CONTENT );
        title.textContent = item.title;

        if ( item.title.hasOwnProperty('element') ) {
          title.textContent = '';
          title.appendChild( item.title.element );
        }
        element.appendChild( title );
      }

      if ( item.hasOwnProperty('icon') ) {
        var icon = document.createElement('i');
        icon.classList.add( this.CSS.MATERIAL_ICONS );
        icon.classList.add( this.CSS.ITEM_AVATAR );
        icon.textContent = item.icon;

        title.insertBefore( icon, title.firstChild );
      }

      if ( item.hasOwnProperty('subTitle') ) {
        var subTitle = document.createElement('span');
        subTitle.classList.add( this.CSS.SUB_TITLE );
        subTitle.textContent = item.subTitle;
        
        element.classList.add( this.CSS.LIST_ITEM_TWO_LINE );
        title.appendChild( subTitle );
      }

      if ( item.hasOwnProperty('action') ) {
        
        var action = document.createElement('span');
        action.classList.add( this.CSS.SECONDARY_CONTENT );

        
        if ( item.action.hasOwnProperty('title') ) {
          var secondaryInfo = document.createElement('span');
          secondaryInfo.classList.add( this.CSS.SECONDARY_INFO );
          secondaryInfo.textContent = item.action.title;
          action.appendChild( secondaryInfo );
        }

        if ( item.action.hasOwnProperty('callback') ) {
          var button = document.createElement('button');
          // button.classList.add( this.CSS.SECONDARY_ACTION );
          // button.classList.add( this.CSS.SECONDARY_ACTION_PRIMARY );
          button.classList.add( this.CSS.BUTTON );
          // button.classList.add( this.CSS.BUTTON_JS );
          button.classList.add( this.CSS.BUTTON_ICON );
          // button.href = '#';
          action.appendChild( button );

          if ( item.action.hasOwnProperty('color') && item.action.color === true ) {
            button.classList.add( this.CSS.SECONDARY_ACTION_ACCENT );
          }

          if ( item.action.hasOwnProperty('callback') && typeof item.action.callback.function === 'function' ) {
            item.action.callback.context = item.action.callback.context || this;
            button.addEventListener( 'click', item.action.callback.function.bind( item.action.callback.context ) );
          }

          if ( item.action.hasOwnProperty('icon') ) {
            var secondaryIcon = document.createElement('i');
            secondaryIcon.classList.add( this.CSS.MATERIAL_ICONS );
            secondaryIcon.textContent = item.action.icon;
            button.appendChild( secondaryIcon );
          }

        }

        if ( item.hasOwnProperty('callback') && typeof item.callback.function === 'function' ) {
          item.callback.context = item.callback.context || this;
          element.classList.add( this.CSS.PRIMARY_CONTENT_HOVER )
          element.addEventListener( 'click', item.callback.function.bind( item.callback.context ) );
        }

        if ( item.action.hasOwnProperty('element') ) {
          console.log( 'item.action.element', item.action.element );
          action.appendChild( item.action.element.element );
        }
        
        element.appendChild( action );
      }


      df.appendChild( element );
      // если передали элемент, то ничего не делаем, просто подпихиваем его сюда
    }

    this.element.appendChild( df );
  }

  return this;
};

module.exports = List;