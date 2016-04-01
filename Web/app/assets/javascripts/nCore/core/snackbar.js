"use strict";

var nCore = nCore || {};
nCore.snackbar = (function(){

  var Snackbar = function(element) {

    if ( !arguments.length ) {
      element = document.querySelector('#mui-snackbar');
    }

    this.element       = element;
    this.textElement   = this.element.querySelector('.' + this.cssClasses.MESSAGE);
    this.actionElement = this.element.querySelector('.' + this.cssClasses.ACTION);

    if (!this.textElement) {
      console.error('There must be a message element for a Snackbar.');
      return false;
    }
    
    if (!this.actionElement) {
      console.error('There must be an action element for a Snackbar.');
      return false;
    }

    this.active        = false;
    this.actionHandler = undefined;
    this.message       = undefined;
    this.actionText    = undefined;
    this.queuedNotifications = [];
    this.setActionHidden(true);
  };

  Snackbar.prototype.Constant = {
    ANIMATION_LENGTH: 500
  };

  Snackbar.prototype.cssClasses = {
    SNACKBAR: 'mui-snackbar',
    MESSAGE:  'mui-snackbar__text',
    ACTION:   'mui-snackbar__action',
    ACTIVE:   'mui-snackbar--active'
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
      this.message       = undefined;
      this.actionText = undefined;
      this.active     = false;
      this.checkQueue();
    }.bind(this), (this.Constant.ANIMATION_LENGTH));
  };

  Snackbar.prototype.setActionHidden = function(value) {
    if (value) {
      this.actionElement.setAttribute('aria-hidden', 'true');
    } else {
      this.actionElement.removeAttribute('aria-hidden');
    }
  };

  return new Snackbar();
})();