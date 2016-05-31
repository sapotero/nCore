'use strict';

var Dom = function () {
  this.root         = document;
  this.application  = {};
  this.editor       = {};
  this.snackbar     = {};
  this.splashscreen = {};
  this.dialog = {};

  this.bindEvents();
};

Dom.prototype.bindEvents = function () {
  var dom = this;

  document.addEventListener('DOMContentLoaded', function () {
    
    core.events.on('core:start:all', function () {
      console.log('core  > dom > bindEvents > core:start:all');
      manager.start();
    }, {
      priority: 0
    });

    core.events.on( "core:dom:dialog:clear", function () {
      console.log( 'dialog clear' );

      dom.dialog = {};
      
      var dialogs = document.body.querySelectorAll('dialog');
      for (var i = dialogs.length - 1; i >= 0; i--) {
        dialogs[i].remove();
        try{
          dialogs[i].close();
        } catch(e) {
          // console.log(e);
        }
        dialogs[i].remove();
      }
    });

    core.events.on( "core:dom:dialog:set", function ( dialog ) {
      core.events.emit( "core:dom:dialog:clear" );
      
      dom.dialog = dialog;
      dom.application.appendChild( dom.dialog.element );
    });

    core.events.on( "core:dom:dialog:show", function () {
      if ( dom.dialog.hasOwnProperty('element') && dom.dialog.element.hasOwnProperty('showModal') ) {
        dom.dialog.element.showModal();
      }
    });

    core.events.on( "core:dom:headerSubMenu:clear", function () {
      dom.headerSubMenu.element.innerHTML = '';
    });
    core.events.on( "core:dom:headerSubMenu:set", function ( _root ) {
      dom.headerSubMenu.element.appendChild( _root.element );
    });

    core.events.on( "core:dom:primaryHeader:show", function () {
      dom.primaryHeader.element.classList.remove('header-hide');
    });
    core.events.on( "core:dom:primaryHeader:hide", function () {
      dom.primaryHeader.element.classList.add('header-hide');
    });
    core.events.on( "core:dom:secondaryHeader:show", function () {
      dom.secondaryHeader.element.classList.remove('header-hide');
    });
    core.events.on( "core:dom:secondaryHeader:hide", function () {
      dom.secondaryHeader.element.classList.add('header-hide');
    });

    core.events.on('core:dom:application:clear', function () {
      core.events.emit( "core:dom:dialog:show" );
      dom.content.element.innerHTML   = '';
      dom.infoPanel.element.innerHTML = '';
    });
    core.events.on( "core:dom:content:wrapper:show", function () {
      dom.wrapper.element.classList.remove('content-wrapper-hide');
    });
    core.events.on( "core:dom:content:wrapper:hide", function () {
      dom.wrapper.element.classList.add('content-wrapper-hide');
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
    core.events.on('core:dom:set:subTitleMenu', function ( menu ) {
      console.log('Dom <- core:dom:set:subTitleMenu', menu);
      dom.setSubTitleMenu( menu );
    });
    core.events.on('core:dom:clear:subTitleMenu', function () {
      console.log('Dom <- core:dom:clear:subTitleMenu');
      dom.clearSubTitleMenu();
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
  
  // Футер
  this.createFooter();

  // Загрузочный экран для документов
  this.createContentWrapper();

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

Dom.prototype.createContentWrapper = function(){
  this.wrapper = core.elements.create({
    elementType: 'simple',
    class: [ "content-wrapper", "content-wrapper-hide" ],
    items : [
      core.elements.create({
        elementType: 'simple',
        class : [ "wrapper-top", "mdl-spinner", "mdl-js-spinner", "is-active" ],
      }),
    ]
  });

  var box = this.grid.element.getBoundingClientRect();


  this.wrapper.element.style.position = 'absolute';
  this.wrapper.element.style.left = box.left + 'px';
  this.wrapper.element.style.width = box.width + 'px';

  console.log( box, this.wrapper );

  this.grid.element.appendChild( this.wrapper.element );
}

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
  core.events.remove('core:dom:splashscreen:progress:set');

  
  this.splashscreen.element.remove();

  delete this.logo;
  delete this.progressbar;
  delete this.splashscreen;
};

/* MainMenu */
Dom.prototype.createHeader = function(){
  
  this.title = core.elements.create({
    elementType : 'search',
    input : {
      context: this,
      function : function(e){
        // e.preventDefault();
        console.log( 'input', e, this );
      }
    },
    submit : {
      context: this,
      function : function(e){
        // e.preventDefault();
        console.log( 'onsubmit', e, this );
      }
    }
  });

  this.subTitle = core.elements.create({
    elementType: 'simple',
    class: [ 'subTitleMenu--item__primary'],
  });
  this.subTitleMenu = core.elements.create({
    elementType: 'simple',
    class: [ 'subTitleMenu--item__secondary' ],
  });

  this._title = core.elements.create({
    elementType: 'simple',
    class: ['mdl-navigation', 'subTitle'],
    items: [
      this.subTitle,
      this.subTitleMenu,
    ]
  });

  this.search = core.elements.create({
    elementType: 'search',
  });

  this.navigation = core.elements.create({
    elementType : 'simple',
    type        : 'nav',
    class       : ["mdl-navigation", /*"mdl-layout--large-screen-only"*/],
  });
  this.headerSubMenu = core.elements.create({
    elementType: 'simple',
    class: ['mdl-navigation'],
    items : [
      core.elements.create({
        elementType: 'button',
        class: [ "mdl-color-text--grey-600" ],
        icon: 'view_module',
        tooltip: 'Изменить вид'
      }),
      core.elements.create({
        elementType : 'menu',
        // position    : 'right',
        class       : [ 'mdl-cell--hide-phone', 'mdl-menu--bottom-right' ],
        icon        : 'sort',
        items       : [
          {
            text: "По дате редактирования",
            // icon: 'sort',
          },
          {
            text: "По дате редактирования",
            // icon: 'sort',
          },
          {
            text: "По дате редактирования",
            devider: true,
            // icon: 'sort',
          },
          {
            text: "По дате создания",
            disabled: true,
            icon: 'sort',
            devider: true,
          },
          {
            text: "По дате редактирования",
            // icon: 'sort',
          }
        ]
      }),
      core.elements.create({
        elementType: 'button',
        class: [ "mdl-color-text--grey-600" ],
        icon: 'refresh',
        tooltip: 'Обновить страницу',
        callback : {
          context: this,
          function : function(e){
            e.preventDefault();
            core.events.emit( 'core:current:reload' );
          }
        }
      }),
    ]
  });

  this.primaryHeader = core.elements.create({
    elementType: 'simple',
    class: ["mdl-layout__header-row", "mdl-layout__header-row--primary" ],
    items : [
      this.title,
      core.elements.create({ elementType: 'spacer' }),
      this.navigation,
    ]
  });
  
  this.secondaryHeader = core.elements.create({
    elementType: 'simple',
    class: ["mdl-layout__header-row", "mdl-layout__header-row--secondary", "mdl-color--grey-50" ],
    items : [
      this._title,
      core.elements.create({ elementType: 'spacer' }),
      this.headerSubMenu,
    ]
  });

  this.header = core.elements.create({
    elementType : 'simple',
    type        : 'header',
    class       : ["mdl-layout__header", "core-fixed", "mdl-color--grey-100", "mdl-color-text--grey-800"],
    items : [
      this.primaryHeader,
      this.secondaryHeader,
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
  console.log( '******setTitle', title );
  
  // this.title.element.textContent = title;
  // this.subTitle.element.textContent = title;
  this.subTitle.element.classList.remove('subTitleMenu--item__primary-full');
  this.subTitle.element.innerHTML = "";
  this.subTitle.element.appendChild( title.element );

};

Dom.prototype.setSubTitleMenu = function ( menu ) {
  if ( !menu ) {
    throw new Error('subTitleMenu -> can`t set menu')
  }
  console.log( '******setSubTitleMenu', menu );
  
  this.subTitleMenu.element.innerHTML = "";
  this.subTitleMenu.element.appendChild( menu.element );
};
Dom.prototype.clearSubTitleMenu = function () {
  this.subTitleMenu.element.innerHTML = "";
  this.subTitle.element.classList.add('subTitleMenu--item__primary-full');
};


Dom.prototype.setUserName = function ( user ) {
  
  // this.title.element.textContent = title;
  
  // var settings = core.elements.create({
  //   elementType : 'button',
  //   icon : 'settings',
  //   flex : true,
  //   callback : {
  //     context  : this,
  //     function : function(e){
  //       e.preventDefault();
  //       console.log( 'dom-userMenu > settings click' );
  //     },
  //   }
  // });

  var user = core.elements.create({
    elementType : 'menu',
    position    : 'right',
    class       : [ 'mdl-menu--bottom-right' ],
    text        : user.name,
    before      : true,
    icon        : 'person',
    // fab         : true,
    items       : [
      { text: user.name },
      { text: user.provider.name }
    ]
  });

  this.userPanel = core.elements.create({
    elementType : 'simple',
    class : [ 'list__flex' ],
    items : [
      user,
      // settings,
    ]
  });

  this.navigation.element.appendChild( this.userPanel.element );
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
    class       : ["mdl-layout__drawer", 'core-fixed'],
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