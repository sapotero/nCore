var Switch = function( config ) {
  this.element      = document.createElement( 'input' );
  this.element.className = 'mdl-switch__input';
  this.element.type = 'checkbox';
  this.element.id   = core.utils.generateId();


  this.config = config;
  this.element._config = config;

  this.render();
}
Switch.prototype = Object.create( require('./checkbox').prototype );
Switch.prototype.constructor = Switch;

Switch.prototype.setChecked = function( checked ){
  this.element.checked = checked;
}

Switch.prototype.setLabel = function( string ){
  var config = {
    class : 'mdl-switch mdl-js-switch mdl-js-ripple-effect',
    for   : this.element
  };

  this.label = new this.Label( config );
};

Switch.prototype.render = function( string ){
//////////////
// Switch //
//////////////
// <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-1">
//   <input type="checkbox" id="checkbox-1" class="mdl-checkbox__input" checked>
//   <span class="mdl-checkbox__label">Switch</span>
// </label>
  
  for( var key in this.config ){
    var action = core.utils.toCamelCase( 'set.' + key );

    try{
      this[ action ]( this.config[ key ] );
    } catch(e) {
      // throw new Error('no method in prototype')
    }
  }

  if ( this.hasOwnProperty('label') ) {

    var span = document.createElement('span');
    span.className = 'mdl-switch__label';
    // span.textContent = this.config.label;

    this.label.element.appendChild( this.element );
    this.label.element.appendChild( span );

    this.element = this.label.element;
  }

  this.element._config = this.config;
  return this;
};


module.exports = Switch;