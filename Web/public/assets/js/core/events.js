module.exports = function(){
  document.addEventListener('DOMContentLoaded', function(){ 


    // core.events.subscribe("core:preloader:finish", function(){
    //   console.log('core:preloader:finish');
      
    //   setTimeout(function(){
    //     core.modules.progressbar.destroy();
    //     core.events.remove("core:preloader:start");
    //     core.events.remove("core:preloader:finish");
    //   }, 1000);

    //   core.modules.router.start();
    //   core.events.publish('router:checkDefault');
    // });
    // 
    

    core.events.subscribe("core:dom:build:ready", function(){
      console.log('Core <- core:dom:build:ready');
      core.events.publish("core:dom:attach:progressbar");
      core.events.publish("core:preloader:start");
    });

    core.events.subscribe("core:preloader:finish", function(){
      console.log('Core <- core:preloader:finish');
      core.events.publish("core:dom:remove:progressbar");
    });

    core.events.subscribe( "core:template:load", function (template) {
      core.worker.postMessage( [ 'template:load', template ] )
    });

    // загрузка всех отчетов
    // core.events.subscribe( "core:reports:load", function () {
    //   core.worker.postMessage( [ 'reports:all', {} ] )
    // });

    // загрузка отчета по id
    core.events.subscribe( "core:report:load", function (id) {
      core.worker.postMessage( [ 'reports:id', id ] )
    });

    core.events.subscribe( "core:layout:template:ready", function (template) {
      // console.log('layout: ', template);
      core.events.publish('core:dom:build', template );
    });



    core.events.subscribe( "core:criteriaKeys:load", function (template) {
      console.log('Core <- core:criteriaKeys:load' );
      core.worker.postMessage( [ 'criteriaKeys:load', '' ] );
    });

    core.events.subscribe( "core:criterias:load", function (template) {
      console.log('Core <- core:criterias:load' );
      core.worker.postMessage( [ 'criterias:load', '' ] );
    });

    core.events.subscribe( "core:reports:load", function (template) {
      console.log('Core <- core:reports:load' );
      core.worker.postMessage( [ 'reports:load', '' ] );
    });

    
    core.events.subscribe( "core:criterias:loaded", function (template) {
      console.log('Core <- core:criterias:loaded' );
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe( "core:criteriaKeys:loaded", function (template) {
      console.log('Core <- core:criteriaKeys:loaded' );
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe('core:custom:load', function(){
      var elements = [ 'layout', 'progressbar' ];

      console.log( 'Core <- core:custom:load ' );
      core.loadCustomElements( elements );
      core.events.publish( "core:preloader:task:ready" );
    });



    // core.worker.postMessage( [ 'reports:all', {} ] );
  }, false);
}(window);