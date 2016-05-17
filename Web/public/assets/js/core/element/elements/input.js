var Input = function( config ) {
  this.element = document.createElement( 'input' );
  this.element.className = 'mdl-textfield__input';
  this.element.id = core.utils.generateId();

  this.config = config;

  this.render();
}
Input.prototype = Object.create( require('./super').prototype );
Input.prototype.constructor = Input;

Input.prototype.Label = require('./label');
Input.prototype.setValue = function( data ){
  this.element.value = data;
};
Input.prototype.setLabel = function( string ){

  var config = {
    class : 'mdl-textfield__label',
    for   : this.element,
    text  : string
  };

  this.label = new this.Label( config );
  console.log(' ++ Input.prototype.setLabel', string, this.label );
};

Input.prototype.render = function() {
  
  // <!-- Textfield with Floating Label -->
  //   <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
  //     <input class="mdl-textfield__input" type="text" id="sample3">
  //     <label class="mdl-textfield__label" for="sample3">Text...</label>
  //   </div>

  for( var key in this.config ){
    var action = core.utils.toCamelCase( 'set.' + key );

    try{
      this[ action ]( this.config[ key ] );
    } catch(e) {
      // throw new Error('no method in prototype')
      // console.log('no method in prototype', action);
    }
  }

  if ( this.hasOwnProperty('label') ) {
    
    console.log( 'label++', this.label );

    var wrapper = document.createElement('div');
    wrapper.className = 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label';

    wrapper.appendChild( this.label.element );
    wrapper.appendChild( this.element );

    this.element = wrapper;
  }

  this.element._config = this.config;
  return this;
};
module.exports = Input;