/*!
 * froala_editor v2.1.0 (https://www.froala.com/wysiwyg-editor)
 * License https://froala.com/wysiwyg-editor/terms
 * Copyright 2014-2016 Froala Labs
 */


var initFroalaEditor = new Promise(function(resolve, reject) {

  var froala_cell_dataset = '';
  // $.FroalaEditor.DEFAULTS.key ='' 

!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){"use strict";var b=function(c,d){this.opts=a.extend(!0,{},a.extend({},b.DEFAULTS,"object"==typeof d&&d)),this.$original_element=a(c),this.$original_element.data("froala.editor",this),this.id=++a.FroalaEditor.ID,this.original_document=c.ownerDocument,this.original_window="defaultView"in this.original_document?this.original_document.defaultView:this.original_document.parentWindow;var e=a(this.original_window).scrollTop();this.$original_element.on("froala.doInit",a.proxy(function(){this.$original_element.off("froala.doInit"),this.document=this.$el.get(0).ownerDocument,this.window="defaultView"in this.document?this.document.defaultView:this.document.parentWindow,this.$document=a(this.document),this.$window=a(this.window),this.opts.pluginsEnabled||(this.opts.pluginsEnabled=Object.keys(a.FroalaEditor.PLUGINS)),this.opts.initOnClick?(this.load(a.FroalaEditor.MODULES),this.$el.on("mousedown.init dragenter.init focus.init",a.proxy(function(b){if(1===b.which){this.$el.off("mousedown.init dragenter.init focus.init"),this.load(a.FroalaEditor.MODULES),this.load(a.FroalaEditor.PLUGINS);var c=b.originalEvent&&b.originalEvent.originalTarget;c&&"IMG"==c.tagName&&a(c).trigger("mousedown"),"undefined"==typeof this.ul&&this.destroy(),this.events.trigger("initialized")}},this))):(this.load(a.FroalaEditor.MODULES),this.load(a.FroalaEditor.PLUGINS),a(this.original_window).scrollTop(e),"undefined"==typeof this.ul&&this.destroy(),this.events.trigger("initialized"))},this)),this._init()};b.DEFAULTS={initOnClick:!1,pluginsEnabled:null},b.MODULES={},b.PLUGINS={},b.VERSION="2.1.1",b.INSTANCES=[],b.ID=0,b.prototype._init=function(){var b=this.$original_element.prop("tagName"),c=a.proxy(function(){this._original_html=this._original_html||this.$original_element.html(),this.$box=this.$box||this.$original_element,this.opts.fullPage&&(this.opts.iframe=!0),this.opts.iframe?(this.$iframe=a('<iframe src="about:blank" frameBorder="0">'),this.$wp=a("<div></div>"),this.$box.html(this.$wp),this.$wp.append(this.$iframe),this.$iframe.get(0).contentWindow.document.open(),this.$iframe.get(0).contentWindow.document.write("<!DOCTYPE html>"),this.$iframe.get(0).contentWindow.document.write("<html><head></head><body></body></html>"),this.$iframe.get(0).contentWindow.document.close(),this.$el=this.$iframe.contents().find("body"),this.$head=this.$iframe.contents().find("head"),this.$html=this.$iframe.contents().find("html"),this.iframe_document=this.$iframe.get(0).contentWindow.document,this.$original_element.trigger("froala.doInit")):(this.$el=a("<div></div>"),this.$wp=a("<div></div>").append(this.$el),this.$box.html(this.$wp),this.$original_element.trigger("froala.doInit"))},this),d=a.proxy(function(){this.$box=a("<div>"),this.$original_element.before(this.$box).hide(),this._original_html=this.$original_element.val(),this.$original_element.parents("form").on("submit."+this.id,a.proxy(function(){this.events.trigger("form.submit")},this)),c()},this),e=a.proxy(function(){this.$el=this.$original_element,this.$el.attr("contenteditable",!0).css("outline","none").css("display","inline-block"),this.opts.multiLine=!1,this.opts.toolbarInline=!1,this.$original_element.trigger("froala.doInit")},this),f=a.proxy(function(){this.$el=this.$original_element,this.opts.toolbarInline=!1,this.$original_element.trigger("froala.doInit")},this),g=a.proxy(function(){this.$el=this.$original_element,this.opts.toolbarInline=!1,this.$original_element.on("click.popup",function(a){a.preventDefault()}),this.$original_element.trigger("froala.doInit")},this);this.opts.editInPopup?g():"TEXTAREA"==b?d():"A"==b?e():"IMG"==b?f():"BUTTON"==b||"INPUT"==b?(this.opts.editInPopup=!0,this.opts.toolbarInline=!1,g()):c()},b.prototype.load=function(b){for(var c in b)if(!this[c]&&!(a.FroalaEditor.PLUGINS[c]&&this.opts.pluginsEnabled.indexOf(c)<0)&&(this[c]=new b[c](this),this[c]._init&&(this[c]._init(),this.opts.initOnClick&&"core"==c)))return!1},b.prototype.destroy=function(){this.events.trigger("destroy"),this.$original_element.parents("form").off("submit."+this.id),this.$original_element.off("click.popup"),this.$original_element.removeData("froala.editor")},a.fn.froalaEditor=function(c){for(var d=[],e=0;e<arguments.length;e++)d.push(arguments[e]);if("string"==typeof c){var f=[];return this.each(function(){var b=a(this),e=b.data("froala.editor");if(e){var g,h;if(c.indexOf(".")>0&&e[c.split(".")[0]]?(e[c.split(".")[0]]&&(g=e[c.split(".")[0]]),h=c.split(".")[1]):(g=e,h=c.split(".")[0]),!g[h])return a.error("Method "+c+" does not exist in Froala Editor.");var i=g[h].apply(e,d.slice(1));void 0===i?f.push(this):0===f.length&&f.push(i)}}),1==f.length?f[0]:f}return"object"!=typeof c&&c?void 0:this.each(function(){var d=a(this).data("froala.editor");d||new b(this,c)})},a.fn.froalaEditor.Constructor=b,a.FroalaEditor=b,a.FroalaEditor.MODULES.node=function(b){function c(b){return b&&"IFRAME"!=b.tagName?a(b).contents():[]}function d(b){return b?b.nodeType!=Node.ELEMENT_NODE?!1:a.FroalaEditor.BLOCK_TAGS.indexOf(b.tagName.toLowerCase())>=0:!1}function e(e,f){if(a(e).find("table").length>0)return!1;if(e.querySelectorAll(a.FroalaEditor.VOID_ELEMENTS.join(",")).length-e.querySelectorAll("br").length)return!1;if(e.querySelectorAll(b.opts.htmlAllowedEmptyTags.join(",")).length)return!1;if(e.querySelectorAll(a.FroalaEditor.BLOCK_TAGS.join(",")).length>1)return!1;if(e.querySelectorAll(b.opts.htmlDoNotWrapTags.join(",")).length)return!1;var g=c(e);1==g.length&&d(g[0])&&(g=c(g[0]));for(var h=!1,i=0;i<g.length;i++){var j=g[i];if(!(f&&a(j).hasClass("fr-marker")||j.nodeType==Node.TEXT_NODE&&0==j.textContent.length)){if("BR"!=j.tagName&&(j.textContent||"").replace(/\u200B/gi,"").length>0)return!1;if(h)return!1;"BR"==j.tagName&&(h=!0)}}return!0}function f(c){for(;c&&c.parentNode!==b.$el.get(0)&&(!c.parentNode||!a(c.parentNode).hasClass("fr-inner"));)if(c=c.parentNode,d(c))return c;return null}function g(c,e,f){if("undefined"==typeof e&&(e=[]),"undefined"==typeof f&&(f=!0),e.push(b.$el.get(0)),e.indexOf(c.parentNode)>=0||c.parentNode&&a(c.parentNode).hasClass("fr-inner")||c.parentNode&&a.FroalaEditor.SIMPLE_ENTER_TAGS.indexOf(c.parentNode.tagName)>=0&&f)return null;for(;e.indexOf(c.parentNode)<0&&c.parentNode&&!a(c.parentNode).hasClass("fr-inner")&&(a.FroalaEditor.SIMPLE_ENTER_TAGS.indexOf(c.parentNode.tagName)<0||!f)&&(!d(c)||!d(c.parentNode)||!f);)c=c.parentNode;return c}function h(a){var b={},c=a.attributes;if(c)for(var d=0;d<c.length;d++){var e=c[d];b[e.nodeName]=e.value}return b}function i(a){for(var b="",c=h(a),d=Object.keys(c).sort(),e=0;e<d.length;e++){var f=d[e],g=c[f];b+=g.indexOf('"')<0?" "+f+'="'+g+'"':" "+f+"='"+g+"'"}return b}function j(a){for(var b=a.attributes,c=0;c<b.length;c++){var d=b[c];a.removeAttribute(d.nodeName)}}function k(a){return"<"+a.tagName.toLowerCase()+i(a)+">"}function l(a){return"</"+a.tagName.toLowerCase()+">"}function m(b,c){"undefined"==typeof c&&(c=!0);for(var d=b.previousSibling;d&&c&&a(d).hasClass("fr-marker");)d=d.previousSibling;return d?d.nodeType==Node.TEXT_NODE&&""===d.textContent?m(d):!1:!0}function n(b){return b&&b.nodeType==Node.ELEMENT_NODE&&a.FroalaEditor.VOID_ELEMENTS.indexOf((b.tagName||"").toLowerCase())>=0}function o(a){return a?["UL","OL"].indexOf(a.tagName)>=0:!1}function p(a){return a===b.$el.get(0)}function q(a){return a===b.document.activeElement&&(!b.document.hasFocus||b.document.hasFocus())&&!!(p(a)||a.type||a.href||~a.tabIndex)}function r(a){return!a.getAttribute||"false"!=a.getAttribute("contenteditable")}return{isBlock:d,isEmpty:e,blockParent:f,deepestParent:g,rawAttributes:h,attributes:i,clearAttributes:j,openTagString:k,closeTagString:l,isFirstSibling:m,isList:o,isElement:p,contents:c,isVoid:n,hasFocus:q,isEditable:r}},a.extend(a.FroalaEditor.DEFAULTS,{htmlAllowedTags:["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","br","button","canvas","caption","cite","code","col","colgroup","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meter","nav","noscript","object","ol","optgroup","option","output","p","param","pre","progress","queue","rp","rt","ruby","s","samp","script","style","section","select","small","source","span","strike","strong","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track","u","ul","var","video","wbr"],htmlRemoveTags:["script","style"],htmlAllowedAttrs:["accept","accept-charset","accesskey","action","align","allowfullscreen","allowtransparency","alt","async","autocomplete","autofocus","autoplay","autosave","background","bgcolor","border","charset","cellpadding","cellspacing","checked","cite","class","color","cols","colspan","content","contenteditable","contextmenu","controls","coords","data","data-.*","datetime","default","defer","dir","dirname","disabled","download","draggable","dropzone","enctype","for","form","formaction","frameborder","headers","height","hidden","high","href","hreflang","http-equiv","icon","id","ismap","itemprop","keytype","kind","label","lang","language","list","loop","low","max","maxlength","media","method","min","mozallowfullscreen","multiple","name","novalidate","open","optimum","pattern","ping","placeholder","poster","preload","pubdate","radiogroup","readonly","rel","required","reversed","rows","rowspan","sandbox","scope","scoped","scrolling","seamless","selected","shape","size","sizes","span","src","srcdoc","srclang","srcset","start","step","summary","spellcheck","style","tabindex","target","title","type","translate","usemap","value","valign","webkitallowfullscreen","width","wrap"],htmlAllowComments:!0,fullPage:!1}),a.FroalaEditor.HTML5Map={B:"STRONG",I:"EM",STRIKE:"S"},a.FroalaEditor.MODULES.clean=function(b){function c(a){if(a.className&&a.className.indexOf("fr-marker")>=0)return!1;var d,e=b.node.contents(a),f=[];for(d=0;d<e.length;d++)e[d].className&&e[d].className.indexOf("fr-marker")>=0&&f.push(e[d]);if(e.length-f.length==1&&0===a.textContent.replace(/\u200b/g,"").length){for(d=0;d<f.length;d++)a.parentNode.insertBefore(f[d].cloneNode(!0),a);return a.parentNode.removeChild(a),!1}for(d=0;d<e.length;d++)e[d].nodeType==Node.ELEMENT_NODE?e[d].textContent.replace(/\u200b/g,"").length!=e[d].textContent.length&&c(e[d]):e[d].nodeType==Node.TEXT_NODE&&(e[d].textContent=e[d].textContent.replace(/\u200b/g,""))}function d(a){if(a.nodeType==Node.COMMENT_NODE)return"<!--"+a.nodeValue+"-->";if(a.nodeType==Node.TEXT_NODE)return a.textContent.replace(/\</g,"&lt;").replace(/\>/g,"&gt;").replace(/\u00A0/g,"&nbsp;");if(a.nodeType!=Node.ELEMENT_NODE)return a.outerHTML;if(a.nodeType==Node.ELEMENT_NODE&&["STYLE","SCRIPT"].indexOf(a.tagName)>=0)return a.outerHTML;if("IFRAME"==a.tagName)return a.outerHTML;var c=a.childNodes;if(0===c.length)return a.outerHTML;for(var e="",f=0;f<c.length;f++)e+=d(c[f]);return b.node.openTagString(a)+e+b.node.closeTagString(a)}function e(a){return x=[],a=a.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,function(a){return x.push(a),"<!--[FROALA.EDITOR.SCRIPT "+(x.length-1)+"]-->"}),a=a.replace(/<img((?:[\w\W]*?)) src="/g,'<img$1 data-fr-src="')}function f(a){return a=a.replace(/<!--\[FROALA\.EDITOR\.SCRIPT ([\d]*)]-->/gi,function(a,b){return x[parseInt(b,10)]}),b.opts.htmlRemoveTags.indexOf("script")>=0&&(a=a.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"")),a=a.replace(/<img((?:[\w\W]*?)) data-fr-src="/g,'<img$1 src="')}function g(a){var b;for(b in a)b.match(w)||delete a[b];for(var c="",d=Object.keys(a).sort(),e=0;e<d.length;e++)b=d[e],c+=a[b].indexOf('"')<0?" "+b+'="'+a[b]+'"':" "+b+"='"+a[b]+"'";return c}function h(a,c,d){if(b.opts.fullPage){var e=b.html.extractDoctype(d),f=g(b.html.extractNodeAttrs(d,"html"));c=null==c?b.html.extractNode(d,"head")||"<title></title>":c;var h=g(b.html.extractNodeAttrs(d,"head")),i=g(b.html.extractNodeAttrs(d,"body"));return e+"<html"+f+"><head"+h+">"+c+"</head><body"+i+">"+a+"</body></html>"}return a}function i(c,e){var f=a("<div>"+c+"</div>"),g="";if(f){for(var h=b.node.contents(f.get(0)),i=0;i<h.length;i++)e(h[i]);h=b.node.contents(f.get(0));for(var i=0;i<h.length;i++)g+=d(h[i])}return g}function j(a,c,d){a=e(a);var g=a,j=null;if(b.opts.fullPage){var g=b.html.extractNode(a,"body")||(a.indexOf("<body")>=0?"":a);d&&(j=b.html.extractNode(a,"head")||"")}g=i(g,c),j&&(j=i(j,c));var k=h(g,j,a);return f(k)}function k(a){return a.replace(/\u200b/g,"").length==a.length?a:b.clean.exec(a,c)}function l(){var c=b.$el.find(Object.keys(a.FroalaEditor.HTML5Map).join(",")).filter(function(){return""===b.node.attributes(this)});c.length&&(b.selection.save(),c.each(function(){a(this).replaceWith("<"+a.FroalaEditor.HTML5Map[this.tagName]+">"+a(this).html()+"</"+a.FroalaEditor.HTML5Map[this.tagName]+">")}),b.selection.restore())}function m(c){if("PRE"==c.tagName&&o(c),c.nodeType==Node.ELEMENT_NODE&&(c.getAttribute("data-fr-src")&&c.setAttribute("data-fr-src",b.helpers.sanitizeURL(c.getAttribute("data-fr-src"))),c.getAttribute("href")&&c.setAttribute("href",b.helpers.sanitizeURL(c.getAttribute("href"))),["TABLE","TBODY","TFOOT","TR"].indexOf(c.tagName)>=0&&(c.innerHTML=c.innerHTML.trim())),!b.opts.pasteAllowLocalImages&&c.nodeType==Node.ELEMENT_NODE&&"IMG"==c.tagName&&c.getAttribute("data-fr-src")&&0==c.getAttribute("data-fr-src").indexOf("file://"))return c.parentNode.removeChild(c),!1;if(c.nodeType==Node.ELEMENT_NODE&&a.FroalaEditor.HTML5Map[c.tagName]&&""===b.node.attributes(c)){var d=a.FroalaEditor.HTML5Map[c.tagName],e="<"+d+">"+c.innerHTML+"</"+d+">";c.insertAdjacentHTML("beforebegin",e),c=c.previousSibling,c.parentNode.removeChild(c.nextSibling)}if(b.opts.htmlAllowComments||c.nodeType!=Node.COMMENT_NODE)if(c.tagName&&c.tagName.match(v))c.parentNode.removeChild(c);else if(c.tagName&&!c.tagName.match(u))c.outerHTML=c.innerHTML;else{var f=c.attributes;if(f)for(var g=f.length-1;g>=0;g--){var h=f[g];h.nodeName.match(w)||c.removeAttribute(h.nodeName)}}else 0!==c.data.indexOf("[FROALA.EDITOR")&&c.parentNode.removeChild(c)}function n(a){for(var c=b.node.contents(a),d=0;d<c.length;d++)c[d].nodeType!=Node.TEXT_NODE&&n(c[d]);m(a)}function o(a){var b=a.innerHTML;b.indexOf("\n")>=0&&(a.innerHTML=b.replace(/\n/g,"<br>"))}function p(c,d,e,f){"undefined"==typeof d&&(d=[]),"undefined"==typeof e&&(e=[]),"undefined"==typeof f&&(f=!1),c=c.replace(/\u0009/g,"");var g,h=a.merge([],b.opts.htmlAllowedTags);for(g=0;g<d.length;g++)h.indexOf(d[g])>=0&&h.splice(h.indexOf(d[g]),1);var i=a.merge([],b.opts.htmlAllowedAttrs);for(g=0;g<e.length;g++)i.indexOf(e[g])>=0&&i.splice(i.indexOf(e[g]),1);return i.push("data-fr-.*"),i.push("fr-.*"),u=new RegExp("^"+h.join("$|^")+"$","gi"),w=new RegExp("^"+i.join("$|^")+"$","gi"),v=new RegExp("^"+b.opts.htmlRemoveTags.join("$|^")+"$","gi"),c=j(c,n,!0)}function q(){for(var c=b.$el.find("blockquote + blockquote"),d=0;d<c.length;d++){var e=a(c[d]);b.node.attributes(c[d])==b.node.attributes(e.prev().get(0))&&(e.prev().append(e.html()),e.remove())}}function r(){for(var c=b.$el.find("tr").filter(function(){return a(this).find("th").length>0}),d=0;d<c.length;d++){var e=a(c[d]).parents("table:first").find("thead");0===e.length&&(e=a("<thead>"),a(c[d]).parents("table:first").prepend(e),e.append(c[d]))}b.$el.find("table").filter(function(){for(var a=this.previousSibling;a&&a.nodeType==Node.TEXT_NODE&&0==a.textContent.length;)a=a.previousSibling;return!a||b.node.isBlock(a)||"BR"==a.tagName||a.nodeType!=Node.TEXT_NODE&&a.nodeType!=Node.ELEMENT_NODE?!1:!0}).before("<br>");var f=b.html.defaultTag();f&&b.$el.find("td > "+f+", th > "+f).each(function(){""===b.node.attributes(this)&&a(this).replaceWith(this.innerHTML+"<br>")})}function s(){for(var c=b.$el.find("ol + ol, ul + ul"),d=0;d<c.length;d++){var e=a(c[d]);b.node.attributes(c[d])==b.node.attributes(e.prev().get(0))&&(e.prev().append(e.html()),e.remove())}var f=[],g=function(){return!b.node.isList(this.parentNode)};do{if(f.length){var h=f.get(0),i=a("<ul></ul>").insertBefore(a(h));do{var j=h;h=h.nextSibling,i.append(a(j))}while(h&&"LI"==h.tagName)}f=b.$el.find("li").filter(g)}while(f.length>0);var k,l=function(b,c){var d=a(c);0===d.find("LI").length&&(k=!0,d.remove())};do k=!1,b.$el.find("li:empty").remove(),b.$el.find("ul, ol").each(l);while(k===!0);for(var m=b.$el.find("ol, ul").find("> ul, > ol"),n=0;n<m.length;n++){var o=m[n],p=o.previousSibling;p&&("LI"==p.tagName?a(p).append(o):a(o).wrap("<li></li>"))}b.$el.find("li > ul, li > ol").each(function(b,c){if(c.nextSibling){var d=c.nextSibling,e=a("<li>");a(c.parentNode).after(e);do{var f=d;d=d.nextSibling,e.append(f)}while(d)}}),b.$el.find("li > ul, li > ol").each(function(c,d){if(b.node.isFirstSibling(d))a(d).before("<br/>");else if(d.previousSibling&&"BR"==d.previousSibling.tagName){for(var e=d.previousSibling.previousSibling;e&&a(e).hasClass("fr-marker");)e=e.previousSibling;e&&"BR"!=e.tagName&&a(d.previousSibling).remove()}}),b.$el.find("li:empty").remove()}function t(){b.opts.fullPage&&a.merge(b.opts.htmlAllowedTags,["head","title","style","link","base","body","html"])}var u,v,w,x=[],x=[];return{_init:t,html:p,toHTML5:l,tables:r,lists:s,quotes:q,invisibleSpaces:k,exec:j}},a.FroalaEditor.XS=0,a.FroalaEditor.SM=1,a.FroalaEditor.MD=2,a.FroalaEditor.LG=3,a.FroalaEditor.MODULES.helpers=function(b){function c(){var a,b,c=-1;return"Microsoft Internet Explorer"==navigator.appName?(a=navigator.userAgent,b=new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})"),null!==b.exec(a)&&(c=parseFloat(RegExp.$1))):"Netscape"==navigator.appName&&(a=navigator.userAgent,b=new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})"),null!==b.exec(a)&&(c=parseFloat(RegExp.$1))),c}function d(){var a={};if(c()>0)a.msie=!0;else{var b=navigator.userAgent.toLowerCase(),d=/(edge)[ \/]([\w.]+)/.exec(b)||/(chrome)[ \/]([\w.]+)/.exec(b)||/(webkit)[ \/]([\w.]+)/.exec(b)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(b)||/(msie) ([\w.]+)/.exec(b)||b.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(b)||[],e={browser:d[1]||"",version:d[2]||"0"};d[1]&&(a[e.browser]=!0),a.msie&&(a.version=parseInt(e.version,10)),a.chrome?a.webkit=!0:a.webkit&&(a.safari=!0)}return a}function e(){return/(iPad|iPhone|iPod)/g.test(navigator.userAgent)&&!h()}function f(){return/(Android)/g.test(navigator.userAgent)&&!h()}function g(){return/(Blackberry)/g.test(navigator.userAgent)}function h(){return/(Windows Phone)/gi.test(navigator.userAgent)}function i(){return f()||e()||g()}function j(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)}}function k(a){return parseInt(a,10)||0}function l(){var b=a('<div class="fr-visibility-helper"></div>').appendTo("body"),c=k(b.css("margin-left"));return b.remove(),c}function m(){return"ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch}function n(a){if(!/^(https?:|ftps?:|)\/\//.test(a))return!1;a=String(a).replace(/</g,"%3C").replace(/>/g,"%3E").replace(/"/g,"%22").replace(/ /g,"%20");var b=/\(?(?:(https?:|ftps?:|)\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|(?:www.)?(?:[^\W\s]|\.|-)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;return b.test(a)}function o(a){if(/^(https?:|ftps?:|)\/\//.test(a)){if(!n(a))return""}else a=encodeURIComponent(a).replace(/%23/g,"#").replace(/%2F/g,"/").replace(/%25/g,"%").replace(/mailto%3A/g,"mailto:").replace(/file%3A/g,"file:").replace(/sms%3A/g,"sms:").replace(/tel%3A/g,"tel:").replace(/notes%3A/g,"notes:").replace(/data%3Aimage/g,"data:image").replace(/webkit-fake-url%3A/g,"webkit-fake-url:").replace(/%3F/g,"?").replace(/%3D/g,"=").replace(/%26/g,"&").replace(/&amp;/g,"&").replace(/%2C/g,",").replace(/%3B/g,";").replace(/%2B/g,"+").replace(/%40/g,"@");return a}function p(a){return a&&!a.propertyIsEnumerable("length")&&"object"==typeof a&&"number"==typeof a.length}function q(a){function b(a){return("0"+parseInt(a,10).toString(16)).slice(-2)}try{return a&&"transparent"!==a?/^#[0-9A-F]{6}$/i.test(a)?a:(a=a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/),("#"+b(a[1])+b(a[2])+b(a[3])).toUpperCase()):""}catch(c){return null}}function r(a){var b=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;a=a.replace(b,function(a,b,c,d){return b+b+c+c+d+d});var c=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);return c?"rgb("+parseInt(c[1],16)+", "+parseInt(c[2],16)+", "+parseInt(c[3],16)+")":""}function s(b){var c=(b.css("text-align")||"").replace(/-(.*)-/g,"");if(["left","right","justify","center"].indexOf(c)<0){if(!u){var d=a('<div dir="auto" style="text-align: initial; position: fixed; left: -3000px;"><span id="s1">.</span><span id="s2">.</span></div>');a("body").append(d);var e=d.find("#s1").get(0).getBoundingClientRect().left,f=d.find("#s2").get(0).getBoundingClientRect().left;d.remove(),u=f>e?"left":"right"}c=u}return c}function t(){b.browser=d(),b.ie_version=c()}var u;return{_init:t,isIOS:e,isAndroid:f,isBlackberry:g,isWindowsPhone:h,isMobile:i,requestAnimationFrame:j,getPX:k,screenSize:l,isTouch:m,sanitizeURL:o,isArray:p,RGBToHex:q,HEXtoRGB:r,isURL:n,getAlignment:s}},a.FroalaEditor.MODULES.events=function(b){function c(a,c,d){a.on(c.split(" ").join("."+b.id+" ")+"."+b.id,d),r("destroy",function(){a.off(c.split(" ").join("."+b.id+" ")+"."+b.id)})}function d(){c(b.$el,"cut copy paste beforepaste",function(a){s(a.type,[a])})}function e(){c(b.$el,"click mouseup mousedown touchstart touchend dragenter dragover dragleave dragend drop dragstart",function(a){s(a.type,[a])})}function f(){c(b.$el,"keydown keypress keyup input",function(a){s(a.type,[a])})}function g(){c(b.$window,b._mousedown,function(a){s("window.mousedown",[a]),n()}),c(b.$window,b._mouseup,function(a){s("window.mouseup",[a])}),c(b.$window,"keydown keyup touchmove",function(a){s("window."+a.type,[a])})}function h(){c(b.$document,"dragend drop",function(a){s("document."+a.type,[a])})}function i(c){if("undefined"==typeof c&&(c=!0),!b.$wp)return!1;if(!b.core.hasFocus()&&c)return b.$el.focus(),!1;if(!b.core.hasFocus()||b.$el.find(".fr-marker").length>0)return!1;var d=b.selection.info(b.$el.get(0));if(d.atStart&&b.selection.isCollapsed()&&null!=b.html.defaultTag()){var e=b.markers.insert();if(e&&!b.node.blockParent(e)){a(e).remove();var f=b.$el.find(b.html.blockTagsQuery()).get(0);f&&(a(f).prepend(a.FroalaEditor.MARKERS),b.selection.restore())}else e&&a(e).remove()}}function j(){c(b.$el,"focus",function(a){p()&&(i(!1),y===!1&&s(a.type,[a]))}),c(b.$el,"blur",function(a){p()&&y===!0&&s(a.type,[a])}),r("focus",function(){y=!0}),r("blur",function(){y=!1})}function k(){b.helpers.isMobile()?(b._mousedown="touchstart",b._mouseup="touchend",b._move="touchmove",b._mousemove="touchmove"):(b._mousedown="mousedown",b._mouseup="mouseup",b._move="",b._mousemove="mousemove")}function l(c){var d=a(c.currentTarget);return b.edit.isDisabled()||d.hasClass("fr-disabled")?(c.preventDefault(),!1):"mousedown"===c.type&&1!==c.which?!0:(b.helpers.isMobile()||c.preventDefault(),(b.helpers.isAndroid()||b.helpers.isWindowsPhone())&&0===d.parents(".fr-dropdown-menu").length&&(c.preventDefault(),c.stopPropagation()),d.addClass("fr-selected"),void b.events.trigger("commands.mousedown",[d]))}function m(c,d){var e=a(c.currentTarget);if(b.edit.isDisabled()||e.hasClass("fr-disabled"))return c.preventDefault(),!1;if("mouseup"===c.type&&1!==c.which)return!0;if(!e.hasClass("fr-selected"))return!0;if("touchmove"!=c.type){if(c.stopPropagation(),c.stopImmediatePropagation(),c.preventDefault(),!e.hasClass("fr-selected"))return a(".fr-selected").removeClass("fr-selected"),!1;if(a(".fr-selected").removeClass("fr-selected"),e.data("dragging")||e.attr("disabled"))return e.removeData("dragging"),!1;var f=e.data("timeout");f&&(clearTimeout(f),e.removeData("timeout")),d.apply(b,[c])}else e.data("timeout")||e.data("timeout",setTimeout(function(){e.data("dragging",!0)},100))}function n(){w=!0}function o(){w=!1}function p(){return w}function q(a,c,d){a.on(b._mousedown,c,function(a){l(a)}),a.on(b._mouseup+" "+b._move,c,function(a){m(a,d)}),a.on("mousedown click mouseup",c,function(a){a.stopPropagation()}),r("window.mouseup",function(){a.find(c).removeClass("fr-selected"),n()}),r("destroy",function(){a.off(b._mousedown,c),a.off(b._mouseup+" "+b._move)})}function r(a,b,c){"undefined"==typeof c&&(c=!1);var d=x[a]=x[a]||[];c?d.unshift(b):d.push(b)}function s(c,d,e){if(!b.edit.isDisabled()||e){var f,g=x[c];if(g)for(var h=0;h<g.length;h++)if(f=g[h].apply(b,d),f===!1)return!1;return f=b.$original_element.triggerHandler("froalaEditor."+c,a.merge([b],d||[])),f===!1?!1:f}}function t(c,d,e){if(!b.edit.isDisabled()||e){var f,g=x[c];if(g)for(var h=0;h<g.length;h++)f=g[h].apply(b,[d]),"undefined"!=typeof f&&(d=f);return f=b.$original_element.triggerHandler("froalaEditor."+c,a.merge([b],[d])),"undefined"!=typeof f&&(d=f),d}}function u(){for(var a in x)delete x[a]}function v(){k(),e(),g(),h(),f(),j(),n(),d(),r("destroy",u)}var w,x={},y=!1;return{_init:v,on:r,trigger:s,bindClick:q,disableBlur:o,enableBlur:n,blurActive:p,focus:i,chainTrigger:t}},a.FroalaEditor.INVISIBLE_SPACE="&#8203;",a.FroalaEditor.START_MARKER='<span class="fr-marker" data-id="0" data-type="true" style="display: none; line-height: 0;">'+a.FroalaEditor.INVISIBLE_SPACE+"</span>",a.FroalaEditor.END_MARKER='<span class="fr-marker" data-id="0" data-type="false" style="display: none; line-height: 0;">'+a.FroalaEditor.INVISIBLE_SPACE+"</span>",a.FroalaEditor.MARKERS=a.FroalaEditor.START_MARKER+a.FroalaEditor.END_MARKER,a.FroalaEditor.MODULES.markers=function(b){function c(c,d){return a('<span class="fr-marker" data-id="'+d+'" data-type="'+c+'" style="display: '+(b.browser.safari?"none":"inline-block")+'; line-height: 0;">'+a.FroalaEditor.INVISIBLE_SPACE+"</span>",b.document)[0]}function d(d,e,f){try{var g=d.cloneRange();if(g.collapse(e),g.insertNode(c(e,f)),e===!0&&d.collapsed)for(var h=b.$el.find('span.fr-marker[data-type="true"][data-id="'+f+'"]').get(0).nextSibling;h&&h.nodeType===Node.TEXT_NODE&&0===h.textContent.length;)a(h).remove(),h=b.$el.find('span.fr-marker[data-type="true"][data-id="'+f+'"]').get(0).nextSibling;if(e===!0&&!d.collapsed){var e=b.$el.find('span.fr-marker[data-type="true"][data-id="'+f+'"]').get(0),h=e.nextSibling;if(h&&h.nodeType===Node.ELEMENT_NODE&&b.node.isBlock(h)){var i=[h];do h=i[0],i=b.node.contents(h);while(i[0]&&b.node.isBlock(i[0]));a(h).prepend(a(e))}}if(e===!1&&!d.collapsed){var e=b.$el.find('span.fr-marker[data-type="false"][data-id="'+f+'"]').get(0),h=e.previousSibling;if(h&&h.nodeType===Node.ELEMENT_NODE&&b.node.isBlock(h)){var i=[h];do h=i[i.length-1],i=b.node.contents(h);while(i[i.length-1]&&b.node.isBlock(i[i.length-1]));a(h).append(a(e))}e.parentNode&&["TD","TH"].indexOf(e.parentNode.tagName)>=0&&e.parentNode.previousSibling&&!e.previousSibling&&a(e.parentNode.previousSibling).append(e)}return e}catch(j){return null}}function e(){if(!b.$wp)return null;try{var c=b.selection.ranges(0),d=c.commonAncestorContainer;if(d!=b.$el.get(0)&&0==b.$el.find(d).length)return null;var e=c.cloneRange(),f=c.cloneRange();e.collapse(!0);var g=a('<span class="fr-marker" style="display: none; line-height: 0;">'+a.FroalaEditor.INVISIBLE_SPACE+"</span>",b.document)[0];if(e.insertNode(g),g=b.$el.find("span.fr-marker").get(0)){for(var h=g.nextSibling;h&&h.nodeType===Node.TEXT_NODE&&0===h.textContent.length;)a(h).remove(),h=b.$el.find("span.fr-marker").get(0).nextSibling;return b.selection.clear(),b.selection.get().addRange(f),g}return null}catch(i){}}function f(){b.selection.isCollapsed()||b.selection.remove();var c=b.$el.find(".fr-marker").get(0);if(null==c&&(c=e()),null==c)return null;var d;if(d=b.node.deepestParent(c))if(b.node.isBlock(d)&&b.node.isEmpty(d))a(d).replaceWith('<span class="fr-marker"></span>');else{var f=c,g="",h="";do f=f.parentNode,g+=b.node.closeTagString(f),h=b.node.openTagString(f)+h;while(f!=d);a(c).replaceWith('<span id="fr-break"></span>');var i=b.node.openTagString(d)+a(d).html()+b.node.closeTagString(d);i=i.replace(/<span id="fr-break"><\/span>/g,g+'<span class="fr-marker"></span>'+h),a(d).replaceWith(i)}return b.$el.find(".fr-marker").get(0)}function g(a){var c=a.clientX,d=a.clientY;h();var f,g=null;if("undefined"!=typeof b.document.caretPositionFromPoint?(f=b.document.caretPositionFromPoint(c,d),g=b.document.createRange(),g.setStart(f.offsetNode,f.offset),g.setEnd(f.offsetNode,f.offset)):"undefined"!=typeof b.document.caretRangeFromPoint&&(f=b.document.caretRangeFromPoint(c,d),g=b.document.createRange(),g.setStart(f.startContainer,f.startOffset),g.setEnd(f.startContainer,f.startOffset)),null!==g&&"undefined"!=typeof b.window.getSelection){var i=b.window.getSelection();i.removeAllRanges(),i.addRange(g)}else if("undefined"!=typeof b.document.body.createTextRange)try{g=b.document.body.createTextRange(),g.moveToPoint(c,d);var j=g.duplicate();j.moveToPoint(c,d),g.setEndPoint("EndToEnd",j),g.select()}catch(k){return!1}e()}function h(){b.$el.find(".fr-marker").remove()}return{place:d,insert:e,split:f,insertAtPoint:g,remove:h}},a.FroalaEditor.MODULES.selection=function(b){function c(){var a="";return b.window.getSelection?a=b.window.getSelection():b.document.getSelection?a=b.document.getSelection():b.document.selection&&(a=b.document.selection.createRange().text),a.toString()}function d(){var a="";return a=b.window.getSelection?b.window.getSelection():b.document.getSelection?b.document.getSelection():b.document.selection.createRange()}function e(a){var c=d(),e=[];if(c&&c.getRangeAt&&c.rangeCount)for(var e=[],f=0;f<c.rangeCount;f++)e.push(c.getRangeAt(f));else e=b.document.createRange?[b.document.createRange()]:[];return"undefined"!=typeof a?e[a]:e}function f(){var a=d();try{a.removeAllRanges?a.removeAllRanges():a.empty?a.empty():a.clear&&a.clear()}catch(b){}}function g(){var f=d();try{if(f.rangeCount){var g=e(0),h=g.startContainer;if(h.nodeType==Node.ELEMENT_NODE){var i=!1;if(h.childNodes.length>0&&h.childNodes[g.startOffset]){for(var j=h.childNodes[g.startOffset];j&&j.nodeType==Node.TEXT_NODE&&0==j.textContent.length;)j=j.nextSibling;j&&j.textContent.replace(/\u200B/g,"")===c().replace(/\u200B/g,"")&&(h=j,i=!0)}else if(!g.collapsed&&h.nextSibling&&h.nextSibling.nodeType==Node.ELEMENT_NODE){var j=h.nextSibling;j&&j.textContent.replace(/\u200B/g,"")===c().replace(/\u200B/g,"")&&(h=j,i=!0)}!i&&h.childNodes.length>0&&a(h.childNodes[0]).text().replace(/\u200B/g,"")===c().replace(/\u200B/g,"")&&["BR","IMG","HR"].indexOf(h.childNodes[0].tagName)<0&&(h=h.childNodes[0])}for(;h.nodeType!=Node.ELEMENT_NODE&&h.parentNode;)h=h.parentNode;for(var k=h;k&&"HTML"!=k.tagName;){if(k==b.$el.get(0))return h;k=a(k).parent()[0]}}}catch(l){}return b.$el.get(0)}function h(){var f=d();try{if(f.rangeCount){var g=e(0),h=g.endContainer;if(h.nodeType==Node.ELEMENT_NODE){var i=!1;if(h.childNodes.length>0&&h.childNodes[g.endOffset]&&a(h.childNodes[g.endOffset]).text()===c())h=h.childNodes[g.endOffset],i=!0;else if(!g.collapsed&&h.previousSibling&&h.previousSibling.nodeType==Node.ELEMENT_NODE){var j=h.previousSibling;j&&j.textContent.replace(/\u200B/g,"")===c().replace(/\u200B/g,"")&&(h=j,i=!0)}!i&&h.childNodes.length>0&&a(h.childNodes[h.childNodes.length-1]).text()===c()&&["BR","IMG","HR"].indexOf(h.childNodes[h.childNodes.length-1].tagName)<0&&(h=h.childNodes[h.childNodes.length-1])}for(h.nodeType==Node.TEXT_NODE&&0==g.endOffset&&h.previousSibling&&h.previousSibling.nodeType==Node.ELEMENT_NODE&&(h=h.previousSibling);h.nodeType!=Node.ELEMENT_NODE&&h.parentNode;)h=h.parentNode;for(var k=h;k&&"HTML"!=k.tagName;){
if(k==b.$el.get(0))return h;k=a(k).parent()[0]}}}catch(l){}return b.$el.get(0)}function i(a,b){var c=a;return c.nodeType==Node.ELEMENT_NODE&&c.childNodes.length>0&&c.childNodes[b]&&(c=c.childNodes[b]),c.nodeType==Node.TEXT_NODE&&(c=c.parentNode),c}function j(){var c=[],f=d();if(t()&&f.rangeCount)for(var g=e(),h=0;h<g.length;h++){var j=g[h],k=i(j.startContainer,j.startOffset),l=i(j.endContainer,j.endOffset);b.node.isBlock(k)&&c.indexOf(k)<0&&c.push(k);var m=b.node.blockParent(k);m&&c.indexOf(m)<0&&c.push(m);for(var n=[],o=k;o!==l&&o!==b.$el.get(0);)n.indexOf(o)<0&&o.children&&o.children.length?(n.push(o),o=o.children[0]):o.nextSibling?o=o.nextSibling:o.parentNode&&(o=o.parentNode,n.push(o)),b.node.isBlock(o)&&n.indexOf(o)<0&&c.indexOf(o)<0&&c.push(o);b.node.isBlock(l)&&c.indexOf(l)<0&&c.push(l);var m=b.node.blockParent(l);m&&c.indexOf(m)<0&&c.push(m)}for(var h=c.length-1;h>0;h--)a(c[h]).find(c).length&&"LI"!=c[h].tagName&&c.splice(h,1);return c}function k(){if(b.$wp){b.markers.remove();for(var a=e(),c=[],d=0;d<a.length;d++)if(a[d].startContainer!==b.document){var f=a[d],g=f.collapsed,h=b.markers.place(f,!0,d),i=b.markers.place(f,!1,d);if(b.browser.safari&&!g){var f=b.document.createRange();f.setStartAfter(h),f.setEndBefore(i),c.push(f)}}if(b.browser.safari&&c.length){b.selection.clear();for(var d=0;d<c.length;d++)b.selection.get().addRange(c[d])}}}function l(){var c=b.$el.find('.fr-marker[data-type="true"]');if(!b.$wp)return c.remove(),!1;if(0===c.length)return!1;b.core.hasFocus()||b.browser.msie||b.browser.webkit||b.$el.focus(),f();for(var e=d(),g=0;g<c.length;g++){var h=a(c[g]).data("id"),i=c[g],j=b.document.createRange(),k=b.$el.find('.fr-marker[data-type="false"][data-id="'+h+'"]'),l=null;if(k.length>0){k=k[0];try{for(var n=!1,o=i.nextSibling;o&&o.nodeType==Node.TEXT_NODE&&0==o.textContent.length;){var p=o;o=o.nextSibling,a(p).remove()}for(var q=k.nextSibling;q&&q.nodeType==Node.TEXT_NODE&&0==q.textContent.length;){var p=q;q=q.nextSibling,a(p).remove()}if(i.nextSibling==k||k.nextSibling==i){for(var r=i.nextSibling==k?i:k,s=r==i?k:i,t=r.previousSibling;t&&t.nodeType==Node.TEXT_NODE&&0==t.length;){var p=t;t=t.previousSibling,a(p).remove()}if(t&&t.nodeType==Node.TEXT_NODE)for(;t&&t.previousSibling&&t.previousSibling.nodeType==Node.TEXT_NODE;)t.previousSibling.textContent=t.previousSibling.textContent+t.textContent,t=t.previousSibling,a(t.nextSibling).remove();for(var u=s.nextSibling;u&&u.nodeType==Node.TEXT_NODE&&0==u.length;){var p=u;u=u.nextSibling,a(p).remove()}if(u&&u.nodeType==Node.TEXT_NODE)for(;u&&u.nextSibling&&u.nextSibling.nodeType==Node.TEXT_NODE;)u.nextSibling.textContent=u.textContent+u.nextSibling.textContent,u=u.nextSibling,a(u.previousSibling).remove();if(t&&b.node.isVoid(t)&&(t=null),u&&b.node.isVoid(u)&&(u=null),t&&u&&t.nodeType==Node.TEXT_NODE&&u.nodeType==Node.TEXT_NODE){a(i).remove(),a(k).remove();var v=t.textContent.length;t.textContent=t.textContent+u.textContent,a(u).remove(),b.html.normalizeSpaces(t),j.setStart(t,v),j.setEnd(t,v),n=!0}else!t&&u&&u.nodeType==Node.TEXT_NODE?(a(i).remove(),a(k).remove(),b.html.normalizeSpaces(u),l=a(b.document.createTextNode("​")),a(u).before(l),j.setStart(u,0),j.setEnd(u,0),n=!0):!u&&t&&t.nodeType==Node.TEXT_NODE&&(a(i).remove(),a(k).remove(),b.html.normalizeSpaces(t),l=a(b.document.createTextNode("​")),a(t).after(l),j.setStart(t,t.textContent.length),j.setEnd(t,t.textContent.length),n=!0)}if(!n){var w,x;b.browser.chrome&&i.nextSibling==k?(w=m(k,j,!0)||j.setStartAfter(k),x=m(i,j,!1)||j.setEndBefore(i)):(i.previousSibling==k&&(i=k,k=i.nextSibling),k.nextSibling&&"BR"===k.nextSibling.tagName||!k.nextSibling&&b.node.isBlock(i.previousSibling)||i.previousSibling&&"BR"==i.previousSibling.tagName||(i.style.display="inline",k.style.display="inline",l=a(b.document.createTextNode("​"))),w=m(i,j,!0)||a(i).before(l)&&j.setStartBefore(i),x=m(k,j,!1)||a(k).after(l)&&j.setEndAfter(k)),"function"==typeof w&&w(),"function"==typeof x&&x()}}catch(y){}}l&&l.remove(),e.addRange(j)}b.markers.remove()}function m(c,d,e){var f=c.previousSibling,g=c.nextSibling;if(f&&g&&f.nodeType==Node.TEXT_NODE&&g.nodeType==Node.TEXT_NODE){var h=f.textContent.length;return e?(g.textContent=f.textContent+g.textContent,a(f).remove(),a(c).remove(),b.html.normalizeSpaces(g),function(){d.setStart(g,h)}):(f.textContent=f.textContent+g.textContent,a(g).remove(),a(c).remove(),b.html.normalizeSpaces(f),function(){d.setEnd(f,h)})}if(f&&!g&&f.nodeType==Node.TEXT_NODE){var h=f.textContent.length;return e?(b.html.normalizeSpaces(f),function(){d.setStart(f,h)}):(b.html.normalizeSpaces(f),function(){d.setEnd(f,h)})}return g&&!f&&g.nodeType==Node.TEXT_NODE?e?(b.html.normalizeSpaces(g),function(){d.setStart(g,0)}):(b.html.normalizeSpaces(g),function(){d.setEnd(g,0)}):!1}function n(){return!0}function o(){for(var a=e(),b=0;b<a.length;b++)if(!a[b].collapsed)return!1;return!0}function p(a){var c,d,e=!1,f=!1;if(b.window.getSelection){var g=b.window.getSelection();g.rangeCount&&(c=g.getRangeAt(0),d=c.cloneRange(),d.selectNodeContents(a),d.setEnd(c.startContainer,c.startOffset),e=""===d.toString(),d.selectNodeContents(a),d.setStart(c.endContainer,c.endOffset),f=""===d.toString())}else b.document.selection&&"Control"!=b.document.selection.type&&(c=b.document.selection.createRange(),d=c.duplicate(),d.moveToElementText(a),d.setEndPoint("EndToStart",c),e=""===d.text,d.moveToElementText(a),d.setEndPoint("StartToEnd",c),f=""===d.text);return{atStart:e,atEnd:f}}function q(){if(o())return!1;b.$el.find("td").prepend('<span class="fr-mk">'+a.FroalaEditor.INVISIBLE_SPACE+"</span>"),b.$el.find("img").append('<span class="fr-mk">'+a.FroalaEditor.INVISIBLE_SPACE+"</span>");var c=!1,d=p(b.$el.get(0));return d.atStart&&d.atEnd&&(c=!0),b.$el.find(".fr-mk").remove(),c}function r(c,d){"undefined"==typeof d&&(d=!0);var e=a(c).html();e&&e.replace(/\u200b/g,"").length!=e.length&&a(c).html(e.replace(/\u200b/g,""));for(var f=b.node.contents(c),g=0;g<f.length;g++)f[g].nodeType!=Node.ELEMENT_NODE?a(f[g]).remove():(r(f[g],0==g),0==g&&(d=!1));c.nodeType==Node.TEXT_NODE?a(c).replaceWith('<span data-first="true" data-text="true"></span>'):d&&a(c).attr("data-first",!0)}function s(c,d){var e=b.node.contents(c.get(0));["TD","TH"].indexOf(c.get(0).tagName)>=0&&1==c.find(".fr-marker").length&&a(e[0]).hasClass("fr-marker")&&c.attr("data-del-cell",!0);for(var f=0;f<e.length;f++){var g=e[f];a(g).hasClass("fr-marker")?d=(d+1)%2:d?a(g).find(".fr-marker").length>0?d=s(a(g),d):["TD","TH"].indexOf(g.tagName)<0&&!a(g).hasClass("fr-inner")?!b.opts.keepFormatOnDelete||d>1||b.$el.find("[data-first]").length>0?a(g).remove():r(g):a(g).hasClass("fr-inner")?0==a(g).find(".fr-inner").length?a(g).html("<br>"):a(g).find(".fr-inner").filter(function(){return 0==a(this).find("fr-inner").length}).html("<br>"):(a(g).empty(),a(g).attr("data-del-cell",!0)):a(g).find(".fr-marker").length>0&&(d=s(a(g),d))}return d}function t(){try{if(!b.$wp)return!1;for(var a=e(0),c=a.commonAncestorContainer;c&&!b.node.isElement(c);)c=c.parentNode;return b.node.isElement(c)?!0:!1}catch(d){return!1}}function u(){k();for(var c=function(b){for(var c=b.previousSibling;c&&c.nodeType==Node.TEXT_NODE&&0==c.textContent.length;){var d=c,c=c.previousSibling;a(d).remove()}return c},d=function(b){for(var c=b.nextSibling;c&&c.nodeType==Node.TEXT_NODE&&0==c.textContent.length;){var d=c,c=c.nextSibling;a(d).remove()}return c},e=b.$el.find('.fr-marker[data-type="true"]'),f=0;f<e.length;f++)for(var g=e[f];!c(g)&&!b.node.isBlock(g.parentNode);)a(g.parentNode).before(g);for(var h=b.$el.find('.fr-marker[data-type="false"]'),f=0;f<h.length;f++)for(var i=h[f];!d(i)&&!b.node.isBlock(i.parentNode);)a(i.parentNode).after(i);if(n()){s(b.$el,0);var j=b.$el.find('[data-first="true"]');if(j.length)b.$el.find(".fr-marker").remove(),j.append(a.FroalaEditor.INVISIBLE_SPACE+a.FroalaEditor.MARKERS).removeAttr("data-first"),j.attr("data-text")&&j.replaceWith(j.html());else{b.$el.find("table").filter(function(){var b=a(this).find("[data-del-cell]").length>0&&a(this).find("[data-del-cell]").length==a(this).find("td, th").length;return b}).remove(),b.$el.find("[data-del-cell]").removeAttr("data-del-cell");for(var e=b.$el.find('.fr-marker[data-type="true"]'),f=0;f<e.length;f++){var m=e[f],o=m.nextSibling,p=b.$el.find('.fr-marker[data-type="false"][data-id="'+a(m).data("id")+'"]').get(0);if(p){if(o&&o==p);else if(m){var q=b.node.blockParent(m),r=b.node.blockParent(p);if(a(m).after(p),q==r);else if(null==q){var t=b.node.deepestParent(m);t?(a(t).after(a(r).html()),a(r).remove()):0==a(r).parentsUntil(b.$el,"table").length&&(a(m).next().after(a(r).html()),a(r).remove())}else if(null==r&&0==a(q).parentsUntil(b.$el,"table").length){for(var o=q;!o.nextSibling&&o.parentNode!=b.$el.get(0);)o=o.parentNode;for(o=o.nextSibling;o&&"BR"!=o.tagName;){var u=o.nextSibling;a(q).append(o),o=u}}else 0==a(q).parentsUntil(b.$el,"table").length&&0==a(r).parentsUntil(b.$el,"table").length&&(a(q).append(a(r).html()),a(r).remove())}}else p=a(m).clone().attr("data-type",!1),a(m).after(p)}}}b.opts.keepFormatOnDelete||b.html.fillEmptyBlocks(!0),b.html.cleanEmptyTags(!0),b.clean.lists(),b.html.normalizeSpaces(),l()}function v(c){if(a(c).find(".fr-marker").length>0)return!1;for(var d=b.node.contents(c);d.length&&b.node.isBlock(d[0]);)c=d[0],d=b.node.contents(c);a(c).prepend(a.FroalaEditor.MARKERS)}function w(c){if(a(c).find(".fr-marker").length>0)return!1;for(var d=b.node.contents(c);d.length&&b.node.isBlock(d[d.length-1]);)c=d[d.length-1],d=b.node.contents(c);a(c).append(a.FroalaEditor.MARKERS)}function x(c){for(var d=c.previousSibling;d&&d.nodeType==Node.TEXT_NODE&&0==d.textContent.length;)d=d.previousSibling;return d?(b.node.isBlock(d)?w(d):"BR"==d.tagName?a(d).before(a.FroalaEditor.MARKERS):a(d).after(a.FroalaEditor.MARKERS),!0):!1}function y(c){for(var d=c.nextSibling;d&&d.nodeType==Node.TEXT_NODE&&0==d.textContent.length;)d=d.nextSibling;return d?(b.node.isBlock(d)?v(d):a(d).before(a.FroalaEditor.MARKERS),!0):!1}return{text:c,get:d,ranges:e,clear:f,element:g,endElement:h,save:k,restore:l,isCollapsed:o,isFull:q,inEditor:t,remove:u,blocks:j,info:p,setAtEnd:w,setAtStart:v,setBefore:x,setAfter:y,rangeElement:i}},a.FroalaEditor.UNICODE_NBSP=String.fromCharCode(160),a.FroalaEditor.VOID_ELEMENTS=["area","base","br","col","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"],a.FroalaEditor.BLOCK_TAGS=["p","div","h1","h2","h3","h4","h5","h6","pre","blockquote","ul","ol","li","table","td","th","thead","tfoot","tbody","tr","hr","dl","dt","dd","form"],a.extend(a.FroalaEditor.DEFAULTS,{htmlAllowedEmptyTags:["textarea","a","iframe","object","video","style","script",".fa"],htmlDoNotWrapTags:["script","style"],htmlSimpleAmpersand:!1}),a.FroalaEditor.MODULES.html=function(b){function c(){return b.opts.enter==a.FroalaEditor.ENTER_P?"p":b.opts.enter==a.FroalaEditor.ENTER_DIV?"div":b.opts.enter==a.FroalaEditor.ENTER_BR?null:void 0}function d(c){"undefined"==typeof c&&(c=!1);var d,g,h=[];if(c)for(d=b.$el.find(f()),g=0;g<d.length;g++){for(var i=b.node.contents(d[g]),j=!1,k=0;k<i.length;k++)if(i[k].nodeType!=Node.COMMENT_NODE&&(i[k].nodeType==Node.ELEMENT_NODE&&(a.FroalaEditor.VOID_ELEMENTS.indexOf(i[k].tagName.toLowerCase())>=0||i[k].querySelectorAll(b.opts.htmlAllowedEmptyTags.join(",")).length>0)||i[k].textContent&&i[k].textContent.replace(/\u200B/g,"").length>0)){j=!0;break}j||0!==a(d[g]).find(f()).length||h.push(d[g])}else for(d=b.$el.find(e()),g=0;g<d.length;g++)0===a(d[g]).find(f()).length&&h.push(d[g]);return a(a.makeArray(h))}function e(){return a.FroalaEditor.BLOCK_TAGS.join(":empty, ")+":empty"}function f(){return a.FroalaEditor.BLOCK_TAGS.join(", ")}function g(){var c=a.merge(["TD","TH"],a.FroalaEditor.VOID_ELEMENTS);c=a.merge(c,b.opts.htmlAllowedEmptyTags);var d,e;do{e=!1,d=b.$el.get(0).querySelectorAll("*:empty:not("+c.join("):not(")+"):not(.fr-marker)");for(var f=0;f<d.length;f++)(0===d[f].attributes.length||"undefined"!=typeof d[f].getAttribute("href"))&&(a(d[f]).remove(),e=!0);d=b.$el.get(0).querySelectorAll("*:empty:not("+c.join("):not(")+"):not(.fr-marker)")}while(d.length&&e)}function h(d,e){var f=c();if(e&&(f='div class="fr-temp-div"'),f)for(var g=b.node.contents(d.get(0)),h=null,i=0;i<g.length;i++){var j=g[i];if(j.nodeType==Node.ELEMENT_NODE&&(b.node.isBlock(j)||a(j).is(b.opts.htmlDoNotWrapTags.join(","))))h=null;else if(j.nodeType!=Node.ELEMENT_NODE&&j.nodeType!=Node.TEXT_NODE)h=null;else if(j.nodeType==Node.ELEMENT_NODE&&"BR"==j.tagName)if(null==h)e?a(j).replaceWith("<"+f+' data-empty="true"><br></div>'):a(j).replaceWith("<"+f+"><br></"+f+">");else{a(j).remove();for(var k=b.node.contents(h),l=!1,m=0;m<k.length;m++)if(!a(k[m]).hasClass("fr-marker")&&(k[m].nodeType!=Node.TEXT_NODE||0!==k[m].textContent.replace(/ /g,"").length)){l=!0;break}l===!1&&(h.append("<br>"),h.data("empty",!0)),h=null}else j.nodeType==Node.TEXT_NODE&&0==a(j).text().trim().length?a(j).remove():(null==h&&(h=a("<"+f+">"),a(j).before(h)),j.nodeType==Node.TEXT_NODE&&a(j).text().trim().length>0?(h.append(a(j).clone()),a(j).remove()):h.append(a(j)))}}function i(c,d,e){return b.$wp?("undefined"==typeof c&&(c=!1),"undefined"==typeof d&&(d=!1),"undefined"==typeof e&&(e=!1),h(b.$el,c),b.$el.find(".fr-inner").each(function(){h(a(this),c)}),d&&b.$el.find("td, th").each(function(){h(a(this),c)}),void(e&&b.$el.find("blockquote").each(function(){h(a(this),c)}))):!1}function j(){b.$el.find("div.fr-temp-div").each(function(){a(this).data("empty")||"LI"==this.parentNode.tagName?a(this).replaceWith(a(this).html()):a(this).replaceWith(a(this).html()+"<br>")}),b.$el.find(".fr-temp-div").removeClass("fr-temp-div").filter(function(){return""==a(this).attr("class")}).removeAttr("class")}function k(b){d(b).not("hr").filter(function(){return"false"!=a(this).attr("contenteditable")&&0==a(this).find("br").length}).append("<br/>")}function l(){return b.$el.find(f())}function m(a){"undefined"==typeof a&&(a=b.$el.get(0));for(var c=b.node.contents(a),d=c.length-1;d>=0;d--)if(c[d].nodeType==Node.TEXT_NODE){c[d].textContent=c[d].textContent.replace(/(?!^)( ){2,}(?!$)/g," "),c[d].textContent=c[d].textContent.replace(/\n/g," "),c[d].textContent=c[d].textContent.replace(/^  /g," "),c[d].textContent=c[d].textContent.replace(/  $/g," "),c[d].previousSibling||(c[d].textContent=c[d].textContent.replace(/^ */,"")),c[d].nextSibling||(c[d].textContent=c[d].textContent.replace(/ *$/,"")),c[d].previousSibling&&c[d].nextSibling&&" "==c[d].textContent&&(c[d].textContent="\n")}else m(c[d])}function n(a){return a&&(b.node.isBlock(a)||["STYLE","SCRIPT","HEAD","BR","HR"].indexOf(a.tagName)>=0||a.nodeType==Node.COMMENT_NODE)}function o(c){if("undefined"==typeof c&&(c=b.$el.get(0)),c.nodeType==Node.ELEMENT_NODE&&["STYLE","SCRIPT","HEAD"].indexOf(c.tagName)<0)for(var d=b.node.contents(c),e=d.length-1;e>=0;e--)a(d[e]).hasClass("fr-marker")||o(d[e]);else if(c.nodeType==Node.TEXT_NODE&&c.textContent.length>0){var f=c.previousSibling,g=c.nextSibling;if(n(f)&&n(g)&&0===c.textContent.trim().length)a(c).remove();else{var h=c.textContent;h=h.replace(new RegExp(a.FroalaEditor.UNICODE_NBSP,"g")," ");for(var i="",j=0;j<h.length;j++)i+=32!=h.charCodeAt(j)||0!==j&&32!=i.charCodeAt(j-1)?h[j]:a.FroalaEditor.UNICODE_NBSP;c.nextSibling||(i=i.replace(/ $/,a.FroalaEditor.UNICODE_NBSP)),c.previousSibling&&!b.node.isVoid(c.previousSibling)&&(i=i.replace(/^\u00A0([^ $])/," $1")),i=i.replace(/([^ \u00A0])\u00A0([^ \u00A0])/g,"$1 $2"),c.textContent!=i&&(c.textContent=i)}}}function p(c){if("undefined"==typeof c&&(c=b.$el.get(0)),c.nodeType==Node.ELEMENT_NODE&&["STYLE","SCRIPT","HEAD"].indexOf(c.tagName)<0){for(var d=b.node.contents(c),e=d.length-1;e>=0;e--)if(!a(d[e]).hasClass("fr-marker")){var f=p(d[e]);if(1==f)return!0}}else if(c.nodeType==Node.TEXT_NODE&&c.textContent.length>0){var g=c.previousSibling,h=c.nextSibling;if(n(g)&&n(h)&&0===c.textContent.trim().length)return!0;var i=c.textContent;i=i.replace(new RegExp(a.FroalaEditor.UNICODE_NBSP,"g")," ");for(var j="",k=0;k<i.length;k++)j+=32!=i.charCodeAt(k)||0!==k&&32!=j.charCodeAt(k-1)?i[k]:a.FroalaEditor.UNICODE_NBSP;if(c.nextSibling||(j=j.replace(/ $/,a.FroalaEditor.UNICODE_NBSP)),c.previousSibling&&!b.node.isVoid(c.previousSibling)&&(j=j.replace(/^\u00A0([^ $])/," $1")),j=j.replace(/([^ \u00A0])\u00A0([^ \u00A0])/g,"$1 $2"),c.textContent!=j)return!0}return!1}function q(a,b,c){var d=new RegExp(b,"gi"),e=d.exec(a);return e?e[c]:null}function r(a,b){var c=a.match(/<!DOCTYPE ?([^ ]*) ?([^ ]*) ?"?([^"]*)"? ?"?([^"]*)"?>/i);return c?b.implementation.createDocumentType(c[1],c[3],c[4]):b.implementation.createDocumentType("html")}function s(a){var b=a.doctype,c="<!DOCTYPE html>";return b&&(c="<!DOCTYPE "+b.name+(b.publicId?' PUBLIC "'+b.publicId+'"':"")+(!b.publicId&&b.systemId?" SYSTEM":"")+(b.systemId?' "'+b.systemId+'"':"")+">"),c}function t(){i(),m(),g(),o(),k(!0),b.clean.quotes(),b.clean.lists(),b.clean.tables(),b.clean.toHTML5(),b.clean.quotes(),b.placeholder.refresh(),b.selection.restore(),u()}function u(){b.core.isEmpty()&&(null!=c()?0===b.$el.find(f()).length&&0==b.$el.find(b.opts.htmlDoNotWrapTags.join(",")).length&&(b.core.hasFocus()?(b.$el.html("<"+c()+">"+a.FroalaEditor.MARKERS+"<br/></"+c()+">"),b.selection.restore()):b.$el.html("<"+c()+"><br/></"+c()+">")):0===b.$el.find("*:not(.fr-marker):not(br)").length&&(b.core.hasFocus()?(b.$el.html(a.FroalaEditor.MARKERS+"<br/>"),b.selection.restore()):b.$el.html("<br/>")))}function v(a,b){return q(a,"<"+b+"[^>]*?>([\\w\\W]*)</"+b+">",1)}function w(c,d){var e=a("<div "+(q(c,"<"+d+"([^>]*?)>",1)||"")+">");return b.node.rawAttributes(e.get(0))}function x(a){return q(a,"<!DOCTYPE([^>]*?)>",0)||"<!DOCTYPE html>"}function y(a){var c=b.clean.html(a,[],[],b.opts.fullPage);if(c=c.replace(/\r|\n/g," "),b.opts.fullPage){var d=v(c,"body")||(c.indexOf("<body")>=0?"":c),e=w(c,"body"),f=v(c,"head")||"<title></title>",g=w(c,"head"),h=x(c),i=w(c,"html");b.$el.html(d),b.node.clearAttributes(b.$el.get(0)),b.$el.attr(e),b.$head.html(f),b.node.clearAttributes(b.$head.get(0)),b.$head.attr(g),b.node.clearAttributes(b.$html.get(0)),b.$html.attr(i),b.iframe_document.doctype.parentNode.replaceChild(r(h,b.iframe_document),b.iframe_document.doctype)}else b.$el.html(c);b.edit.on(),b.core.injectStyle(b.opts.iframeStyle),t(),b.$el.find("[fr-original-class]").each(function(){this.setAttribute("class",this.getAttribute("fr-original-class")),this.removeAttribute("fr-original-class")}),b.$el.find("[fr-original-style]").each(function(){this.setAttribute("style",this.getAttribute("fr-original-style")),this.removeAttribute("fr-original-style")}),b.events.trigger("html.set")}function z(a,c){var d="";b.events.trigger("html.beforeGet");var e,f=function(a){var b=/(#[^\s\+>~\.\[:]+)/g,c=/(\[[^\]]+\])/g,d=/(\.[^\s\+>~\.\[:]+)/g,e=/(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi,f=/(:[\w-]+\([^\)]*\))/gi,g=/(:[^\s\+>~\.\[:]+)/g,h=/([^\s\+>~\.\[:]+)/g;!function(){var b=/:not\(([^\)]*)\)/g;b.test(a)&&(a=a.replace(b,"     $1 "))}();var i=100*(a.match(b)||[]).length+10*(a.match(c)||[]).length+10*(a.match(d)||[]).length+10*(a.match(f)||[]).length+10*(a.match(g)||[]).length+(a.match(e)||[]).length;return a=a.replace(/[\*\s\+>~]/g," "),a=a.replace(/[#\.]/g," "),i+=(a.match(h)||[]).length},g=[],h={};if(!b.opts.useClasses&&!c){for(e=0;e<b.document.styleSheets.length;e++){var i,j=0;try{i=b.document.styleSheets[e].cssRules,b.document.styleSheets[e].ownerNode&&"STYLE"==b.document.styleSheets[e].ownerNode.nodeType&&(j=1)}catch(k){}if(i)for(var l=0,m=i.length;m>l;l++){var n=b.opts.iframe?"body ":".fr-view ";if(i[l].selectorText&&0===i[l].selectorText.indexOf(n)&&i[l].style.cssText.length>0)for(var o=i[l].selectorText.replace(n,"").replace(/::/g,":"),p=b.$el.get(0).querySelectorAll(o),q=0;q<p.length;q++){!p[q].getAttribute("fr-original-style")&&p[q].getAttribute("style")?(p[q].setAttribute("fr-original-style",p[q].getAttribute("style")),g.push(p[q])):p[q].getAttribute("fr-original-style")||g.push(p[q]),h[p[q]]||(h[p[q]]={});for(var r=1e3*j+f(i[l].selectorText),t=i[l].style.cssText.split(";"),u=0;u<t.length;u++){var v=t[u].trim().split(":")[0];h[p[q]][v]||(h[p[q]][v]=0,(p[q].getAttribute("fr-original-style")||"").indexOf(v+":")>=0&&(h[p[q]][v]=1e4)),r>=h[p[q]][v]&&(h[p[q]][v]=r,p[q].setAttribute("style",(p[q].getAttribute("style")||"")+t[u]+";"))}}}}for(e=0;e<g.length;e++){g[e].getAttribute("class")&&(g[e].setAttribute("fr-original-class",g[e].getAttribute("class")),g[e].removeAttribute("class"));var w=g[e].getAttribute("style");w&&g[e].setAttribute("style",w.split(";").sort(function(a,b){return a=a.split(":")[0],b=b.split(":")[0],""==a||""==b?-1:a.localeCompare(b)}).join("; ").trim())}}if(b.core.isEmpty()?b.opts.fullPage&&(d=s(b.iframe_document),d+="<html"+b.node.attributes(b.$html.get(0))+">"+b.$html.find("head").get(0).outerHTML+"<body></body></html>"):("undefined"==typeof a&&(a=!1),b.opts.fullPage?(d=s(b.iframe_document),d+="<html"+b.node.attributes(b.$html.get(0))+">"+b.$html.html()+"</html>"):d=b.$el.html()),!b.opts.useClasses&&!c)for(e=0;e<g.length;e++)g[e].getAttribute("fr-original-class")&&(g[e].setAttribute("class",g[e].getAttribute("fr-original-class")),g[e].removeAttribute("fr-original-class")),g[e].getAttribute("fr-original-style")?(g[e].setAttribute("style",g[e].getAttribute("fr-original-style")),g[e].removeAttribute("fr-original-style")):g[e].removeAttribute("style");b.opts.fullPage&&(d=d.replace(/<style data-fr-style="true">(?:[\w\W]*?)<\/style>/g,""),d=d.replace(/<style(?:[\w\W]*?)class="firebugResetStyles"(?:[\w\W]*?)>(?:[\w\W]*?)<\/style>/g,""),d=d.replace(/<body((?:[\w\W]*?)) spellcheck="true"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g,"<body$1$2>$3</body>"),d=d.replace(/<body((?:[\w\W]*?)) contenteditable="(true|false)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g,"<body$1$3>$4</body>"),d=d.replace(/<body((?:[\w\W]*?)) dir="([\w]*)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g,"<body$1$3>$4</body>"),d=d.replace(/<body((?:[\w\W]*?))class="([\w\W]*?)(fr-rtl|fr-ltr)([\w\W]*?)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g,'<body$1class="$2$4"$5>$6</body>'),d=d.replace(/<body((?:[\w\W]*?)) class=""((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g,"<body$1$2>$3</body>")),b.opts.htmlSimpleAmpersand&&(d=d.replace(/\&amp;/gi,"&")),b.events.trigger("html.afterGet"),a||(d=d.replace(/<span[^>]*? class\s*=\s*["']?fr-marker["']?[^>]+>\u200b<\/span>/gi,"")),d=b.clean.invisibleSpaces(d);var x=b.events.chainTrigger("html.get",d);return"string"==typeof x&&(d=x),d=d.replace(/<pre(?:[\w\W]*?)>(?:[\w\W]*?)<\/pre>/g,function(a){return a.replace(/<br>/g,"\n")})}function A(){var c=function(c,d){for(;d&&(d.nodeType==Node.TEXT_NODE||!b.node.isBlock(d));)d&&d.nodeType!=Node.TEXT_NODE&&a(c).wrapInner(b.node.openTagString(d)+b.node.closeTagString(d)),d=d.parentNode;d&&c.innerHTML==d.innerHTML&&(c.innerHTML=d.outerHTML)},d=function(){var c,d=null;return b.window.getSelection?(c=b.window.getSelection(),c&&c.rangeCount&&(d=c.getRangeAt(0).commonAncestorContainer,d.nodeType!=Node.ELEMENT_NODE&&(d=d.parentNode))):(c=b.document.selection)&&"Control"!=c.type&&(d=c.createRange().parentElement()),null!=d&&(a.inArray(b.$el.get(0),a(d).parents())>=0||d==b.$el.get(0))?d:null},e="";if("undefined"!=typeof b.window.getSelection){b.browser.mozilla&&(b.selection.save(),b.$el.find('.fr-marker[data-type="false"]').length>1&&(b.$el.find('.fr-marker[data-type="false"][data-id="0"]').remove(),b.$el.find('.fr-marker[data-type="false"]:last').attr("data-id","0"),b.$el.find(".fr-marker").not('[data-id="0"]').remove()),b.selection.restore());for(var f=b.selection.ranges(),g=0;g<f.length;g++){var h=document.createElement("div");h.appendChild(f[g].cloneContents()),c(h,d()),a(h).find(".fr-element").length>0&&(h=b.$el.get(0)),e+=h.innerHTML}}else"undefined"!=typeof b.document.selection&&"Text"==b.document.selection.type&&(e=b.document.selection.createRange().htmlText);return e}function B(b){var c=a("<div>").html(b);return c.find(f()).length>0}function C(a){var c=b.document.createElement("div");return c.innerHTML=a,b.selection.setAtEnd(c),c.innerHTML}function D(a){return a.replace(/</gi,"&lt;").replace(/>/gi,"&gt;").replace(/"/gi,"&quot;").replace(/'/gi,"&apos;")}function E(c,d,e){b.selection.isCollapsed()||b.selection.remove();var f;if(f=d?c:b.clean.html(c),f=f.replace(/\r|\n/g," "),c.indexOf('class="fr-marker"')<0&&(f=C(f)),b.core.isEmpty())b.$el.html(f);else{b.markers.insert();var g,h=b.$el.find(".fr-marker").get(0);if((B(f)||e)&&(g=b.node.deepestParent(h))){var h=b.markers.split();if(!h)return!1;a(h).replaceWith(f)}else a(h).replaceWith(f)}t(),b.events.trigger("html.inserted")}function F(c){var d=null;"undefined"==typeof c&&(d=b.selection.element());var e,f;do{f=!1,e=b.$el.get(0).querySelectorAll("*:not(.fr-marker)");for(var g=0;g<e.length;g++){var h=e[g];if(d!=h){var i=h.textContent;0===h.children.length&&1===i.length&&8203==i.charCodeAt(0)&&(a(h).remove(),f=!0)}}}while(f)}function G(){var a=function(){F(),b.placeholder&&b.placeholder.refresh()};b.events.on("mouseup",a),b.events.on("keydown",a),b.events.on("contentChanged",u)}return{defaultTag:c,emptyBlocks:d,emptyBlockTagsQuery:e,blockTagsQuery:f,fillEmptyBlocks:k,cleanEmptyTags:g,cleanWhiteTags:F,normalizeSpaces:o,doNormalize:p,cleanBlankSpaces:m,blocks:l,getDoctype:s,set:y,get:z,getSelected:A,insert:E,wrap:i,unwrap:j,escapeEntities:D,checkIfEmpty:u,extractNode:v,extractNodeAttrs:w,extractDoctype:x,_init:G}},a.extend(a.FroalaEditor.DEFAULTS,{height:null,heightMax:null,heightMin:null,width:null}),a.FroalaEditor.MODULES.size=function(a){function b(){a.opts.height&&a.$el.css("minHeight",a.opts.height-a.helpers.getPX(a.$el.css("padding-top"))-a.helpers.getPX(a.$el.css("padding-bottom"))),a.$iframe.height(a.$el.outerHeight(!0))}function c(){a.opts.heightMin?a.$el.css("minHeight",a.opts.heightMin):a.$el.css("minHeight",""),a.opts.heightMax?(a.$wp.css("maxHeight",a.opts.heightMax),a.$wp.css("overflow","auto")):(a.$wp.css("maxHeight",""),a.$wp.css("overflow","")),a.opts.height?(a.$wp.height(a.opts.height),a.$el.css("minHeight",a.opts.height-a.helpers.getPX(a.$el.css("padding-top"))-a.helpers.getPX(a.$el.css("padding-bottom"))),a.$wp.css("overflow","auto")):(a.$wp.css("height",""),a.opts.heightMin||a.$el.css("minHeight",""),a.opts.heightMax||a.$wp.css("overflow","")),a.opts.width&&a.$box.width(a.opts.width)}function d(){return a.$wp?(c(),void(a.opts.iframe&&(a.events.on("keyup",b),a.events.on("commands.after",b),a.events.on("html.set",b),a.events.on("init",b),a.events.on("initialized",b)))):!1}return{_init:d,syncIframe:b,refresh:c}},a.extend(a.FroalaEditor.DEFAULTS,{language:null}),a.FroalaEditor.LANGUAGE={},a.FroalaEditor.MODULES.language=function(b){function c(a){return e&&e.translation[a]?e.translation[a]:a}function d(){a.FroalaEditor.LANGUAGE&&(e=a.FroalaEditor.LANGUAGE[b.opts.language]),e&&e.direction&&(b.opts.direction=e.direction)}var e;return{_init:d,translate:c}},a.extend(a.FroalaEditor.DEFAULTS,{placeholderText:"Type something",placeholderFontFamily:"Arial, Helvetica, sans-serif"}),a.FroalaEditor.MODULES.placeholder=function(b){function c(){var c=0,d=b.node.contents(b.$el.get(0));d.length&&d[0].nodeType==Node.ELEMENT_NODE?(c=b.helpers.getPX(a(d[0]).css("margin-top")),b.$placeholder.css("font-size",a(d[0]).css("font-size")),b.$placeholder.css("line-height",a(d[0]).css("line-height"))):(b.$placeholder.css("font-size",b.$el.css("font-size")),b.$placeholder.css("line-height",b.$el.css("line-height"))),b.$wp.addClass("show-placeholder"),b.$placeholder.css("margin-top",c).text(b.language.translate(b.opts.placeholderText||b.$original_element.attr("placeholder")||""))}function d(){b.$wp.removeClass("show-placeholder")}function e(){return b.$wp?b.$wp.hasClass("show-placeholder"):!0}function f(){return b.$wp?void(b.core.isEmpty()?c():d()):!1}function g(){return b.$wp?(b.$placeholder=a('<span class="fr-placeholder"></span>'),b.$wp.append(b.$placeholder),b.events.on("init",f),b.events.on("input",f),b.events.on("keydown",f),b.events.on("keyup",f),void b.events.on("contentChanged",f)):!1}return{_init:g,show:c,hide:d,refresh:f,isVisible:e}},a.FroalaEditor.MODULES.edit=function(a){function b(){a.browser.mozilla&&(a.document.execCommand("enableObjectResizing",!1,"false"),a.document.execCommand("enableInlineTableEditing",!1,"false"))}function c(){a.$wp&&(a.$el.attr("contenteditable",!0),a.$el.removeClass("fr-disabled"),a.$tb&&a.$tb.removeClass("fr-disabled"),b()),f=!1}function d(){a.$wp&&(a.$el.attr("contenteditable",!1),a.$el.addClass("fr-disabled"),a.$tb.addClass("fr-disabled")),f=!0}function e(){return f}var f=!1;return{on:c,off:d,disableDesign:b,isDisabled:e}},a.extend(a.FroalaEditor.DEFAULTS,{editorClass:null,typingTimer:500,iframe:!1,requestWithCORS:!0,requestHeaders:{},useClasses:!0,spellcheck:!0,iframeStyle:'html{margin: 0px;}body{padding:10px;background:transparent;color:#000000;position:relative;z-index: 2;-webkit-user-select:auto;margin:0px;overflow:hidden;}body:after{content:"";clear:both;display:block}',direction:"auto",zIndex:1,disableRightClick:!1,scrollableContainer:"body",keepFormatOnDelete:!1}),a.FroalaEditor.MODULES.core=function(b){function c(a){b.opts.iframe&&b.$head.append('<style data-fr-style="true">'+a+"</style>")}function d(){b.opts.iframe||b.$el.addClass("fr-element fr-view")}function e(){if(b.$box.addClass("fr-box"+(b.opts.editorClass?" "+b.opts.editorClass:"")),b.$wp.addClass("fr-wrapper"),d(),b.opts.iframe){b.$iframe.addClass("fr-iframe");for(var a=0;a<b.original_document.styleSheets.length;a++){var c;try{c=b.original_document.styleSheets[a].cssRules}catch(e){}if(c)for(var f=0,g=c.length;g>f;f++)!c[f].selectorText||0!==c[f].selectorText.indexOf(".fr-view")&&0!==c[f].selectorText.indexOf(".fr-element")||c[f].style.cssText.length>0&&(0===c[f].selectorText.indexOf(".fr-view")?b.opts.iframeStyle+=c[f].selectorText.replace(/\.fr-view/g,"body")+"{"+c[f].style.cssText+"}":b.opts.iframeStyle+=c[f].selectorText.replace(/\.fr-element/g,"body")+"{"+c[f].style.cssText+"}")}}"auto"!=b.opts.direction&&b.$box.removeClass("fr-ltr fr-rtl").addClass("fr-"+b.opts.direction),b.$el.attr("dir",b.opts.direction),b.$wp.attr("dir",b.opts.direction),b.opts.zIndex>1&&b.$box.css("z-index",b.opts.zIndex),b.$box&&b.opts.theme&&b.$box.addClass(b.opts.theme+"-theme")}function f(){return b.node.isEmpty(b.$el.get(0))}function g(){b.drag_support={filereader:"undefined"!=typeof FileReader,formdata:!!b.window.FormData,progress:"upload"in new XMLHttpRequest}}function h(a,c){var d=new XMLHttpRequest;d.open(c,a,!0),b.opts.requestWithCORS&&(d.withCredentials=!0);for(var e in b.opts.requestHeaders)d.setRequestHeader(e,b.opts.requestHeaders[e]);return d}function i(){"TEXTAREA"==b.$original_element.get(0).tagName&&b.$original_element.val(b.html.get()),b.$wp&&("TEXTAREA"==b.$original_element.get(0).tagName?(b.$box.replaceWith(b.$original_element),b.$original_element.show()):(b.$el.off("contextmenu.rightClick"),b.$wp.replaceWith(b.html.get()),b.$box.removeClass("fr-view fr-ltr fr-box "+(b.opts.editorClass||"")),b.opts.theme&&b.$box.addClass(b.opts.theme+"-theme")))}function j(){return b.node.hasFocus(b.$el.get(0))||b.$el.find("*:focus").length>0}function k(){if(a.FroalaEditor.INSTANCES.push(b),g(),b.$wp){e(),b.html.set(b._original_html),b.$el.attr("spellcheck",b.opts.spellcheck),b.helpers.isMobile()&&(b.$el.attr("autocomplete",b.opts.spellcheck?"on":"off"),b.$el.attr("autocorrect",b.opts.spellcheck?"on":"off"),b.$el.attr("autocapitalize",b.opts.spellcheck?"on":"off")),b.opts.disableRightClick&&b.$el.on("contextmenu.rightClick",function(a){return 2==a.button?!1:void 0});try{b.document.execCommand("styleWithCSS",!1,!1)}catch(c){}}b.events.trigger("init"),b.events.on("destroy",i),"TEXTAREA"==b.$original_element.get(0).tagName&&(b.events.on("contentChanged",function(){b.$original_element.val(b.html.get())}),b.events.on("form.submit",function(){b.$original_element.val(b.html.get())}),b.$original_element.val(b.html.get()))}return{_init:k,isEmpty:f,getXHR:h,injectStyle:c,hasFocus:j}},a.FroalaEditor.COMMANDS={bold:{title:"Bold"},italic:{title:"Italic"},underline:{title:"Underline"},strikeThrough:{
title:"Strikethrough"},subscript:{title:"Subscript"},superscript:{title:"Superscript"},outdent:{title:"Decrease Indent"},indent:{title:"Increase Indent"},undo:{title:"Undo",undo:!1,forcedRefresh:!0,disabled:!0},redo:{title:"Redo",undo:!1,forcedRefresh:!0,disabled:!0},insertHR:{title:"Insert Horizontal Line"},clearFormatting:{title:"Clear Formatting"},selectAll:{title:"Select All",undo:!1}},a.FroalaEditor.RegisterCommand=function(b,c){a.FroalaEditor.COMMANDS[b]=c},a.FroalaEditor.MODULES.commands=function(b){function c(c,d){if(b.events.trigger("commands.before",a.merge([c],d||[]))!==!1){var e=a.FroalaEditor.COMMANDS[c]&&a.FroalaEditor.COMMANDS[c].callback||k[c],f=!0;a.FroalaEditor.COMMANDS[c]&&"undefined"!=typeof a.FroalaEditor.COMMANDS[c].focus&&(f=a.FroalaEditor.COMMANDS[c].focus),b.core.hasFocus()||!f||b.popups.areVisible()||b.events.focus(!0),a.FroalaEditor.COMMANDS[c]&&a.FroalaEditor.COMMANDS[c].undo!==!1&&b.undo.saveStep(),e&&e.apply(b,a.merge([c],d||[])),b.events.trigger("commands.after",a.merge([c],d||[])),a.FroalaEditor.COMMANDS[c]&&a.FroalaEditor.COMMANDS[c].undo!==!1&&b.undo.saveStep()}}function d(c,d){if(b.selection.isCollapsed()&&b.document.queryCommandState(c)===!1){b.markers.insert();var e=b.$el.find(".fr-marker");e.replaceWith("<"+d+">"+a.FroalaEditor.INVISIBLE_SPACE+a.FroalaEditor.MARKERS+"</"+d+">"),b.selection.restore()}else{var f=b.selection.element();if(b.selection.isCollapsed()&&b.document.queryCommandState(c)===!0&&f.tagName==d.toUpperCase()&&0===(f.textContent||"").replace(/\u200B/g,"").length)a(f).replaceWith(a.FroalaEditor.MARKERS),b.selection.restore();else{var g=b.$el.find("span"),h=!1;b.document.queryCommandState(c)!==!1||b.browser.chrome||(b.selection.save(),h=!0),b.document.execCommand(c,!1,!1),h&&b.selection.restore();var i=b.$el.find("span[style]").not(g).filter(function(){return a(this).attr("style").indexOf("font-weight: normal")>=0});i.length&&(b.selection.save(),i.each(function(){a(this).replaceWith(a(this).html())}),b.selection.restore()),b.clean.toHTML5()}}}function e(c){b.selection.save(),b.html.wrap(!0,!0),b.selection.restore();for(var d=b.selection.blocks(),e=0;e<d.length;e++)if("LI"!=d[e].tagName&&"LI"!=d[e].parentNode.tagName){var f=a(d[e]),g="rtl"==b.opts.direction||"rtl"==f.css("direction")?"margin-right":"margin-left",h=b.helpers.getPX(f.css(g));f.css(g,Math.max(h+20*c,0)||""),f.removeClass("fr-temp-div")}b.selection.save(),b.html.unwrap(),b.selection.restore()}function f(){var c=function(a){return a.attr("style").indexOf("font-size")>=0};b.$el.find("[style]").each(function(){var b=a(this);c(b)&&(b.attr("data-font-size",b.css("font-size")),b.css("font-size",""))})}function g(){b.$el.find("[data-font-size]").each(function(){var b=a(this);b.css("font-size",b.attr("data-font-size")),b.removeAttr("data-font-size")})}function h(){b.$el.find("span").each(function(){""===b.node.attributes(this)&&a(this).replaceWith(a(this).html())})}function i(c,d){if(b.selection.isCollapsed()){b.markers.insert();var e=b.$el.find(".fr-marker");e.replaceWith('<span style="'+c+": "+d+';">'+a.FroalaEditor.INVISIBLE_SPACE+a.FroalaEditor.MARKERS+"</span>"),b.selection.restore()}else{f(),b.document.execCommand("fontSize",!1,4),b.selection.save(),g();for(var i,j=function(b){var d=a(b);d.css(c,""),""===d.attr("style")&&d.replaceWith(d.html())},k=function(){return 0===a(this).attr("style").indexOf(c+":")||a(this).attr("style").indexOf(";"+c+":")>=0||a(this).attr("style").indexOf("; "+c+":")>=0};b.$el.find("font").length>0;){var l=b.$el.find("font:first"),m=a('<span class="fr-just" style="'+c+": "+d+';">'+l.html()+"</span>");l.replaceWith(m);var n=m.find("span");for(i=n.length-1;i>=0;i--)j(n[i]);var o=m.parentsUntil(b.$el,"span[style]").filter(k);if(o.length){var p="",q="",r="",s="",t=m.get(0);do t=t.parentNode,p+=b.node.closeTagString(t),q=b.node.openTagString(t)+q,o.get(0)!=t&&(r+=b.node.closeTagString(t),s=b.node.openTagString(t)+s);while(o.get(0)!=t);var u=p+'<span class="fr-just" style="'+c+": "+d+';">'+s+m.html()+r+"</span>"+q;m.replaceWith('<span id="fr-break"></span>');var v=o.get(0).outerHTML;o.replaceWith(v.replace(/<span id="fr-break"><\/span>/g,u))}}b.html.cleanEmptyTags(),h();var w=b.$el.find(".fr-just + .fr-just");for(i=0;i<w.length;i++){var x=a(w[i]);x.prepend(x.prev().html()),x.prev().remove()}b.$el.find(".fr-marker + .fr-just").each(function(){a(this).prepend(a(this).prev())}),b.$el.find(".fr-just + .fr-marker").each(function(){a(this).append(a(this).next())}),b.$el.find(".fr-just").removeAttr("class"),b.selection.restore()}}function j(a){return function(){c(a)}}var k={bold:function(){d("bold","strong")},subscript:function(){d("subscript","sub")},superscript:function(){d("superscript","sup")},italic:function(){d("italic","em")},strikeThrough:function(){d("strikeThrough","s")},underline:function(){d("underline","u")},undo:function(){b.undo.run()},redo:function(){b.undo.redo()},indent:function(){e(1)},outdent:function(){e(-1)},show:function(){b.opts.toolbarInline&&b.toolbar.showInline(null,!0)},insertHR:function(){b.selection.remove(),b.html.insert('<hr id="fr-just">');var a=b.$el.find("hr#fr-just");a.removeAttr("id"),b.selection.setAfter(a.get(0))||b.selection.setBefore(a.get(0)),b.selection.restore()},clearFormatting:function(){if(b.browser.msie||b.browser.edge){var c=function(c){b.commands.applyProperty(c,"#123456"),b.selection.save(),b.$el.find("span:not(.fr-marker)").each(function(d,e){var f=a(e),g=f.css(c);("#123456"===g||"#123456"===b.helpers.RGBToHex(g))&&f.replaceWith(f.html())}),b.selection.restore()};c("color"),c("background-color")}b.document.execCommand("removeFormat",!1,!1),b.document.execCommand("unlink",!1,!1)},selectAll:function(){b.document.execCommand("selectAll",!1,!1)}},l={};for(var m in k)l[m]=j(m);return a.extend(l,{exec:c,applyProperty:i})},a.FroalaEditor.MODULES.cursorLists=function(b){function c(a){for(var b=a;"LI"!=b.tagName;)b=b.parentNode;return b}function d(a){for(var c=a;!b.node.isList(c);)c=c.parentNode;return c}function e(e){var f,g=c(e),h=g.nextSibling,i=g.previousSibling,j=b.html.defaultTag();if(b.node.isEmpty(g,!0)&&h){for(var k="",l="",m=e.parentNode;!b.node.isList(m)&&m.parentNode&&"LI"!==m.parentNode.tagName;)k=b.node.openTagString(m)+k,l+=b.node.closeTagString(m),m=m.parentNode;k=b.node.openTagString(m)+k,l+=b.node.closeTagString(m);var n="";for(n=m.parentNode&&"LI"==m.parentNode.tagName?l+"<li>"+a.FroalaEditor.MARKERS+"<br>"+k:j?l+"<"+j+">"+a.FroalaEditor.MARKERS+"<br></"+j+">"+k:l+a.FroalaEditor.MARKERS+"<br>"+k,a(g).html('<span id="fr-break"></span>');["UL","OL"].indexOf(m.tagName)<0||m.parentNode&&"LI"===m.parentNode.tagName;)m=m.parentNode;var o=b.node.openTagString(m)+a(m).html()+b.node.closeTagString(m);o=o.replace(/<span id="fr-break"><\/span>/g,n),a(m).replaceWith(o),b.$el.find("li:empty").remove()}else i&&h||!b.node.isEmpty(g,!0)?(a(g).before("<li><br></li>"),a(e).remove()):i?(f=d(g),f.parentNode&&"LI"==f.parentNode.tagName?a(f.parentNode).after("<li>"+a.FroalaEditor.MARKERS+"<br></li>"):j?a(f).after("<"+j+">"+a.FroalaEditor.MARKERS+"<br></"+j+">"):a(f).after(a.FroalaEditor.MARKERS+"<br>"),a(g).remove()):(f=d(g),f.parentNode&&"LI"==f.parentNode.tagName?a(f.parentNode).before("<li>"+a.FroalaEditor.MARKERS+"<br></li>"):j?a(f).before("<"+j+">"+a.FroalaEditor.MARKERS+"<br></"+j+">"):a(f).before(a.FroalaEditor.MARKERS+"<br>"),a(g).remove())}function f(d){for(var e=c(d),f="",g=d,h="",i="";g!=e;){g=g.parentNode;var j="A"==g.tagName&&b.cursor.isAtEnd(d,g)?"fr-to-remove":"";h=b.node.openTagString(a(g).clone().addClass(j).get(0))+h,i=b.node.closeTagString(g)+i}f=i+f+h+a.FroalaEditor.MARKERS,a(d).replaceWith('<span id="fr-break"></span>');var k=b.node.openTagString(e)+a(e).html()+b.node.closeTagString(e);k=k.replace(/<span id="fr-break"><\/span>/g,f),a(e).replaceWith(k)}function g(d){for(var e=c(d),f=a.FroalaEditor.MARKERS,g=d;g!=e;){g=g.parentNode;var h="A"==g.tagName&&b.cursor.isAtEnd(d,g)?"fr-to-remove":"";f=b.node.openTagString(a(g).clone().addClass(h).get(0))+f+b.node.closeTagString(g)}a(d).remove(),a(e).after(f)}function h(e){var f=c(e),g=f.previousSibling;if(g){g=a(g).find(b.html.blockTagsQuery()).get(-1)||g,a(e).replaceWith(a.FroalaEditor.MARKERS);var h=b.node.contents(g);h.length&&"BR"==h[h.length-1].tagName&&a(h[h.length-1]).remove(),a(f).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function(){this.parentNode==f&&a(this).replaceWith(a(this).html()+(b.node.isEmpty(this)?"":"<br>"))});for(var i,j=b.node.contents(f)[0];j&&!b.node.isList(j);)i=j.nextSibling,a(g).append(j),j=i;for(g=f.previousSibling;j;)i=j.nextSibling,a(g).append(j),j=i;a(f).remove()}else{var k=d(f);if(a(e).replaceWith(a.FroalaEditor.MARKERS),k.parentNode&&"LI"==k.parentNode.tagName){var l=k.previousSibling;b.node.isBlock(l)?(a(f).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function(){this.parentNode==f&&a(this).replaceWith(a(this).html()+(b.node.isEmpty(this)?"":"<br>"))}),a(l).append(a(f).html())):a(k).before(a(f).html())}else{var m=b.html.defaultTag();m&&0===a(f).find(b.html.blockTagsQuery()).length?a(k).before("<"+m+">"+a(f).html()+"</"+m+">"):a(k).before(a(f).html())}a(f).remove(),0===a(k).find("li").length&&a(k).remove()}}function i(d){var e,f=c(d),g=f.nextSibling;if(g){e=b.node.contents(g),e.length&&"BR"==e[0].tagName&&a(e[0]).remove(),a(g).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function(){this.parentNode==g&&a(this).replaceWith(a(this).html()+(b.node.isEmpty(this)?"":"<br>"))});for(var h,i=d,j=b.node.contents(g)[0];j&&!b.node.isList(j);)h=j.nextSibling,a(i).after(j),i=j,j=h;for(;j;)h=j.nextSibling,a(f).append(j),j=h;a(d).replaceWith(a.FroalaEditor.MARKERS),a(g).remove()}else{for(var k=f;!k.nextSibling&&k!=b.$el.get(0);)k=k.parentNode;if(k==b.$el.get(0))return!1;if(k=k.nextSibling,b.node.isBlock(k))a.FroalaEditor.NO_DELETE_TAGS.indexOf(k.tagName)<0&&(a(d).replaceWith(a.FroalaEditor.MARKERS),e=b.node.contents(f),e.length&&"BR"==e[e.length-1].tagName&&a(e[e.length-1]).remove(),a(f).append(a(k).html()),a(k).remove());else for(e=b.node.contents(f),e.length&&"BR"==e[e.length-1].tagName&&a(e[e.length-1]).remove(),a(d).replaceWith(a.FroalaEditor.MARKERS);k&&!b.node.isBlock(k)&&"BR"!=k.tagName;)a(f).append(a(k)),k=k.nextSibling}}return{_startEnter:e,_middleEnter:f,_endEnter:g,_backspace:h,_del:i}},a.FroalaEditor.NO_DELETE_TAGS=["TH","TD","TABLE","FORM"],a.FroalaEditor.SIMPLE_ENTER_TAGS=["TH","TD","LI","DL","DT","FORM"],a.FroalaEditor.MODULES.cursor=function(b){function c(a){return b.node.isBlock(a)?!0:a.nextSibling?!1:c(a.parentNode)}function d(a){return b.node.isBlock(a)?!0:a.previousSibling?!1:d(a.parentNode)}function e(a,c){return a?a==b.$wp.get(0)?!1:a.previousSibling?!1:a.parentNode==c?!0:e(a.parentNode,c):!1}function f(a,c){return a?a==b.$wp.get(0)?!1:a.nextSibling?!1:a.parentNode==c?!0:f(a.parentNode,c):!1}function g(c){return a(c).parentsUntil(b.$el,"LI").length>0&&0===a(c).parentsUntil("LI","TABLE").length}function h(c){var d=a(c).parentsUntil(b.$el,"BLOCKQUOTE").length>0,e=b.node.deepestParent(c,[],!d);if(e&&"BLOCKQUOTE"==e.tagName){var f=b.node.deepestParent(c,[a(c).parentsUntil(b.$el,"BLOCKQUOTE").get(0)]);f&&f.previousSibling&&(e=f)}if(null!==e){var g,h=e.previousSibling;if(b.node.isBlock(e)&&b.node.isEditable(e)&&h&&a.FroalaEditor.NO_DELETE_TAGS.indexOf(h.tagName)<0&&b.node.isEditable(h))if(b.node.isBlock(h))if(b.node.isEmpty(h)&&!b.node.isList(h))a(h).remove();else{if(b.node.isList(h)&&(h=a(h).find("li:last").get(0)),g=b.node.contents(h),g.length&&"BR"==g[g.length-1].tagName&&a(g[g.length-1]).remove(),"BLOCKQUOTE"==h.tagName&&"BLOCKQUOTE"!=e.tagName)for(g=b.node.contents(h);g.length&&b.node.isBlock(g[g.length-1]);)h=g[g.length-1],g=b.node.contents(h);else if("BLOCKQUOTE"!=h.tagName&&"BLOCKQUOTE"==e.tagName)for(g=b.node.contents(e);g.length&&b.node.isBlock(g[0]);)e=g[0],g=b.node.contents(e);a(c).replaceWith(a.FroalaEditor.MARKERS),a(h).append(b.node.isEmpty(e)?a.FroalaEditor.MARKERS:e.innerHTML),a(e).remove()}else a(c).replaceWith(a.FroalaEditor.MARKERS),"BLOCKQUOTE"==e.tagName&&h.nodeType==Node.ELEMENT_NODE?a(h).remove():(a(h).after(b.node.isEmpty(e)?"":a(e).html()),a(e).remove(),"BR"==h.tagName&&a(h).remove())}}function i(c){for(var d=c;!d.previousSibling;)d=d.parentNode;d=d.previousSibling;var e;if(b.node.isBlock(d)){if(a.FroalaEditor.NO_DELETE_TAGS.indexOf(d.tagName)<0)if(b.node.isEmpty(d)&&!b.node.isList(d))a(d).remove(),a(c).replaceWith(a.FroalaEditor.MARKERS);else{for(b.node.isList(d)&&(d=a(d).find("li:last").get(0)),e=b.node.contents(d),e&&"BR"==e[e.length-1].tagName&&a(e[e.length-1]).remove(),e=b.node.contents(d);e&&b.node.isBlock(e[e.length-1]);)d=e[e.length-1],e=b.node.contents(d);a(d).append(a.FroalaEditor.MARKERS);for(var f=c;!f.previousSibling;)f=f.parentNode;for(;f&&"BR"!==f.tagName&&!b.node.isBlock(f);){var g=f;f=f.nextSibling,a(d).append(g)}f&&"BR"==f.tagName&&a(f).remove(),a(c).remove()}}else{for(e=b.node.contents(d);d.nodeType!=Node.TEXT_NODE&&e.length&&!a(d).is("[contenteditable='false']");)d=e[e.length-1],e=b.node.contents(d);if(d.nodeType==Node.TEXT_NODE){if(b.helpers.isIOS())return!0;a(d).after(a.FroalaEditor.MARKERS);var h=d.textContent,i=h.length-1;if(b.opts.tabSpaces&&h.length>=b.opts.tabSpaces){var j=h.substr(h.length-b.opts.tabSpaces,h.length-1);0==j.replace(/ /g,"").replace(new RegExp(a.FroalaEditor.UNICODE_NBSP,"g"),"").length&&(i=h.length-b.opts.tabSpaces)}d.textContent=h.substring(0,i),d.textContent.length&&55357==d.textContent.charCodeAt(d.textContent.length-1)&&(d.textContent=d.textContent.substr(0,d.textContent.length-1))}else b.events.trigger("node.remove",[a(d)])!==!1&&(a(d).after(a.FroalaEditor.MARKERS),a(d).remove())}}function j(){var f=!1,j=b.markers.insert();if(!j)return!0;b.$el.get(0).normalize();var k=j.previousSibling;if(k){var l=k.textContent;l&&l.length&&8203==l.charCodeAt(l.length-1)&&(1==l.length?a(k).remove():(k.textContent=k.textContent.substr(0,l.length-1),k.textContent.length&&55357==k.textContent.charCodeAt(k.textContent.length-1)&&(k.textContent=k.textContent.substr(0,k.textContent.length-1))))}return c(j)?f=i(j):d(j)?g(j)&&e(j,a(j).parents("li:first").get(0))?b.cursorLists._backspace(j):h(j):f=i(j),a(j).remove(),b.$el.find("blockquote:empty").remove(),b.html.fillEmptyBlocks(!0),b.html.cleanEmptyTags(!0),b.clean.quotes(),b.clean.lists(),b.html.normalizeSpaces(),b.selection.restore(),f}function k(c){var d=a(c).parentsUntil(b.$el,"BLOCKQUOTE").length>0,e=b.node.deepestParent(c,[],!d);if(e&&"BLOCKQUOTE"==e.tagName){var f=b.node.deepestParent(c,[a(c).parentsUntil(b.$el,"BLOCKQUOTE").get(0)]);f&&f.nextSibling&&(e=f)}if(null!==e){var g,h=e.nextSibling;if(b.node.isBlock(e)&&b.node.isEditable(e)&&h&&a.FroalaEditor.NO_DELETE_TAGS.indexOf(h.tagName)<0)if(b.node.isBlock(h)&&b.node.isEditable(h))if(b.node.isList(h))if(b.node.isEmpty(e,!0))a(e).remove(),a(h).find("li:first").prepend(a.FroalaEditor.MARKERS);else{var i=a(h).find("li:first");"BLOCKQUOTE"==e.tagName&&(g=b.node.contents(e),g.length&&b.node.isBlock(g[g.length-1])&&(e=g[g.length-1])),0===i.find("ul, ol").length&&(a(c).replaceWith(a.FroalaEditor.MARKERS),i.find(b.html.blockTagsQuery()).not("ol, ul, table").each(function(){this.parentNode==i.get(0)&&a(this).replaceWith(a(this).html()+(b.node.isEmpty(this)?"":"<br>"))}),a(e).append(b.node.contents(i.get(0))),i.remove(),0===a(h).find("li").length&&a(h).remove())}else{if(g=b.node.contents(h),g.length&&"BR"==g[0].tagName&&a(g[0]).remove(),"BLOCKQUOTE"!=h.tagName&&"BLOCKQUOTE"==e.tagName)for(g=b.node.contents(e);g.length&&b.node.isBlock(g[g.length-1]);)e=g[g.length-1],g=b.node.contents(e);else if("BLOCKQUOTE"==h.tagName&&"BLOCKQUOTE"!=e.tagName)for(g=b.node.contents(h);g.length&&b.node.isBlock(g[0]);)h=g[0],g=b.node.contents(h);a(c).replaceWith(a.FroalaEditor.MARKERS),a(e).append(h.innerHTML),a(h).remove()}else{for(a(c).replaceWith(a.FroalaEditor.MARKERS);h&&"BR"!==h.tagName&&!b.node.isBlock(h)&&b.node.isEditable(h);){var j=h;h=h.nextSibling,a(e).append(j)}h&&"BR"==h.tagName&&b.node.isEditable(h)&&a(h).remove()}}}function l(d){for(var e=d;!e.nextSibling;)e=e.parentNode;if(e=e.nextSibling,"BR"==e.tagName&&b.node.isEditable(e))if(e.nextSibling){if(b.node.isBlock(e.nextSibling)&&b.node.isEditable(e.nextSibling)){if(!(a.FroalaEditor.NO_DELETE_TAGS.indexOf(e.nextSibling.tagName)<0))return;e=e.nextSibling,a(e.previousSibling).remove()}}else if(c(e)){if(g(d))b.cursorLists._del(d);else{var f=b.node.deepestParent(e);f&&(a(e).remove(),k(d))}return}var h;if(!b.node.isBlock(e)&&b.node.isEditable(e)){for(h=b.node.contents(e);e.nodeType!=Node.TEXT_NODE&&h.length&&b.node.isEditable(e);)e=h[0],h=b.node.contents(e);e.nodeType==Node.TEXT_NODE?(a(e).before(a.FroalaEditor.MARKERS),e.textContent.length&&55357==e.textContent.charCodeAt(0)?e.textContent=e.textContent.substring(2,e.textContent.length):e.textContent=e.textContent.substring(1,e.textContent.length)):b.events.trigger("node.remove",[a(e)])!==!1&&(a(e).before(a.FroalaEditor.MARKERS),a(e).remove()),a(d).remove()}else if(a.FroalaEditor.NO_DELETE_TAGS.indexOf(e.tagName)<0)if(b.node.isList(e))d.previousSibling?(a(e).find("li:first").prepend(d),b.cursorLists._backspace(d)):(a(e).find("li:first").prepend(a.FroalaEditor.MARKERS),a(d).remove());else if(h=b.node.contents(e),h&&"BR"==h[0].tagName&&a(h[0]).remove(),h&&"BLOCKQUOTE"==e.tagName){var i=h[0];for(a(d).before(a.FroalaEditor.MARKERS);i&&"BR"!=i.tagName;){var j=i;i=i.nextSibling,a(d).before(j)}i&&"BR"==i.tagName&&a(i).remove()}else a(d).after(a(e).html()).after(a.FroalaEditor.MARKERS),a(e).remove()}function m(){var e=b.markers.insert();if(!e)return!1;if(b.$el.get(0).normalize(),c(e))if(g(e))if(0===a(e).parents("li:first").find("ul, ol").length)b.cursorLists._del(e);else{var f=a(e).parents("li:first").find("ul:first, ol:first").find("li:first");f=f.find(b.html.blockTagsQuery()).get(-1)||f,f.prepend(e),b.cursorLists._backspace(e)}else k(e);else l(d(e)?e:e);a(e).remove(),b.$el.find("blockquote:empty").remove(),b.html.fillEmptyBlocks(!0),b.html.cleanEmptyTags(!0),b.clean.quotes(),b.clean.lists(),b.html.normalizeSpaces(),b.selection.restore()}function n(){b.$el.find(".fr-to-remove").each(function(){for(var c=b.node.contents(this),d=0;d<c.length;d++)c[d].nodeType==Node.TEXT_NODE&&(c[d].textContent=c[d].textContent.replace(/\u200B/g,""));a(this).replaceWith(this.innerHTML)})}function o(c,d,e){var g,h=b.node.deepestParent(c,[],!e);if(h&&"BLOCKQUOTE"==h.tagName)return f(c,h)?(g=b.html.defaultTag(),g?a(h).after("<"+g+">"+a.FroalaEditor.MARKERS+"<br></"+g+">"):a(h).after(a.FroalaEditor.MARKERS+"<br>"),a(c).remove(),!1):(q(c,d,e),!1);if(null==h)a(c).replaceWith("<br/>"+a.FroalaEditor.MARKERS+"<br/>");else{var i=c,j="";(!b.node.isBlock(h)||d)&&(j="<br/>");var k="",l="";g=b.html.defaultTag();var m="",n="";g&&b.node.isBlock(h)&&(m="<"+g+">",n="</"+g+">",h.tagName==g.toUpperCase()&&(m=b.node.openTagString(a(h).clone().removeAttr("id").get(0))));do if(i=i.parentNode,!d||i!=h||d&&!b.node.isBlock(h))if(k+=b.node.closeTagString(i),i==h&&b.node.isBlock(h))l=m+l;else{var o="A"==i.tagName&&f(c,i)?"fr-to-remove":"";l=b.node.openTagString(a(i).clone().addClass(o).get(0))+l}while(i!=h);j=k+j+l+(c.parentNode==h&&b.node.isBlock(h)?"":a.FroalaEditor.INVISIBLE_SPACE)+a.FroalaEditor.MARKERS,b.node.isBlock(h)&&!a(h).find("*:last").is("br")&&a(h).append("<br/>"),a(c).after('<span id="fr-break"></span>'),a(c).remove(),h.nextSibling&&!b.node.isBlock(h.nextSibling)||b.node.isBlock(h)||a(h).after("<br>");var p;p=!d&&b.node.isBlock(h)?b.node.openTagString(h)+a(h).html()+n:b.node.openTagString(h)+a(h).html()+b.node.closeTagString(h),p=p.replace(/<span id="fr-break"><\/span>/g,j),a(h).replaceWith(p)}}function p(c,d,g){var h=b.node.deepestParent(c,[],!g);if(h&&"BLOCKQUOTE"==h.tagName){if(e(c,h)){var i=b.html.defaultTag();return i?a(h).before("<"+i+">"+a.FroalaEditor.MARKERS+"<br></"+i+">"):a(h).before(a.FroalaEditor.MARKERS+"<br>"),a(c).remove(),!1}f(c,h)?o(c,d,!0):q(c,d,!0)}if(null==h)a(c).replaceWith("<br>"+a.FroalaEditor.MARKERS);else{if(b.node.isBlock(h))if(d)a(c).remove(),a(h).prepend("<br>"+a.FroalaEditor.MARKERS);else{if(b.node.isEmpty(h,!0))return o(c,d,g);a(h).before(b.node.openTagString(a(h).clone().removeAttr("id").get(0))+"<br>"+b.node.closeTagString(h))}else a(h).before("<br>");a(c).remove()}}function q(c,d,g){var h=b.node.deepestParent(c,[],!g);if(null==h)b.html.defaultTag()&&c.parentNode===b.$el.get(0)?a(c).replaceWith("<"+b.html.defaultTag()+">"+a.FroalaEditor.MARKERS+"<br></"+b.html.defaultTag()+">"):((!c.nextSibling||b.node.isBlock(c.nextSibling))&&a(c).after("<br>"),a(c).replaceWith("<br>"+a.FroalaEditor.MARKERS));else{var i=c,j="";"PRE"==h.tagName&&(d=!0),(!b.node.isBlock(h)||d)&&(j="<br>");var k="",l="";do{var m=i;if(i=i.parentNode,"BLOCKQUOTE"==h.tagName&&b.node.isEmpty(m)&&!a(m).hasClass("fr-marker")&&a(m).find(c).length>0&&a(m).after(c),("BLOCKQUOTE"!=h.tagName||!f(c,i)&&!e(c,i))&&(!d||i!=h||d&&!b.node.isBlock(h))){k+=b.node.closeTagString(i);var n="A"==i.tagName&&f(c,i)?"fr-to-remove":"";l=b.node.openTagString(a(i).clone().addClass(n).removeAttr("id").get(0))+l}}while(i!=h);var o=h==c.parentNode&&b.node.isBlock(h)||c.nextSibling;if("BLOCKQUOTE"==h.tagName){c.previousSibling&&b.node.isBlock(c.previousSibling)&&c.nextSibling&&"BR"==c.nextSibling.tagName&&(a(c.nextSibling).after(c),c.nextSibling&&"BR"==c.nextSibling.tagName&&a(c.nextSibling).remove());var p=b.html.defaultTag();j=k+j+(p?"<"+p+">":"")+a.FroalaEditor.MARKERS+"<br>"+(p?"</"+p+">":"")+l}else j=k+j+l+(o?"":a.FroalaEditor.INVISIBLE_SPACE)+a.FroalaEditor.MARKERS;a(c).replaceWith('<span id="fr-break"></span>');var q=b.node.openTagString(h)+a(h).html()+b.node.closeTagString(h);q=q.replace(/<span id="fr-break"><\/span>/g,j),a(h).replaceWith(q)}}function r(e){var f=b.markers.insert();if(!f)return!0;b.$el.get(0).normalize();var h=!1;a(f).parentsUntil(b.$el,"BLOCKQUOTE").length>0&&(e=!1,h=!0),a(f).parentsUntil(b.$el,"TD, TH").length&&(h=!1),c(f)?!g(f)||e||h?o(f,e,h):b.cursorLists._endEnter(f):d(f)?!g(f)||e||h?p(f,e,h):b.cursorLists._startEnter(f):!g(f)||e||h?q(f,e,h):b.cursorLists._middleEnter(f),n(),b.html.fillEmptyBlocks(!0),b.html.cleanEmptyTags(!0),b.clean.lists(),b.html.normalizeSpaces(),b.selection.restore()}return{enter:r,backspace:j,del:m,isAtEnd:f}},a.FroalaEditor.MODULES.data=function(a){function b(a){return a}function c(a){if(!a)return a;for(var c="",f=b("charCodeAt"),g=b("fromCharCode"),h=l.indexOf(a[0]),i=1;i<a.length-2;i++){for(var j=d(++h),k=a[f](i),m="";/[0-9-]/.test(a[i+1]);)m+=a[++i];m=parseInt(m,10)||0,k=e(k,j,m),k^=h-1&31,c+=String[g](k)}return c}function d(a){for(var b=a.toString(),c=0,d=0;d<b.length;d++)c+=parseInt(b.charAt(d),10);return c>10?c%9+1:c}function e(a,b,c){for(var d=Math.abs(c);d-- >0;)a-=b;return 0>c&&(a+=123),a}function f(a){return a&&"none"==a.css("display")?(a.remove(),!0):!1}function g(){return f(j)||f(k)}function h(){return a.$box?(a.$box.append(n(b(n("kTDD4spmKD1klaMB1C7A5RA1G3RA10YA5qhrjuvnmE1D3FD2bcG-7noHE6B2JB4C3xXA8WF6F-10RG2C3G3B-21zZE3C3H3xCA16NC4DC1f1hOF1MB3B-21whzQH5UA2WB10kc1C2F4D3XC2YD4D1C4F3GF2eJ2lfcD-13HF1IE1TC11TC7WE4TA4d1A2YA6XA4d1A3yCG2qmB-13GF4A1B1KH1HD2fzfbeQC3TD9VE4wd1H2A20A2B-22ujB3nBG2A13jBC10D3C2HD5D1H1KB11uD-16uWF2D4A3F-7C9D-17c1E4D4B3d1D2CA6B2B-13qlwzJF2NC2C-13E-11ND1A3xqUA8UE6bsrrF-7C-22ia1D2CF2H1E2akCD2OE1HH1dlKA6PA5jcyfzB-22cXB4f1C3qvdiC4gjGG2H2gklC3D-16wJC1UG4dgaWE2D5G4g1I2H3B7vkqrxH1H2EC9C3E4gdgzKF1OA1A5PF5C4WWC3VA6XA4e1E3YA2YA5HE4oGH4F2H2IB10D3D2NC5G1B1qWA9PD6PG5fQA13A10XA4C4A3e1H2BA17kC-22cmOB1lmoA2fyhcptwWA3RA8A-13xB-11nf1I3f1B7GB3aD3pavFC10D5gLF2OG1LSB2D9E7fQC1F4F3wpSB5XD3NkklhhaE-11naKA9BnIA6D1F5bQA3A10c1QC6Kjkvitc2B6BE3AF3E2DA6A4JD2IC1jgA-64MB11D6C4==")))),j=a.$box.find("> div:last"),k=j.find("> a"),void("rtl"==a.opts.direction&&j.css("left","auto").css("right",0))):!1}function i(){var c=a.opts.key||[""];"string"==typeof c&&(c=[c]),a.ul=!0;for(var d=0;d<c.length;d++){var e=n(c[d])||"";if(!(e!==n(b(n("mcVRDoB1BGILD7YFe1BTXBA7B6==")))&&e.indexOf(m,e.length-m.length)<0&&[n("9qqG-7amjlwq=="),n("KA3B3C2A6D1D5H5H1A3==")].indexOf(m)<0)){a.ul=!1;break}}a.ul===!0&&h(),a.events.on("contentChanged",function(){a.ul===!0&&g()&&h()})}var j,k,l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",m=function(){for(var a=0,b=document.domain,c=b.split("."),d="_gd"+(new Date).getTime();a<c.length-1&&-1==document.cookie.indexOf(d+"="+d);)b=c.slice(-1-++a).join("."),document.cookie=d+"="+d+";domain="+b+";";return document.cookie=d+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain="+b+";",b}(),n=b(c);return{_init:i}},a.FroalaEditor.ENTER_P=0,a.FroalaEditor.ENTER_DIV=1,a.FroalaEditor.ENTER_BR=2,a.FroalaEditor.KEYCODE={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,DELETE:46,ZERO:48,ONE:49,TWO:50,THREE:51,FOUR:52,FIVE:53,SIX:54,SEVEN:55,EIGHT:56,NINE:57,FF_SEMICOLON:59,FF_EQUALS:61,QUESTION_MARK:63,A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,META:91,NUM_ZERO:96,NUM_ONE:97,NUM_TWO:98,NUM_THREE:99,NUM_FOUR:100,NUM_FIVE:101,NUM_SIX:102,NUM_SEVEN:103,NUM_EIGHT:104,NUM_NINE:105,NUM_MULTIPLY:106,NUM_PLUS:107,NUM_MINUS:109,NUM_PERIOD:110,NUM_DIVISION:111,SEMICOLON:186,DASH:189,EQUALS:187,COMMA:188,PERIOD:190,SLASH:191,APOSTROPHE:192,TILDE:192,SINGLE_QUOTE:222,OPEN_SQUARE_BRACKET:219,BACKSLASH:220,CLOSE_SQUARE_BRACKET:221},a.extend(a.FroalaEditor.DEFAULTS,{enter:a.FroalaEditor.ENTER_P,multiLine:!0,tabSpaces:0}),a.FroalaEditor.MODULES.keys=function(b){function c(){if(b.helpers.isIOS()){var c=navigator.userAgent.match("CriOS"),d=/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);if(!c&&!d){var e=a(b.original_window).scrollTop();b.events.disableBlur(),b.selection.save(),b.$el.blur(),b.selection.restore(),b.events.enableBlur(),a(b.original_window).scrollTop(e)}}}function d(a){a.preventDefault(),a.stopPropagation(),b.opts.multiLine&&(b.selection.isCollapsed()||b.selection.remove(),b.cursor.enter()),c()}function e(a){a.preventDefault(),a.stopPropagation(),b.opts.multiLine&&(b.selection.isCollapsed()||b.selection.remove(),b.cursor.enter(!0))}function f(a){b.selection.isCollapsed()?b.cursor.backspace()||(a.preventDefault(),a.stopPropagation(),x=!1):(a.preventDefault(),a.stopPropagation(),b.selection.remove(),b.html.fillEmptyBlocks(!0),x=!1),b.placeholder.refresh()}function g(a){a.preventDefault(),a.stopPropagation(),""===b.selection.text()?b.cursor.del():b.selection.remove(),b.placeholder.refresh()}function h(c){if(b.browser.mozilla){c.preventDefault(),c.stopPropagation(),b.selection.isCollapsed()||b.selection.remove(),b.markers.insert();var d=b.$el.find(".fr-marker").get(0),e=d.previousSibling,f=d.nextSibling;!f&&d.parentNode&&"A"==d.parentNode.tagName?(a(d).parent().after("&nbsp;"+a.FroalaEditor.MARKERS),a(d).remove()):(e&&e.nodeType==Node.TEXT_NODE&&1==e.textContent.length&&160==e.textContent.charCodeAt(0)?a(e).after(" "):a(d).before("&nbsp;"),a(d).replaceWith(a.FroalaEditor.MARKERS)),b.selection.restore()}}function i(){if(b.browser.mozilla&&b.selection.isCollapsed()&&!A){var a=b.selection.ranges(0),c=a.startContainer,d=a.startOffset;c&&c.nodeType==Node.TEXT_NODE&&d<=c.textContent.length&&d>0&&32==c.textContent.charCodeAt(d-1)&&(b.selection.save(),b.html.normalizeSpaces(),b.selection.restore())}}function j(){b.selection.isFull()&&setTimeout(function(){var c=b.html.defaultTag();c?b.$el.html("<"+c+">"+a.FroalaEditor.MARKERS+"<br/></"+c+">"):b.$el.html(a.FroalaEditor.MARKERS+"<br/>"),b.selection.restore(),b.placeholder.refresh(),b.button.bulkRefresh(),b.undo.saveStep()},0)}function k(a){if(b.opts.tabSpaces>0)if(b.selection.isCollapsed()){a.preventDefault(),a.stopPropagation();for(var c="",d=0;d<b.opts.tabSpaces;d++)c+="&nbsp;";b.html.insert(c),b.placeholder.refresh()}else a.preventDefault(),a.stopPropagation(),a.shiftKey?b.commands.outdent():b.commands.indent()}function l(a){A=!1}function m(){return A}function n(c){b.events.disableBlur(),x=!0;var i=c.which;if(16===i)return!0;if(229===i)return A=!0,!0;A=!1;var j=s(i)&&!r(c),l=i==a.FroalaEditor.KEYCODE.BACKSPACE||i==a.FroalaEditor.KEYCODE.DELETE;if(b.selection.isFull()&&!b.opts.keepFormatOnDelete||l&&b.placeholder.isVisible()&&b.opts.keepFormatOnDelete){if(j||l){var m=b.html.defaultTag();m?b.$el.html("<"+m+">"+a.FroalaEditor.MARKERS+"<br/></"+m+">"):b.$el.html(a.FroalaEditor.MARKERS+"<br/>")}b.selection.restore()}i==a.FroalaEditor.KEYCODE.ENTER?c.shiftKey?e(c):d(c):i!=a.FroalaEditor.KEYCODE.BACKSPACE||r(c)?i!=a.FroalaEditor.KEYCODE.DELETE||r(c)?i==a.FroalaEditor.KEYCODE.SPACE?h(c):i==a.FroalaEditor.KEYCODE.TAB?k(c):r(c)||!s(c.which)||b.selection.isCollapsed()||b.selection.remove():g(c):f(c),b.events.enableBlur()}function o(c){for(var d=0;d<c.length;d++)c[d].nodeType==Node.TEXT_NODE&&/\u200B/gi.test(c[d].textContent)?(c[d].textContent=c[d].textContent.replace(/\u200B/gi,""),0===c[d].textContent.length&&a(c[d]).remove()):c[d].nodeType==Node.ELEMENT_NODE&&"IFRAME"!=c[d].nodeType&&o(b.node.contents(c[d]))}function p(){if(!b.$wp)return!0;var c;b.opts.height||b.opts.heightMax?(c=b.position.getBoundingRect().top,b.opts.iframe&&(c+=b.$iframe.offset().top),c>b.$wp.offset().top-a(b.original_window).scrollTop()+b.$wp.height()-20&&b.$wp.scrollTop(c+b.$wp.scrollTop()-(b.$wp.height()+b.$wp.offset().top)+a(b.original_window).scrollTop()+20)):(c=b.position.getBoundingRect().top,b.opts.iframe&&(c+=b.$iframe.offset().top),c>b.original_window.innerHeight-20&&a(b.original_window).scrollTop(c+a(b.original_window).scrollTop()-b.original_window.innerHeight+20),c=b.position.getBoundingRect().top,b.opts.iframe&&(c+=b.$iframe.offset().top),c<b.$tb.height()+20&&a(b.original_window).scrollTop(c+a(b.original_window).scrollTop()-b.$tb.height()-20))}function q(c){if(A)return!1;if(!b.selection.isCollapsed())return!1;!c||c.which!=a.FroalaEditor.KEYCODE.ENTER&&c.which!=a.FroalaEditor.KEYCODE.BACKSPACE||c.which==a.FroalaEditor.KEYCODE.BACKSPACE&&x||p();var d=b.$el.find(b.html.blockTagsQuery());d.push(b.$el.get(0));for(var e=[],f=0;f<d.length;f++)if(["TD","TH"].indexOf(d[f].tagName)<0)for(var g=d[f].children,h=0;h<g.length;h++)"BR"==g[h].tagName&&e.push(g[h]);for(var f=0;f<e.length;f++){var i=e[f],j=i.previousSibling,k=i.nextSibling,l=b.node.blockParent(i)||b.$el.get(0);j&&l&&"BR"!=j.tagName&&!b.node.isBlock(j)&&!k&&a(l).text().replace(/\u200B/g,"").length>0&&a(j).text().length>0&&(b.selection.save(),a(i).remove(),b.selection.restore())}var m=function(b){if(!b)return!1;var c=a(b).html();return c=c.replace(/<span[^>]*? class\s*=\s*["']?fr-marker["']?[^>]+>\u200b<\/span>/gi,""),c&&/\u200B/.test(c)&&c.replace(/\u200B/gi,"").length>0?!0:!1},n=function(a){var c=/[\u3041-\u3096\u30A0-\u30FF\u4E00-\u9FFF\u3130-\u318F\uAC00-\uD7AF]/gi;return!b.helpers.isIOS()||0===((a.textContent||"").match(c)||[]).length},q=b.selection.element();m(q)&&0===a(q).find("li").length&&!a(q).hasClass("fr-marker")&&"IFRAME"!=q.tagName&&n(q)&&(b.selection.save(),o(b.node.contents(q)),b.selection.restore()),!b.browser.mozilla&&b.html.doNormalize()&&(b.selection.save(),b.html.normalizeSpaces(),b.selection.restore())}function r(a){if(-1!=navigator.userAgent.indexOf("Mac OS X")){if(a.metaKey&&!a.altKey)return!0}else if(a.ctrlKey&&!a.altKey)return!0;return!1}function s(c){if(c>=a.FroalaEditor.KEYCODE.ZERO&&c<=a.FroalaEditor.KEYCODE.NINE)return!0;if(c>=a.FroalaEditor.KEYCODE.NUM_ZERO&&c<=a.FroalaEditor.KEYCODE.NUM_MULTIPLY)return!0;if(c>=a.FroalaEditor.KEYCODE.A&&c<=a.FroalaEditor.KEYCODE.Z)return!0;if(b.browser.webkit&&0===c)return!0;switch(c){case a.FroalaEditor.KEYCODE.SPACE:case a.FroalaEditor.KEYCODE.QUESTION_MARK:case a.FroalaEditor.KEYCODE.NUM_PLUS:case a.FroalaEditor.KEYCODE.NUM_MINUS:case a.FroalaEditor.KEYCODE.NUM_PERIOD:case a.FroalaEditor.KEYCODE.NUM_DIVISION:case a.FroalaEditor.KEYCODE.SEMICOLON:case a.FroalaEditor.KEYCODE.FF_SEMICOLON:case a.FroalaEditor.KEYCODE.DASH:case a.FroalaEditor.KEYCODE.EQUALS:case a.FroalaEditor.KEYCODE.FF_EQUALS:case a.FroalaEditor.KEYCODE.COMMA:case a.FroalaEditor.KEYCODE.PERIOD:case a.FroalaEditor.KEYCODE.SLASH:case a.FroalaEditor.KEYCODE.APOSTROPHE:case a.FroalaEditor.KEYCODE.SINGLE_QUOTE:case a.FroalaEditor.KEYCODE.OPEN_SQUARE_BRACKET:case a.FroalaEditor.KEYCODE.BACKSLASH:
case a.FroalaEditor.KEYCODE.CLOSE_SQUARE_BRACKET:return!0;default:return!1}}function t(a){var c=a.which;return r(a)||c>=37&&40>=c?!0:(y||(z=b.snapshot.get()),clearTimeout(y),void(y=setTimeout(function(){y=null,b.undo.saveStep()},Math.max(250,b.opts.typingTimer))))}function u(a){return r(a)?!0:void(z&&y&&(b.undo.saveStep(z),z=null))}function v(){y&&(clearTimeout(y),b.undo.saveStep(),z=null)}function w(){if(b.events.on("keydown",t),b.events.on("input",i),b.events.on("keyup",u),b.events.on("keypress",l),b.events.on("keydown",n),b.events.on("keyup",q),b.events.on("html.inserted",q),b.events.on("cut",j),b.$el.get(0).msGetInputContext)try{b.$el.get(0).msGetInputContext().addEventListener("MSCandidateWindowShow",function(){A=!0}),b.$el.get(0).msGetInputContext().addEventListener("MSCandidateWindowHide",function(){A=!1,q()})}catch(a){}}var x,y,z,A=!1;return{_init:w,ctrlKey:r,isCharacter:s,forceUndo:v,isIME:m}},a.extend(a.FroalaEditor.DEFAULTS,{pastePlain:!1,pasteDeniedTags:["colgroup","col"],pasteDeniedAttrs:["class","id","style"],pasteAllowLocalImages:!1}),a.FroalaEditor.MODULES.paste=function(b){function c(c){l=b.html.getSelected(),m=a("<div>").html(l).text(),"cut"==c.type&&(b.undo.saveStep(),setTimeout(function(){b.html.wrap(),b.events.focus(),b.undo.saveStep()},0))}function d(a){if(q)return!1;if(a.originalEvent&&(a=a.originalEvent),b.events.trigger("paste.before",[a])===!1)return!1;if(n=b.$window.scrollTop(),a&&a.clipboardData&&a.clipboardData.getData){var c="",d=a.clipboardData.types;if(b.helpers.isArray(d))for(var f=0;f<d.length;f++)c+=d[f]+";";else c=d;if(o="",/text\/html/.test(c)?o=a.clipboardData.getData("text/html"):/text\/rtf/.test(c)&&b.browser.safari?o=a.clipboardData.getData("text/rtf"):/text\/plain/.test(c)&&!this.browser.mozilla&&(o=b.html.escapeEntities(a.clipboardData.getData("text/plain")).replace(/\n/g,"<br>")),""!==o)return h(),a.preventDefault&&(a.stopPropagation(),a.preventDefault()),!1;o=null}e()}function e(){b.selection.save(),b.events.disableBlur(),o=null,p?p.html(""):(p=a('<div contenteditable="true" style="position: fixed; top: 0; left: -9999px; height: 100%; width: 0; z-index: 9999; line-height: 140%;" tabindex="-1"></div>'),b.$box.after(p)),p.focus(),b.window.setTimeout(h,1)}function f(c){c=c.replace(/<p(.*?)class="?'?MsoListParagraph"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<ul><li>$3</li></ul>"),c=c.replace(/<p(.*?)class="?'?NumberedText"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<ol><li>$3</li></ol>"),c=c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<ul><li$3>$5</li>"),c=c.replace(/<p(.*?)class="?'?NumberedTextCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<ol><li$3>$5</li>"),c=c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<li$3>$5</li>"),c=c.replace(/<p(.*?)class="?'?NumberedTextCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<li$3>$5</li>"),c=c.replace(/<p(.*?)class="?'?MsoListBullet"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<li$3>$5</li>"),c=c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<li$3>$5</li></ul>"),c=c.replace(/<p(.*?)class="?'?NumberedTextCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<li$3>$5</li></ol>"),c=c.replace(/<span([^<]*?)style="?'?mso-list:Ignore"?'?([\s\S]*?)>([\s\S]*?)<span/gi,"<span><span"),c=c.replace(/<!--\[if \!supportLists\]-->([\s\S]*?)<!--\[endif\]-->/gi,""),c=c.replace(/<!\[if \!supportLists\]>([\s\S]*?)<!\[endif\]>/gi,""),c=c.replace(/(\n|\r| class=(")?Mso[a-zA-Z0-9]+(")?)/gi," "),c=c.replace(/<!--[\s\S]*?-->/gi,""),c=c.replace(/<(\/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>/gi,"");for(var d=["style","script","applet","embed","noframes","noscript"],e=0;e<d.length;e++){var f=new RegExp("<"+d[e]+".*?"+d[e]+"(.*?)>","gi");c=c.replace(f,"")}c=c.replace(/&nbsp;/gi," "),c=c.replace(/<td([^>]*)><\/td>/g,"<td$1><br></td>"),c=c.replace(/<th([^>]*)><\/th>/g,"<th$1><br></th>");var g;do g=c,c=c.replace(/<[^\/>][^>]*><\/[^>]+>/gi,"");while(c!=g);c=c.replace(/<lilevel([^1])([^>]*)>/gi,'<li data-indent="true"$2>'),c=c.replace(/<lilevel1([^>]*)>/gi,"<li$1>"),c=b.clean.html(c,b.opts.pasteDeniedTags,b.opts.pasteDeniedAttrs),c=c.replace(/<a>(.[^<]+)<\/a>/gi,"$1");var h=a("<div>").html(c);return h.find("li[data-indent]").each(function(b,c){var d=a(c);if(d.prev("li").length>0){var e=d.prev("li").find("> ul, > ol");0===e.length&&(e=a("ul"),d.prev("li").append(e)),e.append(c)}else d.removeAttr("data-indent")}),c=h.html()}function g(c){var d=a("<div>").html(c);d.find("p, div, h1, h2, h3, h4, h5, h6, pre, blockquote").each(function(c,d){a(d).replaceWith("<"+(b.html.defaultTag()||"DIV")+">"+a(d).html()+"</"+(b.html.defaultTag()||"DIV")+">")}),a(d.find("*").not("p, div, h1, h2, h3, h4, h5, h6, pre, blockquote, ul, ol, li, table, tbody, thead, tr, td, br").get().reverse()).each(function(){a(this).replaceWith(a(this).html())});var e=function(c){for(var d=b.node.contents(c),f=0;f<d.length;f++)3!=d[f].nodeType&&1!=d[f].nodeType?a(d[f]).remove():e(d[f])};return e(d.get(0)),d.html()}function h(){b.keys.forceUndo();var c=b.snapshot.get();null===o&&(o=p.html(),b.selection.restore(),b.events.enableBlur());var d=b.events.chainTrigger("paste.beforeCleanup",o);if("string"==typeof d&&(o=d),o.indexOf("<body")>=0&&(o=o.replace(/[.\s\S\w\W<>]*<body[^>]*>([.\s\S\w\W<>]*)<\/body>[.\s\S\w\W<>]*/g,"$1")),o.indexOf('id="docs-internal-guid')>=0&&(o=o.replace(/^.* id="docs-internal-guid[^>]*>(.*)<\/b>.*$/,"$1")),o.match(/(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/gi)?(o=o.replace(/^\n*/g,"").replace(/^ /g,""),0===o.indexOf("<colgroup>")&&(o="<table>"+o+"</table>"),o=f(o),o=j(o)):(b.opts.htmlAllowComments=!1,o=b.clean.html(o,b.opts.pasteDeniedTags,b.opts.pasteDeniedAttrs),b.opts.htmlAllowComments=!0,o=j(o),o=o.replace(/\r|\n|\t/g,""),m&&a("<div>").html(o).text().replace(/(\u00A0)/gi," ").replace(/\r|\n/gi,"")==m.replace(/(\u00A0)/gi," ").replace(/\r|\n/gi,"")&&(o=l),o=o.replace(/^ */g,"").replace(/ *$/g,"")),b.opts.pastePlain&&(o=g(o)),d=b.events.chainTrigger("paste.afterCleanup",o),"string"==typeof d&&(o=d),""!==o){var e=a("<div>").html(o);b.html.cleanBlankSpaces(e.get(0)),b.html.normalizeSpaces(e.get(0)),e.find("span").each(function(){0==this.attributes.length&&a(this).replaceWith(this.innerHTML)}),e.find("br").each(function(){this.previousSibling&&b.node.isBlock(this.previousSibling)&&a(this).remove()}),o=e.html(),b.html.insert(o,!0)}i(),b.undo.saveStep(c),b.undo.saveStep()}function i(){b.events.trigger("paste.after")}function j(b){for(var c,d=a("<div>").html(b),e=d.find("*:empty:not(br, img, td, th)");e.length;){for(c=0;c<e.length;c++)a(e[c]).remove();e=d.find("*:empty:not(br, img, td, th)")}for(var f=d.find("> div:not([style]), td > div, th > div, li > div");f.length;){var g=a(f[f.length-1]);g.replaceWith(g.html()+"<br>"),f=d.find("> div:not([style]), td > div, th > div, li > div")}for(f=d.find("div:not([style])");f.length;){for(c=0;c<f.length;c++){var h=a(f[c]),i=h.html().replace(/\u0009/gi,"").trim();h.replaceWith(i)}f=d.find("div:not([style])")}return d.html()}function k(){b.events.on("copy",c),b.events.on("cut",c),b.events.on("paste",d),b.browser.msie&&b.browser.version<11&&(b.events.on("mouseup",function(a){2==a.button&&(setTimeout(function(){q=!1},50),q=!0)},!0),b.events.on("beforepaste",d))}var l,m,n,o,p,q=!1;return{_init:k}},a.FroalaEditor.MODULES.tooltip=function(b){function c(){b.$tooltip.removeClass("fr-visible").css("left","-3000px")}function d(c,d){if(c.data("title")||c.data("title",c.attr("title")),!c.data("title"))return!1;c.removeAttr("title"),b.$tooltip.text(c.data("title")),b.$tooltip.addClass("fr-visible");var e=c.offset().left+(c.outerWidth()-b.$tooltip.outerWidth())/2;0>e&&(e=0),e+b.$tooltip.outerWidth()>a(b.original_window).width()&&(e=a(b.original_window).width()-b.$tooltip.outerWidth()),"undefined"==typeof d&&(d=b.opts.toolbarBottom);var f=d?c.offset().top-b.$tooltip.height():c.offset().top+c.outerHeight();b.$tooltip.css("left",e),b.$tooltip.css("top",f)}function e(e,f,g){b.helpers.isMobile()||(e.on("mouseenter",f,function(b){a(b.currentTarget).hasClass("fr-disabled")||d(a(b.currentTarget),g)}),e.on("mouseleave "+b._mousedown+" "+b._mouseup,f,function(a){c()})),b.events.on("destroy",function(){e.off("mouseleave "+b._mousedown+" "+b._mouseup,f),e.off("mouseenter",f)},!0)}function f(){b.helpers.isMobile()||(b.$tooltip=a('<div class="fr-tooltip"></div>'),b.opts.theme&&b.$tooltip.addClass(b.opts.theme+"-theme"),a(b.original_document).find("body").append(b.$tooltip),b.events.on("destroy",function(){b.$tooltip.html("").removeData().remove()},!0))}return{_init:f,hide:c,to:d,bind:e}},a.FroalaEditor.ICON_DEFAULT_TEMPLATE="font_awesome",a.FroalaEditor.ICON_TEMPLATES={font_awesome:'<i class="fa fa-[NAME]"></i>',text:'<span style="text-align: center;">[NAME]</span>',image:"<img src=[SRC] alt=[ALT] />"},a.FroalaEditor.ICONS={bold:{NAME:"bold"},italic:{NAME:"italic"},underline:{NAME:"underline"},strikeThrough:{NAME:"strikethrough"},subscript:{NAME:"subscript"},superscript:{NAME:"superscript"},color:{NAME:"tint"},outdent:{NAME:"outdent"},indent:{NAME:"indent"},undo:{NAME:"rotate-left"},redo:{NAME:"rotate-right"},insertHR:{NAME:"minus"},clearFormatting:{NAME:"eraser"},selectAll:{NAME:"mouse-pointer"}},a.FroalaEditor.DefineIconTemplate=function(b,c){a.FroalaEditor.ICON_TEMPLATES[b]=c},a.FroalaEditor.DefineIcon=function(b,c){a.FroalaEditor.ICONS[b]=c},a.FroalaEditor.MODULES.icon=function(b){function c(b){var c=null,d=a.FroalaEditor.ICONS[b];if("undefined"!=typeof d){var e=d.template||a.FroalaEditor.ICON_DEFAULT_TEMPLATE;e&&(e=a.FroalaEditor.ICON_TEMPLATES[e])&&(c=e.replace(/\[([a-zA-Z]*)\]/g,function(a,c){return"NAME"==c?d[c]||b:d[c]}))}return c||b}return{create:c}},a.FroalaEditor.MODULES.button=function(b){function c(c){var d=a(c.currentTarget),e=d.next(),f=d.hasClass("fr-active"),g=(b.helpers.isMobile(),a(".fr-dropdown.fr-active").not(d));if(b.helpers.isIOS()&&0==b.$el.find(".fr-marker").length&&(b.selection.save(),b.selection.clear(),b.selection.restore()),!f){var h=d.data("cmd");e.find(".fr-command").removeClass("fr-active"),a.FroalaEditor.COMMANDS[h]&&a.FroalaEditor.COMMANDS[h].refreshOnShow&&a.FroalaEditor.COMMANDS[h].refreshOnShow.apply(b,[d,e]),e.css("left",d.offset().left-d.parent().offset().left-("rtl"==b.opts.direction?e.width()-d.outerWidth():0)),b.opts.toolbarBottom?e.css("bottom",b.$tb.height()-d.position().top):e.css("top",d.position().top+d.outerHeight())}d.addClass("fr-blink").toggleClass("fr-active"),setTimeout(function(){d.removeClass("fr-blink")},300),e.offset().left+e.outerWidth()>a(b.opts.scrollableContainer).offset().left+a(b.opts.scrollableContainer).outerWidth()&&e.css("margin-left",-(e.offset().left+e.outerWidth()-a(b.opts.scrollableContainer).offset().left-a(b.opts.scrollableContainer).outerWidth())),g.removeClass("fr-active")}function d(c){c.addClass("fr-blink"),setTimeout(function(){c.removeClass("fr-blink")},500);for(var d=c.data("cmd"),e=[];"undefined"!=typeof c.data("param"+(e.length+1));)e.push(c.data("param"+(e.length+1)));var f=a(".fr-dropdown.fr-active");f.length&&f.removeClass("fr-active"),b.commands.exec(d,e)}function e(b){var c=a(b.currentTarget);d(c)}function f(d){var f=a(d.currentTarget);0!=f.parents(".fr-popup").length||f.data("popup")||b.popups.hideAll(),f.hasClass("fr-dropdown")?c(d):(e(d),a.FroalaEditor.COMMANDS[f.data("cmd")]&&0!=a.FroalaEditor.COMMANDS[f.data("cmd")].refreshAfterCallback&&o())}function g(a){var b=a.find(".fr-dropdown.fr-active");b.length&&b.removeClass("fr-active")}function h(a){a.preventDefault(),a.stopPropagation()}function i(a){return a.stopPropagation(),b.opts.toolbarInline?!1:void 0}function j(c,d){b.events.bindClick(c,".fr-command:not(.fr-disabled)",f),c.on(b._mousedown+" "+b._mouseup+" "+b._move,".fr-dropdown-menu",h),c.on(b._mousedown+" "+b._mouseup+" "+b._move,".fr-dropdown-menu .fr-dropdown-wrapper",i);var e=c.get(0).ownerDocument,j="defaultView"in e?e.defaultView:e.parentWindow,k=function(d){(!d||d.type==b._mouseup&&d.target!=a("html").get(0)||"keydown"==d.type&&(b.keys.isCharacter(d.which)&&!b.keys.ctrlKey(d)||d.which==a.FroalaEditor.KEYCODE.ESC))&&g(c)};a(j).on(b._mouseup+".command"+b.id+" resize.command"+b.id+" keydown.command"+b.id,k),b.opts.iframe&&b.$window.on(b._mouseup+".command"+b.id,k),a.merge(q,c.find(".fr-btn").toArray()),b.tooltip.bind(c,".fr-btn, .fr-title",d),b.events.on("destroy",function(){c.off(b._mousedown+" "+b._mouseup+" "+b._move,".fr-dropdown-menu"),c.on(b._mousedown+" "+b._mouseup+" "+b._move,".fr-dropdown-menu .fr-dropdown-wrapper"),a(j).off(b._mouseup+".command"+b.id+" resize.command"+b.id+" keydown.command"+b.id),b.$window.off(b._mouseup+".command"+b.id)},!0)}function k(a,c){var d="";if(c.html)d+="function"==typeof c.html?c.html.call(b):c.html;else{var e=c.options;"function"==typeof e&&(e=e()),d+='<ul class="fr-dropdown-list">';for(var f in e)d+='<li><a class="fr-command" data-cmd="'+a+'" data-param1="'+f+'" title="'+e[f]+'">'+b.language.translate(e[f])+"</a></li>";d+="</ul>"}return d}function l(a,c,d){var e=c.displaySelection;"function"==typeof e&&(e=e(b));var f;if(e){var g="function"==typeof c.defaultSelection?c.defaultSelection(b):c.defaultSelection;f='<span style="width:'+(c.displaySelectionWidth||100)+'px">'+(g||b.language.translate(c.title))+"</span>"}else f=b.icon.create(c.icon||a);var h=c.popup?' data-popup="true"':"",i='<button type="button" tabindex="-1" title="'+(b.language.translate(c.title)||"")+'" class="fr-command fr-btn'+("dropdown"==c.type?" fr-dropdown":"")+(c.back?" fr-back":"")+(c.disabled?" fr-disabled":"")+(d?"":" fr-hidden")+'" data-cmd="'+a+'"'+h+">"+f+"</button>";if("dropdown"==c.type){var j='<div class="fr-dropdown-menu"><div class="fr-dropdown-wrapper"><div class="fr-dropdown-content" tabindex="-1">';j+=k(a,c),j+="</div></div></div>",i+=j}return i}function m(c,d){for(var e="",f=0;f<c.length;f++){var g=c[f],h=a.FroalaEditor.COMMANDS[g];if(!(h&&"undefined"!=typeof h.plugin&&b.opts.pluginsEnabled.indexOf(h.plugin)<0))if(h){var i="undefined"!=typeof d?d.indexOf(g)>=0:!0;e+=l(g,h,i)}else"|"==g?e+='<div class="fr-separator fr-vs"></div>':"-"==g&&(e+='<div class="fr-separator fr-hs"></div>')}return e}function n(c){var d,e=c.data("cmd");c.hasClass("fr-dropdown")?d=c.next():c.removeClass("fr-active"),a.FroalaEditor.COMMANDS[e]&&a.FroalaEditor.COMMANDS[e].refresh?a.FroalaEditor.COMMANDS[e].refresh.apply(b,[c,d]):b.refresh[e]?b.refresh[e](c,d):b.refresh["default"](c,e)}function o(){return 0==b.events.trigger("buttons.refresh")?!0:void setTimeout(function(){for(var c=b.selection.inEditor()&&b.core.hasFocus(),d=0;d<q.length;d++){var e=a(q[d]),f=e.data("cmd");0==e.parents(".fr-popup").length?c||a.FroalaEditor.COMMANDS[f]&&a.FroalaEditor.COMMANDS[f].forcedRefresh?n(e):e.hasClass("fr-dropdown")||e.removeClass("fr-active"):e.parents(".fr-popup").is(":visible")&&n(e)}},0)}function p(){b.events.on("mouseup",o),b.events.on("keyup",o),b.events.on("blur",o),b.events.on("focus",o),b.events.on("contentChanged",o)}var q=[];return{_init:p,buildList:m,bindCommands:j,refresh:n,bulkRefresh:o,exec:d}},a.FroalaEditor.MODULES.position=function(b){function c(){var c,d=b.selection.ranges(0);if(d&&d.collapsed&&b.selection.inEditor()){var e=!1;0==b.$el.find(".fr-marker").length&&(b.selection.save(),e=!0);var f=b.$el.find(".fr-marker:first");f.css("display","inline"),f.css("line-height","");var g=f.offset(),h=f.outerHeight();f.css("display","none"),f.css("line-height",0),c={},c.left=g.left,c.width=0,c.height=h,c.top=g.top-a(b.original_window).scrollTop(),c.right=1,c.bottom=1,c.ok=!0,e&&b.selection.restore()}else d&&(c=d.getBoundingClientRect());return c}function d(c,d,e){var f=c.outerHeight();if(!b.helpers.isMobile()&&b.$tb&&c.parent().get(0)!=b.$tb.get(0)){var g=(c.parent().height()-20-(b.opts.toolbarBottom?b.$tb.outerHeight():0),c.parent().offset().top),h=d-f-(e||0);c.parent().get(0)==a(b.opts.scrollableContainer).get(0)&&(g-=c.parent().position().top),g+d+f>a(b.original_document).outerHeight()&&c.parent().offset().top+h>0?(d=h,c.addClass("fr-above")):c.removeClass("fr-above")}return d}function e(c,d){var e=c.outerWidth();return c.parent().offset().left+d+e>a(b.opts.scrollableContainer).width()-10&&(d=a(b.opts.scrollableContainer).width()-e-10-c.parent().offset().left+a(b.opts.scrollableContainer).offset().left),c.parent().offset().left+d<a(b.opts.scrollableContainer).offset().left&&(d=10-c.parent().offset().left+a(b.opts.scrollableContainer).offset().left),d}function f(d){var e=c();d.css("top",0).css("left",0);var f=e.top+e.height,h=e.left+e.width/2-d.outerWidth()/2+a(b.original_window).scrollLeft();b.opts.iframe||(f+=a(b.original_window).scrollTop()),g(h,f,d,e.height)}function g(a,c,f,g){var h=f.data("container");h&&"BODY"!=h.get(0).tagName&&(a&&(a-=h.offset().left),c&&(c-=h.offset().top-h.scrollTop())),b.opts.iframe&&h&&b.$tb&&h.get(0)!=b.$tb.get(0)&&(a&&(a+=b.$iframe.offset().left),c&&(c+=b.$iframe.offset().top));var i=e(f,a);if(a){f.css("left",i);var j=f.find(".fr-arrow");j.data("margin-left")||j.data("margin-left",b.helpers.getPX(j.css("margin-left"))),j.css("margin-left",a-i+j.data("margin-left"))}c&&f.css("top",d(f,c,g))}function h(c){var d=a(c),e=d.is(".fr-sticky-on"),f=d.data("sticky-top"),g=d.data("sticky-scheduled");if("undefined"==typeof f){d.data("sticky-top",0);var h=a('<div class="fr-sticky-dummy" style="height: '+d.outerHeight()+'px;"></div>');b.$box.prepend(h)}if(b.core.hasFocus()||b.$tb.find("input:visible:focus").length>0){var i=a(window).scrollTop(),j=Math.min(Math.max(i-b.$tb.parent().offset().top,0),b.$tb.parent().outerHeight()-d.outerHeight());j!=f&&j!=g&&(clearTimeout(d.data("sticky-timeout")),d.data("sticky-scheduled",j),d.outerHeight()<i-b.$tb.parent().offset().top&&d.addClass("fr-opacity-0"),d.data("sticky-timeout",setTimeout(function(){var c=a(window).scrollTop(),e=Math.min(Math.max(c-b.$tb.parent().offset().top,0),b.$tb.parent().outerHeight()-d.outerHeight());e>0&&"BODY"==b.$tb.parent().get(0).tagName&&(e+=b.$tb.parent().position().top),e!=f&&(d.css("top",Math.max(e,0)),b.$tb.hasClass("fr-inline")&&d.css("top",i),d.data("sticky-top",e),d.data("sticky-scheduled",e)),d.removeClass("fr-opacity-0"),b.$tb.hasClass("fr-inline")&&b.toolbar.show()},100))),e||(d.css("top","0"),d.width(b.$tb.parent().width()),d.addClass("fr-sticky-on"),b.$box.addClass("fr-sticky-box"))}else clearTimeout(a(c).css("sticky-timeout")),d.css("top","0"),d.css("position",""),d.width(""),d.data("sticky-top",0),d.removeClass("fr-sticky-on"),b.$box.removeClass("fr-sticky-box"),b.$tb.hasClass("fr-inline")&&b.toolbar.hide()}function i(c){if(c.offsetWidth){var d,e,f=a(c),g=f.outerHeight(),h=f.data("sticky-position"),i=a("body"==b.opts.scrollableContainer?b.original_window:b.opts.scrollableContainer).outerHeight(),j=0,k=0;"body"!==b.opts.scrollableContainer&&(j=a(b.opts.scrollableContainer).offset().top,k=a(b.original_window).outerHeight()-j-i);var l="body"==b.opts.scrollableContainer?a(b.original_window).scrollTop():j,m=f.is(".fr-sticky-on");f.data("sticky-parent")||f.data("sticky-parent",f.parent());var n=f.data("sticky-parent"),o=n.offset().top,p=n.outerHeight();if(f.data("sticky-offset")||(f.data("sticky-offset",!0),f.after('<div class="fr-sticky-dummy" style="height: '+g+'px;"></div>')),!h){var q="auto"!==f.css("top")||"auto"!==f.css("bottom");q||f.css("position","fixed"),h={top:"auto"!==f.css("top"),bottom:"auto"!==f.css("bottom")},q||f.css("position",""),f.data("sticky-position",h),f.data("top",f.css("top")),f.data("bottom",f.css("bottom"))}var r=function(){return l+d>o&&o+p-g>=l+d},s=function(){return l+i-e>o+g&&o+p>l+i-e};d=b.helpers.getPX(f.data("top")),e=b.helpers.getPX(f.data("bottom"));var t=h.top&&r(),u=h.bottom&&s();t||u?(f.css("width",n.width()+"px"),m||(f.addClass("fr-sticky-on"),f.removeClass("fr-sticky-off"),f.css("top")&&("auto"!=f.data("top")?f.css("top",b.helpers.getPX(f.data("top"))+j):f.data("top","auto")),f.css("bottom")&&("auto"!=f.data("bottom")?f.css("bottom",b.helpers.getPX(f.data("bottom"))+k):f.css("bottom","auto")))):f.hasClass("fr-sticky-off")||(f.width(""),f.removeClass("fr-sticky-on"),f.addClass("fr-sticky-off"),f.css("top")&&"auto"!=f.css("top")&&f.css("top",0),f.css("bottom")&&f.css("bottom",0))}}function j(){var a=document.createElement("test"),c=a.style;return c.cssText="position:"+["-webkit-","-moz-","-ms-","-o-",""].join("sticky; position:")+" sticky;",-1!==c.position.indexOf("sticky")&&!b.helpers.isIOS()&&!b.helpers.isAndroid()}function k(){if(!j())if(b._stickyElements=[],b.helpers.isIOS()){var c=function(){b.helpers.requestAnimationFrame()(c);for(var a=0;a<b._stickyElements.length;a++)h(b._stickyElements[a])};c(),a(b.original_window).on("scroll.sticky"+b.id,function(){if(b.core.hasFocus())for(var c=0;c<b._stickyElements.length;c++){var d=a(b._stickyElements[c]),e=d.parent(),f=a(window).scrollTop();d.outerHeight()<f-e.offset().top&&(d.addClass("fr-opacity-0"),d.data("sticky-top",-1),d.data("sticky-scheduled",-1))}})}else a("body"==b.opts.scrollableContainer?b.original_window:b.opts.scrollableContainer).on("scroll.sticky"+b.id,l),a(b.original_window).on("resize.sticky"+b.id,l),b.events.on("initialized",l),b.events.on("focus",l),a(b.original_window).on("resize","textarea",l)}function l(){for(var a=0;a<b._stickyElements.length;a++)i(b._stickyElements[a])}function m(a){a.addClass("fr-sticky"),b.helpers.isIOS()&&a.addClass("fr-sticky-ios"),j()||b._stickyElements.push(a.get(0))}function n(){a(b.original_window).off("scroll.sticky"+b.id),a(b.original_window).off("resize.sticky"+b.id)}function o(){k(),b.events.on("destroy",n,!0)}return{_init:o,forSelection:f,addSticky:m,refresh:l,at:g,getBoundingRect:c}},a.extend(a.FroalaEditor.DEFAULTS,{toolbarInline:!1,toolbarVisibleWithoutSelection:!0,toolbarSticky:!0,toolbarButtons:["fullscreen","bold","italic","underline","strikeThrough","subscript","superscript","fontFamily","fontSize","|","color","emoticons","inlineStyle","paragraphStyle","|","paragraphFormat","align","formatOL","formatUL","outdent","indent","quote","insertHR","-","insertLink","insertImage","insertVideo","insertFile","insertTable","undo","redo","clearFormatting","selectAll","html"],toolbarButtonsXS:["bold","italic","fontFamily","fontSize","|","undo","redo"],toolbarButtonsSM:["bold","italic","underline","|","fontFamily","fontSize","insertLink","insertImage","table","|","undo","redo"],toolbarButtonsMD:["fullscreen","bold","italic","underline","fontFamily","fontSize","color","paragraphStyle","paragraphFormat","align","formatOL","formatUL","outdent","indent","quote","insertHR","-","insertLink","insertImage","insertVideo","insertFile","insertTable","undo","redo","clearFormatting"],toolbarStickyOffset:0}),a.FroalaEditor.MODULES.toolbar=function(b){function c(a,b){for(var c=0;c<b.length;c++)"-"!=b[c]&&"|"!=b[c]&&a.indexOf(b[c])<0&&a.push(b[c])}function d(){var d=a.merge([],e());c(d,b.opts.toolbarButtonsXS||[]),c(d,b.opts.toolbarButtonsSM||[]),c(d,b.opts.toolbarButtonsMD||[]),c(d,b.opts.toolbarButtons);for(var f=d.length-1;f>=0;f--)"-"!=d[f]&&"|"!=d[f]&&d.indexOf(d[f])<f&&d.splice(f,1);var g=b.button.buildList(d,e());b.$tb.append(g),b.button.bindCommands(b.$tb)}function e(){var a=b.helpers.screenSize();return t[a]}function f(){var a=e();b.$tb.find(".fr-separator").remove(),b.$tb.find("> .fr-command").addClass("fr-hidden");for(var c=0;c<a.length;c++)if("|"==a[c]||"-"==a[c])b.$tb.append(b.button.buildList([a[c]]));else{var d=b.$tb.find('> .fr-command[data-cmd="'+a[c]+'"]'),f=null;d.next().hasClass("fr-dropdown-menu")&&(f=d.next()),d.removeClass("fr-hidden").appendTo(b.$tb),f&&f.appendTo(b.$tb)}}function g(){a(b.original_window).on("resize.buttons."+b.id,f),a(b.original_window).on("orientationchange.buttons."+b.id,f)}function h(c,d){b.helpers.isMobile()?b.toolbar.show():setTimeout(function(){if(c&&c.which==a.FroalaEditor.KEYCODE.ESC);else if(b.selection.inEditor()&&b.core.hasFocus()&&!b.popups.areVisible()&&(b.opts.toolbarVisibleWithoutSelection&&c&&"keyup"!=c.type||!b.selection.isCollapsed()&&!b.keys.isIME()||d)){if(0==b.events.trigger("toolbar.show"))return!1;b.helpers.isMobile()||b.position.forSelection(b.$tb),b.$tb.show()}},0)}function i(){return 0==b.events.trigger("toolbar.hide")?!1:void b.$tb.hide()}function j(){return 0==b.events.trigger("toolbar.show")?!1:void b.$tb.show()}function k(){b.events.on("window.mousedown",i),b.events.on("keydown",i),b.events.on("blur",i),b.events.on("window.mouseup",h),b.events.on("window.keyup",h),b.events.on("keydown",function(b){b&&b.which==a.FroalaEditor.KEYCODE.ESC&&i()}),b.$wp.on("scroll.toolbar",h),b.events.on("commands.after",h)}function l(){b.events.on("focus",h,!0),b.events.on("blur",i,!0)}function m(){b.opts.toolbarInline?(b.$box.addClass("fr-inline"),b.helpers.isMobile()?(b.helpers.isIOS()?(a(b.opts.scrollableContainer).prepend(b.$tb),b.position.addSticky(b.$tb)):(b.$tb.addClass("fr-bottom"),b.$box.append(b.$tb),b.position.addSticky(b.$tb),b.opts.toolbarBottom=!0),b.$tb.addClass("fr-inline"),l(),b.opts.toolbarInline=!1):(a(b.opts.scrollableContainer).append(b.$tb),b.$tb.data("container",a(b.opts.scrollableContainer)),b.$tb.addClass("fr-inline"),b.$tb.prepend('<span class="fr-arrow"></span>'),k(),b.opts.toolbarBottom=!1)):(b.opts.toolbarBottom&&!b.helpers.isIOS()?(b.$box.append(b.$tb),b.$tb.addClass("fr-bottom"),b.$box.addClass("fr-bottom")):(b.opts.toolbarBottom=!1,b.$box.prepend(b.$tb),b.$tb.addClass("fr-top"),b.$box.addClass("fr-top")),b.$box.addClass("fr-basic"),b.$tb.addClass("fr-basic"),b.opts.toolbarSticky&&(b.opts.toolbarStickyOffset&&(b.opts.toolbarBottom?b.$tb.css("bottom",b.opts.toolbarStickyOffset):b.$tb.css("top",b.opts.toolbarStickyOffset)),b.position.addSticky(b.$tb)))}function n(){a(b.original_window).off("resize.buttons."+b.id),a(b.original_window).off("orientationchange.buttons."+b.id),b.$box.removeClass("fr-top fr-bottom fr-inline fr-basic"),b.$box.find(".fr-sticky-dummy").remove(),b.$tb.off(b._mousedown+" "+b._mouseup),b.$tb.html("").removeData().remove()}function o(){return b.$wp?(b.$tb=a('<div class="fr-toolbar"></div>'),b.opts.theme&&b.$tb.addClass(b.opts.theme+"-theme"),b.opts.zIndex>1&&b.$tb.css("z-index",b.opts.zIndex+1),"auto"!=b.opts.direction&&b.$tb.removeClass("fr-ltr fr-rtl").addClass("fr-"+b.opts.direction),b.helpers.isMobile()?b.$tb.addClass("fr-mobile"):b.$tb.addClass("fr-desktop"),m(),r=b.$tb.get(0).ownerDocument,s="defaultView"in r?r.defaultView:r.parentWindow,d(),g(),b.$tb.on(b._mousedown+" "+b._mouseup,function(a){var b=a.originalEvent?a.originalEvent.target||a.originalEvent.originalTarget:null;return b&&"INPUT"!=b.tagName?(a.stopPropagation(),a.preventDefault(),!1):void 0}),void b.events.on("destroy",n,!0)):!1}function p(){!u&&b.$tb&&(b.$tb.find("> .fr-command").addClass("fr-disabled fr-no-refresh"),u=!0)}function q(){u&&b.$tb&&(b.$tb.find("> .fr-command").removeClass("fr-disabled fr-no-refresh"),u=!1),b.button.bulkRefresh()}var r,s,t=[];t[a.FroalaEditor.XS]=b.opts.toolbarButtonsXS||b.opts.toolbarButtons,t[a.FroalaEditor.SM]=b.opts.toolbarButtonsSM||b.opts.toolbarButtons,t[a.FroalaEditor.MD]=b.opts.toolbarButtonsMD||b.opts.toolbarButtons,t[a.FroalaEditor.LG]=b.opts.toolbarButtons;var u=!1;return{_init:o,hide:i,show:j,showInline:h,disable:p,enable:q}},a.FroalaEditor.SHORTCUTS_MAP={69:{cmd:"show"},66:{cmd:"bold"},73:{cmd:"italic"},85:{cmd:"underline"},83:{cmd:"strikeThrough"},221:{cmd:"indent"},219:{cmd:"outdent"},90:{cmd:"undo"},"-90":{cmd:"redo"}},a.extend(a.FroalaEditor.DEFAULTS,{shortcutsEnabled:["show","bold","italic","underline","strikeThrough","indent","outdent","undo","redo"]}),a.FroalaEditor.RegisterShortcut=function(b,c,d,e){a.FroalaEditor.SHORTCUTS_MAP[b*(e?-1:1)]={cmd:c,val:d},a.FroalaEditor.DEFAULTS.shortcutsEnabled.push(c)},a.FroalaEditor.MODULES.shortcuts=function(b){function c(c){var d=c.which;if(b.keys.ctrlKey(c)&&(c.shiftKey&&a.FroalaEditor.SHORTCUTS_MAP[-d]||!c.shiftKey&&a.FroalaEditor.SHORTCUTS_MAP[d])){var e=a.FroalaEditor.SHORTCUTS_MAP[d*(c.shiftKey?-1:1)].cmd;if(e&&b.opts.shortcutsEnabled.indexOf(e)>=0){var f,g=a.FroalaEditor.SHORTCUTS_MAP[d*(c.shiftKey?-1:1)].val;if(e&&!g?f=b.$tb.find('.fr-command[data-cmd="'+e+'"]'):e&&g&&(f=b.$tb.find('.fr-command[data-cmd="'+e+'"][data-param1="'+g+'"]')),f.length)return c.preventDefault(),c.stopPropagation(),"keydown"==c.type&&b.button.exec(f),!1;if(e&&b.commands[e])return c.preventDefault(),c.stopPropagation(),"keydown"==c.type&&b.commands[e](),!1}}}function d(){b.events.on("keydown",c,!0),b.events.on("keyup",c,!0)}return{_init:d}},a.FroalaEditor.MODULES.snapshot=function(a){function b(a){for(var b=a.parentNode.childNodes,c=0,d=null,e=0;e<b.length;e++){if(d){var f=b[e].nodeType===Node.TEXT_NODE&&""===b[e].textContent,g=d.nodeType===Node.TEXT_NODE&&b[e].nodeType===Node.TEXT_NODE;f||g||c++}if(b[e]==a)return c;d=b[e]}}function c(c){var d=[];if(!c.parentNode)return[];for(;!a.node.isElement(c);)d.push(b(c)),c=c.parentNode;return d.reverse()}function d(a,b){for(;a&&a.nodeType===Node.TEXT_NODE;){var c=a.previousSibling;c&&c.nodeType==Node.TEXT_NODE&&(b+=c.textContent.length),a=c}return b}function e(a){return{scLoc:c(a.startContainer),scOffset:d(a.startContainer,a.startOffset),ecLoc:c(a.endContainer),ecOffset:d(a.endContainer,a.endOffset)}}function f(){var b={};if(a.events.trigger("snapshot.before"),b.html=a.$el.html(),b.ranges=[],a.selection.inEditor()&&a.core.hasFocus())for(var c=a.selection.ranges(),d=0;d<c.length;d++)b.ranges.push(e(c[d]));return a.events.trigger("snapshot.after"),b}function g(b){for(var c=a.$el.get(0),d=0;d<b.length;d++)c=c.childNodes[b[d]];return c}function h(b,c){try{var d=g(c.scLoc),e=c.scOffset,f=g(c.ecLoc),h=c.ecOffset,i=a.document.createRange();i.setStart(d,e),i.setEnd(f,h),b.addRange(i)}catch(j){}}function i(b){a.$el.html()!=b.html&&a.$el.html(b.html);var c=a.selection.get();a.selection.clear(),a.events.focus(!0);for(var d=0;d<b.ranges.length;d++)h(c,b.ranges[d])}function j(a,b){return a.html!=b.html?!1:JSON.stringify(a.ranges)!=JSON.stringify(b.ranges)?!1:!0}return{get:f,restore:i,equal:j}},a.FroalaEditor.MODULES.undo=function(a){function b(b){var c=b.which,d=a.keys.ctrlKey(b);d&&(90==c&&b.shiftKey&&b.preventDefault(),90==c&&b.preventDefault())}function c(){return 0===a.undo_stack.length||a.undo_index<=1?!1:!0}function d(){return a.undo_index==a.undo_stack.length?!1:!0}function e(b){return!a.undo_stack||a.undoing?!1:(f(),void("undefined"==typeof b?(b=a.snapshot.get(),a.undo_stack[a.undo_index-1]&&a.snapshot.equal(a.undo_stack[a.undo_index-1],b)||(a.undo_stack.push(b),a.undo_index++,b.html!=k&&(a.events.trigger("contentChanged"),k=b.html))):a.undo_index>0?a.undo_stack[a.undo_index-1]=b:(a.undo_stack.push(b),a.undo_index++)))}function f(){if(!a.undo_stack||a.undoing)return!1;for(;a.undo_stack.length>a.undo_index;)a.undo_stack.pop()}function g(){if(a.undo_index>1){a.undoing=!0;var b=a.undo_stack[--a.undo_index-1];clearTimeout(a._content_changed_timer),a.snapshot.restore(b),a.popups.hideAll(),a.toolbar.enable(),a.events.trigger("contentChanged"),a.events.trigger("commands.undo"),a.undoing=!1}}function h(){if(a.undo_index<a.undo_stack.length){a.undoing=!0;var b=a.undo_stack[a.undo_index++];clearTimeout(a._content_changed_timer),a.snapshot.restore(b),a.popups.hideAll(),a.toolbar.enable(),a.events.trigger("contentChanged"),a.events.trigger("commands.redo"),a.undoing=!1}}function i(){a.undo_index=0,a.undo_stack=[]}function j(){i(),a.events.on("initialized",function(){k=a.html.get(!1,!0)}),a.events.on("blur",function(){a.undo.saveStep()}),a.events.on("keydown",b)}var k=null;return{_init:j,run:g,redo:h,canDo:c,canRedo:d,dropRedo:f,reset:i,saveStep:e}},a.FroalaEditor.POPUP_TEMPLATES={"text.edit":"[_EDIT_]"},a.FroalaEditor.RegisterTemplate=function(b,c){a.FroalaEditor.POPUP_TEMPLATES[b]=c},a.FroalaEditor.MODULES.popups=function(b){function c(a,b){t[a].data("container",b),b.append(t[a])}function d(d,e,h,i){if(g()&&b.$el.find(".fr-marker").length>0&&(b.events.disableBlur(),b.selection.restore()),m([d]),!t[d])return!1;var j=t[d].outerWidth(),k=(t[d].outerHeight(),
f(d)),l=t[d].data("container");b.opts.toolbarInline&&l&&b.$tb&&l.get(0)==b.$tb.get(0)&&(c(d,b.opts.toolbarInline?a(b.opts.scrollableContainer):b.$box),h&&(h=b.$tb.offset().top-b.helpers.getPX(b.$tb.css("margin-top"))),e&&(e=b.$tb.offset().left+b.$tb.width()/2),b.$tb.hasClass("fr-above")&&(h+=b.$tb.outerHeight()),i=0),l=t[d].data("container"),!b.opts.iframe||i||k||(e&&(e-=b.$iframe.offset().left),h&&(h-=b.$iframe.offset().top)),e&&(e-=j/2),b.opts.toolbarBottom&&l&&b.$tb&&l.get(0)==b.$tb.get(0)&&(t[d].addClass("fr-above"),h-=t[d].outerHeight()),b.position.at(e,h,t[d],i||0),t[d].addClass("fr-active").find("input, textarea").removeAttr("disabled");var n=t[d].find("input:visible, textarea:visible").get(0);n&&(0==b.$el.find(".fr-marker").length&&b.core.hasFocus()&&b.selection.save(),b.events.disableBlur(),a(n).select().focus()),b.opts.toolbarInline&&!b.helpers.isMobile()&&b.toolbar.hide(),b.events.trigger("popups.show."+d)}function e(a,c){b.events.on("popups.show."+a,c)}function f(a){return t[a]&&t[a].hasClass("fr-active")||!1}function g(){for(var a in t)if(f(a))return!0;return!1}function h(a){t[a]&&t[a].hasClass("fr-active")&&(t[a].removeClass("fr-active fr-above"),b.events.trigger("popups.hide."+a),b.events.disableBlur(),t[a].find("input, textarea, button").filter(":focus").blur(),t[a].find("input, textarea").attr("disabled","disabled"))}function i(a,c){b.events.on("popups.hide."+a,c)}function j(a){return t[a]}function k(a,c){b.events.on("popups.refresh."+a,c)}function l(c){b.events.trigger("popups.refresh."+c);for(var d=t[c].find(".fr-command"),e=0;e<d.length;e++){var f=a(d[e]);0==f.parents(".fr-dropdown-menu").length&&b.button.refresh(f)}}function m(a){"undefined"==typeof a&&(a=[]);for(var b in t)a.indexOf(b)<0&&h(b)}function n(){u=!0}function o(){u=!1}function p(c,d){var e=a.FroalaEditor.POPUP_TEMPLATES[c];"function"==typeof e&&(e=e.apply(b));for(var f in d)e=e.replace("[_"+f.toUpperCase()+"_]",d[f]);return e}function q(c,d){var e=p(c,d),g=a('<div class="fr-popup'+(b.helpers.isMobile()?" fr-mobile":" fr-desktop")+(b.opts.toolbarInline?" fr-inline":"")+'"><span class="fr-arrow"></span>'+e+"</div>");b.opts.theme&&g.addClass(b.opts.theme+"-theme"),b.opts.zIndex>1&&b.$tb.css("z-index",b.opts.zIndex+2),"auto"!=b.opts.direction&&g.removeClass("fr-ltr fr-rtl").addClass("fr-"+b.opts.direction),g.find("input, textarea").attr("dir",b.opts.direction).attr("disabled","disabled");var i=a("body");return i.append(g),g.data("container",i),t[c]=g,b.button.bindCommands(g,!1),a(b.original_window).on("resize.popups"+b.id,function(){b.helpers.isMobile()||(b.events.disableBlur(),h(c),b.events.enableBlur())}),g.on(b._mousedown+" "+b._mouseup,function(a){var b=a.originalEvent?a.originalEvent.target||a.originalEvent.originalTarget:null;return b&&"INPUT"!=b.tagName?(a.preventDefault(),a.stopPropagation(),!1):void a.stopPropagation()}),g.on("focus","input, textarea, button, select",function(c){if(c.preventDefault(),c.stopPropagation(),setTimeout(function(){b.events.enableBlur()},0),b.helpers.isMobile()){var d=a(b.original_window).scrollTop();setTimeout(function(){a(b.original_window).scrollTop(d)},0)}}),g.on("keydown","input, textarea, button, select",function(d){var e=d.which;if(a.FroalaEditor.KEYCODE.TAB==e){d.preventDefault();var i=g.find("input, textarea, button, select").filter(":visible").not(":disabled").toArray();i.sort(function(b,c){return d.shiftKey?a(b).attr("tabIndex")<a(c).attr("tabIndex"):a(b).attr("tabIndex")>a(c).attr("tabIndex")}),b.events.disableBlur();var j=i.indexOf(this)+1;j==i.length&&(j=0),a(i[j]).focus()}if(a.FroalaEditor.KEYCODE.ENTER==e)g.find(".fr-submit:visible").length>0&&(d.preventDefault(),d.stopPropagation(),b.events.disableBlur(),b.button.exec(g.find(".fr-submit:visible:first")));else{if(a.FroalaEditor.KEYCODE.ESC==e)return d.preventDefault(),d.stopPropagation(),b.$el.find(".fr-marker")&&(b.events.disableBlur(),a(this).data("skip",!0),b.selection.restore(),b.events.enableBlur()),f(c)&&g.find(".fr-back:visible").length?b.button.exec(g.find(".fr-back:visible:first")):h(c),b.opts.toolbarInline&&b.toolbar.showInline(null,!0),!1;d.stopPropagation()}}),b.events.on("window.keydown",function(d){var e=d.which;if(a.FroalaEditor.KEYCODE.ESC==e){if(f(c)&&b.opts.toolbarInline)return d.stopPropagation(),f(c)&&g.find(".fr-back:visible").length?b.button.exec(g.find(".fr-back:visible:first")):(h(c),b.toolbar.showInline(null,!0)),!1;f(c)&&g.find(".fr-back:visible").length?b.button.exec(g.find(".fr-back:visible:first")):h(c)}}),b.$wp&&(b.events.on("keydown",function(d){b.keys.ctrlKey(d)||d.which==a.FroalaEditor.KEYCODE.ESC||(f(c)&&g.find(".fr-back:visible").length?b.button.exec(g.find(".fr-back:visible:first")):h(c))}),g.on("blur","input, textarea, button, select",function(c){document.activeElement!=this&&a(this).is(":visible")&&(b.events.blurActive()&&b.events.trigger("blur"),b.events.enableBlur())})),g.on("mousedown touchstart touch","*",function(a){["INPUT","TEXTAREA","BUTTON","SELECT","LABEL"].indexOf(a.currentTarget.tagName)>=0&&a.stopPropagation(),b.events.disableBlur()}),b.events.on("mouseup",function(a){g.is(":visible")&&u&&g.find("input:focus, textarea:focus, button:focus, select:focus").filter(":visible").length>0&&b.events.disableBlur()},!0),b.events.on("window.mouseup",function(a){g.is(":visible")&&u&&(a.stopPropagation(),b.markers.remove(),h(c))},!0),b.events.on("blur",function(a){m()}),g.on("keydown keyup change input","input, textarea",function(b){var c=a(this).next();0==c.length&&a(this).after("<span>"+a(this).attr("placeholder")+"</span>"),a(this).toggleClass("fr-not-empty",""!=a(this).val())}),b.$wp&&!b.helpers.isMobile()&&b.$wp.on("scroll.popup"+c,function(d){if(f(c)&&g.parent().get(0)==a(b.opts.scrollableContainer).get(0)){var e=g.offset().top-b.$wp.offset().top,h=(b.$wp.scrollTop(),b.$wp.outerHeight());e>h||0>e?g.addClass("fr-hidden"):g.removeClass("fr-hidden")}}),b.helpers.isIOS()&&g.on("touchend","label",function(){a("#"+a(this).attr("for")).prop("checked",function(a,b){return!b})}),g}function r(){for(var c in t){var d=t[c];d.off("mousedown mouseup touchstart touchend"),d.off("focus","input, textarea, button, select"),d.off("keydown","input, textarea, button, select"),d.off("blur","input, textarea, button, select"),d.off("keydown keyup change","input, textarea"),d.off(b._mousedown,"*"),d.html("").removeData().remove(),a(b.original_window).off("resize.popups"+b.id),b.$wp&&b.$wp.off("scroll.popup"+c)}}function s(){b.events.on("destroy",r,!0),b.events.on("window.mousedown",n),b.events.on("window.touchmove",o),b.events.on("mousedown",function(a){g()&&b.$el.find(".fr-marker").remove()}),b.events.on("window.mouseup",function(){u=!1})}var t={},u=!1;return{_init:s,create:q,get:j,show:d,hide:h,onHide:i,hideAll:m,setContainer:c,refresh:l,onRefresh:k,onShow:e,isVisible:f,areVisible:g}},a.FroalaEditor.MODULES.refresh=function(b){function c(a,c){try{b.document.queryCommandState(c)===!0&&a.addClass("fr-active")}catch(d){}}function d(a){a.toggleClass("fr-disabled",!b.undo.canDo())}function e(a){a.toggleClass("fr-disabled",!b.undo.canRedo())}function f(a){if(a.hasClass("fr-no-refresh"))return!1;for(var c=b.selection.blocks(),d=0;d<c.length;d++){if("LI"!=c[d].tagName||c[d].previousSibling)return a.removeClass("fr-disabled"),!0;a.addClass("fr-disabled")}}function g(c){if(c.hasClass("fr-no-refresh"))return!1;for(var d=b.selection.blocks(),e=0;e<d.length;e++){var f="rtl"==b.opts.direction||"rtl"==a(d[e]).css("direction")?"margin-right":"margin-left";if("LI"==d[e].tagName||"LI"==d[e].parentNode.tagName)return c.removeClass("fr-disabled"),!0;if(b.helpers.getPX(a(d[e]).css(f))>0)return c.removeClass("fr-disabled"),!0}c.addClass("fr-disabled")}return{"default":c,undo:d,redo:e,outdent:g,indent:f}},a.extend(a.FroalaEditor.DEFAULTS,{editInPopup:!1}),a.FroalaEditor.MODULES.textEdit=function(b){function c(){var a='<div id="fr-text-edit-'+b.id+'" class="fr-layer fr-text-edit-layer"><div class="fr-input-line"><input type="text" placeholder="'+b.language.translate("Text")+'" tabIndex="1"></div><div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="updateText" tabIndex="2">'+b.language.translate("Update")+"</button></div></div>",c={edit:a};b.popups.create("text.edit",c)}function d(){var c,d=b.popups.get("text.edit");c="INPUT"===b.$el.prop("tagName")?b.$el.attr("placeholder"):b.$el.text(),d.find("input").val(c).trigger("change"),b.popups.setContainer("text.edit",a("body")),b.popups.show("text.edit",b.$el.offset().left+b.$el.outerWidth()/2,b.$el.offset().top+b.$el.outerHeight(),b.$el.outerHeight())}function e(){b.$el.on(b._mouseup,function(a){setTimeout(function(){d()},10)})}function f(){var a=b.popups.get("text.edit"),c=a.find("input").val();0==c.length&&(c=b.opts.placeholderText),"INPUT"===b.$el.prop("tagName")?b.$el.attr("placeholder",c):b.$el.text(c),b.events.trigger("contentChanged"),b.popups.hide("text.edit")}function g(){b.opts.editInPopup&&(c(),e())}return{_init:g,update:f}},a.FroalaEditor.RegisterCommand("updateText",{focus:!1,undo:!1,callback:function(){this.textEdit.update()}})});

  resolve(true)
});

initFroalaEditor.then(function(data) {
  ! function (a) {
  "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function (b, c) {
    return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), a(c), c
  } : a(jQuery)
  }(function (a) {
    "use strict";
    a.extend(a.FroalaEditor.POPUP_TEMPLATES, {
      "table.insert": "[_BUTTONS_][_ROWS_COLUMNS_]"
      , "table.edit": "[_BUTTONS_]"
      , "table.colors": "[_BUTTONS_][_COLORS_]"
    }), a.extend(a.FroalaEditor.DEFAULTS, {
      tableInsertMaxSize: 30
      // , tableEditButtons: ["tableHeader", "tableRemove", "|", "tableRows", "tableColumns", "tableStyle", "-", "tableCells", "tableCellBackground", "tableCellVerticalAlign", "tableCellHorizontalAlign", "tableCellStyle"]
      , tableEditButtons: ["tableRemove", "|", "tableRows", "tableColumns", "tableCells","-", "tableCellBackground", "tableCellVerticalAlign", "tableCellHorizontalAlign", "tableCellStyle"]
      , tableInsertButtons: ["tableBack", "|"]
      , tableResizerOffset: 15
      , tableResizingLimit: 50
      , tableColorsButtons: ["tableBack", "|"]
      , tableColors: ["#61BD6D", "#1ABC9C", "#54ACD2", "#2C82C9", "#9365B8", "#475577", "#CCCCCC", "#41A85F", "#00A885", "#3D8EB9", "#2969B0", "#553982", "#28324E", "#000000", "#F7DA64", "#FBA026", "#EB6B56", "#E25041", "#A38F84", "#EFEFEF", "#FFFFFF", "#FAC51C", "#F37934", "#D14841", "#B8312F", "#7C706B", "#D1D5D8", "REMOVE"]
      , tableColorsStep: 7
      , tableCellStyles: {
        "fr-highlighted": "Шапка"
        , "fr-thick": "Боковина"
      }
      , tableStyles: {
        "fr-dashed-borders": "Точки"
        , "fr-alternate-rows": "Серый"
      }
      , tableCellMultipleStyles: !0
      , tableMultipleStyles: !0
      , tableInsertHelper: !0
      , tableInsertHelperOffset: 50
    }), a.FroalaEditor.PLUGINS.table = function (b) {
      function c() {
        var a = b.$tb.find('.fr-command[data-cmd="insertTable"]')
          , c = b.popups.get("table.insert");
        if (c || (c = g()), !c.hasClass("fr-active")) {
          b.popups.refresh("table.insert"), b.popups.setContainer("table.insert", b.$tb);
          var d = a.offset()
            .left + a.outerWidth() / 2
            , e = a.offset()
            .top + (b.opts.toolbarBottom ? 10 : a.outerHeight() - 10);
          b.popups.show("table.insert", d, e, a.outerHeight())
        }
      }

      function d() {
        var c = B();
        if (c) {
          var d = b.popups.get("table.edit");
          d || (d = i()), b.popups.setContainer("table.edit", a(b.opts.scrollableContainer));
          var e = I(c)
            , f = (e.left + e.right) / 2
            , g = e.bottom;
          if (b.popups.show("table.edit", f, g, e.bottom - e.top), b.$el.find(".fr-selected-cell")
            .length > 1) {
            b.toolbar.disable(), b.$el.removeClass("fr-no-selection"), b.edit.on();
            var h = a(b.original_window)
              .scrollTop();
            b.$el.focus(), b.selection.setAtEnd(b.$el.find(".fr-selected-cell:last")
                .get(0)), b.selection.restore(), a(b.original_window)
              .scrollTop(h), b.button.bulkRefresh()
          }
        }
      }

      function e() {
        var c = B();
        if (c) {
          var d = b.popups.get("table.colors");
          d || (d = j()), b.popups.setContainer("table.colors", a(b.opts.scrollableContainer));
          var e = I(c)
            , f = (e.left + e.right) / 2
            , g = e.bottom;
          l(), b.popups.show("table.colors", f, g, e.bottom - e.top)
        }
      }

      function f() {
        0 === b.$el.get(0)
          .querySelectorAll(".fr-selected-cell")
          .length && b.toolbar.enable()
      }

      function g() {
        var c = "";
        b.opts.tableInsertButtons.length > 0 && (c = '<div class="fr-buttons">' + b.button.buildList(b.opts.tableInsertButtons) + "</div>");
        var d = {
            buttons: c
            , rows_columns: h()
          }
          , e = b.popups.create("table.insert", d);
        return b.popups.onHide("table.insert", function () {
          e.find('.fr-table-size .fr-select-table-size > span[data-row="1"][data-col="1"]')
            .trigger("mouseenter")
        }), e.on("mouseenter", ".fr-table-size .fr-select-table-size .fr-table-cell", function (c) {
          var d = a(c.currentTarget)
            , e = d.data("row")
            , f = d.data("col")
            , g = d.parent();
          g.siblings(".fr-table-size-info")
            .html(e + " &times; " + f), g.find("> span")
            .removeClass("hover");
          for (var h = 1; h <= b.opts.tableInsertMaxSize; h++)
            for (var i = 0; i <= b.opts.tableInsertMaxSize; i++) {
              var j = g.find('> span[data-row="' + h + '"][data-col="' + i + '"]');
              e >= h && f >= i ? j.addClass("hover") : e + 1 >= h || 2 >= h && !b.helpers.isMobile() ? j.css("display", "inline-block") : h > 2 && !b.helpers.isMobile() && j.css("display", "none")
            }
        }), b.events.on("destroy", function () {
          e.off("mouseenter", ".fr-table-size .fr-select-table-size .fr-table-cell")
        }, !0), e
      }

      function h() {
        for (var a = '<div class="fr-table-size"><div class="fr-table-size-info">1 &times; 1</div><div class="fr-select-table-size">', c = 1; c <= b.opts.tableInsertMaxSize; c++) {
          for (var d = 1; d <= b.opts.tableInsertMaxSize; d++) {
            var e = "inline-block";
            c > 2 && !b.helpers.isMobile() && (e = "none");
            var f = "fr-table-cell ";
            1 == c && 1 == d && (f += " hover"), a += '<span class="fr-command ' + f + '" data-cmd="tableInsert" data-row="' + c + '" data-col="' + d + '" data-param1="' + c + '" data-param2="' + d + '" style="display: ' + e + ';"><span></span></span>'
          }
          a += '<div class="new-line"></div>'
        }
        return a += "</div></div>"
      }

      function i() {
        var a = "";
        b.opts.tableEditButtons.length > 0 && (a = '<div class="fr-buttons">' + b.button.buildList(b.opts.tableEditButtons) + "</div>");
        var c = {
            buttons: a
          }
          , e = b.popups.create("table.edit", c);
        return b.popups.onHide("table.edit", f), b.$wp.on("scroll.table-edit", function () {
          b.popups.isVisible("table.edit") && d()
        }), b.events.on("destroy", function () {
          b.$wp.off("scroll.table-edit")
        }), e
      }

      function j() {
        var a = "";
        b.opts.tableColorsButtons.length > 0 && (a = '<div class="fr-buttons fr-table-colors-buttons">' + b.button.buildList(b.opts.tableColorsButtons) + "</div>");
        var c = {
            buttons: a
            , colors: k()
          }
          , d = b.popups.create("table.colors", c);
        return b.$wp.on("scroll.table-colors", function () {
          b.popups.isVisible("table.colors") && e()
        }), b.events.on("destroy", function () {
          b.$wp.off("scroll.table-colors")
        }), d
      }

      function k() {
        for (var a = '<div class="fr-table-colors">', c = 0; c < b.opts.tableColors.length; c++) 0 !== c && c % b.opts.tableColorsStep === 0 && (a += "<br>"), a += "REMOVE" != b.opts.tableColors[c] ? '<span class="fr-command" style="background: ' + b.opts.tableColors[c] + ';" data-cmd="tableCellBackgroundColor" data-param1="' + b.opts.tableColors[c] + '"></span>' : '<span class="fr-command" data-cmd="tableCellBackgroundColor" data-param1="REMOVE" title="' + b.language.translate("Clear Formatting") + '"><i class="fa fa-eraser"></i></span>';
        return a += "</div>"
      }

      function l() {
        var a = b.popups.get("table.colors")
          , c = b.$el.find(".fr-selected-cell:first");
        a.find(".fr-selected-color")
          .removeClass("fr-selected-color"), a.find('span[data-param1="' + b.helpers.RGBToHex(c.css("background-color")) + '"]')
          .addClass("fr-selected-color")
      }

      function m(c, d) {
        var e, f, g = '<table style="width: 100%;"><tbody>'
          , h = 100 / d;
        for (e = 0; c > e; e++) {
          for (g += "<tr>", f = 0; d > f; f++) g += '<td style="width: ' + h.toFixed(4) + '%;">', 0 === e && 0 === f && (g += a.FroalaEditor.MARKERS), g += "<br></td>";
          g += "</tr>"
        }
        g += "</tbody></table>", b.html.insert(g), b.selection.restore()
      }

      function n() {
        if (b.$el.find(".fr-selected-cell")
          .length > 0) {
          var a = b.$el.find(".fr-selected-cell")
            .closest("table");
          b.selection.setBefore(a.get(0)) || b.selection.setAfter(a.get(0)), b.selection.restore(), b.popups.hide("table.edit"), a.remove()
        }
      }

      function o() {
        var c = b.$el.find(".fr-selected-cell")
          .closest("table");
        if (c.length > 0 && 0 === c.find("th")
          .length) {
          var e, f = "<thead><tr>"
            , g = 0;
          for (c.find("tr:first > td")
            .each(function () {
              var b = a(this);
              g += parseInt(b.attr("colspan"), 10) || 1
            }), e = 0; g > e; e++) f += "<th><br></th>";
          f += "</tr></thead>", c.prepend(f), d()
        }
      }

      function p() {
        var a = b.$el.find(".fr-selected-cell")
          .closest("table")
          , c = a.find("thead");
        if (c.length > 0)
          if (0 === a.find("tbody tr")
            .length) n();
          else if (c.remove(), b.$el.find(".fr-selected-cell")
          .length > 0) d();
        else {
          b.popups.hide("table.edit");
          var e = a.find("tbody tr:first td:first")
            .get(0);
          e && (b.selection.setAtEnd(e), b.selection.restore())
        }
      }

      function q(c) {
        var e = b.$el.find(".fr-selected-cell")
          .closest("table");
        if (e.length > 0) {
          if (b.$el.find("th.fr-selected-cell")
            .length > 0 && "above" == c) return;
          var f, g, h = B()
            , i = G(h);
          g = "above" == c ? i.min_i : i.max_i;
          var j = "<tr>";
          for (f = 0; f < h[g].length; f++)
            if ("below" == c && g < h.length - 1 && h[g][f] == h[g + 1][f] || "above" == c && g > 0 && h[g][f] == h[g - 1][f]) {
              if (0 === f || f > 0 && h[g][f] != h[g][f - 1]) {
                var k = a(h[g][f]);
                k.attr("rowspan", parseInt(k.attr("rowspan"), 10) + 1)
              }
            }
            else j += "<td><br></td>";
          j += "</tr>";
          var l = a(e.find("tr")
            .not(e.find("table tr"))
            .get(g));
          "below" == c ? l.after(j) : "above" == c && (l.before(j), b.popups.isVisible("table.edit") && d())
        }
      }

      function r() {
        var c = b.$el.find(".fr-selected-cell")
          .closest("table");
        if (c.length > 0) {
          var d, e, f, g = B()
            , h = G(g);
          if (0 === h.min_i && h.max_i == g.length - 1) n();
          else {
            for (d = h.max_i; d >= h.min_i; d--) {
              for (f = a(c.find("tr")
                  .not(c.find("table tr"))
                  .get(d)), e = 0; e < g[d].length; e++)
                if (0 === e || g[d][e] != g[d][e - 1]) {
                  var i = a(g[d][e]);
                  if (parseInt(i.attr("rowspan"), 10) > 1) {
                    var j = parseInt(i.attr("rowspan"), 10) - 1;
                    1 == j ? i.removeAttr("rowspan") : i.attr("rowspan", j)
                  }
                  if (d < g.length - 1 && g[d][e] == g[d + 1][e] && (0 === d || g[d][e] != g[d - 1][e])) {
                    for (var k = g[d][e], l = e; l > 0 && g[d][l] == g[d][l - 1];) l--;
                    0 === l ? a(c.find("tr")
                        .not(c.find("table tr"))
                        .get(d + 1))
                      .prepend(k) : a(g[d + 1][l - 1])
                      .after(k)
                  }
                }
              var m = f.parent();
              f.remove(), 0 === m.find("tr")
                .length && m.remove(), g = B(c)
            }
            h.min_i > 0 ? b.selection.setAtEnd(g[h.min_i - 1][0]) : b.selection.setAtEnd(g[0][0]), b.selection.restore(), b.popups.hide("table.edit")
          }
        }
      }

      function s(c) {
        var e = b.$el.find(".fr-selected-cell")
          .closest("table");
        if (e.length > 0) {
          var f, g = B()
            , h = G(g);
          f = "before" == c ? h.min_j : h.max_j;
          var i, j = 100 / g[0].length
            , k = 100 / (g[0].length + 1);
          e.find("th, td")
            .each(function () {
              i = a(this), i.data("old-width", i.outerWidth() / e.outerWidth() * 100)
            }), e.find("tr")
            .not(e.find("table tr"))
            .each(function (b) {
              for (var d, e = a(this), h = 0, i = 0; f > h - 1;) {
                if (d = e.find("> th, > td")
                  .get(i), !d) {
                  d = null;
                  break
                }
                d == g[b][h] ? (h += parseInt(a(d)
                  .attr("colspan"), 10) || 1, i++) : (h += parseInt(a(g[b][h])
                  .attr("colspan"), 10) || 1, "after" == c && (d = 0 === i ? -1 : e.find("> th, > td")
                  .get(i - 1)))
              }
              var l = a(d);
              if ("after" == c && h - 1 > f || "before" == c && f > 0 && g[b][f] == g[b][f - 1]) {
                if (0 === b || b > 0 && g[b][f] != g[b - 1][f]) {
                  var m = parseInt(l.attr("colspan"), 10) + 1;
                  l.attr("colspan", m), l.css("width", (l.data("old-width") * k / j + k)
                    .toFixed(4) + "%"), l.removeData("old-width")
                }
              }
              else {
                var n;
                n = e.find("th")
                  .length > 0 ? '<th style="width: ' + k.toFixed(4) + '%;"><br></th>' : '<td style="width: ' + k.toFixed(4) + '%;"><br></td>', -1 == d ? e.prepend(n) : null == d ? e.append(n) : "before" == c ? l.before(n) : "after" == c && l.after(n)
              }
            }), e.find("th, td")
            .each(function () {
              i = a(this), i.data("old-width") && (i.css("width", (i.data("old-width") * k / j)
                .toFixed(4) + "%"), i.removeData("old-width"))
            }), b.popups.isVisible("table.edit") && d()
        }
      }

      function t() {
        var c = b.$el.find(".fr-selected-cell")
          .closest("table");
        if (c.length > 0) {
          var d, e, f, g = B()
            , h = G(g);
          if (0 === h.min_j && h.max_j == g[0].length - 1) n();
          else {
            var i = 100 / g[0].length
              , j = 100 / (g[0].length - h.max_j + h.min_j - 1);
            for (c.find("th, td")
              .each(function () {
                f = a(this), f.hasClass("fr-selected-cell") || f.data("old-width", f.outerWidth() / c.outerWidth() * 100)
              }), e = h.max_j; e >= h.min_j; e--)
              for (d = 0; d < g.length; d++)
                if (0 === d || g[d][e] != g[d - 1][e])
                  if (f = a(g[d][e]), parseInt(f.attr("colspan"), 10) > 1) {
                    var k = parseInt(f.attr("colspan"), 10) - 1;
                    1 == k ? f.removeAttr("colspan") : f.attr("colspan", k), f.css("width", ((f.data("old-width") - Y(e, g)) * j / i)
                      .toFixed(4) + "%"), f.removeData("old-width")
                  }
                  else {
                    var l = a(f.parent()
                      .get(0));
                    f.remove(), 0 === l.find("> th, > td")
                      .length && (0 === l.prev()
                        .length || 0 === l.next()
                        .length || l.prev()
                        .find("> th[rowspan], > td[rowspan]")
                        .length < l.prev()
                        .find("> th, > td")
                        .length) && l.remove()
                  }
            h.min_j > 0 ? b.selection.setAtEnd(g[h.min_i][h.min_j - 1]) : b.selection.setAtEnd(g[h.min_i][0]), b.selection.restore(), b.popups.hide("table.edit"), c.find("th, td")
              .each(function () {
                f = a(this), f.data("old-width") && (f.css("width", (f.data("old-width") * j / i)
                  .toFixed(4) + "%"), f.removeData("old-width"))
              })
          }
        }
      }

      function u() {
        if (b.$el.find(".fr-selected-cell")
          .length > 1 && (0 === b.$el.find("th.fr-selected-cell")
            .length || 0 === b.$el.find("td.fr-selected-cell")
            .length)) {
          var c, e, f, g = B()
            , h = G(g)
            , i = b.$el.find(".fr-selected-cell")
            , j = a(i[0])
            , k = j.parent()
            , l = k.find(".fr-selected-cell")
            , m = j.closest("table")
            , n = j.html()
            , o = 0;
          for (c = 0; c < l.length; c++) o += a(l[c])
            .outerWidth();
          for (j.css("width", (o / k.outerWidth() * 100)
              .toFixed(4) + "%"), h.min_j < h.max_j && j.attr("colspan", h.max_j - h.min_j + 1), h.min_i < h.max_i && j.attr("rowspan", h.max_i - h.min_i + 1), c = 1; c < i.length; c++) e = a(i[c]), "<br>" != e.html() && "" !== e.html() && (n += "<br>" + e.html()), e.remove();
          j.html(n), b.selection.setAtEnd(j.get(0)), b.selection.restore(), b.toolbar.enable();
          var p = m.find("tr:empty");
          for (c = p.length - 1; c >= 0; c--) f = a(p[c]), (0 === f.prev()
            .length || 0 === f.next()
            .length || f.prev()
            .find("> th[rowspan], > td[rowspan]")
            .length < f.prev()
            .find("> th, > td")
            .length) && f.remove();
          d()
        }
      }

      function v() {
        if (1 == b.$el.find(".fr-selected-cell")
          .length) {
          var c = b.$el.find(".fr-selected-cell")
            , d = c.parent()
            , e = c.closest("table")
            , f = parseInt(c.attr("rowspan"), 10)
            , g = B()
            , h = C(c.get(0), g)
            , i = c.clone()
            .html("<br>");
          if (f > 1) {
            var j = Math.ceil(f / 2);
            j > 1 ? c.attr("rowspan", j) : c.removeAttr("rowspan"), f - j > 1 ? i.attr("rowspan", f - j) : i.removeAttr("rowspan");
            for (var k = h.row + j, l = 0 === h.col ? h.col : h.col - 1; l >= 0 && (g[k][l] == g[k][l - 1] || k > 0 && g[k][l] == g[k - 1][l]);) l--; - 1 == l ? a(e.find("tr")
                .not(e.find("table tr"))
                .get(k))
              .prepend(i) : a(g[k][l])
              .after(i)
          }
          else {
            var m, n = a("<tr>")
              .append(i);
            for (m = 0; m < g[0].length; m++)
              if (0 === m || g[h.row][m] != g[h.row][m - 1]) {
                var o = a(g[h.row][m]);
                o.is(c) || o.attr("rowspan", (parseInt(o.attr("rowspan"), 10) || 1) + 1)
              }
            d.after(n)
          }
          E(), b.popups.hide("table.edit")
        }
      }

      function w() {
        if (1 == b.$el.find(".fr-selected-cell")
          .length) {
          var c = b.$el.find(".fr-selected-cell")
            , d = parseInt(c.attr("colspan"), 10) || 1
            , e = c.parent()
            .outerWidth()
            , f = c.outerWidth()
            , g = c.clone()
            .html("<br>")
            , h = B()
            , i = C(c.get(0), h);
          if (d > 1) {
            var j = Math.ceil(d / 2);
            f = Z(i.col, i.col + j - 1, h) / e * 100;
            var k = Z(i.col + j, i.col + d - 1, h) / e * 100;
            j > 1 ? c.attr("colspan", j) : c.removeAttr("colspan"), d - j > 1 ? g.attr("colspan", d - j) : g.removeAttr("colspan"), c.css("width", f.toFixed(4) + "%"), g.css("width", k.toFixed(4) + "%")
          }
          else {
            var l;
            for (l = 0; l < h.length; l++)
              if (0 === l || h[l][i.col] != h[l - 1][i.col]) {
                var m = a(h[l][i.col]);
                if (!m.is(c)) {
                  var n = (parseInt(m.attr("colspan"), 10) || 1) + 1;
                  m.attr("colspan", n)
                }
              }
            f = f / e * 100 / 2, c.css("width", f.toFixed(4) + "%"), g.css("width", f.toFixed(4) + "%")
          }
          c.after(g), E(), b.popups.hide("table.edit")
        }
      }

      function x(a) {
        "REMOVE" != a ? b.$el.find(".fr-selected-cell")
          .css("background-color", b.helpers.HEXtoRGB(a)) : b.$el.find(".fr-selected-cell")
          .css("background-color", "")
      }

      function y(a) {
        b.$el.find(".fr-selected-cell")
          .css("vertical-align", a)
      }

      function z(a) {
        b.$el.find(".fr-selected-cell")
          .css("text-align", a)
      }

      function A(a, b, c, d) {
        if (b.length > 0) {
          if (!c) {
            var e = Object.keys(d);
            e.splice(e.indexOf(a), 1), b.removeClass(e.join(" "))
          }
          b.toggleClass(a)
        }
      }

      function B(c) {
        c = c || null;
        var d = [];
        if (null == c && b.$el.find(".fr-selected-cell")
          .length > 0 && (c = b.$el.find(".fr-selected-cell")
            .closest("table")), c) {
          var e = a(c);
          return e.find("tr")
            .not(e.find("table tr"))
            .each(function (b, c) {
              var e = a(c)
                , f = 0;
              e.find("> th, > td")
                .each(function (c, e) {
                  for (var g = a(e), h = parseInt(g.attr("colspan"), 10) || 1, i = parseInt(g.attr("rowspan"), 10) || 1, j = b; b + i > j; j++)
                    for (var k = f; f + h > k; k++) d[j] || (d[j] = []), d[j][k] ? f++ : d[j][k] = e;
                  f += h
                })
            }), d
        }
      }

      function C(a, b) {
        for (var c = 0; c < b.length; c++)
          for (var d = 0; d < b[c].length; d++)
            if (b[c][d] == a) return {
              row: c
              , col: d
            }
      }

      function D(a, b, c) {
        for (var d = a + 1, e = b + 1; d < c.length;) {
          if (c[d][b] != c[a][b]) {
            d--;
            break
          }
          d++
        }
        for (d == c.length && d--; e < c[a].length;) {
          if (c[a][e] != c[a][b]) {
            e--;
            break
          }
          e++
        }
        return e == c[a].length && e--, {
          row: d
          , col: e
        }
      }

      function E() {
        var c = b.$el.find(".fr-selected-cell");
        c.length > 0 && c.each(function () {
          var b = a(this);
          b.removeClass("fr-selected-cell"), "" === b.attr("class") && b.removeAttr("class")
        })
      }

      function F() {
        setTimeout(function () {
          b.selection.clear(), b.$el.addClass("fr-no-selection"), b.edit.off(), b.$el.blur()
        }, 0)
      }

      function G(a) {
        var c, d = a.length
          , e = 0
          , f = a[0].length
          , g = 0
          , h = b.$el.find(".fr-selected-cell");
        for (c = 0; c < h.length; c++) {
          var i = C(h[c], a)
            , j = D(i.row, i.col, a);
          d = Math.min(i.row, d), e = Math.max(j.row, e), f = Math.min(i.col, f), g = Math.max(j.col, g)
        }
        return {
          min_i: d
          , max_i: e
          , min_j: f
          , max_j: g
        }
      }

      function H(b, c, d, e, f) {
        var g, h, i, j, k = b
          , l = c
          , m = d
          , n = e;
        for (g = k; l >= g; g++)((parseInt(a(f[g][m])
          .attr("rowspan"), 10) || 1) > 1 || (parseInt(a(f[g][m])
          .attr("colspan"), 10) || 1) > 1) && (i = C(f[g][m], f), j = D(i.row, i.col, f), k = Math.min(i.row, k), l = Math.max(j.row, l), m = Math.min(i.col, m), n = Math.max(j.col, n)), ((parseInt(a(f[g][n])
          .attr("rowspan"), 10) || 1) > 1 || (parseInt(a(f[g][n])
          .attr("colspan"), 10) || 1) > 1) && (i = C(f[g][n], f), j = D(i.row, i.col, f), k = Math.min(i.row, k), l = Math.max(j.row, l), m = Math.min(i.col, m), n = Math.max(j.col, n));
        for (h = m; n >= h; h++)((parseInt(a(f[k][h])
          .attr("rowspan"), 10) || 1) > 1 || (parseInt(a(f[k][h])
          .attr("colspan"), 10) || 1) > 1) && (i = C(f[k][h], f), j = D(i.row, i.col, f), k = Math.min(i.row, k), l = Math.max(j.row, l), m = Math.min(i.col, m), n = Math.max(j.col, n)), ((parseInt(a(f[l][h])
          .attr("rowspan"), 10) || 1) > 1 || (parseInt(a(f[l][h])
          .attr("colspan"), 10) || 1) > 1) && (i = C(f[l][h], f), j = D(i.row, i.col, f), k = Math.min(i.row, k), l = Math.max(j.row, l), m = Math.min(i.col, m), n = Math.max(j.col, n));
        return k == b && l == c && m == d && n == e ? {
          min_i: b
          , max_i: c
          , min_j: d
          , max_j: e
        } : H(k, l, m, n, f)
      }

      function I(b) {
        var c = G(b)
          , d = a(b[c.min_i][c.min_j])
          , e = a(b[c.min_i][c.max_j])
          , f = a(b[c.max_i][c.min_j])
          , g = d.offset()
          .left
          , h = e.offset()
          .left + e.outerWidth()
          , i = d.offset()
          .top
          , j = f.offset()
          .top + f.outerHeight();
        return {
          left: g
          , right: h
          , top: i
          , bottom: j
        }
      }

      function J(b, c) {
        if (a(b)
          .is(c)) E(), a(b)
          .addClass("fr-selected-cell");
        else {
          F();
          var d = B()
            , e = C(b, d)
            , f = C(c, d)
            , g = H(Math.min(e.row, f.row), Math.max(e.row, f.row), Math.min(e.col, f.col), Math.max(e.col, f.col), d);
          E();
          for (var h = g.min_i; h <= g.max_i; h++)
            for (var i = g.min_j; i <= g.max_j; i++) a(d[h][i])
              .addClass("fr-selected-cell")
        }
      }

      function K(c) {
        var d = null
          , e = a(c.target);
        return "TD" == c.target.tagName || "TH" == c.target.tagName ? d = c.target : e.closest("td")
          .length > 0 ? d = e.closest("td")
          .get(0) : e.closest("th")
          .length > 0 && (d = e.closest("th")
            .get(0)), 0 === b.$el.find(d)
          .length ? null : d
      }

      function L(c) {
        if (b.$el.find(".fr-selected-cell")
          .length > 0 && !c.shiftKey && (E(), b.$el.removeClass("fr-no-selection"), b.edit.on()), 1 == c.which) {
          ha = !0;
          var d = K(c);
          if (d) {
            b.popups.hide("table.edit"), c.stopPropagation(), b.events.trigger("image.hideResizer"), b.events.trigger("video.hideResizer"), ga = !0;
            var e = d.tagName.toLowerCase();
            c.shiftKey && a(e + ".fr-selected-cell")
              .length > 0 ? a(a(e + ".fr-selected-cell")
                .closest("table"))
              .is(a(d)
                .closest("table")) ? J(ia, d) : F() : ((b.keys.ctrlKey(c) || c.shiftKey) && F(), ia = d, J(ia, ia))
          }
        }
      }

      function M(c) {
        if (1 == c.which) {
          if (ha = !1, ga) {
            ga = !1;
            var e = K(c);
            e || 1 != b.$el.find(".fr-selected-cell")
              .length ? b.$el.find(".fr-selected-cell")
              .length > 0 && (b.selection.isCollapsed() ? d() : E()) : E()
          }
          else b.$tb.is(c.target) || b.$tb.is(a(c.target)
            .closest(b.$tb.get(0))) || (b.$el.get(0)
            .querySelectorAll(".fr-selected-cell")
            .length > 0 && b.toolbar.enable(), E());
          if (ka) {
            ka = !1, ea.removeClass("fr-moving"), b.$el.removeClass("fr-no-selection"), b.edit.on();
            var f = parseFloat(ea.css("left")) + b.opts.tableResizerOffset;
            b.opts.iframe && (f -= b.$iframe.offset()
              .left), ea.data("release-position", f), ea.removeData("max-left"), ea.removeData("max-right"), X(c), Q()
          }
        }
      }

      function N(c) {
        if (ga === !0) {
          var d = a(c.currentTarget);
          if (d.closest("table")
            .is(b.$el.find(".fr-selected-cell")
              .closest("table"))) {
            if ("TD" == c.currentTarget.tagName && 0 === b.$el.find("th.fr-selected-cell")
              .length) return void J(ia, c.currentTarget);
            if ("TH" == c.currentTarget.tagName && 0 === b.$el.find("td.fr-selected-cell")
              .length) return void J(ia, c.currentTarget)
          }
          F()
        }
      }

      function O(a) {
        (37 == a.which || 38 == a.which || 39 == a.which || 40 == a.which) && b.$el.find(".fr-selected-cell")
          .length > 0 && (E(), b.popups.hide("table.edit"))
      }

      function P() {
        ea = a('<div class="fr-table-resizer"><div></div></div>'), b.$wp.append(ea), ea.on("mousedown", function () {
          ka = !0, ea.addClass("fr-moving"), E(), F(), ea.find("div")
            .css("opacity", 1)
        }), b.events.on("destroy", function () {
          ea.off("mousedown"), ea.html("")
            .removeData()
            .remove()
        }, !0)
      }

      function Q() {
        ea.find("div")
          .css("opacity", 0), ea.css("top", 0), ea.css("left", 0), ea.css("height", 0), ea.find("div")
          .css("height", 0), ea.hide()
      }

      function R(c, d) {
        var e = a(d)
          , f = e.closest("table");
        if (d && "TD" != d.tagName && "TH" != d.tagName && (e.closest("td")
            .length > 0 ? d = e.closest("td") : e.closest("th")
            .length > 0 && (d = e.closest("th"))), !d || "TD" != d.tagName && "TH" != d.tagName) e.get(0) != ea.get(0) && e.parent()
          .get(0) != ea.get(0) && Q();
        else {
          if (e = a(d), 0 === b.$el.find(e)
            .length) return !1;
          var g = e.offset()
            .left - 1
            , h = g + e.outerWidth();
          if (Math.abs(c.pageX - g) <= b.opts.tableResizerOffset || Math.abs(h - c.pageX) <= b.opts.tableResizerOffset) {
            var i, j, k, l, m, n = B(f)
              , o = C(d, n)
              , p = D(o.row, o.col, n)
              , q = f.offset()
              .top
              , r = f.outerHeight() - 1;
            if (o.col > 0 && c.pageX - g <= b.opts.tableResizerOffset) {
              k = g;
              var s = a(n[o.row][o.col - 1]);
              l = 1 == (parseInt(s.attr("colspan"), 10) || 1) ? s.offset()
                .left - 1 + b.opts.tableResizingLimit : g - Y(o.col - 1, n) + b.opts.tableResizingLimit, m = 1 == (parseInt(e.attr("colspan"), 10) || 1) ? g + e.outerWidth() - b.opts.tableResizingLimit : g + Y(o.col, n) - b.opts.tableResizingLimit, i = o.col - 1, j = o.col
            }
            else if (h - c.pageX <= b.opts.tableResizerOffset)
              if (k = h, p.col < n[p.row].length && n[p.row][p.col + 1]) {
                var t = a(n[p.row][p.col + 1]);
                l = 1 == (parseInt(e.attr("colspan"), 10) || 1) ? g + b.opts.tableResizingLimit : h - Y(p.col, n) + b.opts.tableResizingLimit, m = 1 == (parseInt(t.attr("colspan"), 10) || 1) ? h + t.outerWidth() - b.opts.tableResizingLimit : h + Y(o.col + 1, n) - b.opts.tableResizingLimit, i = p.col, j = p.col + 1
              }
              else {
                i = p.col, j = null;
                var u = f.parent();
                l = f.offset()
                  .left - 1 + n[0].length * b.opts.tableResizingLimit, m = u.offset()
                  .left - 1 + u.width() + parseFloat(u.css("padding-left"))
              }
            ea.data("table", f), ea.data("first", i), ea.data("second", j);
            var v = k - b.window.pageXOffset - b.opts.tableResizerOffset
              , w = q - b.window.pageYOffset;
            b.opts.iframe && (v += b.$iframe.offset()
                .left - a(b.original_window)
                .scrollLeft(), w += b.$iframe.offset()
                .top - a(b.original_window)
                .scrollTop(), l += b.$iframe.offset()
                .left, m += b.$iframe.offset()
                .left), ea.data("max-left", l), ea.data("max-right", m), ea.data("origin", k - b.window.pageXOffset), ea.css("top", w), ea.css("left", v), ea.css("height", r), ea.find("div")
              .css("height", r), ea.css("padding-left", b.opts.tableResizerOffset), ea.css("padding-right", b.opts.tableResizerOffset), ea.show()
          }
          else Q()
        }
      }

      function S(c, d) {
        if (b.$box.find(".fr-line-breaker")
          .is(":visible")) return !1;
        var e = a(d)
          , f = e.find("tr:first")
          , g = c.pageX
          , h = 0
          , i = 0;
        b.opts.iframe && (h += b.$iframe.offset()
          .left - a(b.original_window)
          .scrollLeft(), i += b.$iframe.offset()
          .top - a(b.original_window)
          .scrollTop());
        var j;
        f.find("th, td")
          .each(function () {
            var c = a(this);
            return c.offset()
              .left <= g && g < c.offset()
              .left + c.outerWidth() / 2 ? (fa.find("a")
                .attr("title", b.language.translate("Insert Column")), j = parseInt(fa.find("a")
                  .css("width"), 10), fa.css("top", i + c.offset()
                  .top - b.window.pageYOffset - j - 5), fa.css("left", h + c.offset()
                  .left - b.window.pageXOffset - j / 2), fa.data("selected-cell", c), fa.data("position", "before"), fa.addClass("fr-visible"), !1) : c.offset()
              .left + c.outerWidth() / 2 <= g && g < c.offset()
              .left + c.outerWidth() ? (fa.find("a")
                .attr("title", b.language.translate("Insert Column")), j = parseInt(fa.find("a")
                  .css("width"), 10), fa.css("top", i + c.offset()
                  .top - b.window.pageYOffset - j - 5), fa.css("left", h + c.offset()
                  .left + c.outerWidth() - b.window.pageXOffset - j / 2), fa.data("selected-cell", c), fa.data("position", "after"), fa.addClass("fr-visible"), !1) : void 0
          })
      }

      function T(c, d) {
        if (b.$box.find(".fr-line-breaker")
          .is(":visible")) return !1;
        var e = a(d)
          , f = c.pageY
          , g = 0
          , h = 0;
        b.opts.iframe && (g += b.$iframe.offset()
          .left - a(b.original_window)
          .scrollLeft(), h += b.$iframe.offset()
          .top - a(b.original_window)
          .scrollTop());
        var i;
        e.find("tr")
          .each(function () {
            var c = a(this);
            return c.offset()
              .top <= f && f < c.offset()
              .top + c.outerHeight() / 2 ? (fa.find("a")
                .attr("title", b.language.translate("Insert Row")), i = parseInt(fa.find("a")
                  .css("width"), 10), fa.css("top", h + c.offset()
                  .top - b.window.pageYOffset - i / 2), fa.css("left", g + c.offset()
                  .left - b.window.pageXOffset - i - 5), fa.data("selected-cell", c.find("td:first")), fa.data("position", "above"), fa.addClass("fr-visible"), !1) : c.offset()
              .top + c.outerHeight() / 2 <= f && f < c.offset()
              .top + c.outerHeight() ? (fa.find("a")
                .attr("title", b.language.translate("Insert Row")), i = parseInt(fa.find("a")
                  .css("width"), 10), fa.css("top", h + c.offset()
                  .top + c.outerHeight() - b.window.pageYOffset - i / 2), fa.css("left", g + c.offset()
                  .left - b.window.pageXOffset - i - 5), fa.data("selected-cell", c.find("td:first")), fa.data("position", "below"), fa.addClass("fr-visible"), !1) : void 0
          })
      }

      function U(c, d) {
        if (0 === b.$el.find(".fr-selected-cell")
          .length) {
          var e, f, g;
          if (fa.removeClass("fr-visible"), d && ("HTML" == d.tagName || "BODY" == d.tagName || b.node.isElement(d)))
            for (e = 1; e <= b.opts.tableInsertHelperOffset; e++) {
              if (f = b.document.elementFromPoint(c.pageX - b.window.pageXOffset, c.pageY - b.window.pageYOffset + e), f && ("TH" == f.tagName || "TD" == f.tagName || "TABLE" == f.tagName) && a(f)
                .parents(b.$wp)
                .length) {
                S(c, f.closest("table"));
                break
              }
              if (g = b.document.elementFromPoint(c.pageX - b.window.pageXOffset + e, c.pageY - b.window.pageYOffset), g && ("TH" == g.tagName || "TD" == g.tagName || "TABLE" == g.tagName) && a(g)
                .parents(b.$wp)
                .length) {
                T(c, g.closest("table"));
                break
              }
            }
        }
      }

      function V(a) {
        ja = null;
        var c = b.document.elementFromPoint(a.pageX - b.window.pageXOffset, a.pageY - b.window.pageYOffset);
        (!b.popups.areVisible() || b.popups.areVisible() && b.popups.isVisible("table.edit")) && R(a, c), b.popups.areVisible() || b.$tb.hasClass("fr-inline") && b.$tb.is(":visible") || U(a, c)
      }

      function W() {
        if (ka) {
          var a = ea.data("table");
          ea.css("top", a.offset()
            .top - b.window.pageYOffset)
        }
      }

      function X() {
        var c = ea.data("origin")
          , d = ea.data("release-position");
        if (c !== d) {
          var e = ea.data("first")
            , f = ea.data("second")
            , g = ea.data("table")
            , h = g.outerWidth();
          if (null !== e && null !== f) {
            var i, j, k, l = B(g)
              , m = []
              , n = []
              , o = []
              , p = [];
            for (i = 0; i < l.length; i++) j = a(l[i][e]), k = a(l[i][f]), m[i] = j.outerWidth(), o[i] = k.outerWidth(), n[i] = m[i] / h * 100, p[i] = o[i] / h * 100;
            for (i = 0; i < l.length; i++) {
              j = a(l[i][e]), k = a(l[i][f]);
              var q = (n[i] * (m[i] + d - c) / m[i])
                .toFixed(4);
              j.css("width", q + "%"), k.css("width", (n[i] + p[i] - q)
                .toFixed(4) + "%")
            }
          }
          else {
            var r, s = g.parent()
              , t = h / s.width() * 100;
            r = null == e ? (h - d + c) / h * t : (h + d - c) / h * t, g.css("width", Math.round(r)
              .toFixed(4) + "%")
          }
        }
        ea.removeData("origin"), ea.removeData("release-position"), ea.removeData("first"), ea.removeData("second"), ea.removeData("table"), b.undo.saveStep()
      }

      function Y(b, c) {
        var d, e = a(c[0][b])
          .outerWidth();
        for (d = 1; d < c.length; d++) e = Math.min(e, a(c[d][b])
          .outerWidth());
        return e
      }

      function Z(a, b, c) {
        var d, e = 0;
        for (d = a; b >= d; d++) e += Y(d, c);
        return e
      }

      function $(a) {
        if (ha === !1 && ga === !1 && ka === !1) ja && clearTimeout(ja), ja = setTimeout(V, 30, a);
        else if (ka) {
          var c = a.pageX - b.window.pageXOffset;
          b.opts.iframe && (c += b.$iframe.offset()
            .left);
          var d = ea.data("max-left")
            , e = ea.data("max-right");
          c >= d && e >= c ? ea.css("left", c - b.opts.tableResizerOffset) : d > c && parseFloat(ea.css("left"), 10) > d - b.opts.tableResizerOffset ? ea.css("left", d - b.opts.tableResizerOffset) : c > e && parseFloat(ea.css("left"), 10) < e - b.opts.tableResizerOffset && ea.css("left", e - b.opts.tableResizerOffset)
        }
        else ha && fa.removeClass("fr-visible")
      }

      function _(c) {
        b.node.isEmpty(c.get(0)) ? c.prepend(a.FroalaEditor.MARKERS) : c.prepend(a.FroalaEditor.START_MARKER)
          .append(a.FroalaEditor.END_MARKER)
      }

      function aa(c) {
        var d = c.which;
        if (d == a.FroalaEditor.KEYCODE.TAB && 0 === b.opts.tabSpaces) {
          var e;
          if (b.$el.find(".fr-selected-cell")
            .length > 0) e = b.$el.find(".fr-selected-cell:last");
          else {
            var f = b.selection.element();
            "TD" == f.tagName || "TH" == f.tagName ? e = a(f) : a(f)
              .closest("td")
              .length > 0 ? e = a(f)
              .closest("td") : a(f)
              .closest("th")
              .length > 0 && (e = a(f)
                .closest("th"))
          }
          e && (c.preventDefault(), E(), b.popups.hide("table.edit"), c.shiftKey ? e.prev()
            .length > 0 ? _(e.prev()) : e.closest("tr")
            .length > 0 && e.closest("tr")
            .prev()
            .length > 0 ? _(e.closest("tr")
              .prev()
              .find("td:last")) : e.closest("tbody")
            .length > 0 && e.closest("table")
            .find("thead tr")
            .length > 0 && _(e.closest("table")
              .find("thead tr th:last")) : e.next()
            .length > 0 ? _(e.next()) : e.closest("tr")
            .length > 0 && e.closest("tr")
            .next()
            .length > 0 ? _(e.closest("tr")
              .next()
              .find("td:first")) : e.closest("thead")
            .length > 0 && e.closest("table")
            .find("tbody tr")
            .length > 0 ? _(e.closest("table")
              .find("tbody tr td:first")) : (e.addClass("fr-selected-cell"), q("below"), E(), _(e.closest("tr")
              .next()
              .find("td:first"))), b.selection.restore())
        }
      }

      function ba() {
        fa = a('<div class="fr-insert-helper"><a class="fr-floating-btn" role="button" tabindex="-1" title="' + b.language.translate("Insert") + '"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M22,16.75 L16.75,16.75 L16.75,22 L15.25,22.000 L15.25,16.75 L10,16.75 L10,15.25 L15.25,15.25 L15.25,10 L16.75,10 L16.75,15.25 L22,15.25 L22,16.75 Z"/></svg></a></div>'), b.$box.append(fa), b.events.on("destroy", function () {
            fa.html("")
              .removeData()
              .remove()
          }, !0), fa.on("mousemove", function (a) {
            a.stopPropagation()
          }), a(b.window)
          .on("scroll.table" + b.id, function () {
            fa.removeClass("fr-visible")
          }), b.events.bindClick(fa, "a", function () {
            var a = fa.data("selected-cell")
              , b = fa.data("position");
            "before" == b ? (a.addClass("fr-selected-cell"), s(b), a.removeClass("fr-selected-cell")) : "after" == b ? (a.addClass("fr-selected-cell"), s(b), a.removeClass("fr-selected-cell")) : "above" == b ? (a.addClass("fr-selected-cell"), q(b), a.removeClass("fr-selected-cell")) : "below" == b && (a.addClass("fr-selected-cell"), q(b), a.removeClass("fr-selected-cell")), fa.removeClass("fr-visible")
          }), b.events.on("destroy", function () {
            fa.off("mousemove"), a(b.window)
              .off("scroll.table" + b.id)
          }, !0)
      }

      function ca() {
        return b.$wp ? (b.helpers.isMobile() || (ha = !1, ga = !1, ka = !1, P(), b.opts.tableInsertHelper && ba(), b.$el.on("mousedown.table" + b.id, L), b.popups.onShow("image.edit", function () {
            E(), ha = !1, ga = !1
          }), b.popups.onShow("link.edit", function () {
            E(), ha = !1, ga = !1
          }), b.events.on("commands.mousedown", function (a) {
            a.parents(".fr-toolbar")
              .length > 0 && E()
          }), b.$el.on("mouseenter.table" + b.id, "th, td", N), b.$window.on("mouseup.table" + b.id, M), b.$el.on("keydown.table" + b.id, O), b.$window.on("mousemove.table" + b.id, $), a(b.window)
          .on("scroll.table" + b.id, W), b.events.on("contentChanged", function () {
            b.$el.find(".fr-selected-cell")
              .length > 0 && (d(), b.$el.find("img")
                .on("load.selected-cells", function () {
                  a(this)
                    .off("load.selected-cells"), b.$el.find(".fr-selected-cell")
                    .length > 0 && d()
                }))
          }), a(b.original_window)
          .on("resize.table" + b.id, function () {
            E()
          }), b.events.on("keydown", function (c) {
            if (b.$el.find(".fr-selected-cell")
              .length > 0) {
              if (c.which == a.FroalaEditor.KEYCODE.ESC && b.popups.isVisible("table.edit")) return E(), b.popups.hide("table.edit"), c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), !1;
              if (b.$el.find(".fr-selected-cell")
                .length > 1) return c.preventDefault(), !1
            }
          }, !0), a(b.window)
          .on("keydown.table" + b.id, d), a(b.window)
          .on("input.table" + b.id, d), a(b.window)
          .on("keyup.table" + b.id, d), b.events.on("html.get", function (a) {
            return a = a.replace(/<(td|th)((?:[\w\W]*?))class="([\w\W]*?)fr-selected-cell([\w\W]*?)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/(td|th)>/g, '<$1$2class="$3$4"$5>$6</$7>'), a = a.replace(/<(td|th)((?:[\w\W]*?)) class=""((?:[\w\W]*?))>((?:[\w\W]*?))<\/(td|th)>/g, "<$1$2$3>$4</$5>")
          }), b.events.on("destroy", function () {
            b.$el.off("mousedown.table" + b.id), b.$el.off("mouseenter.table" + b.id, "th, td"), b.$window.off("mouseup.table" + b.id), b.$el.off("keydown.table" + b.id), b.$window.off("mousemove.table" + b.id), a(b.window)
              .off("scroll.table" + b.id), a(b.window)
              .off("keydown.table" + b.id), a(b.window)
              .off("input.table" + b.id), a(b.window)
              .off("keyup.table" + b.id)
          }, !0)), void b.events.on("keydown", aa, !0)) : !1
      }

      function da() {
        b.$el.find(".fr-selected-cell")
          .length > 0 ? d() : (b.popups.hide("table.insert"), b.toolbar.showInline())
      }
      var ea, fa, ga, ha, ia, ja, ka;
      return {
        _init: ca
        , insert: m
        , remove: n
        , insertRow: q
        , deleteRow: r
        , insertColumn: s
        , deleteColumn: t
        , mergeCells: u
        , splitCellVertically: w
        , splitCellHorizontally: v
        , addHeader: o
        , removeHeader: p
        , setBackground: x
        , showInsertPopup: c
        , showEditPopup: d
        , showColorsPopup: e
        , back: da
        , verticalAlign: y
        , horizontalAlign: z
        , applyStyle: A
      }
    }, a.FroalaEditor.DefineIcon("insertTable", {
      NAME: "table"
    }), a.FroalaEditor.RegisterCommand("insertTable", {
      title: "Insert Table"
      , undo: !1
      , focus: !0
      , refreshOnCallback: !1
      , popup: !0
      , callback: function () {
        this.popups.isVisible("table.insert") ? (this.$el.find(".fr-marker") && (this.events.disableBlur(), this.selection.restore()), this.popups.hide("table.insert")) : this.table.showInsertPopup()
      }
      , plugin: "table"
    }), a.FroalaEditor.RegisterCommand("tableInsert", {
      callback: function (a, b, c) {
        this.table.insert(b, c), this.popups.hide("table.insert")
      }
    }), a.FroalaEditor.DefineIcon("tableHeader", {
      NAME: "header"
    }), a.FroalaEditor.RegisterCommand("tableHeader", {
      title: "Table Header"
      , focus: !1
      , callback: function () {
        var a = this.popups.get("table.edit")
          .find('.fr-command[data-cmd="tableHeader"]');
        a.hasClass("fr-active") ? this.table.removeHeader() : this.table.addHeader()
      }
      , refresh: function (a) {
        var b = this.$el.find(".fr-selected-cell")
          .closest("table");
        b.length > 0 && (0 === b.find("th")
          .length ? a.removeClass("fr-active") : a.addClass("fr-active"))
      }
    }), a.FroalaEditor.DefineIcon("tableRows", {
      NAME: "bars"
    }), a.FroalaEditor.RegisterCommand("tableRows", {
      type: "dropdown"
      , focus: !1
      , title: "Row"
      , options: {
        above: "Insert row above"
        , below: "Insert row below"
        , "delete": "Delete row"
      }
      , html: function () {
        var b = '<ul class="fr-dropdown-list">'
          , c = a.FroalaEditor.COMMANDS.tableRows.options;
        for (var d in c) b += '<li><a class="fr-command" data-cmd="tableRows" data-param1="' + d + '" title="' + this.language.translate(c[d]) + '">' + this.language.translate(c[d]) + "</a></li>";
        return b += "</ul>"
      }
      , callback: function (a, b) {
        "above" == b || "below" == b ? this.table.insertRow(b) : this.table.deleteRow()
      }
    }), a.FroalaEditor.DefineIcon("tableColumns", {
      NAME: "bars fa-rotate-90"
    }), a.FroalaEditor.RegisterCommand("tableColumns", {
      type: "dropdown"
      , focus: !1
      , title: "Column"
      , options: {
        before: "Insert column before"
        , after: "Insert column after"
        , "delete": "Delete column"
      }
      , html: function () {
        var b = '<ul class="fr-dropdown-list">'
          , c = a.FroalaEditor.COMMANDS.tableColumns.options;
        for (var d in c) b += '<li><a class="fr-command" data-cmd="tableColumns" data-param1="' + d + '" title="' + this.language.translate(c[d]) + '">' + this.language.translate(c[d]) + "</a></li>";
        return b += "</ul>"
      }
      , callback: function (a, b) {
        "before" == b || "after" == b ? this.table.insertColumn(b) : this.table.deleteColumn()
      }
    }), a.FroalaEditor.DefineIcon("tableCells", {
      NAME: "square-o"
    }), a.FroalaEditor.RegisterCommand("tableCells", {
      type: "dropdown"
      , focus: !1
      , title: "Cell"
      , options: {
        merge: "Merge cells"
        , "vertical-split": "Vertical split"
        , "horizontal-split": "Horizontal split"
      }
      , html: function () {
        var b = '<ul class="fr-dropdown-list">'
          , c = a.FroalaEditor.COMMANDS.tableCells.options;
        for (var d in c) b += '<li><a class="fr-command" data-cmd="tableCells" data-param1="' + d + '" title="' + this.language.translate(c[d]) + '">' + this.language.translate(c[d]) + "</a></li>";
        return b += "</ul>"
      }
      , callback: function (a, b) {
        "merge" == b ? this.table.mergeCells() : "vertical-split" == b ? this.table.splitCellVertically() : this.table.splitCellHorizontally()
      }
      , refreshOnShow: function (a, b) {
        this.$el.find(".fr-selected-cell")
          .length > 1 ? (b.find('a[data-param1="vertical-split"]')
            .addClass("fr-disabled"), b.find('a[data-param1="horizontal-split"]')
            .addClass("fr-disabled"), b.find('a[data-param1="merge"]')
            .removeClass("fr-disabled")) : (b.find('a[data-param1="merge"]')
            .addClass("fr-disabled"), b.find('a[data-param1="vertical-split"]')
            .removeClass("fr-disabled"), b.find('a[data-param1="horizontal-split"]')
            .removeClass("fr-disabled"))
      }
    }), a.FroalaEditor.DefineIcon("tableRemove", {
      NAME: "trash"
    }), a.FroalaEditor.RegisterCommand("tableRemove", {
      title: "Удалить таблицу"
      , focus: !1
      , callback: function () {
        this.table.remove()
      }
    }), a.FroalaEditor.DefineIcon("tableStyle", {
      NAME: "paint-brush"
    }), a.FroalaEditor.RegisterCommand("tableStyle", {
      title: "Table Style"
      , type: "dropdown"
      , focus: !1
      , html: function () {
        var a = '<ul class="fr-dropdown-list">'
          , b = this.opts.tableStyles;
        for (var c in b) a += '<li><a class="fr-command" data-cmd="tableStyle" data-param1="' + c + '" title="' + this.language.translate(b[c]) + '">' + this.language.translate(b[c]) + "</a></li>";
        return a += "</ul>"
      }
      , callback: function (a, b) {
        this.table.applyStyle(b, this.$el.find(".fr-selected-cell")
          .closest("table"), this.opts.tableMultipleStyles, this.opts.tableStyles)
      }
      , refreshOnShow: function (b, c) {
        var d = this.$el.find(".fr-selected-cell")
          .closest("table");
        d && c.find(".fr-command")
          .each(function () {
            var b = a(this)
              .data("param1");
            a(this)
              .toggleClass("fr-active", d.hasClass(b))
          })
      }
    }), a.FroalaEditor.DefineIcon("tableCellBackground", {
      NAME: "tint"
    }), a.FroalaEditor.RegisterCommand("tableCellBackground", {
      title: "Cell Background"
      , focus: !1
      , callback: function () {
        this.table.showColorsPopup()
      }
    }), a.FroalaEditor.RegisterCommand("tableCellBackgroundColor", {
      undo: !0
      , focus: !1
      , callback: function (a, b) {
        this.table.setBackground(b)
      }
    }), a.FroalaEditor.DefineIcon("tableBack", {
      NAME: "arrow-left"
    }), a.FroalaEditor.RegisterCommand("tableBack", {
      title: "Back"
      , undo: !1
      , focus: !1
      , back: !0
      , callback: function () {
        this.table.back()
      }
      , refresh: function (a) {
        0 !== this.$el.find(".fr-selected-cell")
          .length || this.opts.toolbarInline ? (a.removeClass("fr-hidden"), a.next(".fr-separator")
            .removeClass("fr-hidden")) : (a.addClass("fr-hidden"), a.next(".fr-separator")
            .addClass("fr-hidden"))
      }
    }), a.FroalaEditor.DefineIcon("tableCellVerticalAlign", {
      NAME: "arrows-v"
    }), a.FroalaEditor.RegisterCommand("tableCellVerticalAlign", {
      type: "dropdown"
      , focus: !1
      , title: "Vertical Align"
      , options: {
        Top: "Align Top"
        , Middle: "Align Middle"
        , Bottom: "Align Bottom"
      }
      , html: function () {
        var b = '<ul class="fr-dropdown-list">'
          , c = a.FroalaEditor.COMMANDS.tableCellVerticalAlign.options;
        for (var d in c) b += '<li><a class="fr-command" data-cmd="tableCellVerticalAlign" data-param1="' + d.toLowerCase() + '" title="' + this.language.translate(c[d]) + '">' + this.language.translate(d) + "</a></li>";
        return b += "</ul>"
      }
      , callback: function (a, b) {
        this.table.verticalAlign(b)
      }
      , refreshOnShow: function (a, b) {
        b.find('.fr-command[data-param1="' + this.$el.find(".fr-selected-cell")
            .css("vertical-align") + '"]')
          .addClass("fr-active")
      }
    }), a.FroalaEditor.DefineIcon("tableCellHorizontalAlign", {
      NAME: "align-left"
    }), a.FroalaEditor.DefineIcon("align-left", {
      NAME: "align-left"
    }), a.FroalaEditor.DefineIcon("align-right", {
      NAME: "align-right"
    }), a.FroalaEditor.DefineIcon("align-center", {
      NAME: "align-center"
    }), a.FroalaEditor.DefineIcon("align-justify", {
      NAME: "align-justify"
    }), a.FroalaEditor.RegisterCommand("tableCellHorizontalAlign", {
      type: "dropdown"
      , focus: !1
      , title: "Выравнивание"
      , options: {
        left: "Align Left"
        , center: "Align Center"
        , right: "Align Right"
        , justify: "Align Justify"
      }
      , html: function () {
        var b = '<ul class="fr-dropdown-list">'
          , c = a.FroalaEditor.COMMANDS.tableCellHorizontalAlign.options;
        for (var d in c) b += '<li><a class="fr-command fr-title" data-cmd="tableCellHorizontalAlign" data-param1="' + d + '" title="' + this.language.translate(c[d]) + '">' + this.icon.create("align-" + d) + "</a></li>";
        return b += "</ul>"
      }
      , callback: function (a, b) {
        this.table.horizontalAlign(b)
      }
      , refresh: function (a) {
        a.find("> *:first")
          .replaceWith(this.icon.create("align-" + this.helpers.getAlignment(this.$el.find(".fr-selected-cell:first"))))
      }
      , refreshOnShow: function (a, b) {
        b.find('.fr-command[data-param1="' + this.helpers.getAlignment(this.$el.find(".fr-selected-cell:first")) + '"]')
          .addClass("fr-active")
      }
    }), a.FroalaEditor.DefineIcon("tableCellStyle", {
      NAME: "magic"
    }), a.FroalaEditor.RegisterCommand("tableCellStyle", {
      title: "Cell Style"
      , type: "dropdown"
      , focus: !1
      , html: function () {
        var a = '<ul class="fr-dropdown-list">'
          , b = this.opts.tableCellStyles;
        for (var c in b) a += '<li><a class="fr-command" data-cmd="tableCellStyle" data-param1="' + c + '" title="' + this.language.translate(b[c]) + '">' + this.language.translate(b[c]) + "</a></li>";
        return a += "</ul>"
      }
      , callback: function (a, b) {
        this.table.applyStyle(b, this.$el.find(".fr-selected-cell"), this.opts.tableCellMultipleStyles, this.opts.tableCellStyles)
      }
      , refreshOnShow: function (b, c) {
        var d = this.$el.find(".fr-selected-cell:first");
        d && c.find(".fr-command")
          .each(function () {
            var b = a(this)
              .data("param1");
            a(this)
              .toggleClass("fr-active", d.hasClass(b))
          })
      }
    })
  });

  return true;
}).then(function(data) {
  /* FONT SIZE */
  !function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){"use strict";a.extend(a.FroalaEditor.DEFAULTS,{fontSize:["8","9","10","11","12","14","18","24","30","36","48","60","72","96"],fontSizeSelection:!1}),a.FroalaEditor.PLUGINS.fontSize=function(b){function c(a){b.commands.applyProperty("font-size",a+"px")}function d(c,d){var e=b.helpers.getPX(a(b.selection.element()).css("font-size"));d.find(".fr-command.fr-active").removeClass("fr-active"),d.find('.fr-command[data-param1="'+e+'"]').addClass("fr-active");var f=d.find(".fr-dropdown-list"),g=d.find(".fr-active").parent();g.length?f.parent().scrollTop(g.offset().top-f.offset().top-(f.parent().outerHeight()/2-g.outerHeight()/2)):f.parent().scrollTop(0)}function e(c){var d=b.helpers.getPX(a(b.selection.element()).css("font-size"));c.find("> span").text(d)}return{apply:c,refreshOnShow:d,refresh:e}},a.FroalaEditor.RegisterCommand("fontSize",{type:"dropdown",title:"Font Size",displaySelection:function(a){return a.opts.fontSizeSelection},displaySelectionWidth:30,defaultSelection:"12",html:function(){for(var a='<ul class="fr-dropdown-list">',b=this.opts.fontSize,c=0;c<b.length;c++){var d=b[c];a+='<li><a class="fr-command" data-cmd="fontSize" data-param1="'+d+'" title="'+d+'">'+d+"</a></li>"}return a+="</ul>"},callback:function(a,b){this.fontSize.apply(b)},refresh:function(a){this.fontSize.refresh(a)},refreshOnShow:function(a,b){this.fontSize.refreshOnShow(a,b)},plugin:"fontSize"}),a.FroalaEditor.DefineIcon("fontSize",{NAME:"text-height"})});
  return true;
}).then(function(data) {
  /* LISTS */
  !function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){"use strict";a.FroalaEditor.PLUGINS.lists=function(b){function c(a){return'<span class="fr-open-'+a.toLowerCase()+'"></span>'}function d(a){return'<span class="fr-close-'+a.toLowerCase()+'"></span>'}function e(b,c){for(var d=[],e=0;e<b.length;e++){var f=b[e].parentNode;"LI"==b[e].tagName&&f.tagName!=c&&d.indexOf(f)<0&&d.push(f)}for(e=d.length-1;e>=0;e--){var g=a(d[e]);g.replaceWith("<"+c.toLowerCase()+">"+g.html()+"</"+c.toLowerCase()+">")}}function f(c,d){e(c,d);for(var f=b.html.defaultTag(),g=0;g<c.length;g++)"LI"!=c[g].tagName&&(f&&c[g].tagName.toLowerCase()==f?a(c[g]).replaceWith("<"+d+"><li"+b.node.attributes(c[g])+">"+a(c[g]).html()+"</li></"+d+">"):a(c[g]).wrap("<"+d+"><li></li></"+d+">"));b.clean.lists()}function g(e){var f,g;for(f=e.length-1;f>=0;f--)for(g=f-1;g>=0;g--)if(a(e[g]).find(e[f]).length||e[g]==e[f]){e.splice(f,1);break}var h=[];for(f=0;f<e.length;f++){var i=a(e[f]),j=e[f].parentNode;i.before(d(j.tagName)),"LI"==j.parentNode.tagName?(i.before(d("LI")),i.after(c("LI"))):(b.node.isEmpty(i.get(0),!0)||0!==i.find(b.html.blockTagsQuery()).length||i.append("<br>"),i.append(c("LI")),i.prepend(d("LI"))),i.after(c(j.tagName)),"LI"==j.parentNode.tagName&&(j=j.parentNode.parentNode),h.indexOf(j)<0&&h.push(j)}for(f=0;f<h.length;f++){var k=a(h[f]),l=k.html();l=l.replace(/<span class="fr-close-([a-z]*)"><\/span>/g,"</$1>"),l=l.replace(/<span class="fr-open-([a-z]*)"><\/span>/g,"<$1>"),k.replaceWith(b.node.openTagString(k.get(0))+l+b.node.closeTagString(k.get(0)))}b.$el.find("li:empty").remove(),b.$el.find("ul:empty, ol:empty").remove(),b.clean.lists(),b.html.wrap()}function h(a,b){for(var c=!0,d=0;d<a.length;d++){if("LI"!=a[d].tagName)return!1;a[d].parentNode.tagName!=b&&(c=!1)}return c}function i(a){b.selection.save(),b.html.wrap(!0,!0),b.selection.restore();for(var c=b.selection.blocks(),d=0;d<c.length;d++)"LI"!=c[d].tagName&&"LI"==c[d].parentNode.tagName&&(c[d]=c[d].parentNode);b.selection.save(),h(c,a)?g(c):f(c,a),b.html.unwrap(),b.selection.restore()}function j(c,d){var e=a(b.selection.element());if(e.get(0)!=b.$el.get(0)){var f=e.get(0);"LI"!=f.tagName&&(f=e.parents("li").get(0)),f&&f.parentNode.tagName==d&&b.$el.get(0).contains(f.parentNode)&&c.addClass("fr-active")}}function k(c){b.selection.save();for(var d=0;d<c.length;d++){var e=c[d].previousSibling;if(e){var f=a(c[d]).find("> ul, > ol").get(0);if(f){for(var g=a("<li>").prependTo(a(f)),h=b.node.contents(c[d])[0];h&&!b.node.isList(h);){var i=h.nextSibling;g.append(h),h=i}a(e).append(a(f)),a(c[d]).remove()}else{var j=a(e).find("> ul, > ol").get(0);if(j)a(j).append(a(c[d]));else{var k=a("<"+c[d].parentNode.tagName+">");a(e).append(k),k.append(a(c[d]))}}}}b.clean.lists(),b.selection.restore()}function l(a){b.selection.save(),g(a),b.selection.restore()}function m(a){if("indent"==a||"outdent"==a){for(var c=!1,d=b.selection.blocks(),e=[],f=0;f<d.length;f++)"LI"==d[f].tagName?(c=!0,e.push(d[f])):"LI"==d[f].parentNode.tagName&&(c=!0,e.push(d[f].parentNode));c&&("indent"==a?k(e):l(e))}}function n(){b.events.on("commands.after",m),b.events.on("keydown",function(c){if(c.which==a.FroalaEditor.KEYCODE.TAB){for(var d,e=b.selection.blocks(),f=[],g=0;g<e.length;g++)"LI"==e[g].tagName?(d=!0,f.push(e[g])):"LI"==e[g].parentNode.tagName&&(d=!0,f.push(e[g].parentNode));if(d)return c.preventDefault(),c.stopPropagation(),c.shiftKey?l(f):k(f),!1}},!0)}return{_init:n,format:i,refresh:j}},a.FroalaEditor.RegisterCommand("formatUL",{title:"Unordered List",refresh:function(a){this.lists.refresh(a,"UL")},callback:function(){this.lists.format("UL")},plugin:"lists"}),a.FroalaEditor.RegisterCommand("formatOL",{title:"Ordered List",refresh:function(a){this.lists.refresh(a,"OL")},callback:function(){this.lists.format("OL")},plugin:"lists"}),a.FroalaEditor.DefineIcon("formatUL",{NAME:"list-ul"}),a.FroalaEditor.DefineIcon("formatOL",{NAME:"list-ol"})});
  return true;
}).then(function(data) {
  !function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){"use strict";a.extend(a.FroalaEditor.DEFAULTS,{paragraphFormat:{N:"Normal",H1:"Heading 1",H2:"Heading 2",H3:"Heading 3",H4:"Heading 4",PRE:"Code"},paragraphFormatSelection:!1}),a.FroalaEditor.PLUGINS.paragraphFormat=function(b){function c(c,d){var e=b.html.defaultTag();if(d&&d.toLowerCase()!=e)if(c.find("ul, ol").length>0){var f=a("<"+d+">");c.prepend(f);for(var g=b.node.contents(c.get(0))[0];g&&["UL","OL"].indexOf(g.tagName)<0;){var h=g.nextSibling;f.append(g),g=h}}else c.html("<"+d+">"+c.html()+"</"+d+">")}function d(c,d){var e=b.html.defaultTag();d||(d='div class="fr-temp-div" data-empty="true"'),d.toLowerCase()==e?c.replaceWith(c.html()):c.replaceWith(a("<"+d+">").html(c.html()))}function e(c,d){var e=b.html.defaultTag();d||(d='div class="fr-temp-div"'+(b.node.isEmpty(c.get(0),!0)?' data-empty="true"':"")),d.toLowerCase()==e?(b.node.isEmpty(c.get(0),!0)||c.append("<br/>"),c.replaceWith(c.html())):c.replaceWith(a("<"+d+">").html(c.html()))}function f(c,d){d||(d='div class="fr-temp-div"'+(b.node.isEmpty(c.get(0),!0)?' data-empty="true"':"")),c.replaceWith(a("<"+d+" "+b.node.attributes(c.get(0))+">").html(c.html()))}function g(g){"N"==g&&(g=b.html.defaultTag()),b.selection.save(),b.html.wrap(!0,!0,!0),b.selection.restore();var h=b.selection.blocks();b.selection.save(),b.$el.find("pre").attr("skip",!0);for(var i=0;i<h.length;i++)if(h[i].tagName!=g&&!b.node.isList(h[i])){var j=a(h[i]);"LI"==h[i].tagName?c(j,g):"LI"==h[i].parentNode.tagName&&h[i]?d(j,g):["TD","TH"].indexOf(h[i].parentNode.tagName)>=0?e(j,g):f(j,g)}b.$el.find('pre:not([skip="true"]) + pre:not([skip="true"])').each(function(){a(this).prev().append("<br>"+a(this).html()),a(this).remove()}),b.$el.find("pre").removeAttr("skip"),b.html.unwrap(),b.selection.restore()}function h(a,c){var d=b.selection.blocks();if(d.length){var e=d[0],f="N",g=b.html.defaultTag();e.tagName.toLowerCase()!=g&&e!=b.$el.get(0)&&(f=e.tagName),c.find('.fr-command[data-param1="'+f+'"]').addClass("fr-active")}else c.find('.fr-command[data-param1="N"]').addClass("fr-active")}function i(a,c){var d=b.selection.blocks();if(d.length){var e=d[0],f="N",g=b.html.defaultTag();e.tagName.toLowerCase()!=g&&e!=b.$el.get(0)&&(f=e.tagName),["LI","TD","TH"].indexOf(f)>=0&&(f="N"),a.find("> span").text(c.find('.fr-command[data-param1="'+f+'"]').text())}else a.find("> span").text(c.find('.fr-command[data-param1="N"]').text())}return{apply:g,refreshOnShow:h,refresh:i}},a.FroalaEditor.RegisterCommand("paragraphFormat",{type:"dropdown",displaySelection:function(a){return a.opts.paragraphFormatSelection},defaultSelection:"Normal",displaySelectionWidth:100,html:function(){var a='<ul class="fr-dropdown-list">',b=this.opts.paragraphFormat;for(var c in b)a+="<li><"+c+' style="padding: 0 !important; margin: 0 !important;"><a class="fr-command" data-cmd="paragraphFormat" data-param1="'+c+'" title="'+this.language.translate(b[c])+'">'+this.language.translate(b[c])+"</a></"+c+"></li>";return a+="</ul>"},title:"Paragraph Format",callback:function(a,b){this.paragraphFormat.apply(b)},refresh:function(a,b){this.paragraphFormat.refresh(a,b)},refreshOnShow:function(a,b){this.paragraphFormat.refreshOnShow(a,b)},plugin:"paragraphFormat"}),a.FroalaEditor.DefineIcon("paragraphFormat",{NAME:"paragraph"})});
  return true;
}).then(function(data) {
  !function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){"use strict";a.extend(a.FroalaEditor.DEFAULTS,{paragraphStyles:{"fr-text-gray":"Gray","fr-text-bordered":"Bordered","fr-text-spaced":"Spaced","fr-text-uppercase":"Uppercase"},paragraphMultipleStyles:!0}),a.FroalaEditor.PLUGINS.paragraphStyle=function(b){function c(c){var d="";b.opts.paragraphMultipleStyles||(d=Object.keys(b.opts.paragraphStyles),d.splice(d.indexOf(c),1),d=d.join(" ")),b.selection.save(),b.html.wrap(!0,!0,!0),b.selection.restore();var e=b.selection.blocks();b.selection.save();for(var f=0;f<e.length;f++)a(e[f]).removeClass(d).toggleClass(c),a(e[f]).hasClass("fr-temp-div")&&a(e[f]).removeClass("fr-temp-div"),""===a(e[f]).attr("class")&&a(e[f]).removeAttr("class");b.html.unwrap(),b.selection.restore()}function d(c,d){var e=b.selection.blocks();if(e.length){var f=a(e[0]);d.find(".fr-command").each(function(){var b=a(this).data("param1");a(this).toggleClass("fr-active",f.hasClass(b))})}}function e(){}return{_init:e,apply:c,refreshOnShow:d}},a.FroalaEditor.RegisterCommand("paragraphStyle",{type:"dropdown",html:function(){var a='<ul class="fr-dropdown-list">',b=this.opts.paragraphStyles;for(var c in b)a+='<li><a class="fr-command '+c+'" data-cmd="paragraphStyle" data-param1="'+c+'" title="'+this.language.translate(b[c])+'">'+this.language.translate(b[c])+"</a></li>";return a+="</ul>"},title:"Paragraph Style",callback:function(a,b){this.paragraphStyle.apply(b)},refreshOnShow:function(a,b){this.paragraphStyle.refreshOnShow(a,b)},plugin:"paragraphStyle"}),a.FroalaEditor.DefineIcon("paragraphStyle",{NAME:"magic"})});
  return true;
}).then(function(data) {
  !function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){"use strict";a.extend(a.FroalaEditor.POPUP_TEMPLATES,{"image.insert":"[_BUTTONS_][_UPLOAD_LAYER_][_BY_URL_LAYER_][_PROGRESS_BAR_]","image.edit":"[_BUTTONS_]","image.alt":"[_BUTTONS_][_ALT_LAYER_]","image.size":"[_BUTTONS_][_SIZE_LAYER_]"}),a.extend(a.FroalaEditor.DEFAULTS,{imageInsertButtons:["imageBack","|","imageUpload","imageByURL"],imageEditButtons:["imageReplace","imageAlign","imageRemove","|","imageLink","linkOpen","linkEdit","linkRemove","-","imageDisplay","imageStyle","imageAlt","imageSize"],imageAltButtons:["imageBack","|"],imageSizeButtons:["imageBack","|"],imageUploadURL:"http://i.froala.com/upload",imageUploadParam:"file",imageUploadParams:{},imageUploadToS3:!1,imageUploadMethod:"POST",imageMaxSize:10485760,imageAllowedTypes:["jpeg","jpg","png","gif","svg+xml"],imageResize:!0,imageResizeWithPercent:!1,imageMove:!0,imageDefaultWidth:300,imageDefaultAlign:"center",imageDefaultDisplay:"block",imageStyles:{"fr-rounded":"Rounded","fr-bordered":"Bordered"},imageMultipleStyles:!0,imageTextNear:!0,imagePaste:!0}),a.FroalaEditor.PLUGINS.image=function(b){function c(){var a=b.popups.get("image.insert"),c=a.find(".fr-image-by-url-layer input");c.val(""),ia&&c.val(ia.attr("src")),c.trigger("change")}function d(){var a=b.$tb.find('.fr-command[data-cmd="insertImage"]'),c=b.popups.get("image.insert");if(c||(c=F()),r(),!c.hasClass("fr-active"))if(b.popups.refresh("image.insert"),b.popups.setContainer("image.insert",b.$tb),a.is(":visible")){var d=a.offset().left+a.outerWidth()/2,e=a.offset().top+(b.opts.toolbarBottom?10:a.outerHeight()-10);b.popups.show("image.insert",d,e,a.outerHeight())}else b.position.forSelection(c),b.popups.show("image.insert")}function e(){var c=b.popups.get("image.edit");c||(c=p()),b.popups.setContainer("image.edit",a(b.opts.scrollableContainer)),b.popups.refresh("image.edit");var d=ia.offset().left+ia.outerWidth()/2,e=ia.offset().top+ia.outerHeight();b.popups.show("image.edit",d,e,ia.outerHeight())}function f(){r()}function g(a){if(!a.hasClass("fr-dii")&&!a.hasClass("fr-dib")){var c=a.css("float");a.css("float","none"),"block"==a.css("display")?(a.css("float",c),0===parseInt(a.css("margin-left"),10)&&(a.attr("style")||"").indexOf("margin-right: auto")>=0?a.addClass("fr-fil"):0===parseInt(a.css("margin-right"),10)&&(a.attr("style")||"").indexOf("margin-left: auto")>=0&&a.addClass("fr-fir"),a.addClass("fr-dib")):(a.css("float",c),"left"==a.css("float")?a.addClass("fr-fil"):"right"==a.css("float")&&a.addClass("fr-fir"),a.addClass("fr-dii")),a.css("margin",""),a.css("float",""),a.css("display",""),a.css("z-index",""),a.css("position",""),a.css("overflow",""),a.css("vertical-align","")}a.attr("width")&&(a.css("width",a.width()),a.removeAttr("width")),b.opts.imageTextNear||a.removeClass("fr-dii").addClass("fr-dib")}function h(){for(var c="IMG"==b.$el.get(0).tagName?[b.$el.get(0)]:b.$el.get(0).querySelectorAll("img"),d=0;d<c.length;d++)g(a(c[d])),b.opts.iframe&&a(c[d]).on("load",b.size.syncIframe)}function i(){var c,d=Array.prototype.slice.call(b.$el.get(0).querySelectorAll("img")),e=[];for(c=0;c<d.length;c++)e.push(d[c].getAttribute("src"));if(ua)for(c=0;c<ua.length;c++)e.indexOf(ua[c].getAttribute("src"))<0&&b.events.trigger("image.removed",[a(ua[c])]);ua=d}function j(){ja||R();var a=b.$wp?b.$wp.scrollTop()-(b.$wp.offset().top+1):-1,c=b.$wp?b.$wp.scrollLeft()-(b.$wp.offset().left+1):-1;b.$wp&&(c-=b.helpers.getPX(b.$wp.css("border-left-width"))),ja.css("top",b.opts.iframe?ia.offset().top-1:ia.offset().top+a).css("left",b.opts.iframe?ia.offset().left-1:ia.offset().left+c).css("width",ia.outerWidth()).css("height",ia.outerHeight()).addClass("fr-active")}function k(a){return'<div class="fr-handler fr-h'+a+'"></div>'}function l(c){return c.preventDefault(),c.stopPropagation(),b.$el.find("img.fr-error").left?!1:(ka=a(this),ka.data("start-x",c.pageX||c.originalEvent.touches[0].pageX),ka.data("start-width",ia.width()),la.show(),void b.popups.hideAll())}function m(c){if(ka&&ia){if(c.preventDefault(),b.$el.find("img.fr-error").left)return!1;var d=c.pageX||(c.originalEvent.touches?c.originalEvent.touches[0].pageX:null);if(!d)return!1;var e=ka.data("start-x"),f=d-e,g=ka.data("start-width");if((ka.hasClass("fr-hnw")||ka.hasClass("fr-hsw"))&&(f=0-f),b.opts.imageResizeWithPercent){var h=ia.parentsUntil(b.$el,b.html.blockTagsQuery()).get(0);ia.css("width",((g+f)/a(h).outerWidth()*100).toFixed(2)+"%")}else ia.css("width",g+f);ia.css("height","").removeAttr("height"),j(),b.events.trigger("image.resize",[ga()])}}function n(a){if(ka&&ia){if(a&&a.stopPropagation(),b.$el.find("img.fr-error").left)return!1;ka=null,la.hide(),j(),e(),b.undo.saveStep(),b.events.trigger("image.resizeEnd",[ga()])}}function o(a,c){b.edit.on(),ia&&ia.addClass("fr-error"),t(b.language.translate("Something went wrong. Please try again.")),b.events.trigger("image.error",[{code:a,message:ta[a]},c])}function p(){var a="";b.opts.imageEditButtons.length>1&&(a+='<div class="fr-buttons">',a+=b.button.buildList(b.opts.imageEditButtons),a+="</div>");var c={buttons:a},d=b.popups.create("image.edit",c);return b.$wp&&(b.$wp.on("scroll.image-edit",function(){ia&&b.popups.isVisible("image.edit")&&e()}),b.events.on("destroy",function(){b.$wp.off("scroll.image-edit")})),d}function q(){var a=b.popups.get("image.insert");a&&(a.find(".fr-layer.fr-active").removeClass("fr-active").addClass("fr-pactive"),a.find(".fr-image-progress-bar-layer").addClass("fr-active"),a.find(".fr-buttons").hide(),s("Uploading",0))}function r(a){var c=b.popups.get("image.insert");c&&(c.find(".fr-layer.fr-pactive").addClass("fr-active").removeClass("fr-pactive"),c.find(".fr-image-progress-bar-layer").removeClass("fr-active"),c.find(".fr-buttons").show(),(a||b.$el.find("img.fr-error").length)&&(b.events.focus(),b.$el.find("img.fr-error").remove(),b.undo.saveStep(),b.undo.run(),b.undo.dropRedo()))}function s(a,c){var d=b.popups.get("image.insert");if(d){var e=d.find(".fr-image-progress-bar-layer");e.find("h3").text(a+(c?" "+c+"%":"")),e.removeClass("fr-error"),c?(e.find("div").removeClass("fr-indeterminate"),e.find("div > span").css("width",c+"%")):e.find("div").addClass("fr-indeterminate")}}function t(a){var c=b.popups.get("image.insert"),d=c.find(".fr-image-progress-bar-layer");d.addClass("fr-error"),d.find("h3").text(a)}function u(){var a=b.popups.get("image.insert"),c=a.find(".fr-image-by-url-layer input");c.val().length>0&&(q(),s("Loading image"),v(b.helpers.sanitizeURL(c.val()),!0,[],ia),c.val(""),c.blur())}function v(c,d,e,f,g){b.edit.off(),s("Loading image");var h=new Image;h.onload=function(){var d,h;if(f){var i=f.data("fr-old-src");b.$wp?(d=f.clone().removeData("fr-old-src"),i&&f.attr("src",i),f.removeClass("fr-uploading"),f.replaceWith(d),d.off("load")):d=f;for(var j=d.get(0).attributes,k=0;k<j.length;k++){var l=j[k];0===l.nodeName.indexOf("data-")&&d.removeAttr(l.nodeName)}if("undefined"!=typeof e)for(h in e)"link"!=h&&d.attr("data-"+h,e[h]);d.on("load",function(){b.popups.hide("image.insert"),d.removeClass("fr-uploading"),d.next().is("br")&&d.next().remove(),d.trigger("click").trigger("touchend"),b.events.trigger("image.loaded",[d])}),d.attr("src",c),b.edit.on(),b.undo.saveStep(),b.events.trigger(i?"image.replaced":"image.inserted",[d,g])}else{var m="";if("undefined"!=typeof e)for(h in e)"link"!=h&&(m+=" data-"+h+'="'+e[h]+'"');var n=b.opts.imageDefaultWidth;n&&"auto"!=n&&(""+n).indexOf("px")<0&&(""+n).indexOf("%")<0&&(n+="px"),d=a('<img class="fr-di'+b.opts.imageDefaultDisplay[0]+("center"!=b.opts.imageDefaultAlign?" fr-fi"+b.opts.imageDefaultAlign[0]:"")+'" src="'+c+'"'+m+(n?' style="width: '+n+';"':"")+">"),d.on("load",function(){d.next().is("br")&&d.next().remove(),d.trigger("click").trigger("touchend"),b.events.trigger("image.loaded",[d])}),b.edit.on(),b.events.focus(!0),b.selection.restore(),b.selection.isCollapsed()||b.selection.remove(),b.markers.insert();var o=b.$el.find(".fr-marker");o.replaceWith(d),b.selection.clear(),b.undo.saveStep(),b.events.trigger("image.inserted",[d,g])}},h.onerror=function(){o(ma)},h.src=c}function w(c){try{if(b.events.trigger("image.uploaded",[c],!0)===!1)return b.edit.on(),!1;var d=a.parseJSON(c);return d.link?d:(o(na,c),!1)}catch(e){return o(pa,c),!1}}function x(c){try{var d=a(c).find("Location").text(),e=a(c).find("Key").text();return b.events.trigger("image.uploadedToS3",[d,e,c],!0)===!1?(b.edit.on(),!1):d}catch(f){return o(pa,c),!1}}function y(a){s("Loading image");var c=this.status,d=this.response,e=this.responseXML,f=this.responseText;try{if(b.opts.imageUploadToS3)if(201==c){var g=x(e);g&&v(g,!1,[],a,d||e)}else o(pa,d||e);else if(c>=200&&300>c){var h=w(f);h&&v(h.link,!1,h,a,d||f)}else o(oa,d||f)}catch(i){o(pa,d||f)}}function z(){o(pa,this.response||this.responseText||this.responseXML)}function A(a){if(a.lengthComputable){var b=a.loaded/a.total*100|0;s("Uploading",b)}}function B(c,d,f){var g,h=new FileReader;h.addEventListener("load",function(){for(var f=atob(h.result.split(",")[1]),i=[],k=0;k<f.length;k++)i.push(f.charCodeAt(k));var l=window.URL.createObjectURL(new Blob([new Uint8Array(i)],{type:"image/jpeg"}));if(ia)g=ia;else{var m=b.opts.imageDefaultWidth;m&&"auto"!=m&&(""+m).indexOf("px")<0&&(""+m).indexOf("%")<0&&(m+="px"),g=a('<img class="fr-uploading fr-di'+b.opts.imageDefaultDisplay[0]+("center"!=b.opts.imageDefaultAlign?" fr-fi"+b.opts.imageDefaultAlign[0]:"")+'" src="'+l+'"'+(m?' style="width: '+m+';"':"")+">")}if(g.on("load",function(){g.next().is("br")&&g.next().remove(),b.placeholder.refresh(),g.trigger("click").trigger("touchend"),j(),e(),ea(),q(),b.edit.off(),c.onload=function(){y.call(c,g)},c.onerror=z,c.upload.onprogress=A,c.send(d)}),ia)b.edit.on(),b.undo.saveStep(),ia.data("fr-old-src",ia.attr("src")),ia.attr("src",l),g.addClass("fr-uploading");else{b.edit.on(),b.events.focus(!0),b.selection.restore(),b.undo.saveStep(),b.selection.isCollapsed()||b.selection.remove(),b.markers.insert();var n=b.$el.find(".fr-marker");n.replaceWith(g),b.selection.clear()}},!1),h.readAsDataURL(f)}function C(a){if(b.events.trigger("image.beforeUpload",[a])===!1)return!1;if("undefined"!=typeof a&&a.length>0){var c=a[0];if(c.size>b.opts.imageMaxSize)return o(qa),!1;if(b.opts.imageAllowedTypes.indexOf(c.type.replace(/image\//g,""))<0)return o(ra),!1;var d;if(b.drag_support.formdata&&(d=b.drag_support.formdata?new FormData:null),d){var e;if(b.opts.imageUploadToS3!==!1){d.append("key",b.opts.imageUploadToS3.keyStart+(new Date).getTime()+"-"+(c.name||"untitled")),d.append("success_action_status","201"),d.append("X-Requested-With","xhr"),d.append("Content-Type",c.type);for(e in b.opts.imageUploadToS3.params)d.append(e,b.opts.imageUploadToS3.params[e])}for(e in b.opts.imageUploadParams)d.append(e,b.opts.imageUploadParams[e]);d.append(b.opts.imageUploadParam,c);var f=b.opts.imageUploadURL;b.opts.imageUploadToS3&&(f="https://"+b.opts.imageUploadToS3.region+".amazonaws.com/"+b.opts.imageUploadToS3.bucket);var g=b.core.getXHR(f,b.opts.imageUploadMethod);B(g,d,c)}}}function D(b){b.on("dragover dragenter",".fr-image-upload-layer",function(){return a(this).addClass("fr-drop"),!1}),b.on("dragleave dragend",".fr-image-upload-layer",function(){return a(this).removeClass("fr-drop"),!1}),b.on("drop",".fr-image-upload-layer",function(b){b.preventDefault(),b.stopPropagation(),a(this).removeClass("fr-drop");var c=b.originalEvent.dataTransfer;c&&c.files&&C(c.files)}),b.on("change",'.fr-image-upload-layer input[type="file"]',function(){this.files&&C(this.files),a(this).val(""),a(this).blur()})}function E(){b.$el.on(b._mousedown,"IMG"==b.$el.get(0).tagName?null:"img",function(c){b.selection.clear(),b.browser.msie&&(b.events.disableBlur(),b.$el.attr("contenteditable",!1)),b.opts.imageMove||c.preventDefault(),c.stopPropagation(),b.opts.imageMove&&(b.opts.toolbarInline&&b.toolbar.hide(),a(this).addClass("fr-img-move"))}),b.$el.on(b._mouseup,"IMG"==b.$el.get(0).tagName?null:"img",function(c){c.stopPropagation(),b.browser.msie&&(b.$el.attr("contenteditable",!0),b.events.enableBlur()),a(this).removeClass("fr-img-move")});var c=function(a){var c=b.$document.find("img.fr-img-move").get(0);return c?(b.browser.msie&&a.preventDefault(),"undefined"!=typeof b.browser.msie||"undefined"!=typeof b.browser.edge):void a.preventDefault()},d=function(a){a.preventDefault()};b.events.on("dragenter",d,!0),b.events.on("dragover",c,!0),b.events.on("drop",function(c){for(var d,e,f=0;f<a.FroalaEditor.INSTANCES.length;f++)if(d=a.FroalaEditor.INSTANCES[f].$el.find("img.fr-img-move").get(0)){e=a.FroalaEditor.INSTANCES[f];break}if(d){c.preventDefault(),c.stopPropagation();var g=b.markers.insertAtPoint(c.originalEvent);if(g===!1)return!1;Y(!0),e!=b&&e.image&&(e.image.exitEdit(!0),e.popups.hide("image.edit"));var h,i;"A"==d.parentNode.tagName&&0===d.parentNode.textContent.length?(i=a(d.parentNode),h=a(d.parentNode).clone(),h.find("img").removeClass("fr-img-move").on("load",X)):(i=a(d),h=a(d).clone(),h.removeClass("fr-img-move").on("load",X));var j=b.$el.find(".fr-marker");return j.replaceWith(h),i.remove(),b.undo.saveStep(),!1}Y(!0),b.popups.hideAll();var k=c.originalEvent.dataTransfer;if(k&&k.files&&k.files.length&&(d=k.files[0],d&&d.type&&b.opts.imageAllowedTypes.indexOf(d.type.replace(/image\//g,""))>=0)){b.markers.remove(),b.markers.insertAtPoint(c.originalEvent),b.$el.find(".fr-marker").replaceWith(a.FroalaEditor.MARKERS),b.popups.hideAll();var l=b.popups.get("image.insert");return l||(l=F()),b.popups.setContainer("image.insert",a(b.opts.scrollableContainer)),b.popups.show("image.insert",c.originalEvent.pageX,c.originalEvent.pageY),q(),C(k.files),c.preventDefault(),c.stopPropagation(),!1}},!0),b.events.on("document.drop",function(a){b.$el.find("img.fr-img-move").length&&(a.preventDefault(),a.stopPropagation(),b.$el.find("img.fr-img-move").removeClass("fr-img-move"))}),b.events.on("mousedown",Z),b.events.on("window.mousedown",Z),b.events.on("window.touchmove",$),b.events.on("mouseup",Y),b.events.on("window.mouseup",Y),b.events.on("commands.mousedown",function(a){a.parents(".fr-toolbar").length>0&&Y()}),b.events.on("image.hideResizer",function(){Y(!0)}),b.events.on("commands.undo",function(){Y(!0)}),b.events.on("commands.redo",function(){Y(!0)}),b.events.on("destroy",function(){b.$el.off(b._mouseup,"img")},!0)}function F(){var a,d="";b.opts.imageInsertButtons.length>1&&(d='<div class="fr-buttons">'+b.button.buildList(b.opts.imageInsertButtons)+"</div>");var e=b.opts.imageInsertButtons.indexOf("imageUpload"),g=b.opts.imageInsertButtons.indexOf("imageByURL"),h="";e>=0&&(a=" fr-active",g>=0&&e>g&&(a=""),h='<div class="fr-image-upload-layer'+a+' fr-layer" id="fr-image-upload-layer-'+b.id+'"><strong>'+b.language.translate("Drop image")+"</strong><br>("+b.language.translate("or click")+')<div class="fr-form"><input type="file" accept="image/*" tabIndex="-1"></div></div>');var i="";g>=0&&(a=" fr-active",e>=0&&g>e&&(a=""),i='<div class="fr-image-by-url-layer'+a+' fr-layer" id="fr-image-by-url-layer-'+b.id+'"><div class="fr-input-line"><input type="text" placeholder="http://" tabIndex="1"></div><div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="imageInsertByURL" tabIndex="2">'+b.language.translate("Insert")+"</button></div></div>");var j='<div class="fr-image-progress-bar-layer fr-layer"><h3 class="fr-message">Uploading</h3><div class="fr-loader"><span class="fr-progress"></span></div><div class="fr-action-buttons"><button type="button" class="fr-command fr-back" data-cmd="imageDismissError" tabIndex="2">OK</button></div></div>',k={buttons:d,upload_layer:h,by_url_layer:i,progress_bar:j},l=b.popups.create("image.insert",k);return b.popups.onRefresh("image.insert",c),b.popups.onHide("image.insert",f),b.$wp&&b.$wp.on("scroll.image-insert",function(){ia&&b.popups.isVisible("image.insert")&&ea()}),b.events.on("destroy",function(){b.$wp&&b.$wp.off("scroll.image-insert"),l.off("dragover dragenter",".fr-image-upload-layer"),l.off("dragleave dragend",".fr-image-upload-layer"),l.off("drop",".fr-image-upload-layer"),l.off("change",'.fr-image-upload-layer input[type="file"]')}),D(l),l}function G(){if(ia){var a=b.popups.get("image.alt");a.find("input").val(ia.attr("alt")||"").trigger("change")}}function H(){var c=b.popups.get("image.alt");c||(c=I()),r(),b.popups.refresh("image.alt"),b.popups.setContainer("image.alt",a(b.opts.scrollableContainer));var d=ia.offset().left+ia.width()/2,e=ia.offset().top+ia.height();b.popups.show("image.alt",d,e,ia.outerHeight())}function I(){var a="";a='<div class="fr-buttons">'+b.button.buildList(b.opts.imageAltButtons)+"</div>";var c="";c='<div class="fr-image-alt-layer fr-layer fr-active" id="fr-image-alt-layer-'+b.id+'"><div class="fr-input-line"><input type="text" placeholder="'+b.language.translate("Alternate Text")+'" tabIndex="1"></div><div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="imageSetAlt" tabIndex="2">'+b.language.translate("Update")+"</button></div></div>";var d={buttons:a,alt_layer:c},e=b.popups.create("image.alt",d);return b.popups.onRefresh("image.alt",G),b.$wp&&(b.$wp.on("scroll.image-alt",function(){ia&&b.popups.isVisible("image.alt")&&H()}),b.events.on("destroy",function(){b.$wp.off("scroll.image-alt")})),e}function J(a){if(ia){var c=b.popups.get("image.alt");ia.attr("alt",a||c.find("input").val()||""),c.find("input").blur(),setTimeout(function(){ia.trigger("click").trigger("touchend")},b.helpers.isAndroid()?50:0)}}function K(){if(ia){var a=b.popups.get("image.size");a.find('input[name="width"]').val(ia.get(0).style.width).trigger("change"),a.find('input[name="height"]').val(ia.get(0).style.height).trigger("change")}}function L(){var c=b.popups.get("image.size");c||(c=M()),r(),b.popups.refresh("image.size"),b.popups.setContainer("image.size",a(b.opts.scrollableContainer));var d=ia.offset().left+ia.width()/2,e=ia.offset().top+ia.height();b.popups.show("image.size",d,e,ia.outerHeight())}function M(){var a="";a='<div class="fr-buttons">'+b.button.buildList(b.opts.imageSizeButtons)+"</div>";var c="";c='<div class="fr-image-size-layer fr-layer fr-active" id="fr-image-size-layer-'+b.id+'"><div class="fr-image-group"><div class="fr-input-line"><input type="text" name="width" placeholder="'+b.language.translate("Width")+'" tabIndex="1"></div><div class="fr-input-line"><input type="text" name="height" placeholder="'+b.language.translate("Height")+'" tabIndex="1"></div></div><div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="imageSetSize" tabIndex="2">'+b.language.translate("Update")+"</button></div></div>";var d={buttons:a,size_layer:c},e=b.popups.create("image.size",d);return b.popups.onRefresh("image.size",K),b.$wp&&(b.$wp.on("scroll.image-size",function(){ia&&b.popups.isVisible("image.size")&&L()}),b.events.on("destroy",function(){b.$wp.off("scroll.image-size")})),e}function N(a,c){if(ia){var d=b.popups.get("image.size");ia.css("width",a||d.find('input[name="width"]').val()),ia.css("height",c||d.find('input[name="height"]').val()),d.find("input").blur(),setTimeout(function(){ia.trigger("click").trigger("touchend")},b.helpers.isAndroid()?50:0)}}function O(a){var c,d,e=b.popups.get("image.insert");if(ia||b.opts.toolbarInline)ia&&(d=ia.offset().top+ia.outerHeight());else{var f=b.$tb.find('.fr-command[data-cmd="insertImage"]');c=f.offset().left+f.outerWidth()/2,d=f.offset().top+(b.opts.toolbarBottom?10:f.outerHeight()-10)}!ia&&b.opts.toolbarInline&&(d=e.offset().top-b.helpers.getPX(e.css("margin-top")),e.hasClass("fr-above")&&(d+=e.outerHeight())),e.find(".fr-layer").removeClass("fr-active"),e.find(".fr-"+a+"-layer").addClass("fr-active"),b.popups.show("image.insert",c,d,ia?ia.outerHeight():0)}function P(a){var c=b.popups.get("image.insert");c.find(".fr-image-upload-layer").hasClass("fr-active")&&a.addClass("fr-active")}function Q(a){var c=b.popups.get("image.insert");c.find(".fr-image-by-url-layer").hasClass("fr-active")&&a.addClass("fr-active")}function R(){if(ja=a('<div class="fr-image-resizer"></div>'),(b.$wp||a(b.opts.scrollableContainer)).append(ja),ja.on("mousedown",function(a){a.stopPropagation()}),a(b.original_window).on("resize.image"+b.id,function(){b.helpers.isMobile()||Y(!0)}),b.events.on("destroy",function(){ja.html("").removeData().remove(),a(b.original_window).off("resize.image"+b.id)},!0),b.opts.imageResize){ja.append(k("nw")+k("ne")+k("sw")+k("se"));var c=ja.get(0).ownerDocument;ja.on(b._mousedown+".imgresize"+b.id,".fr-handler",l),a(c).on(b._mousemove+".imgresize"+b.id,m),a(c.defaultView||c.parentWindow).on(b._mouseup+".imgresize"+b.id,n),la=a('<div class="fr-image-overlay"></div>'),a(c).find("body").append(la),la.on("mouseleave",n),b.events.on("destroy",function(){ja.off(b._mousedown+".imgresize"+b.id),a(c).off(b._mousemove+".imgresize"+b.id),a(c.defaultView||c.parentWindow).off(b._mouseup+".imgresize"+b.id),la.off("mouseleave").remove()},!0)}}function S(c){c=c||ia,c&&b.events.trigger("image.beforeRemove",[c])!==!1&&(b.popups.hideAll(),Y(!0),c.get(0)==b.$el.get(0)?c.removeAttr("src"):("A"==c.get(0).parentNode.tagName?(b.selection.setBefore(c.get(0).parentNode)||b.selection.setAfter(c.get(0).parentNode),a(c.get(0).parentNode).remove()):(b.selection.setBefore(c.get(0))||b.selection.setAfter(c.get(0)),c.remove()),b.selection.restore(),b.html.fillEmptyBlocks(!0)),b.undo.saveStep())}function T(){E(),b.$el.on(b.helpers.isMobile()&&!b.helpers.isWindowsPhone()?"touchend":"click","IMG"==b.$el.get(0).tagName?null:"img",X),b.helpers.isMobile()&&(b.$el.on("touchstart","IMG"==b.$el.get(0).tagName?null:"img",function(){va=!1}),b.$el.on("touchmove",function(){va=!0})),b.events.on("window.keydown",function(c){var d=c.which;return!ia||d!=a.FroalaEditor.KEYCODE.BACKSPACE&&d!=a.FroalaEditor.KEYCODE.DELETE?ia&&d==a.FroalaEditor.KEYCODE.ESC?(Y(!0),c.preventDefault(),!1):ia&&!b.keys.ctrlKey(c)?(c.preventDefault(),!1):void 0:(c.preventDefault(),S(),!1)},!0),a(b.original_window).on("keydown."+b.id,function(b){var c=b.which;return ia&&c==a.FroalaEditor.KEYCODE.BACKSPACE?(b.preventDefault(),!1):void 0}),b.events.on("paste.before",V),b.events.on("paste.beforeCleanup",W),b.events.on("paste.after",U),b.events.on("html.set",h),h(),b.events.on("html.get",function(a){return a=a.replace(/<(img)((?:[\w\W]*?))class="([\w\W]*?)(fr-uploading|fr-error)([\w\W]*?)"((?:[\w\W]*?))>/g,"")}),b.opts.iframe&&b.events.on("image.loaded",b.size.syncIframe),b.$wp&&(i(),b.events.on("contentChanged",i)),a(b.original_window).on("orientationchange.image."+b.id,function(){setTimeout(function(){var a=ga();a&&a.trigger("click").trigger("touchend")},0)}),b.events.on("destroy",function(){b.$el.off("click touchstart touchend touchmove","img"),b.$el.off("load","img.fr-img-dirty"),b.$el.off("error","img.fr-img-dirty"),a(b.original_window).off("orientationchange.image."+b.id),a(b.original_window).off("keydown."+b.id)},!0),b.events.on("node.remove",function(a){return"IMG"==a.get(0).tagName?(S(a),!1):void 0})}function U(){b.opts.imagePaste?b.$el.find("img[data-fr-image-pasted]").each(function(c,d){if(0===d.src.indexOf("data:")){if(b.events.trigger("image.beforePasteUpload",[d])===!1)return!1;var f=b.opts.imageDefaultWidth;"auto"!=f&&(f+=b.opts.imageResizeWithPercent?"%":"px"),a(d).css("width",f),a(d).addClass("fr-dib"),ia=a(d),j(),e(),ea(),q(),b.edit.off();for(var g=atob(a(d).attr("src").split(",")[1]),h=[],i=0;i<g.length;i++)h.push(g.charCodeAt(i));var k=new Blob([new Uint8Array(h)],{type:"image/jpeg"});C([k]),a(d).removeAttr("data-fr-image-pasted")}else 0!==d.src.indexOf("http")?(b.selection.save(),a(d).remove(),b.selection.restore()):a(d).removeAttr("data-fr-image-pasted")}):b.$el.find("img[data-fr-image-pasted]").remove()}function V(a){if(a&&a.clipboardData&&a.clipboardData.items&&a.clipboardData.items[0]){var c=a.clipboardData.items[0].getAsFile();if(c){var d=new FileReader;return d.onload=function(a){var c=a.target.result,d=b.opts.imageDefaultWidth;d&&"auto"!=d&&(""+d).indexOf("px")<0&&(""+d).indexOf("%")<0&&(d+="px"),b.html.insert('<img data-fr-image-pasted="true" class="fr-di'+b.opts.imageDefaultDisplay[0]+("center"!=b.opts.imageDefaultAlign?" fr-fi"+b.opts.imageDefaultAlign[0]:"")+'" src="'+c+'"'+(d?' style="width: '+d+';"':"")+">"),b.events.trigger("paste.after")},d.readAsDataURL(c),!1}}}function W(a){return a=a.replace(/<img /gi,'<img data-fr-image-pasted="true" ')}function X(c){if(c&&"touchend"==c.type&&va)return!0;if(b.edit.isDisabled())return c.stopPropagation(),c.preventDefault(),!1;b.toolbar.disable(),c.stopPropagation(),c.preventDefault(),b.helpers.isMobile()&&(b.events.disableBlur(),b.$el.blur(),b.events.enableBlur()),b.opts.iframe&&b.size.syncIframe(),ia=a(this),j(),e(),b.selection.clear(),b.button.bulkRefresh(),b.events.trigger("video.hideResizer");for(var d=0;d<a.FroalaEditor.INSTANCES.length;d++)a.FroalaEditor.INSTANCES[d]!=b&&a.FroalaEditor.INSTANCES[d].events.trigger("image.hideResizer");b.helpers.isIOS()&&setTimeout(e,100)}function Y(a){a===!0&&(wa=!0),ia&&wa&&(b.toolbar.enable(),ja.removeClass("fr-active"),b.popups.hide("image.edit"),ia=null),wa=!1}function Z(){wa=!0}function $(){wa=!1}function _(a){ia.removeClass("fr-fir fr-fil"),"left"==a?ia.addClass("fr-fil"):"right"==a&&ia.addClass("fr-fir"),j(),e()}function aa(a){ia&&(ia.hasClass("fr-fil")?a.find("> i").attr("class","fa fa-align-left"):ia.hasClass("fr-fir")?a.find("> i").attr("class","fa fa-align-right"):a.find("> i").attr("class","fa fa-align-justify"))}function ba(a,b){if(ia){var c="justify";ia.hasClass("fr-fil")?c="left":ia.hasClass("fr-fir")&&(c="right"),b.find('.fr-command[data-param1="'+c+'"]').addClass("fr-active")}}function ca(a){ia.removeClass("fr-dii fr-dib"),"inline"==a?ia.addClass("fr-dii"):"block"==a&&ia.addClass("fr-dib"),j(),e()}function da(a,b){var c="block";ia.hasClass("fr-dii")&&(c="inline"),b.find('.fr-command[data-param1="'+c+'"]').addClass("fr-active")}function ea(){var c=b.popups.get("image.insert");c||(c=F()),b.popups.isVisible("image.insert")||(r(),b.popups.refresh("image.insert"),b.popups.setContainer("image.insert",a(b.opts.scrollableContainer)));var d=ia.offset().left+ia.width()/2,e=ia.offset().top+ia.height();b.popups.show("image.insert",d,e,ia.outerHeight())}function fa(){ia?ia.trigger("click").trigger("touchend"):(b.events.disableBlur(),b.selection.restore(),b.events.enableBlur(),b.popups.hide("image.insert"),b.toolbar.showInline())}function ga(){return ia}function ha(a){if(!ia)return!1;if(!b.opts.imageMultipleStyles){var c=Object.keys(b.opts.imageStyles);c.splice(c.indexOf(a),1),ia.removeClass(c.join(" "))}ia.toggleClass(a),ia.trigger("click").trigger("touchend")}var ia,ja,ka,la,ma=1,na=2,oa=3,pa=4,qa=5,ra=6,sa=7,ta={};ta[ma]="Image cannot be loaded from the passed link.",ta[na]="No link in upload response.",ta[oa]="Error during file upload.",ta[pa]="Parsing response failed.",ta[qa]="File is too large.",ta[ra]="Image file type is invalid.",ta[sa]="Files can be uploaded only to same domain in IE 8 and IE 9.";var ua,va,wa=!1;return{_init:T,showInsertPopup:d,showLayer:O,refreshUploadButton:P,refreshByURLButton:Q,upload:C,insertByURL:u,align:_,refreshAlign:aa,refreshAlignOnShow:ba,display:ca,refreshDisplayOnShow:da,replace:ea,back:fa,get:ga,insert:v,showProgressBar:q,remove:S,hideProgressBar:r,applyStyle:ha,showAltPopup:H,showSizePopup:L,setAlt:J,setSize:N,exitEdit:Y}},a.FroalaEditor.DefineIcon("insertImage",{NAME:"image"}),a.FroalaEditor.RegisterShortcut(80,"insertImage"),a.FroalaEditor.RegisterCommand("insertImage",{title:"Insert Image",undo:!1,focus:!0,refershAfterCallback:!1,popup:!0,callback:function(){this.popups.isVisible("image.insert")?(this.$el.find(".fr-marker")&&(this.events.disableBlur(),this.selection.restore()),this.popups.hide("image.insert")):this.image.showInsertPopup()},plugin:"image"}),a.FroalaEditor.DefineIcon("imageUpload",{NAME:"upload"}),a.FroalaEditor.RegisterCommand("imageUpload",{title:"Upload Image",undo:!1,focus:!1,callback:function(){this.image.showLayer("image-upload")},refresh:function(a){this.image.refreshUploadButton(a)}}),a.FroalaEditor.DefineIcon("imageByURL",{NAME:"link"}),a.FroalaEditor.RegisterCommand("imageByURL",{title:"By URL",undo:!1,focus:!1,callback:function(){this.image.showLayer("image-by-url")},refresh:function(a){this.image.refreshByURLButton(a)}}),a.FroalaEditor.RegisterCommand("imageInsertByURL",{title:"Insert Image",undo:!0,refreshAfterCallback:!1,callback:function(){this.image.insertByURL()},refresh:function(a){var b=this.image.get();b?a.text("Replace"):a.text(this.language.translate("Insert"))}}),a.FroalaEditor.DefineIcon("imageDisplay",{NAME:"star"}),a.FroalaEditor.RegisterCommand("imageDisplay",{title:"Display",type:"dropdown",options:{inline:"Inline",block:"Break Text"},callback:function(a,b){this.image.display(b)},refresh:function(a){this.opts.imageTextNear||a.addClass("fr-hidden")},refreshOnShow:function(a,b){this.image.refreshDisplayOnShow(a,b)}}),a.FroalaEditor.DefineIcon("imageAlign",{NAME:"align-center"}),a.FroalaEditor.RegisterCommand("imageAlign",{type:"dropdown",title:"Align",options:{left:"Align Left",justify:"None",right:"Align Right"},html:function(){var b='<ul class="fr-dropdown-list">',c=a.FroalaEditor.COMMANDS.imageAlign.options;for(var d in c)b+='<li><a class="fr-command fr-title" data-cmd="imageAlign" data-param1="'+d+'" title="'+this.language.translate(c[d])+'"><i class="fa fa-align-'+d+'"></i></a></li>';return b+="</ul>"},callback:function(a,b){this.image.align(b)},refresh:function(a){this.image.refreshAlign(a)},refreshOnShow:function(a,b){this.image.refreshAlignOnShow(a,b)}}),a.FroalaEditor.DefineIcon("imageReplace",{NAME:"exchange"}),a.FroalaEditor.RegisterCommand("imageReplace",{title:"Replace",undo:!1,focus:!1,refreshAfterCallback:!1,callback:function(){this.image.replace()}}),a.FroalaEditor.DefineIcon("imageRemove",{NAME:"trash"}),a.FroalaEditor.RegisterCommand("imageRemove",{title:"Remove",callback:function(){this.image.remove()}}),a.FroalaEditor.DefineIcon("imageBack",{NAME:"arrow-left"}),a.FroalaEditor.RegisterCommand("imageBack",{title:"Back",undo:!1,focus:!1,back:!0,callback:function(){this.image.back()},refresh:function(a){var b=this.image.get();b||this.opts.toolbarInline?(a.removeClass("fr-hidden"),a.next(".fr-separator").removeClass("fr-hidden")):(a.addClass("fr-hidden"),a.next(".fr-separator").addClass("fr-hidden"))}}),a.FroalaEditor.RegisterCommand("imageDismissError",{title:"OK",undo:!1,callback:function(){this.image.hideProgressBar(!0)}}),a.FroalaEditor.DefineIcon("imageStyle",{NAME:"magic"}),a.FroalaEditor.RegisterCommand("imageStyle",{title:"Style",type:"dropdown",html:function(){var a='<ul class="fr-dropdown-list">',b=this.opts.imageStyles;for(var c in b)a+='<li><a class="fr-command" data-cmd="imageStyle" data-param1="'+c+'">'+this.language.translate(b[c])+"</a></li>";return a+="</ul>"},callback:function(a,b){this.image.applyStyle(b)},refreshOnShow:function(b,c){var d=this.image.get();d&&c.find(".fr-command").each(function(){var b=a(this).data("param1");a(this).toggleClass("fr-active",d.hasClass(b))})}}),a.FroalaEditor.DefineIcon("imageAlt",{NAME:"info"}),a.FroalaEditor.RegisterCommand("imageAlt",{undo:!1,focus:!1,title:"Alternate Text",callback:function(){this.image.showAltPopup()}}),a.FroalaEditor.RegisterCommand("imageSetAlt",{undo:!0,focus:!1,title:"Update",refreshAfterCallback:!1,callback:function(){this.image.setAlt()}}),a.FroalaEditor.DefineIcon("imageSize",{NAME:"arrows-alt"}),a.FroalaEditor.RegisterCommand("imageSize",{undo:!1,focus:!1,title:"Change Size",callback:function(){this.image.showSizePopup()}}),a.FroalaEditor.RegisterCommand("imageSetSize",{undo:!0,focus:!1,callback:function(){this.image.setSize()}})});
  return true;
}).then(function(data) {
  !function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){"use strict";if(a.extend(a.FroalaEditor.DEFAULTS,{imageManagerLoadURL:"http://i.froala.com/load-files",imageManagerLoadMethod:"get",imageManagerLoadParams:{},imageManagerPreloader:"",imageManagerDeleteURL:"",imageManagerDeleteMethod:"post",imageManagerDeleteParams:{},imageManagerPageSize:12,imageManagerScrollOffset:20,imageManagerToggleTags:!0}),a.FroalaEditor.PLUGINS.imageManager=function(b){function c(){z.show(),F.show(),U=b.image.get(),A||x(),i(),b.$document.find("body").addClass("prevent-scroll"),b.helpers.isMobile()&&b.$document.find("body").addClass("fr-mobile")}function d(){b.events.enableBlur(),z.hide(),F.hide(),b.$document.find("body").removeClass("prevent-scroll fr-mobile")}function e(){var b=a(window).outerWidth();return 768>b?2:1200>b?3:4}function f(){B.empty();for(var a=0;K>a;a++)B.append('<div class="fr-list-column"></div>')}function g(){var c="";b.opts.theme&&(c=" "+b.opts.theme+"-theme");var d='<div class="fr-modal'+c+'"><div class="fr-modal-wrapper">';return d+='<div class="fr-modal-title"><div class="fr-modal-title-line"><i class="fa fa-bars fr-modal-more fr-not-available" id="fr-modal-more-'+b.id+'" title="'+b.language.translate("Tags")+'"></i><h4 data-text="true">'+b.language.translate("Manage Images")+'</h4><i title="'+b.language.translate("Cancel")+'" class="fa fa-times fr-modal-close" id="fr-modal-close-'+b.id+'"></i></div>',d+='<div class="fr-modal-tags" id="fr-modal-tags-'+b.id+'"></div>',d+="</div>",d+='<img class="fr-preloader" id="fr-preloader-'+b.id+'" alt="'+b.language.translate("Loading")+'.." src="'+b.opts.imageManagerPreloader+'" style="display: none;">',d+='<div class="fr-scroller" id="fr-scroller-'+b.id+'"><div class="fr-image-list" id="fr-image-list-'+b.id+'"></div></div>',d+="</div></div>",a(d)}function h(){z=g(),b.helpers.isMobile()||z.addClass("fr-desktop"),z.appendTo("body"),F=a('<div class="fr-overlay">').appendTo("body"),b.opts.theme&&F.addClass(b.opts.theme+"-theme"),d(),b.events.on("destroy",function(){z.removeData().remove(),F.removeData().remove()},!0)}function i(){A.show(),B.find(".fr-list-column").empty(),b.opts.imageManagerLoadURL?a.ajax({url:b.opts.imageManagerLoadURL,method:b.opts.imageManagerLoadMethod,data:b.opts.imageManagerLoadParams,dataType:"json",crossDomain:b.opts.requestWithCORS,xhrFields:{withCredentials:b.opts.requestWithCORS},headers:b.opts.requestHeaders}).done(function(a,c,d){b.events.trigger("imageManager.imagesLoaded",[a]),j(a,d.response),A.hide()}).fail(function(){var a=this.xhr();s(M,a.response||a.responseText)}):s(N)}function j(a,b){try{B.find(".fr-list-column").empty(),H=0,I=0,J=0,G=a,k()}catch(c){s(O,b)}}function k(){if(I<G.length&&(B.outerHeight()<=C.outerHeight()+b.opts.imageManagerScrollOffset||C.scrollTop()+b.opts.imageManagerScrollOffset>B.outerHeight()-C.outerHeight())){H++;for(var a=b.opts.imageManagerPageSize*(H-1);a<Math.min(G.length,b.opts.imageManagerPageSize*H);a++)l(G[a])}}function l(c){var d=new Image,e=a('<div class="fr-image-container fr-empty fr-image-'+J++ +'" data-loading="'+b.language.translate("Loading")+'.." data-deleting="'+b.language.translate("Deleting")+'..">');p(!1),d.onload=function(){e.height(Math.floor(e.width()/d.width*d.height));var f=a("<img/>");if(c.thumb)f.attr("src",c.thumb);else{if(s(P,c),!c.url)return s(Q,c),!1;f.attr("src",c.url)}if(c.url&&f.attr("data-url",c.url),c.tag)if(E.find(".fr-modal-more.fr-not-available").removeClass("fr-not-available"),E.find(".fr-modal-tags").show(),c.tag.indexOf(",")>=0){for(var g=c.tag.split(","),h=0;h<g.length;h++)g[h]=g[h].trim(),0===D.find('a[title="'+g[h]+'"]').length&&D.append('<a role="button" title="'+g[h]+'">'+g[h]+"</a>");f.attr("data-tag",g.join())}else 0===D.find('a[title="'+c.tag.trim()+'"]').length&&D.append('<a role="button" title="'+c.tag.trim()+'">'+c.tag.trim()+"</a>"),f.attr("data-tag",c.tag.trim());for(var i in c)"thumb"!=i&&"url"!=i&&"tag"!=i&&f.attr("data-"+i,c[i]);e.append(f).append('<i class="fa fa-trash-o fr-delete-img" title="'+b.language.translate("Delete")+'"></i>').append('<i class="fa fa-plus fr-insert-img" title="'+b.language.translate("Insert")+'"></i>'),D.find(".fr-selected-tag").each(function(a,b){w(f,b.text)||e.hide()}),f.on("load",function(){e.removeClass("fr-empty"),e.height("auto"),I++;var a=n(parseInt(f.parent().attr("class").match(/fr-image-(\d+)/)[1],10)+1);o(a),p(!1),I%b.opts.imageManagerPageSize===0&&k()}),b.events.trigger("imageManager.imageLoaded",[f])},d.onerror=function(){I++,e.remove();var a=n(parseInt(e.attr("class").match(/fr-image-(\d+)/)[1],10)+1);o(a),s(L,c),I%b.opts.imageManagerPageSize===0&&k()},d.src=c.url,m().append(e)}function m(){var b,c;return B.find(".fr-list-column").each(function(d,e){var f=a(e);0===d?(c=f.outerHeight(),b=f):f.outerHeight()<c&&(c=f.outerHeight(),b=f)}),b}function n(b){void 0===b&&(b=0);for(var c=[],d=J-1;d>=b;d--){var e=B.find(".fr-image-"+d);e.length&&(c.push(e),a('<div id="fr-image-hidden-container">').append(e),B.find(".fr-image-"+d).remove())}return c}function o(a){for(var b=a.length-1;b>=0;b--)m().append(a[b])}function p(a){if(void 0===a&&(a=!0),!z.is(":visible"))return!0;var c=e();if(c!=K){K=c;var d=n();f(),o(d)}var g=b.$window.height(),h=z.find(".fr-modal-wrapper"),i=parseFloat(h.css("margin-top"))+parseFloat(h.css("margin-bottom")),j=parseFloat(h.css("padding-top"))+parseFloat(h.css("padding-bottom")),l=parseFloat(h.css("border-top-width")),m=h.find("h4").outerHeight();C.height(Math.min(B.outerHeight(),g-i-j-m-l)),a&&k()}function q(c){var e=a(c.currentTarget).siblings("img");if(d(),b.image.showProgressBar(),U)U.trigger("click");else{b.events.focus(!0),b.selection.restore();var f=b.position.getBoundingRect(),g=f.left+f.width/2,h=f.top+f.height;b.popups.setContainer("image.insert",b.$box||a("body")),b.popups.show("image.insert",g,h)}var i={},j=e.data();for(var k in j)"url"!=k&&"tag"!=k&&(i[k]=j[k]);b.undo.saveStep(),b.image.insert(e.data("url"),!1,i,U)}function r(c){var d=a(c.currentTarget).siblings("img"),e=b.language.translate("Are you sure? Image will be deleted.");confirm(e)&&(b.opts.imageManagerDeleteURL?b.events.trigger("imageManager.beforeDeleteImage",[d])!==!1&&(d.parent().addClass("fr-image-deleting"),a.ajax({method:b.opts.imageManagerDeleteMethod,url:b.opts.imageManagerDeleteURL,data:a.extend({src:d.attr("src")},b.opts.imageManagerDeleteParams),crossDomain:b.opts.requestWithCORS,xhrFields:{withCredentials:b.opts.requestWithCORS},headers:b.opts.requestHeaders}).done(function(a){b.events.trigger("imageManager.imageDeleted",[a]);var c=n(parseInt(d.parent().attr("class").match(/fr-image-(\d+)/)[1],10)+1);d.parent().remove(),o(c),p(!0)}).fail(function(){var a=this.xhr();s(R,a.response||a.responseText)})):s(S))}function s(c,d){c>=10&&20>c?A.hide():c>=20&&30>c&&a(".fr-image-deleting").removeClass("fr-image-deleting"),b.events.trigger("imageManager.error",[{code:c,message:T[c]},d])}function t(){var a=E.find(".fr-modal-title-line").outerHeight(),b=D.outerHeight();E.toggleClass(".fr-show-tags"),E.hasClass(".fr-show-tags")?(E.css("height",a+b),D.find("a").css("opacity",1)):(E.css("height",a),D.find("a").css("opacity",0))}function u(){var b=D.find(".fr-selected-tag");b.length>0?(B.find("img").parent().show(),b.each(function(b,c){B.find("img").each(function(b,d){var e=a(d);w(e,c.text)||e.parent().hide()})})):B.find("img").parent().show();var c=n();o(c),k()}function v(c){c.preventDefault();var d=a(c.currentTarget);d.toggleClass("fr-selected-tag"),b.opts.imageManagerToggleTags&&d.siblings("a").removeClass("fr-selected-tag"),u()}function w(a,b){for(var c=a.attr("data-tag").split(","),d=0;d<c.length;d++)if(c[d]==b)return!0;return!1}function x(){A=z.find("#fr-preloader-"+b.id),B=z.find("#fr-image-list-"+b.id),C=z.find("#fr-scroller-"+b.id),D=z.find("#fr-modal-tags-"+b.id),E=D.parent(),K=e(),f();var c=E.find(".fr-modal-title-line").outerHeight();E.css("height",c),C.css("margin-top",c),b.events.bindClick(z,"i#fr-modal-close-"+b.id,d),a(window).on("resize.imagemanager"+b.id,p),b.helpers.isMobile()&&(b.events.bindClick(B,"div.fr-image-container",function(b){z.find(".fr-mobile-selected").removeClass("fr-mobile-selected"),a(b.currentTarget).addClass("fr-mobile-selected")}),z.on(b._mousedown,function(){z.find(".fr-mobile-selected").removeClass("fr-mobile-selected")})),b.events.bindClick(B,".fr-insert-img",q),b.events.bindClick(B,".fr-delete-img",r),z.on(b._mousedown+" "+b._mouseup,function(a){a.stopPropagation()}),z.on(b._mousedown,"*",function(){b.events.disableBlur()}),C.on("scroll",k),b.events.bindClick(z,"i#fr-modal-more-"+b.id,t),b.events.bindClick(D,"a",v),b.events.on("destroy",function(){a(window).off("resize.imagemanager"+b.id)},!0)}function y(){return b.$wp||"IMG"==b.$el.get(0).tagName?void h():!1}var z,A,B,C,D,E,F,G,H,I,J,K,L=10,M=11,N=12,O=13,P=14,Q=15,R=21,S=22,T={};T[L]="Image cannot be loaded from the passed link.",T[M]="Error during load images request.",T[N]="Missing imageManagerLoadURL option.",T[O]="Parsing load response failed.",T[P]="Missing image thumb.",T[Q]="Missing image URL.",T[R]="Error during delete image request.",T[S]="Missing imageManagerDeleteURL option.";var U;return{require:["image"],_init:y,show:c,hide:d}},!a.FroalaEditor.PLUGINS.image)throw new Error("Image manager plugin requires image plugin.");a.FroalaEditor.DEFAULTS.imageInsertButtons.push("imageManager"),a.FroalaEditor.RegisterCommand("imageManager",{title:"Browse",undo:!1,focus:!1,callback:function(){this.imageManager.show()},plugin:"imageManager"}),a.FroalaEditor.DefineIcon("imageManager",{NAME:"folder"})});
  return true;
}).then(function(data) {
  !function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){"use strict";a.FroalaEditor.PLUGINS.align=function(b){function c(c){b.selection.save(),b.html.wrap(!0,!0,!0),b.selection.restore();for(var d=b.selection.blocks(),e=0;e<d.length;e++)a(d[e]).css("text-align",c).removeClass("fr-temp-div"),""===a(d[e]).attr("class")&&a(d[e]).removeAttr("class");b.selection.save(),b.html.unwrap(),b.selection.restore()}function d(c){var d=b.selection.blocks();if(d.length){var e=b.helpers.getAlignment(a(d[0]));c.find("> *:first").replaceWith(b.icon.create("align-"+e))}}function e(c,d){var e=b.selection.blocks();if(e.length){var f=b.helpers.getAlignment(a(e[0]));d.find('a.fr-command[data-param1="'+f+'"]').addClass("fr-active")}}return{apply:c,refresh:d,refreshOnShow:e}},a.FroalaEditor.DefineIcon("align",{NAME:"align-left"}),a.FroalaEditor.DefineIcon("align-left",{NAME:"align-left"}),a.FroalaEditor.DefineIcon("align-right",{NAME:"align-right"}),a.FroalaEditor.DefineIcon("align-center",{NAME:"align-center"}),a.FroalaEditor.DefineIcon("align-justify",{NAME:"align-justify"}),a.FroalaEditor.RegisterCommand("align",{type:"dropdown",title:"Align",options:{left:"Align Left",center:"Align Center",right:"Align Right",justify:"Align Justify"},html:function(){var b='<ul class="fr-dropdown-list">',c=a.FroalaEditor.COMMANDS.align.options;for(var d in c)b+='<li><a class="fr-command fr-title" data-cmd="align" data-param1="'+d+'" title="'+this.language.translate(c[d])+'">'+this.icon.create("align-"+d)+"</a></li>";return b+="</ul>"},callback:function(a,b){this.align.apply(b)},refresh:function(a){this.align.refresh(a)},refreshOnShow:function(a,b){this.align.refreshOnShow(a,b)},plugin:"align"})});
  return true;
}).then(function(data) {
  !function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){"use strict";a.extend(a.FroalaEditor.DEFAULTS,{lineBreakerTags:["table","hr","iframe","form","dl"],lineBreakerOffset:15}),a.FroalaEditor.PLUGINS.lineBreaker=function(b){function c(c,d){var e,f,g,h,i,j,k,l;if(null==c)h=d.parent(),i=h.offset().top,k=d.offset().top,e=k-Math.min((k-i)/2,b.opts.lineBreakerOffset),g=h.outerWidth(),f=h.offset().left;else if(null==d)h=c.parent(),j=h.offset().top+h.outerHeight(),l=c.offset().top+c.outerHeight(),e=l+Math.min((j-l)/2,b.opts.lineBreakerOffset),g=h.outerWidth(),f=h.offset().left;else{h=c.parent();var m=c.offset().top+c.height(),o=d.offset().top;if(m>o)return!1;e=(m+o)/2,g=h.outerWidth(),f=h.offset().left}b.opts.iframe&&(f+=b.$iframe.offset().left-a(b.original_window).scrollLeft(),e+=b.$iframe.offset().top-a(b.original_window).scrollTop()),n.css("top",e-b.window.pageYOffset),n.css("left",f-b.window.pageXOffset),n.css("width",g),n.data("tag1",c),n.data("tag2",d),n.show()}function d(a,d){var f,g,h=a.offset().top,i=a.offset().top+a.outerHeight();if(Math.abs(i-d)<=b.opts.lineBreakerOffset||Math.abs(d-h)<=b.opts.lineBreakerOffset)if(Math.abs(i-d)<Math.abs(d-h)){g=a.get(0);for(var j=g.nextSibling;j&&j.nodeType==Node.TEXT_NODE&&0===j.textContent.length;)j=j.nextSibling;j?(f=e(j),f&&c(a,f)):c(a,null)}else g=a.get(0),g.previousSibling?(f=e(g.previousSibling),f&&c(f,a)):c(null,a)}function e(c){if(c){var d=a(c);if(0===b.$el.find(d).length)return null;if(c.nodeType!=Node.TEXT_NODE&&b.opts.lineBreakerTags.indexOf(c.tagName.toLowerCase())>=0)return d;if(d.parents(b.opts.lineBreakerTags.join(",")).length>0)return c=d.parents(b.opts.lineBreakerTags.join(",")).get(0),a(c)}return null}function f(c){p=null,n.hide();var f,g,h,i=null,j=b.document.elementFromPoint(c.pageX-b.window.pageXOffset,c.pageY-b.window.pageYOffset);if(j&&("HTML"==j.tagName||"BODY"==j.tagName||b.node.isElement(j)))for(f=1;f<=b.opts.lineBreakerOffset;f++){if(g=b.document.elementFromPoint(c.pageX-b.window.pageXOffset,c.pageY-b.window.pageYOffset-f),g&&!b.node.isElement(g)&&g!=b.$wp.get(0)&&a(g).parents(b.$wp).length){i=e(g);break}if(h=b.document.elementFromPoint(c.pageX-b.window.pageXOffset,c.pageY-b.window.pageYOffset+f),h&&!b.node.isElement(h)&&h!=b.$wp.get(0)&&a(h).parents(b.$wp).length){i=e(h);break}}else i=e(j);i&&d(i,c.pageY)}function g(a){o===!1&&(p&&clearTimeout(p),p=setTimeout(f,30,a))}function h(){p&&clearTimeout(p),n.hide()}function i(){o=!0,h()}function j(){o=!1}function k(c){c.preventDefault(),n.hide();var d=n.data("tag1"),e=n.data("tag2"),f=b.html.defaultTag();null==d?f&&"TD"!=e.parent().get(0).tagName?e.before("<"+f+">"+a.FroalaEditor.MARKERS+"<br></"+f+">"):e.before(a.FroalaEditor.MARKERS+"<br>"):f&&"TD"!=d.parent().get(0).tagName?d.after("<"+f+">"+a.FroalaEditor.MARKERS+"<br></"+f+">"):d.after(a.FroalaEditor.MARKERS+"<br>"),b.selection.restore()}function l(){n=a('<div class="fr-line-breaker fr-visible"><a class="fr-floating-btn" role="button" tabindex="-1" title="'+b.language.translate("Break")+'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="21" y="11" width="2" height="8"/><rect x="14" y="17" width="7" height="2"/><path d="M14.000,14.000 L14.000,22.013 L9.000,18.031 L14.000,14.000 Z"/></svg></a></div>'),b.$box.append(n),b.events.on("destroy",function(){n.html("").removeData().remove()},!0),n.on("mouseleave.linebreaker"+b.id,h),n.on("mousemove",function(a){a.stopPropagation()}),n.on("mousedown","a",function(a){a.stopPropagation()}),n.on("click","a",k),b.events.on("destroy",function(){n.off("mouseleave.linebreaker"),n.off("mousedown"),n.off("mousedown","a"),n.off("click","a")},!0)}function m(){return b.$wp?(l(),o=!1,b.$window.on("mousemove.linebreaker"+b.id,g),a(b.window).on("scroll.linebreaker"+b.id,h),a(b.window).on("mousedown.linebreaker"+b.id,i),a(b.window).on("mouseup.linebreaker"+b.id,j),void b.events.on("destroy",function(){b.$window.off("mousemove.linebreaker"+b.id),a(b.window).off("scroll.linebreaker"+b.id),a(b.window).off("mousedown.linebreaker"+b.id),a(b.window).off("mouseup.linebreaker"+b.id)},!0)):!1}var n,o,p;return{_init:m}}});
  return true;
}).then(function(data) {

  /**
   * Russian
   */

$.FroalaEditor.LANGUAGE['ru'] = {
    translation: {
      // Place holder
      "Type something": "\u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u0447\u0442\u043e\u002d\u043d\u0438\u0431\u0443\u0434\u044c",

      // Basic formatting
      "Bold": "\u0416\u0438\u0440\u043d\u044b\u0439",
      "Italic": "\u041a\u0443\u0440\u0441\u0438\u0432",
      "Underline": "\u041f\u043e\u0434\u0447\u0435\u0440\u043a\u043d\u0443\u0442\u044b\u0439",
      "Strikethrough": "\u0417\u0430\u0447\u0435\u0440\u043a\u043d\u0443\u0442\u044b\u0439",

      // Main buttons
      "Insert": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c",
      "Delete": "\u0423\u0434\u0430\u043b\u0438\u0442\u044c",
      "Cancel": "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
      "OK": "OK",
      "Back": "\u043d\u0430\u0437\u0430\u0434",
      "Remove": "\u0423\u0434\u0430\u043b\u0438\u0442\u044c",
      "More": "\u0411\u043e\u043b\u044c\u0448\u0435",
      "Update": "\u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435",
      "Style": "\u0421\u0442\u0438\u043b\u044c",

      // Font
      "Font Family": "\u0428\u0440\u0438\u0444\u0442",
      "Font Size": "\u0420\u0430\u0437\u043c\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430",

      // Colors
      "Colors": "\u0446\u0432\u0435\u0442\u0430",
      "Background": "\u0424\u043e\u043d",
      "Text": "\u0442\u0435\u043a\u0441\u0442",

      // Paragraphs
      "Paragraph Format": "\u0424\u043e\u0440\u043c\u0430\u0442",
      "Normal": "\u041d\u043e\u0440\u043c\u0430\u043b\u044c\u043d\u044b\u0439",
      "Code": "\u041a\u043e\u0434",
      "Heading 1": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 1",
      "Heading 2": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 2",
      "Heading 3": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 3",
      "Heading 4": "\u0417\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a 4",

      // Style
      "Paragraph Style": "\u041f\u0443\u043d\u043a\u0442 \u0441\u0442\u0438\u043b\u044c",
      "Inline Style": "\u0412\u0441\u0442\u0440\u043e\u0435\u043d\u043d\u044b\u0439 \u0441\u0442\u0438\u043b\u044c",

      // Alignment
      "Align": "Выравнивание",
      "Align Left": "\u041f\u043e \u043b\u0435\u0432\u043e\u043c\u0443 \u043a\u0440\u0430\u044e",
      "Align Center": "По центру ",
      "Align Right": "\u041f\u043e \u043f\u0440\u0430\u0432\u043e\u043c\u0443 \u043a\u0440\u0430\u044e",
      "Align Justify": "\u041f\u043e \u0448\u0438\u0440\u0438\u043d\u0435",
      "None": "Без выравнивания",

      // Lists
      "Ordered List": "\u041d\u0443\u043c\u0435\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u0441\u043f\u0438\u0441\u043e\u043a",
      "Unordered List": "\u041c\u0430\u0440\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u0441\u043f\u0438\u0441\u043e\u043a",

      // Indent
      "Decrease Indent": "\u0423\u043c\u0435\u043d\u044c\u0448\u0438\u0442\u044c \u043e\u0442\u0441\u0442\u0443\u043f",
      "Increase Indent": "\u0423\u0432\u0435\u043b\u0438\u0447\u0438\u0442\u044c \u043e\u0442\u0441\u0442\u0443\u043f",

      // Links
      "Insert Link": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443",
      "Open in new tab": "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0432 \u043d\u043e\u0432\u043e\u0439 \u0432\u043a\u043b\u0430\u0434\u043a\u0435",
      "Open Link": "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443",
      "Edit Link": "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443",
      "Unlink": "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443",
      "Choose Link": "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0441\u044b\u043b\u043a\u0443",

      // Images
      "Insert Image": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435",
      "Upload Image": "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435",
      "By URL": "По ссылке",
      "Browse": "С диска",
      "Drop image": "\u041f\u0435\u0440\u0435\u043c\u0435\u0441\u0442\u0438\u0442\u0435 \u0441\u044e\u0434\u0430 \u0444\u0430\u0439\u043b",
      "or click": "\u0438\u043b\u0438 \u043d\u0430\u0436\u043c\u0438\u0442\u0435",
      "Manage Images": "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f\u043c\u0438",
      "Loading": "\u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430",
      "Deleting": "\u0423\u0434\u0430\u043b\u0435\u043d\u0438\u0435",
      "Tags": "\u041a\u043b\u044e\u0447\u0435\u0432\u044b\u0435 \u0441\u043b\u043e\u0432\u0430",
      "Are you sure? Image will be deleted.": "\u0412\u044b \u0443\u0432\u0435\u0440\u0435\u043d\u044b? \u0418\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u0431\u0443\u0434\u0435\u0442 \u0443\u0434\u0430\u043b\u0435\u043d\u043e.",
      "Replace": "Заменить",
      "Uploading": "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430",
      "Loading image": "\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0439",
      "Display": "Отображение",
      "Inline": "С обтекание текста",
      "Break Text": "Без обтекания текста",
      "Alternate Text": "\u0410\u043b\u044c\u0442\u0435\u0440\u043d\u0430\u0442\u0438\u0432\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442",
      "Change Size": "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0440\u0430\u0437\u043c\u0435\u0440",
      "Width": "\u0448\u0438\u0440\u0438\u043d\u0430",
      "Height": "\u0432\u044b\u0441\u043e\u0442\u0430",
      "Something went wrong. Please try again.": "\u0427\u0442\u043e\u002d\u0442\u043e \u043f\u043e\u0448\u043b\u043e \u043d\u0435 \u0442\u0430\u043a\u002e \u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430\u002c \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437\u002e",

      // Video
      "Insert Video": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0432\u0438\u0434\u0435\u043e",
      "Embedded Code": "\u0412\u0441\u0442\u0440\u043e\u0435\u043d\u043d\u044b\u0439 \u043a\u043e\u0434",

      // Tables
      "Insert Table": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0442\u0430\u0431\u043b\u0438\u0446\u0443",
      "Header": "\u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a",
      "Row": "\u0421\u0442\u0440\u043e\u043a\u0430",
      "Insert row above": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043f\u0443\u0441\u0442\u0443\u044e \u0441\u0442\u0440\u043e\u043a\u0443 \u0441\u0432\u0435\u0440\u0445\u0443",
      "Insert row below": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043f\u0443\u0441\u0442\u0443\u044e \u0441\u0442\u0440\u043e\u043a\u0443 \u0441\u043d\u0438\u0437\u0443",
      "Delete row": "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0442\u0440\u043e\u043a\u0443",
      "Column": "\u0421\u0442\u043e\u043b\u0431\u0435\u0446",
      "Insert column before": "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0441\u0442\u043e\u043b\u0431\u0435\u0446 \u0441\u043b\u0435\u0432\u0430",
      "Insert column after": "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0441\u0442\u043e\u043b\u0431\u0435\u0446 \u0441\u043f\u0440\u0430\u0432\u0430",
      "Delete column": "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0442\u043e\u043b\u0431\u0435\u0446",
      "Cell": "\u042f\u0447\u0435\u0439\u043a\u0430",
      "Merge cells": "\u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0438\u0442\u044c \u044f\u0447\u0435\u0439\u043a\u0438",
      "Horizontal split": "\u0420\u0430\u0437\u0434\u0435\u043b\u0438\u0442\u044c \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u043e",
      "Vertical split": "\u0420\u0430\u0437\u0434\u0435\u043b\u0438\u0442\u044c \u0432\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u043e",
      "Cell Background": "\u0441\u043e\u0442\u043e\u0432\u044b\u0439 \u0444\u043e\u043d",
      "Vertical Align": "\u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u0430\u044f \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435",
      "Top": "Сверху",
      "Middle": "По центру",
      "Bottom": "Снизу",
      "Align Top": "\u0421\u043e\u0432\u043c\u0435\u0441\u0442\u0438\u0442\u0435 \u0432\u0435\u0440\u0445\u043d\u044e\u044e",
      "Align Middle": "\u0412\u044b\u0440\u043e\u0432\u043d\u044f\u0442\u044c \u043f\u043e \u0441\u0435\u0440\u0435\u0434\u0438\u043d\u0435",
      "Align Bottom": "\u0421\u043e\u0432\u043c\u0435\u0441\u0442\u0438\u0442\u0435 \u043d\u0438\u0436\u043d\u044e\u044e",
      "Cell Style": "\u0441\u0442\u0438\u043b\u044c \u044f\u0447\u0435\u0439\u043a\u0438",

      // Files
      "Upload File": "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0444\u0430\u0439\u043b",
      "Drop file": "\u043f\u0430\u0434\u0435\u043d\u0438\u0435 \u0444\u0430\u0439\u043b\u0430",

      // Emoticons
      "Emoticons": "\u0421\u043c\u0430\u0439\u043b\u0438\u043a\u0438",
  "Grinning face": "",
      "Grinning face with smiling eyes": "\u0423\u0441\u043c\u0435\u0445\u043d\u0443\u0432\u0448\u0438\u0441\u044c \u043b\u0438\u0446\u043e \u0441 \u0443\u043b\u044b\u0431\u0430\u044e\u0449\u0438\u043c\u0438\u0441\u044f \u0433\u043b\u0430\u0437\u0430\u043c\u0438",
      "Face with tears of joy": "\u041b\u0438\u0446\u043e \u0441\u043e \u0441\u043b\u0435\u0437\u0430\u043c\u0438 \u0440\u0430\u0434\u043e\u0441\u0442\u0438",
      "Smiling face with open mouth": "\u0423\u043b\u044b\u0431\u0430\u044e\u0449\u0435\u0435\u0441\u044f \u043b\u0438\u0446\u043e \u0441 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u043c \u0440\u0442\u043e\u043c",
      "Smiling face with open mouth and smiling eyes": "\u0423\u043b\u044b\u0431\u0430\u044f\u0441\u044c \u043b\u0438\u0446\u043e \u0441 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u043c \u0440\u0442\u043e\u043c \u0438 \u0443\u043b\u044b\u0431\u0430\u044e\u0449\u0438\u0435\u0441\u044f \u0433\u043b\u0430\u0437\u0430",
      "Smiling face with open mouth and cold sweat": "\u0423\u043b\u044b\u0431\u0430\u044f\u0441\u044c \u043b\u0438\u0446\u043e \u0441 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u043c \u0440\u0442\u043e\u043c \u0438 \u0445\u043e\u043b\u043e\u0434\u043d\u044b\u0439 \u043f\u043e\u0442",
      "Smiling face with open mouth and tightly-closed eyes": "\u0423\u043b\u044b\u0431\u0430\u044f\u0441\u044c \u043b\u0438\u0446\u043e \u0441 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u043c \u0440\u0442\u043e\u043c \u0438 \u043f\u043b\u043e\u0442\u043d\u043e \u0437\u0430\u043a\u0440\u044b\u0442\u044b\u043c\u0438 \u0433\u043b\u0430\u0437\u0430\u043c\u0438",
      "Smiling face with halo": "\u0423\u043b\u044b\u0431\u0430\u044f\u0441\u044c \u043b\u0438\u0446\u043e \u0433\u0430\u043b\u043e",
      "Smiling face with horns": "\u0423\u043b\u044b\u0431\u0430\u044f\u0441\u044c \u043b\u0438\u0446\u043e \u0441 \u0440\u043e\u0433\u0430\u043c\u0438",
      "Winking face": "\u043f\u043e\u0434\u043c\u0438\u0433\u0438\u0432\u0430\u044f \u043b\u0438\u0446\u043e",
      "Smiling face with smiling eyes": "\u0423\u043b\u044b\u0431\u0430\u044f\u0441\u044c \u043b\u0438\u0446\u043e \u0441 \u0443\u043b\u044b\u0431\u0430\u044e\u0449\u0438\u043c\u0438\u0441\u044f \u0433\u043b\u0430\u0437\u0430\u043c\u0438",
      "Face savoring delicious food": "\u041b\u0438\u0446\u043e \u0441\u043c\u0430\u043a\u0443\u044f \u0432\u043a\u0443\u0441\u043d\u0443\u044e \u0435\u0434\u0443",
      "Relieved face": "\u041e\u0441\u0432\u043e\u0431\u043e\u0436\u0434\u0435\u043d\u044b \u043b\u0438\u0446\u043e",
      "Smiling face with heart-shaped eyes": "\u0423\u043b\u044b\u0431\u0430\u044f\u0441\u044c \u043b\u0438\u0446\u043e \u0432 \u0444\u043e\u0440\u043c\u0435 \u0441\u0435\u0440\u0434\u0446\u0430 \u0433\u043b\u0430\u0437\u0430\u043c\u0438",
      "Smiling face with sunglasses": "\u0423\u043b\u044b\u0431\u0430\u044f\u0441\u044c \u043b\u0438\u0446\u043e \u0441 \u043e\u0447\u043a\u0430\u043c\u0438",
      "Smirking face": "\u0423\u0441\u043c\u0435\u0445\u043d\u0443\u0432\u0448\u0438\u0441\u044c \u043b\u0438\u0446\u043e",
      "Neutral face": "\u041e\u0431\u044b\u0447\u043d\u044b\u0439 \u043b\u0438\u0446\u043e",
      "Expressionless face": "\u043d\u0435\u0432\u044b\u0440\u0430\u0437\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u043b\u0438\u0446\u0430",
      "Unamused face": "\u041d\u0435 \u0441\u043c\u0435\u0448\u043d\u043e \u043b\u0438\u0446\u043e",
      "Face with cold sweat": "\u041b\u0438\u0446\u043e \u0441 \u0445\u043e\u043b\u043e\u0434\u043d\u043e\u0433\u043e \u043f\u043e\u0442\u0430",
      "Pensive face": "\u0417\u0430\u0434\u0443\u043c\u0447\u0438\u0432\u044b\u0439 \u043b\u0438\u0446\u043e",
      "Confused face": "\u041f\u0443\u0442\u0430\u0442\u044c \u043b\u0438\u0446\u043e",
      "Confounded face": "\u0414\u0430 \u043f\u043e\u0441\u0442\u044b\u0434\u044f\u0442\u0441\u044f \u043b\u0438\u0446\u043e",
      "Kissing face": "\u041f\u043e\u0446\u0435\u043b\u0443\u0438 \u043b\u0438\u0446\u043e",
      "Face throwing a kiss": "\u041b\u0438\u0446\u043e \u0431\u0440\u043e\u0441\u0430\u043b\u0438 \u043f\u043e\u0446\u0435\u043b\u0443\u0439",
      "Kissing face with smiling eyes": "\u041f\u043e\u0446\u0435\u043b\u0443\u0438 \u043b\u0438\u0446\u043e \u0441 \u0443\u043b\u044b\u0431\u0430\u044e\u0449\u0438\u043c\u0438\u0441\u044f \u0433\u043b\u0430\u0437\u0430\u043c\u0438",
      "Kissing face with closed eyes": "\u041f\u043e\u0446\u0435\u043b\u0443\u0438 \u043b\u0438\u0446\u043e \u0441 \u0437\u0430\u043a\u0440\u044b\u0442\u044b\u043c\u0438 \u0433\u043b\u0430\u0437\u0430\u043c\u0438",
      "Face with stuck out tongue": "\u041b\u0438\u0446\u043e \u0441 \u0442\u043e\u0440\u0447\u0430\u043b\u0438 \u044f\u0437\u044b\u043a\u0430",
      "Face with stuck out tongue and winking eye": "\u041b\u0438\u0446\u043e \u0441 \u0442\u043e\u0440\u0447\u0430\u043b\u0438 \u044f\u0437\u044b\u043a \u0438 \u043f\u043e\u0434\u043c\u0438\u0433\u0438\u0432\u0430\u044f \u0433\u043b\u0430\u0437\u043e\u043c",
      "Face with stuck out tongue and tightly-closed eyes": "\u041b\u0438\u0446\u043e \u0441 \u0442\u043e\u0440\u0447\u0430\u043b\u0438 \u044f\u0437\u044b\u043a \u0438 \u043f\u043b\u043e\u0442\u043d\u043e \u0437\u0430\u043a\u0440\u044b\u0442\u044b\u043c\u0438 \u0433\u043b\u0430\u0437\u0430\u043c\u0438",
      "Disappointed face": "\u0420\u0430\u0437\u043e\u0447\u0430\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439 \u043b\u0438\u0446\u043e",
      "Worried face": "\u041e\u0431\u0435\u0441\u043f\u043e\u043a\u043e\u0435\u043d\u043d\u044b\u0439 \u043b\u0438\u0446\u043e",
      "Angry face": "\u0417\u043b\u043e\u0439 \u043b\u0438\u0446\u043e",
      "Pouting face": "\u041f\u0443\u0445\u043b\u044b\u0435 \u043b\u0438\u0446\u043e",
      "Crying face": "\u041f\u043b\u0430\u0447 \u043b\u0438\u0446\u043e",
      "Persevering face": "\u041d\u0430\u0441\u0442\u043e\u0439\u0447\u0438\u0432\u0430\u044f \u043b\u0438\u0446\u043e",
      "Face with look of triumph": "\u041b\u0438\u0446\u043e \u0441 \u0432\u0438\u0434\u043e\u043c \u0442\u0440\u0438\u0443\u043c\u0444\u0430",
      "Disappointed but relieved face": "\u0420\u0430\u0437\u043e\u0447\u0430\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0439\u002c \u043d\u043e \u043e\u0441\u0432\u043e\u0431\u043e\u0436\u0434\u0435\u043d \u043b\u0438\u0446\u043e",
      "Frowning face with open mouth": "\u041d\u0430\u0445\u043c\u0443\u0440\u0438\u0432\u0448\u0438\u0441\u044c \u043b\u0438\u0446\u043e \u0441 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u043c \u0440\u0442\u043e\u043c",
      "Anguished face": "\u043c\u0443\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0439 \u043b\u0438\u0446\u043e",
      "Fearful face": "\u041e\u043f\u0430\u0441\u0430\u044f\u0441\u044c \u043b\u0438\u0446\u043e",
      "Weary face": "\u0423\u0441\u0442\u0430\u043b\u044b\u0439 \u043b\u0438\u0446\u043e",
      "Sleepy face": "\u0441\u043e\u043d\u043d\u043e\u0435 \u043b\u0438\u0446\u043e",
      "Tired face": "\u0423\u0441\u0442\u0430\u043b\u0438 \u043b\u0438\u0446\u043e",
      "Grimacing face": "\u0413\u0440\u0438\u043c\u0430\u0441\u043d\u0438\u0447\u0430\u044f \u043b\u0438\u0446\u043e",
      "Loudly crying face": "\u0413\u0440\u043e\u043c\u043a\u043e \u043f\u043b\u0430\u0447\u0430 \u043b\u0438\u0446\u043e",
      "Face with open mouth": "\u041b\u0438\u0446\u043e \u0441 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u043c \u0440\u0442\u043e\u043c",
      "Hushed face": "\u0417\u0430\u0442\u0438\u0445\u0448\u0438\u0439 \u043b\u0438\u0446\u043e",
      "Face with open mouth and cold sweat": "\u041b\u0438\u0446\u043e \u0441 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u043c \u0440\u0442\u043e\u043c \u0438 \u0445\u043e\u043b\u043e\u0434\u043d\u044b\u0439 \u043f\u043e\u0442",
      "Face screaming in fear": "\u041b\u0438\u0446\u043e \u043a\u0440\u0438\u0447\u0430\u0442\u044c \u0432 \u0441\u0442\u0440\u0430\u0445\u0435",
      "Astonished face": "\u0423\u0434\u0438\u0432\u043b\u0435\u043d\u043d\u044b\u0439 \u043b\u0438\u0446\u043e",
      "Flushed face": "\u041f\u0440\u0438\u043b\u0438\u0432 \u043a\u0440\u043e\u0432\u0438 \u043a \u043b\u0438\u0446\u0443",
      "Sleeping face": "\u0421\u043f\u044f\u0449\u0430\u044f \u043b\u0438\u0446\u043e",
      "Dizzy face": "\u0414\u0438\u0437\u0437\u0438 \u043b\u0438\u0446\u043e",
      "Face without mouth": "\u041b\u0438\u0446\u043e \u0431\u0435\u0437 \u0440\u0442\u0430",
      "Face with medical mask": "\u041b\u0438\u0446\u043e \u0441 \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u043e\u0439 \u043c\u0430\u0441\u043a\u043e\u0439",

      // Line breaker
      "Break": "Новая строка",

      // Math
      "Subscript": "\u0418\u043d\u0434\u0435\u043a\u0441",
      "Superscript": "\u0412\u0435\u0440\u0445\u043d\u0438\u0439 \u0438\u043d\u0434\u0435\u043a\u0441",

      // Full screen
      "Fullscreen": "\u043f\u043e\u043b\u043d\u044b\u0439 \u044d\u043a\u0440\u0430\u043d",

      // Horizontal line
      "Insert Horizontal Line": "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u0443\u044e \u043b\u0438\u043d\u0438\u044e",

      // Clear formatting
      "Clear Formatting": "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0444\u043e\u0440\u043c\u0430\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435",

      // Undo, redo
      "Undo": "\u0412\u0435\u0440\u043d\u0443\u0442\u044c",
      "Redo": "\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c",

      // Select all
      "Select All": "\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0432\u0441\u0435",

      // Code view
      "Code View": "\u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043a\u043e\u0434\u0430",

      // Quote
      "Quote": "\u0446\u0438\u0442\u0430\u0442\u0430",
      "Increase": "\u0423\u0432\u0435\u043b\u0438\u0447\u0435\u043d\u0438\u0435",
      "Decrease": "\u0421\u043d\u0438\u0436\u0435\u043d\u0438\u0435"
    },
    direction: "ltr"
  };

  /* - --------------------------------- - */
  $.FroalaEditor.DefineIcon('alignLeft', {
    NAME: 'align-left'
  });
  $.FroalaEditor.RegisterCommand('alignLeft', {
    title: 'left align'
    , focus: false
    , undo: false
    , refreshAfterCallback: false
    , callback: function () {
      console.log(this.align.apply('left'));
    }
  });

  $.FroalaEditor.DefineIcon('alignRight', {
    NAME: 'align-right'
  });
  $.FroalaEditor.RegisterCommand('alignRight', {
    title: 'right align'
    , focus: false
    , undo: false
    , refreshAfterCallback: false
    , callback: function () {
      console.log(this.align.apply('right'));
    }
  });

  $.FroalaEditor.DefineIcon('alignCenter', {
    NAME: 'align-center'
  });
  $.FroalaEditor.RegisterCommand('alignCenter', {
    title: 'center align'
    , focus: false
    , undo: false
    , refreshAfterCallback: false
    , callback: function () {
      console.log(this.align.apply('center'));
    }
  });

  $.FroalaEditor.DefineIcon('cog', {
    NAME: 'cog'
  });
  $.FroalaEditor.RegisterCommand('cog', {
    title: 'cog'
    , focus: false
    , undo: false
    , refreshAfterCallback: false
    , callback: function () {
      $('#cellSettings')
        .toggleClass('active');
    }
  });

  $.FroalaEditor.DefineIcon('floppy-o', {
    NAME: 'floppy-o'
  });
  $.FroalaEditor.RegisterCommand('floppy-o', {
    title: 'Сохранение'
    , focus: false
    , undo: false
    , refreshAfterCallback: false
    , callback: function () {
      nCore.document.root.publish('saveDocument');
    }
  });

  $.FroalaEditor.DefineIcon('calculator', {
    NAME: 'calculator'
  });
  $.FroalaEditor.RegisterCommand('calculator', {
    title: 'Расчёт'
    , focus: false
    , undo: false
    , refreshAfterCallback: false
    , callback: function () {
      if ( nCore.document.getTemplate() ) {
        console.log('try to edit template: ', nCore.document.getTemplate );
        nCore.document.root.publish('tryToEditTemplate');
      } else {
        nCore.modules.table.event.publish('generateQuery');
      }
    }
  });

  $.FroalaEditor.DefineIcon('phone', {
    NAME: 'wrench'
  });
  $.FroalaEditor.RegisterCommand('phone', {
    title: 'Свойства документа'
    , focus: false
    , undo: false
    , refreshAfterCallback: false
    , callback: function () {
      nCore.document.root.publish('showDocumentSettings')
    }
  });

  $.FroalaEditor.DefineIcon('adjust', {
    NAME: 'reorder'
  });
  $.FroalaEditor.RegisterCommand('adjust', {
    title: 'Тиражирование'
    , focus: false
    , undo: false
    , refreshAfterCallback: false
    , callback: function () {
      nCore.document.root.publish('showGroupModal')
    }
  });

  $.FroalaEditor.DefineIcon('textRotate', {
    NAME: 'level-up'
  });
  $.FroalaEditor.RegisterCommand('textRotate', {
    title: 'Повернуть на 90'
    , focus: false
    , undo: false
    , refreshAfterCallback: false
    , callback: function () {

      var el = this.selection.element();
      console.log('90 -> ', this, '++', this.selection.element(), this.el, el.style);

      // if (this.selection.element().nodeName == 'TD') {
        var head_cell = this.selection.element(),
            height = head_cell.offsetWidth + head_cell.offsetWidth * 0.1,
            width  = head_cell.offsetHeight;

        if (head_cell.classList.contains('cellRotate')) {
          head_cell.classList.remove('cellRotate');
          head_cell.innerHTML = head_cell.querySelector('._rotated').innerHTML;
          head_cell.style.height = '20px';
        }
        else {
          head_cell.classList.add('cellRotate');

          head_cell.style.whiteSpace = 'normal';
          // head_cell.style.height = height + 'px';
          // head_cell.style.width = '0px';
          // head_cell.style.width = width+'px';

          head_cell.innerHTML = "<div class='_rotated' style='transform: translate("+height/2+"px,0) rotate(270deg)'>" + head_cell.innerHTML + "</div>"
        }
      // };
    }
  });

  $.FroalaEditor.RegisterCommand('copyDataCell', {
    title: 'copyDataCell',
    focus: false,
    undo:  false,
    refreshAfterCallback: false,
    callback: function () {
      console.log('froala_cell_dataset copy');
    }
  });
  $.FroalaEditor.RegisterCommand('pasteDataCell', {
    title: 'pasteDataCell',
    focus: false,
    undo:  false,
    refreshAfterCallback: false,
    callback: function () {
      console.log('froala_cell_dataset paste');
    }
  });

  $.FroalaEditor.RegisterShortcut( 67, 'copyDataCell',  null, true ); // SHIFT + C
  $.FroalaEditor.RegisterShortcut( 86, 'pasteDataCell', null, true ); // SHIFT + V
  // для быстрого переворота документа в тестовом режиме
  $.FroalaEditor.DefineIcon('rotateDocument', {
    NAME: 'flash'
  });
  $.FroalaEditor.RegisterCommand('rotateDocument', {
    title: 'Изменение формата'
    , focus: false
    , undo: false
    , refreshAfterCallback: false
    , callback: function () {
      console.log('90* -> ', this);
      this.$box.toggleClass('book')
      this.$tb.toggleClass( 'book');
    }
  });

  $.FroalaEditor.DefineIcon('customCalculationCell', {
    NAME: 'asterisk'
  });
  $.FroalaEditor.RegisterCommand('customCalculationCell', {
    title: 'Вставить ячейку',
    focus: false,
    undo: false,
    refreshAfterCallback: false,
    callback: function () {
      var format = this.selection.get();

      function findUp(el, selector) {
        while (el.parentNode) {
          el = el.parentNode;
          if ( el.id == selector ){
            return el;
          }
        }
        return null;
      }
      // проверяем что есть выделение текста || мы поставили курсор внутри редактора

      var calculationCell = document.createElement('div');
      calculationCell.classList.add('calculationCell');
      calculationCell.textContent = '......';
      calculationCell.style.display = 'inline';
      calculationCell.style.marginLeft = '10px';
      calculationCell.id = nCore.modules.table.generateId();
      
      var infoCell = document.createElement('div');
      infoCell.style.display = 'block';
      
      if ( format.type == "Range" ) {
        console.log('format +', format)
        infoCell.textContent = format.focusNode.data;
        infoCell.appendChild(calculationCell)

        format.baseNode.parentNode.insertBefore( infoCell, format.baseNode.nextSibling );
        format.baseNode.parentNode.textContent += '+++';
      }
      else {
        console.log('format -', format)
        var text = document.createElement('div');
        text.style.display = 'inline';
        text.textContent = 'Значение';
        infoCell.appendChild(text)
        infoCell.appendChild(calculationCell);

        var exist = findUp(format.baseNode.parentNode, 'paper');
        if ( exist ) {
          format.baseNode.parentNode.insertBefore( infoCell, format.baseNode.nextSibling );
        } else {
          return false
        }
      }
    }
  });
});
