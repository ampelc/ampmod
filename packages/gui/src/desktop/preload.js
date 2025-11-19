import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    openDesktopSettings: () => ipcRenderer.send('open-desktop-settings')
});
