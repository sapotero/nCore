"use strict";
// написан 16 марта после первого запуска в бою
// новый форматер для дениски
// p.s. денис решил уволится

/**
 * core module
 * @module nCore/roles
 */

var nCore = nCore || {};
nCore.format = (function(){
  var Formatter = function Formatter(item){
    if ( !arguments.length ) {
      item = {};
    }
    this.item   = item;

    this.global = {};
    this.head   = {};
    this.side   = {};
    this.flags  = {};
    this.query  = {};
  };
  Formatter.prototype.clear = function(){
    this.global = {};
    this.head   = {};
    this.side   = {};
    this.flags  = {};
  };
  Formatter.prototype.calculateGlobal = function(){
    var globalArray = JSON.parse( nCore.document.globalQuery ),
        global = this.global;

    globalArray.forEach( function( query, i, array ){
      var sources = {};
      try{
        if ( query.query.length ) {
          query.query.forEach( function( query, i, queryArray ){
            var conditions = 'and';
            if ( !sources.hasOwnProperty( query.source ) ) {
              sources[ query.source ] = {
                'and': [],
                'or':  []
              };
            }


            sources[ query.source ][ conditions ].push( [query] );
          });
        }
      } catch(e){
        console.error('JSON PARSE FAILS', e);
      }

      if ( nCore.document.yearReport ) {
        global.yearReport = {
          main    : nCore.document.main,
          compare : nCore.document.compare
        }
      }
      
      global.periodStart = nCore.document.periodStart;
      global.periodEnd   = nCore.document.periodEnd;
      global.providerId  = document.querySelector('#nCoreDocumentAuthor').dataset.providerId;
      global.reportId    = nCore.document.id;
      global.query       = sources;
    });

    return this;
  };
  Formatter.prototype.calculateFlags = function(){
    var dup = Object.assign( {}, this.item );

    delete dup.query;
    delete dup.data;

    this.flags = dup;
  };
  Formatter.prototype.customCellCalculate = function(){
    var item = this.item,
        root = this;

    if ( item.data.hasOwnProperty( 'query' ) ){
      var sources = {};
      JSON.parse( item.data.query ).forEach( function( rootQuery, i ,rootArray ){
        try{
          var cellQuery  = rootQuery.query;
          var conditions = rootQuery.conditions;
          if ( cellQuery.length ) {
            cellQuery.forEach( function( query, i, queriesArray ){
              if ( !sources.hasOwnProperty( query.source ) ) {
                sources[ query.source ] = {
                  'and': [],
                  'or':  []
                };
              }
              // проверяем, есть ли такой хеш
              if ( !sources[ query.source ][ conditions ].some(elem => elem == queriesArray ) ){
                sources[ query.source ][ conditions ].push( queriesArray );
              }
            });
          }
          // console.warn('FINAL', sources);
        } catch(e){
          console.error('JSON PARSE FAILS', new Error(e) );
        }
        root.query = sources;
      });
    }
    return this;
  };
  Formatter.prototype.tableCellCalculate = function( from ){
    var item = this.item,
        root = this;

    if ( item.hasOwnProperty('query') && item.query.hasOwnProperty(from) ) {
      item.query[ from ].forEach( function( query, i ,array ){
        var sources = {};
        try{
          var cellQuery = JSON.parse(query);
          if ( cellQuery.length ) {
              var _sources = {};
           cellQuery.forEach( function( queries, i ,queriesArray ){

              var conditions = queries.conditions;
              queries.query.forEach( function( query, i ,queryArray ){
                if ( !sources.hasOwnProperty( query.source ) ) {
                sources[ query.source ] = {
                  'and': [],
                  'or':  []
                  };
                }

                if ( !sources[ query.source ][ conditions ].some(elem => elem == query ) ){
                  sources[ query.source ][ conditions ].push( query );
                }

                if ( !_sources.hasOwnProperty( query.source ) ) {
                  _sources[ query.source ] = {};
                  if ( !_sources[ query.source ].hasOwnProperty( conditions ) ) {
                  _sources[ query.source ] = {
                    'and': [],
                    'or':  []
                    };
                  }

                  for (var b = 0; b < queriesArray.length; b++) {
                    // console.log(queriesArray[b]);
                    var q = [];
                    for (var i = 0; i < queriesArray[b].query.length; i++) {
                      // console.log('cmp++', queriesArray[b].query[i], query.source);

                      if (queriesArray[b].query[i].source === query.source){
                        q.push(queriesArray[b].query[i]);

                        
                      }
                    }
                    _sources[ query.source ][ queriesArray[b].conditions ].push( q );
                  }
                }
              });

            });
            // console.log( '_sources ->', _sources );
          }
        } catch(e){
          console.error('JSON PARSE FAILS', e);
        }
        root[ from ] = _sources;
      });
    }
    return this;
  };
  Formatter.prototype.resultTable = function(){
    return {
      global : this.global,
      head   : this.head,
      side   : this.side,
      flags  : this.flags
    };
  };
  Formatter.prototype.resultCustom = function(){
    return {
      global : this.global,
      query  : this.query,
      flags  : this.flags
    };
  };
  Formatter.prototype.table = function(){
    this.tableCellCalculate('head');
    this.tableCellCalculate('side');
    this.calculateFlags();
    this.calculateGlobal();
    return this.resultTable();
  };
  Formatter.prototype.custom = function(){
    this.customCellCalculate();
    this.calculateFlags();
    this.calculateGlobal();
    return this.resultCustom();
  };
  return {
    convert: Formatter
  };
})();