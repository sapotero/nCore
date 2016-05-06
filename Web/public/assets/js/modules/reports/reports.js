"use strict";

var ReportSettings = function(config){
  this.currentDate = new Date();
  this.currentYear  = this.currentDate.getFullYear();
  this.periodStart  = this.currentDate;
  this.periodEnd    = this.currentDate;
  this.main         = this.currentDate.getFullYear();
  this.compare      = this.currentDate.getFullYear()-1;
  
  this.isYearReport = config.isYearReport || false;
  this.isTemplate   = config.isTemplate || false;
  this.isNew        = config.isNew || true;
};

var Report = function(config){
  this.element     = {};
  this._id         = config._id         || '';
  this.name        = config.name        || '';
  this.description = config.description || '';
  this.author      = config.author;
  this.providerId  = config.provider_id;
  this.query       = {};
  this.globalQuery = {};
  this.settings    = new ReportSettings(config.settings);
};
Report.prototype.init = function(){

  this.detachEvents();
  this.attachEvents();
  this.destroyEditor();
  
  console.log( 'Report -> init' );

  core.events.publish("core:reports:editor:template");
  core.events.publish("core:report:load", this._id );
};
Report.prototype.update = function(html){
  console.log( 'Report -> update' );
  this.element.innerHTML = html;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
  this.render();
};
Report.prototype.load = function(){
  console.log( 'Report -> bindEvents' );
};

Report.prototype.detachEvents = function(){
  core.events.remove("core:template:reports:editor");
  core.events.remove("core:report:loaded");
};

// Report.prototype.destroyEditor = function() {
//   if ($('div#paper').data('froala.editor')) {
//     $('div#paper').froalaEditor('destroy');
//   }
// };
// Report.prototype.loadEditor = function(body) {
//   var html = core.utils.Base64.decode(body);

//   var initialize = new Promise(function(resolve, reject) {
//     window.jQuery('div#paper').froalaEditor({
//       toolbarButtons   : ['file-o', 'floppy-o', 'adjust', 'phone',  'textRotate', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', /*'formatOL'*/, 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', 'cog', 'rotateDocument' , 'customCalculationCell'/*, '|', 'zoom-out', 'zoom-in'*/ ],
//       language         : 'ru',
//       charCounterCount : false,
//       toolbarSticky    : false
//     });
//     resolve(true);
//   });

//   initialize.then(function(editor) {
//     $('div#paper').froalaEditor('html.set', (html ? html : '<p>') + '<p>');
//   }).then(function(editor) {
//     // var parent = document.querySelector('.fr-wrapper').parentNode;
//     // parent.removeChild( document.querySelector('.fr-wrapper').nextSibling ) ;
//     // return editor;
//   }).catch(function(result) {

//     console.log("ERROR!", result);
//   });
// };
// Report.prototype.loadEditors = function(body) {
//   var html = core.utils.Base64.decode(body);
//   console.log( 'decoded:', html );
// }


Report.prototype.attachEvents = function(){
  var report = this;
  
  core.events.subscribe("core:template:reports:editor", function(template){
    report.update( template.raw );
  });
};

Report.prototype.cardClickHandler = function(e){
  console.log( 'Report: cardClickHandler', e, this );
  location.hash = '#reports/' + this._id;
};


