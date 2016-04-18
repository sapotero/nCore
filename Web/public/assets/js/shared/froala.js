/*!
 * froala_editor v2.2.3 (https://www.froala.com/wysiwyg-editor)
 * License https://froala.com/wysiwyg-editor/terms/
 * Copyright 2014-2016 Froala Labs
 */

var globalEditor = {};

! function (a) {
  "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof module && module.exports ? module.exports = function (b, c) {
    return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), a(c), c
  } : a(jQuery)
}(function (jQuery) {
  "use strict";
  
  var b = function (c, d) {
    this.id = ++jQuery.FE.ID,
    this.opts = jQuery.extend( !0, {}, jQuery.extend({}, b.DEFAULTS, "object" == typeof d && d));

    var e = JSON.stringify(this.opts);
    jQuery.FE.OPTS_MAPPING[e] = jQuery.FE.OPTS_MAPPING[e] || this.id;
    this.sid = jQuery.FE.OPTS_MAPPING[e];
    jQuery.FE.SHARED[this.sid] = jQuery.FE.SHARED[this.sid] || {};
    this.shared = jQuery.FE.SHARED[this.sid];
    this.shared.count = (this.shared.count || 0) + 1;
    this.$oel = jQuery(c);
    this.$oel.data("froala.editor", this);
    this.o_doc = c.ownerDocument;
    this.o_win = "defaultView" in this.o_doc ? this.o_doc.defaultView : this.o_doc.parentWindow;
    
    var f = jQuery(this.o_win).scrollTop();

    this.$oel.on("froala.doInit", jQuery.proxy(
      function () {
        this.$oel.off("froala.doInit")
        this.doc = this.$el.get(0).ownerDocument;
        this.win = "defaultView" in this.doc ? this.doc.defaultView : this.doc.parentWindow;
        this.$doc = jQuery(this.doc);
        this.$win = jQuery(this.win);
        this.opts.pluginsEnabled || (this.opts.pluginsEnabled = Object.keys(jQuery.FE.PLUGINS));
        
        if ( this.opts.initOnClick ) {
          this.load(jQuery.FE.MODULES), 
          this.$el.on("mousedown.init touchstart.init dragenter.init focus.init", jQuery.proxy(function (b) {
            if (1 === b.which || 0 === b.which) {
              this.$el.off("mousedown.init dragenter.init focus.init touchstart.init");
              this.load(jQuery.FE.MODULES);
              this.load(jQuery.FE.PLUGINS);
              var c = b.originalEvent && b.originalEvent.originalTarget;
              c && "IMG" == c.tagName && jQuery(c).trigger("mousedown"), "undefined" == typeof this.ul && this.destroy();
              this.events.trigger("initialized")
            }
          }, this));
        } else {
          this.load(jQuery.FE.MODULES)
          this.load(jQuery.FE.PLUGINS)
          jQuery(this.o_win).scrollTop(f)
          "undefined" == typeof this.ul && this.destroy();
          this.events.trigger("initialized")
        }
      
      }, this));

    this._init();
  };

  b.DEFAULTS = {
    initOnClick: !1,
    pluginsEnabled: null
  },
  b.MODULES = {};
  b.PLUGINS = {};
  b.VERSION = "2.2.3";
  b.INSTANCES = [];
  b.OPTS_MAPPING = {};
  b.SHARED = {};
  b.ID = 0;
  
  b.prototype._init = function () {
    var b = this.$oel.prop("tagName");

     var c = jQuery.proxy(function () {
        this._original_html = this._original_html || this.$oel.html();
        this.$box = this.$box || this.$oel;
        this.opts.fullPage && (this.opts.iframe = !0);
        if ( this.opts.iframe ) {
          this.$iframe = jQuery('<iframe src="about:blank" frameBorder="0">');
          this.$wp = jQuery("<div></div>");
          this.$box.html(this.$wp);
          this.$wp.append(this.$iframe);
          this.$iframe.get(0).contentWindow.document.open();
          this.$iframe.get(0).contentWindow.document.write("<!DOCTYPE html>");
          this.$iframe.get(0).contentWindow.document.write("<html><head></head><body></body></html>");
          this.$iframe.get(0).contentWindow.document.close();
          this.$el = this.$iframe.contents().find("body");
          this.$head = this.$iframe.contents().find("head");
          this.$html = this.$iframe.contents().find("html");
          this.iframe_document = this.$iframe.get(0).contentWindow.document;
          this.$oel.trigger("froala.doInit");
        } else {
          this.$el = jQuery("<div></div>");
          this.$wp = jQuery("<div></div>").append(this.$el);
          this.$box.html(this.$wp);
          this.$oel.trigger("froala.doInit");
        }
      }, this);

      var d = jQuery.proxy(function () {
        this.$box = jQuery("<div>");
        this.$oel.before(this.$box).hide();
        this._original_html = this.$oel.val();
        this.$oel.parents("form").on("submit." + this.id);

        jQuery.proxy(function () {
          this.events.trigger("form.submit")
        }, this);

        this.$oel.parents("form").on("reset." + this.id, jQuery.proxy(function () {
          this.events.trigger("form.reset")
        }, this));

        c();
      }, this)

      var e = jQuery.proxy(function () {
        this.$el = this.$oel
        this.$el.attr("contenteditable", !0).css("outline", "none").css("display", "inline-block")
        this.opts.multiLine = !1
        this.opts.toolbarInline = !1
        this.$oel.trigger("froala.doInit")
      }, this);

      var f = jQuery.proxy(function () {
        this.$el = this.$oel;
        this.opts.toolbarInline = !1;
        this.$oel.trigger("froala.doInit");
      }, this);

      var g = jQuery.proxy(function () {
        this.$el = this.$oel
        this.opts.toolbarInline = !1
        
        this.$oel.on("click.popup", function (a) {
          a.preventDefault()
        })

        this.$oel.trigger("froala.doInit")
      }, this);

    this.opts.editInPopup ? g() : "TEXTAREA" == b ? d() : "A" == b ? e() : "IMG" == b ? f() : "BUTTON" == b || "INPUT" == b ? (this.opts.editInPopup = !0, this.opts.toolbarInline = !1, g()) : c()
  };

  b.prototype.load = function (b) {
    for (var c in b)
      if (b.hasOwnProperty(c)) {
        if (this[c]) continue;
        if (jQuery.FE.PLUGINS[c] && this.opts.pluginsEnabled.indexOf(c) < 0) continue;
        if (this[c] = new b[c](this), this[c]._init && (this[c]._init(), this.opts.initOnClick && "core" == c)) return !1
      }
  };

  b.prototype.destroy = function () {
    if ( this.edit.isDisabled() ) return !1;
    if ( this.shared.count--, this.events.$off(), this.events.trigger("destroy"), this.events.trigger("shared.destroy"), 0 === this.shared.count)
      for (var b in this.shared) this.shared.hasOwnProperty(b) && delete this.shared[b];
    this.$oel.parents("form").off("." + this.id), this.$oel.off("click.popup"), this.$oel.removeData("froala.editor"), jQuery.FE.INSTANCES.splice(jQuery.FE.INSTANCES.indexOf(this), 1)
  };

  jQuery.fn.froalaEditor = function (c) {
    for (var d = [], e = 0; e < arguments.length; e++) d.push(arguments[e]);
    if ("string" == typeof c) {
      var f = [];
      return this.each(function () {
        var b = jQuery(this),
          e = b.data("froala.editor");
        if (e) {
          var g, h;
          if (c.indexOf(".") > 0 && e[c.split(".")[0]] ? (e[c.split(".")[0]] && (g = e[c.split(".")[0]]), h = c.split(".")[1]) : (g = e, h = c.split(".")[0]), !g[h]) return jQuery.error("Method " + c + " does not exist in Froala Editor.");
          var i = g[h].apply(e, d.slice(1));
          void 0 === i ? f.push(this) : 0 === f.length && f.push(i)
        }
      }), 1 == f.length ? f[0] : f
    }
    return "object" != typeof c && c ? void 0 : this.each(function () {
      var d = jQuery(this).data("froala.editor");
      if (!d) {
        var e = this;
        globalEditor = new b(e, c);
        globalEditor;
      }
    })
  }

  jQuery.fn.froalaEditor.Constructor = b;
  jQuery.FroalaEditor = b;
  jQuery.FE = b;

  jQuery.FE.MODULES.node = function (b) {
    function c(b) {
      return b && "IFRAME" != b.tagName ? jQuery(b).contents() : []
    }

    function d(b) {
      return b ? b.nodeType != Node.ELEMENT_NODE ? !1 : jQuery.FE.BLOCK_TAGS.indexOf(b.tagName.toLowerCase()) >= 0 : !1
    }

    function e(e, f) {
      if (jQuery(e).find("table").length > 0) return !1;
      if (e.querySelectorAll(jQuery.FE.VOID_ELEMENTS.join(",")).length - e.querySelectorAll("br").length) return !1;
      if (e.querySelectorAll(b.opts.htmlAllowedEmptyTags.join(",")).length) return !1;
      if (e.querySelectorAll(jQuery.FE.BLOCK_TAGS.join(",")).length > 1) return !1;
      if (e.querySelectorAll(b.opts.htmlDoNotWrapTags.join(",")).length) return !1;
      var g = c(e);
      1 == g.length && d(g[0]) && (g = c(g[0]));
      for (var h = !1, i = 0; i < g.length; i++) {
        var j = g[i];
        if (!(f && jQuery(j).hasClass("fr-marker") || j.nodeType == Node.TEXT_NODE && 0 == j.textContent.length)) {
          if ("BR" != j.tagName && (j.textContent || "").replace(/\u200B/gi, "").replace(/\n/g, "").length > 0) return !1;
          if (h) return !1;
          "BR" == j.tagName && (h = !0)
        }
      }
      return !0
    }

    function f(c) {
      for (; c && c.parentNode !== b.$el.get(0) && (!c.parentNode || !jQuery(c.parentNode).hasClass("fr-inner"));)
        if (c = c.parentNode, d(c)) return c;
      return null
    }

    function g(c, e, f) {
      if ("undefined" == typeof e && (e = []), "undefined" == typeof f && (f = !0), e.push(b.$el.get(0)), e.indexOf(c.parentNode) >= 0 || c.parentNode && jQuery(c.parentNode).hasClass("fr-inner") || c.parentNode && jQuery.FE.SIMPLE_ENTER_TAGS.indexOf(c.parentNode.tagName) >= 0 && f) return null;
      for (; e.indexOf(c.parentNode) < 0 && c.parentNode && !jQuery(c.parentNode).hasClass("fr-inner") && (jQuery.FE.SIMPLE_ENTER_TAGS.indexOf(c.parentNode.tagName) < 0 || !f) && (!d(c) || !d(c.parentNode) || !f);) c = c.parentNode;
      return c
    }

    function h(a) {
      var b = {},
        c = a.attributes;
      if (c)
        for (var d = 0; d < c.length; d++) {
          var e = c[d];
          b[e.nodeName] = e.value
        }
      return b
    }

    function i(a) {
      for (var b = "", c = h(a), d = Object.keys(c).sort(), e = 0; e < d.length; e++) {
        var f = d[e],
          g = c[f];
        b += g.indexOf('"') < 0 ? " " + f + '="' + g + '"' : " " + f + "='" + g + "'"
      }
      return b
    }

    function j(a) {
      for (var b = a.attributes, c = 0; c < b.length; c++) {
        var d = b[c];
        a.removeAttribute(d.nodeName)
      }
    }

    function k(a) {
      return "<" + a.tagName.toLowerCase() + i(a) + ">"
    }

    function l(a) {
      return "</" + a.tagName.toLowerCase() + ">"
    }

    function m(b, c) {
      "undefined" == typeof c && (c = !0);
      for (var d = b.previousSibling; d && c && jQuery(d).hasClass("fr-marker");) d = d.previousSibling;
      return d ? d.nodeType == Node.TEXT_NODE && "" === d.textContent ? m(d) : !1 : !0
    }

    function n(b) {
      return b && b.nodeType == Node.ELEMENT_NODE && jQuery.FE.VOID_ELEMENTS.indexOf((b.tagName || "").toLowerCase()) >= 0
    }

    function o(a) {
      return a ? ["UL", "OL"].indexOf(a.tagName) >= 0 : !1
    }

    function p(a) {
      return a === b.$el.get(0)
    }

    function q(a) {
      return a === b.doc.activeElement && (!b.doc.hasFocus || b.doc.hasFocus()) && !!(p(a) || a.type || a.href || ~a.tabIndex)
    }

    function r(a) {
      return (!a.getAttribute || "false" != a.getAttribute("contenteditable")) && ["STYLE", "SCRIPT"].indexOf(a.tagName) < 0
    }
    return {
      isBlock: d,
      isEmpty: e,
      blockParent: f,
      deepestParent: g,
      rawAttributes: h,
      attributes: i,
      clearAttributes: j,
      openTagString: k,
      closeTagString: l,
      isFirstSibling: m,
      isList: o,
      isElement: p,
      contents: c,
      isVoid: n,
      hasFocus: q,
      isEditable: r
    }
  };

  jQuery.extend(jQuery.FE.DEFAULTS, {
    htmlAllowedTags   : ["jQuery", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "queue", "rp", "rt", "ruby", "s", "samp", "script", "style", "section", "select", "small", "source", "span", "strike", "strong", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "u", "ul", "var", "video", "wbr"],
    htmlRemoveTags    : ["script", "style"],
    htmlAllowedAttrs  : ["accept", "accept-charset", "accesskey", "action", "align", "allowfullscreen", "allowtransparency", "alt", "async", "autocomplete", "autofocus", "autoplay", "autosave", "background", "bgcolor", "border", "charset", "cellpadding", "cellspacing", "checked", "cite", "class", "color", "cols", "colspan", "content", "contenteditable", "contextmenu", "controls", "coords", "data", "data-.*", "datetime", "default", "defer", "dir", "dirname", "disabled", "download", "draggable", "dropzone", "enctype", "for", "form", "formaction", "frameborder", "headers", "height", "hidden", "high", "href", "hreflang", "http-equiv", "icon", "id", "ismap", "itemprop", "keytype", "kind", "label", "lang", "language", "list", "loop", "low", "max", "maxlength", "media", "method", "min", "mozallowfullscreen", "multiple", "name", "novalidate", "open", "optimum", "pattern", "ping", "placeholder", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "reversed", "rows", "rowspan", "sandbox", "scope", "scoped", "scrolling", "seamless", "selected", "shape", "size", "sizes", "span", "src", "srcdoc", "srclang", "srcset", "start", "step", "summary", "spellcheck", "style", "tabindex", "target", "title", "type", "translate", "usemap", "value", "valign", "webkitallowfullscreen", "width", "wrap"],
    htmlAllowComments : !0,
    fullPage: !1
  });

  jQuery.FE.HTML5Map = {
    B: "STRONG",
    I: "EM",
    STRIKE: "S"
  };

  jQuery.FE.MODULES.clean = function (b) {
    function c(a) {
      if (a.className && a.className.indexOf("fr-marker") >= 0) return !1;
      var d, e = b.node.contents(a),
        f = [];
      for (d = 0; d < e.length; d++) e[d].nodeType == Node.ELEMENT_NODE ? e[d].textContent.replace(/\u200b/g, "").length != e[d].textContent.length && c(e[d]) : e[d].nodeType == Node.TEXT_NODE && (e[d].textContent = e[d].textContent.replace(/\u200b/g, ""));
      for (e = b.node.contents(a), d = 0; d < e.length; d++) e[d].className && e[d].className.indexOf("fr-marker") >= 0 && f.push(e[d]);
      if (e.length - f.length == 1 && 0 === a.textContent.replace(/\u200b/g, "").length) {
        var g = !0;
        for (d = 0; d < e.length; d++)
          if (e[d].nodeType != Node.TEXT_NODE && f.indexOf(e[d]) < 0) {
            g = !1;
            break
          }
        if (g) {
          for (d = 0; d < f.length; d++) a.parentNode.insertBefore(f[d].cloneNode(!0), a);
          return a.parentNode.removeChild(a), !1
        }
      }
      if (e.length - f.length == 0) {
        for (d = 0; d < f.length; d++) a.parentNode.insertBefore(f[d].cloneNode(!0), a);
        return a.parentNode.removeChild(a), !1
      }
    }

    function d(a) {
      if (a.nodeType == Node.COMMENT_NODE) return "<!--" + a.nodeValue + "-->";
      if (a.nodeType == Node.TEXT_NODE) return a.textContent.replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\u00A0/g, "&nbsp;");
      if (a.nodeType != Node.ELEMENT_NODE) return a.outerHTML;
      if (a.nodeType == Node.ELEMENT_NODE && ["STYLE", "SCRIPT"].indexOf(a.tagName) >= 0) return a.outerHTML;
      if ("IFRAME" == a.tagName) return a.outerHTML;
      var c = a.childNodes;
      if (0 === c.length) return a.outerHTML;
      for (var e = "", f = 0; f < c.length; f++) e += d(c[f]);
      return b.node.openTagString(a) + e + b.node.closeTagString(a)
    }

    function e(a) {
      return H = [], a = a.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, function (a) {
        return H.push(a), "[FROALA.EDITOR.SCRIPT " + (H.length - 1) + "]"
      }), a = a.replace(/<img((?:[\w\W]*?)) src="/g, '<img$1 data-fr-src="')
    }

    function f(a) {
      return a = a.replace(/\[FROALA\.EDITOR\.SCRIPT ([\d]*)\]/gi, function (a, c) {
        return b.opts.htmlRemoveTags.indexOf("script") >= 0 ? "" : H[parseInt(c, 10)]
      }), a = a.replace(/<img((?:[\w\W]*?)) data-fr-src="/g, '<img$1 src="')
    }

    function g(a) {
      var b;
      for (b in a) a.hasOwnProperty(b) && (b.match(G) || delete a[b]);
      for (var c = "", d = Object.keys(a).sort(), e = 0; e < d.length; e++) b = d[e], c += a[b].indexOf('"') < 0 ? " " + b + '="' + a[b] + '"' : " " + b + "='" + a[b] + "'";
      return c
    }

    function h(a, c, d) {
      if (b.opts.fullPage) {
        var e = b.html.extractDoctype(d),
          f = g(b.html.extractNodeAttrs(d, "html"));
        c = null == c ? b.html.extractNode(d, "head") || "<title></title>" : c;
        var h = g(b.html.extractNodeAttrs(d, "head")),
          i = g(b.html.extractNodeAttrs(d, "body"));
        return e + "<html" + f + "><head" + h + ">" + c + "</head><body" + i + ">" + a + "</body></html>"
      }
      return a
    }

    function i(c, e) {
      var f = jQuery("<div>" + c + "</div>"),
        g = "";
      if (f) {
        for (var h = b.node.contents(f.get(0)), i = 0; i < h.length; i++) e(h[i]);
        h = b.node.contents(f.get(0));
        for (var i = 0; i < h.length; i++) g += d(h[i])
      }
      return g
    }

    function j(a, c, d) {
      a = e(a);
      var g = a,
        j = null;
      if (b.opts.fullPage) {
        var g = b.html.extractNode(a, "body") || (a.indexOf("<body") >= 0 ? "" : a);
        d && (j = b.html.extractNode(a, "head") || "")
      }
      g = i(g, c), j && (j = i(j, c)), g = g.replace(/<br>[\r|\n]*/g, "<br>"), g = g.replace(/<br> */g, "<br>"), g = g.replace(/ *(\r|\n) */g, " ");
      var k = h(g, j, a);
      return f(k)
    }

    function k(a) {
      return a.replace(/\u200b/g, "").length == a.length ? a : b.clean.exec(a, c)
    }

    function l() {
      var c = b.$el.get(0).querySelectorAll(Object.keys(jQuery.FE.HTML5Map).join(","));
      if (c.length) {
        b.selection.save();
        for (var d = 0; d < c.length; d++) "" === b.node.attributes(c[d]) && jQuery(c[d]).replaceWith("<" + jQuery.FE.HTML5Map[c[d].tagName] + ">" + c[d].innerHTML + "</" + jQuery.FE.HTML5Map[c[d].tagName] + ">");
        b.selection.restore()
      }
    }

    function m(c) {
      if ("PRE" == c.tagName && o(c), c.nodeType == Node.ELEMENT_NODE && (c.getAttribute("data-fr-src") && c.setAttribute("data-fr-src", b.helpers.sanitizeURL(c.getAttribute("data-fr-src"))), c.getAttribute("href") && c.setAttribute("href", b.helpers.sanitizeURL(c.getAttribute("href"))), ["TABLE", "TBODY", "TFOOT", "TR"].indexOf(c.tagName) >= 0 && (c.innerHTML = c.innerHTML.trim())), !b.opts.pasteAllowLocalImages && c.nodeType == Node.ELEMENT_NODE && "IMG" == c.tagName && c.getAttribute("data-fr-src") && 0 == c.getAttribute("data-fr-src").indexOf("file://")) return c.parentNode.removeChild(c), !1;
      if (c.nodeType == Node.ELEMENT_NODE && jQuery.FE.HTML5Map[c.tagName] && "" === b.node.attributes(c)) {
        var d = jQuery.FE.HTML5Map[c.tagName],
          e = "<" + d + ">" + c.innerHTML + "</" + d + ">";
        c.insertAdjacentHTML("beforebegin", e), c = c.previousSibling, c.parentNode.removeChild(c.nextSibling)
      }
      if (b.opts.htmlAllowComments || c.nodeType != Node.COMMENT_NODE)
        if (c.tagName && c.tagName.match(F)) c.parentNode.removeChild(c);
        else if (c.tagName && !c.tagName.match(E)) c.outerHTML = c.innerHTML;
      else {
        var f = c.attributes;
        if (f)
          for (var g = f.length - 1; g >= 0; g--) {
            var h = f[g];
            h.nodeName.match(G) || c.removeAttribute(h.nodeName)
          }
      }
      else 0 !== c.data.indexOf("[FROALA.EDITOR") && c.parentNode.removeChild(c)
    }

    function n(a) {
      for (var c = b.node.contents(a), d = 0; d < c.length; d++) c[d].nodeType != Node.TEXT_NODE && n(c[d]);
      m(a)
    }

    function o(a) {
      var b = a.innerHTML;
      b.indexOf("\n") >= 0 && (a.innerHTML = b.replace(/\n/g, "<br>"))
    }

    function p(c, d, e, f) {
      "undefined" == typeof d && (d = []), "undefined" == typeof e && (e = []), "undefined" == typeof f && (f = !1), c = c.replace(/\u0009/g, "");
      var g, h = jQuery.merge([], b.opts.htmlAllowedTags);
      for (g = 0; g < d.length; g++) h.indexOf(d[g]) >= 0 && h.splice(h.indexOf(d[g]), 1);
      var i = jQuery.merge([], b.opts.htmlAllowedAttrs);
      for (g = 0; g < e.length; g++) i.indexOf(e[g]) >= 0 && i.splice(i.indexOf(e[g]), 1);
      return i.push("data-fr-.*"), i.push("fr-.*"), E = new RegExp("^" + h.join("$|^") + "$", "gi"), G = new RegExp("^" + i.join("$|^") + "$", "gi"), F = new RegExp("^" + b.opts.htmlRemoveTags.join("$|^") + "$", "gi"), c = j(c, n, !0)
    }

    function q() {
      for (var c = b.$el.get(0).querySelectorAll("blockquote + blockquote"), d = 0; d < c.length; d++) {
        var e = c[d];
        b.node.attributes(e) == b.node.attributes(e.previousSibling) && (jQuery(e).prev().append(jQuery(e).html()), jQuery(e).remove())
      }
    }

    function r() {
      for (var a = b.$el.get(0).querySelectorAll("tr"), c = 0; c < a.length; c++)
        if (a[c].querySelectorAll("th").length) {
          for (var d = a[c]; d && "TABLE" != d.tagName && "THEAD" != d.tagName;) d = d.parentNode;
          var e = d;
          "THEAD" != e.tagName && (e = b.doc.createElement("THEAD"), d.insertBefore(e, d.firstChild)), e.appendChild(a[c])
        }
    }

    function s() {
      for (var c = b.$el.get(0).querySelectorAll("table"), d = 0; d < c.length; d++) {
        for (var e = c[d].previousSibling; e && e.nodeType == Node.TEXT_NODE && 0 == e.textContent.length;) e = e.previousSibling;
        !e || b.node.isBlock(e) || "BR" == e.tagName || e.nodeType != Node.TEXT_NODE && e.nodeType != Node.ELEMENT_NODE || jQuery(e).is(b.opts.htmlDoNotWrapTags.join(",")) || c[d].parentNode.insertBefore(b.doc.createElement("br"), c[d])
      }
    }

    function t() {
      var c = b.html.defaultTag();
      if (c)
        for (var d = b.$el.get(0).querySelectorAll("td > " + c + ", th > " + c), e = 0; e < d.length; e++) "" === b.node.attributes(d[e]) && jQuery(d[e]).replaceWith(d[e].innerHTML + "<br>")
    }

    function u() {
      r(), s(), t()
    }

    function v() {
      var a = [],
        c = function (a) {
          return !b.node.isList(a.parentNode)
        };
      do {
        if (a.length) {
          var d = a[0],
            e = b.doc.createElement("ul");
          d.parentNode.insertBefore(e, d);
          do {
            var f = d;
            d = d.nextSibling, e.appendChild(f)
          } while (d && "LI" == d.tagName)
        }
        a = [];
        for (var g = b.$el.get(0).querySelectorAll("li"), h = 0; h < g.length; h++) c(g[h]) && a.push(g[h])
      } while (a.length > 0)
    }

    function w() {
      for (var a = b.$el.get(0).querySelectorAll("ol + ol, ul + ul"), c = 0; c < a.length; c++) {
        var d = a[c];
        if (b.node.attributes(d) == b.node.attributes(d.previousSibling)) {
          for (var e = b.node.contents(d), f = 0; f < e.length; f++) d.previousSibling.appendChild(e[f]);
          d.parentNode.removeChild(d)
        }
      }
    }

    function x() {
      var a, c = function (b) {
        0 === b.querySelectorAll("LI").length && (a = !0, b.parentNode.removeChild(b))
      };
      do {
        a = !1;
        for (var d = b.$el.get(0).querySelectorAll("li:empty"), e = 0; e < d.length; e++) d[e].parentNode.removeChild(d[e]);
        for (var f = b.$el.get(0).querySelectorAll("ul, ol"), e = 0; e < f.length; e++) c(f[e])
      } while (a === !0)
    }

    function y() {
      for (var c = b.$el.get(0).querySelectorAll("ul > ul, ol > ol, ul > ol, ol > ul"), d = 0; d < c.length; d++) {
        var e = c[d],
          f = e.previousSibling;
        f && ("LI" == f.tagName ? f.appendChild(e) : jQuery(e).wrap("<li></li>"))
      }
    }

    function z() {
      for (var c = b.$el.get(0).querySelectorAll("li > ul, li > ol"), d = 0; d < c.length; d++) {
        var e = c[d];
        if (e.nextSibling) {
          var f = e.nextSibling,
            g = jQuery("<li>");
          jQuery(e.parentNode).after(g);
          do {
            var h = f;
            f = f.nextSibling, g.append(h)
          } while (f)
        }
      }
    }

    function A() {
      for (var c = b.$el.get(0).querySelectorAll("li > ul, li > ol"), d = 0; d < c.length; d++) {
        var e = c[d];
        if (b.node.isFirstSibling(e)) jQuery(e).before("<br/>");
        else if (e.previousSibling && "BR" == e.previousSibling.tagName) {
          for (var f = e.previousSibling.previousSibling; f && jQuery(f).hasClass("fr-marker");) f = f.previousSibling;
          f && "BR" != f.tagName && jQuery(e.previousSibling).remove()
        }
      }
    }

    function B() {
      for (var c = b.$el.get(0).querySelectorAll("li:empty"), d = 0; d < c.length; d++) jQuery(c[d]).remove()
    }

    function C() {
      v(), w(), x(), y(), z(), A(), B()
    }

    function D() {
      b.opts.fullPage && jQuery.merge(b.opts.htmlAllowedTags, ["head", "title", "style", "link", "base", "body", "html"])
    }
    var E, F, G, H = [],
      H = [];
    return {
      _init: D,
      html: p,
      toHTML5: l,
      tables: u,
      lists: C,
      quotes: q,
      invisibleSpaces: k,
      exec: j
    }
  };
  
  jQuery.FE.XS = 0;
  jQuery.FE.SM = 1;
  jQuery.FE.MD = 2;
  jQuery.FE.LG = 3;
  
  jQuery.FE.MODULES.helpers = function (b) {
    function c() {
      var a, b, c = -1;
      return "Microsoft Internet Explorer" == navigator.appName ? (a = navigator.userAgent, b = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})"), null !== b.exec(a) && (c = parseFloat(RegExp.$1))) : "Netscape" == navigator.appName && (a = navigator.userAgent, b = new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})"), null !== b.exec(a) && (c = parseFloat(RegExp.$1))), c
    }

    function d() {
      var a = {},
        b = c();
      if (b > 0) a.msie = !0;
      else {
        var d = navigator.userAgent.toLowerCase(),
          e = /(edge)[ \/]([\w.]+)/.exec(d) || /(chrome)[ \/]([\w.]+)/.exec(d) || /(webkit)[ \/]([\w.]+)/.exec(d) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(d) || /(msie) ([\w.]+)/.exec(d) || d.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(d) || [],
          f = {
            browser: e[1] || "",
            version: e[2] || "0"
          };
        e[1] && (a[f.browser] = !0), a.chrome ? a.webkit = !0 : a.webkit && (a.safari = !0)
      }
      return a.msie && (a.version = b), a
    }

    function e() {
      return /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && !h()
    }

    function f() {
      return /(Android)/g.test(navigator.userAgent) && !h()
    }

    function g() {
      return /(Blackberry)/g.test(navigator.userAgent)
    }

    function h() {
      return /(Windows Phone)/gi.test(navigator.userAgent)
    }

    function i() {
      return f() || e() || g()
    }

    function j() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (a) {
        window.setTimeout(a, 1e3 / 60)
      }
    }

    function k(a) {
      return parseInt(a, 10) || 0
    }

    function l() {
      var b = jQuery('<div class="fr-visibility-helper"></div>').appendTo("body"),
        c = k(b.css("margin-left"));
      return b.remove(), c
    }

    function m() {
      return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch
    }

    function n(a) {
      if (!/^(https?:|ftps?:|)\/\//.test(a)) return !1;
      a = String(a).replace(/</g, "%3C").replace(/>/g, "%3E").replace(/"/g, "%22").replace(/ /g, "%20");
      var b = /(http|ftp|https):\/\/[\w-]+(\.[\w-]*)*([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
      return b.test(a)
    }

    function o(a) {
      if (/^(https?:|ftps?:|)\/\//.test(a)) {
        if (!n(a) && !n("http:" + a)) return ""
      }
      else a = encodeURIComponent(a).replace(/%23/g, "#").replace(/%2F/g, "/").replace(/%25/g, "%").replace(/mailto%3A/g, "mailto:").replace(/file%3A/g, "file:").replace(/sms%3A/g, "sms:").replace(/tel%3A/g, "tel:").replace(/notes%3A/g, "notes:").replace(/data%3Aimage/g, "data:image").replace(/webkit-fake-url%3A/g, "webkit-fake-url:").replace(/%3F/g, "?").replace(/%3D/g, "=").replace(/%26/g, "&").replace(/&amp;/g, "&").replace(/%2C/g, ",").replace(/%3B/g, ";").replace(/%2B/g, "+").replace(/%40/g, "@");
      return a
    }

    function p(a) {
      return a && !a.propertyIsEnumerable("length") && "object" == typeof a && "number" == typeof a.length
    }

    function q(a) {
      function b(a) {
        return ("0" + parseInt(a, 10).toString(16)).slice(-2)
      }
      try {
        return a && "transparent" !== a ? /^#[0-9A-F]{6}$/i.test(a) ? a : (a = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/), ("#" + b(a[1]) + b(a[2]) + b(a[3])).toUpperCase()) : ""
      }
      catch (c) {
        return null
      }
    }

    function r(a) {
      var b = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      a = a.replace(b, function (a, b, c, d) {
        return b + b + c + c + d + d
      });
      var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
      return c ? "rgb(" + parseInt(c[1], 16) + ", " + parseInt(c[2], 16) + ", " + parseInt(c[3], 16) + ")" : ""
    }

    function s(b) {
      var c = (b.css("text-align") || "").replace(/-(.*)-/g, "");
      if (["left", "right", "justify", "center"].indexOf(c) < 0) {
        if (!u) {
          var d = jQuery('<div dir="auto" style="text-align: initial; position: fixed; left: -3000px;"><span id="s1">.</span><span id="s2">.</span></div>');
          jQuery("body").append(d);
          var e = d.find("#s1").get(0).getBoundingClientRect().left,
            f = d.find("#s2").get(0).getBoundingClientRect().left;
          d.remove(), u = f > e ? "left" : "right"
        }
        c = u
      }
      return c
    }

    function t() {
      b.browser = d()
    }
    var u;
    return {
      _init: t,
      isIOS: e,
      isAndroid: f,
      isBlackberry: g,
      isWindowsPhone: h,
      isMobile: i,
      requestAnimationFrame: j,
      getPX: k,
      screenSize: l,
      isTouch: m,
      sanitizeURL: o,
      isArray: p,
      RGBToHex: q,
      HEXtoRGB: r,
      isURL: n,
      getAlignment: s
    }
  };
  
  jQuery.FE.MODULES.events = function (b) {
    function c(a, b, c) {
      s(a, b, c)
    }

    function d() {
      c(b.$el, "cut copy paste beforepaste", function (a) {
        v(a.type, [a])
      })
    }

    function e() {
      c(b.$el, "click mouseup mousedown touchstart touchend dragenter dragover dragleave dragend drop dragstart", function (a) {
        v(a.type, [a])
      }), r("mousedown", function () {
        for (var c = 0; c < jQuery.FE.INSTANCES.length; c++) jQuery.FE.INSTANCES[c] != b && jQuery.FE.INSTANCES[c].popups && jQuery.FE.INSTANCES[c].popups.areVisible() && jQuery.FE.INSTANCES[c].$el.find(".fr-marker").remove()
      })
    }

    function f() {
      c(b.$el, "keydown keypress keyup input", function (a) {
        v(a.type, [a])
      })
    }

    function g() {
      c(b.$win, b._mousedown, function (a) {
        v("window.mousedown", [a]), n()
      }), c(b.$win, b._mouseup, function (a) {
        v("window.mouseup", [a])
      }), c(b.$win, "keydown keyup touchmove touchend", function (a) {
        v("window." + a.type, [a])
      })
    }

    function h() {
      c(b.$doc, "dragend drop", function (a) {
        v("document." + a.type, [a])
      })
    }

    function i(c) {
      if ("undefined" == typeof c && (c = !0), !b.$wp) return !1;
      if (!b.core.hasFocus() && c) return b.$el.focus(), !1;
      if (!b.core.hasFocus() || b.$el.find(".fr-marker").length > 0) return !1;
      var d = b.selection.info(b.$el.get(0));
      if (d.atStart && b.selection.isCollapsed() && null != b.html.defaultTag()) {
        var e = b.markers.insert();
        if (e && !b.node.blockParent(e)) {
          jQuery(e).remove();
          var f = b.$el.find(b.html.blockTagsQuery()).get(0);
          f && (jQuery(f).prepend(jQuery.FE.MARKERS), b.selection.restore())
        }
        else e && jQuery(e).remove()
      }
    }

    function j() {
      c(b.$el, "focus", function (a) {
        p() && (i(!1), C === !1 && v(a.type, [a]))
      }), c(b.$el, "blur", function (a) {
        p() && C === !0 && v(a.type, [a])
      }), r("focus", function () {
        C = !0
      }), r("blur", function () {
        C = !1
      })
    }

    function k() {
      b.helpers.isMobile() ? (b._mousedown = "touchstart", b._mouseup = "touchend", b._move = "touchmove", b._mousemove = "touchmove") : (b._mousedown = "mousedown", b._mouseup = "mouseup", b._move = "", b._mousemove = "mousemove")
    }

    function l(c) {
      var d = jQuery(c.currentTarget);
      return b.edit.isDisabled() || d.hasClass("fr-disabled") ? (c.preventDefault(), !1) : "mousedown" === c.type && 1 !== c.which ? !0 : (b.helpers.isMobile() || c.preventDefault(), (b.helpers.isAndroid() || b.helpers.isWindowsPhone()) && 0 === d.parents(".fr-dropdown-menu").length && (c.preventDefault(), c.stopPropagation()), d.addClass("fr-selected"), void b.events.trigger("commands.mousedown", [d]))
    }

    function m(c, d) {
      var e = jQuery(c.currentTarget);
      if (b.edit.isDisabled() || e.hasClass("fr-disabled")) return c.preventDefault(), !1;
      if ("mouseup" === c.type && 1 !== c.which) return !0;
      if (!e.hasClass("fr-selected")) return !0;
      if ("touchmove" != c.type) {
        if (c.stopPropagation(), c.stopImmediatePropagation(), c.preventDefault(), !e.hasClass("fr-selected")) return jQuery(".fr-selected").removeClass("fr-selected"), !1;
        if (jQuery(".fr-selected").removeClass("fr-selected"), e.data("dragging") || e.attr("disabled")) return e.removeData("dragging"), !1;
        var f = e.data("timeout");
        f && (clearTimeout(f), e.removeData("timeout")), d.apply(b, [c])
      }
      else e.data("timeout") || e.data("timeout", setTimeout(function () {
        e.data("dragging", !0)
      }, 100))
    }

    function n() {
      A = !0
    }

    function o() {
      A = !1
    }

    function p() {
      return A
    }

    function q(a, c, d) {
      s(a, b._mousedown, c, function (a) {
        l(a)
      }, !0), s(a, b._mouseup + " " + b._move, c, function (a) {
        m(a, d)
      }, !0), s(a, "mousedown click mouseup", c, function (a) {
        a.stopPropagation()
      }, !0), r("window.mouseup", function () {
        a.find(c).removeClass("fr-selected"), n()
      })
    }

    function r(a, c, d) {
      var e = a.split(" ");
      if (e.length > 1) {
        for (var f = 0; f < e.length; f++) r(e[f], c, d);
        return !0
      }
      "undefined" == typeof d && (d = !1);
      var g;
      g = 0 != a.indexOf("shared.") ? B[a] = B[a] || [] : b.shared._events[a] = b.shared._events[a] || [], d ? g.unshift(c) : g.push(c)
    }

    function s(a, c, d, e, f) {
      "function" == typeof d && (f = e, e = d, d = !1);
      var g = f ? b.shared.$_events : D,
        h = f ? b.sid : b.id;
      d ? a.on(c.split(" ").join(".ed" + h + " ") + ".ed" + h, d, e) : a.on(c.split(" ").join(".ed" + h + " ") + ".ed" + h, e), g.indexOf(a.get(0)) < 0 && g.push(a.get(0))
    }

    function t(b, c) {
      for (var d = 0; d < b.length; d++) jQuery(b[d]).off(".ed" + c)
    }

    function u() {
      t(D, b.id), 0 == b.shared.count && t(b.shared.$_events, b.sid)
    }

    function v(c, d, e) {
      if (!b.edit.isDisabled() || e) {
        var f;
        if (0 != c.indexOf("shared.")) f = B[c];
        else {
          if (b.shared.count > 0) return !1;
          f = b.shared._events[c]
        }
        var g;
        if (f)
          for (var h = 0; h < f.length; h++)
            if (g = f[h].apply(b, d), g === !1) return !1;
        return g = b.$oel.triggerHandler("froalaEditor." + c, jQuery.merge([b], d || [])), g === !1 ? !1 : g
      }
    }

    function w(c, d, e) {
      if (!b.edit.isDisabled() || e) {
        var f;
        if (0 != c.indexOf("shared.")) f = B[c];
        else {
          if (b.shared.count > 0) return !1;
          f = b.shared._events[c]
        }
        var g;
        if (f)
          for (var h = 0; h < f.length; h++) g = f[h].apply(b, [d]), "undefined" != typeof g && (d = g);
        return g = b.$oel.triggerHandler("froalaEditor." + c, jQuery.merge([b], [d])), "undefined" != typeof g && (d = g), d
      }
    }

    function x() {
      for (var a in B) B.hasOwnProperty(a) && delete B[a]
    }

    function y() {
      for (var a in b.shared._events) b.shared._events.hasOwnProperty(a) && delete b.shared._events[a]
    }

    function z() {
      b.shared.$_events = b.shared.$_events || [], b.shared._events = {}, k(), e(), g(), h(), f(), j(), n(), d(), r("destroy", x), r("shared.destroy", y)
    }
    var A, B = {},
      C = !1,
      D = [];
    return {
      _init: z,
      on: r,
      trigger: v,
      bindClick: q,
      disableBlur: o,
      enableBlur: n,
      blurActive: p,
      focus: i,
      chainTrigger: w,
      $on: s,
      $off: u
    }
  };
  
  jQuery.FE.INVISIBLE_SPACE = "&#8203;";
  
  jQuery.FE.START_MARKER = '<span class="fr-marker" data-id="0" data-type="true" style="display: none; line-height: 0;">' + jQuery.FE.INVISIBLE_SPACE + "</span>", jQuery.FE.END_MARKER = '<span class="fr-marker" data-id="0" data-type="false" style="display: none; line-height: 0;">' + jQuery.FE.INVISIBLE_SPACE + "</span>";
  
  jQuery.FE.MARKERS = jQuery.FE.START_MARKER + jQuery.FE.END_MARKER;
  
  jQuery.FE.MODULES.markers = function (b) {
    function c(c, d) {
      return jQuery('<span class="fr-marker" data-id="' + d + '" data-type="' + c + '" style="display: ' + (b.browser.safari ? "none" : "inline-block") + '; line-height: 0;">' + jQuery.FE.INVISIBLE_SPACE + "</span>", b.doc)[0]
    }

    function d(d, e, f) {
      try {
        var g = d.cloneRange();
        if (g.collapse(e), g.insertNode(c(e, f)), e === !0 && d.collapsed)
          for (var h = b.$el.find('span.fr-marker[data-type="true"][data-id="' + f + '"]'), i = h.get(0).nextSibling; i && i.nodeType === Node.TEXT_NODE && 0 === i.textContent.length;) jQuery(i).remove(), i = h.nextSibling;
        if (e === !0 && !d.collapsed) {
          var h = b.$el.find('span.fr-marker[data-type="true"][data-id="' + f + '"]').get(0),
            i = h.nextSibling;
          if (i && i.nodeType === Node.ELEMENT_NODE && b.node.isBlock(i)) {
            var j = [i];
            do i = j[0], j = b.node.contents(i); while (j[0] && b.node.isBlock(j[0]));
            jQuery(i).prepend(jQuery(h))
          }
        }
        if (e === !1 && !d.collapsed) {
          var h = b.$el.find('span.fr-marker[data-type="false"][data-id="' + f + '"]').get(0),
            i = h.previousSibling;
          if (i && i.nodeType === Node.ELEMENT_NODE && b.node.isBlock(i)) {
            var j = [i];
            do i = j[j.length - 1], j = b.node.contents(i); while (j[j.length - 1] && b.node.isBlock(j[j.length - 1]));
            jQuery(i).append(jQuery(h))
          }
          h.parentNode && ["TD", "TH"].indexOf(h.parentNode.tagName) >= 0 && h.parentNode.previousSibling && !h.previousSibling && jQuery(h.parentNode.previousSibling).append(h)
        }
        var k = b.$el.find('span.fr-marker[data-type="' + e + '"][data-id="' + f + '"]').get(0);
        return k && (k.style.display = "none"), k
      }
      catch (l) {
        return null
      }
    }

    function e() {
      if (!b.$wp) return null;
      try {
        var c = b.selection.ranges(0),
          d = c.commonAncestorContainer;
        if (d != b.$el.get(0) && 0 == b.$el.find(d).length) return null;
        var e = c.cloneRange(),
          f = c.cloneRange();
        e.collapse(!0);
        var g = jQuery('<span class="fr-marker" style="display: none; line-height: 0;">' + jQuery.FE.INVISIBLE_SPACE + "</span>", b.doc)[0];
        if (e.insertNode(g), g = b.$el.find("span.fr-marker").get(0)) {
          for (var h = g.nextSibling; h && h.nodeType === Node.TEXT_NODE && 0 === h.textContent.length;) jQuery(h).remove(), h = b.$el.find("span.fr-marker").get(0).nextSibling;
          return b.selection.clear(), b.selection.get().addRange(f), g
        }
        return null
      }
      catch (i) {}
    }

    function f() {
      b.selection.isCollapsed() || b.selection.remove();
      var c = b.$el.find(".fr-marker").get(0);
      if (null == c && (c = e()), null == c) return null;
      var d;
      if (d = b.node.deepestParent(c))
        if (b.node.isBlock(d) && b.node.isEmpty(d)) jQuery(d).replaceWith('<span class="fr-marker"></span>');
        else {
          var f = c,
            g = "",
            h = "";
          do f = f.parentNode, g += b.node.closeTagString(f), h = b.node.openTagString(f) + h; while (f != d);
          jQuery(c).replaceWith('<span id="fr-break"></span>');
          var i = b.node.openTagString(d) + jQuery(d).html() + b.node.closeTagString(d);
          i = i.replace(/<span id="fr-break"><\/span>/g, g + '<span class="fr-marker"></span>' + h), jQuery(d).replaceWith(i)
        }
      return b.$el.find(".fr-marker").get(0)
    }

    function g(a) {
      var c = a.clientX,
        d = a.clientY;
      h();
      var f, g = null;
      if ("undefined" != typeof b.doc.caretPositionFromPoint ? (f = b.doc.caretPositionFromPoint(c, d), g = b.doc.createRange(), g.setStart(f.offsetNode, f.offset), g.setEnd(f.offsetNode, f.offset)) : "undefined" != typeof b.doc.caretRangeFromPoint && (f = b.doc.caretRangeFromPoint(c, d), g = b.doc.createRange(), g.setStart(f.startContainer, f.startOffset), g.setEnd(f.startContainer, f.startOffset)), null !== g && "undefined" != typeof b.win.getSelection) {
        var i = b.win.getSelection();
        i.removeAllRanges(), i.addRange(g)
      }
      else if ("undefined" != typeof b.doc.body.createTextRange) try {
        g = b.doc.body.createTextRange(), g.moveToPoint(c, d);
        var j = g.duplicate();
        j.moveToPoint(c, d), g.setEndPoint("EndToEnd", j), g.select()
      }
      catch (k) {
        return !1
      }
      e()
    }

    function h() {
      b.$el.find(".fr-marker").remove()
    }
    return {
      place: d,
      insert: e,
      split: f,
      insertAtPoint: g,
      remove: h
    }
  };
  
  jQuery.FE.MODULES.selection = function (b) {
    function c() {
      var a = "";
      return b.win.getSelection ? a = b.win.getSelection() : b.doc.getSelection ? a = b.doc.getSelection() : b.doc.selection && (a = b.doc.selection.createRange().text), a.toString()
    }

    function d() {
      var a = "";
      return a = b.win.getSelection ? b.win.getSelection() : b.doc.getSelection ? b.doc.getSelection() : b.doc.selection.createRange()
    }

    function e(a) {
      var c = d(),
        e = [];
      if (c && c.getRangeAt && c.rangeCount)
        for (var e = [], f = 0; f < c.rangeCount; f++) e.push(c.getRangeAt(f));
      else e = b.doc.createRange ? [b.doc.createRange()] : [];
      return "undefined" != typeof a ? e[a] : e
    }

    function f() {
      var a = d();
      try {
        a.removeAllRanges ? a.removeAllRanges() : a.empty ? a.empty() : a.clear && a.clear()
      }
      catch (b) {}
    }

    function g() {
      var f = d();
      try {
        if (f.rangeCount) {
          var g = e(0),
            h = g.startContainer;
          if (h.nodeType == Node.ELEMENT_NODE) {
            var i = !1;
            if (h.childNodes.length > 0 && h.childNodes[g.startOffset]) {
              for (var j = h.childNodes[g.startOffset]; j && j.nodeType == Node.TEXT_NODE && 0 == j.textContent.length;) j = j.nextSibling;
              j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = !0)
            }
            else if (!g.collapsed && h.nextSibling && h.nextSibling.nodeType == Node.ELEMENT_NODE) {
              var j = h.nextSibling;
              j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = !0)
            }!i && h.childNodes.length > 0 && jQuery(h.childNodes[0]).text().replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && ["BR", "IMG", "HR"].indexOf(h.childNodes[0].tagName) < 0 && (h = h.childNodes[0])
          }
          for (; h.nodeType != Node.ELEMENT_NODE && h.parentNode;) h = h.parentNode;
          for (var k = h; k && "HTML" != k.tagName;) {
            if (k == b.$el.get(0)) return h;
            k = jQuery(k).parent()[0]
          }
        }
      }
      catch (l) {}
      return b.$el.get(0)
    }

    function h() {
      var f = d();
      try {
        if (f.rangeCount) {
          var g = e(0),
            h = g.endContainer;
          if (h.nodeType == Node.ELEMENT_NODE) {
            var i = !1;
            if (h.childNodes.length > 0 && h.childNodes[g.endOffset] && jQuery(h.childNodes[g.endOffset]).text() === c()) h = h.childNodes[g.endOffset], i = !0;
            else if (!g.collapsed && h.previousSibling && h.previousSibling.nodeType == Node.ELEMENT_NODE) {
              var j = h.previousSibling;
              j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = !0)
            }
            else if (!g.collapsed && h.childNodes.length > 0 && h.childNodes[g.endOffset]) {
              var j = h.childNodes[g.endOffset].previousSibling;
              j.nodeType == Node.ELEMENT_NODE && j && j.textContent.replace(/\u200B/g, "") === c().replace(/\u200B/g, "") && (h = j, i = !0)
            }!i && h.childNodes.length > 0 && jQuery(h.childNodes[h.childNodes.length - 1]).text() === c() && ["BR", "IMG", "HR"].indexOf(h.childNodes[h.childNodes.length - 1].tagName) < 0 && (h = h.childNodes[h.childNodes.length - 1])
          }
          for (h.nodeType == Node.TEXT_NODE && 0 == g.endOffset && h.previousSibling && h.previousSibling.nodeType == Node.ELEMENT_NODE && (h = h.previousSibling); h.nodeType != Node.ELEMENT_NODE && h.parentNode;) h = h.parentNode;
          for (var k = h; k && "HTML" != k.tagName;) {
            if (k == b.$el.get(0)) return h;
            k = jQuery(k).parent()[0]
          }
        }
      }
      catch (l) {}
      return b.$el.get(0)
    }

    function i(a, b) {
      var c = a;
      return c.nodeType == Node.ELEMENT_NODE && c.childNodes.length > 0 && c.childNodes[b] && (c = c.childNodes[b]), c.nodeType == Node.TEXT_NODE && (c = c.parentNode), c
    }

    function j() {
      var c = [],
        f = d();
      if (t() && f.rangeCount)
        for (var g = e(), h = 0; h < g.length; h++) {
          var j = g[h],
            k = i(j.startContainer, j.startOffset),
            l = i(j.endContainer, j.endOffset);
          b.node.isBlock(k) && c.indexOf(k) < 0 && c.push(k);
          var m = b.node.blockParent(k);
          m && c.indexOf(m) < 0 && c.push(m);
          for (var n = [], o = k; o !== l && o !== b.$el.get(0);) n.indexOf(o) < 0 && o.children && o.children.length ? (n.push(o), o = o.children[0]) : o.nextSibling ? o = o.nextSibling : o.parentNode && (o = o.parentNode, n.push(o)), b.node.isBlock(o) && n.indexOf(o) < 0 && c.indexOf(o) < 0 && c.push(o);
          b.node.isBlock(l) && c.indexOf(l) < 0 && c.push(l);
          var m = b.node.blockParent(l);
          m && c.indexOf(m) < 0 && c.push(m)
        }
      for (var h = c.length - 1; h > 0; h--) jQuery(c[h]).find(c).length && "LI" != c[h].tagName && c.splice(h, 1);
      return c
    }

    function k() {
      if (b.$wp) {
        b.markers.remove();
        for (var a = e(), c = [], d = 0; d < a.length; d++)
          if (a[d].startContainer !== b.doc) {
            var f = a[d],
              g = f.collapsed,
              h = b.markers.place(f, !0, d),
              i = b.markers.place(f, !1, d);
            if (b.browser.safari && !g) {
              var f = b.doc.createRange();
              f.setStartAfter(h), f.setEndBefore(i), c.push(f)
            }
          }
        if (b.browser.safari && c.length) {
          b.selection.clear();
          for (var d = 0; d < c.length; d++) b.selection.get().addRange(c[d])
        }
      }
    }

    function l() {
      var c = b.$el.get(0).querySelectorAll('.fr-marker[data-type="true"]');
      if (!b.$wp) return b.markers.remove(), !1;
      if (0 === c.length) return !1;
      if (b.browser.msie || b.browser.edge)
        for (var e = 0; e < c.length; e++) c[e].style.display = "inline-block";
      b.core.hasFocus() || b.browser.msie || b.browser.webkit || b.$el.focus(), f();
      for (var g = d(), e = 0; e < c.length; e++) {
        var h = jQuery(c[e]).data("id"),
          i = c[e],
          j = b.doc.createRange(),
          k = b.$el.find('.fr-marker[data-type="false"][data-id="' + h + '"]');
        (b.browser.msie || b.browser.edge) && k.css("display", "inline-block");
        var l = null;
        if (k.length > 0) {
          k = k[0];
          try {
            for (var n = !1, o = i.nextSibling; o && o.nodeType == Node.TEXT_NODE && 0 == o.textContent.length;) {
              var p = o;
              o = o.nextSibling, jQuery(p).remove()
            }
            for (var q = k.nextSibling; q && q.nodeType == Node.TEXT_NODE && 0 == q.textContent.length;) {
              var p = q;
              q = q.nextSibling, jQuery(p).remove()
            }
            if (i.nextSibling == k || k.nextSibling == i) {
              for (var r = i.nextSibling == k ? i : k, s = r == i ? k : i, t = r.previousSibling; t && t.nodeType == Node.TEXT_NODE && 0 == t.length;) {
                var p = t;
                t = t.previousSibling, jQuery(p).remove()
              }
              if (t && t.nodeType == Node.TEXT_NODE)
                for (; t && t.previousSibling && t.previousSibling.nodeType == Node.TEXT_NODE;) t.previousSibling.textContent = t.previousSibling.textContent + t.textContent, t = t.previousSibling, jQuery(t.nextSibling).remove();
              for (var u = s.nextSibling; u && u.nodeType == Node.TEXT_NODE && 0 == u.length;) {
                var p = u;
                u = u.nextSibling, jQuery(p).remove()
              }
              if (u && u.nodeType == Node.TEXT_NODE)
                for (; u && u.nextSibling && u.nextSibling.nodeType == Node.TEXT_NODE;) u.nextSibling.textContent = u.textContent + u.nextSibling.textContent, u = u.nextSibling, jQuery(u.previousSibling).remove();
              if (t && b.node.isVoid(t) && (t = null), u && b.node.isVoid(u) && (u = null), t && u && t.nodeType == Node.TEXT_NODE && u.nodeType == Node.TEXT_NODE) {
                jQuery(i).remove(), jQuery(k).remove();
                var v = t.textContent.length;
                t.textContent = t.textContent + u.textContent, jQuery(u).remove(), b.html.normalizeSpaces(t), j.setStart(t, v), j.setEnd(t, v), n = !0
              }
              else !t && u && u.nodeType == Node.TEXT_NODE ? (jQuery(i).remove(), jQuery(k).remove(), b.html.normalizeSpaces(u), l = jQuery(b.doc.createTextNode("​")), jQuery(u).before(l), j.setStart(u, 0), j.setEnd(u, 0), n = !0) : !u && t && t.nodeType == Node.TEXT_NODE && (jQuery(i).remove(), jQuery(k).remove(), b.html.normalizeSpaces(t), l = jQuery(b.doc.createTextNode("​")), jQuery(t).after(l), j.setStart(t, t.textContent.length), j.setEnd(t, t.textContent.length), n = !0)
            }
            if (!n) {
              var w, x;
              if (b.browser.chrome && i.nextSibling == k) w = m(k, j, !0) || j.setStartAfter(k), x = m(i, j, !1) || j.setEndBefore(i);
              else {
                i.previousSibling == k && (i = k, k = i.nextSibling), k.nextSibling && "BR" === k.nextSibling.tagName || !k.nextSibling && b.node.isBlock(i.previousSibling) || i.previousSibling && "BR" == i.previousSibling.tagName || (i.style.display = "inline", k.style.display = "inline", l = jQuery(b.doc.createTextNode("​")));
                var y = i.previousSibling;
                y && y.style && "block" == b.win.getComputedStyle(y).display ? (j.setEndAfter(y), j.setStartAfter(y)) : (w = m(i, j, !0) || jQuery(i).before(l) && j.setStartBefore(i), x = m(k, j, !1) || jQuery(k).after(l) && j.setEndAfter(k))
              }
              "function" == typeof w && w(), "function" == typeof x && x()
            }
          }
          catch (z) {}
        }
        l && l.remove(), g.addRange(j)
      }
      b.markers.remove()
    }

    function m(c, d, e) {
      var f = c.previousSibling,
        g = c.nextSibling;
      if (f && g && f.nodeType == Node.TEXT_NODE && g.nodeType == Node.TEXT_NODE) {
        var h = f.textContent.length;
        return e ? (g.textContent = f.textContent + g.textContent, jQuery(f).remove(), jQuery(c).remove(), b.html.normalizeSpaces(g), function () {
          d.setStart(g, h)
        }) : (f.textContent = f.textContent + g.textContent, jQuery(g).remove(), jQuery(c).remove(), b.html.normalizeSpaces(f), function () {
          d.setEnd(f, h)
        })
      }
      if (f && !g && f.nodeType == Node.TEXT_NODE) {
        var h = f.textContent.length;
        return e ? (b.html.normalizeSpaces(f), function () {
          d.setStart(f, h)
        }) : (b.html.normalizeSpaces(f), function () {
          d.setEnd(f, h)
        })
      }
      return g && !f && g.nodeType == Node.TEXT_NODE ? e ? (b.html.normalizeSpaces(g), function () {
        d.setStart(g, 0)
      }) : (b.html.normalizeSpaces(g), function () {
        d.setEnd(g, 0)
      }) : !1
    }

    function n() {
      return !0
    }

    function o() {
      for (var a = e(), b = 0; b < a.length; b++)
        if (!a[b].collapsed) return !1;
      return !0
    }

    function p(a) {
      var c, d, e = !1,
        f = !1;
      if (b.win.getSelection) {
        var g = b.win.getSelection();
        g.rangeCount && (c = g.getRangeAt(0), d = c.cloneRange(), d.selectNodeContents(a), d.setEnd(c.startContainer, c.startOffset), e = "" === d.toString(), d.selectNodeContents(a), d.setStart(c.endContainer, c.endOffset), f = "" === d.toString())
      }
      else b.doc.selection && "Control" != b.doc.selection.type && (c = b.doc.selection.createRange(), d = c.duplicate(), d.moveToElementText(a), d.setEndPoint("EndToStart", c), e = "" === d.text, d.moveToElementText(a), d.setEndPoint("StartToEnd", c), f = "" === d.text);
      return {
        atStart: e,
        atEnd: f
      }
    }

    function q() {
      if (o()) return !1;
      b.$el.find("td").prepend('<span class="fr-mk">' + jQuery.FE.INVISIBLE_SPACE + "</span>"), b.$el.find("img").append('<span class="fr-mk">' + jQuery.FE.INVISIBLE_SPACE + "</span>");
      var c = !1,
        d = p(b.$el.get(0));
      return d.atStart && d.atEnd && (c = !0), b.$el.find(".fr-mk").remove(), c
    }

    function r(c, d) {
      "undefined" == typeof d && (d = !0);
      var e = jQuery(c).html();
      e && e.replace(/\u200b/g, "").length != e.length && jQuery(c).html(e.replace(/\u200b/g, ""));
      for (var f = b.node.contents(c), g = 0; g < f.length; g++) f[g].nodeType != Node.ELEMENT_NODE ? jQuery(f[g]).remove() : (r(f[g], 0 == g), 0 == g && (d = !1));
      c.nodeType == Node.TEXT_NODE ? jQuery(c).replaceWith('<span data-first="true" data-text="true"></span>') : d && jQuery(c).attr("data-first", !0)
    }

    function s(c, d) {
      var e = b.node.contents(c.get(0));
      ["TD", "TH"].indexOf(c.get(0).tagName) >= 0 && 1 == c.find(".fr-marker").length && jQuery(e[0]).hasClass("fr-marker") && c.attr("data-del-cell", !0);
      for (var f = 0; f < e.length; f++) {
        var g = e[f];
        jQuery(g).hasClass("fr-marker") ? d = (d + 1) % 2 : d ? jQuery(g).find(".fr-marker").length > 0 ? d = s(jQuery(g), d) : ["TD", "TH"].indexOf(g.tagName) < 0 && !jQuery(g).hasClass("fr-inner") ? !b.opts.keepFormatOnDelete || d > 1 || b.$el.find("[data-first]").length > 0 ? jQuery(g).remove() : r(g) : jQuery(g).hasClass("fr-inner") ? 0 == jQuery(g).find(".fr-inner").length ? jQuery(g).html("<br>") : jQuery(g).find(".fr-inner").filter(function () {
          return 0 == jQuery(this).find("fr-inner").length
        }).html("<br>") : (jQuery(g).empty(), jQuery(g).attr("data-del-cell", !0)) : jQuery(g).find(".fr-marker").length > 0 && (d = s(jQuery(g), d))
      }
      return d
    }

    function t() {
      try {
        if (!b.$wp) return !1;
        for (var a = e(0), c = a.commonAncestorContainer; c && !b.node.isElement(c);) c = c.parentNode;
        return b.node.isElement(c) ? !0 : !1
      }
      catch (d) {
        return !1
      }
    }

    function u() {
      if (o()) return !0;
      k();
      for (var c = function (b) {
          for (var c = b.previousSibling; c && c.nodeType == Node.TEXT_NODE && 0 == c.textContent.length;) {
            var d = c,
              c = c.previousSibling;
            jQuery(d).remove()
          }
          return c
        }, d = function (b) {
          for (var c = b.nextSibling; c && c.nodeType == Node.TEXT_NODE && 0 == c.textContent.length;) {
            var d = c,
              c = c.nextSibling;
            jQuery(d).remove()
          }
          return c
        }, e = b.$el.find('.fr-marker[data-type="true"]'), f = 0; f < e.length; f++)
        for (var g = e[f]; !c(g) && !b.node.isBlock(g.parentNode) && !b.$el.is(i.parentNode);) jQuery(g.parentNode).before(g);
      for (var h = b.$el.find('.fr-marker[data-type="false"]'), f = 0; f < h.length; f++) {
        for (var i = h[f]; !d(i) && !b.node.isBlock(i.parentNode) && !b.$el.is(i.parentNode);) jQuery(i.parentNode).after(i);
        i.parentNode && b.node.isBlock(i.parentNode) && b.node.isEmpty(i.parentNode) && !b.$el.is(i.parentNode) && jQuery(i.parentNode).after(i)
      }
      if (n()) {
        s(b.$el, 0);
        var j = b.$el.find('[data-first="true"]');
        if (j.length) b.$el.find(".fr-marker").remove(), j.append(jQuery.FE.INVISIBLE_SPACE + jQuery.FE.MARKERS).removeAttr("data-first"), j.attr("data-text") && j.replaceWith(j.html());
        else {
          b.$el.find("table").filter(function () {
            var b = jQuery(this).find("[data-del-cell]").length > 0 && jQuery(this).find("[data-del-cell]").length == jQuery(this).find("td, th").length;
            return b
          }).remove(), b.$el.find("[data-del-cell]").removeAttr("data-del-cell");
          for (var e = b.$el.find('.fr-marker[data-type="true"]'), f = 0; f < e.length; f++) {
            var m = e[f],
              p = m.nextSibling,
              q = b.$el.find('.fr-marker[data-type="false"][data-id="' + jQuery(m).data("id") + '"]').get(0);
            if (q) {
              if (p && p == q);
              else if (m) {
                var r = b.node.blockParent(m),
                  t = b.node.blockParent(q);
                if (jQuery(m).after(q), r == t);
                else if (null == r) {
                  var u = b.node.deepestParent(m);
                  u ? (jQuery(u).after(jQuery(t).html()), jQuery(t).remove()) : 0 == jQuery(t).parentsUntil(b.$el, "table").length && (jQuery(m).next().after(jQuery(t).html()), jQuery(t).remove())
                }
                else if (null == t && 0 == jQuery(r).parentsUntil(b.$el, "table").length) {
                  for (var p = r; !p.nextSibling && p.parentNode != b.$el.get(0);) p = p.parentNode;
                  for (p = p.nextSibling; p && "BR" != p.tagName;) {
                    var v = p.nextSibling;
                    jQuery(r).append(p), p = v
                  }
                }
                else 0 == jQuery(r).parentsUntil(b.$el, "table").length && 0 == jQuery(t).parentsUntil(b.$el, "table").length && (jQuery(r).append(jQuery(t).html()), jQuery(t).remove())
              }
            }
            else q = jQuery(m).clone().attr("data-type", !1), jQuery(m).after(q)
          }
        }
      }
      b.opts.keepFormatOnDelete || b.html.fillEmptyBlocks(), b.html.cleanEmptyTags(!0), b.clean.lists(), b.html.normalizeSpaces(), l()
    }

    function v(c) {
      if (jQuery(c).find(".fr-marker").length > 0) return !1;
      for (var d = b.node.contents(c); d.length && b.node.isBlock(d[0]);) c = d[0], d = b.node.contents(c);
      jQuery(c).prepend(jQuery.FE.MARKERS)
    }

    function w(c) {
      if (jQuery(c).find(".fr-marker").length > 0) return !1;
      for (var d = b.node.contents(c); d.length && b.node.isBlock(d[d.length - 1]);) c = d[d.length - 1], d = b.node.contents(c);
      jQuery(c).append(jQuery.FE.MARKERS)
    }

    function x(c) {
      for (var d = c.previousSibling; d && d.nodeType == Node.TEXT_NODE && 0 == d.textContent.length;) d = d.previousSibling;
      return d ? (b.node.isBlock(d) ? w(d) : "BR" == d.tagName ? jQuery(d).before(jQuery.FE.MARKERS) : jQuery(d).after(jQuery.FE.MARKERS), !0) : !1
    }

    function y(c) {
      for (var d = c.nextSibling; d && d.nodeType == Node.TEXT_NODE && 0 == d.textContent.length;) d = d.nextSibling;
      return d ? (b.node.isBlock(d) ? v(d) : jQuery(d).before(jQuery.FE.MARKERS), !0) : !1
    }
    return {
      text: c,
      get: d,
      ranges: e,
      clear: f,
      element: g,
      endElement: h,
      save: k,
      restore: l,
      isCollapsed: o,
      isFull: q,
      inEditor: t,
      remove: u,
      blocks: j,
      info: p,
      setAtEnd: w,
      setAtStart: v,
      setBefore: x,
      setAfter: y,
      rangeElement: i
    }
  };
  
  jQuery.FE.UNICODE_NBSP = String.fromCharCode(160)

  jQuery.FE.VOID_ELEMENTS = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"], jQuery.FE.BLOCK_TAGS = ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "pre", "blockquote", "ul", "ol", "li", "table", "td", "th", "thead", "tfoot", "tbody", "tr", "hr", "dl", "dt", "dd", "form"], jQuery.extend(jQuery.FE.DEFAULTS, {
    htmlAllowedEmptyTags: ["textarea", "jQuery", "iframe", "object", "video", "style", "script", ".fa", ".fr-emoticon"],
    htmlDoNotWrapTags: ["script", "style"],
    htmlSimpleAmpersand: !1
  });
  jQuery.FE.MODULES.html = function (b) {
    function c() {
      return b.opts.enter == jQuery.FE.ENTER_P ? "p" : b.opts.enter == jQuery.FE.ENTER_DIV ? "div" : b.opts.enter == jQuery.FE.ENTER_BR ? null : void 0
    }

    function d() {
      for (var c = [], d = b.$el.get(0).querySelectorAll(f()), e = 0; e < d.length; e++)
        if (!(d[e].querySelectorAll(jQuery.FE.VOID_ELEMENTS.join(",")).length > 0 || d[e].querySelectorAll(b.opts.htmlAllowedEmptyTags.join(",")).length > 0 || d[e].querySelectorAll(f()).length > 0)) {
          for (var g = b.node.contents(d[e]), h = !1, i = 0; i < g.length; i++)
            if (g[i].nodeType != Node.COMMENT_NODE && g[i].textContent && g[i].textContent.replace(/\u200B/g, "").replace(/\n/g, "").length > 0) {
              h = !0;
              break
            }
          h || c.push(d[e])
        }
      return c
    }

    function e() {
      return jQuery.FE.BLOCK_TAGS.join(":empty, ") + ":empty"
    }

    function f() {
      return jQuery.FE.BLOCK_TAGS.join(", ")
    }

    function g(c) {
      var d = jQuery.merge([], jQuery.FE.VOID_ELEMENTS);
      d = jQuery.merge(d, b.opts.htmlAllowedEmptyTags), "undefined" == typeof c && (d = jQuery.merge(d, jQuery.FE.BLOCK_TAGS));
      var e, f;
      do {
        f = !1, e = b.$el.get(0).querySelectorAll("*:empty:not(" + d.join("):not(") + "):not(.fr-marker)");
        for (var g = 0; g < e.length; g++)(0 === e[g].attributes.length || "undefined" != typeof e[g].getAttribute("href")) && (jQuery(e[g]).remove(), f = !0);
        e = b.$el.get(0).querySelectorAll("*:empty:not(" + d.join("):not(") + "):not(.fr-marker)")
      } while (e.length && f)
    }

    function h(d, e) {
      var f = c();
      if (e && (f = 'div class="fr-temp-div"'), f)
        for (var g = b.node.contents(d.get(0)), h = null, i = 0; i < g.length; i++) {
          var j = g[i];
          if (j.nodeType == Node.ELEMENT_NODE && (b.node.isBlock(j) || jQuery(j).is(b.opts.htmlDoNotWrapTags.join(",")) && !jQuery(j).hasClass("fr-marker"))) h = null;
          else if (j.nodeType != Node.ELEMENT_NODE && j.nodeType != Node.TEXT_NODE) h = null;
          else if (j.nodeType == Node.ELEMENT_NODE && "BR" == j.tagName)
            if (null == h) e ? jQuery(j).replaceWith("<" + f + ' data-empty="true"><br></div>') : jQuery(j).replaceWith("<" + f + "><br></" + f + ">");
            else {
              jQuery(j).remove();
              for (var k = b.node.contents(h), l = !1, m = 0; m < k.length; m++)
                if (!jQuery(k[m]).hasClass("fr-marker") && (k[m].nodeType != Node.TEXT_NODE || 0 !== k[m].textContent.replace(/ /g, "").length)) {
                  l = !0;
                  break
                }
              l === !1 && (h.append("<br>"), h.data("empty", !0)), h = null
            }
          else j.nodeType == Node.TEXT_NODE && 0 == jQuery(j).text().trim().length ? jQuery(j).remove() : (null == h && (h = jQuery("<" + f + ">"), jQuery(j).before(h)), j.nodeType == Node.TEXT_NODE && jQuery(j).text().trim().length > 0 ? (h.append(jQuery(j).clone()), jQuery(j).remove()) : h.append(jQuery(j)))
        }
    }

    function i(c, d, e, f) {
      return b.$wp ? ("undefined" == typeof c && (c = !1), "undefined" == typeof d && (d = !1), "undefined" == typeof e && (e = !1), "undefined" == typeof f && (f = !1), h(b.$el, c), f && b.$el.find(".fr-inner").each(function () {
        h(jQuery(this), c)
      }), d && b.$el.find("td, th").each(function () {
        h(jQuery(this), c)
      }), void(e && b.$el.find("blockquote").each(function () {
        h(jQuery(this), c)
      }))) : !1
    }

    function j() {
      b.$el.find("div.fr-temp-div").each(function () {
        jQuery(this).data("empty") || "LI" == this.parentNode.tagName ? jQuery(this).replaceWith(jQuery(this).html()) : jQuery(this).replaceWith(jQuery(this).html() + "<br>")
      }), b.$el.find(".fr-temp-div").removeClass("fr-temp-div").filter(function () {
        return "" == jQuery(this).attr("class")
      }).removeAttr("class")
    }

    function k() {
      for (var a = d(), c = 0; c < a.length; c++) {
        var e = a[c];
        "false" == e.getAttribute("contenteditable") || 0 != e.querySelectorAll(b.opts.htmlAllowedEmptyTags.join(",")).length || b.node.isVoid(e) || "TABLE" != e.tagName && e.appendChild(b.doc.createElement("br"))
      }
    }

    function l() {
      return b.$el.find(f())
    }

    function m(a) {
      if ("undefined" == typeof a && (a = b.$el.get(0)), a && ["SCRIPT", "STYLE", "PRE"].indexOf(a.tagName) >= 0) return !1;
      for (var c = b.node.contents(a), d = c.length - 1; d >= 0; d--)
        if (c[d].nodeType == Node.TEXT_NODE) {
          c[d].textContent = c[d].textContent.replace(/(?!^)( ){2,}(?!$)/g, " "), c[d].textContent = c[d].textContent.replace(/\n/g, " "), c[d].textContent = c[d].textContent.replace(/^[ ]{2,}/g, " "), c[d].textContent = c[d].textContent.replace(/[ ]{2,}$/g, " "), (b.node.isBlock(a) || b.node.isElement(a)) && (c[d].previousSibling || (c[d].textContent = c[d].textContent.replace(/^ */, "")), c[d].nextSibling || (c[d].textContent = c[d].textContent.replace(/ *$/, "")), c[d].previousSibling && c[d].nextSibling && " " == c[d].textContent && (c[d].previousSibling && c[d].nextSibling && b.node.isBlock(c[d].previousSibling) && b.node.isBlock(c[d].nextSibling) ? c[d].textContent = "" : c[d].textContent = "\n"))
        }
        else m(c[d])
    }

    function n(a) {
      return a && (b.node.isBlock(a) || ["STYLE", "SCRIPT", "HEAD", "BR", "HR"].indexOf(a.tagName) >= 0 || a.nodeType == Node.COMMENT_NODE)
    }

    function o(c) {
      if ("undefined" == typeof c && (c = b.$el.get(0)), !c.getAttribute || "false" != c.getAttribute("contenteditable"))
        if (c.nodeType == Node.ELEMENT_NODE && ["STYLE", "SCRIPT", "HEAD"].indexOf(c.tagName) < 0)
          for (var d = b.node.contents(c), e = d.length - 1; e >= 0; e--)(d[e].tagName != Node.ELEMENT_NODE || (d[e].className || "").indexOf("fr-marker") < 0) && o(d[e]);
        else if (c.nodeType == Node.TEXT_NODE && c.textContent.length > 0) {
        var f = c.previousSibling,
          g = c.nextSibling;
        if (n(f) && n(g) && 0 === c.textContent.trim().length && b.opts.enter != jQuery.FE.ENTER_BR) jQuery(c).remove();
        else {
          var h = c.textContent;
          h = h.replace(new RegExp(jQuery.FE.UNICODE_NBSP, "g"), " ");
          for (var i = "", j = 0; j < h.length; j++) i += 32 != h.charCodeAt(j) || 0 !== j && 32 != i.charCodeAt(j - 1) ? h[j] : jQuery.FE.UNICODE_NBSP;
          c.nextSibling || (i = i.replace(/ $/, jQuery.FE.UNICODE_NBSP)), !c.previousSibling || b.node.isVoid(c.previousSibling) || b.node.isBlock(c.previousSibling) || (i = i.replace(/^\u00A0([^ $])/, " $1")), i = i.replace(/([^ \u00A0])\u00A0([^ \u00A0])/g, "$1 $2"), c.textContent != i && (c.textContent = i)
        }
      }
    }

    function p(c) {
      if ("undefined" == typeof c && (c = b.$el.get(0)), c.nodeType == Node.ELEMENT_NODE && ["STYLE", "SCRIPT", "HEAD"].indexOf(c.tagName) < 0) {
        for (var d = b.node.contents(c), e = d.length - 1; e >= 0; e--)
          if (!jQuery(d[e]).hasClass("fr-marker")) {
            var f = p(d[e]);
            if (1 == f) return !0
          }
      }
      else if (c.nodeType == Node.TEXT_NODE && c.textContent.length > 0) {
        var g = c.previousSibling,
          h = c.nextSibling;
        if (n(g) && n(h) && 0 === c.textContent.trim().length) return !0;
        var i = c.textContent;
        i = i.replace(new RegExp(jQuery.FE.UNICODE_NBSP, "g"), " ");
        for (var j = "", k = 0; k < i.length; k++) j += 32 != i.charCodeAt(k) || 0 !== k && 32 != j.charCodeAt(k - 1) ? i[k] : jQuery.FE.UNICODE_NBSP;
        if (c.nextSibling || (j = j.replace(/ $/, jQuery.FE.UNICODE_NBSP)), c.previousSibling && !b.node.isVoid(c.previousSibling) && (j = j.replace(/^\u00A0([^ $])/, " $1")), j = j.replace(/([^ \u00A0])\u00A0([^ \u00A0])/g, "$1 $2"), c.textContent != j) return !0
      }
      return !1
    }

    function q(a, b, c) {
      var d = new RegExp(b, "gi"),
        e = d.exec(a);
      return e ? e[c] : null
    }

    function r(a, b) {
      var c = a.match(/<!DOCTYPE ?([^ ]*) ?([^ ]*) ?"?([^"]*)"? ?"?([^"]*)"?>/i);
      return c ? b.implementation.createDocumentType(c[1], c[3], c[4]) : b.implementation.createDocumentType("html")
    }

    function s(a) {
      var b = a.doctype,
        c = "<!DOCTYPE html>";
      return b && (c = "<!DOCTYPE " + b.name + (b.publicId ? ' PUBLIC "' + b.publicId + '"' : "") + (!b.publicId && b.systemId ? " SYSTEM" : "") + (b.systemId ? ' "' + b.systemId + '"' : "") + ">"), c
    }

    function t() {
      i(), m(), g(), o(), k(), b.clean.quotes(), b.clean.lists(), b.clean.tables(), b.clean.toHTML5(), b.selection.restore(), u(), b.placeholder.refresh()
    }

    function u() {
      b.core.isEmpty() && (null != c() ? 0 === b.$el.get(0).querySelectorAll(f()).length && 0 === b.$el.get(0).querySelectorAll(b.opts.htmlDoNotWrapTags.join(",")).length && (b.core.hasFocus() ? (b.$el.html("<" + c() + ">" + jQuery.FE.MARKERS + "<br/></" + c() + ">"), b.selection.restore()) : b.$el.html("<" + c() + "><br/></" + c() + ">")) : 0 === b.$el.get(0).querySelectorAll("*:not(.fr-marker):not(br)").length && (b.core.hasFocus() ? (b.$el.html(jQuery.FE.MARKERS + "<br/>"), b.selection.restore()) : b.$el.html("<br/>")))
    }

    function v(a, b) {
      return q(a, "<" + b + "[^>]*?>([\\w\\W]*)</" + b + ">", 1)
    }

    function w(c, d) {
      var e = jQuery("<div " + (q(c, "<" + d + "([^>]*?)>", 1) || "") + ">");
      return b.node.rawAttributes(e.get(0))
    }

    function x(a) {
      return q(a, "<!DOCTYPE([^>]*?)>", 0) || "<!DOCTYPE html>"
    }

    function y(a) {
      var c = b.clean.html(a, [], [], b.opts.fullPage);
      if (b.opts.fullPage) {
        var d = v(c, "body") || (c.indexOf("<body") >= 0 ? "" : c),
          e = w(c, "body"),
          f = v(c, "head") || "<title></title>",
          g = w(c, "head"),
          h = x(c),
          i = w(c, "html");
        b.$el.html(d), b.node.clearAttributes(b.$el.get(0)), b.$el.attr(e), b.$head.html(f), b.node.clearAttributes(b.$head.get(0)), b.$head.attr(g), b.node.clearAttributes(b.$html.get(0)), b.$html.attr(i), b.iframe_document.doctype.parentNode.replaceChild(r(h, b.iframe_document), b.iframe_document.doctype)
      }
      else b.$el.html(c);
      var j = b.edit.isDisabled();
      b.edit.on(), b.core.injectStyle(b.opts.iframeStyle), t(), b.opts.useClasses || (b.$el.find("[fr-original-class]").each(function () {
        this.setAttribute("class", this.getAttribute("fr-original-class")), this.removeAttribute("fr-original-class")
      }), b.$el.find("[fr-original-style]").each(function () {
        this.setAttribute("style", this.getAttribute("fr-original-style")), this.removeAttribute("fr-original-style")
      })), j && b.edit.off(), b.events.trigger("html.set")
    }

    function z(a, c) {
      if (!b.$wp) return b.$oel.clone().removeClass("fr-view").removeAttr("contenteditable").get(0).outerHTML;
      var d = "";
      b.events.trigger("html.beforeGet");
      var e, f = function (a) {
          var b = /(#[^\s\+>~\.\[:]+)/g,
            c = /(\[[^\]]+\])/g,
            d = /(\.[^\s\+>~\.\[:]+)/g,
            e = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi,
            f = /(:[\w-]+\([^\)]*\))/gi,
            g = /(:[^\s\+>~\.\[:]+)/g,
            h = /([^\s\+>~\.\[:]+)/g;
          ! function () {
            var b = /:not\(([^\)]*)\)/g;
            b.test(a) && (a = a.replace(b, "     $1 "))
          }();
          var i = 100 * (a.match(b) || []).length + 10 * (a.match(c) || []).length + 10 * (a.match(d) || []).length + 10 * (a.match(f) || []).length + 10 * (a.match(g) || []).length + (a.match(e) || []).length;
          return a = a.replace(/[\*\s\+>~]/g, " "), a = a.replace(/[#\.]/g, " "), i += (a.match(h) || []).length
        },
        g = [],
        h = {};
      if (!b.opts.useClasses && !c) {
        for (e = 0; e < b.doc.styleSheets.length; e++) {
          var i, j = 0;
          try {
            i = b.doc.styleSheets[e].cssRules, b.doc.styleSheets[e].ownerNode && "STYLE" == b.doc.styleSheets[e].ownerNode.nodeType && (j = 1)
          }
          catch (k) {}
          if (i)
            for (var l = 0, m = i.length; m > l; l++) {
              var n = b.opts.iframe ? "body " : ".fr-view ";
              if (i[l].selectorText && 0 === i[l].selectorText.indexOf(n) && i[l].style.cssText.length > 0)
                for (var o = i[l].selectorText.replace(n, "").replace(/::/g, ":"), p = b.$el.get(0).querySelectorAll(o), q = 0; q < p.length; q++) {
                  !p[q].getAttribute("fr-original-style") && p[q].getAttribute("style") ? (p[q].setAttribute("fr-original-style", p[q].getAttribute("style")), g.push(p[q])) : p[q].getAttribute("fr-original-style") || g.push(p[q]), h[p[q]] || (h[p[q]] = {});
                  for (var r = 1e3 * j + f(i[l].selectorText), t = i[l].style.cssText.split(";"), u = 0; u < t.length; u++) {
                    var v = t[u].trim().split(":")[0];
                    h[p[q]][v] || (h[p[q]][v] = 0, (p[q].getAttribute("fr-original-style") || "").indexOf(v + ":") >= 0 && (h[p[q]][v] = 1e4)), r >= h[p[q]][v] && (h[p[q]][v] = r, t[u].trim().length && (p[q].style[v.trim()] = t[u].trim().split(":")[1]))
                  }
                }
            }
        }
        for (e = 0; e < g.length; e++) g[e].getAttribute("class") && (g[e].setAttribute("fr-original-class", g[e].getAttribute("class")), g[e].removeAttribute("class"))
      }
      if (b.core.isEmpty() ? b.opts.fullPage && (d = s(b.iframe_document), d += "<html" + b.node.attributes(b.$html.get(0)) + ">" + b.$html.find("head").get(0).outerHTML + "<body></body></html>") : ("undefined" == typeof a && (a = !1), b.opts.fullPage ? (d = s(b.iframe_document), d += "<html" + b.node.attributes(b.$html.get(0)) + ">" + b.$html.html() + "</html>") : d = b.$el.html()), !b.opts.useClasses && !c)
        for (e = 0; e < g.length; e++) g[e].getAttribute("fr-original-class") && (g[e].setAttribute("class", g[e].getAttribute("fr-original-class")), g[e].removeAttribute("fr-original-class")), g[e].getAttribute("fr-original-style") ? (g[e].setAttribute("style", g[e].getAttribute("fr-original-style")), g[e].removeAttribute("fr-original-style")) : g[e].removeAttribute("style");
      b.opts.fullPage && (d = d.replace(/<style data-fr-style="true">(?:[\w\W]*?)<\/style>/g, ""), d = d.replace(/<style(?:[\w\W]*?)class="firebugResetStyles"(?:[\w\W]*?)>(?:[\w\W]*?)<\/style>/g, ""), d = d.replace(/<body((?:[\w\W]*?)) spellcheck="true"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$2>$3</body>"), d = d.replace(/<body((?:[\w\W]*?)) contenteditable="(true|false)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$3>$4</body>"), d = d.replace(/<body((?:[\w\W]*?)) dir="([\w]*)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$3>$4</body>"), d = d.replace(/<body((?:[\w\W]*?))class="([\w\W]*?)(fr-rtl|fr-ltr)([\w\W]*?)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, '<body$1class="$2$4"$5>$6</body>'), d = d.replace(/<body((?:[\w\W]*?)) class=""((?:[\w\W]*?))>((?:[\w\W]*?))<\/body>/g, "<body$1$2>$3</body>")), b.opts.htmlSimpleAmpersand && (d = d.replace(/\&amp;/gi, "&")), b.events.trigger("html.afterGet"), a || (d = d.replace(/<span[^>]*? class\s*=\s*["']?fr-marker["']?[^>]+>\u200b<\/span>/gi, "")), d = b.clean.invisibleSpaces(d);
      var w = b.events.chainTrigger("html.get", d);
      return "string" == typeof w && (d = w), d = d.replace(/<pre(?:[\w\W]*?)>(?:[\w\W]*?)<\/pre>/g, function (a) {
        return a.replace(/<br>/g, "\n")
      })
    }

    function A() {
      var c = function (c, d) {
          for (; d && (d.nodeType == Node.TEXT_NODE || !b.node.isBlock(d));) d && d.nodeType != Node.TEXT_NODE && jQuery(c).wrapInner(b.node.openTagString(d) + b.node.closeTagString(d)), d = d.parentNode;
          d && c.innerHTML == d.innerHTML && (c.innerHTML = d.outerHTML)
        },
        d = function () {
          var c, d = null;
          return b.win.getSelection ? (c = b.win.getSelection(), c && c.rangeCount && (d = c.getRangeAt(0).commonAncestorContainer, d.nodeType != Node.ELEMENT_NODE && (d = d.parentNode))) : (c = b.doc.selection) && "Control" != c.type && (d = c.createRange().parentElement()), null != d && (jQuery.inArray(b.$el.get(0), jQuery(d).parents()) >= 0 || d == b.$el.get(0)) ? d : null
        },
        e = "";
      if ("undefined" != typeof b.win.getSelection) {
        b.browser.mozilla && (b.selection.save(), b.$el.find('.fr-marker[data-type="false"]').length > 1 && (b.$el.find('.fr-marker[data-type="false"][data-id="0"]').remove(), b.$el.find('.fr-marker[data-type="false"]:last').attr("data-id", "0"), b.$el.find(".fr-marker").not('[data-id="0"]').remove()), b.selection.restore());
        for (var f = b.selection.ranges(), g = 0; g < f.length; g++) {
          var h = document.createElement("div");
          h.appendChild(f[g].cloneContents()), c(h, d()), jQuery(h).find(".fr-element").length > 0 && (h = b.$el.get(0)), e += h.innerHTML
        }
      }
      else "undefined" != typeof b.doc.selection && "Text" == b.doc.selection.type && (e = b.doc.selection.createRange().htmlText);
      return e
    }

    function B(b) {
      var c = jQuery("<div>").html(b);
      return c.find(f()).length > 0
    }

    function C(a) {
      var c = b.doc.createElement("div");
      return c.innerHTML = a, b.selection.setAtEnd(c), c.innerHTML
    }

    function D(a) {
      return a.replace(/</gi, "&lt;").replace(/>/gi, "&gt;").replace(/"/gi, "&quot;").replace(/'/gi, "&apos;")
    }

    function E(c, d, e) {
      b.selection.isCollapsed() || b.selection.remove();
      var f;
      if (f = d ? c : b.clean.html(c), f = f.replace(/\r|\n/g, " "), c.indexOf('class="fr-marker"') < 0 && (f = C(f)), b.core.isEmpty()) b.$el.html(f);
      else {
        var g = b.markers.insert();
        if (!g) return !1;
        var h;
        if ((B(f) || e) && (h = b.node.deepestParent(g))) {
          var g = b.markers.split();
          if (!g) return !1;
          jQuery(g).replaceWith(f)
        }
        else jQuery(g).replaceWith(f)
      }
      t(), b.events.trigger("html.inserted")
    }

    function F(c) {
      var d = null;
      "undefined" == typeof c && (d = b.selection.element());
      var e, f;
      do {
        f = !1, e = b.$el.get(0).querySelectorAll("*:not(.fr-marker)");
        for (var g = 0; g < e.length; g++) {
          var h = e[g];
          if (d != h) {
            var i = h.textContent;
            0 === h.children.length && 1 === i.length && 8203 == i.charCodeAt(0) && (jQuery(h).remove(), f = !0)
          }
        }
      } while (f)
    }

    function G() {
      var a = function () {
        F(), b.placeholder && b.placeholder.refresh()
      };
      b.events.on("mouseup", a), b.events.on("keydown", a), b.events.on("contentChanged", u)
    }
    return {
      defaultTag: c,
      emptyBlocks: d,
      emptyBlockTagsQuery: e,
      blockTagsQuery: f,
      fillEmptyBlocks: k,
      cleanEmptyTags: g,
      cleanWhiteTags: F,
      normalizeSpaces: o,
      doNormalize: p,
      cleanBlankSpaces: m,
      blocks: l,
      getDoctype: s,
      set: y,
      get: z,
      getSelected: A,
      insert: E,
      wrap: i,
      unwrap: j,
      escapeEntities: D,
      checkIfEmpty: u,
      extractNode: v,
      extractNodeAttrs: w,
      extractDoctype: x,
      _init: G
    }
  };
  
  jQuery.extend(jQuery.FE.DEFAULTS, {
    height: null,
    heightMax: null,
    heightMin: null,
    width: null
  });

  jQuery.FE.MODULES.size = function (a) {
    function b() {
      a.opts.height && a.$el.css("minHeight", a.opts.height - a.helpers.getPX(a.$el.css("padding-top")) - a.helpers.getPX(a.$el.css("padding-bottom"))), a.$iframe.height(a.$el.outerHeight(!0))
    }

    function c() {
      a.opts.heightMin ? a.$el.css("minHeight", a.opts.heightMin) : a.$el.css("minHeight", ""), a.opts.heightMax ? (a.$wp.css("maxHeight", a.opts.heightMax), a.$wp.css("overflow", "auto")) : (a.$wp.css("maxHeight", ""), a.$wp.css("overflow", "")), a.opts.height ? (a.$wp.height(a.opts.height), a.$el.css("minHeight", a.opts.height - a.helpers.getPX(a.$el.css("padding-top")) - a.helpers.getPX(a.$el.css("padding-bottom"))), a.$wp.css("overflow", "auto")) : (a.$wp.css("height", ""), a.opts.heightMin || a.$el.css("minHeight", ""), a.opts.heightMax || a.$wp.css("overflow", "")), a.opts.width && a.$box.width(a.opts.width)
    }

    function d() {
      return a.$wp ? (c(), void(a.opts.iframe && (a.events.on("keyup", b), a.events.on("commands.after", b), a.events.on("html.set", b), a.events.on("init", b), a.events.on("initialized", b)))) : !1
    }
    return {
      _init: d,
      syncIframe: b,
      refresh: c
    }
  };

  jQuery.extend(jQuery.FE.DEFAULTS, {
    language: null
  });
  jQuery.FE.LANGUAGE = {};
  jQuery.FE.MODULES.language = function (b) {
    function c(a) {
      return e && e.translation[a] ? e.translation[a] : a
    }

    function d() {
      jQuery.FE.LANGUAGE && (e = jQuery.FE.LANGUAGE[b.opts.language]), e && e.direction && (b.opts.direction = e.direction)
    }
    var e;
    return {
      _init: d,
      translate: c
    }
  };
  jQuery.extend(jQuery.FE.DEFAULTS, {
    placeholderText: "Type something"
  });
  
  jQuery.FE.MODULES.placeholder = function (b) {
    function c() {
      b.$placeholder || g();
      var c = 0,
        d = b.node.contents(b.$el.get(0));
      d.length && d[0].nodeType == Node.ELEMENT_NODE ? (b.opts.toolbarInline || (c = b.helpers.getPX(jQuery(d[0]).css("margin-top"))), b.$placeholder.css("font-size", jQuery(d[0]).css("font-size")), b.$placeholder.css("line-height", jQuery(d[0]).css("line-height"))) : (b.$placeholder.css("font-size", b.$el.css("font-size")), b.$placeholder.css("line-height", b.$el.css("line-height"))), b.$wp.addClass("show-placeholder"), b.$placeholder.css("margin-top", Math.max(b.helpers.getPX(b.$el.css("margin-top")), c)).text(b.language.translate(b.opts.placeholderText || b.$oel.attr("placeholder") || ""))
    }

    function d() {
      b.$wp.removeClass("show-placeholder")
    }

    function e() {
      return b.$wp ? b.$wp.hasClass("show-placeholder") : !0
    }

    function f() {
      return b.$wp ? void(b.core.isEmpty() ? c() : d()) : !1
    }

    function g() {
      b.$placeholder = jQuery('<span class="fr-placeholder"></span>'), b.$wp.append(b.$placeholder)
    }

    function h() {
      return b.$wp ? void b.events.on("init input keydown keyup contentChanged", f) : !1
    }
    return {
      _init: h,
      show: c,
      hide: d,
      refresh: f,
      isVisible: e
    }
  };
  jQuery.FE.MODULES.edit = function (a) {
    function b() {
      if (a.browser.mozilla) try {
        a.doc.execCommand("enableObjectResizing", !1, "false"), a.doc.execCommand("enableInlineTableEditing", !1, "false")
      }
      catch (b) {}
    }

    function c() {
      a.$wp ? (a.$el.attr("contenteditable", !0), a.$el.removeClass("fr-disabled"), a.$tb && a.$tb.removeClass("fr-disabled"), b()) : a.$el.is("jQuery") && a.$el.attr("contenteditable", !0), f = !1
    }

    function d() {
      a.$wp ? (a.$el.attr("contenteditable", !1), a.$el.addClass("fr-disabled"), a.$tb && a.$tb.addClass("fr-disabled")) : a.$el.is("jQuery") && a.$el.attr("contenteditable", !1), f = !0
    }

    function e() {
      return f
    }
    var f = !1;
    return {
      on: c,
      off: d,
      disableDesign: b,
      isDisabled: e
    }
  };

  jQuery.extend(jQuery.FE.DEFAULTS, {
    editorClass: null,
    typingTimer: 500,
    iframe: !1,
    requestWithCORS: !0,
    requestHeaders: {},
    useClasses: !0,
    spellcheck: !0,
    iframeStyle: "html{margin: 0px;}body{padding:10px;background:transparent;color:#000000;position:relative;z-index: 2;-webkit-user-select:auto;margin:0px;overflow:hidden;}",
    direction: "auto",
    zIndex: 1,
    disableRightClick: !1,
    scrollableContainer: "body",
    keepFormatOnDelete: !1,
    theme: null
  });
  jQuery.FE.MODULES.core = function (b) {
    function c(a) {
      b.opts.iframe && b.$head.append('<style data-fr-style="true">' + a + "</style>")
    }

    function d() {
      b.opts.iframe || b.$el.addClass("fr-element fr-view")
    }

    function e() {
      if (b.$box.addClass("fr-box" + (b.opts.editorClass ? " " + b.opts.editorClass : "")), b.$wp.addClass("fr-wrapper"), d(), b.opts.iframe) {
        b.$iframe.addClass("fr-iframe");
        for (var a = 0; a < b.o_doc.styleSheets.length; a++) {
          var c;
          try {
            c = b.o_doc.styleSheets[a].cssRules
          }
          catch (e) {}
          if (c)
            for (var f = 0, g = c.length; g > f; f++) !c[f].selectorText || 0 !== c[f].selectorText.indexOf(".fr-view") && 0 !== c[f].selectorText.indexOf(".fr-element") || c[f].style.cssText.length > 0 && (0 === c[f].selectorText.indexOf(".fr-view") ? b.opts.iframeStyle += c[f].selectorText.replace(/\.fr-view/g, "body") + "{" + c[f].style.cssText + "}" : b.opts.iframeStyle += c[f].selectorText.replace(/\.fr-element/g, "body") + "{" + c[f].style.cssText + "}");
        }
      }
      "auto" != b.opts.direction && b.$box.removeClass("fr-ltr fr-rtl").addClass("fr-" + b.opts.direction), b.$el.attr("dir", b.opts.direction), b.$wp.attr("dir", b.opts.direction), b.opts.zIndex > 1 && b.$box.css("z-index", b.opts.zIndex), b.opts.theme && b.$box.addClass(b.opts.theme + "-theme")
    }

    function f() {
      return b.node.isEmpty(b.$el.get(0))
    }

    function g() {
      b.drag_support = {
        filereader: "undefined" != typeof FileReader,
        formdata: !!b.win.FormData,
        progress: "upload" in new XMLHttpRequest
      }
    }

    function h(a, c) {
      var d = new XMLHttpRequest;
      d.open(c, a, !0), b.opts.requestWithCORS && (d.withCredentials = !0);
      for (var e in b.opts.requestHeaders) b.opts.requestHeaders.hasOwnProperty(e) && d.setRequestHeader(e, b.opts.requestHeaders[e]);
      return d
    }

    function i() {
      "TEXTAREA" == b.$oel.get(0).tagName && b.$oel.val(b.html.get()), b.$wp && ("TEXTAREA" == b.$oel.get(0).tagName ? (b.$box.replaceWith(b.$oel), b.$oel.show()) : (b.$wp.replaceWith(b.html.get()), b.$box.removeClass("fr-view fr-ltr fr-box " + (b.opts.editorClass || "")), b.opts.theme && b.$box.addClass(b.opts.theme + "-theme")))
    }

    function j() {
      return b.browser.mozilla && b.helpers.isMobile() ? b.selection.inEditor() : b.node.hasFocus(b.$el.get(0)) || b.$el.find("*:focus").length > 0
    }

    function k(a) {
      if (!a) return !1;
      var c = a.data("instance");
      return c ? c.id == b.id : !1
    }

    function l() {
      if (jQuery.FE.INSTANCES.push(b), g(), b.$wp) {
        e(), b.html.set(b._original_html), b.$el.attr("spellcheck", b.opts.spellcheck), b.helpers.isMobile() && (b.$el.attr("autocomplete", b.opts.spellcheck ? "on" : "off"), b.$el.attr("autocorrect", b.opts.spellcheck ? "on" : "off"), b.$el.attr("autocapitalize", b.opts.spellcheck ? "on" : "off")), b.opts.disableRightClick && b.events.$on(b.$el, "contextmenu", function (a) {
          return 2 == a.button ? !1 : void 0
        });
        try {
          b.doc.execCommand("styleWithCSS", !1, !1)
        }
        catch (c) {}
      }
      b.events.on("drop", function (a) {
        a.preventDefault(), a.stopPropagation()
      }), b.events.on("destroy", i), "TEXTAREA" == b.$oel.get(0).tagName && (b.events.on("contentChanged", function () {
        b.$oel.val(b.html.get())
      }), b.events.on("form.submit", function () {
        b.$oel.val(b.html.get())
      }), b.events.on("form.reset", function () {
        b.html.set(b._original_html)
      }), b.$oel.val(b.html.get())), b.events.trigger("init")
    }
    return {
      _init: l,
      isEmpty: f,
      getXHR: h,
      injectStyle: c,
      hasFocus: j,
      sameInstance: k
    }
  };
  jQuery.FE.COMMANDS = {
    bold: {
      title: "Bold",
      refresh: function (a) {
        this.refresh["default"](a, "bold")
      }
    },
    italic: {
      title: "Italic",
      refresh: function (a) {
        this.refresh["default"](a, "italic")
      }
    },
    underline: {
      title: "Underline",
      refresh: function (a) {
        this.refresh["default"](a, "underline")
      }
    },
    strikeThrough: {
      title: "Strikethrough",
      refresh: function (a) {
        this.refresh["default"](a, "strikethrough")
      }
    },
    subscript: {
      title: "Subscript",
      refresh: function (a) {
        this.refresh["default"](a, "subscript")
      }
    },
    superscript: {
      title: "Superscript",
      refresh: function (a) {
        this.refresh["default"](a, "superscript")
      }
    },
    outdent: {
      title: "Decrease Indent"
    },
    indent: {
      title: "Increase Indent"
    },
    undo: {
      title: "Undo",
      undo: !1,
      forcedRefresh: !0,
      disabled: !0
    },
    redo: {
      title: "Redo",
      undo: !1,
      forcedRefresh: !0,
      disabled: !0
    },
    insertHR: {
      title: "Insert Horizontal Line"
    },
    clearFormatting: {
      title: "Clear Formatting"
    },
    selectAll: {
      title: "Select All",
      undo: !1
    }
  };
  jQuery.FE.RegisterCommand = function (b, c) {
    jQuery.FE.COMMANDS[b] = c
  };
  jQuery.FE.MODULES.commands = function (b) {
    function c(c, d) {
      if (b.events.trigger("commands.before", jQuery.merge([c], d || [])) !== !1) {
        var e = jQuery.FE.COMMANDS[c] && jQuery.FE.COMMANDS[c].callback || k[c],
          f = !0;
        jQuery.FE.COMMANDS[c] && "undefined" != typeof jQuery.FE.COMMANDS[c].focus && (f = jQuery.FE.COMMANDS[c].focus), b.core.hasFocus() || !f || b.popups.areVisible() || b.events.focus(!0), jQuery.FE.COMMANDS[c] && jQuery.FE.COMMANDS[c].undo !== !1 && b.undo.saveStep(), e && e.apply(b, jQuery.merge([c], d || [])), b.events.trigger("commands.after", jQuery.merge([c], d || [])), jQuery.FE.COMMANDS[c] && jQuery.FE.COMMANDS[c].undo !== !1 && b.undo.saveStep()
      }
    }

    function d(c, d) {
      if (b.selection.isCollapsed() && b.doc.queryCommandState(c) === !1) {
        b.markers.insert();
        var e = b.$el.find(".fr-marker");
        e.replaceWith("<" + d + ">" + jQuery.FE.INVISIBLE_SPACE + jQuery.FE.MARKERS + "</" + d + ">"), b.selection.restore()
      }
      else {
        var f = b.selection.element();
        if (b.selection.isCollapsed() && b.doc.queryCommandState(c) === !0 && f.tagName == d.toUpperCase() && 0 === (f.textContent || "").replace(/\u200B/g, "").length) jQuery(f).replaceWith(jQuery.FE.MARKERS), b.selection.restore();
        else {
          var g = b.$el.find("span"),
            h = !1;
          b.doc.queryCommandState(c) !== !1 || b.browser.chrome || (b.selection.save(), h = !0), b.browser.mozilla && b.$el.find(".fr-marker").css("display", "inline-block"), b.doc.execCommand(c, !1, !1), h && b.selection.restore();
          var i = b.$el.find("span[style]").not(g).filter(function () {
            return jQuery(this).attr("style").indexOf("font-weight: normal") >= 0
          });
          i.length && (b.selection.save(), i.each(function () {
            jQuery(this).replaceWith(jQuery(this).html())
          }), b.selection.restore()), b.clean.toHTML5()
        }
      }
    }

    function e(c) {
      b.selection.save(), b.html.wrap(!0, !0, !0, !0), b.selection.restore();
      for (var d = b.selection.blocks(), e = 0; e < d.length; e++)
        if ("LI" != d[e].tagName && "LI" != d[e].parentNode.tagName) {
          var f = jQuery(d[e]),
            g = "rtl" == b.opts.direction || "rtl" == f.css("direction") ? "margin-right" : "margin-left",
            h = b.helpers.getPX(f.css(g));
          f.css(g, Math.max(h + 20 * c, 0) || ""), f.removeClass("fr-temp-div")
        }
      b.selection.save(), b.html.unwrap(), b.selection.restore()
    }

    function f() {
      var c = function (a) {
        return a.attr("style").indexOf("font-size") >= 0
      };
      b.$el.find("[style]").each(function () {
        var b = jQuery(this);
        c(b) && (b.attr("data-font-size", b.css("font-size")), b.css("font-size", ""))
      })
    }

    function g() {
      b.$el.find("[data-font-size]").each(function () {
        var b = jQuery(this);
        b.css("font-size", b.attr("data-font-size")), b.removeAttr("data-font-size")
      })
    }

    function h() {
      b.$el.find("span").each(function () {
        "" === b.node.attributes(this) && jQuery(this).replaceWith(jQuery(this).html())
      })
    }

    function i(c, d) {
      if (b.selection.isCollapsed()) {
        b.markers.insert();
        var e = b.$el.find(".fr-marker");
        e.replaceWith('<span style="' + c + ": " + d + ';">' + jQuery.FE.INVISIBLE_SPACE + jQuery.FE.MARKERS + "</span>"), b.selection.restore()
      }
      else {
        f(), b.doc.execCommand("fontSize", !1, 4), b.selection.save(), g();
        for (var i, j = function (b) {
            var d = jQuery(b);
            d.css(c, ""), "" === d.attr("style") && d.replaceWith(d.html())
          }, k = function () {
            return 0 === jQuery(this).attr("style").indexOf(c + ":") || jQuery(this).attr("style").indexOf(";" + c + ":") >= 0 || jQuery(this).attr("style").indexOf("; " + c + ":") >= 0
          }; b.$el.find("font").length > 0;) {
          var l = b.$el.find("font:first"),
            m = jQuery('<span class="fr-just" style="' + c + ": " + d + ';">' + l.html() + "</span>");
          l.replaceWith(m);
          var n = m.find("span");
          for (i = n.length - 1; i >= 0; i--) j(n[i]);
          var o = m.parentsUntil(b.$el, "span[style]").filter(k);
          if (o.length) {
            var p = "",
              q = "",
              r = "",
              s = "",
              t = m.get(0);
            do t = t.parentNode, p += b.node.closeTagString(t), q = b.node.openTagString(t) + q, o.get(0) != t && (r += b.node.closeTagString(t), s = b.node.openTagString(t) + s); while (o.get(0) != t);
            var u = p + '<span class="fr-just" style="' + c + ": " + d + ';">' + s + m.html() + r + "</span>" + q;
            m.replaceWith('<span id="fr-break"></span>');
            var v = o.get(0).outerHTML;
            o.replaceWith(v.replace(/<span id="fr-break"><\/span>/g, u))
          }
        }
        b.html.cleanEmptyTags(), h();
        var w = b.$el.find(".fr-just + .fr-just");
        for (i = 0; i < w.length; i++) {
          var x = jQuery(w[i]);
          x.prepend(x.prev().html()), x.prev().remove()
        }
        b.$el.find(".fr-marker + .fr-just").each(function () {
          jQuery(this).prepend(jQuery(this).prev())
        }), b.$el.find(".fr-just + .fr-marker").each(function () {
          jQuery(this).append(jQuery(this).next())
        }), b.$el.find(".fr-just").removeAttr("class"), b.selection.restore()
      }
    }

    function j(a) {
      return function () {
        c(a)
      }
    }
    var k = {
        bold: function () {
          d("bold", "strong")
        },
        subscript: function () {
          d("subscript", "sub")
        },
        superscript: function () {
          d("superscript", "sup")
        },
        italic: function () {
          d("italic", "em")
        },
        strikeThrough: function () {
          d("strikeThrough", "s")
        },
        underline: function () {
          d("underline", "u")
        },
        undo: function () {
          b.undo.run()
        },
        redo: function () {
          b.undo.redo()
        },
        indent: function () {
          e(1)
        },
        outdent: function () {
          e(-1)
        },
        show: function () {
          b.opts.toolbarInline && b.toolbar.showInline(null, !0)
        },
        insertHR: function () {
          b.selection.remove(), b.html.insert('<hr id="fr-just">');
          var a = b.$el.find("hr#fr-just");
          a.removeAttr("id"), b.selection.setAfter(a.get(0)) || b.selection.setBefore(a.get(0)), b.selection.restore()
        },
        clearFormatting: function () {
          if (b.browser.msie || b.browser.edge) {
            var c = function (c) {
              b.commands.applyProperty(c, "#123456"), b.selection.save(), b.$el.find("span:not(.fr-marker)").each(function (d, e) {
                var f = jQuery(e),
                  g = f.css(c);
                ("#123456" === g || "#123456" === b.helpers.RGBToHex(g)) && f.replaceWith(f.html())
              }), b.selection.restore()
            };
            c("color"), c("background-color")
          }
          b.doc.execCommand("removeFormat", !1, !1), b.doc.execCommand("unlink", !1, !1)
        },
        selectAll: function () {
          b.doc.execCommand("selectAll", !1, !1)
        }
      },
      l = {};
    for (var m in k) k.hasOwnProperty(m) && (l[m] = j(m));
    return jQuery.extend(l, {
      exec: c,
      applyProperty: i
    })
  };
  jQuery.FE.MODULES.cursorLists = function (b) {
    function c(a) {
      for (var b = a;
        "LI" != b.tagName;) b = b.parentNode;
      return b
    }

    function d(a) {
      for (var c = a; !b.node.isList(c);) c = c.parentNode;
      return c
    }

    function e(e) {
      var f, g = c(e),
        h = g.nextSibling,
        i = g.previousSibling,
        j = b.html.defaultTag();
      if (b.node.isEmpty(g, !0) && h) {
        for (var k = "", l = "", m = e.parentNode; !b.node.isList(m) && m.parentNode && "LI" !== m.parentNode.tagName;) k = b.node.openTagString(m) + k, l += b.node.closeTagString(m), m = m.parentNode;
        k = b.node.openTagString(m) + k, l += b.node.closeTagString(m);
        var n = "";
        for (n = m.parentNode && "LI" == m.parentNode.tagName ? l + "<li>" + jQuery.FE.MARKERS + "<br>" + k : j ? l + "<" + j + ">" + jQuery.FE.MARKERS + "<br></" + j + ">" + k : l + jQuery.FE.MARKERS + "<br>" + k, jQuery(g).html('<span id="fr-break"></span>');
          ["UL", "OL"].indexOf(m.tagName) < 0 || m.parentNode && "LI" === m.parentNode.tagName;) m = m.parentNode;
        var o = b.node.openTagString(m) + jQuery(m).html() + b.node.closeTagString(m);
        o = o.replace(/<span id="fr-break"><\/span>/g, n), jQuery(m).replaceWith(o), b.$el.find("li:empty").remove()
      }
      else i && h || !b.node.isEmpty(g, !0) ? (jQuery(g).before("<li><br></li>"), jQuery(e).remove()) : i ? (f = d(g), f.parentNode && "LI" == f.parentNode.tagName ? jQuery(f.parentNode).after("<li>" + jQuery.FE.MARKERS + "<br></li>") : j ? jQuery(f).after("<" + j + ">" + jQuery.FE.MARKERS + "<br></" + j + ">") : jQuery(f).after(jQuery.FE.MARKERS + "<br>"), jQuery(g).remove()) : (f = d(g), f.parentNode && "LI" == f.parentNode.tagName ? jQuery(f.parentNode).before("<li>" + jQuery.FE.MARKERS + "<br></li>") : j ? jQuery(f).before("<" + j + ">" + jQuery.FE.MARKERS + "<br></" + j + ">") : jQuery(f).before(jQuery.FE.MARKERS + "<br>"), jQuery(g).remove())
    }

    function f(d) {
      for (var e = c(d), f = "", g = d, h = "", i = ""; g != e;) {
        g = g.parentNode;
        var j = "A" == g.tagName && b.cursor.isAtEnd(d, g) ? "fr-to-remove" : "";
        h = b.node.openTagString(jQuery(g).clone().addClass(j).get(0)) + h, i = b.node.closeTagString(g) + i
      }
      f = i + f + h + jQuery.FE.MARKERS, jQuery(d).replaceWith('<span id="fr-break"></span>');
      var k = b.node.openTagString(e) + jQuery(e).html() + b.node.closeTagString(e);
      k = k.replace(/<span id="fr-break"><\/span>/g, f), jQuery(e).replaceWith(k)
    }

    function g(d) {
      for (var e = c(d), f = jQuery.FE.MARKERS, g = d; g != e;) {
        g = g.parentNode;
        var h = "A" == g.tagName && b.cursor.isAtEnd(d, g) ? "fr-to-remove" : "";
        f = b.node.openTagString(jQuery(g).clone().addClass(h).get(0)) + f + b.node.closeTagString(g)
      }
      jQuery(d).remove(), jQuery(e).after(f)
    }

    function h(e) {
      var f = c(e),
        g = f.previousSibling;
      if (g) {
        g = jQuery(g).find(b.html.blockTagsQuery()).get(-1) || g, jQuery(e).replaceWith(jQuery.FE.MARKERS);
        var h = b.node.contents(g);
        h.length && "BR" == h[h.length - 1].tagName && jQuery(h[h.length - 1]).remove(), jQuery(f).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function () {
          this.parentNode == f && jQuery(this).replaceWith(jQuery(this).html() + (b.node.isEmpty(this) ? "" : "<br>"))
        });
        for (var i, j = b.node.contents(f)[0]; j && !b.node.isList(j);) i = j.nextSibling, jQuery(g).append(j), j = i;
        for (g = f.previousSibling; j;) i = j.nextSibling, jQuery(g).append(j), j = i;
        jQuery(f).remove()
      }
      else {
        var k = d(f);
        if (jQuery(e).replaceWith(jQuery.FE.MARKERS), k.parentNode && "LI" == k.parentNode.tagName) {
          var l = k.previousSibling;
          b.node.isBlock(l) ? (jQuery(f).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function () {
            this.parentNode == f && jQuery(this).replaceWith(jQuery(this).html() + (b.node.isEmpty(this) ? "" : "<br>"))
          }), jQuery(l).append(jQuery(f).html())) : jQuery(k).before(jQuery(f).html())
        }
        else {
          var m = b.html.defaultTag();
          m && 0 === jQuery(f).find(b.html.blockTagsQuery()).length ? jQuery(k).before("<" + m + ">" + jQuery(f).html() + "</" + m + ">") : jQuery(k).before(jQuery(f).html())
        }
        jQuery(f).remove(), 0 === jQuery(k).find("li").length && jQuery(k).remove()
      }
    }

    function i(d) {
      var e, f = c(d),
        g = f.nextSibling;
      if (g) {
        e = b.node.contents(g), e.length && "BR" == e[0].tagName && jQuery(e[0]).remove(), jQuery(g).find(b.html.blockTagsQuery()).not("ol, ul, table").each(function () {
          this.parentNode == g && jQuery(this).replaceWith(jQuery(this).html() + (b.node.isEmpty(this) ? "" : "<br>"))
        });
        for (var h, i = d, j = b.node.contents(g)[0]; j && !b.node.isList(j);) h = j.nextSibling, jQuery(i).after(j), i = j, j = h;
        for (; j;) h = j.nextSibling, jQuery(f).append(j), j = h;
        jQuery(d).replaceWith(jQuery.FE.MARKERS), jQuery(g).remove()
      }
      else {
        for (var k = f; !k.nextSibling && k != b.$el.get(0);) k = k.parentNode;
        if (k == b.$el.get(0)) return !1;
        if (k = k.nextSibling, b.node.isBlock(k)) jQuery.FE.NO_DELETE_TAGS.indexOf(k.tagName) < 0 && (jQuery(d).replaceWith(jQuery.FE.MARKERS), e = b.node.contents(f), e.length && "BR" == e[e.length - 1].tagName && jQuery(e[e.length - 1]).remove(), jQuery(f).append(jQuery(k).html()), jQuery(k).remove());
        else
          for (e = b.node.contents(f), e.length && "BR" == e[e.length - 1].tagName && jQuery(e[e.length - 1]).remove(), jQuery(d).replaceWith(jQuery.FE.MARKERS); k && !b.node.isBlock(k) && "BR" != k.tagName;) jQuery(f).append(jQuery(k)), k = k.nextSibling
      }
    }
    return {
      _startEnter: e,
      _middleEnter: f,
      _endEnter: g,
      _backspace: h,
      _del: i
    }
  };
  jQuery.FE.NO_DELETE_TAGS = ["TH", "TD", "TABLE", "FORM"];
  jQuery.FE.SIMPLE_ENTER_TAGS = ["TH", "TD", "LI", "DL", "DT", "FORM"];
  jQuery.FE.MODULES.cursor = function (b) {
    function c(a) {
      return a ? b.node.isBlock(a) ? !0 : a.nextSibling ? !1 : c(a.parentNode) : !1
    }

    function d(a) {
      return a ? b.node.isBlock(a) ? !0 : a.previousSibling ? !1 : d(a.parentNode) : !1
    }

    function e(a, c) {
      return a ? a == b.$wp.get(0) ? !1 : a.previousSibling ? !1 : a.parentNode == c ? !0 : e(a.parentNode, c) : !1
    }

    function f(a, c) {
      return a ? a == b.$wp.get(0) ? !1 : a.nextSibling ? !1 : a.parentNode == c ? !0 : f(a.parentNode, c) : !1
    }

    function g(c) {
      return jQuery(c).parentsUntil(b.$el, "LI").length > 0 && 0 === jQuery(c).parentsUntil("LI", "TABLE").length
    }

    function h(c) {
      var d = jQuery(c).parentsUntil(b.$el, "BLOCKQUOTE").length > 0,
        e = b.node.deepestParent(c, [], !d);
      if (e && "BLOCKQUOTE" == e.tagName) {
        var f = b.node.deepestParent(c, [jQuery(c).parentsUntil(b.$el, "BLOCKQUOTE").get(0)]);
        f && f.previousSibling && (e = f)
      }
      if (null !== e) {
        var g, h = e.previousSibling;
        if (b.node.isBlock(e) && b.node.isEditable(e) && h && jQuery.FE.NO_DELETE_TAGS.indexOf(h.tagName) < 0 && b.node.isEditable(h))
          if (b.node.isBlock(h))
            if (b.node.isEmpty(h) && !b.node.isList(h)) jQuery(h).remove();
            else {
              if (b.node.isList(h) && (h = jQuery(h).find("li:last").get(0)), g = b.node.contents(h), g.length && "BR" == g[g.length - 1].tagName && jQuery(g[g.length - 1]).remove(), "BLOCKQUOTE" == h.tagName && "BLOCKQUOTE" != e.tagName)
                for (g = b.node.contents(h); g.length && b.node.isBlock(g[g.length - 1]);) h = g[g.length - 1], g = b.node.contents(h);
              else if ("BLOCKQUOTE" != h.tagName && "BLOCKQUOTE" == e.tagName)
                for (g = b.node.contents(e); g.length && b.node.isBlock(g[0]);) e = g[0], g = b.node.contents(e);
              jQuery(c).replaceWith(jQuery.FE.MARKERS), jQuery(h).append(b.node.isEmpty(e) ? jQuery.FE.MARKERS : e.innerHTML), jQuery(e).remove()
            }
        else jQuery(c).replaceWith(jQuery.FE.MARKERS), "BLOCKQUOTE" == e.tagName && h.nodeType == Node.ELEMENT_NODE ? jQuery(h).remove() : (jQuery(h).after(b.node.isEmpty(e) ? "" : jQuery(e).html()), jQuery(e).remove(), "BR" == h.tagName && jQuery(h).remove())
      }
    }

    function i(c) {
      for (var d = c; !d.previousSibling;) d = d.parentNode;
      d = d.previousSibling;
      var e;
      if (!b.node.isBlock(d) && b.node.isEditable(d)) {
        for (e = b.node.contents(d); d.nodeType != Node.TEXT_NODE && e.length && b.node.isEditable(d);) d = e[e.length - 1], e = b.node.contents(d);
        if (d.nodeType == Node.TEXT_NODE) {
          if (b.helpers.isIOS()) return !0;
          jQuery(d).after(jQuery.FE.MARKERS);
          var f = d.textContent,
            g = f.length - 1;
          if (b.opts.tabSpaces && f.length >= b.opts.tabSpaces) {
            var h = f.substr(f.length - b.opts.tabSpaces, f.length - 1);
            0 == h.replace(/ /g, "").replace(new RegExp(jQuery.FE.UNICODE_NBSP, "g"), "").length && (g = f.length - b.opts.tabSpaces)
          }
          d.textContent = f.substring(0, g), d.textContent.length && 55357 == d.textContent.charCodeAt(d.textContent.length - 1) && (d.textContent = d.textContent.substr(0, d.textContent.length - 1)), 0 == d.textContent.length && d.parentNode.removeChild(d)
        }
        else b.events.trigger("node.remove", [jQuery(d)]) !== !1 && (jQuery(d).after(jQuery.FE.MARKERS), jQuery(d).remove())
      }
      else if (jQuery.FE.NO_DELETE_TAGS.indexOf(d.tagName) < 0 && b.node.isEditable(d))
        if (b.node.isEmpty(d) && !b.node.isList(d)) jQuery(d).remove(), jQuery(c).replaceWith(jQuery.FE.MARKERS);
        else {
          for (b.node.isList(d) && (d = jQuery(d).find("li:last").get(0)), e = b.node.contents(d), e && "BR" == e[e.length - 1].tagName && jQuery(e[e.length - 1]).remove(), e = b.node.contents(d); e && b.node.isBlock(e[e.length - 1]);) d = e[e.length - 1], e = b.node.contents(d);
          jQuery(d).append(jQuery.FE.MARKERS);
          for (var i = c; !i.previousSibling;) i = i.parentNode;
          for (; i && "BR" !== i.tagName && !b.node.isBlock(i);) {
            var j = i;
            i = i.nextSibling, jQuery(d).append(j)
          }
          i && "BR" == i.tagName && jQuery(i).remove(), jQuery(c).remove()
        }
    }

    function j() {
      var f = !1,
        j = b.markers.insert();
      if (!j) return !0;
      b.$el.get(0).normalize();
      var k = j.previousSibling;
      if (k) {
        var l = k.textContent;
        l && l.length && 8203 == l.charCodeAt(l.length - 1) && (1 == l.length ? jQuery(k).remove() : (k.textContent = k.textContent.substr(0, l.length - 1), k.textContent.length && 55357 == k.textContent.charCodeAt(k.textContent.length - 1) && (k.textContent = k.textContent.substr(0, k.textContent.length - 1))))
      }
      return c(j) ? f = i(j) : d(j) ? g(j) && e(j, jQuery(j).parents("li:first").get(0)) ? b.cursorLists._backspace(j) : h(j) : f = i(j), jQuery(j).remove(), b.$el.find("blockquote:empty").remove(), b.html.fillEmptyBlocks(), b.html.cleanEmptyTags(), b.clean.quotes(), b.clean.lists(), b.html.normalizeSpaces(), b.selection.restore(), f
    }

    function k(c) {
      var d = jQuery(c).parentsUntil(b.$el, "BLOCKQUOTE").length > 0,
        e = b.node.deepestParent(c, [], !d);
      if (e && "BLOCKQUOTE" == e.tagName) {
        var f = b.node.deepestParent(c, [jQuery(c).parentsUntil(b.$el, "BLOCKQUOTE").get(0)]);
        f && f.nextSibling && (e = f)
      }
      if (null !== e) {
        var g, h = e.nextSibling;
        if (b.node.isBlock(e) && b.node.isEditable(e) && h && jQuery.FE.NO_DELETE_TAGS.indexOf(h.tagName) < 0)
          if (b.node.isBlock(h) && b.node.isEditable(h))
            if (b.node.isList(h))
              if (b.node.isEmpty(e, !0)) jQuery(e).remove(), jQuery(h).find("li:first").prepend(jQuery.FE.MARKERS);
              else {
                var i = jQuery(h).find("li:first");
                "BLOCKQUOTE" == e.tagName && (g = b.node.contents(e), g.length && b.node.isBlock(g[g.length - 1]) && (e = g[g.length - 1])), 0 === i.find("ul, ol").length && (jQuery(c).replaceWith(jQuery.FE.MARKERS), i.find(b.html.blockTagsQuery()).not("ol, ul, table").each(function () {
                  this.parentNode == i.get(0) && jQuery(this).replaceWith(jQuery(this).html() + (b.node.isEmpty(this) ? "" : "<br>"))
                }), jQuery(e).append(b.node.contents(i.get(0))), i.remove(), 0 === jQuery(h).find("li").length && jQuery(h).remove())
              }
        else {
          if (g = b.node.contents(h), g.length && "BR" == g[0].tagName && jQuery(g[0]).remove(), "BLOCKQUOTE" != h.tagName && "BLOCKQUOTE" == e.tagName)
            for (g = b.node.contents(e); g.length && b.node.isBlock(g[g.length - 1]);) e = g[g.length - 1], g = b.node.contents(e);
          else if ("BLOCKQUOTE" == h.tagName && "BLOCKQUOTE" != e.tagName)
            for (g = b.node.contents(h); g.length && b.node.isBlock(g[0]);) h = g[0], g = b.node.contents(h);
          jQuery(c).replaceWith(jQuery.FE.MARKERS), jQuery(e).append(h.innerHTML), jQuery(h).remove()
        }
        else {
          for (jQuery(c).replaceWith(jQuery.FE.MARKERS); h && "BR" !== h.tagName && !b.node.isBlock(h) && b.node.isEditable(h);) {
            var j = h;
            h = h.nextSibling, jQuery(e).append(j)
          }
          h && "BR" == h.tagName && b.node.isEditable(h) && jQuery(h).remove()
        }
      }
    }

    function l(d) {
      for (var e = d; !e.nextSibling;) e = e.parentNode;
      if (e = e.nextSibling, "BR" == e.tagName && b.node.isEditable(e))
        if (e.nextSibling) {
          if (b.node.isBlock(e.nextSibling) && b.node.isEditable(e.nextSibling)) {
            if (!(jQuery.FE.NO_DELETE_TAGS.indexOf(e.nextSibling.tagName) < 0)) return;
            e = e.nextSibling, jQuery(e.previousSibling).remove()
          }
        }
        else if (c(e)) {
        if (g(d)) b.cursorLists._del(d);
        else {
          var f = b.node.deepestParent(e);
          f && (jQuery(e).remove(), k(d))
        }
        return
      }
      var h;
      if (!b.node.isBlock(e) && b.node.isEditable(e)) {
        for (h = b.node.contents(e); e.nodeType != Node.TEXT_NODE && h.length && b.node.isEditable(e);) e = h[0], h = b.node.contents(e);
        e.nodeType == Node.TEXT_NODE ? (jQuery(e).before(jQuery.FE.MARKERS), e.textContent.length && 55357 == e.textContent.charCodeAt(0) ? e.textContent = e.textContent.substring(2, e.textContent.length) : e.textContent = e.textContent.substring(1, e.textContent.length)) : b.events.trigger("node.remove", [jQuery(e)]) !== !1 && (jQuery(e).before(jQuery.FE.MARKERS), jQuery(e).remove()), jQuery(d).remove()
      }
      else if (jQuery.FE.NO_DELETE_TAGS.indexOf(e.tagName) < 0)
        if (b.node.isList(e)) d.previousSibling ? (jQuery(e).find("li:first").prepend(d), b.cursorLists._backspace(d)) : (jQuery(e).find("li:first").prepend(jQuery.FE.MARKERS), jQuery(d).remove());
        else if (h = b.node.contents(e), h && "BR" == h[0].tagName && jQuery(h[0]).remove(), h && "BLOCKQUOTE" == e.tagName) {
        var i = h[0];
        for (jQuery(d).before(jQuery.FE.MARKERS); i && "BR" != i.tagName;) {
          var j = i;
          i = i.nextSibling, jQuery(d).before(j)
        }
        i && "BR" == i.tagName && jQuery(i).remove()
      }
      else jQuery(d).after(jQuery(e).html()).after(jQuery.FE.MARKERS), jQuery(e).remove()
    }

    function m() {
      var e = b.markers.insert();
      if (!e) return !1;
      if (b.$el.get(0).normalize(), c(e))
        if (g(e))
          if (0 === jQuery(e).parents("li:first").find("ul, ol").length) b.cursorLists._del(e);
          else {
            var f = jQuery(e).parents("li:first").find("ul:first, ol:first").find("li:first");
            f = f.find(b.html.blockTagsQuery()).get(-1) || f, f.prepend(e), b.cursorLists._backspace(e)
          }
      else k(e);
      else l(d(e) ? e : e);
      jQuery(e).remove(), b.$el.find("blockquote:empty").remove(), b.html.fillEmptyBlocks(), b.html.cleanEmptyTags(), b.clean.quotes(), b.clean.lists(), b.html.normalizeSpaces(), b.selection.restore()
    }

    function n() {
      b.$el.find(".fr-to-remove").each(function () {
        for (var c = b.node.contents(this), d = 0; d < c.length; d++) c[d].nodeType == Node.TEXT_NODE && (c[d].textContent = c[d].textContent.replace(/\u200B/g, ""));
        jQuery(this).replaceWith(this.innerHTML)
      })
    }

    function o(c, d, e) {
      var g, h = b.node.deepestParent(c, [], !e);
      if (h && "BLOCKQUOTE" == h.tagName) return f(c, h) ? (g = b.html.defaultTag(), g ? jQuery(h).after("<" + g + ">" + jQuery.FE.MARKERS + "<br></" + g + ">") : jQuery(h).after(jQuery.FE.MARKERS + "<br>"), jQuery(c).remove(), !1) : (q(c, d, e), !1);
      if (null == h) jQuery(c).replaceWith("<br/>" + jQuery.FE.MARKERS + "<br/>");
      else {
        var i = c,
          j = "";
        (!b.node.isBlock(h) || d) && (j = "<br/>");
        var k = "",
          l = "";
        g = b.html.defaultTag();
        var m = "",
          n = "";
        g && b.node.isBlock(h) && (m = "<" + g + ">", n = "</" + g + ">", h.tagName == g.toUpperCase() && (m = b.node.openTagString(jQuery(h).clone().removeAttr("id").get(0))));
        do
          if (i = i.parentNode, !d || i != h || d && !b.node.isBlock(h))
            if (k += b.node.closeTagString(i), i == h && b.node.isBlock(h)) l = m + l;
            else {
              var o = "A" == i.tagName && f(c, i) ? "fr-to-remove" : "";
              l = b.node.openTagString(jQuery(i).clone().addClass(o).get(0)) + l
            }
        while (i != h);
        j = k + j + l + (c.parentNode == h && b.node.isBlock(h) ? "" : jQuery.FE.INVISIBLE_SPACE) + jQuery.FE.MARKERS, b.node.isBlock(h) && !jQuery(h).find("*:last").is("br") && jQuery(h).append("<br/>"), jQuery(c).after('<span id="fr-break"></span>'), jQuery(c).remove(), h.nextSibling && !b.node.isBlock(h.nextSibling) || b.node.isBlock(h) || jQuery(h).after("<br>");
        var p;
        p = !d && b.node.isBlock(h) ? b.node.openTagString(h) + jQuery(h).html() + n : b.node.openTagString(h) + jQuery(h).html() + b.node.closeTagString(h), p = p.replace(/<span id="fr-break"><\/span>/g, j), jQuery(h).replaceWith(p)
      }
    }

    function p(c, d, g) {
      var h = b.node.deepestParent(c, [], !g);
      if (h && "BLOCKQUOTE" == h.tagName) {
        if (e(c, h)) {
          var i = b.html.defaultTag();
          return i ? jQuery(h).before("<" + i + ">" + jQuery.FE.MARKERS + "<br></" + i + ">") : jQuery(h).before(jQuery.FE.MARKERS + "<br>"), jQuery(c).remove(), !1
        }
        f(c, h) ? o(c, d, !0) : q(c, d, !0)
      }
      if (null == h) jQuery(c).replaceWith("<br>" + jQuery.FE.MARKERS);
      else {
        if (b.node.isBlock(h))
          if (d) jQuery(c).remove(), jQuery(h).prepend("<br>" + jQuery.FE.MARKERS);
          else {
            if (b.node.isEmpty(h, !0)) return o(c, d, g);
            jQuery(h).before(b.node.openTagString(jQuery(h).clone().removeAttr("id").get(0)) + "<br>" + b.node.closeTagString(h))
          }
        else jQuery(h).before("<br>");
        jQuery(c).remove()
      }
    }

    function q(c, d, g) {
      var h = b.node.deepestParent(c, [], !g);
      if (null == h) b.html.defaultTag() && c.parentNode === b.$el.get(0) ? jQuery(c).replaceWith("<" + b.html.defaultTag() + ">" + jQuery.FE.MARKERS + "<br></" + b.html.defaultTag() + ">") : ((!c.nextSibling || b.node.isBlock(c.nextSibling)) && jQuery(c).after("<br>"), jQuery(c).replaceWith("<br>" + jQuery.FE.MARKERS));
      else {
        var i = c,
          j = "";
        "PRE" == h.tagName && (d = !0), (!b.node.isBlock(h) || d) && (j = "<br>");
        var k = "",
          l = "";
        do {
          var m = i;
          if (i = i.parentNode, "BLOCKQUOTE" == h.tagName && b.node.isEmpty(m) && !jQuery(m).hasClass("fr-marker") && jQuery(m).find(c).length > 0 && jQuery(m).after(c), ("BLOCKQUOTE" != h.tagName || !f(c, i) && !e(c, i)) && (!d || i != h || d && !b.node.isBlock(h))) {
            k += b.node.closeTagString(i);
            var n = "A" == i.tagName && f(c, i) ? "fr-to-remove" : "";
            l = b.node.openTagString(jQuery(i).clone().addClass(n).removeAttr("id").get(0)) + l
          }
        } while (i != h);
        var o = h == c.parentNode && b.node.isBlock(h) || c.nextSibling;
        if ("BLOCKQUOTE" == h.tagName) {
          c.previousSibling && b.node.isBlock(c.previousSibling) && c.nextSibling && "BR" == c.nextSibling.tagName && (jQuery(c.nextSibling).after(c), c.nextSibling && "BR" == c.nextSibling.tagName && jQuery(c.nextSibling).remove());
          var p = b.html.defaultTag();
          j = k + j + (p ? "<" + p + ">" : "") + jQuery.FE.MARKERS + "<br>" + (p ? "</" + p + ">" : "") + l
        }
        else j = k + j + l + (o ? "" : jQuery.FE.INVISIBLE_SPACE) + jQuery.FE.MARKERS;
        jQuery(c).replaceWith('<span id="fr-break"></span>');
        var q = b.node.openTagString(h) + jQuery(h).html() + b.node.closeTagString(h);
        q = q.replace(/<span id="fr-break"><\/span>/g, j), jQuery(h).replaceWith(q)
      }
    }

    function r(e) {
      var f = b.markers.insert();
      if (!f) return !0;
      b.$el.get(0).normalize();
      var h = !1;
      jQuery(f).parentsUntil(b.$el, "BLOCKQUOTE").length > 0 && (e = !1, h = !0), jQuery(f).parentsUntil(b.$el, "TD, TH").length && (h = !1), c(f) ? !g(f) || e || h ? o(f, e, h) : b.cursorLists._endEnter(f) : d(f) ? !g(f) || e || h ? p(f, e, h) : b.cursorLists._startEnter(f) : !g(f) || e || h ? q(f, e, h) : b.cursorLists._middleEnter(f), n(), b.html.fillEmptyBlocks(), b.html.cleanEmptyTags(), b.clean.lists(), b.html.normalizeSpaces(), b.selection.restore()
    }
    return {
      enter: r,
      backspace: j,
      del: m,
      isAtEnd: f
    }
  };
  jQuery.FE.MODULES.data = function (a) {
    function b(a) {
      return a
    }

    function c(a) {
      if (!a) return a;
      for (var c = "", f = b("charCodeAt"), g = b("fromCharCode"), h = l.indexOf(a[0]), i = 1; i < a.length - 2; i++) {
        for (var j = d(++h), k = a[f](i), m = "";
          /[0-9-]/.test(a[i + 1]);) m += a[++i];
        m = parseInt(m, 10) || 0, k = e(k, j, m), k ^= h - 1 & 31, c += String[g](k)
      }
      return c
    }

    function d(a) {
      for (var b = a.toString(), c = 0, d = 0; d < b.length; d++) c += parseInt(b.charAt(d), 10);
      return c > 10 ? c % 9 + 1 : c
    }

    function e(a, b, c) {
      for (var d = Math.abs(c); d-- > 0;) a -= b;
      return 0 > c && (a += 123), a
    }

    function f(a) {
      return a && "none" == a.css("display") ? (a.remove(), !0) : !1
    }

    function g() {
      return f(j) || f(k)
    }

    function h() {
      return true
      // return jQuery.$box ? (jQuery.$box.append(n(b(n("kTDD4spmKD1klaMB1C7A5RA1G3RA10YA5qhrjuvnmE1D3FD2bcG-7noHE6B2JB4C3xXA8WF6F-10RG2C3G3B-21zZE3C3H3xCA16NC4DC1f1hOF1MB3B-21whzQH5UA2WB10kc1C2F4D3XC2YD4D1C4F3GF2eJ2lfcD-13HF1IE1TC11TC7WE4TA4d1A2YA6XA4d1A3yCG2qmB-13GF4A1B1KH1HD2fzfbeQC3TD9VE4wd1H2A20A2B-22ujB3nBG2A13jBC10D3C2HD5D1H1KB11uD-16uWF2D4A3F-7C9D-17c1E4D4B3d1D2CA6B2B-13qlwzJF2NC2C-13E-11ND1A3xqUA8UE6bsrrF-7C-22ia1D2CF2H1E2akCD2OE1HH1dlKA6PA5jcyfzB-22cXB4f1C3qvdiC4gjGG2H2gklC3D-16wJC1UG4dgaWE2D5G4g1I2H3B7vkqrxH1H2EC9C3E4gdgzKF1OA1A5PF5C4WWC3VA6XA4e1E3YA2YA5HE4oGH4F2H2IB10D3D2NC5G1B1qWA9PD6PG5fQA13A10XA4C4A3e1H2BA17kC-22cmOB1lmoA2fyhcptwWA3RA8A-13xB-11nf1I3f1B7GB3aD3pavFC10D5gLF2OG1LSB2D9E7fQC1F4F3wpSB5XD3NkklhhaE-11naKA9BnIA6D1F5bQA3A10c1QC6Kjkvitc2B6BE3AF3E2DA6A4JD2IC1jgA-64MB11D6C4==")))), j = jQuery.$box.find("> div:last"), k = j.find("> jQuery"), void("rtl" == jQuery.opts.direction && j.css("left", "auto").css("right", 0))) : !1
    }

    function i() {
      var c = a.opts.key || [""];
      "string" == typeof c && (c = [c]), a.ul = !0;
      for (var d = 0; d < c.length; d++) {
        var e = n(c[d]) || "";
        if (!(e !== n(b(n("mcVRDoB1BGILD7YFe1BTXBA7B6=="))) && e.indexOf(m, e.length - m.length) < 0 && [n("9qqG-7amjlwq=="), n("KA3B3C2A6D1D5H5H1A3==")].indexOf(m) < 0)) {
          a.ul = !1;
          break
        }
      }
      a.ul === !0 && h(), a.events.on("contentChanged", function () {
        a.ul === !0 && g() && h()
      }), a.events.on("destroy", function () {
        j && j.length && j.remove()
      }, !0)
    }
    var j, k, l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      m = function () {
        for (var a = 0, b = document.domain, c = b.split("."), d = "_gd" + (new Date).getTime(); a < c.length - 1 && -1 == document.cookie.indexOf(d + "=" + d);) b = c.slice(-1 - ++a).join("."), document.cookie = d + "=" + d + ";domain=" + b + ";";
        return document.cookie = d + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=" + b + ";", b
      }(),
      n = b(c);
    return {
      _init: i
    }
  };
  jQuery.FE.ENTER_P = 0;
  jQuery.FE.ENTER_DIV = 1;
  jQuery.FE.ENTER_BR = 2;
  jQuery.FE.KEYCODE = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    DELETE: 46,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    FF_SEMICOLON: 59,
    FF_EQUALS: 61,
    QUESTION_MARK: 63,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    META: 91,
    NUM_ZERO: 96,
    NUM_ONE: 97,
    NUM_TWO: 98,
    NUM_THREE: 99,
    NUM_FOUR: 100,
    NUM_FIVE: 101,
    NUM_SIX: 102,
    NUM_SEVEN: 103,
    NUM_EIGHT: 104,
    NUM_NINE: 105,
    NUM_MULTIPLY: 106,
    NUM_PLUS: 107,
    NUM_MINUS: 109,
    NUM_PERIOD: 110,
    NUM_DIVISION: 111,
    SEMICOLON: 186,
    DASH: 189,
    EQUALS: 187,
    COMMA: 188,
    PERIOD: 190,
    SLASH: 191,
    APOSTROPHE: 192,
    TILDE: 192,
    SINGLE_QUOTE: 222,
    OPEN_SQUARE_BRACKET: 219,
    BACKSLASH: 220,
    CLOSE_SQUARE_BRACKET: 221
  };
  jQuery.extend(jQuery.FE.DEFAULTS, {
    enter: jQuery.FE.ENTER_P,
    multiLine: !0,
    tabSpaces: 0
  });
  jQuery.FE.MODULES.keys = function (b) {
    function c() {
      if (b.helpers.isIOS()) {
        var c = navigator.userAgent.match("CriOS"),
          d = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
        if (!c && !d) {
          var e = jQuery(b.o_win).scrollTop();
          b.events.disableBlur(), b.selection.save(), b.$el.blur(), b.selection.restore(), b.events.enableBlur(), jQuery(b.o_win).scrollTop(e)
        }
      }
    }

    function d(a) {
      a.preventDefault(), a.stopPropagation(), b.opts.multiLine && (b.selection.isCollapsed() || b.selection.remove(), b.cursor.enter()), c()
    }

    function e(a) {
      a.preventDefault(), a.stopPropagation(), b.opts.multiLine && (b.selection.isCollapsed() || b.selection.remove(), b.cursor.enter(!0))
    }

    function f(a) {
      b.selection.isCollapsed() ? b.cursor.backspace() || (a.preventDefault(), a.stopPropagation(), x = !1) : (a.preventDefault(), a.stopPropagation(), b.selection.remove(), b.html.fillEmptyBlocks(), x = !1), b.placeholder.refresh()
    }

    function g(a) {
      a.preventDefault(), a.stopPropagation(), "" === b.selection.text() ? b.cursor.del() : b.selection.remove(), b.placeholder.refresh()
    }

    function h(c) {
      if (b.browser.mozilla) {
        c.preventDefault(), c.stopPropagation(), b.selection.isCollapsed() || b.selection.remove(), b.markers.insert();
        var d = b.$el.find(".fr-marker").get(0),
          e = d.previousSibling,
          f = d.nextSibling;
        !f && d.parentNode && "A" == d.parentNode.tagName ? (jQuery(d).parent().after("&nbsp;" + jQuery.FE.MARKERS), jQuery(d).remove()) : (e && e.nodeType == Node.TEXT_NODE && 1 == e.textContent.length && 160 == e.textContent.charCodeAt(0) ? jQuery(e).after(" ") : jQuery(d).before("&nbsp;"), jQuery(d).replaceWith(jQuery.FE.MARKERS)), b.selection.restore()
      }
    }

    function i() {
      if (b.browser.mozilla && b.selection.isCollapsed() && !A) {
        var a = b.selection.ranges(0),
          c = a.startContainer,
          d = a.startOffset;
        c && c.nodeType == Node.TEXT_NODE && d <= c.textContent.length && d > 0 && 32 == c.textContent.charCodeAt(d - 1) && (b.selection.save(), b.html.normalizeSpaces(), b.selection.restore())
      }
    }

    function j() {
      b.selection.isFull() && setTimeout(function () {
        var c = b.html.defaultTag();
        c ? b.$el.html("<" + c + ">" + jQuery.FE.MARKERS + "<br/></" + c + ">") : b.$el.html(jQuery.FE.MARKERS + "<br/>"), b.selection.restore(), b.placeholder.refresh(), b.button.bulkRefresh(), b.undo.saveStep()
      }, 0)
    }

    function k(a) {
      if (b.opts.tabSpaces > 0)
        if (b.selection.isCollapsed()) {
          a.preventDefault(), a.stopPropagation();
          for (var c = "", d = 0; d < b.opts.tabSpaces; d++) c += "&nbsp;";
          b.html.insert(c), b.placeholder.refresh()
        }
        else a.preventDefault(), a.stopPropagation(), a.shiftKey ? b.commands.outdent() : b.commands.indent()
    }

    function l(a) {
      A = !1
    }

    function m() {
      return A
    }

    function n(c) {
      b.events.disableBlur(), x = !0;
      var i = c.which;
      if (16 === i) return !0;
      if (229 === i) return A = !0, !0;
      A = !1;
      var j = s(i) && !r(c),
        l = i == jQuery.FE.KEYCODE.BACKSPACE || i == jQuery.FE.KEYCODE.DELETE;
      if (b.selection.isFull() && !b.opts.keepFormatOnDelete || l && b.placeholder.isVisible() && b.opts.keepFormatOnDelete) {
        if (j || l) {
          var m = b.html.defaultTag();
          m ? b.$el.html("<" + m + ">" + jQuery.FE.MARKERS + "<br/></" + m + ">") : b.$el.html(jQuery.FE.MARKERS + "<br/>")
        }
        b.selection.restore()
      }
      i == jQuery.FE.KEYCODE.ENTER ? c.shiftKey ? e(c) : d(c) : i != jQuery.FE.KEYCODE.BACKSPACE || r(c) || c.altKey ? i != jQuery.FE.KEYCODE.DELETE || r(c) || c.altKey ? i == jQuery.FE.KEYCODE.SPACE ? h(c) : i == jQuery.FE.KEYCODE.TAB ? k(c) : r(c) || !s(c.which) || b.selection.isCollapsed() || b.selection.remove() : g(c) : f(c), b.events.enableBlur()
    }

    function o(c) {
      for (var d = 0; d < c.length; d++) c[d].nodeType == Node.TEXT_NODE && /\u200B/gi.test(c[d].textContent) ? (c[d].textContent = c[d].textContent.replace(/\u200B/gi, ""), 0 === c[d].textContent.length && jQuery(c[d]).remove()) : c[d].nodeType == Node.ELEMENT_NODE && "IFRAME" != c[d].nodeType && o(b.node.contents(c[d]))
    }

    function p() {
      if (!b.$wp) return !0;
      var c;
      b.opts.height || b.opts.heightMax ? (c = b.position.getBoundingRect().top, b.helpers.isIOS() && (c -= jQuery(b.o_win).scrollTop()), b.opts.iframe && (c += b.$iframe.offset().top), c > b.$wp.offset().top - jQuery(b.o_win).scrollTop() + b.$wp.height() - 20 && b.$wp.scrollTop(c + b.$wp.scrollTop() - (b.$wp.height() + b.$wp.offset().top) + jQuery(b.o_win).scrollTop() + 20)) : (c = b.position.getBoundingRect().top, b.helpers.isIOS() && (c -= jQuery(b.o_win).scrollTop()), b.opts.iframe && (c += b.$iframe.offset().top), c > b.o_win.innerHeight - 20 && jQuery(b.o_win).scrollTop(c + jQuery(b.o_win).scrollTop() - b.o_win.innerHeight + 20), c = b.position.getBoundingRect().top, b.helpers.isIOS() && (c -= jQuery(b.o_win).scrollTop()), b.opts.iframe && (c += b.$iframe.offset().top), c < b.$tb.height() + 20 && jQuery(b.o_win).scrollTop(c + jQuery(b.o_win).scrollTop() - b.$tb.height() - 20))
    }

    function q(c) {
      if (A) return !1;
      if (!b.selection.isCollapsed()) return !0;
      !c || c.which != jQuery.FE.KEYCODE.ENTER && c.which != jQuery.FE.KEYCODE.BACKSPACE || c.which == jQuery.FE.KEYCODE.BACKSPACE && x || p();
      var d = b.$el.find(b.html.blockTagsQuery());
      d.push(b.$el.get(0));
      for (var e = [], f = 0; f < d.length; f++)
        if (["TD", "TH"].indexOf(d[f].tagName) < 0)
          for (var g = d[f].children, h = 0; h < g.length; h++) "BR" == g[h].tagName && e.push(g[h]);
      for (var f = 0; f < e.length; f++) {
        var i = e[f],
          j = i.previousSibling,
          k = i.nextSibling,
          l = b.node.blockParent(i) || b.$el.get(0);
        j && l && "BR" != j.tagName && !b.node.isBlock(j) && !k && jQuery(l).text().replace(/\u200B/g, "").length > 0 && jQuery(j).text().length > 0 && (b.selection.save(),
          jQuery(i).remove(), b.selection.restore())
      }
      var m = function (b) {
          if (!b) return !1;
          var c = jQuery(b).html();
          return c = c.replace(/<span[^>]*? class\s*=\s*["']?fr-marker["']?[^>]+>\u200b<\/span>/gi, ""), c && /\u200B/.test(c) && c.replace(/\u200B/gi, "").length > 0 ? !0 : !1
        },
        n = function (a) {
          var c = /[\u3041-\u3096\u30A0-\u30FF\u4E00-\u9FFF\u3130-\u318F\uAC00-\uD7AF]/gi;
          return !b.helpers.isIOS() || 0 === ((a.textContent || "").match(c) || []).length
        },
        q = b.selection.element();
      m(q) && 0 === jQuery(q).find("li").length && !jQuery(q).hasClass("fr-marker") && "IFRAME" != q.tagName && n(q) && (b.selection.save(), o(b.node.contents(q)), b.selection.restore()), !b.browser.mozilla && b.html.doNormalize() && (b.selection.save(), b.html.normalizeSpaces(), b.selection.restore())
    }

    function r(a) {
      if (-1 != navigator.userAgent.indexOf("Mac OS X")) {
        if (a.metaKey && !a.altKey) return !0
      }
      else if (a.ctrlKey && !a.altKey) return !0;
      return !1
    }

    function s(c) {
      if (c >= jQuery.FE.KEYCODE.ZERO && c <= jQuery.FE.KEYCODE.NINE) return !0;
      if (c >= jQuery.FE.KEYCODE.NUM_ZERO && c <= jQuery.FE.KEYCODE.NUM_MULTIPLY) return !0;
      if (c >= jQuery.FE.KEYCODE.A && c <= jQuery.FE.KEYCODE.Z) return !0;
      if (b.browser.webkit && 0 === c) return !0;
      switch (c) {
      case jQuery.FE.KEYCODE.SPACE:
      case jQuery.FE.KEYCODE.QUESTION_MARK:
      case jQuery.FE.KEYCODE.NUM_PLUS:
      case jQuery.FE.KEYCODE.NUM_MINUS:
      case jQuery.FE.KEYCODE.NUM_PERIOD:
      case jQuery.FE.KEYCODE.NUM_DIVISION:
      case jQuery.FE.KEYCODE.SEMICOLON:
      case jQuery.FE.KEYCODE.FF_SEMICOLON:
      case jQuery.FE.KEYCODE.DASH:
      case jQuery.FE.KEYCODE.EQUALS:
      case jQuery.FE.KEYCODE.FF_EQUALS:
      case jQuery.FE.KEYCODE.COMMA:
      case jQuery.FE.KEYCODE.PERIOD:
      case jQuery.FE.KEYCODE.SLASH:
      case jQuery.FE.KEYCODE.APOSTROPHE:
      case jQuery.FE.KEYCODE.SINGLE_QUOTE:
      case jQuery.FE.KEYCODE.OPEN_SQUARE_BRACKET:
      case jQuery.FE.KEYCODE.BACKSLASH:
      case jQuery.FE.KEYCODE.CLOSE_SQUARE_BRACKET:
        return !0;
      default:
        return !1
      }
    }

    function t(a) {
      var c = a.which;
      return r(a) || c >= 37 && 40 >= c ? !0 : (y || (z = b.snapshot.get()), clearTimeout(y), void(y = setTimeout(function () {
        y = null, b.undo.saveStep()
      }, Math.max(250, b.opts.typingTimer))))
    }

    function u(a) {
      return r(a) ? !0 : void(z && y && (b.undo.saveStep(z), z = null))
    }

    function v() {
      y && (clearTimeout(y), b.undo.saveStep(), z = null)
    }

    function w() {
      if (b.events.on("keydown", t), b.events.on("input", i), b.events.on("keyup", u), b.events.on("keypress", l), b.events.on("keydown", n), b.events.on("keyup", q), b.events.on("html.inserted", q), b.events.on("cut", j), b.$el.get(0).msGetInputContext) try {
        b.$el.get(0).msGetInputContext().addEventListener("MSCandidateWindowShow", function () {
          A = !0
        }), b.$el.get(0).msGetInputContext().addEventListener("MSCandidateWindowHide", function () {
          A = !1, q()
        })
      }
      catch (a) {}
    }
    var x, y, z, A = !1;
    return {
      _init: w,
      ctrlKey: r,
      isCharacter: s,
      forceUndo: v,
      isIME: m
    }
  };
  jQuery.extend(jQuery.FE.DEFAULTS, {
    pastePlain: !1,
    pasteDeniedTags: ["colgroup", "col"],
    pasteDeniedAttrs: ["class", "id", "style"],
    pasteAllowLocalImages: !1
  });
  jQuery.FE.MODULES.paste = function (b) {
    function c(c) {
      jQuery.FE.copied_html = b.html.getSelected(), jQuery.FE.copied_text = jQuery("<div>").html(jQuery.FE.copied_html).text(), "cut" == c.type && (b.undo.saveStep(), setTimeout(function () {
        b.html.wrap(), b.events.focus(), b.undo.saveStep()
      }, 0))
    }

    function d(a) {
      if (o) return !1;
      if (a.originalEvent && (a = a.originalEvent), b.events.trigger("paste.before", [a]) === !1) return !1;
      if (l = b.$win.scrollTop(), a && a.clipboardData && a.clipboardData.getData) {
        var c = "",
          d = a.clipboardData.types;
        if (b.helpers.isArray(d))
          for (var f = 0; f < d.length; f++) c += d[f] + ";";
        else c = d;
        if (m = "", /text\/html/.test(c) ? m = a.clipboardData.getData("text/html") : /text\/rtf/.test(c) && b.browser.safari ? m = a.clipboardData.getData("text/rtf") : /text\/plain/.test(c) && !this.browser.mozilla && (m = b.html.escapeEntities(a.clipboardData.getData("text/plain")).replace(/\n/g, "<br>")), "" !== m) return h(), a.preventDefault && (a.stopPropagation(), a.preventDefault()), !1;
        m = null
      }
      e()
    }

    function e() {
      b.selection.save(), b.events.disableBlur(), m = null, n ? n.html("") : (n = jQuery('<div contenteditable="true" style="position: fixed; top: 0; left: -9999px; height: 100%; width: 0; z-index: 9999; line-height: 140%;" tabindex="-1"></div>'), b.$box.after(n)), n.focus(), b.win.setTimeout(h, 1)
    }

    function f(c) {
      c = c.replace(/<p(.*?)class="?'?MsoListParagraph"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ul><li>$3</li></ul>"), c = c.replace(/<p(.*?)class="?'?NumberedText"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ol><li>$3</li></ol>"), c = c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ul><li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?NumberedTextCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<ol><li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?NumberedTextCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?MsoListBullet"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li>"), c = c.replace(/<p(.*?)class="?'?MsoListParagraphCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li></ul>"), c = c.replace(/<p(.*?)class="?'?NumberedTextCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi, "<li$3>$5</li></ol>"), c = c.replace(/<span([^<]*?)style="?'?mso-list:Ignore"?'?([\s\S]*?)>([\s\S]*?)<span/gi, "<span><span"), c = c.replace(/<!--\[if \!supportLists\]-->([\s\S]*?)<!--\[endif\]-->/gi, ""), c = c.replace(/<!\[if \!supportLists\]>([\s\S]*?)<!\[endif\]>/gi, ""), c = c.replace(/(\n|\r| class=(")?Mso[a-zA-Z0-9]+(")?)/gi, " "), c = c.replace(/<!--[\s\S]*?-->/gi, ""), c = c.replace(/<(\/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>/gi, "");
      for (var d = ["style", "script", "applet", "embed", "noframes", "noscript"], e = 0; e < d.length; e++) {
        var f = new RegExp("<" + d[e] + ".*?" + d[e] + "(.*?)>", "gi");
        c = c.replace(f, "")
      }
      c = c.replace(/&nbsp;/gi, " "), c = c.replace(/<td([^>]*)><\/td>/g, "<td$1><br></td>"), c = c.replace(/<th([^>]*)><\/th>/g, "<th$1><br></th>");
      var g;
      do g = c, c = c.replace(/<[^\/>][^>]*><\/[^>]+>/gi, ""); while (c != g);
      c = c.replace(/<lilevel([^1])([^>]*)>/gi, '<li data-indent="true"$2>'), c = c.replace(/<lilevel1([^>]*)>/gi, "<li$1>"), c = b.clean.html(c, b.opts.pasteDeniedTags, b.opts.pasteDeniedAttrs), c = c.replace(/<a>(.[^<]+)<\/a>/gi, "$1");
      var h = jQuery("<div>").html(c);
      return h.find("li[data-indent]").each(function (b, c) {
        var d = jQuery(c);
        if (d.prev("li").length > 0) {
          var e = d.prev("li").find("> ul, > ol");
          0 === e.length && (e = jQuery("ul"), d.prev("li").append(e)), e.append(c)
        }
        else d.removeAttr("data-indent")
      }), b.html.cleanBlankSpaces(h.get(0)), c = h.html()
    }

    function g(c) {
      var d = jQuery("<div>").html(c);
      d.find("p, div, h1, h2, h3, h4, h5, h6, pre, blockquote").each(function (c, d) {
        jQuery(d).replaceWith("<" + (b.html.defaultTag() || "DIV") + ">" + jQuery(d).html() + "</" + (b.html.defaultTag() || "DIV") + ">")
      }), jQuery(d.find("*").not("p, div, h1, h2, h3, h4, h5, h6, pre, blockquote, ul, ol, li, table, tbody, thead, tr, td, br, img").get().reverse()).each(function () {
        jQuery(this).replaceWith(jQuery(this).html())
      });
      var e = function (c) {
        for (var d = b.node.contents(c), f = 0; f < d.length; f++) 3 != d[f].nodeType && 1 != d[f].nodeType ? jQuery(d[f]).remove() : e(d[f])
      };
      return e(d.get(0)), d.html()
    }

    function h() {
      b.keys.forceUndo();
      var c = b.snapshot.get();
      null === m && (m = n.html(), b.selection.restore(), b.events.enableBlur());
      var d = b.events.chainTrigger("paste.beforeCleanup", m);
      if ("string" == typeof d && (m = d), m.indexOf("<body") >= 0 && (m = m.replace(/[.\s\S\w\W<>]*<body[^>]*>([.\s\S\w\W<>]*)<\/body>[.\s\S\w\W<>]*/g, "$1")), m.indexOf('id="docs-internal-guid') >= 0 && (m = m.replace(/^.* id="docs-internal-guid[^>]*>(.*)<\/b>.*$/, "$1")), m.match(/(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/gi) ? (m = m.replace(/^\n*/g, "").replace(/^ /g, ""), 0 === m.indexOf("<colgroup>") && (m = "<table>" + m + "</table>"), m = f(m), m = j(m)) : (b.opts.htmlAllowComments = !1, m = b.clean.html(m, b.opts.pasteDeniedTags, b.opts.pasteDeniedAttrs), b.opts.htmlAllowComments = !0, m = j(m), m = m.replace(/\r|\n|\t/g, ""), jQuery.FE.copied_text && jQuery("<div>").html(m).text().replace(/(\u00A0)/gi, " ").replace(/\r|\n/gi, "") == jQuery.FE.copied_text.replace(/(\u00A0)/gi, " ").replace(/\r|\n/gi, "") && (m = jQuery.FE.copied_html), m = m.replace(/^ */g, "").replace(/ *$/g, "")), b.opts.pastePlain && (m = g(m)), d = b.events.chainTrigger("paste.afterCleanup", m), "string" == typeof d && (m = d), "" !== m) {
        var e = jQuery("<div>").html(m);
        b.html.normalizeSpaces(e.get(0)), e.find("span").each(function () {
          0 == this.attributes.length && jQuery(this).replaceWith(this.innerHTML)
        }), e.find("br").each(function () {
          this.previousSibling && b.node.isBlock(this.previousSibling) && jQuery(this).remove()
        }), m = e.html(), b.html.insert(m, !0)
      }
      i(), b.undo.saveStep(c), b.undo.saveStep()
    }

    function i() {
      b.events.trigger("paste.after")
    }

    function j(b) {
      for (var c, d = jQuery("<div>").html(b), e = d.find("*:empty:not(br, img, td, th)"); e.length;) {
        for (c = 0; c < e.length; c++) jQuery(e[c]).remove();
        e = d.find("*:empty:not(br, img, td, th)")
      }
      for (var f = d.find("> div:not([style]), td > div, th > div, li > div"); f.length;) {
        var g = jQuery(f[f.length - 1]);
        g.replaceWith(g.html() + "<br>"), f = d.find("> div:not([style]), td > div, th > div, li > div")
      }
      for (f = d.find("div:not([style])"); f.length;) {
        for (c = 0; c < f.length; c++) {
          var h = jQuery(f[c]),
            i = h.html().replace(/\u0009/gi, "").trim();
          h.replaceWith(i)
        }
        f = d.find("div:not([style])")
      }
      return d.html()
    }

    function k() {
      b.events.on("copy", c), b.events.on("cut", c), b.events.on("paste", d), b.browser.msie && b.browser.version < 11 && (b.events.on("mouseup", function (a) {
        2 == a.button && (setTimeout(function () {
          o = !1
        }, 50), o = !0)
      }, !0), b.events.on("beforepaste", d))
    }
    var l, m, n, o = !1;
    return {
      _init: k
    }
  };
  jQuery.FE.MODULES.tooltip = function (b) {
    function c() {
      b.$tooltip && b.$tooltip.removeClass("fr-visible").css("left", "-3000px")
    }

    function d(c, d) {
      if (c.data("title") || c.data("title", c.attr("title")), !c.data("title")) return !1;
      b.$tooltip || f(), c.removeAttr("title"), b.$tooltip.text(c.data("title")), b.$tooltip.addClass("fr-visible");
      var e = c.offset().left + (c.outerWidth() - b.$tooltip.outerWidth()) / 2;
      0 > e && (e = 0), e + b.$tooltip.outerWidth() > jQuery(b.o_win).width() && (e = jQuery(b.o_win).width() - b.$tooltip.outerWidth()), "undefined" == typeof d && (d = b.opts.toolbarBottom);
      var g = d ? c.offset().top - b.$tooltip.height() : c.offset().top + c.outerHeight();
      b.$tooltip.css("left", e), b.$tooltip.css("top", g)
    }

    function e(e, f, g) {
      b.helpers.isMobile() || (b.events.$on(e, "mouseenter", f, function (b) {
        jQuery(b.currentTarget).hasClass("fr-disabled") || d(jQuery(b.currentTarget), g)
      }, !0), b.events.$on(e, "mouseleave " + b._mousedown + " " + b._mouseup, f, function (a) {
        c()
      }, !0))
    }

    function f() {
      b.helpers.isMobile() || (b.shared.$tooltip ? b.$tooltip = b.shared.$tooltip : (b.shared.$tooltip = jQuery('<div class="fr-tooltip"></div>'), b.$tooltip = b.shared.$tooltip, b.opts.theme && b.$tooltip.addClass(b.opts.theme + "-theme"), jQuery(b.o_doc).find("body").append(b.$tooltip)), b.events.on("shared.destroy", function () {
        b.$tooltip.html("").removeData().remove()
      }, !0))
    }
    return {
      hide: c,
      to: d,
      bind: e
    }
  };
  jQuery.FE.ICON_DEFAULT_TEMPLATE = "font_awesome", jQuery.FE.ICON_TEMPLATES = {
    font_awesome: '<i class="material-icons">[NAME]</i>',
    text: '<span style="text-align: center;">[NAME]</span>',
    image: "<img src=[SRC] alt=[ALT] />"
  };
  jQuery.FE.ICONS = {
    bold: {
      NAME: "format_bold"
    },
    italic: {
      NAME: "format_italic"
    },
    underline: {
      NAME: "format_underline"
    },
    strikeThrough: {
      NAME: "format_strikethrough"
    },
    subscript: {
      NAME: "format_subscript"
    },
    superscript: {
      NAME: "format_superscript"
    },
    color: {
      NAME: "format_tint"
    },
    outdent: {
      NAME: "format_indent_decrease"
    },
    indent: {
      NAME: "format_indent_increase"
    },
    undo: {
      NAME: "undo"
    },
    redo: {
      NAME: "redo"
    },
    insertHR: {
      NAME: "remove"
    },
    clearFormatting: {
      NAME: "format_clear"
    },
    selectAll: {
      NAME: "font_download"
    }
  };
  jQuery.FE.DefineIconTemplate = function (b, c) {
    jQuery.FE.ICON_TEMPLATES[b] = c
  };
  jQuery.FE.DefineIcon = function (b, c) {
    jQuery.FE.ICONS[b] = c
  };
  jQuery.FE.MODULES.icon = function (b) {
    function c(b) {
      var c = null,
        d = jQuery.FE.ICONS[b];
      if ("undefined" != typeof d) {
        var e = d.template || jQuery.FE.ICON_DEFAULT_TEMPLATE;
        e && (e = jQuery.FE.ICON_TEMPLATES[e]) && (c = e.replace(/\[([a-zA-Z]*)\]/g, function (a, c) {
          return "NAME" == c ? d[c] || b : d[c]
        }))
      }
      return c || b
    }
    return {
      create: c
    }
  };
  jQuery.FE.MODULES.button = function (b) {
    function c(c) {
      var d = jQuery(c.currentTarget),
        e = d.next(),
        f = d.hasClass("fr-active"),
        g = (b.helpers.isMobile(), jQuery(".fr-dropdown.fr-active").not(d)),
        h = d.parents(".fr-toolbar, .fr-popup").data("instance") || b;
      if (h.helpers.isIOS() && 0 == h.$el.get(0).querySelectorAll(".fr-marker").length && (h.selection.save(), h.selection.clear(), h.selection.restore()), !f) {
        var i = d.data("cmd");
        e.find(".fr-command").removeClass("fr-active"), jQuery.FE.COMMANDS[i] && jQuery.FE.COMMANDS[i].refreshOnShow && jQuery.FE.COMMANDS[i].refreshOnShow.apply(h, [d, e]), e.css("left", d.offset().left - d.parent().offset().left - ("rtl" == b.opts.direction ? e.width() - d.outerWidth() : 0)), b.opts.toolbarBottom ? e.css("bottom", b.$tb.height() - d.position().top) : e.css("top", d.position().top + d.outerHeight())
      }
      d.addClass("fr-blink").toggleClass("fr-active"), setTimeout(function () {
        d.removeClass("fr-blink")
      }, 300), e.offset().left + e.outerWidth() > jQuery(b.opts.scrollableContainer).offset().left + jQuery(b.opts.scrollableContainer).outerWidth() && e.css("margin-left", -(e.offset().left + e.outerWidth() - jQuery(b.opts.scrollableContainer).offset().left - jQuery(b.opts.scrollableContainer).outerWidth())), g.removeClass("fr-active"), g.parent(".fr-toolbar:not(.fr-inline)").css("zIndex", ""), 0 != d.parents(".fr-popup").length || b.opts.toolbarInline || (d.hasClass("fr-active") ? b.$tb.css("zIndex", (b.opts.zIndex || 1) + 4) : b.$tb.css("zIndex", ""))
    }

    function d(b) {
      // b.addClass("fr-blink"), setTimeout(function () {
      //   b.removeClass("fr-blink")
      // }, 500);
      
      for (var c = b.data("cmd"), d = [];
        "undefined" != typeof b.data("param" + (d.length + 1));) d.push(b.data("param" + (d.length + 1)));
      var e = jQuery(".fr-dropdown.fr-active");
      e.length && (e.removeClass("fr-active"), e.parent(".fr-toolbar:not(.fr-inline)").css("zIndex", "")), b.parents(".fr-popup, .fr-toolbar").data("instance").commands.exec(c, d)
    }

    function e(b) {
      var c = jQuery(b.currentTarget);
      d(c)
    }

    function f(b) {
      var d = jQuery(b.currentTarget),
        f = d.parents(".fr-popup, .fr-toolbar").data("instance");
      if (0 != d.parents(".fr-popup").length || d.data("popup") || f.popups.hideAll(), f.popups.areVisible() && !f.popups.areVisible(f)) {
        for (var g = 0; g < jQuery.FE.INSTANCES.length; g++) jQuery.FE.INSTANCES[g] != f && jQuery.FE.INSTANCES[g].popups && jQuery.FE.INSTANCES[g].popups.areVisible() && jQuery.FE.INSTANCES[g].$el.find(".fr-marker").remove();
        f.popups.hideAll()
      }
      d.hasClass("fr-dropdown") ? c(b) : (e(b), jQuery.FE.COMMANDS[d.data("cmd")] && 0 != jQuery.FE.COMMANDS[d.data("cmd")].refreshAfterCallback && f.button.bulkRefresh())
    }

    function g(a) {
      var b = a.find(".fr-dropdown.fr-active");
      b.length && (b.removeClass("fr-active"), b.parent(".fr-toolbar:not(.fr-inline)").css("zIndex", ""))
    }

    function h(a) {
      a.preventDefault(), a.stopPropagation()
    }

    function i(a) {
      return a.stopPropagation(), b.opts.toolbarInline ? !1 : void 0
    }

    function j(c, d) {
      b.events.bindClick(c, ".fr-command:not(.fr-disabled)", f), b.events.$on(c, b._mousedown + " " + b._mouseup + " " + b._move, ".fr-dropdown-menu", h, !0), b.events.$on(c, b._mousedown + " " + b._mouseup + " " + b._move, ".fr-dropdown-menu .fr-dropdown-wrapper", i, !0);
      var e = c.get(0).ownerDocument,
        j = "defaultView" in e ? e.defaultView : e.parentWindow,
        k = function (d) {
          (!d || d.type == b._mouseup && d.target != jQuery("html").get(0) || "keydown" == d.type && (b.keys.isCharacter(d.which) && !b.keys.ctrlKey(d) || d.which == jQuery.FE.KEYCODE.ESC)) && g(c)
        };
      b.events.$on(jQuery(j), b._mouseup + " resize keydown", k, !0), b.opts.iframe && b.events.$on(b.$win, b._mouseup, k, !0), jQuery.merge(q, c.find(".fr-btn").toArray()), b.tooltip.bind(c, ".fr-btn, .fr-title", d)
    }

    function k(a, c) {
      var d = "";
      if (c.html) d += "function" == typeof c.html ? c.html.call(b) : c.html;
      else {
        var e = c.options;
        "function" == typeof e && (e = e()), d += '<ul class="fr-dropdown-list">';
        for (var f in e) e.hasOwnProperty(f) && (d += '<li><jQuery class="fr-command" data-cmd="' + a + '" data-param1="' + f + '" title="' + e[f] + '">' + b.language.translate(e[f]) + "</jQuery></li>");
        d += "</ul>"
      }
      return d
    }

    function l(a, c, d) {
      var e = c.displaySelection;
      "function" == typeof e && (e = e(b));
      var f;
      if (e) {
        var g = "function" == typeof c.defaultSelection ? c.defaultSelection(b) : c.defaultSelection;
        f = '<span style="width:' + (c.displaySelectionWidth || 100) + 'px">' + (g || b.language.translate(c.title)) + "</span>"
      }
      else f = b.icon.create(c.icon || a);
      var h = c.popup ? ' data-popup="true"' : "",
        i = '<button type="button" tabindex="-1" title="' + (b.language.translate(c.title) || "") + '" class="fr-command fr-btn' + ("dropdown" == c.type ? " fr-dropdown" : "") + (c.displaySelection ? " fr-selection" : "") + (c.back ? " fr-back" : "") + (c.disabled ? " fr-disabled" : "") + (d ? "" : " fr-hidden") + '" data-cmd="' + a + '"' + h + ">" + f + "</button>";
      if ("dropdown" == c.type) {
        var j = '<div class="fr-dropdown-menu"><div class="fr-dropdown-wrapper"><div class="fr-dropdown-content" tabindex="-1">';
        j += k(a, c), j += "</div></div></div>", i += j
      }
      return i
    }

    function m(c, d) {
      for (var e = "", f = 0; f < c.length; f++) {
        var g = c[f],
          h = jQuery.FE.COMMANDS[g];
        if (!(h && "undefined" != typeof h.plugin && b.opts.pluginsEnabled.indexOf(h.plugin) < 0))
          if (h) {
            var i = "undefined" != typeof d ? d.indexOf(g) >= 0 : !0;
            e += l(g, h, i)
          }
          else "|" == g ? e += '<div class="fr-separator fr-vs"></div>' : "-" == g && (e += '<div class="fr-separator fr-hs"></div>')
      }
      return e
    }

    function n(c) {
      var d, e = c.parents(".fr-popup, .fr-toolbar").data("instance") || b,
        f = c.data("cmd");
      c.hasClass("fr-dropdown") ? d = c.next() : c.removeClass("fr-active"), jQuery.FE.COMMANDS[f] && jQuery.FE.COMMANDS[f].refresh ? jQuery.FE.COMMANDS[f].refresh.apply(e, [c, d]) : b.refresh[f] && e.refresh[f](c, d)
    }

    function o() {
      var c = b.$tb ? b.$tb.data("instance") || b : b;
      return 0 == b.events.trigger("buttons.refresh") ? !0 : void setTimeout(function () {
        for (var b = c.selection.inEditor() && c.core.hasFocus(), d = 0; d < q.length; d++) {
          var e = jQuery(q[d]),
            f = e.data("cmd");
          0 == e.parents(".fr-popup").length ? b || jQuery.FE.COMMANDS[f] && jQuery.FE.COMMANDS[f].forcedRefresh ? c.button.refresh(e) : e.hasClass("fr-dropdown") || e.removeClass("fr-active") : e.parents(".fr-popup").is(":visible") && c.button.refresh(e)
        }
      }, 0)
    }

    function p() {
      b.opts.toolbarInline ? b.events.on("toolbar.show", o) : (b.events.on("mouseup", o), b.events.on("keyup", o), b.events.on("blur", o), b.events.on("focus", o), b.events.on("contentChanged", o))
    }
    var q = [];
    return (b.opts.toolbarInline || b.opts.toolbarContainer) && (b.shared.buttons || (b.shared.buttons = []), q = b.shared.buttons), {
      _init: p,
      buildList: m,
      bindCommands: j,
      refresh: n,
      bulkRefresh: o,
      exec: d
    }
  };
  jQuery.FE.MODULES.position = function (b) {
    function c() {
      var c, d = b.selection.ranges(0);
      if (d && d.collapsed && b.selection.inEditor()) {
        var e = !1;
        0 == b.$el.find(".fr-marker").length && (b.selection.save(), e = !0);
        var f = b.$el.find(".fr-marker:first");
        f.css("display", "inline"), f.css("line-height", "");
        var g = f.offset(),
          h = f.outerHeight();
        f.css("display", "none"), f.css("line-height", 0), c = {}, c.left = g.left, c.width = 0, c.height = h, c.top = g.top - (b.helpers.isIOS() ? 0 : jQuery(b.o_win).scrollTop()), c.right = 1, c.bottom = 1, c.ok = !0, e && b.selection.restore()
      }
      else d && (c = d.getBoundingClientRect());
      return c
    }

    function d(c, d, e) {
      var f = c.outerHeight();
      if (!b.helpers.isMobile() && b.$tb && c.parent().get(0) != b.$tb.get(0)) {
        var g = (c.parent().height() - 20 - (b.opts.toolbarBottom ? b.$tb.outerHeight() : 0), c.parent().offset().top),
          h = d - f - (e || 0);
        c.parent().get(0) == jQuery(b.opts.scrollableContainer).get(0) && (g -= c.parent().position().top), g + d + f > jQuery(b.o_doc).outerHeight() && c.parent().offset().top + h > 0 ? (d = h, c.addClass("fr-above")) : c.removeClass("fr-above")
      }
      return d
    }

    function e(c, d) {
      var e = c.outerWidth();
      return c.parent().offset().left + d + e > jQuery(b.opts.scrollableContainer).width() - 10 && (d = jQuery(b.opts.scrollableContainer).width() - e - 10 - c.parent().offset().left + jQuery(b.opts.scrollableContainer).offset().left), c.parent().offset().left + d < jQuery(b.opts.scrollableContainer).offset().left && (d = 10 - c.parent().offset().left + jQuery(b.opts.scrollableContainer).offset().left), d
    }

    function f(d) {
      var e = c();
      d.css("top", 0).css("left", 0);
      var f = e.top + e.height,
        h = e.left + e.width / 2 - d.outerWidth() / 2 + jQuery(b.o_win).scrollLeft();
      b.opts.iframe || (f += jQuery(b.o_win).scrollTop()), g(h, f, d, e.height)
    }

    function g(a, c, f, g) {
      var h = f.data("container");
      h && "BODY" != h.get(0).tagName && (a && (a -= h.offset().left), c && (c -= h.offset().top - h.scrollTop())), b.opts.iframe && h && b.$tb && h.get(0) != b.$tb.get(0) && (a && (a += b.$iframe.offset().left), c && (c += b.$iframe.offset().top));
      var i = e(f, a);
      if (a) {
        f.css("left", i);
        var j = f.find(".fr-arrow");
        j.data("margin-left") || j.data("margin-left", b.helpers.getPX(j.css("margin-left"))), j.css("margin-left", a - i + j.data("margin-left"))
      }
      c && f.css("top", d(f, c, g))
    }

    function h(c) {
      var d = jQuery(c),
        e = d.is(".fr-sticky-on"),
        f = d.data("sticky-top"),
        g = d.data("sticky-scheduled");
      if ("undefined" == typeof f) {
        d.data("sticky-top", 0);
        var h = jQuery('<div class="fr-sticky-dummy" style="height: ' + d.outerHeight() + 'px;"></div>');
        b.$box.prepend(h)
      }
      else b.$box.find(".fr-sticky-dummy").css("height", d.outerHeight());
      if (b.core.hasFocus() || b.$tb.find("input:visible:focus").length > 0) {
        var i = jQuery(window).scrollTop(),
          j = Math.min(Math.max(i - b.$tb.parent().offset().top, 0), b.$tb.parent().outerHeight() - d.outerHeight());
        j != f && j != g && (clearTimeout(d.data("sticky-timeout")), d.data("sticky-scheduled", j), d.outerHeight() < i - b.$tb.parent().offset().top && d.addClass("fr-opacity-0"), d.data("sticky-timeout", setTimeout(function () {
          var c = jQuery(window).scrollTop(),
            e = Math.min(Math.max(c - b.$tb.parent().offset().top, 0), b.$tb.parent().outerHeight() - d.outerHeight());
          e > 0 && "BODY" == b.$tb.parent().get(0).tagName && (e += b.$tb.parent().position().top), e != f && (d.css("top", Math.max(e, 0)), d.data("sticky-top", e), d.data("sticky-scheduled", e)), d.removeClass("fr-opacity-0")
        }, 100))), e || (d.css("top", "0"), d.width(b.$tb.parent().width()), d.addClass("fr-sticky-on"), b.$box.addClass("fr-sticky-box"))
      }
      else clearTimeout(jQuery(c).css("sticky-timeout")), d.css("top", "0"), d.css("position", ""), d.width(""), d.data("sticky-top", 0), d.removeClass("fr-sticky-on"), b.$box.removeClass("fr-sticky-box")
    }

    function i(c) {
      if (c.offsetWidth) {
        var d, e, f = jQuery(c),
          g = f.outerHeight(),
          h = f.data("sticky-position"),
          i = jQuery("body" == b.opts.scrollableContainer ? b.o_win : b.opts.scrollableContainer).outerHeight(),
          j = 0,
          k = 0;
        "body" !== b.opts.scrollableContainer && (j = jQuery(b.opts.scrollableContainer).offset().top, k = jQuery(b.o_win).outerHeight() - j - i);
        var l = "body" == b.opts.scrollableContainer ? jQuery(b.o_win).scrollTop() : j,
          m = f.is(".fr-sticky-on");
        f.data("sticky-parent") || f.data("sticky-parent", f.parent());
        var n = f.data("sticky-parent"),
          o = n.offset().top,
          p = n.outerHeight();
        if (f.data("sticky-offset") || (f.data("sticky-offset", !0), f.after('<div class="fr-sticky-dummy" style="height: ' + g + 'px;"></div>')), !h) {
          var q = "auto" !== f.css("top") || "auto" !== f.css("bottom");
          q || f.css("position", "fixed"), h = {
            top: "auto" !== f.css("top"),
            bottom: "auto" !== f.css("bottom")
          }, q || f.css("position", ""), f.data("sticky-position", h), f.data("top", f.css("top")), f.data("bottom", f.css("bottom"))
        }
        var r = function () {
            return l + d > o && o + p - g >= l + d
          },
          s = function () {
            return l + i - e > o + g && o + p > l + i - e
          };
        d = b.helpers.getPX(f.data("top")), e = b.helpers.getPX(f.data("bottom"));
        var t = h.top && r(),
          u = h.bottom && s();
        t || u ? (f.css("width", n.width() + "px"), m || (f.addClass("fr-sticky-on"), f.removeClass("fr-sticky-off"), f.css("top") && ("auto" != f.data("top") ? f.css("top", b.helpers.getPX(f.data("top")) + j) : f.data("top", "auto")), f.css("bottom") && ("auto" != f.data("bottom") ? f.css("bottom", b.helpers.getPX(f.data("bottom")) + k) : f.css("bottom", "auto")))) : f.hasClass("fr-sticky-off") || (f.width(""), f.removeClass("fr-sticky-on"), f.addClass("fr-sticky-off"), f.css("top") && "auto" != f.css("top") && f.css("top", 0), f.css("bottom") && f.css("bottom", 0))
      }
    }

    function j() {
      var a = document.createElement("test"),
        c = a.style;
      return c.cssText = "position:" + ["-webkit-", "-moz-", "-ms-", "-o-", ""].join("sticky; position:") + " sticky;", -1 !== c.position.indexOf("sticky") && !b.helpers.isIOS() && !b.helpers.isAndroid()
    }

    function k() {
      if (!j())
        if (b._stickyElements = [], b.helpers.isIOS()) {
          var c = function () {
            b.helpers.requestAnimationFrame()(c);
            for (var a = 0; a < b._stickyElements.length; a++) h(b._stickyElements[a])
          };
          c(), b.events.$on(jQuery(b.o_win), "scroll", function () {
            if (b.core.hasFocus())
              for (var c = 0; c < b._stickyElements.length; c++) {
                var d = jQuery(b._stickyElements[c]),
                  e = d.parent(),
                  f = jQuery(window).scrollTop();
                d.outerHeight() < f - e.offset().top && (d.addClass("fr-opacity-0"), d.data("sticky-top", -1), d.data("sticky-scheduled", -1))
              }
          }, !0)
        }
        else b.events.$on(jQuery("body" == b.opts.scrollableContainer ? b.o_win : b.opts.scrollableContainer), "scroll", l, !0), b.events.$on(jQuery(b.o_win), "resize", l, !0), b.events.on("initialized", l), b.events.on("focus", l), b.events.$on(jQuery(b.o_win), "resize", "textarea", l, !0)
    }

    function l() {
      for (var a = 0; a < b._stickyElements.length; a++) i(b._stickyElements[a])
    }

    function m(a) {
      a.addClass("fr-sticky"), b.helpers.isIOS() && a.addClass("fr-sticky-ios"), j() || b._stickyElements.push(a.get(0))
    }

    function n() {
      k()
    }
    return {
      _init: n,
      forSelection: f,
      addSticky: m,
      refresh: l,
      at: g,
      getBoundingRect: c
    }
  };
  jQuery.extend(jQuery.FE.DEFAULTS, {
    toolbarBottom: !1,
    toolbarButtons:   ["fullscreen", "bold", "italic", "underline", "strikeThrough", /*"subscript", "superscript",*/ "fontFamily", "fontSize", "color", "emoticons", "inlineStyle", "paragraphStyle", "paragraphFormat", "align", "formatOL", "formatUL", "outdent", "indent", "quote", "insertHR", "insertLink", "insertImage", "insertVideo", "insertFile", "insertTable", "undo", "redo", "clearFormatting", "selectAll", "html"],
    toolbarButtonsXS: ["fullscreen", "bold", "italic", "underline", "strikeThrough", /*"subscript", "superscript",*/ "fontFamily", "fontSize", "color", "emoticons", "inlineStyle", "paragraphStyle", "paragraphFormat", "align", "formatOL", "formatUL", "outdent", "indent", "quote", "insertHR", "insertLink", "insertImage", "insertVideo", "insertFile", "insertTable", "undo", "redo", "clearFormatting", "selectAll", "html"],//["bold", "italic", "fontFamily", "fontSize", "|", "undo", "redo"],
    toolbarButtonsSM: ["fullscreen", "bold", "italic", "underline", "strikeThrough", /*"subscript", "superscript",*/ "fontFamily", "fontSize", "color", "emoticons", "inlineStyle", "paragraphStyle", "paragraphFormat", "align", "formatOL", "formatUL", "outdent", "indent", "quote", "insertHR", "insertLink", "insertImage", "insertVideo", "insertFile", "insertTable", "undo", "redo", "clearFormatting", "selectAll", "html"],//["bold", "italic", "underline", "|", "fontFamily", "fontSize", "insertLink", "insertImage", "table", "|", "undo", "redo"],
    toolbarButtonsMD: ["fullscreen", "bold", "italic", "underline", "strikeThrough", /*"subscript", "superscript",*/ "fontFamily", "fontSize", "color", "emoticons", "inlineStyle", "paragraphStyle", "paragraphFormat", "align", "formatOL", "formatUL", "outdent", "indent", "quote", "insertHR", "insertLink", "insertImage", "insertVideo", "insertFile", "insertTable", "undo", "redo", "clearFormatting", "selectAll", "html"],//["fullscreen", "bold", "italic", "underline", "fontFamily", "fontSize", "color", "paragraphStyle", "paragraphFormat", "align", "formatOL", "formatUL", "outdent", "indent", "quote", "insertHR", "-", "insertLink", "insertImage", "insertVideo", "insertFile", "insertTable", "undo", "redo", "clearFormatting"],
    toolbarContainer: null,
    toolbarInline: !1,
    toolbarSticky: !0,
    toolbarStickyOffset: 0,
    toolbarVisibleWithoutSelection: !1
  });
  jQuery.FE.MODULES.toolbar = function (b) {
    function c(a, b) {
      for (var c = 0; c < b.length; c++) "-" != b[c] && "|" != b[c] && a.indexOf(b[c]) < 0 && a.push(b[c])
    }

    function d() {
      var d = jQuery.merge([], e());
      c(d, b.opts.toolbarButtonsXS || []), c(d, b.opts.toolbarButtonsSM || []), c(d, b.opts.toolbarButtonsMD || []), c(d, b.opts.toolbarButtons);
      for (var f = d.length - 1; f >= 0; f--) "-" != d[f] && "|" != d[f] && d.indexOf(d[f]) < f && d.splice(f, 1);
      var g = b.button.buildList(d, e());
      b.$tb.append(g), b.button.bindCommands(b.$tb)
    }

    function e() {
      var a = b.helpers.screenSize();
      return u[a]
    }

    function f() {
      var a = e();
      b.$tb.find(".fr-separator").remove(), b.$tb.find("> .fr-command").addClass("fr-hidden");
      for (var c = 0; c < a.length; c++)
        if ("|" == a[c] || "-" == a[c]) b.$tb.append(b.button.buildList([a[c]]));
        else {
          var d = b.$tb.find('> .fr-command[data-cmd="' + a[c] + '"]'),
            f = null;
          d.next().hasClass("fr-dropdown-menu") && (f = d.next()), d.removeClass("fr-hidden").appendTo(b.$tb), f && f.appendTo(b.$tb)
        }
    }

    function g() {
      b.events.$on(jQuery(b.o_win), "resize", f, !0), b.events.$on(jQuery(b.o_win), "orientationchange", f, !0)
    }

    function h(c, d) {
      setTimeout(function () {
        if (c && c.which == jQuery.FE.KEYCODE.ESC);
        else if (b.selection.inEditor() && b.core.hasFocus() && !b.popups.areVisible() && (b.opts.toolbarVisibleWithoutSelection && c && "keyup" != c.type || !b.selection.isCollapsed() && !b.keys.isIME() || d)) {
          if (b.$tb.data("instance", b), 0 == b.events.trigger("toolbar.show", [c])) return !1;
          b.opts.toolbarContainer || b.position.forSelection(b.$tb), b.$tb.show()
        }
      }, 0)
    }

    function i(a) {
      return 0 == b.events.trigger("toolbar.hide") ? !1 : void b.$tb.hide()
    }

    function j() {
      return 0 == b.events.trigger("toolbar.show") ? !1 : void b.$tb.show()
    }

    function k() {
      b.events.on("window.mousedown", i), b.events.on("keydown", i), b.events.on("blur", i), b.events.on("window.mouseup", h), b.helpers.isMobile() ? b.helpers.isIOS() || (b.events.on("window.touchend", h), b.browser.mozilla && setInterval(h, 200)) : b.events.on("window.keyup", h), b.events.on("keydown", function (b) {
        b && b.which == jQuery.FE.KEYCODE.ESC && i()
      }), b.events.$on(b.$wp, "scroll.toolbar", h), b.events.on("commands.after", h), b.helpers.isMobile() && (b.events.$on(b.$doc, "selectionchange", h), b.events.$on(b.$doc, "orientationchange", h))
    }

    function l() {
        if ( b.opts.toolbarInline ) {
          jQuery(b.opts.scrollableContainer).append(b.$tb)
          b.$tb.data("container", jQuery(b.opts.scrollableContainer))
          b.$tb.addClass("fr-inline")
          b.$tb.prepend('<span class="fr-arrow"></span>')
          k(), b.opts.toolbarBottom = !1
        } else {
          
          if (b.opts.toolbarBottom && !b.helpers.isIOS()) {
            b.$box.append(b.$tb)
            b.$tb.addClass("fr-bottom")
            b.$box.addClass("fr-bottom")
          } else {
            b.opts.toolbarBottom = !1
            b.$box.prepend(b.$tb)
            b.$tb.addClass("fr-top")
            b.$box.addClass("fr-top")
          }
          b.$tb.addClass("fr-basic")
          // b.opts.toolbarSticky && (
          //   b.opts.toolbarStickyOffset && (
          //     if ( b.opts.toolbarBottom ) {
          //        b.$tb.css("bottom", b.opts.toolbarStickyOffset)
          //      } else {
          //        b.$tb.css("top", b.opts.toolbarStickyOffset)
          //      }  )
          //   b.position.addSticky(b.$tb)
          //   )
          // )
        }
    }

    function m() {
      b.$tb.html("").removeData().remove()
    }

    function n() {
      b.$box.removeClass("fr-top fr-bottom fr-inline fr-basic");
      b.$box.find(".fr-sticky-dummy").remove();
    }

    function o() {
      b.opts.theme && b.$tb.addClass(b.opts.theme + "-theme"), b.opts.zIndex > 1 && b.$tb.css("z-index", b.opts.zIndex + 1), "auto" != b.opts.direction && b.$tb.removeClass("fr-ltr fr-rtl").addClass("fr-" + b.opts.direction), b.helpers.isMobile() ? b.$tb.addClass("fr-mobile") : b.$tb.addClass("fr-desktop"), b.opts.toolbarContainer ? (b.opts.toolbarInline && (k(), i()), b.opts.toolbarBottom ? b.$tb.addClass("fr-bottom") : b.$tb.addClass("fr-top")) : l(), s = b.$tb.get(0).ownerDocument, t = "defaultView" in s ? s.defaultView : s.parentWindow, d(), g(), b.events.$on(b.$tb, b._mousedown + " " + b._mouseup, function (a) {
        var b = a.originalEvent ? a.originalEvent.target || a.originalEvent.originalTarget : null;
        return b && "INPUT" != b.tagName ? (a.stopPropagation(), a.preventDefault(), !1) : void 0
      }, !0)
    }

    function p() {
      return b.$wp ? (b.opts.toolbarContainer ? (b.shared.$tb ? (b.$tb = b.shared.$tb, b.opts.toolbarInline && k()) : (b.shared.$tb = jQuery('<div class="fr-toolbar"></div>'), b.$tb = b.shared.$tb, jQuery(b.opts.toolbarContainer).append(b.$tb), o(), b.$tb.data("instance", b)), b.events.on("focus", function () {
        b.$tb.data("instance", b)
      }, !0), b.opts.toolbarInline = !1) : b.opts.toolbarInline ? (b.$box.addClass("fr-inline"), b.shared.$tb ? (b.$tb = b.shared.$tb, k()) : (b.shared.$tb = jQuery('<div class="fr-toolbar"></div>'), b.$tb = b.shared.$tb, o())) : (b.$box.addClass("fr-basic"), b.$tb = jQuery('<div class="fr-toolbar"></div>'), o(), b.$tb.data("instance", b)), b.events.on("destroy", n, !0), void b.events.on(b.opts.toolbarInline ? "shared.destroy" : "destroy", m, !0)) : !1
    }

    function q() {
      !v && b.$tb && (b.$tb.find("> .fr-command").addClass("fr-disabled fr-no-refresh"), v = !0)
    }

    function r() {
      v && b.$tb && (b.$tb.find("> .fr-command").removeClass("fr-disabled fr-no-refresh"), v = !1), b.button.bulkRefresh()
    }
    var s, t, u = [];
    u[jQuery.FE.XS] = b.opts.toolbarButtonsXS || b.opts.toolbarButtons;
    u[jQuery.FE.SM] = b.opts.toolbarButtonsSM || b.opts.toolbarButtons;
    u[jQuery.FE.MD] = b.opts.toolbarButtonsMD || b.opts.toolbarButtons;
    u[jQuery.FE.LG] = b.opts.toolbarButtons;
    var v = !1;
    return {
      _init: p,
      hide: i,
      show: j,
      showInline: h,
      disable: q,
      enable: r
    }
  };
  jQuery.FE.SHORTCUTS_MAP = {
    69: {
      cmd: "show"
    },
    66: {
      cmd: "bold"
    },
    73: {
      cmd: "italic"
    },
    85: {
      cmd: "underline"
    },
    83: {
      cmd: "strikeThrough"
    },
    221: {
      cmd: "indent"
    },
    219: {
      cmd: "outdent"
    },
    90: {
      cmd: "undo"
    },
    "-90": {
      cmd: "redo"
    }
  };
  jQuery.extend(jQuery.FE.DEFAULTS, {
    shortcutsEnabled: ["show", "bold", "italic", "underline", "strikeThrough", "indent", "outdent", "undo", "redo"]
  });
  jQuery.FE.RegisterShortcut = function (b, c, d, e) {
    jQuery.FE.SHORTCUTS_MAP[b * (e ? -1 : 1)] = {
      cmd: c,
      val: d
    }, jQuery.FE.DEFAULTS.shortcutsEnabled.push(c)
  };

  jQuery.FE.MODULES.shortcuts = function (b) {
    function c(c) {
      if (!b.core.hasFocus()) return !0;
      var d = c.which;

      if ( b.keys.ctrlKey(c) && (c.shiftKey && jQuery.FE.SHORTCUTS_MAP[-d] || !c.shiftKey && jQuery.FE.SHORTCUTS_MAP[d] )) {
        var e = jQuery.FE.SHORTCUTS_MAP[d * (c.shiftKey ? -1 : 1)].cmd;
        
        if (e && b.opts.shortcutsEnabled.indexOf(e) >= 0) {
          var f, g = jQuery.FE.SHORTCUTS_MAP[d * (c.shiftKey ? -1 : 1)].val;
          
          if (
            e && !g ? f = b.$tb.find('.fr-command[data-cmd="' + e + '"]') : 
              e && g && (f = b.$tb.find('.fr-command[data-cmd="' + e + '"][data-param1="' + g + '"]')),
              f.length) {
            return 
          c.preventDefault(),
          c.stopPropagation(),
          f.parents(".fr-toolbar").data("instance", b),
          "keydown" == c.type && b.button.exec(f),
          !1;g}
          
          if (e && b.commands[e]) return c.preventDefault(), c.stopPropagation(), "keydown" == c.type && b.commands[e](), !1
        }

      }
    }

    function d() {
      b.events.on("keydown", c, !0), b.events.on("keyup", c, !0)
    }
    return {
      _init: d
    }
  };
  jQuery.FE.MODULES.snapshot = function (a) {
    function b(a) {
      for (var b = a.parentNode.childNodes, c = 0, d = null, e = 0; e < b.length; e++) {
        if (d) {
          var f = b[e].nodeType === Node.TEXT_NODE && "" === b[e].textContent,
            g = d.nodeType === Node.TEXT_NODE && b[e].nodeType === Node.TEXT_NODE;
          f || g || c++
        }
        if (b[e] == a) return c;
        d = b[e]
      }
    }

    function c(c) {
      var d = [];
      if (!c.parentNode) return [];
      for (; !a.node.isElement(c);) d.push(b(c)), c = c.parentNode;
      return d.reverse()
    }

    function d(a, b) {
      for (; a && a.nodeType === Node.TEXT_NODE;) {
        var c = a.previousSibling;
        c && c.nodeType == Node.TEXT_NODE && (b += c.textContent.length), a = c
      }
      return b
    }

    function e(a) {
      return {
        scLoc: c(a.startContainer),
        scOffset: d(a.startContainer, a.startOffset),
        ecLoc: c(a.endContainer),
        ecOffset: d(a.endContainer, a.endOffset)
      }
    }

    function f() {
      var b = {};
      if (a.events.trigger("snapshot.before"), b.html = a.$wp ? a.$el.html() : a.$oel.get(0).outerHTML, b.ranges = [], a.$wp && a.selection.inEditor() && a.core.hasFocus())
        for (var c = a.selection.ranges(), d = 0; d < c.length; d++) b.ranges.push(e(c[d]));
      return a.events.trigger("snapshot.after"), b
    }

    function g(b) {
      for (var c = a.$el.get(0), d = 0; d < b.length; d++) c = c.childNodes[b[d]];
      return c
    }

    function h(b, c) {
      try {
        var d = g(c.scLoc),
          e = c.scOffset,
          f = g(c.ecLoc),
          h = c.ecOffset,
          i = a.doc.createRange();
        i.setStart(d, e), i.setEnd(f, h), b.addRange(i)
      }
      catch (j) {}
    }

    function i(b) {
      a.$el.html() != b.html && a.$el.html(b.html);
      var c = a.selection.get();
      a.selection.clear(), a.events.focus(!0);
      for (var d = 0; d < b.ranges.length; d++) h(c, b.ranges[d])
    }

    function j(b, c) {
      return b.html != c.html ? !1 : a.core.hasFocus() && JSON.stringify(b.ranges) != JSON.stringify(c.ranges) ? !1 : !0
    }
    return {
      get: f,
      restore: i,
      equal: j
    }
  };

  jQuery.FE.MODULES.undo = function (a) {
    function b(b) {
      var c = b.which,
        d = a.keys.ctrlKey(b);
      d && (90 == c && b.shiftKey && b.preventDefault(), 90 == c && b.preventDefault())
    }

    function c() {
      return 0 === a.undo_stack.length || a.undo_index <= 1 ? !1 : !0
    }

    function d() {
      return a.undo_index == a.undo_stack.length ? !1 : !0
    }

    function e(b) {
      return !a.undo_stack || a.undoing || a.$el.get(0).querySelectorAll(".fr-marker").length ? !1 : (f(), void("undefined" == typeof b ? (b = a.snapshot.get(), a.undo_stack[a.undo_index - 1] && a.snapshot.equal(a.undo_stack[a.undo_index - 1], b) || (a.undo_stack.push(b), a.undo_index++, b.html != k && (a.events.trigger("contentChanged"), k = b.html))) : a.undo_index > 0 ? a.undo_stack[a.undo_index - 1] = b : (a.undo_stack.push(b), a.undo_index++)))
    }

    function f() {
      if (!a.undo_stack || a.undoing) return !1;
      for (; a.undo_stack.length > a.undo_index;) a.undo_stack.pop()
    }

    function g() {
      if (a.undo_index > 1) {
        a.undoing = !0;
        var b = a.undo_stack[--a.undo_index - 1];
        clearTimeout(a._content_changed_timer), a.snapshot.restore(b), a.popups.hideAll(), a.toolbar.enable(), a.events.trigger("contentChanged"), a.events.trigger("commands.undo"), a.undoing = !1
      }
    }

    function h() {
      if (a.undo_index < a.undo_stack.length) {
        a.undoing = !0;
        var b = a.undo_stack[a.undo_index++];
        clearTimeout(a._content_changed_timer), a.snapshot.restore(b), a.popups.hideAll(), a.toolbar.enable(), a.events.trigger("contentChanged"), a.events.trigger("commands.redo"), a.undoing = !1
      }
    }

    function i() {
      a.undo_index = 0, a.undo_stack = []
    }

    function j() {
      i(), a.events.on("initialized", function () {
        k = a.html.get(!1, !0)
      }), a.events.on("blur", function () {
        a.undo.saveStep()
      }), a.events.on("keydown", b)
    }
    var k = null;
    return {
      _init: j,
      run: g,
      redo: h,
      canDo: c,
      canRedo: d,
      dropRedo: f,
      reset: i,
      saveStep: e
    }
  };

  jQuery.FE.POPUP_TEMPLATES = {
    "text.edit": "[_EDIT_]"
  };
  jQuery.FE.RegisterTemplate = function (b, c) {
    jQuery.FE.POPUP_TEMPLATES[b] = c
  };
  jQuery.FE.MODULES.popups = function (b) {
    function c(c, d) {
      d.is(":visible") || (d = jQuery(b.opts.scrollableContainer)), d.is(x[c].data("container")) || (x[c].data("container", d), d.append(x[c]))
    }

    function d(d, e, h, i) {
      if (g() && b.$el.find(".fr-marker").length > 0 && (b.events.disableBlur(), b.selection.restore()), m([d]), !x[d]) return !1;
      jQuery(".fr-dropdown.fr-active").removeClass("fr-active").parent(".fr-toolbar").css("zIndex", ""), x[d].data("instance", b), b.$tb && b.$tb.data("instance", b);
      var j = x[d].outerWidth(),
        k = (x[d].outerHeight(), f(d));
      x[d].addClass("fr-active").find("input, textarea").removeAttr("disabled");
      var l = x[d].data("container");
      l.is(b.$tb) && b.$tb.css("zIndex", (b.opts.zIndex || 1) + 4), b.opts.toolbarInline && l && b.$tb && l.get(0) == b.$tb.get(0) && (c(d, b.opts.toolbarInline ? jQuery(b.opts.scrollableContainer) : b.$box), h && (h = b.$tb.offset().top - b.helpers.getPX(b.$tb.css("margin-top"))), e && (e = b.$tb.offset().left + b.$tb.width() / 2), b.$tb.hasClass("fr-above") && h && (h += b.$tb.outerHeight()), i = 0), l = x[d].data("container"), !b.opts.iframe || i || k || (e && (e -= b.$iframe.offset().left), h && (h -= b.$iframe.offset().top)), e && (e -= j / 2), b.opts.toolbarBottom && l && b.$tb && l.get(0) == b.$tb.get(0) && (x[d].addClass("fr-above"), h && (h -= x[d].outerHeight())), x[d].removeClass("fr-active"), b.position.at(e, h, x[d], i || 0), x[d].addClass("fr-active");
      var n = x[d].find("input:visible, textarea:visible").get(0);
      n && (0 == b.$el.find(".fr-marker").length && b.core.hasFocus() && b.selection.save(), b.events.disableBlur(), jQuery(n).select().focus()), b.opts.toolbarInline && b.toolbar.hide(), b.events.trigger("popups.show." + d)
    }

    function e(a, c) {
      b.events.on("popups.show." + a, c)
    }

    function f(a) {
      return x[a] && x[a].hasClass("fr-active") && b.core.sameInstance(x[a]) || !1
    }

    function g(a) {
      for (var b in x)
        if (x.hasOwnProperty(b) && f(b) && ("undefined" == typeof a || x[b].data("instance") == a)) return !0;
      return !1
    }

    function h(a) {
      x[a] && x[a].hasClass("fr-active") && (x[a].removeClass("fr-active fr-above"), b.events.trigger("popups.hide." + a), b.$tb && b.$tb.css("zIndex", ""), b.events.disableBlur(), x[a].find("input, textarea, button").filter(":focus").blur(), x[a].find("input, textarea").attr("disabled", "disabled"))
    }

    function i(a, c) {
      b.events.on("popups.hide." + a, c)
    }

    function j(a) {
      var c = x[a];
      if (c && !c.data("inst" + b.id)) {
        var d = s(a);
        t(d, a)
      }
      return c
    }

    function k(a, c) {
      b.events.on("popups.refresh." + a, c)
    }

    function l(c) {
      b.events.trigger("popups.refresh." + c);
      for (var d = x[c].find(".fr-command"), e = 0; e < d.length; e++) {
        var f = jQuery(d[e]);
        0 == f.parents(".fr-dropdown-menu").length && b.button.refresh(f)
      }
    }

    function m(a) {
      "undefined" == typeof a && (a = []);
      for (var b in x) x.hasOwnProperty(b) && a.indexOf(b) < 0 && h(b)
    }

    function n() {
      b.shared.exit_flag = !0
    }

    function o() {
      b.shared.exit_flag = !1
    }

    function p() {
      return b.shared.exit_flag
    }

    function q(c, d) {
      var e = jQuery.FE.POPUP_TEMPLATES[c];
      "function" == typeof e && (e = e.apply(b));
      for (var f in d) d.hasOwnProperty(f) && (e = e.replace("[_" + f.toUpperCase() + "_]", d[f]));
      return e
    }

    function r(c, d) {
      var e = q(c, d),
        f = jQuery('<div class="fr-popup' + (b.helpers.isMobile() ? " fr-mobile" : " fr-desktop") + (b.opts.toolbarInline ? " fr-inline" : "") + '"><span class="fr-arrow"></span>' + e + "</div>");
      b.opts.theme && f.addClass(b.opts.theme + "-theme"), b.opts.zIndex > 1 && b.$tb.css("z-index", b.opts.zIndex + 2), "auto" != b.opts.direction && f.removeClass("fr-ltr fr-rtl").addClass("fr-" + b.opts.direction), f.find("input, textarea").attr("dir", b.opts.direction).attr("disabled", "disabled");
      var g = jQuery("body");
      return g.append(f), f.data("container", g), x[c] = f, b.button.bindCommands(f, !1), f
    }

    function s(c) {
      var d = x[c];
      return {
        _windowResize: function () {
          var a = d.data("instance") || b;
          !a.helpers.isMobile() && d.is(":visible") && (a.events.disableBlur(), a.popups.hide(c), a.events.enableBlur())
        },
        _inputFocus: function (c) {
          var e = d.data("instance") || b;
          if (c.preventDefault(), c.stopPropagation(), setTimeout(function () {
              e.events.enableBlur()
            }, 0), e.helpers.isMobile()) {
            var f = jQuery(e.o_win).scrollTop();
            setTimeout(function () {
              jQuery(e.o_win).scrollTop(f)
            }, 0)
          }
        },
        _inputBlur: function (c) {
          var e = d.data("instance") || b;
          document.activeElement != this && jQuery(this).is(":visible") && (e.events.blurActive() && e.events.trigger("blur"), e.events.enableBlur())
        },
        _inputKeydown: function (e) {
          var g = d.data("instance") || b,
            h = e.which;
          if (jQuery.FE.KEYCODE.TAB == h) {
            e.preventDefault();
            var i = d.find("input, textarea, button, select").filter(":visible").not(":disabled").toArray();
            i.sort(function (b, c) {
              return e.shiftKey ? jQuery(b).attr("tabIndex") < jQuery(c).attr("tabIndex") : jQuery(b).attr("tabIndex") > jQuery(c).attr("tabIndex")
            }), g.events.disableBlur();
            var j = i.indexOf(this) + 1;
            j == i.length && (j = 0), jQuery(i[j]).focus()
          }
          else if (jQuery.FE.KEYCODE.ENTER == h) d.find(".fr-submit:visible").length > 0 && (e.preventDefault(), e.stopPropagation(), g.events.disableBlur(), g.button.exec(d.find(".fr-submit:visible:first")));
          else {
            if (jQuery.FE.KEYCODE.ESC == h) return e.preventDefault(), e.stopPropagation(), g.$el.find(".fr-marker") && (g.events.disableBlur(), jQuery(this).data("skip", !0), g.selection.restore(), g.events.enableBlur()), f(c) && d.find(".fr-back:visible").length ? g.button.exec(d.find(".fr-back:visible:first")) : g.popups.hide(c), g.opts.toolbarInline && g.toolbar.showInline(null, !0), !1;
            e.stopPropagation()
          }
        },
        _windowKeydown: function (e) {
          if (!b.core.sameInstance(d)) return !0;
          var g = d.data("instance") || b,
            h = e.which;
          if (jQuery.FE.KEYCODE.ESC == h) {
            if (f(c) && g.opts.toolbarInline) return e.stopPropagation(), f(c) && d.find(".fr-back:visible").length ? g.button.exec(d.find(".fr-back:visible:first")) : (g.popups.hide(c), g.toolbar.showInline(null, !0)), !1;
            f(c) && d.find(".fr-back:visible").length ? g.button.exec(d.find(".fr-back:visible:first")) : g.popups.hide(c)
          }
        },
        _editorKeydown: function (e) {
          var g = d.data("instance") || b;
          g.keys.ctrlKey(e) || e.which == jQuery.FE.KEYCODE.ESC || (f(c) && d.find(".fr-back:visible").length ? g.button.exec(d.find(".fr-back:visible:first")) : g.popups.hide(c))
        },
        _preventFocus: function (c) {
          var e = d.data("instance") || b;
          e.events.disableBlur();
          var f = c.originalEvent ? c.originalEvent.target || c.originalEvent.originalTarget : null,
            g = "input, textarea, button, select, label, .fr-command";
          return f && !jQuery(f).is(g) && 0 === jQuery(f).parents(g).length ? (c.stopPropagation(), !1) : void(f && jQuery(f).is(g) && c.stopPropagation())
        },
        _editorMouseup: function (a) {
          d.is(":visible") && p() && d.find("input:focus, textarea:focus, button:focus, select:focus").filter(":visible").length > 0 && b.events.disableBlur()
        },
        _windowMouseup: function (a) {
          if (!b.core.sameInstance(d)) return !0;
          var e = d.data("instance") || b;
          d.is(":visible") && p() && (a.stopPropagation(), e.markers.remove(), e.popups.hide(c), o())
        },
        _doPlaceholder: function (b) {
          var c = jQuery(this).next();
          0 == c.length && jQuery(this).after("<span>" + jQuery(this).attr("placeholder") + "</span>"), jQuery(this).toggleClass("fr-not-empty", "" != jQuery(this).val())
        },
        _repositionPopup: function (e) {
          if (f(c) && d.parent().get(0) == jQuery(b.opts.scrollableContainer).get(0)) {
            var g = d.offset().top - b.$wp.offset().top,
              h = (b.$wp.scrollTop(), b.$wp.outerHeight());
            g > h || 0 > g ? d.addClass("fr-hidden") : d.removeClass("fr-hidden")
          }
        }
      }
    }

    function t(a, c) {
      b.events.on("mouseup", a._editorMouseup, !0), b.$wp && b.events.on("keydown", a._editorKeydown), b.events.on("blur", function (a) {
        g() && b.markers.remove(), m()
      }), b.$wp && !b.helpers.isMobile() && b.events.$on(b.$wp, "scroll.popup" + c, a._repositionPopup), b.events.on("window.keydown", a._windowKeydown), b.events.on("window.mouseup", a._windowMouseup, !0), x[c].data("inst" + b.id, !0), b.events.on("destroy", function () {
        b.core.sameInstance(x[c]) && x[c].removeClass("fr-active").appendTo("body")
      }, !0)
    }

    function u(c, d) {
      var e = r(c, d),
        f = s(c);
      return t(f, c), b.events.$on(e, "mousedown mouseup touchstart touchend touch", "*", f._preventFocus, !0), b.events.$on(e, "focus", "input, textarea, button, select", f._inputFocus, !0), b.events.$on(e, "blur", "input, textarea, button, select", f._inputBlur, !0), b.events.$on(e, "keydown", "input, textarea, button, select", f._inputKeydown, !0), b.events.$on(e, "keydown keyup change input", "input, textarea", f._doPlaceholder, !0), b.helpers.isIOS() && b.events.$on(e, "touchend", "label", function () {
        jQuery("#" + jQuery(this).attr("for")).prop("checked", function (a, b) {
          return !b
        })
      }, !0), b.events.$on(jQuery(b.o_win), "resize", f._windowResize, !0), e
    }

    function v() {
      for (var a in x)
        if (x.hasOwnProperty(a)) {
          var b = x[a];
          b.html("").removeData().remove()
        }
    }

    function w() {
      b.events.on("shared.destroy", v, !0), b.events.on("window.mousedown", n), b.events.on("window.touchmove", o), b.events.on("mousedown", function (a) {
        g() && (a.stopPropagation(), b.$el.find(".fr-marker").remove(), n(), b.events.disableBlur())
      })
    }
    b.shared.popups || (b.shared.popups = {});
    var x = b.shared.popups;
    return b.shared.exit_flag = !1, {
      _init: w,
      create: u,
      get: j,
      show: d,
      hide: h,
      onHide: i,
      hideAll: m,
      setContainer: c,
      refresh: l,
      onRefresh: k,
      onShow: e,
      isVisible: f,
      areVisible: g
    }
  };
  jQuery.FE.MODULES.refresh = function (b) {
    function c(a, c) {
      try {
        b.doc.queryCommandState(c) === !0 && a.addClass("fr-active")
      }
      catch (d) {}
    }

    function d(a) {
      a.toggleClass("fr-disabled", !b.undo.canDo())
    }

    function e(a) {
      a.toggleClass("fr-disabled", !b.undo.canRedo())
    }

    function f(a) {
      if (a.hasClass("fr-no-refresh")) return !1;
      for (var c = b.selection.blocks(), d = 0; d < c.length; d++) {
        for (var e = c[d].previousSibling; e && e.nodeType == Node.TEXT_NODE && 0 === e.textContent.length;) e = e.previousSibling;
        if ("LI" != c[d].tagName || e) return a.removeClass("fr-disabled"), !0;
        a.addClass("fr-disabled")
      }
    }

    function g(c) {
      if (c.hasClass("fr-no-refresh")) return !1;
      for (var d = b.selection.blocks(), e = 0; e < d.length; e++) {
        var f = "rtl" == b.opts.direction || "rtl" == jQuery(d[e]).css("direction") ? "margin-right" : "margin-left";
        if ("LI" == d[e].tagName || "LI" == d[e].parentNode.tagName) return c.removeClass("fr-disabled"), !0;
        if (b.helpers.getPX(jQuery(d[e]).css(f)) > 0) return c.removeClass("fr-disabled"), !0
      }
      c.addClass("fr-disabled")
    }
    return {
      "default": c,
      undo: d,
      redo: e,
      outdent: g,
      indent: f
    }
  };
  
  jQuery.extend(jQuery.FE.DEFAULTS, {
    editInPopup: !1
  });

  jQuery.FE.MODULES.textEdit = function (b) {
    function c() {
      var a = '<div id="fr-text-edit-' + b.id + '" class="fr-layer fr-text-edit-layer"><div class="fr-input-line"><input type="text" placeholder="' + b.language.translate("Text") + '" tabIndex="1"></div><div class="fr-action-buttons"><button type="button" class="fr-command fr-submit" data-cmd="updateText" tabIndex="2">' + b.language.translate("Update") + "</button></div></div>",
        c = {
          edit: a
        };
      b.popups.create("text.edit", c)
    }

    function d() {
      var c, d = b.popups.get("text.edit");
      c = "INPUT" === b.$el.prop("tagName") ? b.$el.attr("placeholder") : b.$el.text(), d.find("input").val(c).trigger("change"), b.popups.setContainer("text.edit", jQuery("body")), b.popups.show("text.edit", b.$el.offset().left + b.$el.outerWidth() / 2, b.$el.offset().top + b.$el.outerHeight(), b.$el.outerHeight())
    }

    function e() {
      b.events.$on(b.$el, b._mouseup, function (a) {
        setTimeout(function () {
          d()
        }, 10)
      })
    }

    function f() {
      var a = b.popups.get("text.edit"),
        c = a.find("input").val();
      0 == c.length && (c = b.opts.placeholderText), "INPUT" === b.$el.prop("tagName") ? b.$el.attr("placeholder", c) : b.$el.text(c), b.events.trigger("contentChanged"), b.popups.hide("text.edit")
    }

    function g() {
      b.opts.editInPopup && (c(), e())
    }
    return {
      _init: g,
      update: f
    }
  };
  jQuery.FE.RegisterCommand("updateText", {
    focus: !1,
    undo: !1,
    callback: function () {
      this.textEdit.update()
    }
  })
});
