var dom = require('./dom');

module.exports = function(){
  document.addEventListener('DOMContentLoaded', function(){ 
    core.events.subscribe("core::start:all", function(){
      console.log('core  > dom > bindEvents > core::start:all');
      manager.start();
    }, { priority: 0 });

    core.events.subscribe("core::dom:updateApplication", function(application){
      dom.root.body.appendChild(application);
    }, { priority: 0 });

    core.events.subscribe('core::dom:build', function(template){
      dom.build(template);
    });

    core.events.subscribe('core::dom:application:clear', function(template){
      console.log( ' clear ->', dom.application );
      // dom.application.querySelector('.core-layout-application').innerHTML = '';
    });
  }, false);
}(window);