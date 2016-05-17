var Textarea = function( config ) {
  this.element = document.createElement( 'textarea' );
  this.element.className = 'mdl-textfield__input';
  this.element.id = core.utils.generateId();

  // this.elements.rows = 5;
  // this.elements.cols = 5;

  this.config = config;

  this.render();
}
Textarea.prototype = Object.create( require('./super').prototype );
Textarea.prototype.constructor = Textarea;

Textarea.prototype.Label = require('./label');

Textarea.prototype.setLabel = function( string ){

  var config = {
    class : 'mdl-textfield__label',
    for   : this.element,
    text  : string
  };

  this.label = new this.Label( config );
};

Textarea.prototype.render = function() {
  
  // <div class="mdl-textfield mdl-js-textfield">
  //   <textarea class="mdl-textfield__input" type="text" rows= "10" cols="200" id="sample5" ></textarea>
  //   <label class="mdl-textfield__label" for="sample5">Text lines...</label>
  // </div>

  for( var key in this.config ){
    var action = core.utils.toCamelCase( 'set.' + key );

    try{
      this[ action ]( this.config[ key ] );
    } catch(e) {
      // throw new Error('no method in prototype')
    }
  }

  if ( this.hasOwnProperty('label') ) {

    var wrapper = document.createElement('div');
    wrapper.className = 'mdl-textfield mdl-js-textfield';

    wrapper.appendChild( this.label.element );
    wrapper.appendChild( this.element );

    this.element = wrapper;
  }

  this.element._config = this.config;
  return this;
};
module.exports = Textarea;