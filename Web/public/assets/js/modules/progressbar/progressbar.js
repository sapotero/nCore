"use strict";


var Progressbar = function() {
  this.modules = [];
  this.total   = this.modules.length;
  this.count   = 0;
  this.percent = 0;

  this.ready   = false;
  this.element = {};

  this.bindEvents();
};

Progressbar.prototype.start = function() {
  this.build();
};

Progressbar.prototype.stop = function() {
  // this.build();
  // this.action();
};

Progressbar.prototype.destroy = function() {
  this.element.remove();
  delete this.element;
};

Progressbar.prototype.update = function(template) {
  // console.log('core::progressbar:update', template);
  this.element.innerHTML = template.raw;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
};
Progressbar.prototype.build = function(template) {
  this.element = document.createElement('div');
  core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
  core.events.publish("core::progressbar:template");
};

Progressbar.prototype.action = function() {
  var progressbar = this;
  var modules = [ 'user', 'router', 'snackbar', 'reports' ];

  for (var i = modules.length - 1; i >= 0; i--) {
    var module = modules[i];

    var promise = new Promise(
      function( resolve, reject ) {
        var moduleRaw = require('./' + module + '.js');
        setTimeout(function(){
          resolve(true);
        }, Math.random() * 500);
      }
    );

    promise.then(function(){
      progressbar.updateProgress();
    }).catch(function(e){
      throw new Error(e);
    });

    progressbar.modules.push( promise );
  }

  progressbar.total = progressbar.modules.length;

  Promise.all( progressbar.modules ).then(
    function( values ) {
      progressbar.finish();
    }
  ).catch(function(e){
    throw new Error(e);
  });
};

Progressbar.prototype.finish = function() {
  var progressbar = this;

  var destroy = new Promise(function( resolve, reject){
    progressbar.element.classList.remove('fadeIn');
    progressbar.element.classList.add('fadeOut');
    setTimeout( resolve(true), 100 );
  });

  destroy.then(function(){
    core.events.publish("core::progressbar:finish");
  }).catch(function(e){
    throw new Error(e);
  });
};

Progressbar.prototype.updateProgress = function() {
  this.count++;
  this.percent = parseFloat( this.count / this.total );
  this.element.querySelector('.core-progressbar-bar').style.width = this.percent * 100 + '%';
  // console.log( 'updateProgress', this.count, this.total, parseFloat( this.count / this.total )*100 );
};
Progressbar.prototype.updateRoot = function(html) {
  this.element.innerHTML = html;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
};
Progressbar.prototype.bindEvents = function() {
  var progressbar = this;

  document.addEventListener('DOMContentLoaded', function(){
    core.events.subscribe("core::start:progressbar", function(){
      console.log('core::start:progressbar');
      // progressbar.start();
    });

    core.events.subscribe("core::progressbar:start", function(){
      console.log('Progressbar <- core::progressbar:start');
      core.events.publish( "core::preloader:task:ready" );
    });

    core.events.subscribe("core::progressbar:build", function(template){
      console.log('core::progressbar:template');
      progressbar.start();
    });

    core.events.subscribe("core::template:progressbar", function(template){
      console.log('core::template:progressbar', template);
      progressbar.update(template);
      progressbar.action();
    });
  });
};
module.exports = Progressbar;