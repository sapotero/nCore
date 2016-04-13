var Channel = require('./channel');
var Subscriber = require('./subscriber');

var Mediator = function() {
  if (!(this instanceof Mediator)) {
    return new Mediator();
  }

  this._channels = new Channel('');
}
Mediator.prototype.getChannel = function(namespace, readOnly) {
  var channel = this._channels,
      namespaceHierarchy = namespace.split(':'),
      x = 0,
      y = namespaceHierarchy.length;

  if (namespace === '') {
    return channel;
  }

  if (namespaceHierarchy.length > 0) {
    for(x, y; x < y; x++) {

      if (!channel.hasChannel(namespaceHierarchy[x])) {
        if (readOnly) {
          break;
        } else {
          channel.addChannel(namespaceHierarchy[x]);
        }
      }

      channel = channel.returnChannel(namespaceHierarchy[x]);
    }
  }

  return channel;
}
Mediator.prototype.subscribe = function(channelName, fn, options, context) {
  var channel = this.getChannel(channelName || "", false);

  options = options || {};
  context = context || {};

  return channel.addSubscriber(fn, options, context);
}
Mediator.prototype.once = function(channelName, fn, options, context) {
  options = options || {};
  options.calls = 1;

  return this.subscribe(channelName, fn, options, context);
}
Mediator.prototype.getSubscriber = function(identifier, channelName) {
  var channel = this.getChannel(channelName || "", true);
  
  
  if (channel.namespace !== channelName) {
    return null;
  }

  return channel.getSubscriber(identifier);
}
Mediator.prototype.remove = function(channelName, identifier) {
  var channel = this.getChannel(channelName || "", true);
  if (channel.namespace !== channelName) {
    return false;
  }

  channel.removeSubscriber(identifier);
}
Mediator.prototype.publish = function(channelName) {
  var channel = this.getChannel(channelName || "", true);
  if (channel.namespace !== channelName) {
    return null;
  }

  var args = Array.prototype.slice.call(arguments, 1);

  args.push(channel);

  channel.publish(args);
}
Mediator.prototype.on = Mediator.prototype.subscribe;
Mediator.prototype.bind = Mediator.prototype.subscribe;
Mediator.prototype.emit = Mediator.prototype.publish;
Mediator.prototype.trigger = Mediator.prototype.publish;
Mediator.prototype.off = Mediator.prototype.remove;

Mediator.Channel = Channel;
Mediator.Subscriber = Subscriber;

module.exports = Mediator