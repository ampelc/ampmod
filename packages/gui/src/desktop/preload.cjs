const { ipcRenderer, contextBridge } = require("electron");
contextBridge.exposeInMainWorld('electronAPI', {
    openDesktopSettings: () => ipcRenderer.send('open-desktop-settings')
});
