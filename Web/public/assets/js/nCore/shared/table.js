! function (e) {
  "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? module.exports = function (b, c) {
    return void 0 === c && (c = "undefined" != typeof window ? require("jquery") : require("jquery")(b)), e(c), c
  } : e(jQuery)
}(function (e) {
  "use strict";
  e.extend(e.FroalaEditor.POPUP_TEMPLATES, {
    "table.insert": "[_BUTTONS_][_ROWS_COLUMNS_]"
    , "table.edit": "[_BUTTONS_]"
    , "table.colors": "[_BUTTONS_][_COLORS_]"
  }), e.extend(e.FroalaEditor.DEFAULTS, {
    tableInsertMaxSize: 10
    , tableEditButtons: ["tableHeader", "tableRemove", "|", "tableRows", "tableColumns", "tableStyle", "-", "tableCells", "tableCellBackground", "tableCellVerticalAlign", "tableCellHorizontalAlign", "tableCellStyle"]
    , tableInsertButtons: ["tableBack", "|"]
    , tableResizerOffset: 5
    , tableResizingLimit: 30
    , tableColorsButtons: ["tableBack", "|"]
    , tableColors: ["#61BD6D", "#1ABC9C", "#54ACD2", "#2C82C9", "#9365B8", "#475577", "#CCCCCC", "#41A85F", "#00A885", "#3D8EB9", "#2969B0", "#553982", "#28324E", "#000000", "#F7DA64", "#FBA026", "#EB6B56", "#E25041", "#A38F84", "#EFEFEF", "#FFFFFF", "#FAC51C", "#F37934", "#D14841", "#B8312F", "#7C706B", "#D1D5D8", "REMOVE"]
    , tableColorsStep: 7
    , tableCellStyles: {
      "fr-highlighted": "Highlighted"
      , "fr-thick": "Thick"
    }
    , tableStyles: {
      "fr-dashed-borders": "Dashed Borders"
      , "fr-alternate-rows": "Alternate Rows"
    }
    , tableCellMultipleStyles: !0
    , tableMultipleStyles: !0
  }), e.FroalaEditor.PLUGINS.table = function (b) {
    function showInsertPopup() {
      var a = b.$tb.find('.fr-command[data-cmd="insertTable"]')
        , c = b.popups.get("table.insert");
      if (c || (c = g()), !c.hasClass("fr-active")) {
        b.popups.refresh("table.insert"), b.popups.setContainer("table.insert", b.$tb);
        var d = a.offset().left + a.outerWidth() / 2
          , e = a.offset().top + (b.opts.toolbarBottom ? 10 : a.outerHeight() - 10);
        b.popups.show("table.insert", d, e, a.outerHeight())
      }
    }

    function showEditPopup() {
      var c = B();
      if (c) {
        var d = b.popups.get("table.edit");
        d || (d = i()), b.popups.setContainer("table.edit", e(b.opts.scrollableContainer));
        var e = I(c)
          , f = (e.left + e.right) / 2
          , g = e.bottom;
        if (b.popups.show("table.edit", f, g, e.bottom - e.top), b.$el.find(".fr-selected-cell")
          .length > 1) {
          b.toolbar.disable(), b.$el.removeClass("fr-no-selection"), b.edit.on();
          var h = e(b.original_window)
            .scrollTop();
          b.$el.focus(), b.selection.setAtEnd(b.$el.find(".fr-selected-cell:last")
              .get(0)), b.selection.restore(), e(b.original_window)
            .scrollTop(h), b.button.bulkRefresh()
        }
      }
    }

    function showColorsPopup() {
      var c = B();
      if (c) {
        var d = b.popups.get("table.colors");
        d || (d = j()), b.popups.setContainer("table.colors", e(b.opts.scrollableContainer));
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
        var d = e(c.currentTarget)
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
        b.popups.isVisible("table.edit") && showEditPopup()
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
        b.popups.isVisible("table.colors") && showColorsPopup()
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

    function insert(c, d) {
      var e, f, g = '<table style="width: 100%;"><tbody>'
        , h = 100 / d;
      for (e = 0; c > e; e++) {
        for (g += "<tr>", f = 0; d > f; f++) g += '<td style="width: ' + h.toFixed(4) + '%;">', 0 === e && 0 === f && (g += e.FroalaEditor.MARKERS), g += "<br></td>";
        g += "</tr>"
      }
      g += "</tbody></table>", b.html.insert(g), b.selection.restore()
    }

    function remove() {
      if (b.$el.find(".fr-selected-cell")
        .length > 0) {
        var a = b.$el.find(".fr-selected-cell")
          .closest("table");
        b.selection.setBefore(a.get(0)) || b.selection.setAfter(a.get(0)), b.selection.restore(), b.popups.hide("table.edit"), a.remove()
      }
    }

    function addHeader() {
      var c = b.$el.find(".fr-selected-cell")
        .closest("table");
      if (c.length > 0 && 0 === c.find("th")
        .length) {
        var e, f = "<thead><tr>"
          , g = 0;
        for (c.find("tr:first > td")
          .each(function () {
            var b = e(this);
            g += parseInt(b.attr("colspan"), 10) || 1
          }), e = 0; g > e; e++) f += "<th><br></th>";
        f += "</tr></thead>", c.prepend(f), showEditPopup()
      }
    }

    function removeHeader() {
      var a = b.$el.find(".fr-selected-cell")
        .closest("table")
        , c = a.find("thead");
      if (c.length > 0)
        if (0 === a.find("tbody tr")
          .length) remove();
        else if (c.remove(), b.$el.find(".fr-selected-cell")
        .length > 0) showEditPopup();
      else {
        b.popups.hide("table.edit");
        var e = a.find("tbody tr:first td:first")
          .get(0);
        e && (b.selection.setAtEnd(e), b.selection.restore())
      }
    }

    function insertRow(c) {
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
              var k = e(h[g][f]);
              k.attr("rowspan", parseInt(k.attr("rowspan"), 10) + 1)
            }
          }
          else j += "<td><br></td>";
        j += "</tr>";
        var l = e(e.find("tr")
          .not(e.find("table tr"))
          .get(g));
        "below" == c ? l.after(j) : "above" == c && (l.before(j), showEditPopup())
      }
    }

    function deleteRow() {
      var c = b.$el.find(".fr-selected-cell")
        .closest("table");
      if (c.length > 0) {
        var d, e, f, g = B()
          , h = G(g);
        if (0 === h.min_i && h.max_i == g.length - 1) remove();
        else {
          for (d = h.max_i; d >= h.min_i; d--) {
            for (f = e(c.find("tr")
                .not(c.find("table tr"))
                .get(d)), e = 0; e < g[d].length; e++)
              if (0 === e || g[d][e] != g[d][e - 1]) {
                var i = e(g[d][e]);
                if (parseInt(i.attr("rowspan"), 10) > 1) {
                  var j = parseInt(i.attr("rowspan"), 10) - 1;
                  1 == j ? i.removeAttr("rowspan") : i.attr("rowspan", j)
                }
                if (d < g.length - 1 && g[d][e] == g[d + 1][e] && (0 === d || g[d][e] != g[d - 1][e])) {
                  for (var k = g[d][e], l = e; l > 0 && g[d][l] == g[d][l - 1];) l--;
                  0 === l ? e(c.find("tr")
                      .not(c.find("table tr"))
                      .get(d + 1))
                    .prepend(k) : e(g[d + 1][l - 1])
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

    function insertColumn(c) {
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
            i = e(this), i.data("old-width", i.outerWidth() / e.outerWidth() * 100)
          }), e.find("tr")
          .not(e.find("table tr"))
          .each(function (b) {
            for (var d, e = e(this), h = 0, i = 0; f > h - 1;) {
              if (d = e.find("> th, > td")
                .get(i), !d) {
                d = null;
                break
              }
              d == g[b][h] ? (h += parseInt(e(d)
                .attr("colspan"), 10) || 1, i++) : (h += parseInt(e(g[b][h])
                .attr("colspan"), 10) || 1, "after" == c && (d = 0 === i ? -1 : e.find("> th, > td")
                .get(i - 1)))
            }
            var l = e(d);
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
            i = e(this), i.data("old-width") && (i.css("width", (i.data("old-width") * k / j)
              .toFixed(4) + "%"), i.removeData("old-width"))
          }), showEditPopup()
      }
    }

    function deleteColumn() {
      var c = b.$el.find(".fr-selected-cell")
        .closest("table");
      if (c.length > 0) {
        var d, e, f, g = B()
          , h = G(g);
        if (0 === h.min_j && h.max_j == g[0].length - 1) remove();
        else {
          var i = 100 / g[0].length
            , j = 100 / (g[0].length - h.max_j + h.min_j - 1);
          for (c.find("th, td")
            .each(function () {
              f = e(this), f.hasClass("fr-selected-cell") || f.data("old-width", f.outerWidth() / c.outerWidth() * 100)
            }), e = h.max_j; e >= h.min_j; e--)
            for (d = 0; d < g.length; d++)
              if (0 === d || g[d][e] != g[d - 1][e])
                if (f = e(g[d][e]), parseInt(f.attr("colspan"), 10) > 1) {
                  var k = parseInt(f.attr("colspan"), 10) - 1;
                  1 == k ? f.removeAttr("colspan") : f.attr("colspan", k), f.css("width", ((f.data("old-width") - T(e, g)) * j / i)
                    .toFixed(4) + "%"), f.removeData("old-width")
                }
                else {
                  var l = e(f.parent()
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
              f = e(this), f.data("old-width") && (f.css("width", (f.data("old-width") * j / i)
                .toFixed(4) + "%"), f.removeData("old-width"))
            })
        }
      }
    }

    function mergeCells() {
      if (b.$el.find(".fr-selected-cell")
        .length > 1 && (0 === b.$el.find("th.fr-selected-cell")
          .length || 0 === b.$el.find("td.fr-selected-cell")
          .length)) {
        var c, e, f, g = B()
          , h = G(g)
          , i = b.$el.find(".fr-selected-cell")
          , j = e(i[0])
          , k = j.parent()
          , l = k.find(".fr-selected-cell")
          , m = j.closest("table")
          , n = j.html()
          , o = 0;
        for (c = 0; c < l.length; c++) o += e(l[c])
          .outerWidth();
        for (j.css("width", (o / k.outerWidth() * 100)
            .toFixed(4) + "%"), h.min_j < h.max_j && j.attr("colspan", h.max_j - h.min_j + 1), h.min_i < h.max_i && j.attr("rowspan", h.max_i - h.min_i + 1), c = 1; c < i.length; c++) e = e(i[c]), "<br>" != e.html() && "" !== e.html() && (n += "<br>" + e.html()), e.remove();
        j.html(n), b.selection.setAtEnd(j.get(0)), b.selection.restore(), b.toolbar.enable();
        var p = m.find("tr:empty");
        for (c = p.length - 1; c >= 0; c--) f = e(p[c]), (0 === f.prev()
          .length || 0 === f.next()
          .length || f.prev()
          .find("> th[rowspan], > td[rowspan]")
          .length < f.prev()
          .find("> th, > td")
          .length) && f.remove();
        showEditPopup()
      }
    }

    function splitCellHorizontally() {
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
          for (var k = h.row + j, l = 0 === h.col ? h.col : h.col - 1; l >= 0 && (g[k][l] == g[k][l - 1] || k > 0 && g[k][l] == g[k - 1][l]);) l--; - 1 == l ? e(e.find("tr")
              .not(e.find("table tr"))
              .get(k))
            .prepend(i) : e(g[k][l])
            .after(i)
        }
        else {
          var m, n = e("<tr>")
            .append(i);
          for (m = 0; m < g[0].length; m++)
            if (0 === m || g[h.row][m] != g[h.row][m - 1]) {
              var o = e(g[h.row][m]);
              o.is(c) || o.attr("rowspan", (parseInt(o.attr("rowspan"), 10) || 1) + 1)
            }
          d.after(n)
        }
        E(), b.popups.hide("table.edit")
      }
    }

    function splitCellVertically() {
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
          f = U(i.col, i.col + j - 1, h) / e * 100;
          var k = U(i.col + j, i.col + d - 1, h) / e * 100;
          j > 1 ? c.attr("colspan", j) : c.removeAttr("colspan"), d - j > 1 ? g.attr("colspan", d - j) : g.removeAttr("colspan"), c.css("width", f.toFixed(4) + "%"), g.css("width", k.toFixed(4) + "%")
        }
        else {
          var l;
          for (l = 0; l < h.length; l++)
            if (0 === l || h[l][i.col] != h[l - 1][i.col]) {
              var m = e(h[l][i.col]);
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

    function setBackground(a) {
      "REMOVE" != a ? b.$el.find(".fr-selected-cell")
        .css("background-color", b.helpers.HEXtoRGB(a)) : b.$el.find(".fr-selected-cell")
        .css("background-color", "")
    }

    function verticalAlign(a) {
      b.$el.find(".fr-selected-cell")
        .css("vertical-align", a)
    }

    function horizontalAlign(a) {
      b.$el.find(".fr-selected-cell")
        .css("text-align", a)
    }

    function applyStyle(a, b, c, d) {
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
        var e = showColorsPopup(c);
        return e.find("tr")
          .not(e.find("table tr"))
          .each(function (b, c) {
            var e = e(c)
              , f = 0;
            e.find("> th, > td")
              .each(function (c, e) {
                for (var g = e(e), h = parseInt(g.attr("colspan"), 10) || 1, i = parseInt(g.attr("rowspan"), 10) || 1, j = b; b + i > j; j++)
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
        var b = showColorsPopup(this);
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
      for (g = k; l >= g; g++)((parseInt(e(f[g][m])
        .attr("rowspan"), 10) || 1) > 1 || (parseInt(e(f[g][m])
        .attr("colspan"), 10) || 1) > 1) && (i = C(f[g][m], f), j = D(i.row, i.col, f), k = Math.min(i.row, k), l = Math.max(j.row, l), m = Math.min(i.col, m), n = Math.max(j.col, n)), ((parseInt(e(f[g][n])
        .attr("rowspan"), 10) || 1) > 1 || (parseInt(e(f[g][n])
        .attr("colspan"), 10) || 1) > 1) && (i = C(f[g][n], f), j = D(i.row, i.col, f), k = Math.min(i.row, k), l = Math.max(j.row, l), m = Math.min(i.col, m), n = Math.max(j.col, n));
      for (h = m; n >= h; h++)((parseInt(e(f[k][h])
        .attr("rowspan"), 10) || 1) > 1 || (parseInt(e(f[k][h])
        .attr("colspan"), 10) || 1) > 1) && (i = C(f[k][h], f), j = D(i.row, i.col, f), k = Math.min(i.row, k), l = Math.max(j.row, l), m = Math.min(i.col, m), n = Math.max(j.col, n)), ((parseInt(e(f[l][h])
        .attr("rowspan"), 10) || 1) > 1 || (parseInt(e(f[l][h])
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
        , d = e(b[c.min_i][c.min_j])
        , e = showColorsPopup(b[c.min_i][c.max_j])
        , f = e(b[c.max_i][c.min_j])
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
      if (e(b)
        .is(c)) E(), e(b)
        .addClass("fr-selected-cell");
      else {
        F();
        var d = B()
          , e = C(b, d)
          , f = C(c, d)
          , g = H(Math.min(e.row, f.row), Math.max(e.row, f.row), Math.min(e.col, f.col), Math.max(e.col, f.col), d);
        E();
        for (var h = g.min_i; h <= g.max_i; h++)
          for (var i = g.min_j; i <= g.max_j; i++) e(d[h][i])
            .addClass("fr-selected-cell")
      }
    }

    function K(c) {
      var d = null
        , e = showColorsPopup(c.target);
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
        var d = K(c);
        if (d) {
          b.popups.hide("table.edit"), c.stopPropagation(), b.events.trigger("image.hideResizer"), b.events.trigger("video.hideResizer"), _ = !0;
          var e = d.tagName.toLowerCase();
          c.shiftKey && e(e + ".fr-selected-cell")
            .length > 0 ? e(e(e + ".fr-selected-cell")
              .closest("table"))
            .is(e(d)
              .closest("table")) ? J(aa, d) : F() : ((b.keys.ctrlKey(c) || c.shiftKey) && F(), aa = d, J(aa, aa))
        }
      }
    }

    function M(c) {
      if (1 == c.which) {
        if (_) {
          _ = !1;
          var e = K(c);
          e || 1 != b.$el.find(".fr-selected-cell")
            .length ? b.$el.find(".fr-selected-cell")
            .length > 0 && (b.selection.isCollapsed() ? showEditPopup() : E()) : E()
        }
        else b.$tb.is(c.target) || b.$tb.is(e(c.target)
          .closest(b.$tb.get(0))) || (b.$el.get(0)
          .querySelectorAll(".fr-selected-cell")
          .length > 0 && b.toolbar.enable(), E());
        if (ca) {
          ca = !1, $.removeClass("fr-moving"), b.$el.removeClass("fr-no-selection"), b.edit.on(), $.find("div")
            .css("opacity", 0), $.hide();
          var f = parseFloat($.css("left")) + b.opts.tableResizerOffset;
          b.opts.iframe && (f -= b.$iframe.offset()
            .left), $.data("release-position", f), $.removeData("max-left"), $.removeData("max-right"), S(c)
        }
      }
    }

    function N(c) {
      if (_ === !0) {
        var d = showColorsPopup(c.currentTarget);
        if (d.closest("table")
          .is(b.$el.find(".fr-selected-cell")
            .closest("table"))) {
          if ("TD" == c.currentTarget.tagName && 0 === b.$el.find("th.fr-selected-cell")
            .length) return void J(aa, c.currentTarget);
          if ("TH" == c.currentTarget.tagName && 0 === b.$el.find("td.fr-selected-cell")
            .length) return void J(aa, c.currentTarget)
        }
        F()
      }
    }

    function O(a) {
      (37 == a.which || 38 == a.which || 39 == a.which || 40 == a.which) && b.$el.find(".fr-selected-cell")
        .length > 0 && (E(), b.popups.hide("table.edit"))
    }

    function P() {
      $ = showColorsPopup('<div class="fr-table-resizer"><div></div></div>'), b.$wp.append($), $.on("mousedown", function () {

        ca = !0, $.addClass("fr-moving"), E(), F(), $.find("div")
          .css("opacity", 1)
      }), b.events.on("destroy", function () {
        $.off("mousedown"), $.html("")
          .removeData()
          .remove()
      }, !0)
    }

    function Q(c) {
      ba = null;
      var d = b.document.elementFromPoint(c.pageX - b.window.pageXOffset, c.pageY - b.window.pageYOffset)
        , e = showColorsPopup(d);
      if (d && "TD" != d.tagName && "TH" != d.tagName && (e.closest("td")
          .length > 0 ? d = e.closest("td") : e.closest("th")
          .length > 0 && (d = e.closest("th"))), d && ("TD" == d.tagName || "TH" == d.tagName)) {
        if (e = e(d), 0 === b.$el.find(e)
          .length) return !1;
        var f = e.offset()
          .left - 1
          , g = f + e.outerWidth();
        if (Math.abs(c.pageX - f) <= b.opts.tableResizerOffset || Math.abs(g - c.pageX) <= b.opts.tableResizerOffset) {
          var h, i, j, k, l, m = B(e.closest("table"))
            , n = C(d, m)
            , o = D(n.row, n.col, m)
            , p = e.closest("table")
            , q = p.offset()
            .top
            , r = p.outerHeight() - 1;
          if (c.pageX - f <= b.opts.tableResizerOffset)
            if (j = f, n.col > 0 && m[n.row][n.col - 1]) {
              var s = e(m[n.row][n.col - 1]);
              k = 1 == (parseInt(s.attr("colspan"), 10) || 1) ? s.offset()
                .left - 1 + b.opts.tableResizingLimit : f - T(n.col - 1, m) + b.opts.tableResizingLimit, l = 1 == (parseInt(e.attr("colspan"), 10) || 1) ? f + e.outerWidth() - b.opts.tableResizingLimit : f + T(n.col, m) - b.opts.tableResizingLimit, h = n.col - 1, i = n.col
            }
            else h = null, i = n.col, k = p.parent()
              .offset()
              .left + parseFloat(p.parent()
                .css("padding-left")), l = p.offset()
              .left - 1 + p.outerWidth() - m[0].length * b.opts.tableResizingLimit;
          else if (g - c.pageX <= b.opts.tableResizerOffset)
            if (j = g, o.col < m[o.row].length && m[o.row][o.col + 1]) {
              var t = e(m[o.row][o.col + 1]);
              k = 1 == (parseInt(e.attr("colspan"), 10) || 1) ? f + b.opts.tableResizingLimit : g - T(o.col, m) + b.opts.tableResizingLimit, l = 1 == (parseInt(t.attr("colspan"), 10) || 1) ? g + t.outerWidth() - b.opts.tableResizingLimit : g + T(n.col + 1, m) - b.opts.tableResizingLimit, h = o.col, i = o.col + 1
            }
            else {
              h = o.col, i = null;
              var u = p.parent();
              k = p.offset()
                .left - 1 + m[0].length * b.opts.tableResizingLimit, l = u.offset()
                .left - 1 + u.width() + parseFloat(u.css("padding-left"))
            }
          $.data("table", p), $.data("first", h), $.data("second", i);
          var v = j - b.window.pageXOffset - b.opts.tableResizerOffset
            , w = q - b.window.pageYOffset;
          b.opts.iframe && (v += b.$iframe.offset()
              .left - e(b.original_window)
              .scrollLeft(), w += b.$iframe.offset()
              .top - e(b.original_window)
              .scrollTop(), k += b.$iframe.offset()
              .left, l += b.$iframe.offset()
              .left), $.data("max-left", k), $.data("max-right", l), $.data("origin", j - b.window.pageXOffset), $.css("top", w), $.css("left", v), $.css("height", r), $.find("div")
            .css("height", r), $.css("padding-left", b.opts.tableResizerOffset), $.css("padding-right", b.opts.tableResizerOffset), $.show()
        }
        else $.hide()
      }
    }

    function R() {
      if (ca) {
        var a = $.data("table");
        $.css("top", a.offset()
          .top - b.window.pageYOffset)
      }
    }

    function S() {
      var c = $.data("origin")
        , d = $.data("release-position");
      if (c !== d) {
        var e = $.data("first")
          , f = $.data("second")
          , g = $.data("table")
          , h = g.outerWidth();
        if (null !== e && null !== f) {
          var i, j, k, l = B(g)
            , m = []
            , n = []
            , o = []
            , p = [];
          for (i = 0; i < l.length; i++) j = e(l[i][e]), k = e(l[i][f]), m[i] = j.outerWidth(), o[i] = k.outerWidth(), n[i] = m[i] / h * 100, p[i] = o[i] / h * 100;
          for (i = 0; i < l.length; i++) {
            j = e(l[i][e]), k = e(l[i][f]);
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
      $.removeData("origin"), $.removeData("release-position"), $.removeData("first"), $.removeData("second"), $.removeData("table"), b.undo.saveStep()
    }

    function T(b, c) {
      var d, e = showColorsPopup(c[0][b])
        .outerWidth();
      for (d = 1; d < c.length; d++) e = Math.min(e, e(c[d][b])
        .outerWidth());
      return e
    }

    function U(a, b, c) {
      var d, e = 0;
      for (d = a; b >= d; d++) e += T(d, c);
      return e
    }

    function V(a) {
      if (_ === !1 && ca === !1) ba && clearTimeout(ba), ba = setTimeout(Q, 30, a);
      else if (ca) {
        var c = a.pageX - b.window.pageXOffset;
        b.opts.iframe && (c += b.$iframe.offset()
          .left);
        var d = $.data("max-left")
          , e = $.data("max-right");
        c >= d && e >= c ? $.css("left", c - b.opts.tableResizerOffset) : d > c && parseFloat($.css("left"), 10) > d - b.opts.tableResizerOffset ? $.css("left", d - b.opts.tableResizerOffset) : c > e && parseFloat($.css("left"), 10) < e - b.opts.tableResizerOffset && $.css("left", e - b.opts.tableResizerOffset)
      }
    }

    function W(c) {
      b.node.isEmpty(c.get(0)) ? c.prepend(showColorsPopup.FroalaEditor.MARKERS) : c.prepend(showColorsPopup.FroalaEditor.START_MARKER)
        .append(showColorsPopup.FroalaEditor.END_MARKER)
    }

    function X(c) {
      var d = c.which;
      if (d == e.FroalaEditor.KEYCODE.TAB && 0 === b.opts.tabSpaces) {
        var e;
        if (b.$el.find(".fr-selected-cell")
          .length > 0) e = b.$el.find(".fr-selected-cell:last");
        else {
          var f = b.selection.element();
          "TD" == f.tagName || "TH" == f.tagName ? e = e(f) : e(f)
            .closest("td")
            .length > 0 ? e = e(f)
            .closest("td") : e(f)
            .closest("th")
            .length > 0 && (e = e(f)
              .closest("th"))
        }
        e && (c.preventDefault(), E(), b.popups.hide("table.edit"), c.shiftKey ? e.prev()
          .length > 0 ? W(e.prev()) : e.closest("tr")
          .length > 0 && e.closest("tr")
          .prev()
          .length > 0 ? W(e.closest("tr")
            .prev()
            .find("td:last")) : e.closest("tbody")
          .length > 0 && e.closest("table")
          .find("thead tr")
          .length > 0 && W(e.closest("table")
            .find("thead tr th:last")) : e.next()
          .length > 0 ? W(e.next()) : e.closest("tr")
          .length > 0 && e.closest("tr")
          .next()
          .length > 0 ? W(e.closest("tr")
            .next()
            .find("td:first")) : e.closest("thead")
          .length > 0 && e.closest("table")
          .find("tbody tr")
          .length > 0 ? W(e.closest("table")
            .find("tbody tr td:first")) : (e.addClass("fr-selected-cell"), insertRow("below"), E(), W(e.closest("tr")
            .next()
            .find("td:first"))), b.selection.restore())
      }
    }

    function _init() {
      return b.$wp ? (b.helpers.isMobile() || (_ = !1, ca = !1, P(), b.$el.on("mousedown.table" + b.id, L), b.popups.onShow("image.edit", function () {
          E(), _ = !1
        }), b.popups.onShow("link.edit", function () {
          E(), _ = !1
        }), b.events.on("commands.mousedown", function (a) {
          a.parents(".fr-toolbar")
            .length > 0 && E()
        }), b.$el.on("mouseenter.table" + b.id, "th, td", N), b.$window.on("mouseup.table" + b.id, M), b.$el.on("keydown.table" + b.id, O), b.$window.on("mousemove.table" + b.id, V), showColorsPopup(b.window)
        .on("scroll.table" + b.id, R), b.events.on("contentChanged", function () {
          b.$el.find(".fr-selected-cell")
            .length > 0 && (showEditPopup(), b.$el.find("img")
              .on("load.selected-cells", function () {
                showColorsPopup(this)
                  .off("load.selected-cells"), b.$el.find(".fr-selected-cell")
                  .length > 0 && showEditPopup()
              }))
        }), showColorsPopup(b.original_window)
        .on("resize.table" + b.id, function () {
          E()
        }), showColorsPopup(b.window)
        .on("keydown.table" + b.id, function (c) {
          if (b.$el.find(".fr-selected-cell")
            .length > 0) {
            if (c.which == showColorsPopup.FroalaEditor.KEYCODE.ESC) return E(), c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), !1;
            if (c.which == showColorsPopup.FroalaEditor.KEYCODE.BACKSPACE) return c.preventDefault(), !1;
            if (b.$el.find(".fr-selected-cell")
              .length > 1) return c.preventDefault(), !1
          }
        }), showColorsPopup(b.window)
        .on("keydown.table" + b.id, showEditPopup), showColorsPopup(b.window)
        .on("input.table" + b.id, showEditPopup), showColorsPopup(b.window)
        .on("keyup.table" + b.id, showEditPopup), b.events.on("html.get", function (a) {
          return a = a.replace(/<(td|th)((?:[\w\W]*?))class="([\w\W]*?)fr-selected-cell([\w\W]*?)"((?:[\w\W]*?))>((?:[\w\W]*?))<\/(td|th)>/g, '<$1$2class="$3$4"$5>$6</$7>'), a = a.replace(/<(td|th)((?:[\w\W]*?)) class=""((?:[\w\W]*?))>((?:[\w\W]*?))<\/(td|th)>/g, "<$1$2$3>$4</$5>")
        }), b.events.on("destroy", function () {
          b.$el.off("mousedown.table" + b.id), b.$el.off("mouseenter.table" + b.id, "th, td"), b.$window.off("mouseup.table" + b.id), b.$el.off("keydown.table" + b.id), b.$window.off("mousemove.table" + b.id), showColorsPopup(b.window)
            .off("scroll.table" + b.id), showColorsPopup(b.window)
            .off("keydown.table" + b.id), showColorsPopup(b.window)
            .off("input.table" + b.id), showColorsPopup(b.window)
            .off("keyup.table" + b.id)
        }, !0)), void b.events.on("keydown", X, !0)) : !1
    }

    function back() {
      b.$el.find(".fr-selected-cell")
        .length > 0 ? showEditPopup() : (b.popups.hide("table.insert"), b.toolbar.showInline())
    }
    var $, _, aa, ba, ca;
    return {
      _init: _init
      , insert: insert
      , remove: remove
      , insertRow: insertRow
      , deleteRow: deleteRow
      , insertColumn: insertColumn
      , deleteColumn: deleteColumn
      , mergeCells: mergeCells
      , splitCellVertically: splitCellVertically
      , splitCellHorizontally: splitCellHorizontally
      , addHeader: addHeader
      , removeHeader: removeHeader
      , setBackground: setBackground
      , showInsertPopup: showInsertPopup
      , showEditPopup: showEditPopup
      , showColorsPopup: showColorsPopup
      , back: back
      , verticalAlign: verticalAlign
      , horizontalAlign: horizontalAlign
      , applyStyle: applyStyle
    }
  }, e.FroalaEditor.DefineIcon("insertTable", {
    NAME: "table"
  }), e.FroalaEditor.RegisterCommand("insertTable", {
    title: "Insert Table"
    , undo: !1
    , focus: !0
    , refreshOnCallback: !1
    , popup: !0
    , callback: function () {
      this.popups.isVisible("table.insert") ? (this.$el.find(".fr-marker") && (this.events.disableBlur(), this.selection.restore()), this.popups.hide("table.insert")) : this.table.showInsertPopup()
    }
    , plugin: "table"
  }), e.FroalaEditor.RegisterCommand("tableInsert", {
    callback: function (a, b, c) {
      this.table.insert(b, c), this.popups.hide("table.insert")
    }
  }), e.FroalaEditor.DefineIcon("tableHeader", {
    NAME: "header"
  }), e.FroalaEditor.RegisterCommand("tableHeader", {
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
  }), e.FroalaEditor.DefineIcon("tableRows", {
    NAME: "bars"
  }), e.FroalaEditor.RegisterCommand("tableRows", {
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
        , c = e.FroalaEditor.COMMANDS.tableRows.options;
      for (var d in c) b += '<li><a class="fr-command" data-cmd="tableRows" data-param1="' + d + '" title="' + this.language.translate(c[d]) + '">' + this.language.translate(c[d]) + "</a></li>";
      return b += "</ul>"
    }
    , callback: function (a, b) {
      "above" == b || "below" == b ? this.table.insertRow(b) : this.table.deleteRow()
    }
  }), e.FroalaEditor.DefineIcon("tableColumns", {
    NAME: "bars fa-rotate-90"
  }), e.FroalaEditor.RegisterCommand("tableColumns", {
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
        , c = e.FroalaEditor.COMMANDS.tableColumns.options;
      for (var d in c) b += '<li><a class="fr-command" data-cmd="tableColumns" data-param1="' + d + '" title="' + this.language.translate(c[d]) + '">' + this.language.translate(c[d]) + "</a></li>";
      return b += "</ul>"
    }
    , callback: function (a, b) {
      "before" == b || "after" == b ? this.table.insertColumn(b) : this.table.deleteColumn()
    }
  }), e.FroalaEditor.DefineIcon("tableCells", {
    NAME: "square-o"
  }), e.FroalaEditor.RegisterCommand("tableCells", {
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
        , c = e.FroalaEditor.COMMANDS.tableCells.options;
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
  }), e.FroalaEditor.DefineIcon("tableRemove", {
    NAME: "trash"
  }), e.FroalaEditor.RegisterCommand("tableRemove", {
    title: "Remove Table"
    , focus: !1
    , callback: function () {
      this.table.remove()
    }
  }), e.FroalaEditor.DefineIcon("tableStyle", {
    NAME: "paint-brush"
  }), e.FroalaEditor.RegisterCommand("tableStyle", {
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
          var b = e(this)
            .data("param1");
          e(this)
            .toggleClass("fr-active", d.hasClass(b))
        })
    }
  }), e.FroalaEditor.DefineIcon("tableCellBackground", {
    NAME: "tint"
  }), e.FroalaEditor.RegisterCommand("tableCellBackground", {
    title: "Cell Background"
    , focus: !1
    , callback: function () {
      this.table.showColorsPopup()
    }
  }), e.FroalaEditor.RegisterCommand("tableCellBackgroundColor", {
    undo: !0
    , focus: !1
    , callback: function (a, b) {
      this.table.setBackground(b)
    }
  }), e.FroalaEditor.DefineIcon("tableBack", {
    NAME: "arrow-left"
  }), e.FroalaEditor.RegisterCommand("tableBack", {
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
  }), e.FroalaEditor.DefineIcon("tableCellVerticalAlign", {
    NAME: "arrows-v"
  }), e.FroalaEditor.RegisterCommand("tableCellVerticalAlign", {
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
        , c = e.FroalaEditor.COMMANDS.tableCellVerticalAlign.options;
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
  }), e.FroalaEditor.DefineIcon("tableCellHorizontalAlign", {
    NAME: "align-left"
  }), e.FroalaEditor.DefineIcon("align-left", {
    NAME: "align-left"
  }), e.FroalaEditor.DefineIcon("align-right", {
    NAME: "align-right"
  }), e.FroalaEditor.DefineIcon("align-center", {
    NAME: "align-center"
  }), e.FroalaEditor.DefineIcon("align-justify", {
    NAME: "align-justify"
  }), e.FroalaEditor.RegisterCommand("tableCellHorizontalAlign", {
    type: "dropdown"
    , focus: !1
    , title: "Horizontal Align"
    , options: {
      left: "Align Left"
      , center: "Align Center"
      , right: "Align Right"
      , justify: "Align Justify"
    }
    , html: function () {
      var b = '<ul class="fr-dropdown-list">'
        , c = e.FroalaEditor.COMMANDS.tableCellHorizontalAlign.options;
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
  }), e.FroalaEditor.DefineIcon("tableCellStyle", {
    NAME: "magic"
  }), e.FroalaEditor.RegisterCommand("tableCellStyle", {
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
          var b = e(this)
            .data("param1");
          e(this)
            .toggleClass("fr-active", d.hasClass(b))
        })
    }
  })
})