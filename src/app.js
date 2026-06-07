/* ============================================================================
   Our Family Recipe Book — cookbook view
   ----------------------------------------------------------------------------
   Renders Julie's "Sage & Clay" cookbook from data, and adds search, chapter
   filtering, printing (whole book or a single recipe), and import/export.
   Persistence + the editor form live in store.js / editor.js (shared with the
   dashboard) so both views always agree.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.CookbookStore;
  var MARK = S.MARK, esc = S.esc, slugify = S.slugify, catId = S.catId, recId = S.recId;

  // ── state ────────────────────────────────────────────────────────────────
  var recipes = [];
  var query = "";
  var catFilter = "all";
  var observer = null;

  function persist(next) { recipes = next; S.save(recipes); }

  // ── filtering ──────────────────────────────────────────────────────────
  function matches(r, q) {
    if (!q) return true;
    var hay = [r.title, r.category, r.source, r.story, r.note];
    (r.ingredientGroups || []).forEach(function (g) {
      hay.push(g.heading);
      (g.items || []).forEach(function (i) { hay.push(i); });
    });
    (r.steps || []).forEach(function (s) { hay.push(s); });
    return hay.join(" \n ").toLowerCase().indexOf(q) !== -1;
  }

  function visibleRecipes() {
    var q = query.trim().toLowerCase();
    return recipes.filter(function (r) {
      if (catFilter !== "all" && r.category !== catFilter) return false;
      return matches(r, q);
    });
  }

  function filtering() { return query.trim() !== "" || catFilter !== "all"; }

  // ── rendering ──────────────────────────────────────────────────────────
  function render() {
    var stage = document.getElementById("stage");
    var sidebar = document.getElementById("sidebar");
    var vis = visibleRecipes();
    var cats = S.orderedCategories(recipes);
    var meta = window.COOKBOOK_META || {};

    var byCat = {};
    vis.forEach(function (r) { (byCat[r.category] = byCat[r.category] || []).push(r); });
    var activeCats = cats.filter(function (c) { return byCat[c] && byCat[c].length; });

    var html = "";
    if (!filtering()) {
      html += coverHTML(meta);
      html += contentsHTML(activeCats, byCat);
    }
    if (vis.length === 0) {
      html += emptyStateHTML();
    } else {
      activeCats.forEach(function (cat, idx) {
        html += dividerHTML(cat, byCat[cat], idx + 1, meta);
        byCat[cat].forEach(function (r) { html += recipeHTML(r); });
      });
    }
    stage.innerHTML = html;
    sidebar.innerHTML = sidebarHTML(activeCats, byCat, meta);

    wireDynamic();
    setupScrollSpy();
  }

  function coverHTML(meta) {
    return '<section class="page cover" id="cover"><div class="frame">' +
      '<div class="mark">' + MARK + '</div>' +
      '<div class="cover-mid">' +
        '<h1 class="a-hero">' + esc(meta.title || "Our Family").replace(/\s+/, "<br>") + '</h1>' +
        '<div class="a-label">' + esc(meta.subtitle || "Recipe Book") + '</div>' +
        '<div class="cover-rule"><div class="rule"></div><span class="dot"></span><div class="rule"></div></div>' +
      '</div>' +
      '<div class="tagline">' + esc(meta.tagline || "") + '</div>' +
    '</div></section>';
  }

  function contentsHTML(activeCats, byCat) {
    var rows = activeCats.map(function (cat, i) {
      var n = byCat[cat].length;
      return '<a class="row" data-jump="' + esc(catId(cat)) + '">' +
        '<span class="num">' + ("0" + (i + 1)).slice(-2) + '</span>' +
        '<span class="nm">' + esc(cat) + '</span>' +
        '<span class="ct">' + n + ' recipe' + (n === 1 ? "" : "s") + '</span></a>';
    }).join("");
    return '<section class="page contents">' +
      '<div class="mark">' + MARK + '</div>' +
      '<div class="c-title">Contents</div>' +
      '<div class="toc">' + rows + '</div></section>';
  }

  function dividerHTML(cat, list, num, meta) {
    var items = list.map(function (r) { return '<div class="item">' + esc(r.title) + '</div>'; }).join("");
    return '<section class="page divider" id="' + esc(catId(cat)) + '">' +
      '<div class="top">' +
        '<span class="chapter-num">no. ' + ("0" + num).slice(-2) + '</span>' +
        '<span class="cat-eyebrow">' + esc(meta.title || "Our Family") + ' ' + esc(meta.subtitle || "Recipe Book") + '</span>' +
      '</div>' +
      '<div class="center"><h2 class="cat-title">' + esc(cat) + '</h2>' +
        '<div class="index">' + items + '</div></div>' +
      '<div class="footer"><div class="rule"></div><div class="mark">' + MARK + '</div><div class="rule"></div></div>' +
    '</section>';
  }

  function recipeHTML(r) {
    var metaBlocks = (r.meta || []).filter(function (m) { return m && (m.k || m.v); })
      .map(function (m) { return '<div class="blk"><span class="k">' + esc(m.k) + '</span><br><span class="v">' + esc(m.v) + '</span></div>'; }).join("");

    var groups = (r.ingredientGroups || []).map(function (g, i) {
      var items = (g.items || []).filter(function (x) { return x && x.trim(); })
        .map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("");
      return '<h3 class="' + (i === 0 ? "sec" : "sec mt") + '">' + esc(g.heading || "Ingredients") + '</h3>' +
        '<ul class="ingredients">' + items + '</ul>';
    }).join("");

    var steps = (r.steps || []).filter(function (s) { return s && s.trim(); })
      .map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("");

    var note = r.note && r.note.trim() ? '<div class="note"><span class="nlabel">Note</span>' + esc(r.note) + '</div>' : "";
    var from = r.source && r.source.trim() ? '<span class="from"><span class="who">' + esc(r.source) + '</span></span>' : "";
    var story = r.story && r.story.trim() ? '<p class="story">' + esc(r.story) + '</p>' : "";

    return '<section class="page recipe" id="' + esc(recId(r)) + '" data-id="' + esc(r.id) + '">' +
      '<div class="r-actions">' +
        '<button class="edit" data-edit="' + esc(r.id) + '">Edit</button>' +
        '<button class="print" data-print="' + esc(r.id) + '">Print</button>' +
        '<button class="del" data-del="' + esc(r.id) + '">Delete</button>' +
      '</div>' +
      '<div class="r-head"><div>' +
        '<div class="r-cat">' + esc(r.category) + '</div>' +
        '<h2 class="r-title">' + esc(r.title) + '</h2>' +
      '</div><div class="meta">' + metaBlocks + '</div></div>' +
      '<div class="rule r-rule"></div>' + story +
      '<div class="cols"><div>' + groups + '</div>' +
        '<div><h3 class="sec">Directions</h3><ol class="steps">' + steps + '</ol>' + note + '</div></div>' +
      '<div class="r-foot"><div class="rule"></div>' + from + '<div class="mark">' + MARK + '</div></div>' +
    '</section>';
  }

  function emptyStateHTML() {
    var msg = filtering()
      ? "No recipes match your search. Try different words, or clear the filter."
      : "Your cookbook is empty. Add a recipe from the dashboard to get started.";
    return '<div class="empty-state"><div class="mark">' + MARK + '</div>' +
      '<h2>Nothing here yet</h2><p>' + esc(msg) + '</p></div>';
  }

  function sidebarHTML(activeCats, byCat, meta) {
    var h = '<div class="nav-brand">' + esc(meta.title || "Our Family") + '<br>' + esc(meta.subtitle || "Recipe Book") + '</div>' +
      '<div class="nav-tag">' + esc(meta.collection || "Sage & Clay") + '</div>' +
      '<a class="nav-top" href="dashboard.html" style="text-decoration:none;text-align:center;">&#9881; Recipe Dashboard</a>' +
      '<button class="nav-top" data-jump="cover">&#8593; Cover &amp; Contents</button>';
    if (activeCats.length === 0) { h += '<div class="nav-chapter" style="color:#9AA08C">No recipes</div>'; return h; }
    activeCats.forEach(function (cat) {
      h += '<div class="nav-chapter"><a class="nav-link" data-jump="' + esc(catId(cat)) + '">' + esc(cat) + '</a></div>';
      byCat[cat].forEach(function (r) {
        h += '<a class="nav-link" id="nl-' + esc(recId(r)) + '" data-jump="' + esc(recId(r)) + '">' + esc(r.title) + '</a>';
      });
    });
    return h;
  }

  // ── navigation / scroll spy ──────────────────────────────────────────────
  function jumpTo(id) {
    closeNav();
    setTimeout(function () { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 60);
  }

  function setupScrollSpy() {
    if (observer) observer.disconnect();
    if (!("IntersectionObserver" in window)) return;
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav a.nav-link[id^="nl-"]'));
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var l = document.getElementById("nl-" + en.target.id);
          if (l) { l.classList.add("active"); l.scrollIntoView({ block: "nearest" }); }
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    document.querySelectorAll(".page[id]").forEach(function (p) { observer.observe(p); });
  }

  function wireDynamic() {
    document.querySelectorAll("[data-jump]").forEach(function (el) {
      el.addEventListener("click", function () { jumpTo(el.getAttribute("data-jump")); });
    });
    document.querySelectorAll("[data-edit]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.stopPropagation(); CookbookEditor.open(findRecipe(b.getAttribute("data-edit"))); });
    });
    document.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.stopPropagation(); CookbookEditor.remove(b.getAttribute("data-del")); });
    });
    document.querySelectorAll("[data-print]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.stopPropagation(); printRecipe(b.getAttribute("data-print")); });
    });
  }

  function findRecipe(id) {
    for (var i = 0; i < recipes.length; i++) if (recipes[i].id === id) return recipes[i];
    return null;
  }

  // Print (or save as PDF) a single recipe by temporarily hiding the rest.
  function printRecipe(id) {
    var target = "recipe-" + id;
    var pages = document.querySelectorAll("#stage .page");
    pages.forEach(function (p) { if (p.id !== target) p.classList.add("hidden-print"); });
    var cleaned = false;
    var cleanup = function () {
      if (cleaned) return; cleaned = true;
      pages.forEach(function (p) { p.classList.remove("hidden-print"); });
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    setTimeout(cleanup, 400);
  }

  // ── sidebar open/close (narrow screens) ──────────────────────────────────
  function openNav() { document.body.classList.add("nav-open"); var t = document.getElementById("navToggle"); if (t) t.classList.add("open"); }
  function closeNav() { document.body.classList.remove("nav-open"); var t = document.getElementById("navToggle"); if (t) t.classList.remove("open"); }
  function toggleNav() { document.body.classList.contains("nav-open") ? closeNav() : openNav(); }

  // ── import / export / reset ───────────────────────────────────────────────
  function exportJSON() {
    var payload = {
      type: "our-family-recipe-book", version: 1, exportedAt: new Date().toISOString(),
      meta: window.COOKBOOK_META, categories: window.COOKBOOK_CATEGORIES, recipes: recipes,
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "our-family-recipe-book-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function importJSON(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var list = Array.isArray(data) ? data : data.recipes;
        if (!Array.isArray(list) || !list.length) throw new Error("No recipes found in that file.");
        list = list.filter(function (r) { return r && r.title; }).map(S.normalizeRecipe);
        if (!list.length) throw new Error("That file didn't contain any valid recipes.");

        var merge = confirm(
          "Import " + list.length + " recipe(s).\n\n" +
          "OK = MERGE with your current recipes (matching titles are updated).\n" +
          "Cancel = REPLACE everything with the imported file.");
        var next;
        if (merge) {
          next = recipes.slice();
          list.forEach(function (incoming) {
            var idx = -1;
            for (var i = 0; i < next.length; i++) {
              if (next[i].id === incoming.id || next[i].title.toLowerCase() === incoming.title.toLowerCase()) { idx = i; break; }
            }
            if (idx >= 0) { incoming.id = next[idx].id; next[idx] = incoming; }
            else { incoming.id = S.uniqueId(next, S.slugify(incoming.title)); next.push(incoming); }
          });
        } else {
          var ids = {}; next = list.map(function (r) {
            var base = S.slugify(r.title), id = base, n = 2;
            while (ids[id]) { id = base + "-" + n; n++; }
            ids[id] = true; r.id = id; return r;
          });
        }
        persist(next); syncCategoryFilter(); render();
        alert("Imported " + list.length + " recipe(s).");
      } catch (e) { alert("Could not import that file.\n\n" + e.message); }
    };
    reader.readAsText(file);
  }

  function resetToSeed() {
    if (!confirm("Restore the original collection?\n\nThis removes any recipes you've added and undoes your edits on this device. Consider exporting a backup first.")) return;
    persist(S.seed()); syncCategoryFilter(); render();
  }

  // ── category filter dropdown ──────────────────────────────────────────────
  function syncCategoryFilter() {
    var sel = document.getElementById("categoryFilter");
    var cats = S.orderedCategories(recipes);
    sel.innerHTML = '<option value="all">All chapters</option>' +
      cats.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + "</option>"; }).join("");
    if (catFilter !== "all" && cats.indexOf(catFilter) === -1) catFilter = "all";
    sel.value = catFilter;
  }

  // ── wiring (one-time) ──────────────────────────────────────────────────────
  function wireOnce() {
    CookbookEditor.init({
      getRecipes: function () { return recipes; },
      commit: function (next, data, kind) {
        persist(next); syncCategoryFilter(); render();
        if (data && kind !== "delete") setTimeout(function () { jumpTo(recId(data)); }, 80);
      },
    });

    document.getElementById("navToggle").addEventListener("click", toggleNav);
    document.getElementById("navBackdrop").addEventListener("click", closeNav);

    var searchInput = document.getElementById("searchInput");
    var searchWrap = document.getElementById("searchWrap");
    searchInput.addEventListener("input", function () {
      query = searchInput.value; searchWrap.classList.toggle("has-text", query.length > 0); render();
    });
    document.getElementById("searchClear").addEventListener("click", function () {
      searchInput.value = ""; query = ""; searchWrap.classList.remove("has-text"); searchInput.focus(); render();
    });
    document.getElementById("categoryFilter").addEventListener("change", function (e) { catFilter = e.target.value; render(); });
    document.getElementById("addBtn").addEventListener("click", function () { CookbookEditor.open(null); });

    var moreMenu = document.getElementById("moreMenu");
    document.getElementById("moreBtn").addEventListener("click", function (e) { e.stopPropagation(); moreMenu.classList.toggle("open"); });
    document.addEventListener("click", function () { moreMenu.classList.remove("open"); });
    moreMenu.querySelector(".menu-pop").addEventListener("click", function (e) { e.stopPropagation(); });
    document.getElementById("printBtn").addEventListener("click", function () { moreMenu.classList.remove("open"); window.print(); });
    document.getElementById("exportBtn").addEventListener("click", function () { moreMenu.classList.remove("open"); exportJSON(); });
    document.getElementById("importBtn").addEventListener("click", function () { moreMenu.classList.remove("open"); document.getElementById("importFile").click(); });
    document.getElementById("resetBtn").addEventListener("click", function () { moreMenu.classList.remove("open"); resetToSeed(); });
    document.getElementById("importFile").addEventListener("change", function (e) {
      if (e.target.files && e.target.files[0]) importJSON(e.target.files[0]); e.target.value = "";
    });

    // Keep in sync if the dashboard (another window/tab) changes the data.
    window.addEventListener("storage", function (e) {
      if (e.key === S.STORE_KEY) { recipes = S.load(); syncCategoryFilter(); render(); }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { if (!CookbookEditor.isOpen()) closeNav(); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") { e.preventDefault(); searchInput.focus(); searchInput.select(); }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") { e.preventDefault(); CookbookEditor.open(null); }
    });

    if (window.cookbookAPI && window.cookbookAPI.onMenu) {
      window.cookbookAPI.onMenu(function (action) {
        if (action === "add") CookbookEditor.open(null);
        else if (action === "export") exportJSON();
        else if (action === "import") document.getElementById("importFile").click();
        else if (action === "print") window.print();
        else if (action === "reset") resetToSeed();
        else if (action === "search") { searchInput.focus(); searchInput.select(); }
        else if (action === "dashboard") window.location.href = "dashboard.html";
      });
    }
  }

  // ── boot ───────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    recipes = S.load();
    wireOnce();
    syncCategoryFilter();
    render();
    // Deep-link support: index.html#recipe-<id> (used by the dashboard).
    if (location.hash && location.hash.length > 1) {
      var id = decodeURIComponent(location.hash.slice(1));
      setTimeout(function () { jumpTo(id); }, 120);
    }
  });
})();
