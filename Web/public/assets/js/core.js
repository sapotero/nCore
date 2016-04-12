core = (function(){

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
        subscriber, l,
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

  var WebWorker = function(){
    this.worker = new Worker("assets/js/core/worker.js");
    this.worker.onmessage = function( e ) {
      console.log('FROM WORKER: ', e);
      var data = e.data;
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          // data[key];
          switch (key) {
            case 'template:loaded':
              var templateName = Object.keys( data[key] )[0],
                  data         = data[key][templateName];
              
              core.events.publish("core::template:loaded", {
                name : templateName,
                raw  : data
              });
              
              break;
            case 'reports:loaded':
              core.events.publish("core::reports:loaded", {
                raw: JSON.parse( data[key] )
              });
              break;
            default:
              console.log('default');
              break;
          }

        }
      }
    };

    return this.worker;
  };

  var Core = function( config ){
    this.events   = new Mediator();
    this.worker   = new WebWorker();
    this.dom      = {};
    this.utils    = {};
    this.modules  = {};
    this.debug    = true;

    this.bindEvents();
    // this.startAll();
  };

  Core.prototype.bindEvents = function() {
    var core = this;

    core.events.subscribe("core::preloader:finish", function(){
      console.log('core::preloader:finish');
      
      setTimeout(function(){
        core.modules.progressbar.destroy();
        core.events.remove("core::preloader:start");
        core.events.remove("core::preloader:finish");
      }, 1000);

      core.modules.router.start();
      core.events.publish('router::checkDefault');
    });

    core.events.subscribe("core::progressbar:finish", function(){
      console.log('core::progressbar:finish');
      
      setTimeout(function(){
        core.modules.progressbar.destroy();
      }, 1000);

      core.events.publish('core::router:start');
    });

    core.events.subscribe( "core::template:load", function (template) {
      core.worker.postMessage( [ 'template:load', template ] )
    });

    core.events.subscribe( "core::reports:load", function () {
      core.worker.postMessage( [ 'reports:load', {} ] )
    });

    core.worker.postMessage( [ 'reports:load', {} ] )

    core.events.subscribe( "core::layout:template:ready", function (template) {
      // console.log('layout: ', template);
      core.events.publish('core::dom:build', template );
    });

  };

  Core.prototype.start = function(module) {
    this.events.publish( "core::start:" + module );
  };
  Core.prototype.destroy = function(module) {
    this.events.publish( "core::destroy:" + module );
  };

  Core.prototype.startAll = function() {
    console.log('core::startAll');
    core.events.publish("core::preloader:start");
  };
  Core.prototype.destroyAll = function() {
    this.events.publish("core::destroy:all");
  };

  return new Core();
})();
