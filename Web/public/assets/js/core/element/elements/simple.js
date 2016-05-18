var Simple = function Simple( config ) {

  this.type = 'div';
  
  if ( config && config.hasOwnProperty('type') ) {
    this.type = config.type;
  };

  this.element = document.createElement( this.type );
  this.element._config = config;
  this._config = config;

  this.populate();
  this.render();
}
Simple.prototype.populate = function(){
  if ( this._config && this._config.hasOwnProperty('text') ) {
    this.setText( this._config.text );
  };
  if ( this._config && this._config.hasOwnProperty('class') ) {
    this.setClass( this._config.class );
  };
  if ( this._config && this._config.hasOwnProperty('items') ) {
    this.addItems();
  };
};
Simple.prototype.setText = function( string ){
  this.element.textContent = string;
};
Simple.prototype.setId = function( id ){
  this.element.id = id;
};
Simple.prototype.setHref = function( href ){
  this.element.href = href;
};
Simple.prototype.setClass = function( classes ){
  if ( classes.length ) {
    for (var i = classes.length - 1; i >= 0; i--) {
      this.element.classList.add( classes[i] );
    }
  } else {
    this.element.className += ' ' + classes;
  }
};
Simple.prototype.addItems = function(){
  if ( this._config.hasOwnProperty('items') && this._config.items.constructor === Array ) {
    for (var i = 0, length = this._config.items.length; i < length; i++) {
      var item = this._config.items[i];

      if ( item.hasOwnProperty('element') ) {
        this.element.appendChild( item.element );
      }

    }
  }
};

Simple.prototype.render = function(){
  return this;
};

module.exports = Simple;