"use strict";

var nCore = nCore || {};
nCore.commands = (function(){
  
  var Commands = function(){
    
    this.body         = document.body;
    this.sidedrawerEl = $('#sidedrawer');
    this.cellSettings = $('#cellSettings');
    this.rotatePage   = $('#rotatePage');
    this.paper        = $('#paper');
    this.brand        = $('#sidedrawer-brand');

    return this;
  };

  Commands.prototype.toggleMainMenu = function(){
    if ( nCore.commands.body.classList.contains('hide-sidedrawer') ) {
      // Скрываем
      nCore.commands.body.classList.remove('hide-sidedrawer');

      var options = {
        onclose: function() {
          nCore.commands.body.classList.add('hide-sidedrawer');
        }
      };
      mui.overlay('on', options) ;

    } else {
      nCore.commands.body.classList.add('hide-sidedrawer');
      nCore.commands.brand.removeClass('mui--z5');
    }
  };

  Commands.prototype.build = function(){
    console.log('comands++');
    var _root = this;
    document.querySelector('.js-hide-sidedrawer').addEventListener('click', _root.toggleMainMenu );
    return this;
  };

  Commands.prototype.build = function(){
    console.log('comands++');
    var _root = this;
    document.querySelector('.js-hide-sidedrawer').addEventListener('click', _root.toggleMainMenu );
    return this;
  };

  Commands.prototype.live = function(){
  };


  return new Commands().build();
})();
