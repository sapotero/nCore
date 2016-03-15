"use strict";

// роутер
/**
 * core module
 * @module nCore/router
 */

var nCore = nCore || {};
nCore.router =(function() {
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
      rules = rules[piece.toLowerCase()] || rules[':'];
      rules && rules['~'] && (params[rules['~']] = piece);
    }

    return rules && {
      cb: rules['@'],
      params: params
    };
  }

  function processQuery(url, ctx, esc) {
    if (url && ctx.cb) {
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

        name == ':' && (rules['~'] = piece.slice(1));
      }

      rules['@'] = handler;
    },

    exists: function (url) {
      return !!lookup(url).cb;
    },

    lookup: lookup,

    run: function(url) {
      var result = lookup(url);

      result.cb && result.cb({
        url: url,
        params: result.params
      });

      return !!result.cb;
    }
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
          
          // nCore.document.root.publish( 'loadItem', [ 'documents', 'forms' ] );
          // nCore.document.root.publish( 'loadCriteria' );

          location.hash = '#/report';

          // var template = new nCore.templates.render({template:  "report/index" });
          // // document.title = 'INDEX';
          // template.render( function(data){ 
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
          document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/index.css';

          nCore.document.root.publish( 'loadItem', [ 'documents' ] );
          nCore.document.root.publish( 'loadCriteria' );
          
          // nCore.document.setTitle('Главная');

          // есть ли у юзера право просматривать таблицы
          var template = new nCore.templates.render({template: "report/index" });
          var roles    = new nCore.roles.new();

          if ( roles.check('viewTable') ) {
          template.render( function(data){ 
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              }
              nCore.document.setTitle( 'Отчёт' );
              nCore.document.root.publish('attachListMenu');
              nCore.document.root.publish('renderIndexView', 'documents');
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
          nCore.document.setTitle('Новый документ'); // document.title = 'report new';
          var template = new nCore.templates.render({template: "report/new" });
          document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/index.css';
          template.render( function(data){ 
            if ( data ) {
              var wrapper = document.getElementById('content-wrapper');
              wrapper.innerHTML = data;
              nCore.document.root.publish('initEditor');
              nCore.document.reset();
            };
          });
        });

        nCore.router.add('report/:id', function (r) {
          // document.title = 'reports/:id '+ r.params.id;
          var template = new nCore.templates.render({template: "report/new" });
          document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/index.css';
          template.render( function(data){ 
            if ( data ) {
              var wrapper = document.getElementById('content-wrapper');
              wrapper.innerHTML = data;
              
              nCore.document.root.publish('loadDocument', r.params.id );
              // nCore.document.root.publish('initEditor');
            };
          });
        });

        //////////////
        // роуты БП //
        //////////////
        nCore.router.add('buiseness', function (r) {
          // есть ли у юзера право просматривать таблицы
          document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/buiseness.css';
          var template = new nCore.templates.render({template: "report/index" });
          var roles    = new nCore.roles.new();
          if ( roles.check('viewTable') ) {
            template.render( function(data){ 
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              };

              nCore.document.root.publish('renderIndexView', 'documents');
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
          document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/buiseness.css';
          template.render( function(data){ 
            if ( data ) {
              var wrapper = document.getElementById('content-wrapper');
              wrapper.innerHTML = data;
              nCore.document.root.publish('initEditor');
            };
          });
        });

        nCore.router.add('buiseness/:name', function (r) {
          // document.title = 'buiseness/:name '+ r.params.name;
          var template = new nCore.templates.render({template: "report/index" });
          document.querySelector("#nCoreThemeRoller").href = 'assets/css/style/buiseness.css';
          template.render( function(data){ 
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
          var template = new nCore.templates.render({template: "report/index" });
          var roles    = new nCore.roles.new();
          if ( roles.check('viewTable') ) {
            template.render( function(data){ 
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              };

              nCore.document.root.publish('renderIndexView', 'documents');
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
              nCore.document.root.publish('initEditor');
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
              nCore.document.root.publish('initEditor');
            };
          });
        });


        /////////////////////////
        // роуты экранных форм //
        /////////////////////////
        nCore.router.add('form', function (r) {
          // есть ли у юзера право просматривать таблицы
          var template = new nCore.templates.render({template: "form/index" });
          var roles    = new nCore.roles.new();
          if ( roles.check('viewTable') ) {
            template.render( function(data){ 
              if ( data ) {
                var wrapper = document.getElementById('content-wrapper');
                wrapper.innerHTML = data;
              };

              nCore.document.root.publish('renderIndexView', 'forms');
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
              nCore.document.root.publish('initEditor');
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
          //     nCore.document.root.publish('initEditor');
          //   };
          // });
        });

        function processHash() {
          var hash = location.hash || '#';

          if ( nCore.router.exists( hash.slice(1) ) ) {
            // если роут есть
            nCore.router.run( hash.slice(1) );
          } else {
            // если нет показываем пользователю х
            console.log('not exists');
            nCore.document.root.publish('routeFailedToLoad');
          }
        }

        window.addEventListener('hashchange', processHash);
        processHash();
        
      }, 10);
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