Report.prototype.render = function( config ){
  // <div class="report-card mdl-card--border mdl-shadow--2dp">

  //   <div class="mdl-card__title mdl-card--expand">
  //     <h4 class="mdl-card__title-text"></h4>
  //     <div class="mdl-card__subtitle-text"></div>
  //   </div>

  //   <div class="mdl-card__supporting-text">
  //     document name
  //   </div>

  //   <div class="mdl-card__actions mdl-card--border">
  //     <!-- <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
  //       Добавить
  //     </a>
  //     <div class="mdl-layout-spacer"></div>
  //     <i class="material-icons">event</i> -->
  //     <div class="mdl-card__supporting-text mdl-card__supporting-text-date"> date current </div>
  //   </div>

  //   <div class="mdl-card__menu mdl-card__menu-hide">
  //     <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
  //       <i class="material-icons">star</i>
  //     </button>
  //   </div>
  // </div>

  
 
  this.element = document.createElement('div');
  this.element.className = 'report-card-full mdl-cell mdl-cell--3-col mdl-cell--12-col-phone mdl-card';

  var card = document.createElement('div');
  card.className = 'report-card mdl-card--border mdl-shadow--2dp';
  this.element.appendChild( card );

  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title mdl-card--expand';
  card.appendChild( cardTitle );
  cardTitle.addEventListener( 'click', this.cardClickHandler.bind(this) );

  var titleText = document.createElement('div');
  titleText.className = 'mdl-card__title-text';
  titleText.textContent = this.name;
  cardTitle.appendChild( titleText );

  var subTitleText = document.createElement('div');
  subTitleText.className = 'mdl-card__subtitle-text';
  // subTitleText.textContent = this.description;
  cardTitle.appendChild( subTitleText );




  var supportingText = document.createElement('div');
  supportingText.className = 'mdl-card__supporting-text';
  supportingText.textContent = this.description;
  card.appendChild( supportingText );

  var actions = document.createElement('div');
  actions.className = 'mdl-card__actions mdl-card--border';
  // actions.textContent = this.description;
  card.appendChild( actions );

  var button = document.createElement('a');
  button.className = 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect';
  button.textContent = 'добавить';
  actions.appendChild( button );

  var spacer = document.createElement('div');
  spacer.className = 'mdl-layout-spacer';
  actions.appendChild( spacer );

  var icon = document.createElement('i');
  icon.className = 'material-icons';
  icon.textContent = 'stars'
  actions.appendChild( icon );

  var supportingTextDate = document.createElement('div');
  supportingTextDate.className = 'mdl-card__supporting-text mdl-card__supporting-text-date';
  supportingTextDate.textContent = this.settings.currentDate.toLocaleString();
  actions.appendChild( supportingTextDate );



  var cardMenu = document.createElement('div');
  cardMenu.className = 'mdl-card__menu';
  card.appendChild( cardMenu );

  var button = document.createElement('button');
  button.className = 'mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect';
  cardMenu.appendChild( button );

  var icon = document.createElement('i');
  icon.className = 'material-icons';
  icon.textContent = 'star'
  button.appendChild( icon );

  return this.element;
};


var Reports = function(){
  this.element   = {};
  this.documents = [];
  this.current   = {};

  this.leftPanel = {};
  this.content   = {};
  this.infoPanel = {};

  this.bindEvents();
};

Reports.prototype.addItemToLeftPanel = function( config ){
  // <li class="menu-item mdl-list__item mdl-list__item--two-line" action="my">
  //   <span class="mdl-list__item-primary-content">
  //     <i class="material-icons mdl-list__item-avatar">folder</i>
  //     <span class="document-name">Мои документы</span>
  //     <span class="mdl-list__item-sub-title">100 документов</span>
  //   </span>
  // </li>
  var item = document.createElement('li');
  item.className = 'menu-item mdl-list__item';
  item.setAttribute('action', config.action );

  var content = document.createElement('span');
  content.className = 'mdl-list__item-primary-content';

  if ( config.icon ) {
    var icon = document.createElement('i');
    icon.className   = 'material-icons mdl-list__item-avatar';
    icon.textContent = config.icon;
    content.appendChild( icon );
  }

  if ( config.name ) {
    var name = document.createElement('span');
    name.className   = 'document-name';
    name.textContent = config.name;
    content.appendChild( name );
  }

  if ( config.count ) {
    var count = document.createElement('span');
    count.className   = 'mdl-list__item-sub-title';
    count.textContent = config.count;
    content.appendChild( count );
  }

  if ( config.name && config.count ) {
    item.classList.add('mdl-list__item--two-line');
  }

  item.appendChild( content );
  this.leftPanel.appendChild( item );
}

Reports.prototype.renderLeftPanel = function(){
  this.leftPanel = document.createElement('ul');
  this.leftPanel.className = 'panel menu-list mdl-list mdl-cell--hide-phone mdl-shadow--0dp';
  
  this.addItemToLeftPanel({
    action : 'event',
    name   : 'event',
    icon   : 'event',
    count  : '100'
  });
  this.addItemToLeftPanel({
    action : 'code',
    name   : 'code',
    icon   : 'code'
  });
  this.addItemToLeftPanel({
    action : 'done',
    name   : 'done',
    icon   : 'done',
    count  : '100'
  });
  this.addItemToLeftPanel({
    action : 'start',
    name   : 'start',
    icon   : 'start'
  });

  core.dom.leftPanel.appendChild( this.leftPanel );


  // <ul class="panel menu-list mdl-list mdl-cell--hide-phone mdl-shadow--0dp">
    
  //   <li class="menu-item mdl-list__item mdl-list__item--two-line" action="shared">
  //     <span class="mdl-list__item-primary-content">
  //       <i class="material-icons mdl-list__item-avatar">folder_shared</i>
  //       <span class="document-name">Общие документы</span>
  //       <span class="mdl-list__item-sub-title">100 документов</span>
  //     </span>
  //   </li>
    
  //   <li class="menu-item mdl-list__item mdl-list__item--one-line" action="templates">
  //     <span class="mdl-list__item-primary-content">
  //       <i class="material-icons mdl-list__item-avatar">person</i>
  //       <span class="document-name">Шаблоны</span>
  //       <span class="mdl-list__item-sub-title"></span>
  //     </span>
  //   </li>
  // </ul>
}

