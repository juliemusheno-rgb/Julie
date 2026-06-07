// Electron main process for "Our Family Recipe Book".
// Creates the desktop window and wires up the application menu, which sends
// actions to the renderer (see preload.js + src/app.js).
const { app, BrowserWindow, Menu, shell } = require("electron");
const path = require("path");

let mainWindow = null;

function send(action) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("menu-action", action);
  }
}

function loadPage(file) {
  if (mainWindow) mainWindow.loadFile(path.join(__dirname, "src", file));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 880,
    minWidth: 480,
    minHeight: 560,
    backgroundColor: "#ECE6D7",
    title: "Our Family Recipe Book",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true,
    },
  });

  loadPage("index.html");

  // Open external links (e.g. recipe sources) in the user's browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) { shell.openExternal(url); return { action: "deny" }; }
    return { action: "allow" };
  });

  mainWindow.on("closed", () => { mainWindow = null; });
}

function buildMenu() {
  const isMac = process.platform === "darwin";
  const template = [
    ...(isMac ? [{ role: "appMenu" }] : []),
    {
      label: "File",
      submenu: [
        { label: "Add Recipe…", accelerator: "CmdOrCtrl+N", click: () => send("add") },
        { type: "separator" },
        { label: "Import Recipes…", accelerator: "CmdOrCtrl+O", click: () => send("import") },
        { label: "Export Recipes…", accelerator: "CmdOrCtrl+S", click: () => send("export") },
        { type: "separator" },
        { label: "Print / Save as PDF…", accelerator: "CmdOrCtrl+P", click: () => send("print") },
        { type: "separator" },
        { label: "Restore Original Recipes", click: () => send("reset") },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" }, { role: "redo" }, { type: "separator" },
        { role: "cut" }, { role: "copy" }, { role: "paste" }, { role: "selectAll" },
        { type: "separator" },
        { label: "Find / Search", accelerator: "CmdOrCtrl+F", click: () => send("search") },
      ],
    },
    {
      label: "Go",
      submenu: [
        { label: "Cookbook", accelerator: "CmdOrCtrl+1", click: () => loadPage("index.html") },
        { label: "Recipe Dashboard", accelerator: "CmdOrCtrl+2", click: () => loadPage("dashboard.html") },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" }, { role: "forceReload" }, { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" }, { role: "zoomIn" }, { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    { role: "windowMenu" },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
