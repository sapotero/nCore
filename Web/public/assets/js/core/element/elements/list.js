var List = function List( config ) {

  this.element = document.createElement('ul');
  this.element.classList.add( this.CSS.ROOT )
  
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
  ROOT               : 'mdl-list',
  LIST_ITEM          : "mdl-list__item",
  LIST_ITEM_TWO_LINE : "mdl-list__item--two-line",
  SUB_TITLE          : "mdl-list__item-sub-title",
  PRIMARY_CONTENT    : "mdl-list__item-primary-content",
  SECONDARY_CONTENT  : "mdl-list__item-secondary-content",
  SECONDARY_INFO     : "mdl-list__item-secondary-info",
  SECONDARY_ACTION   : "mdl-list__item-secondary-action",
  MATERIAL_ICONS     : "material-icons",
  ITEM_ICON          : "mdl-list__item-icon",
  ITEM_AVATAR        : "mdl-list__item-avatar",
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

        if ( item.action.hasOwnProperty('href') ) {
          var href = document.createElement('a');
          href.classList.add( this.CSS.SECONDARY_ACTION );
          href.href = item.action.href;
          action.appendChild( href );

        }

        if ( item.action.hasOwnProperty('icon') ) {
          var secondaryIcon = document.createElement('i');
          secondaryIcon.classList.add( this.CSS.MATERIAL_ICONS );
          secondaryIcon.textContent = item.action.icon;
          action.querySelector('a') ? href.appendChild( secondaryIcon ) : action.appendChild( secondaryIcon )
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