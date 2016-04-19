'use strict';

var Dom = function () {
  this.root        = document;
  this.application = {};
  this.editor      = {};
  this.snackbar    = {};


  this.bindEvents();
};

Dom.prototype.bindEvents = function () {
  var dom = this;

  document.addEventListener('DOMContentLoaded', function () {
    core.events.subscribe('core:start:all', function () {
      console.log('core  > dom > bindEvents > core:start:all');
      manager.start();
    }, { priority: 0 });

    core.events.subscribe('core:dom:updateApplication', function (application) {
      dom.root.body.appendChild(application);
    }, { priority: 0 });

    core.events.subscribe('core:dom:application:clear', function () {
      console.log(' clear ->', dom.application);
    });

    core.events.subscribe('core:dom:build:application', function () {
      console.log('Dom <- core:dom:build:application');
      dom.build();
    });

    core.events.subscribe('core:dom:application:show', function () {
      console.log( ' Dom <- core:dom:application:show' );
      core.dom.application.application.showCards();
    });
    core.events.subscribe('core:dom:application:hide', function () {
      console.log( ' Dom <- core:dom:application:hide' );
      core.dom.application.application.hideCards();
    });

    core.events.subscribe('core:dom:editor:show', function () {
      console.log( ' Dom <- core:dom:editor:show' );
      core.dom.editor.style.zIndex = 1;
      core.dom.editor.classList.add('fadeIn');
      core.dom.editor.classList.remove('fadeOut');
      core.dom.editor.classList.remove('hide');
    });
    core.events.subscribe('core:dom:editor:hide', function () {
      console.log( ' Dom <- core:dom:editor:hide' );
      core.dom.editor.style.zIndex = 0;
      core.dom.editor.classList.remove('fadeIn');
      core.dom.editor.classList.add('fadeOut');
      core.dom.editor.classList.add('hide');
    });

  }, false);
};

Dom.prototype.build = function () {
  console.log('Dom :: build application');

  this.application = document.createElement('core-layout');
  this.editor      = document.querySelector('#editor');
  this.root.body.appendChild(this.application);

  core.events.publish('core:dom:build:ready');
};

Dom.prototype.start = function () {
  console.log('Dom: start');
};

Dom.prototype.stop = function () {
  console.log('Dom: stop');
};

Dom.prototype.destroy = function () {
  console.log('Dom: destroy');
};

module.exports = Dom;
