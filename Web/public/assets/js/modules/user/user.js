'use strict';

core.modules.user = (function() {

  var User = function(){
    this.name = '';
  };
  User.prototype.start = function() {
    // console.log( 'User: start' );
  };
  User.prototype.stop = function() {
    // console.log( 'User: stop' );
  };
  User.prototype.destroy = function() {
    // console.log( 'User: destroy' );
  };

  var user = new User();

  core.events.subscribe("core:start:all", function(){
    console.log('core:start:user');
    user.start();
  });

  return user;
}());