Reports.prototype.addItemToInfoPanel = function( config ){
  var item = document.createElement('li');
  item.classList.add('mdl-list__item');
  
  if ( config.name ) {
    var name = document.createElement('span');
    name.className = "mdl-list__item-primary-content";
    name.textContent = config.name;
    item.appendChild(name);

    if ( config.icon ) {
      // <i class="material-icons  mdl-list__item-avatar">person</i>
      var icon = document.createElement('i');
      icon.className = "material-icons  mdl-list__item-avatar";
      icon.textContent = config.icon;
      name.insertAdjacentHTML('afterBegin', icon.outerHTML );
    }
    
  }

  if ( config.action ) {
    var action = document.createElement('span');
    action.className = "mdl-list__item-secondary-action";
    
    var id = Math.round( Math.random()*150550 );

    var label = document.createElement('label');
    label.className = "mdl-" + config.action + " mdl-js-" + config.action + " mdl-js-ripple-effect";
    label.setAttribute( 'for', id)

    var input = document.createElement('input');
    switch ( config.action ) {
      case 'switch':
        input.className = "mdl-switch__input";
        break;
      case 'checkbox':
        input.className = "mdl-checkbox__input";
        break;
      default:
        input.className = "mdl-textfield__input";
        break;
    }
    
    input.id = id;
    input.type = config.action;
    label.appendChild(input);

    action.appendChild(label);

    item.appendChild(action);
  }
  this.infoPanel.appendChild( item );
  // <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="list-checkbox-1">
  // <label class="mdl-radio    mdl-js-radio    mdl-js-ripple-effect" for="list-option-1">
  // <label class="mdl-switch   mdl-js-switch   mdl-js-ripple-effect" for="list-switch-1">

  //   <li class="mdl-list__item">
  //     
  //     <span class="mdl-list__item-primary-content">
  //       <i class="material-icons  mdl-list__item-avatar">person</i>
  //       Bob Odenkirk
  //     </span>
  //     
  //     <span class="mdl-list__item-secondary-action">
  //       <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="list-switch-1">
  //         <input type="checkbox" id="list-switch-1" class="mdl-switch__input" checked />
  //       </label>
  //     </span>
  //   </li>

};

Reports.prototype.renderInfoPanel = function(){
  // <ul class="mdl-list">
  //   <li class="mdl-list__item">
  //     <span class="mdl-list__item-primary-content">
  //       <!-- <i class="material-icons  mdl-list__item-avatar">person</i> -->
  //       Bryan Cranston
  //     </span>
  //     <span class="mdl-list__item-secondary-action">
  //       <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="list-checkbox-1">
  //         <input type="checkbox" id="list-checkbox-1" class="mdl-checkbox__input" checked />
  //       </label>
  //     </span>
  //   </li>
  // </ul>
  this.infoPanel = document.createElement('ul');
  this.infoPanel.className = 'mdl-list'
  this.addItemToInfoPanel({
    action: 'checkbox',
    name: 'checkbox',
    icon: 'gif',
  });
  this.addItemToInfoPanel({
    action: 'checkbox',
    name: 'checkbox'
  });
  this.addItemToInfoPanel({
    action: 'switch',
    name: 'checkboxx',
    icon: 'star',
  });

  core.dom.infoPanel.appendChild( this.infoPanel );
}

Reports.prototype.renderContent = function(){
  var reports = this;

  this.content = document.createElement('div');
  this.content.className = 'mdl-spinner mdl-js-spinner mdl-spinner--single-color is-active';

  core.dom.content.appendChild( this.content );
  componentHandler.upgradeElement( this.content );

  var load = new Promise( function( resolve, reject ){
     if ( reports.documents.length ) {
       var df = document.createDocumentFragment();
       
       for(var j = 0, length = reports.documents.length; j < length; j++){
         console.log( reports.documents[j] );
         var report = reports.documents[j];
         df.appendChild( report.render() );
       }

       resolve( df );
     } else {
       reject( false );
     }
  });

  load.then( function( documentFragment ){
    reports.content.className   = 'mdl-grid documentCards animated';
    reports.content.textContent = '';
    reports.content.appendChild( documentFragment );
  }).catch( function ( error ) {
    reports.content.className = '';
    reports.content.innerHTML = 'no elements';
    throw new Error( 'Reports -> renderContent', error );
  });
}

