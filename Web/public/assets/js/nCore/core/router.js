"use strict";

// роутер
/**
 * core module
 * @module nCore/router
 */

var nCore = nCore || {};
nCore.router = (function(){

    var routes = {},
        decode = decodeURIComponent;
  
    function noop(s) {

      return s;
    }
    function sanitize(url) {
      ~url.indexOf('/?') && (url = url.replace('/?', '?'));
      url[0] == '/' && (url = url.slice(1));
      url[url.length - 1] == '/' && (url = url.slice(0, -1));
  
      return url;
    }
    function processUrl(url, esc) {
      var pieces = url.split('/'),
          rules  = routes,
          params = {};
  
      for (var i = 0; i < pieces.length && rules; ++i) {
        var piece = esc(pieces[i]);
        rules = rules[piece.toLowerCase()] || rules[':'];
        rules && rules['~'] && (params[rules['~']] = piece);
      }
  
      return rules && {
        callback: rules['@'],
        params: params
      };
    }
    function processQuery(url, context, esc) {
      if (url && context.callback) {
        var hash = url.indexOf('#'),
            query = (hash < 0 ? url : url.slice(0, hash)).split('&');
  
        for (var i = 0; i < query.length; ++i) {
          var nameValue = query[i].split('=');
  
          context.params[nameValue[0]] = esc(nameValue[1]);
        }
      }
  
      return context;
    }
    function lookup(url) {
      var querySplit = sanitize(url).split('?'),
          esc = ~url.indexOf('%') ? decode : noop;
  
      return processQuery( querySplit[1], processUrl( querySplit[0], esc ) || {}, esc );
    }
  
    return {
      add: function(route, handler) {
        var pieces = route.toLowerCase().split('/'),
            rules  = routes;
  
        for (var i = 0; i < pieces.length; ++i) {
          var piece = pieces[i],
              name = piece[0] == ':' ? ':' : piece;
  
          rules = rules[name] || (rules[name] = {});
  
          name == ':' && (rules['~'] = piece.slice(1));
        }
  
        rules['@'] = handler;
       },
      exists: function (url) {

        return !!lookup(url).callback;
       },
      lookup: lookup,
      run: function(url) {
        var result = lookup(url);

        // // хак для медленного соединения
        // var _i = setInterval(function(){
        //   if ( nCore.document.hasOwnProperty('root') ) {
        //     nCore.document.init();
        //     clearInterval(_i);
        //   };
        // }, 5);
  
        result.callback && result.callback({
          url    : url,
          params : result.params,
          data   : nCore.document.root.publish('onRouteChange', { url: url, params: result.params } )
        });
  
        return !!result.callback;
       },
      init: function(){},
      
      ///////////////
      // test only //
      ///////////////
      routes : routes
    };
})();

/*
 * Роутинг
 */

