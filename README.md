# Our Family Recipe Book 🌿

A cozy desktop cookbook app — Julie's *"Sage & Clay"* recipe book, made interactive.
Browse, search, add, and edit your recipes, then print a beautiful book or save it
as a PDF. Everything is stored **locally on your device** — no account, no internet,
no cloud required.

![chapters: Appetizers · Soups & Chilis · Salads & Sides · Mains · Breakfast & Breads · Desserts · Drinks](https://img.shields.io/badge/recipes-33-BC6B47) ![storage: local](https://img.shields.io/badge/storage-on%20your%20device-56634E)

---

## What it does

- **Your whole book, beautifully laid out** — cover, table of contents, chapter
  dividers, and a printed-cookbook look for every recipe (the original *Sage & Clay* design).
- **Search** by recipe name, ingredient, source, or any word in a recipe.
- **Filter by chapter** (Appetizers, Mains, Desserts, …).
- **Add / edit / delete recipes** with a friendly form — multi-part ingredient
  groups (e.g. "Sauce" + "Topping"), numbered steps, details (yields, prep, bake),
  a story, source credit, and notes.
- **Export & import** your collection as a `.json` file — perfect for backups or
  moving to another computer.
- **Print or Save as PDF** — the whole book, or a **single recipe** (hover a recipe
  and click **Print**). Letter-sized, one recipe per page.
- **📸 Scan a recipe from a photo** — point Claude's vision at a recipe card or
  cookbook page and it fills in the recipe for you (optional; needs an API key).
- **Saves automatically** to this device. Your edits are there next time you open it.

### Recipe Dashboard (the "back office")

Open the **Dashboard** (button in the toolbar, the ⚙ link in the sidebar, or
**Go ▸ Recipe Dashboard** / `Cmd+2`) to add and manage recipes three ways:

1. **📸 Scan a photo (AI)** — snap or upload a photo of a recipe card, cookbook
   page, or screenshot, and Claude's vision reads it into a structured recipe.
   The draft opens in the editor for you to review before saving. Requires a
   one-time Anthropic API key setup (see below).
2. **Upload or paste a recipe** — drop in a `.txt`, `.md`, `.html`, or `.json`
   file (or paste the text), and it's parsed into a recipe card. The draft opens
   in the editor so you can review and tidy it before saving. The parser
   recognizes a title, `Ingredients:` / `Directions:` / `Notes:` sections,
   sub-groups (e.g. `Topping:`), details like `Prep: 20 min`, and `Source:` lines.
3. **Type a new recipe** — open a clean form with ingredient groups, numbered
   steps, details, a story, and notes.

The dashboard also lists every recipe (grouped by chapter) with quick **View /
Edit / Delete**, plus search, chapter filter, and export/import. Anything you do
here shows up in the cookbook immediately.

#### Setting up photo scanning

Photo scanning uses Anthropic's Claude API, so it needs an API key:

1. Get a key at **[console.anthropic.com](https://console.anthropic.com)** → *API Keys*
   (you'll need a small amount of credit — scanning a recipe costs a few US cents).
2. In the dashboard, click **set it up** under the *Scan a photo* card (or the ⚙ in
   the scan area), paste your key, choose a model, and **Save**.

Then drag in one or more photos and click **Scan recipe →**.

- **Your key stays on this device.** It's saved in local storage and sent
  directly from the app to Anthropic to read your photo — nowhere else.
- **Models:** Opus 4.8 (most accurate, default), Sonnet 4.6 (faster), or
  Haiku 4.5 (cheapest) — switch anytime in the settings dialog.
- **Formats:** JPG, PNG, and WebP. iPhone **HEIC** photos aren't supported by the
  API — open one in Preview and **File ▸ Export** to JPEG first. Photos are
  automatically downscaled before upload to keep things fast and cheap.
- **Multi-page recipes:** add several photos at once and they're read together as
  one recipe.
- Scanning always produces a **draft you review in the editor** — nothing is saved
  until you click Save.

---

## Running the app

### Option A — Desktop app (recommended)

You'll need [Node.js](https://nodejs.org) installed (which includes `npm`).

```bash
npm install      # one-time: downloads Electron
npm start        # launches the desktop app
```

### Option B — Just open it in a browser (no install)

The app also runs as a plain web page. Simply open **`src/index.html`** in your
web browser (e.g. double-click it, or drag it into Safari/Chrome). Search,
editing, and local saving all work the same way.

> Tip: the desktop app and the browser version each keep their own local copy of
> your recipes. Use **Export / Import** to move recipes between them.

### Building a packaged installer

The project is configured with [electron-builder](https://www.electron.build/) so
you can produce a standalone, double-clickable app. **Build on the OS you're
targeting** (macOS installers must be built on a Mac, Windows on Windows):

```bash
npm install            # installs electron + electron-builder
npm run dist           # build for the machine you're on
```

…or target a specific platform:

```bash
npm run dist:mac       # .dmg + .zip  (run on macOS)
npm run dist:win       # .exe installer (NSIS, run on Windows)
npm run dist:linux     # .AppImage   (run on Linux)
```

The finished installer lands in the **`dist/`** folder. On first launch on macOS,
right-click the app and choose **Open** (since it isn't code-signed), or sign it
with your Apple Developer ID for distribution.

> **Icon:** the app icon is generated automatically from `build/icon.png`
> (a 1024×1024 sage-sprig mark). Edit `build/icon.svg` and re-export `icon.png`
> to change it.

---

## Keyboard shortcuts

| Action | Shortcut |
| --- | --- |
| Search | `Cmd/Ctrl + F` |
| Add recipe | `Cmd/Ctrl + N` |
| Print / Save as PDF | `Cmd/Ctrl + P` |
| Export recipes | `Cmd/Ctrl + S` |
| Import recipes | `Cmd/Ctrl + O` |
| Go to Cookbook | `Cmd/Ctrl + 1` |
| Go to Dashboard | `Cmd/Ctrl + 2` |
| Close dialog / menu | `Esc` |

---

## Where your recipes live

Recipes are saved in the browser's `localStorage` under the key
`ourFamilyRecipeBook.v1`. The 33 starter recipes live in
[`src/recipes.seed.js`](src/recipes.seed.js); they're loaded only the first time
you run the app (or when you choose **Restore Original Recipes**). After that,
your own additions and edits are what's saved.

**Back up regularly** with **More ▸ Export recipes** — it writes a dated `.json`
file you can keep safe or re-import later.

---

## Project layout

```
.
├── main.js              Electron main process (window + app menu)
├── preload.js           Secure bridge for menu actions
├── package.json         Scripts and build config
├── build/
│   ├── icon.svg         Source artwork for the app icon
│   └── icon.png         1024×1024 icon (used by electron-builder)
└── src/
    ├── index.html       Cookbook shell (toolbar, sidebar)
    ├── dashboard.html   Recipe dashboard (upload/paste/type + manage)
    ├── styles.css       The "Sage & Clay" design + UI styles
    ├── store.js         Shared data layer + recipe-text parser
    ├── editor.js        Shared recipe editor modal
    ├── ai-scan.js       Photo → recipe via the Claude vision API
    ├── app.js           Cookbook: rendering, search, print, import/export
    ├── dashboard.js     Dashboard: entry, parsing, management table
    └── recipes.seed.js  The 33 starter recipes
```

Made with love for the family table. 🍋
