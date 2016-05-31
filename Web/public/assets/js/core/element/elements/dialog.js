"use strict";

var supportCustomEvent = window.CustomEvent;

if (!supportCustomEvent || typeof supportCustomEvent == 'object') {
  supportCustomEvent = function CustomEvent(event, x) {
    x = x || {};
    var ev = document.createEvent('CustomEvent');
    ev.initCustomEvent(event, !!x.bubbles, !!x.cancelable, x.detail || null);
    return ev;
  };
  supportCustomEvent.prototype = window.Event.prototype;
}

function findNearestDialog(el) {
  while (el) {
    if (el.nodeName.toUpperCase() == 'DIALOG') {
      return /** @type {HTMLDialogElement} */ (el);
    }
    el = el.parentElement;
  }
  return null;
}

function safeBlur(el) {
  if (el && el.blur && el != document.body) {
    el.blur();
  }
}

function inNodeList(nodeList, node) {
  for (var i = 0; i < nodeList.length; ++i) {
    if (nodeList[i] == node) {
      return true;
    }
  }
  return false;
}

function DialogInfo(dialog) {
  this.dialog_ = dialog;
  this.replacedStyleTop_ = false;
  this.openAsModal_ = false;

  if (!dialog.hasAttribute('role')) {
    dialog.setAttribute('role', 'dialog');
  }

  dialog.show = this.show.bind(this);
  dialog.showModal = this.showModal.bind(this);
  dialog.close = this.close.bind(this);

  if (!('returnValue' in dialog)) {
    dialog.returnValue = '';
  }

  this.maybeHideModal = this.maybeHideModal.bind(this);
  if ('MutationObserver' in window) {
    var mo = new MutationObserver(this.maybeHideModal);
    mo.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  } else {
    dialog.addEventListener('DOMAttrModified', this.maybeHideModal);
  }

  Object.defineProperty(dialog, 'open', {
    set: this.setOpen.bind(this),
    get: dialog.hasAttribute.bind(dialog, 'open')
  });

  this.backdrop_ = document.createElement('div');
  this.backdrop_.className = 'backdrop';
  this.backdropClick_ = this.backdropClick_.bind(this);
}

