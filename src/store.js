/* ============================================================================
   Our Family Recipe Book — shared store + recipe parser
   ----------------------------------------------------------------------------
   Used by BOTH the cookbook (app.js) and the dashboard (dashboard.js) so they
   always read and write exactly the same local data, and share one parser for
   turning pasted/uploaded text into a recipe draft.
   ========================================================================== */
window.CookbookStore = (function () {
  "use strict";

  var STORE_KEY = "ourFamilyRecipeBook.v1";

  // The hand-drawn herb sprig that appears on every page.
  var MARK = '<svg viewBox="0 0 60 72"><path d="M30 70 C30 52 30 28 30 10" stroke="var(--primary)" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="24" rx="9.5" ry="4.6" transform="rotate(-32 23 24)" fill="var(--primary-light)"/><ellipse cx="37" cy="33" rx="9.5" ry="4.6" transform="rotate(32 37 33)" fill="var(--primary-light)"/><ellipse cx="23" cy="42" rx="8.5" ry="4.2" transform="rotate(-32 23 42)" fill="var(--primary)"/><ellipse cx="37" cy="51" rx="8.5" ry="4.2" transform="rotate(32 37 51)" fill="var(--primary)"/><circle cx="30" cy="11" r="3.6" fill="var(--accent)"/></svg>';

  function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

  function seed() { return deepClone(window.COOKBOOK_SEED || []); }

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed.map(normalizeRecipe);
      }
    } catch (e) { /* fall through to seed */ }
    return seed();
  }

  function save(recipes) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(recipes));
      return true;
    } catch (e) {
      alert("Sorry — your changes could not be saved to this device's storage.\n" + e.message);
      return false;
    }
  }

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
  function recId(r) { return "recipe-" + (typeof r === "string" ? r : r.id); }

  function uniqueId(recipes, base) {
    var taken = {};
    (recipes || []).forEach(function (r) { taken[r.id] = true; });
    var id = base, n = 2;
    while (taken[id]) { id = base + "-" + n; n++; }
    return id;
  }

  // Chapters in canonical order, then any custom ones actually in use.
  function orderedCategories(recipes) {
    var canonical = window.COOKBOOK_CATEGORIES || [];
    var present = {}, out = [];
    (recipes || []).forEach(function (r) { present[r.category] = true; });
    canonical.forEach(function (c) { if (present[c]) out.push(c); });
    (recipes || []).forEach(function (r) {
      if (out.indexOf(r.category) === -1) out.push(r.category);
    });
    return out;
  }

  // Every chapter name for dropdowns (canonical + any custom).
  function allCategoryNames(recipes) {
    var out = (window.COOKBOOK_CATEGORIES || []).slice();
    (recipes || []).forEach(function (r) {
      if (out.indexOf(r.category) === -1) out.push(r.category);
    });
    return out;
  }

  function normalizeRecipe(r) {
    r = r || {};
    var groups;
    if (Array.isArray(r.ingredientGroups)) groups = r.ingredientGroups;
    else if (Array.isArray(r.ingredients)) groups = [{ heading: "Ingredients", items: r.ingredients }];
    else groups = [];
    return {
      id: r.id || slugify(r.title),
      title: String(r.title || "").trim(),
      category: String(r.category || "Uncategorized").trim() || "Uncategorized",
      source: r.source || "",
      story: r.story || "",
      note: r.note || "",
      meta: Array.isArray(r.meta) ? r.meta : [],
      ingredientGroups: groups.map(function (g) {
        return { heading: (g && g.heading) || "Ingredients", items: Array.isArray(g && g.items) ? g.items : [] };
      }),
      steps: Array.isArray(r.steps) ? r.steps : [],
    };
  }

  // ── recipe text parser ────────────────────────────────────────────────────
  // Turns free-form pasted/uploaded text into a draft recipe. It's heuristic by
  // design — the result always opens in the editor for the user to review.

  function stripBullet(s) {
    return s.replace(/^\s*(?:[-*•·◦‣▪]|•|\d+[.)]|[a-z][.)])\s+/i, "").trim();
  }
  function stripStepNumber(s) {
    return s.replace(/^\s*(?:step\s*)?\d+\s*[.):\-]\s*/i, "").trim();
  }
  function cleanHeading(s) {
    return s.replace(/^\s*#{1,6}\s*/, "").replace(/\*\*/g, "").replace(/^\s*[-*•]\s+/, "").trim();
  }
  function titleCase(s) {
    return s.toLowerCase().replace(/\b([a-z])/g, function (m, c) { return c.toUpperCase(); });
  }

  var META_KEYS = /^(yield|yields|makes|serves|serving|servings|prep|prep time|cook|cook time|bake|bake time|total|total time|active time|oven|chill|rest|ready in|difficulty)\b/i;
  var ING_HEAD = /ingredient/i;
  var STEP_HEAD = /(direction|instruction|method|steps?|preparation|procedure|to make|how to)/i;
  var NOTE_HEAD = /^(note|notes|tip|tips|to serve|serving suggestion|make ahead)\b/i;
  var SOURCE_LINE = /^(source|from|adapted from|recipe by|credit|courtesy of|via)\s*[:\-]?\s*(.+)$/i;
  var UNIT = /\b(cups?|tbsp|tbs|tablespoons?|tsp|teaspoons?|oz|ounces?|lb|lbs|pounds?|g|grams?|kg|ml|l|liters?|litres?|cloves?|cans?|jars?|packages?|pkg|sticks?|pints?|quarts?|gallons?|pinch|dash|slices?|bunch|sprigs?)\b/i;
  var QTY_START = /^\s*(?:\d+|[½¼¾⅓⅔⅛]|\d+\s*\/\s*\d+|\d+\s+\d+\/\d+)/;

  function isHeadingLine(line) {
    var t = line.trim();
    if (/^#{1,6}\s/.test(t)) return true;                 // markdown heading
    if (/^\*\*.+\*\*:?$/.test(t)) return true;            // **bold** line
    if (t.length <= 40 && /:$/.test(t) && !QTY_START.test(t)) return true; // "Ingredients:"
    if (t.length <= 30 && t === t.toUpperCase() && /[A-Z]/.test(t) && !/\d/.test(t)) return true; // ALL CAPS
    return false;
  }

  function looksLikeIngredient(line) {
    return QTY_START.test(line) || UNIT.test(line);
  }

  function parseRecipeText(raw) {
    var text = String(raw || "").replace(/\r\n?/g, "\n");
    var lines = text.split("\n").map(function (l) { return l.replace(/\t/g, " ").replace(/\s+$/g, ""); });

    var draft = { title: "", category: "", source: "", story: "", note: "", meta: [], ingredientGroups: [], steps: [] };
    var storyLines = [];
    var currentGroup = null;
    var section = "pre"; // pre | ingredients | steps | note

    function ensureGroup(name) {
      currentGroup = { heading: name || "Ingredients", items: [] };
      draft.ingredientGroups.push(currentGroup);
    }

    var i = 0;
    while (i < lines.length && !lines[i].trim()) i++;
    if (i < lines.length) { draft.title = cleanHeading(lines[i]); i++; }

    for (; i < lines.length; i++) {
      var t = lines[i].trim();
      if (!t) continue;
      var heading = cleanHeading(t);

      if (isHeadingLine(t)) {
        if (ING_HEAD.test(heading) && heading.length < 40) { section = "ingredients"; ensureGroup(heading.replace(/:$/, "")); continue; }
        if (STEP_HEAD.test(heading) && heading.length < 40) { section = "steps"; continue; }
        if (NOTE_HEAD.test(heading) && heading.length < 40) { section = "note"; continue; }
        // a heading inside the ingredients block = a new sub-group (e.g. "Sauce:")
        if (section === "ingredients") { ensureGroup(heading.replace(/:$/, "")); continue; }
      }

      var sm = t.match(SOURCE_LINE);
      if (sm && section !== "steps" && sm[2].length < 80) { draft.source = sm[2].trim(); continue; }

      var mm = t.match(/^([A-Za-z][A-Za-z \/]{1,20})\s*[:\-]\s*(.+)$/);
      if (mm && META_KEYS.test(mm[1].trim()) && section !== "steps") {
        draft.meta.push({ k: titleCase(mm[1].trim()), v: mm[2].trim() }); continue;
      }

      if (section === "pre") { storyLines.push(t); continue; }
      if (section === "ingredients") {
        if (!currentGroup) ensureGroup("Ingredients");
        currentGroup.items.push(stripBullet(t));
        continue;
      }
      if (section === "steps") { draft.steps.push(stripStepNumber(stripBullet(t))); continue; }
      if (section === "note") { draft.note = draft.note ? draft.note + " " + t : t; continue; }
    }

    // Fallback: no explicit Ingredients/Directions headers were found.
    // Split the body by "looks like an ingredient" vs. "looks like a step".
    var totalItems = draft.ingredientGroups.reduce(function (n, g) { return n + g.items.length; }, 0);
    if (totalItems === 0 && draft.steps.length === 0 && storyLines.length) {
      var ing = [], stp = [], lead = [];
      storyLines.forEach(function (l) {
        if (looksLikeIngredient(l)) ing.push(stripBullet(l));
        else if (/[.!?]$/.test(l) || l.split(" ").length > 8) stp.push(stripStepNumber(stripBullet(l)));
        else lead.push(l);
      });
      if (ing.length >= 2) {
        draft.ingredientGroups = [{ heading: "Ingredients", items: ing }];
        draft.steps = stp;
        storyLines = lead;
      }
    }

    draft.story = storyLines.join(" ").trim();
    if (!draft.ingredientGroups.length) draft.ingredientGroups = [{ heading: "Ingredients", items: [] }];
    draft.category = (window.COOKBOOK_CATEGORIES && window.COOKBOOK_CATEGORIES[0]) || "Uncategorized";
    return draft;
  }

  // Strip tags from an uploaded HTML file, then parse the remaining text.
  function parseHtml(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = String(html || "");
    (tmp.querySelectorAll("script,style")).forEach(function (n) { n.remove(); });
    // Insert line breaks around block elements so structure survives.
    tmp.querySelectorAll("br").forEach(function (b) { b.replaceWith("\n"); });
    tmp.querySelectorAll("li,p,h1,h2,h3,h4,div,tr").forEach(function (n) { n.append("\n"); });
    var text = (tmp.textContent || "").replace(/\n{2,}/g, "\n");
    return parseRecipeText(text);
  }

  return {
    STORE_KEY: STORE_KEY,
    MARK: MARK,
    deepClone: deepClone,
    seed: seed,
    load: load,
    save: save,
    esc: esc,
    slugify: slugify,
    catId: catId,
    recId: recId,
    uniqueId: uniqueId,
    orderedCategories: orderedCategories,
    allCategoryNames: allCategoryNames,
    normalizeRecipe: normalizeRecipe,
    parseRecipeText: parseRecipeText,
    parseHtml: parseHtml,
  };
})();
