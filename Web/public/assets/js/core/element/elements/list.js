var List = function List( config ) {

  this.element = document.createElement('ul');
  
  if ( config && config.hasOwnProperty('class') ) {
    this.setClass( config.class );
  };

  this.element._config = config;

  this.render();
}

List.prototype.setClass = function( string ){
  this.element.className = string;
};
List.prototype.setClass = function( string ){
  this.element.className = string;
};

List.prototype.render = function(){
  
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

  var list = core.elements.create( {
    elementType : 'list',
    items: [
      // минимальный вариант
      {
        title     : 'menu item'
      },

      // минимальный вариант + иконка
      {
        title     : 'menu item',
        icon: 'event'
      },

      // минимальный вариант + иконка + линк в качестве экшена
      {
        title     : 'menu item',
        icon: 'event',
        action: {
          href: '#',
          icon: 'star',
        },
      },

      // полная реализация
      {
        title     : 'menu item',
        sub_title : 'menu item',
        icon: 'event',
        action: {
          href: '#',
          icon: 'star',
          // text: 'option'
          // elelemt: {}
        },
        actionInfo : 'text'
      }
    ]
  });


  // </ul>

  return this;
};

module.exports = List;