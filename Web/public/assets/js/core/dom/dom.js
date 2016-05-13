'use strict';

var Dom = function () {
  this.root         = document;
  this.application  = {};
  this.editor       = {};
  this.snackbar     = {};
  this.splashscreen = {};

  this.bindEvents();
};

Dom.prototype.bindEvents = function () {
  var dom = this;

  document.addEventListener('DOMContentLoaded', function () {
    
    core.events.subscribe('core:start:all', function () {
      console.log('core  > dom > bindEvents > core:start:all');
      manager.start();
    }, { priority: 0 });

    core.events.subscribe('core:dom:updateApplication', function (application) {
      dom.root.body.appendChild(application);
    }, { priority: 0 });

    core.events.subscribe('core:dom:application:clear', function () {
      dom.leftPanel.innerHTML = '';
      dom.content.innerHTML   = '';
      dom.infoPanel.innerHTML = '';
    });

    core.events.subscribe('core:dom:infoPanel:clear', function () {
      dom.infoPanel.innerHTML = '';
    });

    core.events.subscribe('core:dom:infoPanel:hide', function () {
      dom.hideInfoPanel();
    });

    core.events.subscribe('core:dom:infoPanel:show', function () {
      dom.showInfoPanel();
    });

    core.events.subscribe('core:dom:infoPanel:set', function ( html ) {
      dom.infoPanel.appendChild( html );
    });

    core.events.subscribe('core:dom:content:set', function ( html ) {
      dom.content.appendChild( html );
    });

    core.events.subscribe('core:dom:leftPanel:clear', function () {
      dom.leftPanel.innerHTML = '';
    });

    core.events.subscribe('core:dom:leftPanel:hide', function () {
      dom.hideleftPanel();
    });

    core.events.subscribe('core:dom:leftPanel:show', function () {
      dom.showleftPanel();
    });

    core.events.subscribe('core:dom:leftPanel:set', function ( html ) {
      dom.leftPanel.appendChild( html );
    });


    core.events.subscribe('core:dom:material:update', function () {
      componentHandler.upgradeAllRegistered();
    });


    core.events.publish( "core:dom:clear" );

    core.events.subscribe('core:dom:build:application', function () {
      console.log('Dom <- core:dom:build:application');
      dom.build();
    });

    core.events.subscribe('core:dom:application:show', function () {
      console.log( ' Dom <- core:dom:application:show' );
      // core.dom.application.application.showCards();
    });

    core.events.subscribe('core:dom:application:hide', function () {
      console.log( ' Dom <- core:dom:application:hide' );
      // core.dom.application.application.hideCards();
    });

    core.events.subscribe('core:dom:attach:progressbar', function () {
      console.log( '* Dom <- core:dom:attach:progressbar' );
      dom.splashscreen.style.display = 'block';
    });

    core.events.subscribe('core:dom:remove:progressbar', function () {
      console.log( '* Dom <- core:dom:remove:progressbar' );
      // dom.splashscreen.classList.add('fadeOut');
      // dom.application.classList.add('fadeIn');
      
      setTimeout( function () {
        dom.splashscreen.style.display = 'none';
        dom.application.style.display  = 'block';
        core.events.publish("core:router:update");
      }, 500);

    });

    core.events.subscribe('core:dom:editor:show', function () {
      console.log( ' Dom <- core:dom:editor:show' );
      // core.dom.editor.style.zIndex = 1;
      // core.dom.editor.classList.add('fadeIn');
      // core.dom.editor.classList.remove('fadeOut');
      // core.dom.editor.classList.remove('hide');
    });
    core.events.subscribe('core:dom:editor:hide', function () {
      console.log( ' Dom <- core:dom:editor:hide' );
      // core.dom.editor.style.zIndex = 0;
      // core.dom.editor.classList.remove('fadeIn');
      // core.dom.editor.classList.add('fadeOut');
      // core.dom.editor.classList.add('hide');
    });

    core.events.subscribe('core:dom:set:title', function (title) {
      console.log( ' Dom <- core:dom:set:title' );
      // core.dom.application.application.setAttribute('caption', title);
    });

    core.events.subscribe('core:dom:splashscreen:progress:set', function (percent) {
      console.log( ' Dom <- core:dom:splashscreen:progress:set', percent );
      try {
        dom.progressbar.MaterialProgress.setProgress(percent);
      } catch(e) {
        console.log(e);
      }
    });


  }, false);
};

