"use strict";

var Snackbar = function() {

  this.element       = {};
  this.textElement   = {};
  this.actionElement = {};

  this.active        = false;
  this.actionHandler = undefined;
  this.message       = undefined;
  this.actionText    = undefined;
  this.queuedNotifications = [];
  this.setActionHidden(true);
  this.bindEvents();
};
Snackbar.prototype.Constant = {
  ANIMATION_LENGTH: 500
};
Snackbar.prototype.cssClasses = {
  SNACKBAR: 'core-snackbar',
  MESSAGE:  'core-snackbar__text',
  ACTION:   'core-snackbar__action',
  ACTIVE:   'core-snackbar--active'
};
Snackbar.prototype.displaySnackbar = function() {
  this.element.setAttribute('aria-hidden', 'true');

  if (this.actionHandler) {
    this.actionElement.textContent = this.actionText;
    this.actionElement.addEventListener('click', this.actionHandler);
    this.setActionHidden(false);
  }

  this.textElement.textContent = this.message;
  this.element.classList.add(this.cssClasses.ACTIVE);
  this.element.setAttribute('aria-hidden', 'false');
  setTimeout(this.cleanup.bind(this), this.timeout);
};
Snackbar.prototype.showSnackbar = function(data) {
  if (data === undefined) {
    console.error('Please provide a data object with at least a message to display.');
    return false;
  }

  if (data.message === undefined) {
    console.error('Please provide a message to be displayed.');
    return false;
  }

  if (data.actionHandler && !data.actionText) {
    console.error('Please provide action text with the handler.');
    return false;
  }

  if (this.active) {
    this.queuedNotifications.push(data);
  } else {
    this.active = true;
    this.message = data.message;
    if (data.timeout) {
      this.timeout = data.timeout;
    } else {
      this.timeout = 2750;
    }
    if (data.actionHandler) {
      this.actionHandler = data.actionHandler;
    }
    if (data.actionText) {
      this.actionText = data.actionText;
    }
    this.displaySnackbar();
  }
};
Snackbar.prototype.checkQueue = function() {
  if ( this.queuedNotifications.length > 0) {
    this.showSnackbar(this.queuedNotifications.shift());
  }
};
Snackbar.prototype.cleanup = function() {
  this.element.classList.remove(this.cssClasses.ACTIVE);
  setTimeout(function() {
    this.element.setAttribute('aria-hidden', 'true');
    this.textElement.textContent = '';
    if (!this.actionElement.getAttribute('aria-hidden')) {
      this.setActionHidden(true);
      this.actionElement.textContent = '';
      this.actionElement.removeEventListener('click', this.actionHandler);
    }
    this.actionHandler = undefined;
    this.message = undefined;
    this.actionText = undefined;
    this.active = false;
    this.checkQueue();
  }.bind(this), (this.Constant.ANIMATION_LENGTH));
};
Snackbar.prototype.setActionHidden = function(value) {
  if ( Object.keys(this.actionElement).length ) {
    value ? this.actionElement.setAttribute('aria-hidden', 'true') : this.actionElement.removeAttribute('aria-hidden');
  }
};

Snackbar.prototype.start = function() {
  console.log( 'Snackbar: start' );
  
  // <div id="core-snackbar" class="core-snackbar">
  //   <div class="core-snackbar__text"></div>
  //   <button class="core-snackbar__action" type="button"></button>
  // </div>

  var coreSnackbar = document.createElement("div");
  coreSnackbar.id = 'core-snackbar';
  coreSnackbar.classList.add('core-snackbar');
  
  var coreSnackbarText = document.createElement("div");
  coreSnackbarText.classList.add('core-snackbar__text');
  coreSnackbar.appendChild( coreSnackbarText );

  var coreSnackbarButton = document.createElement("button");
  coreSnackbarButton.classList.add('core-snackbar__action');
  coreSnackbar.appendChild( coreSnackbarButton );

  core.dom.snackbar = coreSnackbar;
  core.dom.application.appendChild( coreSnackbar );
  
  this.element       = coreSnackbar;
  this.textElement   = this.element.querySelector('.' + this.cssClasses.MESSAGE);
  this.actionElement = this.element.querySelector('.' + this.cssClasses.ACTION);
};
Snackbar.prototype.stop = function() {
  console.log( 'Snackbar: stop' );
};
Snackbar.prototype.destroy = function() {
  console.log( 'Snackbar: destroy' );
  this.element.remove();
  delete this.element;
};

Snackbar.prototype.bindEvents = function() {
  var snackbar = this;
  document.addEventListener('DOMContentLoaded', function(){

    core.events.subscribe("core::snackbar:start", function(){
      console.log('Snackbar <- core::snackbar:start');
    });

  });
};



module.exports = Snackbar;