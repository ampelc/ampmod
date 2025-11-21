import electron from 'electron';
const { shell, ipcMain, app, dialog, BrowserWindow } = electron;
import path from 'path';
import { fileURLToPath } from 'node:url';
import { APP_NAME } from '@ampmod/branding';
import { setupProtocols } from './protocols.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true
    }
  });

  win.setMenu(null);

  win.webContents.session.webRequest.onBeforeRequest(
    {
      urls: [
        "https://extensions.turbowarp.org/*",
        "https://ampmod.codeberg.page/extensions/*"
      ]
    },
    (details, callback) => {
      const url = new URL(details.url);
      const segments = url.pathname.split('/').filter(Boolean);

      const localPath = `ampmod-extension-gallery://./${segments.slice(segments.length > 1 ? 1 : 0).join('/')}`;

      callback({ redirectURL: localPath });
    }
  );

  win.webContents.on('before-input-event', (event, input) => {
    if ((input.control && input.shift && input.key.toLowerCase() === 'i') || input.key === 'F12') {
      event.preventDefault();
      win.webContents.toggleDevTools();
    }

    if (input.control && (input.key === "F5" || input.key.toLowerCase() === "r")) {
      event.preventDefault();
      win.webContents.reload();
    }
  });

  let processingWillPreventUnload = false;

  win.once('ready-to-show', () => win.show());

  win.webContents.on('will-prevent-unload', () => {
    // Happily stolen from from https://github.com/TurboWarp/desktop/blob/6c52ba5/src-main/windows/editor.js#L252
    //
    // Using showMessageBoxSync synchronously in the event handler causes broken focus on Windows.
    // See https://github.com/TurboWarp/desktop/issues/1245
    // To work around that, we won't cancel that will-prevent-unload event so the window stays
    // open. After a very short delay to let focus get fixed, we'll show a dialog and force close
    // the window ourselves if the user wants.

    // Due to the timeout, this event could theoretically fire multiple times before we show the
    // dialog. Make sure to only show one dialog if that happens.
    if (processingWillPreventUnload) {
      return;
    }
    processingWillPreventUnload = true;

    setTimeout(() => {
      const choice = dialog.showMessageBoxSync(win, {
        title: APP_NAME,
        type: 'info',
        buttons: ["Stay", "Leave"],
        cancelId: 0,
        defaultId: 0,
        message: "Are you sure you want to exit?",
        detail: "Changes you made may be lost.",
        noLink: true
      });

      if (choice === 1) win.destroy();
      processingWillPreventUnload = false;
    });
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    const u = new URL(url);

    // hack so the tile on the extension library linking to our gallery online works
    if (u.pathname === "/extensions/" || u.pathname === "/extensions") {
      shell.openExternal(url);
      return { action: "deny" };
    }

    if (u.hostname === "ampmod.codeberg.page") {
      const segments = u.pathname.split('/').filter(Boolean);

      const newWin = new BrowserWindow({
        width: 700,
        height: 800,
        show: true,
        title: APP_NAME,
        webPreferences: {
          preload: path.join(__dirname, "preload-infoPages.cjs"),
          contextIsolation: true,
        }
      });

      newWin.setMenu(null);

      if (segments[0] === "extensions") {
        const galleryURL = `ampmod-extension-gallery://./${segments.slice(1).join('/')}`;
        newWin.loadURL(galleryURL);
      } else {
        const localURL = `amp-gui://./${segments.join('/')}`;
        newWin.loadURL(localURL);
      }

      return { action: "deny" };
    }

    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    const u = new URL(url);

    if (u.hostname === "ampmod.codeberg.page") {
      event.preventDefault();

      const segments = u.pathname.split('/').filter(Boolean);

      const newWin = new BrowserWindow({
        width: 450,
        height: 700,
        show: true,
        title: APP_NAME,
        webPreferences: {
          preload: path.join(__dirname, "preload.cjs"),
          contextIsolation: true
        }
      });

      newWin.setMenu(null);
      newWin.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
      });
      newWin.webContents.on('will-navigate', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
      });
  
      if (segments[0] === "extensions") {
        const galleryURL = `ampmod-extension-gallery://./${segments.slice(1).join('/')}`;
        newWin.loadURL(galleryURL);
      } else {
        const localURL = `amp-gui://./${segments.join('/')}`;
        newWin.loadURL(localURL);
      }

      return;
    }

    const sameOrigin = new URL(win.webContents.getURL()).origin === u.origin;
    if (!sameOrigin) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  win.loadURL('amp-gui://./editor-desktop.html');
};

app.whenReady().then(() => {
  setupProtocols();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on('open-desktop-settings', () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL('amp-gui://settings/settings.html');
});
