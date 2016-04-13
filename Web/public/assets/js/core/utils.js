'use strict';

core.utils = (function(){
  var Base64 = function(string){
    this.b64tab = {};

    this.b64tabPopulate();
    return this;
  };
  Base64.prototype.b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  Base64.prototype.b64tabPopulate = function() {
    var bin = this.b64chars;
    for (var i = 0, l = bin.length; i < l; i++){
      this.b64tab[bin.charAt(i)] = i
    };
    return this;
  };
  
  Base64.prototype.fromCharCode = String.fromCharCode;

  Base64.prototype.cb_utob = function(c) {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c
            : cc < 0x800 ? (this.fromCharCode(0xc0 | (cc >>> 6))
                          + this.fromCharCode(0x80 | (cc & 0x3f)))
            : ( this.fromCharCode(0xe0 | ((cc >>> 12) & 0x0f) )
              + this.fromCharCode(0x80 | ((cc >>>  6) & 0x3f) )
              + this.fromCharCode(0x80 | ( cc         & 0x3f)));
    } else {
      var cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
      
      return (this.fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
            + this.fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
            + this.fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
            + this.fromCharCode(0x80 | ( cc         & 0x3f)));
    }
  };
  Base64.prototype.re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;

  Base64.prototype.utob = function(u) {
    return u.replace(this.re_utob, this.cb_utob.bind(this));
  };
  Base64.prototype.cb_encode = function(ccc) {
      var b64chars = this.b64chars;
      var padlen = [0, 2, 1][ccc.length % 3],
      ord = ccc.charCodeAt(0) << 16
          | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
          | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
      chars = [
          b64chars.charAt( ord >>> 18),
          b64chars.charAt((ord >>> 12) & 63),
          padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
          padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
      ];
      return chars.join('');
  };
  Base64.prototype.btoa = function(b) {
    return b.replace(/[\s\S]{1,3}/g, this.cb_encode.bind(this) )
  };
  Base64.prototype._encode = function (u) {
    return this.btoa( this.utob(u) );
  };
  Base64.prototype.encodeURI = function(u) {
    return this.encode(u, true)
  };
  // decoder stuff
  Base64.prototype.re_btou = new RegExp([
      '[\xC0-\xDF][\x80-\xBF]',
      '[\xE0-\xEF][\x80-\xBF]{2}',
      '[\xF0-\xF7][\x80-\xBF]{3}'
  ].join('|'), 'g');
  
  Base64.prototype.cb_btou = function(cccc) {
      switch(cccc.length) {
      case 4:
          var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
              |    ((0x3f & cccc.charCodeAt(1)) << 12)
              |    ((0x3f & cccc.charCodeAt(2)) <<  6)
              |     (0x3f & cccc.charCodeAt(3)),
          offset = cp - 0x10000;
          return (this.fromCharCode((offset  >>> 10) + 0xD800)
                  + this.fromCharCode((offset & 0x3FF) + 0xDC00));
      case 3:
          return this.fromCharCode(
              ((0x0f & cccc.charCodeAt(0)) << 12)
                  | ((0x3f & cccc.charCodeAt(1)) << 6)
                  |  (0x3f & cccc.charCodeAt(2))
          );
      default:
          return  this.fromCharCode(
              ((0x1f & cccc.charCodeAt(0)) << 6)
                  |  (0x3f & cccc.charCodeAt(1))
          );
      }
  };
  Base64.prototype.btou = function(b) {
    return b.replace(this.re_btou, this.cb_btou.bind(this) );
  };
  Base64.prototype.cb_decode = function(cccc) {
    var len = cccc.length,
    padlen = len % 4,
    n = (len > 0   ? this.b64tab[cccc.charAt(0)] << 18 : 0)
        | (len > 1 ? this.b64tab[cccc.charAt(1)] << 12 : 0)
        | (len > 2 ? this.b64tab[cccc.charAt(2)] <<  6 : 0)
        | (len > 3 ? this.b64tab[cccc.charAt(3)]       : 0),
    chars = [
        this.fromCharCode( n >>> 16),
        this.fromCharCode((n >>>  8) & 0xff),
        this.fromCharCode( n         & 0xff)
    ];
    chars.length -= [0, 0, 2, 1][padlen];
    return chars.join('');
  };
  Base64.prototype.atob = function(a) {
    return a.replace( /[\s\S]{1,4}/g, this.cb_decode.bind(this) );
  };
  Base64.prototype._decode = function( string ) {
    return this.btou( this.atob( string ) );
  };
  Base64.prototype.replacer = function(char) {
    console.log( 'replacer -> char:', char );
    return char == '-' ? '+' : '/'
  }
  Base64.prototype.decode = function(string){
    var str = String( string ).replace( /[-_]/g, this.replacer ).replace(/[^A-Za-z0-9\+\/]/g, '');
    return this._decode( str );
  };
  Base64.prototype.encode = function( string, urisafe) {
    return !urisafe ? this._encode(String( string )) : this._encode(String( string )).replace( /[+\/]/g, this.replacer ).replace(/=/g, '');
  };

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

    request.send();
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

  return new Utils();
})();