Dom.prototype.build = function () {
  console.log('Dom :: build application');
  // this.editor = document.querySelector('#editor');

  // Прелоадер
  this.createProgressBar();
  
  // Инициализация прилодульки
  this.createApplication();

  // Главное меню
  this.createHeader();

  // Боковое меню
  this.createDrawer();

  // Сама приложулька
  this.createApplicationContent();

  setTimeout( core.events.publish('core:dom:build:ready') ,1000);
};



/* Application */
Dom.prototype.createApplication = function(argument){
  this.application  = document.createElement('div');
  this.application.className = "mdl-layout mdl-js-layout mdl-layout--fixed-header animated";
  this.application.style.display = 'none'
};

Dom.prototype.createApplicationContent = function(argument){

  this.main = document.createElement('main');
  this.main.className = "mdl-layout__content core-layout-offset";
  this.application.appendChild( this.main );

  var content = document.createElement('div');
  content.className = "page-content";
  this.main.appendChild( content );

  this.grid = document.createElement('div');
  this.grid.className = "mdl-grid";
  content.appendChild( this.grid );

  this.leftPanel = document.createElement('div');
  this.leftPanel.className = "mdl-cell mdl-cell--2-col page-content-panel-animation content-leftPanel";
  this.grid.appendChild( this.leftPanel );

  this.content = document.createElement('div');
  this.content.className = "mdl-cell mdl-cell--8-col page-content-panel-animation content-content";
  this.grid.appendChild( this.content );

  this.infoPanel = document.createElement('div');
  this.infoPanel.className = "mdl-cell mdl-cell--2-col page-content-panel-animation content-infoPanel";
  this.grid.appendChild( this.infoPanel );

  document.body.appendChild( this.application );
};

/* ProgressBar */
Dom.prototype.createProgressBar = function(argument){
  this.splashscreen = document.createElement('div');
  this.splashscreen.classList.add("mdl-grid");
  this.splashscreen.classList.add("animated");
  this.splashscreen.classList.add("core-splashscreen-fixed");

  this.logo = document.createElement('div');
  this.logo.classList.add("mdl-typography--text-center");
  this.logo.classList.add("mdl-cell");
  this.logo.classList.add("mdl-cell--12-col");
  this.logo.classList.add("mdl-cell--bottom");
  this.logo.innerHTML = '<i class="material-icons">work</i>';
  
  this.progressbar = document.createElement('div');
  this.progressbar.classList.add("mdl-cell");
  this.progressbar.classList.add("mdl-cell--12-col-phone");
  this.progressbar.classList.add("mdl-cell--6-col-desktop");
  this.progressbar.classList.add("mdl-cell--3-offset-desktop");
  this.progressbar.classList.add("mdl-progress");
  this.progressbar.classList.add("mdl-js-progress");
  
  this.splashscreen.appendChild( this.logo );
  this.splashscreen.appendChild( this.progressbar );
  this.splashscreen.style.display = 'none';
  document.body.appendChild( this.splashscreen );
};


/* MainMenu */
Dom.prototype.createHeader = function(argument){
  
  this.header = document.createElement('header');
  this.header.className = "mdl-layout__header core-fixed";
  this.application.appendChild( this.header );

  var header = document.createElement('div');
  header.className = "mdl-layout__header-row";
  this.header.appendChild( header );

  this.title = document.createElement('span');
  this.title.className = "mdl-layout-title";
  header.appendChild( this.title );
  this.setTitle( 'App title' );

  var spacer = document.createElement('div');
  spacer.className = "mdl-layout-spacer";
  header.appendChild( spacer );

  this.navigation = document.createElement('nav');
  this.navigation.className = "mdl-navigation mdl-layout--large-screen-only";
  header.appendChild( this.navigation );

  this.addToMainMenuNavigation( 'test', 'link_test' );
  this.addToMainMenuNavigation( 'test_callback', 'test_callback', function(e){ 
    e.preventDefault();
    // console.log('test_callback',e, this);
    this.toggleInfoPanel();
  });
};

