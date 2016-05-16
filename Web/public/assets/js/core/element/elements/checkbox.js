var Checkbox = function( config ) {
  this.element      = document.createElement( 'input' );
  this.element.className = 'mdl-checkbox__input';
  this.element.type = 'checkbox';
  this.element.id   = core.utils.generateId();


  this.config = config;
  this.element._config = config;

  this.render();
}
Checkbox.prototype = Object.create( require('./input').prototype );
Checkbox.prototype.constructor = Checkbox;

Checkbox.prototype.setChecked = function( checked ){
  this.element.checked = checked;
}

Checkbox.prototype.setLabel = function( string ){
  this._label = string;

  var config = {
    class : 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect',
    for   : this.element
  };

  this.label = new this.Label( config );
  console.log(' ++ Checkbox.prototype.setLabel', string, this.label );
};

Checkbox.prototype.render = function( string ){
//////////////
// Checkbox //
//////////////
// <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-1">
//   <input type="checkbox" id="checkbox-1" class="mdl-checkbox__input" checked>
//   <span class="mdl-checkbox__label">Checkbox</span>
// </label>
  
  for( var key in this.config ){
    var action = core.utils.toCamelCase( `set.${key}` );

    try{
      this[ action ]( this.config[ key ] );
    } catch(e) {
      // throw new Error('no method in prototype')
      // console.log('no method in prototype', action);
    }
  }

  if ( this.hasOwnProperty('_label') ) {
    
    console.log( 'label++', this.label );

    var span = document.createElement('span');
    span.className = 'mdl-checkbox__label';
    span.textContent = this.config.label;

    this.label.element.appendChild( this.element );
    this.label.element.appendChild( span );

    this.element = this.label.element;
  }

  this.element._config = this.config;
  return this;
};


module.exports = Checkbox;