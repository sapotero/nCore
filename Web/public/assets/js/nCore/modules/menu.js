 "use strict";

var nCore = nCore || {};
nCore.menu = (function(){

  // фабрика менюшек
  function Menu(){
    this.add = function(target, menu){
      var menu   = document.querySelector( menu ),
          target = document.querySelectorAll( target ),
      showMenu = function(x, y){
        menu.style.left = x-50 + 'px';
        menu.style.top = y + 'px';
        menu.classList.add('show-menu');
      },
      hideMenu = function(){
        menu.classList.remove('show-menu');
      },
      onContextMenu = function(e){
        e.preventDefault();
        // function findAncestor (el, cls) {
        //     while ( (el = el.parentElement) && !el.classList.contains(cls) );
        //     return el;
        // }
        var parent = findAncestor(e.target, 'indexListView');
        console.log('element', e, parent);

        showMenu(e.pageX, e.pageY);
        document.addEventListener('click', onClick, false);
      },
      onClick = function(e){
        hideMenu();
        document.removeEventListener('click', onClick);
      };


      if (target.length) {
        
        for (var i = 0; i < target.length; i++) {
          // console.log( target[i].contextmenu );
          target[i].addEventListener('contextmenu', onContextMenu, false);
        };
      };
      
      return menu;
    };
  };

  var init = function init(config){
    // console.log('init', config);
  },
  attach = function(target, menu){
    // return new Menu().add(target, menu);
  };

  return {
    init   : init,
    attach : attach
  };
})();
