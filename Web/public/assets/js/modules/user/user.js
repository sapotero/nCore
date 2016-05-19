'use strict';
var User = function(){
  this.name = '';
  this.id   = '';
  this.provider = {
    id   : '',
    name : '',
  };
  this.bindEvents();
};

User.prototype.bindEvents = function() {
  var user = this;

  document.addEventListener('DOMContentLoaded', function(){
    core.events.subscribe("core:user:start", function(){
      console.log('core:user:start');
      user.start();
    });
  });
};

User.prototype.start = function() {
  this.name = core.global.user.name;
  this.id   = core.global.user.id;
  this.provider = {
    id   : core.global.provider.id,
    name : core.global.provider.name,
  };
  core.events.publish( "core:preloader:task:ready" );
  core.events.publish( "core:dom:user:ready", this );
};
User.prototype.stop = function() {
  // console.log( 'User: stop' );
};
User.prototype.destroy = function() {
  // console.log( 'User: destroy' );
};

module.exports = User;
