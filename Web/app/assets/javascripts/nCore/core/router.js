"use strict";

// роутер
/**
 * core module
 * @module nCore/router
 */

var nCore = nCore || {};
nCore.router = (function() {
  var routes = {},
      decode = decodeURIComponent;

  function noop(s) { return s; }

  function sanitize(url) {
    ~url.indexOf('/?') && (url = url.replace('/?', '?'));
    url[0] == '/' && (url = url.slice(1));
    url[url.length - 1] == '/' && (url = url.slice(0, -1));

    return url;
  }

  function processUrl(url, esc) {
    var pieces = url.split('/'),
        rules = routes,
        params = {};

    for (var i = 0; i < pieces.length && rules; ++i) {
      var piece = esc(pieces[i]);
      rules = rules[ piece.toLowerCase() ] || rules[':'];
      rules && rules['~'] && (params[rules['~']] = piece);
    }

    return rules && {
      callback: rules['@'],
      params: params
    };
  }

  function processQuery(url, ctx, esc) {
    if (url && ctx.callback) {
      var hash = url.indexOf('#'),
          query = (hash < 0 ? url : url.slice(0, hash)).split('&');

      for (var i = 0; i < query.length; ++i) {
        var nameValue = query[i].split('=');

        ctx.params[nameValue[0]] = esc(nameValue[1]);
      }
    }

    return ctx;
  }

  function lookup(url) {
    var querySplit = sanitize(url).split('?'),
        esc = ~url.indexOf('%') ? decode : noop;

    return processQuery(querySplit[1], processUrl(querySplit[0], esc) || {}, esc);
  }

  return {
    add: function(route, handler) {

      var pieces = route.split('/'),
          rules = routes;

      for (var i = 0; i < pieces.length; ++i) {
        var piece = pieces[i],
            name = piece[0] == ':' ? ':' : piece.toLowerCase();

        rules = rules[name] || (rules[name] = {});

        name == ':' && ( rules['~'] = piece.slice(1) );
      }

      rules['@'] = handler;
    },

    exists: function (url) {
      return !!lookup(url).callback;
    },

    lookup: lookup,

    run: function(url) {
      var result = lookup(url);

      result.callback && result.callback({
        url: url,
        params: result.params
      });

      return !!result.callback;
    },
    routes: routes
  };
})();

/*
 * Роутинг
 */

