var Card = function Card( config ) {

  this.element = document.createElement('div');
  this.element.classList.add( this.CSS.ROOT );
  
  if ( config && config.hasOwnProperty('class') ) {
    this.setClass( config.class );
  };

  this.element._config = config;
  this._config = config;

  this.render();
}

Card.prototype.setClass = function( string ){
  this.element.classList.add( string );
};

Card.prototype.CSS = {
  ROOT           : "mdl-card",
  BORDER         : "mdl-card--border",
  SHADOW         : "mdl-shadow--2dp",
  TITLE          : "mdl-card__title",
  TITLE_TEXT     : "mdl-card__title-text",
  SUB_TITLE_TEXT : "mdl-card__subtitle-text",
  MEDIA          : "mdl-card__media",
  SUPPORT_TEXT   : "mdl-card__supporting-text",
  ACTIONS        : "mdl-card__actions"
}


Card.prototype.render = function(){



  return this;
};

module.exports = Card;