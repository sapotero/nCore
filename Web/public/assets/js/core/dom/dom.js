'use strict';

var Dom = function () {
  this.root        = document;
  this.application = {};
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

    core.events.subscribe('core:dom:attach:progressbar', function () {
      // dom.application.addElement('progressbar');
    });

    core.events.subscribe('core:dom:remove:progressbar', function () {
      // dom.application.removeElement('progressbar');
    });

    core.events.subscribe('core:dom:progressbar:update', function (percent) {
      // dom.application.updateProgress(percent);
    });

  }, false);
};

Dom.prototype.build = function () {
  console.log('Dom :: build application');

  this.application = document.createElement('core-layout');
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