Dom.prototype.setTitle = function ( title ) {
  if ( !title ) {
    throw new Error('setTitle -> can`t set title')
  }
  this.title.textContent = title;
};

Dom.prototype.addToMainMenuNavigation = function ( href, name, callback ) {
  if ( !name ) {
    throw new Error('addToDrawerNavigation -> can`t create link without name')
  }

  if ( !href ) {
    throw new Error('addToDrawerNavigation -> can`t create link without href')
  }

  
  var item = document.createElement('a');
  item.className = "mdl-navigation__link";
  item.textContent = name;
  item.href = [ '#', href ].join('');
  item.id   = [ 'navigation', href ].join('_');
  
  this.navigation.appendChild( item );
  
  if ( typeof callback === 'function' ) {
    item.addEventListener( 'click', callback.bind(this) );
  }
};


/* DRAWER */
Dom.prototype.createDrawer = function(argument){
  // <div class="mdl-layout__drawer">
  //   <span class="mdl-layout-title">Title</span>
  //   <nav class="mdl-navigation">
  //     <a class="mdl-navigation__link" href="#reports"  >   Отчёты </a>
  //     <a class="mdl-navigation__link" href="#bps">         Бизнес-процессы </a>
  //     <a class="mdl-navigation__link" href="#web-forms">   Экранные формы </a>
  //     <a class="mdl-navigation__link" href="#print-forms"> Печатные формы </a>
  //   </nav>
  // </div>
  // 
  var drawer = document.createElement('div');
  drawer.className = "mdl-layout__drawer";
  this.application.appendChild( drawer );

  this.drawerTitle = document.createElement('span');
  this.drawerTitle.className = "mdl-layout-title";
  drawer.appendChild( this.drawerTitle );
  this.setDrawerTitle('App title');

  this.drawerNavigation = document.createElement('nav');
  this.drawerNavigation.className = "mdl-navigation";
  drawer.appendChild( this.drawerNavigation );
  this.addToDrawerNavigation( 'reports'     , 'Отчёты' );
  this.addToDrawerNavigation( 'bps'         , 'Бизнес-процессы' );
  this.addToDrawerNavigation( 'web-forms'   , 'Экранные формы' );
  this.addToDrawerNavigation( 'print-forms' , 'Печатные формы' );
};

Dom.prototype.setDrawerTitle = function ( title ) {
  if ( !title ) {
    throw new Error('setDrawerTitle -> can`t set title')
  }
  this.drawerTitle.textContent = title;
};

Dom.prototype.addToDrawerNavigation = function ( href, name ) {
  if ( !name ) {
    throw new Error('addToDrawerNavigation -> can`t create link without name')
  }

  if ( !href ) {
    throw new Error('addToDrawerNavigation -> can`t create link without href')
  }
  
  var item = document.createElement('a');
  item.className = "mdl-navigation__link";
  item.textContent = name;
  item.href = [ '#', href ].join('');
  item.id   = [ 'drawer', href ].join('_');
  
  this.drawerNavigation.appendChild( item );

  item.addEventListener( 'click', function(e) {
     core.dom.application.MaterialLayout.toggleDrawer();
  } )
  // core.dom.application.MaterialLayout.toggleDrawer()
};

/* INFO PANEL */
Dom.prototype.toggleInfoPanel = function(){
  console.log('DOM: toggleInfoPanel');
  this.content.classList.toggle('mdl-cell--10-col');
  this.infoPanel.classList.toggle('zero-width');
};

Dom.prototype.showInfoPanel = function(){
  this.content.classList.remove('mdl-cell--10-col');
  this.infoPanel.classList.remove('zero-width');
};
Dom.prototype.hideInfoPanel = function(){
  this.content.classList.add('mdl-cell--10-col');
  this.infoPanel.classList.add('zero-width');
};



Dom.prototype.start = function () {
  console.log('Dom: start');
};

Dom.prototype.stop = function () {
  console.log('Dom: stop');
};

Dom.prototype.destroy = function () {
  console.log('Dom: destroy');
};

module.exports = Dom;
