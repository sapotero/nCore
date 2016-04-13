"use strict";


var Subscriber = function(fn, options, context) {
  if (!(this instanceof Subscriber)) {
    return new Subscriber(fn, options, context);
  }

  this.id = this.guidGenerator();
  this.fn = fn;
  this.options = options;
  this.context = context;
  this.channel = null;
}
Subscriber.prototype.guid = function(options) {
  return ( ( ( 1 + Math.random() ) * 0x10000)   | 0 ).toString(16).substring(1);
}
Subscriber.prototype.guidGenerator = function(options) {
  var S4 = this.guid;
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
Subscriber.prototype.update = function(options) {
  if (options) {
    this.fn = options.fn || this.fn;
    this.context = options.context || this.context;
    this.options = options.options || this.options;
    if (this.channel && this.options && this.options.priority !== undefined) {
        this.channel.setPriority(this.id, this.options.priority);
    }
  }
} 

module.exports = Subscriber