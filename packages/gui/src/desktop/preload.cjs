const { ipcRenderer, contextBridge } = require("electron");
contextBridge.exposeInMainWorld('_AMP_INTERNAL_API', {
    openDesktopSettings: () => ipcRenderer.send('open-desktop-settings'),
    openAddon: addonID => ipcRenderer.send('open-addon', addonID),
    openAddonSettings: () => ipcRenderer.send('open-addon-settings')
});
