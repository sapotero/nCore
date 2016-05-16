var Radio = function( config ) {
  this.element      = document.createElement( 'input' );
  this.element.className = 'mdl-radio__button';
  this.element.type = 'radio';
  this.element.id   = core.utils.generateId();


  this.config = config;
  this.element._config = config;

  this.render();
}
Radio.prototype = Object.create( require('./checkbox').prototype );
Radio.prototype.constructor = Radio;

Radio.prototype.setLabel = function( string ){
  this._label = string;

  var config = {
    class : 'mdl-radio mdl-js-radio mdl-js-ripple-effect',
    for   : this.element
  };

  this.label = new this.Label( config );
  console.log(' ++ Radio.prototype.setLabel', string, this.label );
};

Radio.prototype.render = function( string ){
//////////////
// Radio //
//////////////
// <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-1">
//   <input type="radio" id="option-1" class="mdl-radio__button" name="options" value="1" checked>
//   <span class="mdl-radio__label">First</span>
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


module.exports = Radio;