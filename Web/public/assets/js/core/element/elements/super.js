var Super = function Super( config ) {}

Super.prototype.setName = function( data ){
  // console.log( 'Super.setName' );
  this.element.name = data;
};
Super.prototype.setValue = function( data ){
  // console.log( 'Super.setValue' );
  this.element.value = data;
};
Super.prototype.setClass = function( data ){
  this.element.className = data;
};

module.exports = Super;