'use strict';
var core = core || {};

window.onload  = function(){
  core.global = {
    user : {
      id   : '<%= current_user._id %>',
      name : '<%= current_user.official_name %>',
    },
    provider: {
      id   : '<%= current_user.provider._id %>',
      name : '<%= current_user.provider.name %>',
    }
  }
  core.startAll();
};