Reports.prototype.render = function() {
  core.events.publish( "core:dom:application:clear" );

  this.renderLeftPanel();
  this.renderContent();
  this.renderInfoPanel();

  componentHandler.upgradeAllRegistered();
  // core.dom.content
  // core.dom.infoPanel
}

Reports.prototype.Report = Report;
Reports.prototype.init = function(){
  core.events.publish( "[ + ] core:reports:init" );

  this.element = document.createElement('div');
  this.render();
};
Reports.prototype.bindEvents = function(){
  var reports = this;

  document.addEventListener('DOMContentLoaded', function(){

    
    core.events.subscribe("core:reports:render", function(){
      reports.render();
    });

    core.events.subscribe("core:report:loaded", function(data){
      
      var report = JSON.parse( data.raw );
      report.settings = {
        isYearReport : report.yearReport,
        isTemplate   : report.template,
        isNew        : report.new
      };

      console.log( 'core:report:loaded', report );
      reports.current = new reports.Report( report );

      core.events.publish("core:events:editor:set:html", core.utils.Base64.decode( report.body ) );

      // report.loadEditor( data.raw.body );
    });

    core.events.subscribe("core:reports:loaded", function(data){
      for (var i = data.length - 1; i >= 0; i--) {
        var _d = data[i];
        var report = {
          _id         : _d._id,
          name        : _d.name,
          description : _d.description,
          update_at   : _d.updated_at,
          
          author : {
            id   : _d.author_id,
            name : _d.author_id
          },

          providerId  : _d.provider_id,

          query       : _d.query,
          globalQuery : _d.globalQuery,

          settings : {
            periodStart  : _d.periodStart,
            periodEnd    : _d.periodEnd,
            main         : _d.main,
            compare      : _d.compare,
            isYearReport : _d.yearReport,
            isTemplate   : _d.template,
            providerSelected : _d.providerSelected
          }
        };
        reports.add( report );
      }
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe("core:reports:start", function( template ){
      console.log('Reports <- core:reports:start');
      core.events.publish( "core:preloader:task:ready" );
    });

    core.events.subscribe("core:template:reports", function( template ){
      
      reports.updateRootElement( template.raw );
    });

    // клик по меню с документами
    core.events.subscribe("core:reports:menu:select", function( menuItem ){
      // console.log( 'Reports <- core:reports:menu:select', menuItem );
      core.events.publish( "core:router:go", menuItem.getAttribute('action') );
    });

  });
};
Reports.prototype.updateRootElement = function(html){
  this.element.innerHTML = html;
  this.element.classList.add('animated');
  this.element.classList.add('fadeIn');
  this.render();
};

Reports.prototype._render = function(){
  if ( !Object.keys(this.documents).length ){
    return false;
  }

  for (var type in this.documents) {
    // console.log( 'render -> type, documents', type,this.element.querySelector('.'+type),   this.documents[type] );
    var helper = {
      type: {
        text: function (params) {
          return this.type;
        }
      }
    };
    helper[type] = {
        '_id': {
          text: function (params) {
            return this._id || '-id-';
          }
        },
        name: {
          text: function (params) {
            return this.name || '-name-';
          }
        },
        link: {
          href: function (params) {
            return '#reports/' + this._id;
          }
        }
    };

    var config = {
      type: type
    };
    config[type] = this.documents[type];

    Transparency.render( this.element.querySelector('.report-'+type), config, helper );
  }
};

Reports.prototype.add = function(  config ) {

  this.documents.push( new this.Report(config) );
};
Reports.prototype.clear = function(config) {
  this.documents = {};
};
Reports.prototype.find = function(id) {
  for (var type in this.documents) {
    for (var i = this.documents[type].length - 1; i >= 0; i--) {
      if( this.documents[type][i]._id === id ){
        return this.documents[type][i];
      }
    }
  }
};

Reports.prototype.show = function(id) {
  console.log( 'Reports: show -> ', id);
  var report = this.find(id);
  if ( report ) {
    report.init();
  } else {
    throw new Error('template not found!');
  }
};

Reports.prototype.start = function() {
  console.log( 'Reports: start' );
  this.init();
};
Reports.prototype.stop = function() {
  console.log( 'Reports: stop' );
};
Reports.prototype.destroy = function() {
  console.log( 'Reports: destroy' );
  this.element = [];
};

module.exports = Reports;