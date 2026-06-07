// Secure bridge between the Electron menu (main process) and the page (renderer).
// Exposes a tiny, read-only API — no Node access leaks into the page.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("cookbookAPI", {
  // Subscribe to application-menu actions: "add", "import", "export",
  // "print", "reset", "search".
  onMenu: (callback) => {
    ipcRenderer.on("menu-action", (_event, action) => callback(action));
  },
});
