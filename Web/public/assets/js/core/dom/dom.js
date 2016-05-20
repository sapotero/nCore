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
    
    core.events.on('core:start:all', function () {
      console.log('core  > dom > bindEvents > core:start:all');
      manager.start();
    }, { priority: 0 });

    core.events.on('core:dom:application:clear', function () {
      dom.leftPanel.element.innerHTML = '';
      dom.content.element.innerHTML   = '';
      dom.infoPanel.element.innerHTML = '';
    });

    core.events.on('core:dom:infoPanel:clear', function () {
      dom.infoPanel.element.innerHTML = '';
    });

    core.events.on('core:dom:infoPanel:hide', function () {
      dom.hideInfoPanel();
    });

    core.events.on('core:dom:infoPanel:show', function () {
      dom.showInfoPanel();
    });

    core.events.on('core:dom:infoPanel:set', function ( _root ) {
      dom.infoPanel.element.appendChild( _root.element );
    });

    core.events.on('core:dom:content:set', function ( _root ) {
      dom.content.element.appendChild( _root.element );
    });

    core.events.on('core:dom:content:clear', function () {
      dom.content.element.innerHTML = '';
    });

    core.events.on('core:dom:leftPanel:clear', function () {
      dom.leftPanel.element.innerHTML = '';
    });

    core.events.on('core:dom:leftPanel:hide', function () {
      dom.hideleftPanel();
    });

    core.events.on('core:dom:leftPanel:show', function () {
      dom.showleftPanel();
    });

    core.events.on('core:dom:leftPanel:set', function ( _root ) {
      dom.leftPanel.element.appendChild( _root.element );
    });


    core.events.on('core:dom:material:update', function () {
      componentHandler.upgradeAllRegistered();
    });

    core.events.on('core:dom:user:ready', function ( user ) {
      dom.setUserName(user);
    });

    core.events.on('core:dom:set:title', function ( title ) {
      dom.setTitle(title);
    });

    // core.events.emit( "core:dom:clear" );

    core.events.on('core:dom:build:application', function () {
      console.log('Dom <- core:dom:build:application');
      dom.build();
    });

    core.events.on('core:dom:application:show', function () {
      console.log( ' Dom <- core:dom:application:show' );
      // core.dom.application.application.showCards();
    });

    core.events.on('core:dom:application:hide', function () {
      console.log( ' Dom <- core:dom:application:hide' );
      // core.dom.application.application.hideCards();
    });

    core.events.on('core:dom:attach:progressbar', function () {
      console.log( '* Dom <- core:dom:attach:progressbar' );
      dom.splashscreen.element.style.display = 'block';
    });

    core.events.on('core:dom:remove:progressbar', function () {
      console.log( '* Dom <- core:dom:remove:progressbar' );
      
      setTimeout( function () {
        dom.splashscreen.element.style.display = 'none';
        dom.application.style.display  = 'block';
        core.events.emit("core:router:update");
        dom.removeProgressBar();
      }, 500);

    });

    core.events.on('core:dom:editor:show', function () {
      console.log( ' Dom <- core:dom:editor:show' );
    });
    core.events.on('core:dom:editor:hide', function () {
      console.log( ' Dom <- core:dom:editor:hide' );
    });

    core.events.on('core:dom:set:title', function (title) {
      console.log( ' Dom <- core:dom:set:title' );
      // core.dom.application.application.setAttribute('caption', title);
    });

    core.events.on('core:dom:splashscreen:progress:set', function (percent) {
      console.log( ' Dom <- core:dom:splashscreen:progress:set', percent );
      try {
        dom.progressbar.element.MaterialProgress.setProgress(percent);
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
  

  this.createFooter();


  setTimeout( core.events.emit('core:dom:build:ready') ,1000);
};



/* Application */
Dom.prototype.createApplication = function(){
  
  var application = core.elements.create({
    elementType: 'simple',
    class: ["mdl-layout", "mdl-js-layout", "mdl-layout--fixed-header", "animated"],
  });
  
  this.application = application.element;
};

Dom.prototype.createApplicationContent = function(){
  this.leftPanel = core.elements.create({
    elementType: 'simple',
    class : ["mdl-cell", "mdl-cell--2-col", "page-content-panel-animation", "content-leftPanel", "mdl-cell--hide-tablet", "mdl-cell--hide-phone"]
  });
  this.content = core.elements.create({
    elementType: 'simple',
    // mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--8-col
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
    class : [ "page-content", "app-container-grid", "mdl-shadow--4dp" ],
    items : [
      this.grid,
    ]
  });

  this.main = core.elements.create({
    elementType: 'simple',
    type  : 'main',
    class : [ "app-main-ribbon-offset", "mdl-layout__content", "core-layout-offset"],
    items : [
      this.pageContent,
    ]
  });

  this.application.appendChild( this.main.element );
  document.body.appendChild( this.application );

};

/* ProgressBar */
Dom.prototype.createProgressBar = function(){

  this.logo = core.elements.create({
    elementType: 'simple',
    class : [ "mdl-typography--text-center", "mdl-cell", "mdl-cell--12-col", "mdl-cell--bottom" ],
    items : [
      core.elements.create({
        elementType: 'icon',
        icon: 'work'
      })
    ]
  });

  this.progressbar = core.elements.create({
    elementType: 'simple',
    class : [ "mdl-cell", "mdl-cell--12-col-phone", "mdl-cell--6-col-desktop", "mdl-cell--3-offset-desktop", "mdl-progress", "mdl-js-progress" ]
  });

  this.splashscreen = core.elements.create({
    elementType: 'simple',
    class : [ "mdl-grid", "animated", "core-splashscreen-fixed" ],
    items : [
      this.logo,
      this.progressbar
    ]
  });

  this.splashscreen.element.style.display = 'none';
  document.body.appendChild( this.splashscreen.element );
};
Dom.prototype.removeProgressBar = function(){

  core.events.remove('core:dom:attach:progressbar');
  core.events.remove('core:dom:remove:progressbar');
  
  this.splashscreen.element.remove();

  delete this.logo;
  delete this.progressbar;
  delete this.splashscreen;
};

/* MainMenu */
Dom.prototype.createHeader = function(){
  
  this.title = core.elements.create({
    elementType : 'simple',
    type        : 'span',
    class       : ["mdl-layout-title"]
  });

  this.navigation = core.elements.create({
    elementType : 'simple',
    type        : 'nav',
    class       : ["mdl-navigation", /*"mdl-layout--large-screen-only"*/],
    // для теста
    // items       : [
    //   core.elements.create( {
    //     elementType : 'menu',
    //     position    : 'right',
    //     icon: 'star',
    //     fab: true,
    //     color: true,
    //     items: [
    //       {
    //         text: 'lol'
    //       },
    //       {
    //         text: 'lol'
    //       }
    //     ]
    //   })
    // ]
  });

  this.header = core.elements.create({
    elementType : 'simple',
    type        : 'header',
    class       : ["mdl-layout__header", "core-fixed", "mdl-color--grey-100", "mdl-color-text--grey-800"],
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

  var ribbon = core.elements.create({
    elementType : 'simple',
    class       : [ 'ribbon' ]
  });
  

  this.application.appendChild( this.header.element );
  this.application.appendChild( ribbon.element );
  // this.setTitle( 'App title' );
};

Dom.prototype.setTitle = function ( title ) {
  if ( !title ) {
    throw new Error('setTitle -> can`t set title')
  }
  this.title.element.textContent = title;
};

Dom.prototype.setUserName = function ( user ) {
  // this.title.element.textContent = title;
  var user = core.elements.create( {
    elementType : 'menu',
    position    : 'right',
    class       : [ 'mdl-cell--hide-phone' ],
    text        : user.name,
    icon        : 'person',
    // fab         : true,
    items       : [
      { text: user.name },
      { text: user.provider.name }
    ]
  });

  this.navigation.element.appendChild( user.element );
};

/* DRAWER */
Dom.prototype.createDrawer = function(){

  this.drawerTitle = core.elements.create({
    elementType: 'simple',
    type  : 'span',
    class : [ "mdl-layout-title", "mdl-color-text--grey-800" ]
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
        color: true,
        // raised: true,
        ripple: true,
        callback : {
          function : function(e){
            e.preventDefault();
            core.dom.application.MaterialLayout.toggleDrawer();
            core.events.emit("core:router:check", 'reports')
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
            core.events.emit("core:router:check", 'bps')
          },
          context  : this
        }
      }),
      core.elements.create({
        elementType : 'button',
        class : 'mdl-navigation__link',
        text  : 'Экранные формы',
        color: true,
        raised: true,
        ripple: true,
        callback : {
          function : function(e){
            e.preventDefault();
            core.dom.application.MaterialLayout.toggleDrawer();
            core.events.emit("core:router:check", 'web-forms')
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
            core.events.emit("core:router:check", 'print-forms')
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

Dom.prototype.createFooter = function(){
  
  this.footer = core.elements.create({
    elementType: 'simple',
    class: [ "mdl-mini-footer", "app-footer" ],
  });
  
  this.main.element.appendChild( this.footer.element );
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

module.exports = Dom;