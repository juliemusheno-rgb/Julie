/* ============================================================================
   Our Family Recipe Book — Scan a Photo (AI)
   ----------------------------------------------------------------------------
   Optional feature: read a photo of a recipe (card, page, or screenshot) with
   Claude's vision and turn it into a structured recipe draft, which then opens
   in the editor for review.

   • Calls the Anthropic Messages API directly via fetch (this app has no
     bundler, so the npm SDK isn't used here). The
     `anthropic-dangerous-direct-browser-access` header lets the call run from
     the Electron window or a plain browser.
   • Your API key is stored only on THIS device (localStorage) and is sent
     directly to Anthropic to read your photo — it never goes anywhere else.
   • Images are downscaled in the browser before upload to limit size and cost.
   ========================================================================== */
window.CookbookAI = (function () {
  "use strict";

  var S = window.CookbookStore;
  var SETTINGS_KEY = "ourFamilyRecipeBook.ai.v1";
  var API_URL = "https://api.anthropic.com/v1/messages";
  var MAX_IMAGES = 6;
  var MAX_EDGE = 1568; // px — plenty for OCR; keeps requests small

  var MODELS = [
    { id: "claude-opus-4-8", label: "Claude Opus 4.8 — most accurate (default)" },
    { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6 — fast & balanced" },
    { id: "claude-haiku-4-5", label: "Claude Haiku 4.5 — cheapest" },
  ];

  // Structured-output schema — the model must return exactly this shape.
  var RECIPE_SCHEMA = {
    type: "object",
    additionalProperties: false,
    properties: {
      title: { type: "string" },
      category: { type: "string" },
      source: { type: "string" },
      story: { type: "string" },
      note: { type: "string" },
      meta: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: { k: { type: "string" }, v: { type: "string" } },
          required: ["k", "v"],
        },
      },
      ingredientGroups: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            heading: { type: "string" },
            items: { type: "array", items: { type: "string" } },
          },
          required: ["heading", "items"],
        },
      },
      steps: { type: "array", items: { type: "string" } },
    },
    required: ["title", "category", "source", "story", "note", "meta", "ingredientGroups", "steps"],
  };

  // ── settings ───────────────────────────────────────────────────────────
  function getSettings() {
    try {
      var raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { apiKey: "", model: MODELS[0].id };
  }
  function saveSettings(s) {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function hasKey() { return !!(getSettings().apiKey || "").trim(); }

  // ── settings modal (injected) ────────────────────────────────────────────
  var built = false;
  function $(id) { return document.getElementById(id); }

  function build() {
    if (built) return;
    var html =
      '<div class="modal-backdrop" id="aiBackdrop">' +
        '<div class="modal" style="max-width:560px" role="dialog" aria-modal="true">' +
          '<div class="modal-head"><h2>Photo Scanning Settings</h2>' +
            '<button class="x" id="aiClose" title="Close">&times;</button></div>' +
          '<div class="modal-body">' +
            '<div class="field"><label for="aiKey">Anthropic API key</label>' +
              '<input type="password" id="aiKey" placeholder="sk-ant-..." autocomplete="off" spellcheck="false">' +
              '<div class="hint">Stored only on this device, and sent directly to Anthropic to read your photos. ' +
              'Get a key at <span style="color:var(--accent)">console.anthropic.com</span> → API Keys.</div></div>' +
            '<div class="field"><label for="aiModel">Model</label>' +
              '<select id="aiModel"></select>' +
              '<div class="hint">Opus is the most accurate; Haiku is the cheapest. Scanning a recipe costs a few US cents at most.</div></div>' +
          '</div>' +
          '<div class="modal-foot"><div class="right">' +
            '<button class="btn" id="aiCancel">Cancel</button>' +
            '<button class="btn primary" id="aiSave">Save</button>' +
          '</div></div>' +
        '</div></div>';
    var holder = document.createElement("div");
    holder.innerHTML = html;
    document.body.appendChild(holder.firstChild);

    $("aiModel").innerHTML = MODELS.map(function (m) {
      return '<option value="' + m.id + '">' + m.label + "</option>";
    }).join("");

    $("aiClose").addEventListener("click", closeSettings);
    $("aiCancel").addEventListener("click", closeSettings);
    $("aiBackdrop").addEventListener("click", function (e) { if (e.target === $("aiBackdrop")) closeSettings(); });
    $("aiSave").addEventListener("click", function () {
      saveSettings({ apiKey: $("aiKey").value.trim(), model: $("aiModel").value });
      closeSettings();
      if (typeof pendingAfterSave === "function") { var f = pendingAfterSave; pendingAfterSave = null; f(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && $("aiBackdrop").classList.contains("open")) closeSettings();
    });
    built = true;
  }

  var pendingAfterSave = null;
  function openSettings(afterSave) {
    build();
    pendingAfterSave = afterSave || null;
    var s = getSettings();
    $("aiKey").value = s.apiKey || "";
    $("aiModel").value = s.model || MODELS[0].id;
    $("aiBackdrop").classList.add("open");
    $("aiKey").focus();
  }
  function closeSettings() { if ($("aiBackdrop")) $("aiBackdrop").classList.remove("open"); }

  // ── image handling ─────────────────────────────────────────────────────
  function fileToResizedJpeg(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight;
        if (!w || !h) { URL.revokeObjectURL(url); reject(new Error("Couldn't read \"" + file.name + "\".")); return; }
        var scale = Math.min(1, MAX_EDGE / Math.max(w, h));
        var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
        var canvas = document.createElement("canvas");
        canvas.width = cw; canvas.height = ch;
        canvas.getContext("2d").drawImage(img, 0, 0, cw, ch);
        URL.revokeObjectURL(url);
        try {
          var dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve({ media_type: "image/jpeg", data: dataUrl.split(",")[1] });
        } catch (e) { reject(new Error("Couldn't process \"" + file.name + "\".")); }
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("Couldn't open \"" + file.name + "\". If it's a HEIC photo (common on iPhone), " +
          "convert it to JPEG or PNG first — open it in Preview and File ▸ Export."));
      };
      img.src = url;
    });
  }

  // ── API call ───────────────────────────────────────────────────────────
  function systemPrompt(categories) {
    return "You are a careful kitchen assistant that transcribes recipes from photographs into " +
      "structured data for a family cookbook.\n\n" +
      "You will receive one or more photos of a SINGLE recipe (a card, a page, or a screenshot). " +
      "If several photos are given, they are the same recipe (e.g. two pages) — combine them.\n\n" +
      "Transcribe faithfully — do not invent ingredients or steps:\n" +
      "- title: the recipe's name.\n" +
      "- category: the best fit from these existing chapters: [" + categories.join(", ") + "]. " +
      "If none fit, choose a short sensible chapter name.\n" +
      "- ingredientGroups: the ingredients, preserving any sub-sections (e.g. \"For the sauce\"). " +
      "Use one group titled \"Ingredients\" if there are no sub-sections. One ingredient per item, verbatim (keep quantities/units).\n" +
      "- steps: the directions as an ordered list, one step per item, with any leading numbers removed.\n" +
      "- meta: short details like yields/servings/prep/cook/bake/oven temperature as {k, v} pairs (e.g. {\"k\":\"Prep\",\"v\":\"20 min\"}). Empty array if none.\n" +
      "- source: any attribution/credit (e.g. \"from Grandma\", \"adapted from allrecipes.com\"). Empty string if none.\n" +
      "- story: any headnote/narrative. Empty string if none.\n" +
      "- note: tips, make-ahead notes, or substitutions. Empty string if none.\n\n" +
      "If the image is unreadable or is not a recipe, return the schema with an empty title and empty arrays.";
  }

  function friendlyError(status, text) {
    if (status === 401) return "Your API key was rejected (401). Open Settings and check the key.";
    if (status === 403) return "This API key doesn't have access (403). Try a different key.";
    if (status === 429) return "Rate limited (429) — wait a moment and try again.";
    if (status === 413) return "The image is too large (413). Try a smaller or lower-resolution photo.";
    if (status >= 500) return "Anthropic had a server error (" + status + "). Try again shortly.";
    var m = "";
    try { m = (JSON.parse(text).error || {}).message || ""; } catch (e) {}
    return "Scan failed (" + status + ")" + (m ? ": " + m : ".");
  }

  function parseJsonLoose(text) {
    var t = String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    try { return JSON.parse(t); } catch (e) {}
    var a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e2) {} }
    throw new Error("The model's reply wasn't valid recipe data. Try again or use a clearer photo.");
  }

  async function callAnthropic(images, categories, settings) {
    var content = images.map(function (im) {
      return { type: "image", source: { type: "base64", media_type: im.media_type, data: im.data } };
    });
    content.push({ type: "text", text: "Here " + (images.length === 1 ? "is a photo" : "are photos") +
      " of a recipe. Transcribe it into the recipe schema." });

    var body = {
      model: settings.model || MODELS[0].id,
      max_tokens: 4096,
      system: systemPrompt(categories),
      messages: [{ role: "user", content: content }],
      output_config: { format: { type: "json_schema", schema: RECIPE_SCHEMA } },
    };
    var headers = {
      "content-type": "application/json",
      "x-api-key": settings.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    };

    var res = await fetch(API_URL, { method: "POST", headers: headers, body: JSON.stringify(body) });
    if (!res.ok) {
      var errText = await res.text();
      // Older deployments may not support output_config — retry asking for plain JSON.
      if (res.status === 400 && /output_config|format|json_schema|schema/i.test(errText)) {
        delete body.output_config;
        body.system += "\n\nReturn ONLY a single JSON object with these keys (no prose, no code fences): " +
          "title, category, source, story, note, meta (array of {k,v}), ingredientGroups (array of {heading, items}), steps (array of strings).";
        res = await fetch(API_URL, { method: "POST", headers: headers, body: JSON.stringify(body) });
        if (!res.ok) throw new Error(friendlyError(res.status, await res.text()));
      } else {
        throw new Error(friendlyError(res.status, errText));
      }
    }
    var data = await res.json();
    var text = (data.content || []).filter(function (b) { return b.type === "text"; })
      .map(function (b) { return b.text; }).join("\n");
    return parseJsonLoose(text);
  }

  // ── public: scan ─────────────────────────────────────────────────────────
  // files: array of File. opts.onStatus(msg). Resolves to a normalized draft.
  async function scan(files, opts) {
    opts = opts || {};
    var status = opts.onStatus || function () {};
    if (!hasKey()) throw new Error("NO_KEY");
    if (!files || !files.length) throw new Error("Choose at least one photo first.");
    if (files.length > MAX_IMAGES) throw new Error("Please scan at most " + MAX_IMAGES + " photos at once.");

    status("Preparing image" + (files.length > 1 ? "s" : "") + "…");
    var images = [];
    for (var i = 0; i < files.length; i++) images.push(await fileToResizedJpeg(files[i]));

    status("Reading your recipe with AI…");
    var settings = getSettings();
    var categories = S.orderedCategories(S.load());
    if (!categories.length) categories = (window.COOKBOOK_CATEGORIES || []).slice();

    var raw = await callAnthropic(images, categories, settings);
    var draft = S.normalizeRecipe(raw);
    draft.id = ""; // a draft — the editor assigns the id on save
    return draft;
  }

  function init() { build(); }

  return {
    init: init,
    openSettings: openSettings,
    hasKey: hasKey,
    scan: scan,
    models: MODELS,
  };
})();
