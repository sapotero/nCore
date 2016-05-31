'use strict';
var Base64 = require('./base64');

var Utils = function(){
  this.element = [];
};
Utils.prototype.Base64 = new Base64();

Utils.prototype.merge = function (from, to) {
  var result = {};

  for ( var key in from ) {
    if ( from.hasOwnProperty(key) ) {
      if ( !result.hasOwnProperty(key) ) {
        result[key] = from[key]
      };
    }
  }
  for (var key in to) {
    if (to.hasOwnProperty(key)) {
      if ( !result.hasOwnProperty(key) ) {
        result[key] = to[key]
      };
    }
  }
  return result;
}

Utils.prototype.request = function( type, url, data, callback ) {
  var request = new XMLHttpRequest();

  request.open( type.toUpperCase(), url, true);

  request.onload = function() {
    if ( this.status >= 200 && this.status < 400 ) {
      callback( this.response );
    } else {
      callback( new Error( this.response ) );
    }
  };

  request.onerror = function() {
    callback( new Error( this.response ) );
  };

  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send( JSON.stringify(data) );
};
Utils.prototype.log = function(msg, color) {
  var color = color || "black";
  var background = "White";

  switch (color) {
      case "success":
        color      = "Green";
        background = "LimeGreen";
        break;
      case "info":
        color      = "DodgerBlue";
        background = "Turquoise";
        break;
      case "error":
        color      = "Red";
        background = "Black";
        break;
      case "start":
        color      = "OliveDrab";
        background = "PaleGreen";
        break;
      case "warning":
        color      = "Tomato";
        background = "Black";
        break;
      case "end":
        color      = "Orchid";
        background = "MediumVioletRed";
        break;
      default:
        color = color;
        break;
    };

  if ( typeof msg == "object" ) {
      console.log(msg);
  } else if ( typeof color == "object" ) {
      console.log("%c" + msg, "color: PowderBlue;font-weight:bold; background-color: RoyalBlue;");
      console.log(color);
  } else {
      console.log("%c" + msg, "color:" + color + ";font-weight:bold; background-color: " + background + ";");
  }
};
Utils.prototype.get = function( url, data, callback ) {
  this.request( 'get', url, data, callback );
};
Utils.prototype.post = function( url, data, callback ) {
  this.request( 'post', url, data, callback );
};
Utils.prototype.put = function( url, data, callback ) {
  this.request( 'put', url, data, callback );
};
Utils.prototype.delete = function( url, data, callback ) {
  this.request( 'delete', url, data, callback );
};

Utils.prototype.extend = function() {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key)) {
        arguments[0][key] = arguments[i][key];
      }
    }
  }
  return arguments[0];
}
Utils.prototype.generateId = function() {
  return Math.floor( Math.random() * Math.pow(2,32) ).toString(10);
};
Utils.prototype.toCamelCase = function ( string ){
  return string.replace(/[^A-Za-z0-9]/g, ' ').replace(/^\w|[A-Z]|\b\w|\s+/g, function (match, index) {
    if ( +match === 0 || match === '-' || match === '.' ) {
      return "";
    }
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

Utils.prototype.start = function() {
  console.log( 'Utils: start' );
};
Utils.prototype.stop = function() {
  console.log( 'Utils: stop' );
};
Utils.prototype.destroy = function() {
  console.log( 'Utils: destroy' );
  this.element = [];
};

 module.exports = Utils;