/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);

	__webpack_require__(5);

/***/ },
/* 1 */
/***/ function(module, exports) {

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
	    this.worker.onmessage = function( data ) {
	      console.log('FROM WORKER: ', data);
	    };

	    return this.worker;
	  };

	  var Loader = function(){
	    console.log('loader ');
	  };

	  var Core = function( config ){
	    this.events   = new Mediator();
	    this.worker   = new WebWorker();
	    this.loader   = new Loader();
	    this.dom      = {};
	    this.utils    = {};
	    this.modules  = {};
	    this.debug    = true;

	    this.loadAll();
	  };

	  Core.prototype.loadAll = function() {
	    
	    

	  };

	  return new Core();
	})();


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	core.dom = (function(){
	  var DomManager = function(){
	    this.root        = document;
	    this.application = this.root.getElementById('core-application');
	    this.snackbar    = this.root.getElementById('core-snackbar');

	  };

	  DomManager.prototype.start = function() {
	    console.log( 'DomManager: start' );
	  };

	  var manager = new DomManager();
	  
	  core.events.subscribe("dom:getElement", function( selector ){
	    console.log( 'dom:getElement', selector );
	    // return manager.root.querySelector( selector );
	  });
	  core.events.subscribe("getSnackbar", function( selector ){
	    return manager.snackbar;
	  });

	  return manager;
	})();

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	core.utils = (function(){
	  var Utils = function(){
	    this.element = [];
	  };
	  Utils.prototype.start = function() {
	    console.log( 'Utils: start' );
	  };

	  return new Utils();
	})();


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	core.preloader = (function(){

	  var Preloader = function(){
	    this.element = [];
	  };
	  Preloader.prototype.start = function() {
	    console.log( 'Preloader: start' );
	  };

	  return new Preloader();
	})();

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	core.snackbar = (function(){

	  var Snackbar = function(element) {

	    if ( !arguments.length ) {
	      element = core.dom.snackbar;
	    }

	    this.element       = core.dom.snackbar;
	    this.textElement   = this.element.querySelector('.' + this.cssClasses.MESSAGE);
	    this.actionElement = this.element.querySelector('.' + this.cssClasses.ACTION);

	    if (!this.textElement) {
	      console.error('There must be a message element for a Snackbar.');
	      return false;
	    }
	    
	    if (!this.actionElement) {
	      console.error('There must be an action element for a Snackbar.');
	      return false;
	    }

	    this.active        = false;
	    this.actionHandler = undefined;
	    this.message       = undefined;
	    this.actionText    = undefined;
	    this.queuedNotifications = [];
	    this.setActionHidden(true);
	  };

	  Snackbar.prototype.Constant = {
	    ANIMATION_LENGTH: 500
	  };

	  Snackbar.prototype.cssClasses = {
	    SNACKBAR: 'core-snackbar',
	    MESSAGE:  'core-snackbar__text',
	    ACTION:   'core-snackbar__action',
	    ACTIVE:   'core-snackbar--active'
	  };


	  Snackbar.prototype.displaySnackbar = function() {
	    this.element.setAttribute('aria-hidden', 'true');

	    if (this.actionHandler) {
	      this.actionElement.textContent = this.actionText;
	      this.actionElement.addEventListener('click', this.actionHandler);
	      this.setActionHidden(false);
	    }

	    this.textElement.textContent = this.message;
	    this.element.classList.add(this.cssClasses.ACTIVE);
	    this.element.setAttribute('aria-hidden', 'false');
	    setTimeout(this.cleanup.bind(this), this.timeout);
	  };

	  Snackbar.prototype.showSnackbar = function(data) {
	    if (data === undefined) {
	      console.error('Please provide a data object with at least a message to display.');
	      return false;
	    }

	    if (data.message === undefined) {
	      console.error('Please provide a message to be displayed.');
	      return false;
	    }

	    if (data.actionHandler && !data.actionText) {
	      console.error('Please provide action text with the handler.');
	      return false;
	    }

	    if (this.active) {
	      this.queuedNotifications.push(data);
	    } else {
	      this.active = true;
	      this.message = data.message;
	      if (data.timeout) {
	        this.timeout = data.timeout;
	      } else {
	        this.timeout = 2750;
	      }
	      if (data.actionHandler) {
	        this.actionHandler = data.actionHandler;
	      }
	      if (data.actionText) {
	        this.actionText = data.actionText;
	      }
	      this.displaySnackbar();
	    }
	  };

	  Snackbar.prototype.checkQueue = function() {
	    if ( this.queuedNotifications.length > 0) {
	      this.showSnackbar(this.queuedNotifications.shift());
	    }
	  };


	  Snackbar.prototype.cleanup = function() {
	    this.element.classList.remove(this.cssClasses.ACTIVE);
	    setTimeout(function() {
	      this.element.setAttribute('aria-hidden', 'true');
	      this.textElement.textContent = '';
	      if (!this.actionElement.getAttribute('aria-hidden')) {
	        this.setActionHidden(true);
	        this.actionElement.textContent = '';
	        this.actionElement.removeEventListener('click', this.actionHandler);
	      }
	      this.actionHandler = undefined;
	      this.message = undefined;
	      this.actionText = undefined;
	      this.active = false;
	      this.checkQueue();
	    }.bind(this), (this.Constant.ANIMATION_LENGTH));
	  };

	  Snackbar.prototype.setActionHidden = function(value) {
	    if (value) {
	      this.actionElement.setAttribute('aria-hidden', 'true');
	    } else {
	      this.actionElement.removeAttribute('aria-hidden');
	    }
	  };

	  return new Snackbar();
	})(); 


/***/ }
/******/ ]);