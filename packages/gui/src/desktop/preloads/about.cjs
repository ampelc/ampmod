const { ipcRenderer, contextBridge } = require("electron");
contextBridge.exposeInMainWorld('_AMP_INTERNAL_API', {
    version: () => ipcRenderer.sendSync('version'),
    sysinfo: () => ipcRenderer.sendSync('get-system-info')
});
