  this.element.classList.add( string );
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
  // полная реализация
  // <ul class="mdl-list">
  //   <li class="mdl-list__item mdl-list__item--two-line">
  //     <span class="mdl-list__item-primary-content">
  //       <i class="material-icons mdl-list__item-avatar">person</i>
  //       <span>Bryan Cranston</span>
  //       <span class="mdl-list__item-sub-title">62 Episodes</span>
  //     </span>

  //     <span class="mdl-list__item-secondary-content">
  //       <span class="mdl-list__item-secondary-info">Actor</span>
  //       <a class="mdl-list__item-secondary-action" href="#"><i class="material-icons">star</i></a>
  //     </span>
  //   </li>

  // иконка + текст + элемент в качестве экшена
  // <li class="mdl-list__item">
  //   <span class="mdl-list__item-primary-content">
  //     <i class="material-icons  mdl-list__item-avatar">person</i>
  //     Bryan Cranston
  //   </span>
  //   <span class="mdl-list__item-secondary-action">
  //     <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="list-checkbox-1">
  //       <input type="checkbox" id="list-checkbox-1" class="mdl-checkbox__input" checked />
  //     </label>
  //   </span>
  // </li>

  // минимальный вариант + иконка + линк в качестве экшена
  // <div class="mdl-list__item">
  //   <span class="mdl-list__item-primary-content">
  //     <i class="material-icons mdl-list__item-avatar">person</i>
  //     <span>Aaron Paul</span>
  //   </span>
  //   <a class="mdl-list__item-secondary-action" href="#"><i class="material-icons">star</i></a>
  // </div>


  // минимальный вариант + иконка
  // <li class="mdl-list__item">
  //   <span class="mdl-list__item-primary-content">
  //     <i class="material-icons mdl-list__item-icon">person</i>
  //     Bryan Cranston
  //   </span>
  // </li>

  // минимальный вариант 
  // <li class="mdl-list__item">
  //   <span class="mdl-list__item-primary-content">
  //     Bryan Cranston
  //   </span>
  // </li>

  // var list = core.elements.create( {
  //   elementType : 'list',
  //   items: [
  //     // минимальный вариант
  //     {
  //       title : 'menu item'
  //     },

  //     // минимальный вариант + иконка
  //     {
  //       title : 'menu item',
  //       icon  : 'event'
  //     },

  //     // минимальный вариант + иконка + линк в качестве экшена
  //     {
  //       title : 'menu item',
  //       icon  : 'event',
  //       action : {
  //         href : '#',
  //         icon : 'star',
  //       },
  //     },

  //     // полная реализация
  //     {
  //       title     : 'menu item',
  //       subTitle : 'menu item',
  //       icon : 'event',
  //       action : {
  //         href : '#',
  //         icon : 'star',
  //         title : 'textt'
  //         // text: 'option'
  //         // elelemt: {}
  //       }
  //     }
  //   ]
  // });


  // </ul>

  return this;
};

module.exports = List;