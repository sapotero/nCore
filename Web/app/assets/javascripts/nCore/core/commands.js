"use strict";

var nCore = nCore || {};
nCore.commands = (function(){
  
  var Commands = function(){
    
    this.bodyEl       = '';
    this.sidedrawerEl = '';
    this.cellSettings = '';
    this.rotatePage   = '';
    this.paper        = '';
    this.brand        = '';

    return this;
  };

  Commands.prototype.populate = function() {
    this.bodyEl       = $('body');
    this.sidedrawerEl = $('#sidedrawer');
    this.cellSettings = $('#cellSettings');
    this.rotatePage   = $('#rotatePage');
    this.paper        = $('#paper');
    this.brand        = $('#sidedrawer-brand');

    return this;
  };

  Commands.prototype.showSidedrawer = function showSidedrawer() {
    var root = this;

    console.log('comands++');

    var options = {
      onclose: function() {
        root.hideSidedrawer();
      }
    };
    var overlayEl = $( mui.overlay('on', options)) ;
    setTimeout(function() {
      root.sidedrawerEl.addClass('active');
    }, 200);
  };
  Commands.prototype.hideSidedrawer = function() {
    console.log('comands++');
    var root = this;

    root.bodyEl.toggleClass('hide-sidedrawer');
    root.brand.removeClass('mui--z5');
  };
  Commands.prototype.build = function(){
    console.log('comands++');

    var root = this;
    // root.populate();

    jQuery(function($) {
      $('.js-hide-sidedrawer').on('click', root.showSidedrawer );
      $('.js-hide-sidedrawer').on('click', root.hideSidedrawer );

      var titleEls = $('strong', root.sidedrawerEl);
      titleEls.next().hide();
      titleEls.on('click', function() {
        console.log('click')
        ;
        $(this).next().slideToggle(200);

        root.sidedrawerEl.removeClass('active');
        mui.overlay('off');

      });
    });
  };

  return new Commands().populate();
})();
