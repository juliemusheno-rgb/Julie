/* ============================================================================
   Our Family Recipe Book — app logic
   ----------------------------------------------------------------------------
   Renders Julie's "Sage & Clay" cookbook from data, and adds:
     • search + chapter filtering
     • add / edit / delete recipes (saved to localStorage on this device)
     • export / import (.json) and print / save-as-PDF
   No network or backend required — everything lives in the browser store.
   ========================================================================== */
(function () {
  "use strict";

  var STORE_KEY = "ourFamilyRecipeBook.v1";

  // The hand-drawn herb sprig that appears on every page.
  var MARK = '<svg viewBox="0 0 60 72"><path d="M30 70 C30 52 30 28 30 10" stroke="var(--primary)" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="24" rx="9.5" ry="4.6" transform="rotate(-32 23 24)" fill="var(--primary-light)"/><ellipse cx="37" cy="33" rx="9.5" ry="4.6" transform="rotate(32 37 33)" fill="var(--primary-light)"/><ellipse cx="23" cy="42" rx="8.5" ry="4.2" transform="rotate(-32 23 42)" fill="var(--primary)"/><ellipse cx="37" cy="51" rx="8.5" ry="4.2" transform="rotate(32 37 51)" fill="var(--primary)"/><circle cx="30" cy="11" r="3.6" fill="var(--accent)"/></svg>';

  // ── state ────────────────────────────────────────────────────────────────
  var recipes = [];      // current working set
  var query = "";        // search text
  var catFilter = "all"; // selected chapter
  var observer = null;

  // ── persistence ────────────────────────────────────────────────────────
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) { /* fall through to seed */ }
    return deepClone(window.COOKBOOK_SEED || []);
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(recipes));
    } catch (e) {
      alert("Sorry — your changes could not be saved to this device's storage.\n" + e.message);
    }
  }

  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  // ── helpers ──────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function slugify(s) {
    return String(s || "recipe").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "recipe";
  }

  function catId(cat) { return "chapter-" + slugify(cat); }
  function recId(r) { return "recipe-" + r.id; }

  function uniqueId(base) {
    var id = base, n = 2;
    var taken = {};
    recipes.forEach(function (r) { taken[r.id] = true; });
    while (taken[id]) { id = base + "-" + n; n++; }
    return id;
  }

  // Chapters in canonical order, followed by any custom ones in order of use.
  function orderedCategories() {
    var canonical = window.COOKBOOK_CATEGORIES || [];
    var seen = {}, out = [];
    canonical.forEach(function (c) { seen[c] = true; });
    var present = {};
    recipes.forEach(function (r) { present[r.category] = true; });
    canonical.forEach(function (c) { if (present[c]) out.push(c); });
    recipes.forEach(function (r) {
      if (!seen[r.category] && out.indexOf(r.category) === -1) out.push(r.category);
    });
    return out;
  }

  // All chapter names (even empty) for the editor dropdown.
  function allCategoryNames() {
    var canonical = window.COOKBOOK_CATEGORIES || [];
    var out = canonical.slice();
    recipes.forEach(function (r) {
      if (out.indexOf(r.category) === -1) out.push(r.category);
    });
    return out;
  }

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

  var filtering = function () { return query.trim() !== "" || catFilter !== "all"; };

  // ── rendering ──────────────────────────────────────────────────────────
  function render() {
    var stage = document.getElementById("stage");
    var sidebar = document.getElementById("sidebar");
    var vis = visibleRecipes();
    var cats = orderedCategories();
    var meta = window.COOKBOOK_META || {};

    // group visible recipes by category, preserving collection order
    var byCat = {};
    vis.forEach(function (r) { (byCat[r.category] = byCat[r.category] || []).push(r); });
    var activeCats = cats.filter(function (c) { return byCat[c] && byCat[c].length; });

    // ---- stage ----
    var html = "";
    if (!filtering()) {
      html += coverHTML(meta);
      html += contentsHTML(activeCats, byCat, meta);
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

    // ---- sidebar ----
    sidebar.innerHTML = sidebarHTML(activeCats, byCat, meta);

    wireDynamic();
    setupScrollSpy();
  }

  function coverHTML(meta) {
    return '' +
      '<section class="page cover" id="cover"><div class="frame">' +
        '<div class="mark">' + MARK + '</div>' +
        '<div class="cover-mid">' +
          '<h1 class="a-hero">' + esc(meta.title || "Our Family").replace(/\s+/, "<br>") + '</h1>' +
          '<div class="a-label">' + esc(meta.subtitle || "Recipe Book") + '</div>' +
          '<div class="cover-rule"><div class="rule"></div><span class="dot"></span><div class="rule"></div></div>' +
        '</div>' +
        '<div class="tagline">' + esc(meta.tagline || "") + '</div>' +
      '</div></section>';
  }

  function contentsHTML(activeCats, byCat, meta) {
    var rows = activeCats.map(function (cat, i) {
      var n = byCat[cat].length;
      var num = ("0" + (i + 1)).slice(-2);
      return '<a class="row" data-jump="' + esc(catId(cat)) + '">' +
        '<span class="num">' + num + '</span>' +
        '<span class="nm">' + esc(cat) + '</span>' +
        '<span class="ct">' + n + ' recipe' + (n === 1 ? "" : "s") + '</span></a>';
    }).join("");
    return '<section class="page contents">' +
      '<div class="mark">' + MARK + '</div>' +
      '<div class="c-title">Contents</div>' +
      '<div class="toc">' + rows + '</div></section>';
  }

  function dividerHTML(cat, list, num, meta) {
    var items = list.map(function (r) {
      return '<div class="item">' + esc(r.title) + '</div>';
    }).join("");
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
      .map(function (m) {
        return '<div class="blk"><span class="k">' + esc(m.k) + '</span><br><span class="v">' + esc(m.v) + '</span></div>';
      }).join("");

    var groups = (r.ingredientGroups || []).map(function (g, i) {
      var items = (g.items || []).filter(function (x) { return x && x.trim(); })
        .map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("");
      var cls = i === 0 ? "sec" : "sec mt";
      return '<h3 class="' + cls + '">' + esc(g.heading || "Ingredients") + '</h3>' +
        '<ul class="ingredients">' + items + '</ul>';
    }).join("");

    var steps = (r.steps || []).filter(function (s) { return s && s.trim(); })
      .map(function (s) { return '<li>' + esc(s) + '</li>'; }).join("");

    var note = r.note && r.note.trim()
      ? '<div class="note"><span class="nlabel">Note</span>' + esc(r.note) + '</div>' : "";

    var from = r.source && r.source.trim()
      ? '<span class="from"><span class="who">' + esc(r.source) + '</span></span>' : "";

    var story = r.story && r.story.trim()
      ? '<p class="story">' + esc(r.story) + '</p>' : "";

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
      '<div class="rule r-rule"></div>' +
      story +
      '<div class="cols"><div>' + groups + '</div>' +
        '<div><h3 class="sec">Directions</h3><ol class="steps">' + steps + '</ol>' + note + '</div></div>' +
      '<div class="r-foot"><div class="rule"></div>' + from + '<div class="mark">' + MARK + '</div></div>' +
    '</section>';
  }

  function emptyStateHTML() {
    var msg = filtering()
      ? "No recipes match your search. Try different words, or clear the filter."
      : "Your cookbook is empty. Add your first recipe to get started.";
    return '<div class="empty-state"><div class="mark">' + MARK + '</div>' +
      '<h2>Nothing here yet</h2><p>' + esc(msg) + '</p></div>';
  }

  function sidebarHTML(activeCats, byCat, meta) {
    var h = '<div class="nav-brand">' + esc(meta.title || "Our Family") + '<br>' + esc(meta.subtitle || "Recipe Book") + '</div>' +
      '<div class="nav-tag">' + esc(meta.collection || "Sage & Clay") + '</div>' +
      '<button class="nav-top" data-jump="cover">&#8593; Cover &amp; Contents</button>';
    if (activeCats.length === 0) {
      h += '<div class="nav-chapter" style="color:#9AA08C">No recipes</div>';
      return h;
    }
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
    setTimeout(function () {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 60);
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

  // hook up data-jump links + per-recipe edit/delete after each render
  function wireDynamic() {
    document.querySelectorAll("[data-jump]").forEach(function (el) {
      el.addEventListener("click", function () { jumpTo(el.getAttribute("data-jump")); });
    });
    document.querySelectorAll("[data-edit]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        openEditor(findRecipe(b.getAttribute("data-edit")));
      });
    });
    document.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        removeRecipe(b.getAttribute("data-del"));
      });
    });
    document.querySelectorAll("[data-print]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        printRecipe(b.getAttribute("data-print"));
      });
    });
  }

  // Print (or save as PDF) a single recipe by temporarily hiding the rest.
  function printRecipe(id) {
    var target = "recipe-" + id;
    var pages = document.querySelectorAll("#stage .page");
    pages.forEach(function (p) { if (p.id !== target) p.classList.add("hidden-print"); });
    var cleaned = false;
    var cleanup = function () {
      if (cleaned) return;
      cleaned = true;
      pages.forEach(function (p) { p.classList.remove("hidden-print"); });
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    // Fallback in case afterprint never fires (timer runs once print returns).
    setTimeout(cleanup, 400);
  }

  function findRecipe(id) {
    for (var i = 0; i < recipes.length; i++) if (recipes[i].id === id) return recipes[i];
    return null;
  }

  // ── sidebar open/close (narrow screens) ──────────────────────────────────
  function openNav() { document.body.classList.add("nav-open"); var t = document.getElementById("navToggle"); if (t) t.classList.add("open"); }
  function closeNav() { document.body.classList.remove("nav-open"); var t = document.getElementById("navToggle"); if (t) t.classList.remove("open"); }
  function toggleNav() { document.body.classList.contains("nav-open") ? closeNav() : openNav(); }

  // ── editor modal ─────────────────────────────────────────────────────────
  function addMetaRow(k, v) {
    var wrap = document.getElementById("metaRows");
    var row = document.createElement("div");
    row.className = "meta-row";
    row.innerHTML =
      '<input type="text" class="k" placeholder="Label (e.g. Prep)" value="' + esc(k || "") + '">' +
      '<input type="text" class="v" placeholder="Value (e.g. 20 min)" value="' + esc(v || "") + '">' +
      '<button type="button" class="row-del" title="Remove">&times;</button>';
    row.querySelector(".row-del").addEventListener("click", function () { row.remove(); });
    wrap.appendChild(row);
  }

  function addIngGroup(heading, items) {
    var wrap = document.getElementById("ingGroups");
    var grp = document.createElement("div");
    grp.className = "ing-group";
    grp.innerHTML =
      '<div class="grp-head">' +
        '<input type="text" class="grp-heading" placeholder="Group heading (e.g. Ingredients)" value="' + esc(heading || "Ingredients") + '">' +
        '<button type="button" class="row-del" title="Remove group">&times;</button>' +
      '</div>' +
      '<textarea class="grp-items" placeholder="One ingredient per line…">' + esc((items || []).join("\n")) + '</textarea>';
    grp.querySelector(".row-del").addEventListener("click", function () { grp.remove(); });
    wrap.appendChild(grp);
  }

  function refreshCategorySelect(selected) {
    var sel = document.getElementById("f_category");
    var names = allCategoryNames();
    sel.innerHTML = names.map(function (c) {
      return '<option value="' + esc(c) + '"' + (c === selected ? " selected" : "") + ">" + esc(c) + "</option>";
    }).join("") + '<option value="__new__">New chapter…</option>';
    var newInput = document.getElementById("f_categoryNew");
    sel.onchange = function () {
      if (sel.value === "__new__") { newInput.style.display = "block"; newInput.focus(); }
      else { newInput.style.display = "none"; }
    };
    newInput.style.display = "none";
    newInput.value = "";
  }

  function openEditor(recipe) {
    var isEdit = !!recipe;
    document.getElementById("modalTitle").textContent = isEdit ? "Edit Recipe" : "Add Recipe";
    document.getElementById("deleteBtn").style.display = isEdit ? "inline-block" : "none";
    document.getElementById("f_id").value = isEdit ? recipe.id : "";
    document.getElementById("f_title").value = isEdit ? recipe.title : "";
    document.getElementById("f_source").value = isEdit ? (recipe.source || "") : "";
    document.getElementById("f_story").value = isEdit ? (recipe.story || "") : "";
    document.getElementById("f_note").value = isEdit ? (recipe.note || "") : "";
    document.getElementById("f_steps").value = isEdit ? (recipe.steps || []).join("\n") : "";

    refreshCategorySelect(isEdit ? recipe.category : (catFilter !== "all" ? catFilter : (orderedCategories()[0] || (window.COOKBOOK_CATEGORIES || [])[0])));

    document.getElementById("metaRows").innerHTML = "";
    var metas = isEdit && recipe.meta && recipe.meta.length ? recipe.meta : [{ k: "Yields", v: "" }, { k: "Prep", v: "" }];
    metas.forEach(function (m) { addMetaRow(m.k, m.v); });

    document.getElementById("ingGroups").innerHTML = "";
    var groups = isEdit && recipe.ingredientGroups && recipe.ingredientGroups.length
      ? recipe.ingredientGroups : [{ heading: "Ingredients", items: [] }];
    groups.forEach(function (g) { addIngGroup(g.heading, g.items); });

    document.getElementById("modalBackdrop").classList.add("open");
    document.getElementById("f_title").focus();
  }

  function closeEditor() { document.getElementById("modalBackdrop").classList.remove("open"); }

  function collectForm() {
    var title = document.getElementById("f_title").value.trim();
    if (!title) { alert("Please give your recipe a title."); return null; }

    var sel = document.getElementById("f_category");
    var category = sel.value;
    if (category === "__new__") {
      category = document.getElementById("f_categoryNew").value.trim();
      if (!category) { alert("Please name the new chapter, or pick an existing one."); return null; }
    }

    var meta = [];
    document.querySelectorAll("#metaRows .meta-row").forEach(function (row) {
      var k = row.querySelector(".k").value.trim();
      var v = row.querySelector(".v").value.trim();
      if (k || v) meta.push({ k: k, v: v });
    });

    var ingredientGroups = [];
    document.querySelectorAll("#ingGroups .ing-group").forEach(function (grp) {
      var heading = grp.querySelector(".grp-heading").value.trim() || "Ingredients";
      var items = grp.querySelector(".grp-items").value.split("\n")
        .map(function (s) { return s.trim(); }).filter(Boolean);
      if (items.length) ingredientGroups.push({ heading: heading, items: items });
    });

    var steps = document.getElementById("f_steps").value.split("\n")
      .map(function (s) { return s.trim(); }).filter(Boolean);

    var existingId = document.getElementById("f_id").value;
    return {
      id: existingId || uniqueId(slugify(title)),
      title: title,
      category: category,
      source: document.getElementById("f_source").value.trim(),
      story: document.getElementById("f_story").value.trim(),
      note: document.getElementById("f_note").value.trim(),
      meta: meta,
      ingredientGroups: ingredientGroups,
      steps: steps,
    };
  }

  function saveRecipe() {
    var data = collectForm();
    if (!data) return;
    var idx = -1;
    for (var i = 0; i < recipes.length; i++) if (recipes[i].id === data.id) { idx = i; break; }
    if (idx >= 0) recipes[idx] = data; else recipes.push(data);
    save();
    closeEditor();
    syncCategoryFilter();
    render();
    setTimeout(function () { jumpTo(recId(data)); }, 80);
  }

  function removeRecipe(id) {
    var r = findRecipe(id);
    if (!r) return;
    if (!confirm('Delete "' + r.title + '"? This can\'t be undone.')) return;
    recipes = recipes.filter(function (x) { return x.id !== id; });
    save();
    syncCategoryFilter();
    render();
  }

  // ── import / export / reset ───────────────────────────────────────────────
  function exportJSON() {
    var payload = {
      type: "our-family-recipe-book",
      version: 1,
      exportedAt: new Date().toISOString(),
      meta: window.COOKBOOK_META,
      categories: window.COOKBOOK_CATEGORIES,
      recipes: recipes,
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = "our-family-recipe-book-" + stamp + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function importJSON(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var list = Array.isArray(data) ? data : data.recipes;
        if (!Array.isArray(list) || !list.length) throw new Error("No recipes found in that file.");
        // basic shape check
        list = list.filter(function (r) { return r && r.title; }).map(normalizeRecipe);
        if (!list.length) throw new Error("That file didn't contain any valid recipes.");

        var mode = confirm(
          "Import " + list.length + " recipe(s).\n\n" +
          "OK = MERGE with your current recipes (matching titles are updated).\n" +
          "Cancel = REPLACE everything with the imported file."
        );
        if (mode) {
          // merge by id, then by title
          list.forEach(function (incoming) {
            var idx = -1;
            for (var i = 0; i < recipes.length; i++) {
              if (recipes[i].id === incoming.id ||
                  recipes[i].title.toLowerCase() === incoming.title.toLowerCase()) { idx = i; break; }
            }
            if (idx >= 0) { incoming.id = recipes[idx].id; recipes[idx] = incoming; }
            else { incoming.id = uniqueId(slugify(incoming.title)); recipes.push(incoming); }
          });
        } else {
          var ids = {};
          recipes = list.map(function (r) {
            var base = slugify(r.title); var id = base, n = 2;
            while (ids[id]) { id = base + "-" + n; n++; }
            ids[id] = true; r.id = id; return r;
          });
        }
        save();
        syncCategoryFilter();
        render();
        alert("Imported " + list.length + " recipe(s).");
      } catch (e) {
        alert("Could not import that file.\n\n" + e.message);
      }
    };
    reader.readAsText(file);
  }

  function normalizeRecipe(r) {
    return {
      id: r.id || slugify(r.title),
      title: String(r.title || "").trim(),
      category: String(r.category || "Uncategorized").trim() || "Uncategorized",
      source: r.source || "",
      story: r.story || "",
      note: r.note || "",
      meta: Array.isArray(r.meta) ? r.meta : [],
      ingredientGroups: Array.isArray(r.ingredientGroups) ? r.ingredientGroups
        : (Array.isArray(r.ingredients) ? [{ heading: "Ingredients", items: r.ingredients }] : []),
      steps: Array.isArray(r.steps) ? r.steps : [],
    };
  }

  function resetToSeed() {
    if (!confirm("Restore the original collection?\n\nThis removes any recipes you've added and undoes your edits on this device. Consider exporting a backup first.")) return;
    recipes = deepClone(window.COOKBOOK_SEED || []);
    save();
    syncCategoryFilter();
    render();
  }

  // ── category filter dropdown ──────────────────────────────────────────────
  function syncCategoryFilter() {
    var sel = document.getElementById("categoryFilter");
    var cats = orderedCategories();
    var current = catFilter;
    sel.innerHTML = '<option value="all">All chapters</option>' +
      cats.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + "</option>"; }).join("");
    if (current !== "all" && cats.indexOf(current) === -1) catFilter = "all";
    sel.value = catFilter;
  }

  // ── wiring (one-time) ──────────────────────────────────────────────────────
  function wireOnce() {
    document.getElementById("navToggle").addEventListener("click", toggleNav);
    document.getElementById("navBackdrop").addEventListener("click", closeNav);

    var searchInput = document.getElementById("searchInput");
    var searchWrap = document.getElementById("searchWrap");
    searchInput.addEventListener("input", function () {
      query = searchInput.value;
      searchWrap.classList.toggle("has-text", query.length > 0);
      render();
    });
    document.getElementById("searchClear").addEventListener("click", function () {
      searchInput.value = ""; query = ""; searchWrap.classList.remove("has-text");
      searchInput.focus(); render();
    });

    document.getElementById("categoryFilter").addEventListener("change", function (e) {
      catFilter = e.target.value; render();
    });

    document.getElementById("addBtn").addEventListener("click", function () { openEditor(null); });

    // "More" menu
    var moreMenu = document.getElementById("moreMenu");
    document.getElementById("moreBtn").addEventListener("click", function (e) {
      e.stopPropagation(); moreMenu.classList.toggle("open");
    });
    document.addEventListener("click", function () { moreMenu.classList.remove("open"); });
    moreMenu.querySelector(".menu-pop").addEventListener("click", function (e) { e.stopPropagation(); });

    document.getElementById("printBtn").addEventListener("click", function () { moreMenu.classList.remove("open"); window.print(); });
    document.getElementById("exportBtn").addEventListener("click", function () { moreMenu.classList.remove("open"); exportJSON(); });
    document.getElementById("importBtn").addEventListener("click", function () { moreMenu.classList.remove("open"); document.getElementById("importFile").click(); });
    document.getElementById("resetBtn").addEventListener("click", function () { moreMenu.classList.remove("open"); resetToSeed(); });

    document.getElementById("importFile").addEventListener("change", function (e) {
      if (e.target.files && e.target.files[0]) importJSON(e.target.files[0]);
      e.target.value = "";
    });

    // editor buttons
    document.getElementById("modalClose").addEventListener("click", closeEditor);
    document.getElementById("cancelBtn").addEventListener("click", closeEditor);
    document.getElementById("saveBtn").addEventListener("click", saveRecipe);
    document.getElementById("deleteBtn").addEventListener("click", function () {
      var id = document.getElementById("f_id").value;
      if (id) { closeEditor(); removeRecipe(id); }
    });
    document.getElementById("addMetaBtn").addEventListener("click", function () { addMetaRow("", ""); });
    document.getElementById("addGroupBtn").addEventListener("click", function () { addIngGroup("", []); });
    document.getElementById("modalBackdrop").addEventListener("click", function (e) {
      if (e.target === document.getElementById("modalBackdrop")) closeEditor();
    });

    // keyboard
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (document.getElementById("modalBackdrop").classList.contains("open")) closeEditor();
        else closeNav();
      }
      // Cmd/Ctrl+F focuses search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault(); searchInput.focus(); searchInput.select();
      }
      // Cmd/Ctrl+N adds a recipe
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault(); openEditor(null);
      }
    });

    // Electron application-menu actions (if running in the desktop shell)
    if (window.cookbookAPI && window.cookbookAPI.onMenu) {
      window.cookbookAPI.onMenu(function (action) {
        if (action === "add") openEditor(null);
        else if (action === "export") exportJSON();
        else if (action === "import") document.getElementById("importFile").click();
        else if (action === "print") window.print();
        else if (action === "reset") resetToSeed();
        else if (action === "search") { searchInput.focus(); searchInput.select(); }
      });
    }
  }

  // ── boot ───────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    recipes = load();
    wireOnce();
    syncCategoryFilter();
    render();
  });
})();
