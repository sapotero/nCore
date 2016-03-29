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
            if ( !sources.hasOwnProperty( query.source ) ) {
              sources[ query.source ] = {
                'and': [],
                'or':  []
              };
            }
            sources[ query.source ][ query.criteria_condition ].push( [query] );
          });
        }
      } catch(e){
        console.error('JSON PARSE FAILS', e);
      }

      if ( nCore.document.yearReport ) {
        global.yearReport = {
          main    : nCore.document.main,
          compare : nCore.document.compare
        };
      }
      
      global.periodStart      = nCore.document.periodStart;
      global.periodEnd        = nCore.document.periodEnd;
      global.providerId       = document.querySelector('#nCoreDocumentAuthor').dataset.providerId;
      global.reportId         = nCore.document.id;
      global.query            = sources;
      global.providerSelected = nCore.document.providerSelected;
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
    var item = document.querySelector('#'+this.item),
        root = this;

      var keys = {};

      // console.log( 'KEYS', keys );

      var _raw_query = JSON.parse( item.dataset.query );
      // console.log( '_raw_query' );

      _raw_query.forEach( function( query, i ,queriesArray ){
        try{
          var cellQuery = query.query;

          // console.log( 'query', query, cellQuery );
          var conditions = query.conditions;

          if ( cellQuery.length ) {

            var tmp = {};
            for (var g = 0; g < cellQuery.length; g++) {
              var query = cellQuery[g];

              // console.log('queries', query);
              // console.log('_sources', sources);


              // queries.query.forEach( function( query, i, queryArray ){
                
              if ( !tmp.hasOwnProperty( query.source ) ) {
                tmp[ query.source ] = {
                  'and': [],
                  'or':  []
                };
              }
              tmp[ query.source ][ conditions ].push( query );
              
              // });a
            }
            // console.log( 'TMP:', tmp );

            for( var tmp_key in tmp ){
              var tmp_source = tmp_key;

              if ( !keys.hasOwnProperty( tmp_source ) ) {
                keys[ tmp_source ] = {
                  'and': [],
                  'or':  []
                };
              }

              // console.log( 'tmp_key', tmp_key, keys[tmp_source] );

              var tmp_and = tmp[tmp_key].and;
              var tmp_or  = tmp[tmp_key].or;

              if ( tmp_and.length ) {
                keys[tmp_source].and.push( tmp[tmp_key].and );
              }
              if ( tmp_or.length ) {
                keys[tmp_source].or.push( tmp[tmp_key].or );
              }
            };
          }
        } catch(e){
          console.error('JSON PARSE FAILS', e);
        }
      });
      root.query = keys;

    return this;
  };
  Formatter.prototype.tableCellCalculate = function( from ){
    var item = this.item,
        root = this;

    var keys = {};

    if ( item.hasOwnProperty('query') && item.query.hasOwnProperty(from) ) {
      // console.log('item.query[ from ]', item.query[ from ]);
      var sources = {};

      item.query[ from ].forEach( function( query, i ,array ){
        try{
          var cellQuery = JSON.parse(query);
          if ( cellQuery.length ) {

            cellQuery.forEach( function( queries, i, queriesArray ){
              
              // console.log('from', from);
              // console.log('_sources', sources);

              var conditions = queries.conditions;
              var tmp = {};
              queries.query.forEach( function( query, i, queryArray ){
                
                if ( !tmp.hasOwnProperty( query.source ) ) {
                  tmp[ query.source ] = {
                    'and': [],
                    'or':  []
                  };
                }
                tmp[ query.source ][ conditions ].push( query );

              });

              for( var tmp_key in tmp ){
                var tmp_source = tmp_key;

                if ( !keys.hasOwnProperty( tmp_source ) ) {
                  keys[ tmp_source ] = {
                    'and': [],
                    'or':  []
                  };
                }

                // console.log( 'tmp_key', tmp_key, keys[tmp_source] );

                var tmp_and = tmp[tmp_key].and;
                var tmp_or  = tmp[tmp_key].or;

                if ( tmp_and.length ) {
                  keys[tmp_source].and.push( tmp[tmp_key].and );
                }
                if ( tmp_or.length ) {
                  keys[tmp_source].or.push( tmp[tmp_key].or );
                }
              }

            });
          }
        root[ from ] = keys;
        } catch(e){
          console.error('JSON PARSE FAILS', e);
        }
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