jQuery(function($) {
  setTimeout(function(){
     /////////////////////////////
  // показываем по умолчанию //
  /////////////////////////////
  nCore.router.add('', function () {
    var preloadItems = [ 'documents', 'forms' ];
    
    nCore.document.root.publish( 'loadItem', [ 'documents', 'forms' ] );
    nCore.document.root.publish( 'loadCriteria' );

    location.hash = '#/report'

    // document.title = 'INDEX';
    // nCore.templates.render('report/index', function(data){ 
    //   if ( data ) {
    //     var wrapper = document.getElementById('content-wrapper');
    //     wrapper.innerHTML = data;
    //   };
      
    //   // рендерим превьюхи документа
    //   nCore.document.root.publish('attachListMenu');
    //   nCore.document.root.publish('renderIndexView');
    // });
  });

  ///////////////////
  // роуты отчетов //
  ///////////////////
  nCore.router.add('report', function (r) {
    nCore.document.root.publish( 'loadItem', [ 'documents', 'forms' ] );
    nCore.document.root.publish( 'loadCriteria' );
          
    // есть ли у юзера право просматривать таблицы
    if ( nCore.roles.check('viewTable') ) {
      nCore.templates.render('report/index', function(data){ 
        if ( data ) {

          var wrapper = document.getElementById('content-wrapper');
          wrapper.innerHTML = data;
        };
        nCore.document.setTitle( 'Отчёт' );
        nCore.document.root.publish('attachListMenu');
        nCore.document.root.publish('renderIndexView', 'documents');
      });
    } else {
      nCore.templates.notPermit();
    }
  });
  
  nCore.router.add('report/new', function (r) {
    document.title = 'report new';

    nCore.templates.render('report/new', function(data){ 
      if ( data ) {
        var wrapper = document.getElementById('content-wrapper');
        wrapper.innerHTML = data;
        nCore.document.root.publish('initEditor');
        nCore.document.reset();
      };
    });
  });

  nCore.router.add('report/:id', function (r) {
    document.title = 'reports/:id '+ r.params.id;

    nCore.templates.render('report/new', function(data){ 
      if ( data ) {
        var wrapper = document.getElementById('content-wrapper');
        wrapper.innerHTML = data;
        
        nCore.document.root.publish('initEditor');
        nCore.document.root.publish('loadDocument', r.params.id );
      };
    });
  });

  //////////////
  // роуты БП //
  //////////////
  nCore.router.add('buiseness', function (r) {
    // есть ли у юзера право просматривать таблицы
    if ( nCore.roles.check('viewTable') ) {
      nCore.templates.render('table/index', function(data){ 
        if ( data ) {
          var wrapper = document.getElementById('content-wrapper');
          wrapper.innerHTML = data;
        };

        nCore.document.root.publish('renderIndexView', 'documents');
      });
    } else {
      nCore.templates.notPermit();
    }
  });
  
  nCore.router.add('buiseness/new', function (r) {
    document.title = 'buiseness new';

    nCore.templates.render('table/new', function(data){ 
      if ( data ) {
        var wrapper = document.getElementById('content-wrapper');
        wrapper.innerHTML = data;
        nCore.document.root.publish('initEditor');
      };
    });
  });

  nCore.router.add('buiseness/:name', function (r) {
    document.title = 'buiseness/:name '+ r.params.name;

    nCore.templates.render('table/table', function(data){ 
      if ( data ) {
        var wrapper = document.getElementById('content-wrapper');
        wrapper.innerHTML = data;
        nCore.document.root.publish('initEditor');
      };
    });
  });

  /////////////////////////
  // роуты печатных форм //
  /////////////////////////
  nCore.router.add('print', function (r) {
    // есть ли у юзера право просматривать таблицы
    if ( nCore.roles.check('viewTable') ) {
      nCore.templates.render('table/index', function(data){ 
        if ( data ) {
          var wrapper = document.getElementById('content-wrapper');
          wrapper.innerHTML = data;
        };

        nCore.document.root.publish('renderIndexView', 'documents');
      });
    } else {
      nCore.templates.notPermit();
    }
  });
  
  nCore.router.add('print/new', function (r) {
    document.title = 'print new';

    nCore.templates.render('table/new', function(data){ 
      if ( data ) {
        var wrapper = document.getElementById('content-wrapper');
        wrapper.innerHTML = data;
        nCore.document.root.publish('initEditor');
      };
    });
  });

  nCore.router.add('print/:name', function (r) {
    document.title = 'print/:name '+ r.params.name;

    nCore.templates.render('table/table', function(data){ 
      if ( data ) {
        var wrapper = document.getElementById('content-wrapper');
        wrapper.innerHTML = data;
        nCore.document.root.publish('initEditor');
      };
    });
  });


  /////////////////////////
  // роуты экранных форм //
  /////////////////////////
  nCore.router.add('form', function (r) {
    // есть ли у юзера право просматривать таблицы
    if ( nCore.roles.check('viewTable') ) {
      nCore.templates.render('form/index', function(data){ 
        if ( data ) {
          var wrapper = document.getElementById('content-wrapper');
          wrapper.innerHTML = data;
        };

        nCore.document.root.publish('renderIndexView', 'forms');
      });
    } else {
      nCore.templates.notPermit();
    }
  });
  
  nCore.router.add('form/new', function (r) {
    document.title = 'form new';

    nCore.templates.render('form/new', function(data){ 
      if ( data ) {
        var wrapper = document.getElementById('content-wrapper');
        wrapper.innerHTML = data;
      };
    });
  });

  nCore.router.add('form/:name', function (r) {
    document.title = 'form/:name '+ r.params.name;

    nCore.templates.render('form/form', function(data){ 
      if ( data ) {
        var wrapper = document.getElementById('content-wrapper');
        wrapper.innerHTML = data;
        nCore.document.root.publish('initEditor');
      };
    });
  });

  function processHash() {
    var hash = location.hash || '#';
    nCore.router.run(hash.slice(1));
  }

  window.addEventListener('hashchange', processHash);
  processHash();
}, 100);

});