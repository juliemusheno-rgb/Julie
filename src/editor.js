/* ============================================================================
   Our Family Recipe Book — shared recipe editor (modal)
   ----------------------------------------------------------------------------
   Injects its own modal markup and manages add / edit / delete for one recipe.
   Used by both app.js (cookbook) and dashboard.js so the form is identical.

   Usage:
     CookbookEditor.init({
       getRecipes: () => recipesArray,        // current list (read)
       commit:     (newRecipesArray) => {}     // persist + re-render
     });
     CookbookEditor.open(recipe);              // edit existing
     CookbookEditor.open(null);                // add blank
     CookbookEditor.open(null, draft);         // add, pre-filled from parser
   ========================================================================== */
window.CookbookEditor = (function () {
  "use strict";

  var S = window.CookbookStore;
  var cfg = { getRecipes: function () { return []; }, commit: function () {} };
  var built = false;

  var MODAL_HTML =
    '<div class="modal-backdrop" id="modalBackdrop">' +
      '<div class="modal" role="dialog" aria-modal="true">' +
        '<div class="modal-head">' +
          '<h2 id="modalTitle">Add Recipe</h2>' +
          '<button class="x" id="modalClose" title="Close">&times;</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<input type="hidden" id="f_id">' +
          '<div class="field"><label for="f_title">Title</label>' +
            '<input type="text" id="f_title" placeholder="e.g. Grandma\'s Apple Pie"></div>' +
          '<div class="two-col">' +
            '<div class="field"><label for="f_category">Chapter</label>' +
              '<div class="cat-row"><select id="f_category"></select></div>' +
              '<input type="text" id="f_categoryNew" placeholder="…or type a new chapter" style="margin-top:8px;display:none;">' +
              '<div class="hint">Pick a chapter, or choose "New chapter…" to create one.</div></div>' +
            '<div class="field"><label for="f_source">Source / credit <span class="opt">(optional)</span></label>' +
              '<input type="text" id="f_source" placeholder="e.g. adapted from allrecipes.com"></div>' +
          '</div>' +
          '<div class="field"><label for="f_story">Story <span class="opt">(optional)</span></label>' +
            '<textarea id="f_story" rows="2" placeholder="A line or two about this dish…"></textarea></div>' +
          '<div class="field"><label>Details <span class="opt">(yields, prep, bake, etc.)</span></label>' +
            '<div class="meta-rows" id="metaRows"></div>' +
            '<button type="button" class="add-link" id="addMetaBtn">+ Add detail</button></div>' +
          '<div class="field"><label>Ingredients</label>' +
            '<div id="ingGroups"></div>' +
            '<button type="button" class="add-link" id="addGroupBtn">+ Add ingredient group</button>' +
            '<div class="hint">One ingredient per line. Add extra groups for multi-part recipes (e.g. "Sauce", "Topping").</div></div>' +
          '<div class="field"><label for="f_steps">Directions</label>' +
            '<textarea id="f_steps" rows="7" placeholder="One step per line. They\'ll be numbered automatically."></textarea>' +
            '<div class="hint">One step per line — numbering is added for you.</div></div>' +
          '<div class="field"><label for="f_note">Note <span class="opt">(optional)</span></label>' +
            '<textarea id="f_note" rows="2" placeholder="Make-ahead tips, substitutions, etc."></textarea></div>' +
        '</div>' +
        '<div class="modal-foot">' +
          '<button class="btn danger" id="deleteBtn" style="display:none;">Delete</button>' +
          '<div class="right">' +
            '<button class="btn" id="cancelBtn">Cancel</button>' +
            '<button class="btn primary" id="saveBtn">Save recipe</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  function $(id) { return document.getElementById(id); }

  function build() {
    if (built) return;
    var holder = document.createElement("div");
    holder.innerHTML = MODAL_HTML;
    document.body.appendChild(holder.firstChild);

    $("modalClose").addEventListener("click", close);
    $("cancelBtn").addEventListener("click", close);
    $("saveBtn").addEventListener("click", saveRecipe);
    $("deleteBtn").addEventListener("click", function () {
      var id = $("f_id").value;
      if (id) deleteRecipe(id);
    });
    $("addMetaBtn").addEventListener("click", function () { addMetaRow("", ""); });
    $("addGroupBtn").addEventListener("click", function () { addIngGroup("", []); });
    $("modalBackdrop").addEventListener("click", function (e) {
      if (e.target === $("modalBackdrop")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) close();
    });
    built = true;
  }

  function isOpen() { var b = $("modalBackdrop"); return b && b.classList.contains("open"); }

  function addMetaRow(k, v) {
    var row = document.createElement("div");
    row.className = "meta-row";
    row.innerHTML =
      '<input type="text" class="k" placeholder="Label (e.g. Prep)" value="' + S.esc(k || "") + '">' +
      '<input type="text" class="v" placeholder="Value (e.g. 20 min)" value="' + S.esc(v || "") + '">' +
      '<button type="button" class="row-del" title="Remove">&times;</button>';
    row.querySelector(".row-del").addEventListener("click", function () { row.remove(); });
    $("metaRows").appendChild(row);
  }

  function addIngGroup(heading, items) {
    var grp = document.createElement("div");
    grp.className = "ing-group";
    grp.innerHTML =
      '<div class="grp-head">' +
        '<input type="text" class="grp-heading" placeholder="Group heading (e.g. Ingredients)" value="' + S.esc(heading || "Ingredients") + '">' +
        '<button type="button" class="row-del" title="Remove group">&times;</button>' +
      '</div>' +
      '<textarea class="grp-items" placeholder="One ingredient per line…">' + S.esc((items || []).join("\n")) + '</textarea>';
    grp.querySelector(".row-del").addEventListener("click", function () { grp.remove(); });
    $("ingGroups").appendChild(grp);
  }

  function refreshCategorySelect(selected) {
    var sel = $("f_category");
    var names = S.allCategoryNames(cfg.getRecipes());
    sel.innerHTML = names.map(function (c) {
      return '<option value="' + S.esc(c) + '"' + (c === selected ? " selected" : "") + ">" + S.esc(c) + "</option>";
    }).join("") + '<option value="__new__">New chapter…</option>';
    var newInput = $("f_categoryNew");
    sel.onchange = function () {
      if (sel.value === "__new__") { newInput.style.display = "block"; newInput.focus(); }
      else { newInput.style.display = "none"; }
    };
    newInput.style.display = "none";
    newInput.value = "";
    // If the desired chapter wasn't in the list (a brand-new one from a draft),
    // switch to the "New chapter…" path and pre-fill it.
    if (selected && names.indexOf(selected) === -1) {
      sel.value = "__new__"; newInput.style.display = "block"; newInput.value = selected;
    }
  }

  function open(recipe, draft) {
    build();
    var src = recipe || draft || {};
    var isEdit = !!recipe;
    $("modalTitle").textContent = isEdit ? "Edit Recipe" : "Add Recipe";
    $("deleteBtn").style.display = isEdit ? "inline-block" : "none";
    $("f_id").value = isEdit ? recipe.id : "";
    $("f_title").value = src.title || "";
    $("f_source").value = src.source || "";
    $("f_story").value = src.story || "";
    $("f_note").value = src.note || "";
    $("f_steps").value = (src.steps || []).join("\n");

    var recipes = cfg.getRecipes();
    var defaultCat = isEdit ? recipe.category
      : (src.category || S.orderedCategories(recipes)[0] || (window.COOKBOOK_CATEGORIES || [])[0] || "");
    refreshCategorySelect(defaultCat);

    $("metaRows").innerHTML = "";
    var metas = (src.meta && src.meta.length) ? src.meta
      : (isEdit ? [] : [{ k: "Yields", v: "" }, { k: "Prep", v: "" }]);
    metas.forEach(function (m) { addMetaRow(m.k, m.v); });

    $("ingGroups").innerHTML = "";
    var groups = (src.ingredientGroups && src.ingredientGroups.length)
      ? src.ingredientGroups : [{ heading: "Ingredients", items: [] }];
    groups.forEach(function (g) { addIngGroup(g.heading, g.items); });

    $("modalBackdrop").classList.add("open");
    $("f_title").focus();
  }

  function close() { var b = $("modalBackdrop"); if (b) b.classList.remove("open"); }

  function collectForm() {
    var title = $("f_title").value.trim();
    if (!title) { alert("Please give your recipe a title."); return null; }

    var sel = $("f_category");
    var category = sel.value;
    if (category === "__new__") {
      category = $("f_categoryNew").value.trim();
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

    var steps = $("f_steps").value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);

    var recipes = cfg.getRecipes();
    var existingId = $("f_id").value;
    return {
      id: existingId || S.uniqueId(recipes, S.slugify(title)),
      title: title,
      category: category,
      source: $("f_source").value.trim(),
      story: $("f_story").value.trim(),
      note: $("f_note").value.trim(),
      meta: meta,
      ingredientGroups: ingredientGroups,
      steps: steps,
    };
  }

  function saveRecipe() {
    var data = collectForm();
    if (!data) return;
    var recipes = cfg.getRecipes().slice();
    var idx = -1;
    for (var i = 0; i < recipes.length; i++) if (recipes[i].id === data.id) { idx = i; break; }
    if (idx >= 0) recipes[idx] = data; else recipes.push(data);
    cfg.commit(recipes, data, idx < 0 ? "add" : "update");
    close();
  }

  function deleteRecipe(id) {
    var recipes = cfg.getRecipes();
    var r = null;
    for (var i = 0; i < recipes.length; i++) if (recipes[i].id === id) { r = recipes[i]; break; }
    if (!r) return;
    if (!confirm('Delete "' + r.title + '"? This can\'t be undone.')) return;
    var next = recipes.filter(function (x) { return x.id !== id; });
    cfg.commit(next, r, "delete");
    close();
  }

  function init(options) {
    cfg = options || cfg;
    build();
  }

  return { init: init, open: open, close: close, isOpen: isOpen, remove: deleteRecipe };
})();
