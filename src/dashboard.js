/* ============================================================================
   Our Family Recipe Book — dashboard
   ----------------------------------------------------------------------------
   The "back office" for entering recipes:
     • upload a file (.txt / .md / .html / .json) or paste text → parsed into a
       recipe card that opens in the editor for review
     • type a brand-new recipe from a blank form
     • search, manage, edit, and delete the whole collection
   Shares store.js + editor.js with the cookbook, so changes appear there too.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.CookbookStore;
  var esc = S.esc;
  var recipes = [];
  var query = "";
  var catFilter = "all";

  function $(id) { return document.getElementById(id); }
  function persist(next) { recipes = next; S.save(recipes); }

  // ── boot ───────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    recipes = S.load();

    $("dashMark").innerHTML = S.MARK;
    $("dzMark").innerHTML = S.MARK;

    CookbookEditor.init({
      getRecipes: function () { return recipes; },
      commit: function (next) { persist(next); syncCategory(); renderTable(); },
    });

    wire();
    syncCategory();
    renderTable();

    // Reflect edits made from the cookbook window.
    window.addEventListener("storage", function (e) {
      if (e.key === S.STORE_KEY) { recipes = S.load(); syncCategory(); renderTable(); }
    });
  });

  // ── entry: parse pasted/uploaded text ───────────────────────────────────────
  function createFromText(text, filenameHint) {
    if (!text || !text.trim()) { alert("There's nothing to parse yet — paste some recipe text or choose a file."); return; }
    var draft;
    if (/<\/?[a-z][\s\S]*>/i.test(text) && /<(html|body|div|p|li|table)/i.test(text)) {
      draft = S.parseHtml(text);
    } else {
      draft = S.parseRecipeText(text);
    }
    if (!draft.title && filenameHint) {
      draft.title = filenameHint.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
    }
    CookbookEditor.open(null, draft);
  }

  function handleFile(file) {
    var name = (file.name || "").toLowerCase();
    var reader = new FileReader();
    reader.onload = function () {
      var content = reader.result;
      if (name.endsWith(".json")) {
        try {
          var data = JSON.parse(content);
          var list = Array.isArray(data) ? data : data.recipes;
          if (Array.isArray(list) && list.length) { importList(list); return; }
          // a single recipe object → open it as a draft
          if (data && data.title) { CookbookEditor.open(null, S.normalizeRecipe(data)); return; }
          throw new Error("No recipes found in that JSON file.");
        } catch (e) { alert("Could not read that JSON file.\n\n" + e.message); return; }
      }
      createFromText(content, file.name);
    };
    reader.readAsText(file);
  }

  function importList(rawList) {
    var list = rawList.filter(function (r) { return r && r.title; }).map(S.normalizeRecipe);
    if (!list.length) { alert("That file didn't contain any valid recipes."); return; }
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
    persist(next); syncCategory(); renderTable();
    alert("Imported " + list.length + " recipe(s).");
  }

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

  // ── management table ─────────────────────────────────────────────────────
  function visible() {
    var q = query.trim().toLowerCase();
    return recipes.filter(function (r) {
      if (catFilter !== "all" && r.category !== catFilter) return false;
      if (!q) return true;
      var hay = [r.title, r.category, r.source].join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function counts(r) {
    var ing = (r.ingredientGroups || []).reduce(function (n, g) { return n + (g.items || []).length; }, 0);
    return { ing: ing, steps: (r.steps || []).length };
  }

  function renderTable() {
    var cats = S.orderedCategories(recipes);
    var vis = visible();
    $("recipeCount").textContent = "(" + recipes.length + (recipes.length === 1 ? " recipe)" : " recipes)");

    if (!recipes.length) {
      $("recipeTable").innerHTML = '<div class="table-empty">No recipes yet. Add one above to get started.</div>';
      return;
    }
    if (!vis.length) {
      $("recipeTable").innerHTML = '<div class="table-empty">No recipes match your search.</div>';
      return;
    }

    var byCat = {};
    vis.forEach(function (r) { (byCat[r.category] = byCat[r.category] || []).push(r); });
    var order = cats.filter(function (c) { return byCat[c]; });

    var html = "";
    order.forEach(function (cat) {
      html += '<div class="cat-group"><div class="cat-group-head">' + esc(cat) +
        ' <span>' + byCat[cat].length + '</span></div>';
      byCat[cat].forEach(function (r) {
        var c = counts(r);
        html += '<div class="rrow">' +
          '<div class="rrow-main">' +
            '<div class="rrow-title">' + esc(r.title) + '</div>' +
            '<div class="rrow-meta">' + c.ing + ' ingredient' + (c.ing === 1 ? "" : "s") +
              ' · ' + c.steps + ' step' + (c.steps === 1 ? "" : "s") +
              (r.source ? ' · <span class="rrow-src">' + esc(r.source) + '</span>' : "") + '</div>' +
          '</div>' +
          '<div class="rrow-actions">' +
            '<a class="mini" href="index.html#' + esc(S.recId(r)) + '" title="View in cookbook">View</a>' +
            '<button class="mini" data-edit="' + esc(r.id) + '">Edit</button>' +
            '<button class="mini danger" data-del="' + esc(r.id) + '">Delete</button>' +
          '</div></div>';
      });
      html += '</div>';
    });
    $("recipeTable").innerHTML = html;

    $("recipeTable").querySelectorAll("[data-edit]").forEach(function (b) {
      b.addEventListener("click", function () { CookbookEditor.open(find(b.getAttribute("data-edit"))); });
    });
    $("recipeTable").querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function () { CookbookEditor.remove(b.getAttribute("data-del")); });
    });
  }

  function find(id) { for (var i = 0; i < recipes.length; i++) if (recipes[i].id === id) return recipes[i]; return null; }

  function syncCategory() {
    var sel = $("dCategory");
    var cats = S.orderedCategories(recipes);
    sel.innerHTML = '<option value="all">All chapters</option>' +
      cats.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + "</option>"; }).join("");
    if (catFilter !== "all" && cats.indexOf(catFilter) === -1) catFilter = "all";
    sel.value = catFilter;
  }

  // ── wiring ─────────────────────────────────────────────────────────────────
  function wire() {
    $("blankBtn").addEventListener("click", function () { CookbookEditor.open(null); });
    $("parseBtn").addEventListener("click", function () { createFromText($("pasteArea").value, ""); });

    $("browseBtn").addEventListener("click", function () { $("fileInput").click(); });
    $("dropzone").addEventListener("click", function (e) {
      if (e.target.id === "browseBtn") return;
      $("fileInput").click();
    });
    $("fileInput").addEventListener("change", function (e) {
      if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
      e.target.value = "";
    });

    var dz = $("dropzone");
    ["dragenter", "dragover"].forEach(function (ev) {
      dz.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); dz.classList.add("drag"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      dz.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); dz.classList.remove("drag"); });
    });
    dz.addEventListener("drop", function (e) {
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });

    var ds = $("dSearch"), dw = $("dSearchWrap");
    ds.addEventListener("input", function () { query = ds.value; dw.classList.toggle("has-text", query.length > 0); renderTable(); });
    $("dSearchClear").addEventListener("click", function () { ds.value = ""; query = ""; dw.classList.remove("has-text"); ds.focus(); renderTable(); });
    $("dCategory").addEventListener("change", function (e) { catFilter = e.target.value; renderTable(); });

    $("dExport").addEventListener("click", exportJSON);
    $("dImport").addEventListener("click", function () { $("dImportFile").click(); });
    $("dImportFile").addEventListener("change", function (e) {
      if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
      e.target.value = "";
    });

    // Electron application-menu actions, when running in the desktop shell.
    if (window.cookbookAPI && window.cookbookAPI.onMenu) {
      window.cookbookAPI.onMenu(function (action) {
        if (action === "add") CookbookEditor.open(null);
        else if (action === "export") exportJSON();
        else if (action === "import") $("dImportFile").click();
        else if (action === "search") { $("dSearch").focus(); $("dSearch").select(); }
      });
    }
  }
})();
