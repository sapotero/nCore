var Card = function Card( config ) {

  this.element = document.createElement('div');
  this.element.classList.add( this.CSS.ROOT );
  
  if ( config && config.hasOwnProperty('class') ) {
    this.setClass( config.class );
  };
  if ( config && config.hasOwnProperty('width') ) {
    this.setWidth( config.width );
  };
  if ( config && config.hasOwnProperty('height') ) {
    this.setHeight( config.height );
  };

  if ( config && config.hasOwnProperty('shadow') ) {
    this.setShadow( config.shadow );
  };

  this.element._config = config;
  this._config = config;

  this.render();
}


Card.prototype.setWidth = function( string ){
  this.element.style.width = string + 'px';
};
Card.prototype.setHeight = function( string ){
  this.element.style.height = string + 'px';
};
Card.prototype.setClass = function( string ){
  this.element.classList.add( string );
};
Card.prototype.setShadow = function( shadow ){
  this.element.classList.add( "mdl-shadow--" + shadow + "dp" );
};

Card.prototype.CSS = {
  FLEX           : "mdl-card--flex",
  SHADOW         : "mdl-shadow--2dp",
  ROOT           : "mdl-card",
  BORDER         : "mdl-card--border",
  EXPAND         : "mdl-card--expand",
  TITLE          : "mdl-card__title",
  TITLE_TEXT     : "mdl-card__title-text",
  SUB_TITLE_TEXT : "mdl-card__subtitle-text",
  MEDIA          : "mdl-card__media",
  SUPPORT_TEXT   : "mdl-card__supporting-text",
  ACTIONS        : "mdl-card__actions",
  MENU           : "mdl-card__menu",
}


Card.prototype.render = function(){

  var df = document.createDocumentFragment();

  if ( this._config.hasOwnProperty('title') ){
    var title = document.createElement('div');
    title.classList.add( this.CSS.TITLE );
    
    if ( this._config.hasOwnProperty('expand') && this._config.expand === true ){
      title.classList.add( this.CSS.EXPAND );
    }

    var titleText = document.createElement('h2');
    titleText.classList.add( this.CSS.TITLE_TEXT );
    titleText.textContent = this._config.title;

    title.appendChild( titleText );
    
    if ( this._config.hasOwnProperty('subTitle') ){
      var subTitle = document.createElement('div');
      subTitle.classList.add( this.CSS.TITLE );
      subTitle.textContent = this._config.subTitle;
      title.appendChild( subTitle );
    }
    
    df.appendChild( title );
  }

  if ( this._config.hasOwnProperty('media') ){
    var media = document.createElement('div');
    media.classList.add( this.CSS.MEDIA );

    var image = document.createElement('image');
    image.setAttribute( 'src', this._config.media );
    media.appendChild( image );

    df.appendChild( media );
  }

  if ( this._config.hasOwnProperty('description') ){
    var description = document.createElement('h2');
    description.classList.add( this.CSS.SUPPORT_TEXT );
    description.textContent = this._config.description;
    df.appendChild( description );
  }

  if ( this._config.hasOwnProperty('actions') && this._config.actions.constructor === Array ) {
    var action = document.createElement('div');
    action.classList.add( this.CSS.ACTIONS );
    action.classList.add( this.CSS.BORDER );
    action.classList.add( this.CSS.FLEX );

    for (var i = 0, length = this._config.actions.length; i < length; i++) {
      var item = this._config.actions[i];

      if ( item.hasOwnProperty('element') ) {
        action.appendChild( item.element );
      }
    }
    df.appendChild( action );
  }

  if ( this._config.hasOwnProperty('menu') && this._config.menu.constructor === Array ) {
    var action = document.createElement('div');
    action.classList.add( this.CSS.MENU );

    for (var i = 0, length = this._config.menu.length; i < length; i++) {
      var item = this._config.menu[i];

      if ( item.hasOwnProperty('element') ) {
        action.appendChild( item.element );
      }
    }
    df.appendChild( action );
  }
  // <div class="mdl-card mdl-shadow--2dp">
  //   <div class="mdl-card__title">
  //     <h2 class="mdl-card__title-text">Welcome</h2>
  //   </div>

  //   <div class="mdl-card__supporting-text">
  //     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  //     Mauris sagittis pellentesque lacus eleifend lacinia...
  //   </div>
  
  //   <div class="mdl-card__actions mdl-card--border">
  //     <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
  //       Get Started
  //     </a>
  //   </div>
  
  //   <div class="mdl-card__menu">
  //     <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
  //       <i class="material-icons">share</i>
  //     </button>
  //   </div>
  // </div>

  this.element.appendChild( df );
  return this;

  // var card = core.elements.create( {
  //   elementType : 'card',
  //   preventCopy : true,

  //   title    : "title",
  //   subTitle : "subTitle",
  //   shadow : 4,
  //   media  : {
  //     // image src
  //     src: '',
  //   },
  //   description : {},
  //   actions : [
  //     core.elements.create({
  //       elementType : 'button',
  //       preventCopy : true,
  //       name        : 'test-check',
  //       fab         : true,
  //       icon        : 'star'
  //     }),
  //     '<div class="mdl-layout-spacer"></div>'
  //     ,
  //     core.elements.create({
  //       elementType : 'button',
  //       preventCopy : true,
  //       name        : 'test-check',
  //       fab         : true,
  //       icon        : 'star'
  //     })
  //   ]
  // });
};

module.exports = Card;