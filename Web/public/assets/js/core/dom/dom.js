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
      dom.leftPanel.element.innerHTML = '';
      dom.content.element.innerHTML   = '';
      dom.infoPanel.element.innerHTML = '';
    });

    core.events.subscribe('core:dom:infoPanel:clear', function () {
      dom.infoPanel.element.innerHTML = '';
    });

    core.events.subscribe('core:dom:infoPanel:hide', function () {
      dom.hideInfoPanel();
    });

    core.events.subscribe('core:dom:infoPanel:show', function () {
      dom.showInfoPanel();
    });

    core.events.subscribe('core:dom:infoPanel:set', function ( html ) {
      dom.infoPanel.element.appendChild( html );
    });

    core.events.subscribe('core:dom:content:set', function ( html ) {
      dom.content.element.appendChild( html );
    });

    core.events.subscribe('core:dom:leftPanel:clear', function () {
      dom.leftPanel.element.innerHTML = '';
    });

    core.events.subscribe('core:dom:leftPanel:hide', function () {
      dom.hideleftPanel();
    });

    core.events.subscribe('core:dom:leftPanel:show', function () {
      dom.showleftPanel();
    });

    core.events.subscribe('core:dom:leftPanel:set', function ( html ) {
      dom.leftPanel.element.appendChild( html );
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
  
  var application = core.elements.create({
    elementType: 'simple',
    class: ["mdl-layout", "mdl-js-layout", "mdl-layout--fixed-header", "animated"],
  });
  
  this.application = application.element;
};

Dom.prototype.createApplicationContent = function(argument){

  // this.main = document.createElement('div');
  // this.main.className = "mdl-layout__content core-layout-offset";
  this.leftPanel = core.elements.create({
    elementType: 'simple',
    class : ["mdl-cell", "mdl-cell--2-col", "page-content-panel-animation", "content-leftPanel"]
  });
  this.content = core.elements.create({
    elementType: 'simple',
    class : ["mdl-cell", "mdl-cell--8-col", "page-content-panel-animation", "content-content"]
  });
  this.infoPanel = core.elements.create({
    elementType: 'simple',
    class : ["mdl-cell", "mdl-cell--2-col", "page-content-panel-animation", "content-infoPanel"]
  });

  this.grid = core.elements.create({
    elementType: 'simple',
    class : ["mdl-grid"],
    items : [
      this.leftPanel,
      this.content,
      this.infoPanel
    ]
  });

  this.pageContent = core.elements.create({
    elementType: 'simple',
    class : ["page-content"],
    items : [
      this.grid,
    ]
  });

  this.main = core.elements.create({
    elementType: 'simple',
    class : ["mdl-layout__content", "core-layout-offset"],
    items : [
      this.pageContent,
    ]
  });

  this.application.appendChild( this.main.element );
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
  
  this.title = core.elements.create({
    elementType : 'simple',
    type        : 'span',
    class       : ["mdl-layout-title"]
  });

  this.navigation = core.elements.create({
    elementType : 'simple',
    type        : 'nav',
    class       : ["mdl-navigation", "mdl-layout--large-screen-only"],
    items       : [
      core.elements.create({
        elementType : 'button',
        fab: true,
        color: true,
        icon: 'star',
        callback : {
          function : function(e){
            e.preventDefault();
            this.toggleInfoPanel();
          },
          context  : this
        }
      }),
    ]
  });

  this.header = core.elements.create({
    elementType : 'simple',
    type        : 'header',
    class       : ["mdl-layout__header", "core-fixed"],
    items : [
      core.elements.create({
        elementType: 'simple',
        class: ["mdl-layout__header-row"],
        items : [
          this.title,
          core.elements.create({ elementType: 'spacer' }),
          this.navigation,
        ]
      })
    ]
  });

  this.application.appendChild( this.header.element );
  this.setTitle( 'App title' );
};

Dom.prototype.setTitle = function ( title ) {
  if ( !title ) {
    throw new Error('setTitle -> can`t set title')
  }
  this.title.element.textContent = title;
};


/* DRAWER */
Dom.prototype.createDrawer = function(argument){

  this.drawerTitle = core.elements.create({
    elementType: 'simple',
    type  : 'span',
    class : ["mdl-layout-title"]
  });

  this.drawerNavigation = core.elements.create({
    elementType: 'simple',
    type  : 'nav',
    class : ["mdl-navigation"],
    items : [
      core.elements.create({
        elementType : 'button',
        class : 'mdl-navigation__link',
        text  : 'Отчёты',
        callback : {
          function : function(e){
            e.preventDefault();
            core.dom.application.MaterialLayout.toggleDrawer();
            core.events.publish("core:router:check", 'reports')
          },
          context  : this
        }
      }),
      core.elements.create({
        elementType : 'button',
        class : 'mdl-navigation__link',
        text  : 'Бизнес-процессы',
        callback : {
          function : function(e){
            e.preventDefault();
            core.dom.application.MaterialLayout.toggleDrawer();
            core.events.publish("core:router:check", 'bps')
          },
          context  : this
        }
      }),
      core.elements.create({
        elementType : 'button',
        class : 'mdl-navigation__link',
        text  : 'Экранные формы',
        callback : {
          function : function(e){
            e.preventDefault();
            core.dom.application.MaterialLayout.toggleDrawer();
            core.events.publish("core:router:check", 'web-forms')
          },
          context  : this
        }
      }),
      core.elements.create({
        elementType : 'button',
        class : 'mdl-navigation__link',
        text  : 'Печатные формы',
        callback : {
          function : function(e){
            e.preventDefault();
            core.dom.application.MaterialLayout.toggleDrawer();
            core.events.publish("core:router:check", 'print-forms')
          },
          context  : this
        }
      }),

    ]
  });

  this.drawer = core.elements.create({
    elementType : 'simple',
    class       : ["mdl-layout__drawer"],
    items: [
      this.drawerTitle,
      this.drawerNavigation,
    ]
  });

  this.application.appendChild( this.drawer.element );
  this.setDrawerTitle('App title');

};

Dom.prototype.setDrawerTitle = function ( title ) {
  if ( !title ) {
    throw new Error('setDrawerTitle -> can`t set title')
  }
  this.drawerTitle.element.textContent = title;
};


/* INFO PANEL */
Dom.prototype.toggleInfoPanel = function(){
  console.log('DOM: toggleInfoPanel');
  this.content.element.classList.toggle('mdl-cell--10-col');
  this.infoPanel.element.classList.toggle('zero-width');
};

Dom.prototype.showInfoPanel = function(){
  this.content.element.classList.remove('mdl-cell--10-col');
  this.infoPanel.element.classList.remove('zero-width');
};
Dom.prototype.hideInfoPanel = function(){
  this.content.element.classList.add('mdl-cell--10-col');
  this.infoPanel.element.classList.add('zero-width');
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
