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
  if ( this._config && this._config.hasOwnProperty('after') ) {
    this.addAfter();
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
Simple.prototype.addAfter = function(){
  if ( this._config.hasOwnProperty('after') && this._config.after.constructor === Array ) {
    for (var a = 0, length = this._config.after.length; a < length; a++) {
      var item = this._config.after[a];
      console.log( 'after+++++');

      if ( item.hasOwnProperty('element') ) {
        console.log( 'after++');
        this.element.insertAdjacentHTML( 'beforeEnd', item.element.innerHTML );
      }

    }
  }
};

Simple.prototype.render = function(){
  return this;
};

module.exports = Simple;