"use strict";

var ReportSettings = function(config){
  this.current_date = new Date();
  this.currentYear  = this.current_date.getFullYear();
  this.periodStart  = this.current_date;
  this.periodEnd    = this.current_date;
  this.main         = this.current_date.getFullYear();
  this.compare      = this.current_date.getFullYear()-1;
  
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

  this.element = document.createElement('div');
  core.dom.application.querySelector('.core-layout-application').appendChild( this.element );
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
Report.prototype.destroyEditor = function() {
  if ($('div#paper').data('froala.editor')) {
    $('div#paper').froalaEditor('destroy');
  }
};

Report.prototype.loadEditor = function(body) {
  var html = core.utils.Base64.decode(body);

  var initialize = new Promise(function(resolve, reject) {
    window.jQuery('div#paper').froalaEditor({
      toolbarButtons   : ['file-o', 'floppy-o', 'adjust', 'phone',  'textRotate', 'calculator', '|', 'bold', 'italic', 'underline', 'fontSize', '|', 'color', /*'paragraphStyle'*/ , '|', 'paragraphFormat', '|', 'alignLeft', 'alignCenter', 'alignRight', '|', /*'formatOL'*/, 'formatUL', '|', 'outdent', 'indent', '|', 'insertImage', 'insertTable', '|', 'html', '|', 'undo', 'redo', '|', /*'cog', 'rotateDocument' */, 'customCalculationCell'/*, '|', 'zoom-out', 'zoom-in'*/ ],
      language         : 'ru',
      charCounterCount : false,
      toolbarSticky    : false
    });
    resolve(true);
  });

  initialize.then(function(editor) {
    $('div#paper').froalaEditor('html.set', (html ? html : '<p>') + '<p>');
  }).then(function(editor) {
    // var parent = document.querySelector('.fr-wrapper').parentNode;
    // parent.removeChild( document.querySelector('.fr-wrapper').nextSibling ) ;
    // return editor;
  }).catch(function(result) {

    console.log("ERROR!", result);
  });

};
Report.prototype.loadEditors = function(body) {
  var html = core.utils.Base64.decode(body);
  console.log( 'decoded:', html );
}


Report.prototype.attachEvents = function(){
  var report = this;
  
  core.events.subscribe("core:template:reports:editor", function(template){
    report.update( template.raw );
  });
};
Report.prototype.render = function(){
  console.log( 'Report -> render', this );

  var helper = {
    '_id': {
      text: function (params) {
        return this._id || '-_id-';
      }
    },
    'name': {
      text: function (params) {
        return this.name || '-name-';
      }
    },
    'description': {
      text: function (params) {
        return this.description || '-description-';
      }
    },
    'providerId': {
      text: function (params) {
        return this.providerId || '-providerId-';
      }
    },
    'query': {
      text: function (params) {
        return this.query || '-query-';
      }
    },
    'globalQuery': {
      text: function (params) {
        return this.globalQuery || '-globalQuery-';
      }
    }
  };

  Transparency.render( this.element.querySelector('#report'), this, helper );
};


var Reports = function(){
  this.element   = {};
  this.documents = {};
  this.current   = {};

  this.leftPanel = {};
  this.content   = {};
  this.infoPanel = {};

  this.bindEvents();
};

// <!-- боковая панель c выбором типа документов -->
// <div class="mdl-cell mdl-cell--2-col">
//   leftPanel
// </div>

// <div class="mdl-cell mdl-cell--8-col" style="height: 5000px;">
//    content
// </div>

// <!-- боковая панель c критериями -->
// <div class="mdl-cell mdl-cell--2-col">
//  
// </div>

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
  componentHandler.upgradeAllRegistered();
}
Reports.prototype.renderContent = function(){
  var reports = this;

  this.content = document.createElement('div');
  this.content.className = 'mdl-spinner mdl-js-spinner mdl-spinner--single-color is-active';

  core.dom.content.appendChild( this.content );
  componentHandler.upgradeElement( this.content );

  var load = new Promise( function( resolve, reject ){
    setTimeout( function(){
      Math.round( Math.random() ) ? resolve(true) : reject(false);
    }, 1500 );
  });

  load.then( function( data ){
    console.log();
    reports.content.className = '';
    reports.content.innerHTML = 'true';
  }).catch( function ( error ) {
    reports.content.className = '';
    reports.content.innerHTML = 'false';
    throw new Error( 'Reports -> renderContent', error );
  });
}

Reports.prototype.render = function() {
  core.events.publish( "core:dom:application:clear" );

  this.renderLeftPanel();
  this.renderContent();
  this.renderInfoPanel();
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

    core.events.subscribe("core:reports:loaded", function(rawData){
      // console.log( 'RAW REPORTS', rawData );
      for (var type in rawData ) {
        var data = rawData[type];
        // console.log( '***++', type, rawData.raw[type] );
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
          reports.add( type, report );
          
          core.events.publish("core:card:add", {
            type:type,
            report:report
          });
        }
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

Reports.prototype.add = function( type, config ) {

  if ( !this.documents.hasOwnProperty(type) ) {
    this.documents[type] = [];
  }

  this.documents[type].push( new this.Report(config) );
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