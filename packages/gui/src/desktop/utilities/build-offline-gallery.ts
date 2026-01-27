import { shell, BrowserWindow, app } from 'electron';
import { APP_NAME } from '@ampmod/branding';
import path from 'path';
import { fileURLToPath } from 'node:url';
const __dirname = app.getAppPath();

export const buildOfflineGallery = win => {
  win.webContents.setWindowOpenHandler(({ url }) => {
    const u = new URL(url);

    // hack so the tile on the extension library linking to our gallery online works
    if (u.pathname === "/extensions/" || u.pathname === "/extensions") {
      shell.openExternal(url);
      return { action: "deny" };
    }

    if (u.hostname === "ampmod.codeberg.page") {
      const segments = u.pathname.split('/').filter(Boolean);
      if (segments[0] !== "extensions") {
        shell.openExternal(url);
        return { action: 'deny' };
      }

      const newWin = new BrowserWindow({
        width: 700,
        height: 800,
        show: true,
        title: APP_NAME,
        webPreferences: {
          preload: path.join(__dirname, "preloads/infoPages.cjs"),
          contextIsolation: true,
        }
      });

      newWin.setMenu(null);

      const galleryURL = `ampmod-extension-gallery://./${segments.slice(1).join('/')}.html`;
      newWin.loadURL(galleryURL);
    }

    shell.openExternal(url);
    return { action: 'deny' };
  });
}