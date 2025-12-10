import { Menu } from "electron";

export const buildContextMenu = win => {
const menu = Menu.buildFromTemplate([
    { role: 'copy' },
    { role: 'cut' },
    { role: 'paste' }
  ]);
  win.webContents.on('context-menu', (_event, params) => {
    // only show the context menu if the element is editable
    if (params.isEditable) {
      menu.popup();
    };
  })
}