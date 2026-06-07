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
- **Print or Save as PDF** — letter-sized, one recipe per page.
- **Saves automatically** to this device. Your edits are there next time you open it.

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

### Building an installer (optional)

To package a standalone app you can double-click (`.app`, `.exe`, or `.AppImage`):

```bash
npm install --save-dev electron-builder
npm run dist
```

The installer appears in the `dist/` folder.

---

## Keyboard shortcuts

| Action | Shortcut |
| --- | --- |
| Search | `Cmd/Ctrl + F` |
| Add recipe | `Cmd/Ctrl + N` |
| Print / Save as PDF | `Cmd/Ctrl + P` |
| Export recipes | `Cmd/Ctrl + S` |
| Import recipes | `Cmd/Ctrl + O` |
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
└── src/
    ├── index.html       App shell (toolbar, sidebar, editor modal)
    ├── styles.css       The "Sage & Clay" design + UI styles
    ├── app.js           Rendering, search, editor, import/export, print
    └── recipes.seed.js  The 33 starter recipes
```

Made with love for the family table. 🍋
