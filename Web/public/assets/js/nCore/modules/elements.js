"use strict";

// прототип модуля предоставляющий интерфейс для создания печатных форм

var nCore = nCore || {};
nCore.modules.elements = (function(config){
  var nCoreElement,
      elements = [],
      config,
      nCoreElements;

  function nCoreLabel( options ) {
    this.color           = options.color || 'red';
    this.textalign       = options.align || 'right';
  }

  function nCoreInput( options ) {
    this.color        = options.color || 'gray';
  }

  function nCoreElement() {}
  nCoreElement.prototype.create = function create ( options ) {
    var parentClass = null;
    
    if( options.type        === 'label' ) {
      parentClass = nCoreLabel;
    } else if( options.type === 'input' ) {
      parentClass = nCoreInput;
    }
    
    if( parentClass === null ) {
      return false;
    }
    
    return new parentClass( options );
  }

  var init = function(config){
    var config = {
      nCoreElements: 'nCoreElements'
    };
    
    nCoreElements = document.getElementById( config.nCoreElements );

    var e = [ 'label', 'input' ];
    var fragment = new DocumentFragment();

    for (var i = 0; i < e.length; i++) {
      var a = document.createElement('a');
      a.href = "#";
      a.className = 'list-group-item draggable';
      a.text = e[i];
      fragment.appendChild(a);
    };

    nCoreElements.appendChild(fragment);

    return new nCoreElement();
   },
  create = function(options){
    var root     = init(),
        element  = root.create(options);

    elements.push(element);
    return element;
   },
  attachEvent = function(){
    interact('.draggable')
      .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
          var textEl = event.target.querySelector('p');

          textEl && (textEl.textContent =
            'moved a distance of '
            + (Math.sqrt(event.dx * event.dx +
                         event.dy * event.dy)|0) + 'px');
        }
      });

      function dragMoveListener (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }

      // this is used later in the resizing and gesture demos
      window.dragMoveListener = dragMoveListener;
   }

  return {
    init       : init,
    create     : create,
    elements   : elements
  }
})();