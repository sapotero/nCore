var Subscriber = require('./subscriber');

var Channel = function(namespace, parent) {
  if (!(this instanceof Channel)) {
    return new Channel(namespace);
  }

  this.namespace = namespace || "";
  this._subscribers = [];
  this._channels = {};
  this._parent = parent;
  this.stopped = false;
}
Channel.prototype.addSubscriber = function(fn, options, context) {
  var subscriber = new Subscriber(fn, options, context);

  if (options && options.priority !== undefined) {
    
    
    
    options.priority = options.priority >> 0;

    if (options.priority < 0) { options.priority = 0; }
    if (options.priority >= this._subscribers.length) { options.priority = this._subscribers.length-1; }

    this._subscribers.splice(options.priority, 0, subscriber);
  }else{
    this._subscribers.push(subscriber);
  }

  subscriber.channel = this;

  return subscriber;
}
Channel.prototype.stopPropagation = function() {
  this.stopped = true;
}
Channel.prototype.getSubscriber = function(identifier) {
  var x = 0,
      y = this._subscribers.length;

  for(x, y; x < y; x++) {
    if (this._subscribers[x].id === identifier || this._subscribers[x].fn === identifier) {
      return this._subscribers[x];
    }
  }
}
Channel.prototype.setPriority = function(identifier, priority) {
  var oldIndex = 0,
      x = 0,
      sub, firstHalf, lastHalf, y;

  for(x = 0, y = this._subscribers.length; x < y; x++) {
    if (this._subscribers[x].id === identifier || this._subscribers[x].fn === identifier) {
      break;
    }
    oldIndex ++;
  }

  sub = this._subscribers[oldIndex];
  firstHalf = this._subscribers.slice(0, oldIndex);
  lastHalf = this._subscribers.slice(oldIndex+1);

  this._subscribers = firstHalf.concat(lastHalf);
  this._subscribers.splice(priority, 0, sub);
}
Channel.prototype.addChannel = function(channel) {
  this._channels[channel] = new Channel((this.namespace ? this.namespace + ':' : '') + channel, this);
}
Channel.prototype.hasChannel = function(channel) {
  return this._channels.hasOwnProperty(channel);
}
Channel.prototype.returnChannel = function(channel) {
  return this._channels[channel];
}
Channel.prototype.removeSubscriber = function(identifier) {
  var x = this._subscribers.length - 1;

  
  if (!identifier) {
    this._subscribers = [];
    return;
  }

  
  for(x; x >= 0; x--) {
    if (this._subscribers[x].fn === identifier || this._subscribers[x].id === identifier) {
      this._subscribers[x].channel = null;
      this._subscribers.splice(x,1);
    }
  }
}
Channel.prototype.publish = function(data) {
  var x = 0,
      y = this._subscribers.length,
      shouldCall = false,
      subscriber,
      subsBefore,subsAfter;

  for(x, y; x < y; x++) {
    
    shouldCall = false;
    subscriber = this._subscribers[x];

    if (!this.stopped) {
      subsBefore = this._subscribers.length;
      if (subscriber.options !== undefined && typeof subscriber.options.predicate === "function") {
        if (subscriber.options.predicate.apply(subscriber.context, data)) {
          
          shouldCall = true;
        }
      }else{
        shouldCall = true;
      }
    }

    
    if (shouldCall) {
      if (subscriber.options && subscriber.options.calls !== undefined) {
        
        subscriber.options.calls--;
        
        if (subscriber.options.calls < 1) {
          this.removeSubscriber(subscriber.id);
        }
      }
      
      
      subscriber.fn.apply(subscriber.context, data);

      subsAfter = this._subscribers.length;
      y = subsAfter;
      if (subsAfter === subsBefore - 1) {
        x--;
      }
    }
  }

  if (this._parent) {
    this._parent.publish(data);
  }

  this.stopped = false;
}

module.exports = Channel;