DialogInfo.prototype = {

  get dialog() {
    return this.dialog_;
  },

  maybeHideModal: function() {
    if (!this.openAsModal_) { return; }
    if (this.dialog_.hasAttribute('open') &&
        document.body.contains(this.dialog_)) { return; }

    this.openAsModal_ = false;
    this.dialog_.style.zIndex = '';

    if (this.replacedStyleTop_) {
      this.dialog_.style.top = '';
      this.replacedStyleTop_ = false;
    }

    // Optimistically clear the modal part of this <dialog>.
    this.backdrop_.removeEventListener('click', this.backdropClick_);
    if (this.backdrop_.parentElement) {
      this.backdrop_.parentElement.removeChild(this.backdrop_);
    }
    _Dialog.dm.removeDialog(this);
  },

  setOpen: function(value) {
    if (value) {
      this.dialog_.hasAttribute('open') || this.dialog_.setAttribute('open', '');
    } else {
      this.dialog_.removeAttribute('open');
      this.maybeHideModal();  // nb. redundant with MutationObserver
    }
  },

  backdropClick_: function(e) {
    var redirectedEvent = document.createEvent('MouseEvents');
    redirectedEvent.initMouseEvent(e.type, e.bubbles, e.cancelable, window,
        e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey,
        e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
    this.dialog_.dispatchEvent(redirectedEvent);
    e.stopPropagation();
  },

  focus_: function() {
    var target = this.dialog_.querySelector('[autofocus]:not([disabled])');
    if (!target) {
      var opts = ['button', 'input', 'keygen', 'select', 'textarea'];
      var query = opts.map(function(el) {
        return el + ':not([disabled])';
      });
      query.push('[tabindex]:not([disabled]):not([tabindex=""])');
      target = this.dialog_.querySelector(query.join(', '));
    }
    safeBlur(document.activeElement);
    target && target.focus();
  },

  updateZIndex: function(backdropZ, dialogZ) {
    this.backdrop_.style.zIndex = backdropZ;
    this.dialog_.style.zIndex = dialogZ;
  },

  show: function() {
    if (!this.dialog_.open) {
      this.setOpen(true);
      this.focus_();
    }
  },

  showModal: function() {
    if (this.dialog_.hasAttribute('open')) {
      // throw new Error('Failed to execute "showModal" on dialog: The element is already open, and therefore cannot be opened modally.');
      console.log('Failed to execute "showModal" on dialog: The element is already open, and therefore cannot be opened modally.');
    }
    if (!document.body.contains(this.dialog_)) {
      // throw new Error('Failed to execute "showModal" on dialog: The element is not in a Document.');
      console.log('Failed to execute "showModal" on dialog: The element is not in a Document.');
    }
    if (!_Dialog.dm.pushDialog(this)) {
      // throw new Error('Failed to execute "showModal" on dialog: There are too many open modal dialogs.');
      console.log('Failed to execute "showModal" on dialog: There are too many open modal dialogs.');
    }
    this.show();
    this.openAsModal_ = true;

    if (_Dialog.needsCentering(this.dialog_)) {
      _Dialog.reposition(this.dialog_);
      this.replacedStyleTop_ = true;
    } else {
      this.replacedStyleTop_ = false;
    }

    this.backdrop_.addEventListener('click', this.backdropClick_);
    this.dialog_.parentNode.insertBefore( this.backdrop_, this.dialog_.nextSibling );
  },

  close: function(opt_returnValue) {
    if (!this.dialog_.hasAttribute('open')) {
      // throw new Error('Failed to execute "close" on dialog: The element does not have an "open" attribute, and therefore cannot be closed.');
      console.log('Failed to execute "close" on dialog: The element does not have an "open" attribute, and therefore cannot be closed.');
    }
    this.setOpen(false);

    if (opt_returnValue !== undefined) {
      this.dialog_.returnValue = opt_returnValue;
    }

    var closeEvent = new supportCustomEvent('close', {
      bubbles: false,
      cancelable: false
    });
    this.dialog_.dispatchEvent(closeEvent);
  }
};



var DialogManager = function() {
  this.pendingDialogStack = [];

  this.overlay = document.createElement('div');
  this.overlay.className = '_dialog_overlay';
  this.overlay.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  this.handleKey_ = this.handleKey_.bind(this);
  this.handleFocus_ = this.handleFocus_.bind(this);
  this.handleRemove_ = this.handleRemove_.bind(this);

  this.zIndexLow_ = 100000;
  this.zIndexHigh_ = 100000 + 150;
};

DialogManager.prototype.topDialogElement = function() {
  if (this.pendingDialogStack.length) {
    var t = this.pendingDialogStack[this.pendingDialogStack.length - 1];
    return t.dialog;
  }
  return null;
};

DialogManager.prototype.blockDocument = function() {
  document.body.appendChild(this.overlay);
  document.body.addEventListener('focus', this.handleFocus_, true);
  document.addEventListener('keydown', this.handleKey_);
  document.addEventListener('DOMNodeRemoved', this.handleRemove_);
};

DialogManager.prototype.unblockDocument = function() {
  document.body.removeChild(this.overlay);
  document.body.removeEventListener('focus', this.handleFocus_, true);
  document.removeEventListener('keydown', this.handleKey_);
  document.removeEventListener('DOMNodeRemoved', this.handleRemove_);
};

DialogManager.prototype.updateStacking = function() {
  var zIndex = this.zIndexLow_;

  for (var i = 0; i < this.pendingDialogStack.length; i++) {
    if (i == this.pendingDialogStack.length - 1) {
      // this.overlay.style.zIndex = zIndex++;
    }
    this.pendingDialogStack[i].updateZIndex(zIndex++, zIndex++);
  }
};

DialogManager.prototype.handleFocus_ = function(event) {
  var candidate = findNearestDialog( event.target );
  if (candidate != this.topDialogElement()) {
    event.preventDefault();
    event.stopPropagation();
    safeBlur( (event.target) );

    return false;
  }
};

DialogManager.prototype.handleKey_ = function(event) {
  if (event.keyCode == 27) {
    console.log('esc ++');

    event.preventDefault();
    event.stopPropagation();
    var cancelEvent = new supportCustomEvent('cancel', {
      bubbles: false,
      cancelable: true
    });
    var dialog = this.topDialogElement();
    if (dialog.dispatchEvent(cancelEvent)) {
      core.events.emit( "core:dom:dialog:clear" );
      // dialog.close();
    }
  }
};

DialogManager.prototype.handleRemove_ = function(event) {
  if (event.target.nodeName.toUpperCase() != 'DIALOG') { return; }

  var dialog = (event.target);
  if (!dialog.open) { return; }

  this.pendingDialogStack.some(function(dpi) {
    if (dpi.dialog == dialog) {
      dpi.maybeHideModal();
      return true;
    }
  });
};

DialogManager.prototype.pushDialog = function(dpi) {
  var allowed = (this.zIndexHigh_ - this.zIndexLow_) / 2 - 1;
  if (this.pendingDialogStack.length >= allowed) {
    return false;
  }
  this.pendingDialogStack.push(dpi);
  if (this.pendingDialogStack.length == 1) {
    this.blockDocument();
  }
  this.updateStacking();
  return true;
};

DialogManager.prototype.removeDialog = function(dpi) {
  var index = this.pendingDialogStack.indexOf(dpi);
  if (index == -1) { return; }

  this.pendingDialogStack.splice(index, 1);
  this.updateStacking();
  if (this.pendingDialogStack.length == 0) {
    this.unblockDocument();
  }
};




var _Dialog = {};

_Dialog.reposition = function(element) {
  // var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  // var topValue = scrollTop + (window.innerHeight - element.offsetHeight) / 2;
  // element.style.top = 'calc(45% - 32px)';//Math.max(scrollTop, topValue) + 'px';
  element.classList.add('dialog-offset-y');
};

_Dialog.isInlinePositionSetByStylesheet = function(element) {
  for (var i = 0; i < document.styleSheets.length; ++i) {
    var styleSheet = document.styleSheets[i];
    var cssRules = null;
    // Some browsers throw on cssRules.
    try {
      cssRules = styleSheet.cssRules;
    } catch (e) {}
    if (!cssRules)
      continue;
    for (var j = 0; j < cssRules.length; ++j) {
      var rule = cssRules[j];
      var selectedNodes = null;
      // Ignore errors on invalid selector texts.
      try {
        selectedNodes = document.querySelectorAll(rule.selectorText);
      } catch(e) {}
      if (!selectedNodes || !inNodeList(selectedNodes, element))
        continue;
      var cssTop = rule.style.getPropertyValue('top');
      var cssBottom = rule.style.getPropertyValue('bottom');
      if ((cssTop && cssTop != 'auto') || (cssBottom && cssBottom != 'auto'))
        return true;
    }
  }
  return false;
};

_Dialog.needsCentering = function(dialog) {
  var computedStyle = window.getComputedStyle(dialog);
  if (computedStyle.position != 'absolute') {
    return false;
  }

  // We must determine whether the top/bottom specified value is non-auto.  In
  // WebKit/Blink, checking computedStyle.top == 'auto' is sufficient, but
  // Firefox returns the used value. So we do this crazy thing instead: check
  // the inline style and then go through CSS rules.
  if ((dialog.style.top != 'auto' && dialog.style.top != '') ||
      (dialog.style.bottom != 'auto' && dialog.style.bottom != ''))
    return false;
  return !_Dialog.isInlinePositionSetByStylesheet(dialog);
};

_Dialog.forceRegisterDialog = function(element) {
  if (element.showModal) {
    // console.warn('This browser already supports <dialog>, the polyfill may not work correctly', element);
  }
  if (element.nodeName.toUpperCase() != 'DIALOG') {
    // throw new Error('Failed to register dialog: The element is not a dialog.');
    console.log('Failed to register dialog: The element is not a dialog.');
  }
  new DialogInfo(element);
};

_Dialog.registerDialog = function(element) {
  if (element.showModal) {
    // console.warn('Can"t upgrade <dialog>: already supported', element);
  } else {
    _Dialog.forceRegisterDialog(element);
  }
};

_Dialog.dm = new DialogManager();


var Dialog = function Dialog( config ) {

  this._config = config;

  this.element = document.createElement('dialog');
  this.element.classList.add( this.CSS.ROOT );
  this.element.classList.add( this.CSS.SMALL_WIDTH );

  this.element._config = config;
  this.dialog = new this.DialogInfo( this.element );

  this.title = document.createElement('h4');
  this.title.classList.add( this.CSS.TITLE );
  this.title.classList.add( this.CSS.TITLE_SMALL );
  this.title.classList.add( this.CSS.DIALOG_HEADER );

  this.error = document.createElement('h5');
  this.error.classList.add( this.CSS.ERROR );
  
  this.content = document.createElement('form');
  this.content.classList.add( this.CSS.CONTENT );
  this.content.classList.add( this.CSS.CONTENT_FULL_WIDTH );

  this.actions = document.createElement('div');
  this.actions.classList.add( this.CSS.ACTIONS );
  this.actions.classList.add( this.CSS.ACTIONS_FLEX );


  this.populate();
  this.render();
}

Dialog.prototype = Object.create( require('./simple').prototype );
Dialog.prototype.constructor = Dialog;
Dialog.prototype.DialogInfo  = DialogInfo;

Dialog.prototype.CSS = {
  ROOT          : 'mdl-dialog',
  TITLE         : "mdl-dialog__title",
  TITLE_SMALL   : "mdl-dialog__title--small",
  ERROR         : "mdl-dialog__title--error",
  CONTENT       : "mdl-dialog__content",
  ACTIONS       : "mdl-dialog__actions",
  ACTIONS_FULL  : "mdl-dialog__actions--full-width",
  ACTIONS_FLEX  : "mdl-dialog__actions--flex",
  BUTTON        : "mdl-button",
  BUTTON_JS     : "mdl-js-button",
  DIALOG_HEADER : "dialog-header",
  FULL_WIDTH    : "mdl-dialog--full",
  SMALL_WIDTH   : "mdl-dialog--small",
  IS_INVALID    : "is-invalid",
  CONTENT_FULL_WIDTH : "mdl-dialog--full__content",

  
  // RIPPLE       : "mdl-js-ripple-effect",
}

// <dialog class="mdl-dialog">
//   <div class="mdl-dialog__content">
//     <p>
//       Allow this site to collect usage data to improve your experience?
//     </p>
//   </div>
//   <div class="mdl-dialog__actions mdl-dialog__actions--full-width">
//     <button type="button" class="mdl-button">Agree</button>
//     <button type="button" class="mdl-button close">Disagree</button>
//   </div>
// </dialog>


Dialog.prototype.initCallback = function( call ){
  if ( this._config.hasOwnProperty( call ) && typeof this._config[ call ].function === 'function' ) {
    var context = this._config[ call ].context || this;
    this._config[ call ].function.call( context );
  }
}

Dialog.prototype.validate = function(){
  var VALID = true;
  
  for(var i=0; i < this.content.elements.length; i++){
    console.log( this.content.elements[i].validity );

    if( !this.content.elements[i].validity.valid && this.content.elements[i].hasAttribute('required') ){
      this.content.elements[i].parentElement.classList.add( this.CSS.IS_INVALID );
      this.showError({ message: 'Заполнены не все поля!' });
      VALID = false;
    } else {
      this.content.elements[i].parentElement.classList.remove( this.CSS.IS_INVALID );
    }
  }
  
  return VALID;
}
Dialog.prototype.showError = function( conf ){
  console.log( conf.message );
  this.error.textContent = conf.message;
  return true;
}

Dialog.prototype.render = function(){
  var dialog = this;

  this.initCallback('before');

  if ( this._config.hasOwnProperty('title') ) {
    if ( this._config.hasOwnProperty('element') ) {
      this.title.appendChild( element );
    } else {
      this.title.textContent = this._config.title;
    }

    this.element.appendChild( this.title );
  }
  
  this.element.appendChild( this.error );

  if ( this._config.hasOwnProperty('big') && this._config.big === true ) {
    this.element.classList.add( this.CSS.FULL_WIDTH );
  }

  if ( this._config.hasOwnProperty('content') ) {
    if ( this._config.content.hasOwnProperty('element') ) {
      this.content.appendChild( this._config.content.element );
    } else {
      this.content.textContent = this._config.content;
    }

    this.element.appendChild( this.content );
  }

  if ( this._config.hasOwnProperty('actions') && this._config.actions.constructor === Array ) {
    var df = document.createDocumentFragment();

    for (var i = 0, length = this._config.actions.length; i < length; i++) {
      var item = this._config.actions[i];
      
      item.submitCallback = function(){
        if ( typeof this.submit.function === 'function' ) {
          this.submit.context = this.submit.context || this;
          if ( dialog._config.hasOwnProperty('validate') && dialog._config.validate === true ) {
            if ( dialog.validate() ) {
              this.submit.function(arguments);
              dialog.initCallback('after');
              dialog.element.close();
            }
          }
        }
      };

      item.cancelCallback = function(){
        dialog.element.close();
        if ( typeof this.cancel.function === 'function' ) {
          this.cancel.context = this.cancel.context || this;
          this.cancel.function();
          dialog.initCallback('after');
        }
      };

      var button = document.createElement('button');
      button.classList.add( this.CSS.BUTTON );
      button.classList.add( this.CSS.BUTTON_JS );

      if ( item.hasOwnProperty('class') ) {
        for (var z = item.class.length - 1; z >= 0; z--) {
          button.classList.add( item.class[z] );
        }
      }

      if ( item.hasOwnProperty('submit') ) {
        // button.type = 'submit';
        button.addEventListener('click', item.submitCallback.bind( item ) );
      }

      if ( item.hasOwnProperty('cancel') ) {
        // button.type = 'cancel';
        button.addEventListener('click', item.cancelCallback.bind( item ) );
      }

      if ( item.hasOwnProperty('text') ) {
        button.textContent = item.text;
      }

      df.appendChild( button );
    }

    this.actions.appendChild( df );
    this.element.appendChild( this.actions );
  }

  return this.element;
}


module.exports = Dialog;