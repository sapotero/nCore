"use strict";

core.modules.progressbar = (function(){

  var Progressbar = function(modules) {
    this.modules = modules || [];
    this.total   = this.modules.length;
    this.count   = 0;
    this.percent = 0;
    
    this.ready   = false;

    this.element = {};
  };

  Progressbar.prototype.build = function() {
      var bar = document.createElement('div');
      bar.classList.add('core-progressbar-bar');

      this.element = document.createElement('div');
      this.element.id = 'core-progessbar';
      this.element.classList.add('core-progressbar');
      this.element.appendChild(bar);

      core.dom.application.appendChild( this.element );

      this.action();
  };
  Progressbar.prototype.destroy = function() {
    this.element.remove();
    delete this.element;
  };

  Progressbar.prototype.action = function() {
    var bar = this;

    for (var i = 50; i >= 0; i--) {
      var promise = new Promise(
        function( resolve, reject ) {
          setTimeout( function(){
            resolve(true);
          }, Math.random()*10000 + Math.random()*10000);
        }
      );
      promise.then(function(){
        bar.update();
      }).catch(function(e){
        throw new Error(e);
      });

      bar.modules.push( promise );
    };
    bar.total = bar.modules.length;

    Promise.all( bar.modules ).then(
      function( values ) {
        bar.finish();
      }
    ).catch(function(e){
      throw new Error(e);
    });

  };

  Progressbar.prototype.start = function() {
    this.build();
    this.action();
  };

  Progressbar.prototype.finish = function() {
    core.events.publish("core::preloader:finish");
  };

  Progressbar.prototype.update = function() {
    this.count++;
    this.percent = parseFloat( this.count / this.total );
    this.element.querySelector('.core-progressbar-bar').style.width = this.percent * 100 + '%';
    console.log( 'update', this.count, this.total, parseFloat( this.count / this.total )*100 );
  };

  var progress = new Progressbar();

  core.events.subscribe("core::preloader:start", function(){
    console.log('core::preloader:start');
    progress.build();
  });


  return progress;
})();