const { ipcRenderer, contextBridge } = require("electron");
contextBridge.exposeInMainWorld('desktopSettingsApi', {
  setSetting: (key, value) => ipcRenderer.send('set-setting', { key, value })
});
