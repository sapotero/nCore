var Table = function Table( config ) {
  this._config = config;

  this.element = document.createElement('table');
  this.element.classList.add( this.CSS.TABLE );
  this.element.classList.add( this.CSS.TABLE_JS );

  this.headRoot = document.createElement('thead');
  this.head = document.createElement('tr');
  this.headRoot.appendChild( this.head );

  this.body = document.createElement('tbody');

  this.element.appendChild( this.headRoot );
  this.element.appendChild( this.body );

  this.element._config = config;

  this.populate();
  this.render();
}
Table.prototype = Object.create( require('./simple').prototype );
Table.prototype.constructor = Table;

Table.prototype.setSelectable = function(){
  this.element.classList.add( this.CSS.SELECTABLE );
}

Table.prototype.setAsc = function(){
  this.head.classList.add( this.CSS.SORT_ASC );
}
Table.prototype.setDesc = function(){
  this.head.classList.add( this.CSS.SORT_DESC );
}
Table.prototype.setHead = function(){
  if ( this._config.hasOwnProperty('head') && this._config.head.constructor === Array ) {
    var df = document.createDocumentFragment();

    for (var i = 0; i < this._config.head.length; i++) {
      var cell = this._config.head[i];
      
      if ( cell.hasOwnProperty('element') ) {
        df.appendChild( cell.element );
      } else {
        var td = document.createElement('th');
        td.classList.add( this.CSS.STRING );
        td.textContent = cell;
        df.appendChild( td );
      }
    }
    this.head.appendChild( df );
  }
}
Table.prototype.setBody = function(){
  if ( this._config.hasOwnProperty('body') && this._config.body.constructor === Array ) {
    var df = document.createDocumentFragment();

    for (var i = 0; i < this._config.body.length; i++) {
      var _item = this._config.body[i];
      var tr = document.createElement('tr');

      for (var z = 0; z < _item.length; z++) {
        var cell = _item[z];
        if ( cell.hasOwnProperty('element') ) {
          tr.appendChild( cell.element );
        } else {
          var td = document.createElement('td');
          td.classList.add( this.CSS.STRING );
          td.textContent = cell;
          tr.appendChild( td );
        }
      }

      df.appendChild( tr );
    }

    this.body.appendChild( df );
  }
}

Table.prototype.render = function(){
  
  if ( this._config.hasOwnProperty('head') ) {
    this.setHead( this._config.head );
  };

  if ( this._config.hasOwnProperty('body') ) {
    this.setBody( this._config.body );
  };

  if ( this._config.hasOwnProperty('selectable') ) {
    this.setSelectable( this._config.selectable );
  };
  if ( this._config.hasOwnProperty('asc') ) {
    this.setAsc( this._config.asc );
  };
  if ( this._config.hasOwnProperty('desc') ) {
    this.setDesc( this._config.desc );
  };

  return this;
}

Table.prototype.CSS = {
  TABLE      : 'mdl-data-table',
  TABLE_JS   : 'mdl-js-data-table',
  SELECTABLE : 'mdl-data-table--selectable',
  SORT_ASC   : 'mdl-data-table__header--sorted-ascending',
  SORT_DESC  : 'mdl-data-table__header--sorted-descending',
  STRING     : 'mdl-data-table__cell--non-numeric',
}
module.exports = Table;