jQuery(function($) {
  var load = new Promise(function(resolve, reject){
    setTimeout(
      function(){
         /////////////////////////////
        // показываем по умолчанию //
        /////////////////////////////
        nCore.router.add('', function () {
          
          // nCore.document.event.publish( 'loadItem', [ 'documents', 'forms' ] );
          // nCore.document.event.publish( 'loadCriteria' );

          location.hash = '#/report';

          // var template = new nCore.templates.render({template:  "report/index" });
          // // document.title = 'INDEX';
          // template.render( function(data){ 
          //   if ( data ) {
          //     var wrapper = document.getElementById('content-wrapper');
          //     wrapper.innerHTML = data;
          //   };
            
          //   // рендерим превьюхи документа
          //   nCore.document.event.publish('attachListMenu');
          //   nCore.document.event.publish('renderIndexView');
          // });
        });

        ///////////////////
        // роуты отчетов //
        ///////////////////
        nCore.router.add('report', function (r) {
          // document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/index.css';
          // nCore.document.windowTitle('Главная'))

          // есть ли у юзера право просматривать таблицы
          nCore.document.loadIndex(['documents']);
          var template = new nCore.templates.render({template: "report/index" });

          if ( nCore.roles.check('viewTable') ) {
          template.render( function(data){ 
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              }
              nCore.document.windowTitle('Отчёт');
              nCore.document.event.publish('attachListMenu');
              nCore.document.event.publish('renderIndexView', 'documents');
            });
          } else {
            template.notPermit(function(data){
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              }
            });
          }
        });
        
        nCore.router.add('report/new', function (r) {
          nCore.document.windowTitle('Новый документ'); // document.title = 'report new'

          var template = new nCore.templates.render({template: "report/new" });

          // document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/index.css';

          template.render( function(data){ 
            if ( data ) {
              var wrapper = document.getElementById('content-wrapper');
              wrapper.innerHTML = data;
              nCore.document.event.publish('initEditor');
            };
          });
        });

        nCore.router.add('report/:id', function (r) {
          // document.title = 'reports/:id '+ r.params.id;
          var template = new nCore.templates.render({template: "report/new" });
          
          // document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/index.css';
          template.render( function(data){ 
            if ( data ) {
              var wrapper = document.getElementById('content-wrapper');
              wrapper.innerHTML = data;
              
              nCore.document.event.publish('loadDocument', r.params.id );
              // nCore.document.event.publish('initEditor');
            };
          });
        });

        //////////////
        // роуты БП //
        //////////////
        nCore.router.add('buiseness', function (r) {
          // есть ли у юзера право просматривать таблицы
          // document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/buiseness.css';
          var template = new nCore.templates.render({template: "report/index" });
          if ( nCore.roles.check('viewTable') ) {
            template.render( function(data){ 
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              };

              nCore.document.event.publish('renderIndexView', 'documents');
            });
          } else {
            template.notPermit(function(data){
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              }
            });
          }
        });
        
        nCore.router.add('buiseness/new', function (r) {
          // document.title = 'buiseness new';
          var template = new nCore.templates.render({template: "report/new" });
          // document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/buiseness.css';
          template.render( function(data){ 
            if ( data ) {
              var wrapper = document.getElementById('content-wrapper');
              wrapper.innerHTML = data;
              nCore.document.event.publish('initEditor');
            };
          });
        });

        nCore.router.add('buiseness/:name', function (r) {
          // document.title = 'buiseness/:name '+ r.params.name;
          var template = new nCore.templates.render({template: "report/index" });
          // document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/buiseness.css';
          template.render( function(data){ 
            if ( data ) {
              var wrapper = document.getElementById('content-wrapper');
              wrapper.innerHTML = data;
              nCore.document.event.publish('initEditor');
            };
          });
        });

        /////////////////////////
        // роуты печатных форм //
        /////////////////////////
        nCore.router.add('print', function (r) {
          // есть ли у юзера право просматривать таблицы
          var template = new nCore.templates.render({template: "report/index" });
          if ( nCore.roles.check('viewTable') ) {
            template.render( function(data){ 
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              };

              nCore.document.event.publish('renderIndexView', 'documents');
            });
          } else {
            template.notPermit(function(data){
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              }
            });
          }
        });
        
        nCore.router.add('print/new', function (r) {
          // document.title = 'print new';
          var template = new nCore.templates.render({template: "report/new" });

          template.render( function(data){ 
            if ( data ) {
              var wrapper = document.getElementById('content-wrapper');
              wrapper.innerHTML = data;
              nCore.document.event.publish('initEditor');
            };
          });
        });

        nCore.router.add('print/:name', function (r) {
          // document.title = 'print/:name '+ r.params.name;
          var template = new nCore.templates.render({template: "report/index" });

          template.render( function(data){ 
            if ( data ) {
              var wrapper = document.getElementById('content-wrapper');
              wrapper.innerHTML = data;
              nCore.document.event.publish('initEditor');
            };
          });
        });


        /////////////////////////
        // роуты экранных форм //
        /////////////////////////
        nCore.router.add('form', function (r) {
          // есть ли у юзера право просматривать таблицы
          var template = new nCore.templates.render({template: "form/index" });
          if ( nCore.roles.check('viewTable') ) {
            template.render( function(data){ 
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              };

              nCore.document.event.publish('renderIndexView', 'forms');
            });
          } else {
            template.notPermit(function(data){
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              }
            });
          }
        });
        
        nCore.router.add('form/new', function (r) {
          // document.title = 'form new';
          var template = new nCore.templates.render({template: "form/new" });

          template.render( function(data){ 
            if ( data ) {
              var wrapper = document.getElementById('content-wrapper');
              wrapper.innerHTML = data;
            };
          });
        });

        nCore.router.add('form/:name', function (r) {
          // document.title = 'form/:name '+ r.params.name;
          var template = new nCore.templates.render({template: "form/form" });

          template.render( function(data){ 
            if ( data ) {
              var wrapper = document.getElementById('content-wrapper');
              wrapper.innerHTML = data;
              nCore.document.event.publish('initEditor');
            };
          });
        });

        nCore.router.add('.*', function (r) {
          // document.title = 'form/:name '+ r.params.name;
          console.log('default', bad);
          // var template = new nCore.templates.render({template: "form/form" });

          // template.render( function(data){ 
          //   if ( data ) {
          //     var wrapper = document.getElementById('content-wrapper');
          //     wrapper.innerHTML = data;
          //     nCore.document.event.publish('initEditor');
          //   };
          // });
        });

        function processHash() {
          var hash  = location.hash || '#',
              route = hash.slice(1);

          if ( nCore.router.exists( route ) ) {
            // если роут есть
            nCore.router.run( route );
          } else {
            // если нет показываем пользователю х
            console.log('not exists');
            nCore.document.event.publish('routeFailedToLoad');
          }
        }

        window.addEventListener('hashchange', processHash);
        processHash();
        
      }, 100);
      // reject(false)
      resolve(true)
  });
  
  load.then(function(data){
    console.log('route initialized', data);
  }).catch(function(data){
    console.log('route initialized failed', data);
  })

});
// nCore.router.init()