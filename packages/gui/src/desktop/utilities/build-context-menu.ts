import { Menu } from "electron";

export const buildContextMenu = (win: Electron.BrowserWindow) => {
const menu = Menu.buildFromTemplate([
    { role: 'copy' },
    { role: 'cut' },
    { role: 'paste' }
  ]);
  win.webContents.on('context-menu', (_, params: { isEditable: boolean }) => {
    // only show the context menu if the element is editable
    if (params.isEditable) {
      menu.popup();
    };
  })
}