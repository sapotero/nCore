module.exports = function(){
  document.addEventListener('DOMContentLoaded', function(){ 

    core.events.subscribe("core:dom:build:ready", function(){
      console.log('Core <- core:dom:build:ready');

      core.events.publish("core:dom:attach:progressbar");
      core.events.publish("core:preloader:start");
    });

    core.events.subscribe("core:preloader:finish", function(){
      console.log('Core <- core:preloader:finish');
      // core.events.publish("core:dom:remove:progressbar");
      core.events.publish("core:router:update");
    });

    core.events.subscribe( "core:template:load", function (template) {
      core.worker.postMessage( [ 'template:load', template ] )
    });

    // загрузка всех отчетов
    // core.events.subscribe( "core:reports:loaded", function (data) {
    //   console.log( "core:reports:loaded", data );
    //   core.worker.postMessage( [ 'reports:load', {} ] )
    // });

    // загрузка отчета по id
    core.events.subscribe( "core:report:loaded", function (id) {
      core.worker.postMessage( [ 'reports:id', id ] )
    });

    core.events.subscribe( "core:layout:template:ready", function (template) {
      // console.log('layout: ', template);
      core.events.publish('core:dom:build', template );
    });


    core.events.subscribe( "core:reports:load", function () {
      console.log('Core <- core:reports:load' );
      core.worker.postMessage( [ 'reports:load', '' ] );
    });


    core.events.subscribe( "core:web-forms:load", function (template) {
      console.log('Core <- core:web-forms:load' );
      core.worker.postMessage( [ 'web-forms:load', '' ] );
    });
    core.events.subscribe( "core:web-forms:loaded", function (template) {
      console.log('Core <- core:web-forms:loaded' );
      core.events.publish( "core:preloader:task:ready" );
    });
    core.events.subscribe( "core:print-forms:load", function (template) {
      console.log('Core <- core:print-forms:load' );
      core.worker.postMessage( [ 'print-forms:load', '' ] );
    });
    core.events.subscribe( "core:print-forms:loaded", function (template) {
      console.log('Core <- core:print-forms:loaded' );
      core.events.publish( "core:preloader:task:ready" );
    });
    core.events.subscribe( "core:bps:load", function (template) {
      console.log('Core <- core:bps:load' );
      core.worker.postMessage( [ 'bps:load', '' ] );
    });
    core.events.subscribe( "core:bps:loaded", function (template) {
      console.log('Core <- core:bps:loaded' );
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe( "core:criterias:load", function (template) {
      console.log('Core <- core:criterias:load' );
      core.worker.postMessage( [ 'criterias:load', '' ] );
    });
    core.events.subscribe( "core:criterias:loaded", function (template) {
      console.log('Core <- core:criterias:loaded' );
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe( "core:criteriaKeys:loaded", function (template) {
      console.log('Core <- core:criteriaKeys:loaded' );
      core.events.publish( "core:preloader:task:ready" );
    });
    core.events.subscribe( "core:criteriaKeys:load", function (template) {
      console.log('Core <- core:criteriaKeys:load' );
      core.worker.postMessage( [ 'criteriaKeys:load', '' ] );
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