var Search = function( config ) {
  this.element = document.createElement( 'div' );
  // this.element.action = "#";
  
  this.wrapper = document.createElement( 'div' );
  this.wrapper.classList.add( this.CSS.ROOT );
  this.wrapper.classList.add( this.CSS.ROOT_JS );
  this.wrapper.classList.add( this.CSS.EXPAND );
  this.element.appendChild( this.wrapper );

  this.labelSearch = document.createElement( 'label' );
  this.labelSearch.classList.add( this.CSS.BUTTON );
  this.labelSearch.classList.add( this.CSS.BUTTON_JS );
  this.labelSearch.classList.add( this.CSS.BUTTON_ICON );
  
  this.iconSearch = document.createElement( 'i' );
  this.iconSearch.classList.add( this.CSS.ICON );
  this.iconSearch.textContent = 'search';

  this.labelSearch.appendChild( this.iconSearch );

  this.expandWrapper = document.createElement( 'div' );
  this.expandWrapper.classList.add( this.CSS.EXPAND_HOLD );


  this.input = document.createElement( 'input' );
  this.input.classList.add( this.CSS.INPUT );
  this.input.type = 'text';
  this.input.id   = core.utils.generateId();


  this.label = document.createElement( 'label' );
  this.label.classList.add( this.CSS.LABEL );
  this.expandWrapper.appendChild( this.input );
  this.expandWrapper.appendChild( this.label );

  this.labelSearch.setAttribute( 'for', this.input.id );
  this.label.setAttribute( 'for', this.input.id );

  this.wrapper.appendChild( this.labelSearch );
  this.wrapper.appendChild( this.expandWrapper );

  this._config = config;
  this.element._config = config;


  // <form action="#">
  //   <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
  //     <label class="mdl-button mdl-js-button mdl-button--icon" for="sample6">
  //       <i class="material-icons">search</i>
  //     </label>
  //     <div class="mdl-textfield__expandable-holder">
  //       <input class="mdl-textfield__input" type="text" id="sample6">
  //       <label class="mdl-textfield__label" for="sample-expandable">Expandable Search</label>
  //     </div>
  //   </div>
  // </form>


  this.render();
}
Search.prototype.setIcon = function( string ){
    this.iconSearch.textContent = string;
};
Search.prototype.setClass = function( string ){
  this.element.classList.add( string );
};

Search.prototype.render = function( string ){
  var scope = this;

  if ( this._config && this._config.hasOwnProperty('class') ) {
    this.setClass( this._config.class );
  };
  if ( this._config && this._config.hasOwnProperty('icon') ) {
    this.setIcon( this._config.icon );
  };

  if ( this._config.hasOwnProperty('input') && typeof this._config.input.function === 'function' ) {
    this._config.input.context = this._config.input.context || this;
    this.input.addEventListener( 'input', this._config.input.function.bind( this._config.input.context ) );
  }

  if ( this._config.hasOwnProperty('submit') && typeof this._config.submit.function === 'function' ) {
    this._config.submit.context = this._config.submit.context || this;
    this.input.addEventListener( 'keydown', function(e){
      if ( e.keyCode === 27 ) {
        e.preventDefault();
        console.log( 'press esc', e );
      } else if ( e.keyCode === 13 ) {
        e.preventDefault();
        console.log( 'press enter', e, this, scope );
        scope._config.submit.function.call( this, scope._config.submit.context );
      } else {
        scope._config.input.function.call( this, scope._config.input.context );
      }


    });
  }

  return this;
};

Search.prototype.CSS = {
  ROOT        : "mdl-textfield",
  ROOT_JS     : "mdl-js-textfield",
  EXPAND      : "mdl-textfield--expandable",
  EXPAND_HOLD : "mdl-textfield__expandable-holder",
  INPUT       : "mdl-textfield__input",
  LABEL       : "mdl-textfield__label",
  BUTTON      : "mdl-button",
  BUTTON_JS   : "mdl-js-button",
  BUTTON_ICON : "mdl-button--icon",
  ICON        : "material-icons",
};

module.exports = Search;