import electron from 'electron';
const { shell, ipcMain, app, dialog, BrowserWindow } = electron;
import path from 'path';
import { fileURLToPath } from 'node:url';
import { APP_NAME } from '@ampmod/branding';
import { setupProtocols } from './protocols.js';
import { createRequire } from 'node:module';
import { buildContextMenu } from './utilities/build-context-menu.ts';
import { buildOfflineGallery } from './utilities/build-offline-gallery.ts';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const { version } = require("./../../../../package.json");

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

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders, url } = details;
    const parsed = new URL(url);

    if (parsed.origin === "ampmod.codeberg.page" || parsed.origin === "https://ampmod.codeberg.page") {
      // @ts-ignore
      responseHeaders['Access-Control-Allow-Origin'] = ['*'];
      // @ts-ignore
      responseHeaders['Access-Control-Allow-Headers'] = ['*'];
      // @ts-ignore
      responseHeaders['Access-Control-Allow-Methods'] = ['GET, POST, PUT, DELETE, OPTIONS'];
    }

    callback({ responseHeaders });
  });


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

  win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    // Mods: If you modify AmpMod, change the referer and user agent, BUT change the user agent to "AmpMod/fork [fork name]/${version}"
    details.requestHeaders['User-Agent'] += ` AmpMod/${version}`;
    details.requestHeaders['Referer'] = 'https://ampmod.codeberg.page/desktop-referer.html';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

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

  win.webContents.on('will-navigate', (event, url) => {
    const u = new URL(url);
    const segments = u.pathname.split('/').filter(Boolean);

    if (u.hostname === "ampmod.codeberg.page" && segments[0] === "extensions") {
      event.preventDefault();

      const newWin = new BrowserWindow({
        width: 450,
        height: 700,
        show: true,
        title: APP_NAME,
        webPreferences: {
          preload: path.join(__dirname, "preload-infoPages.cjs"),
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
  
      const galleryURL = `ampmod-extension-gallery://./${segments.slice(1).join('/')}`;
      newWin.loadURL(galleryURL);

      return;
    }

    const sameOrigin = new URL(win.webContents.getURL()).origin === u.origin;
    if (!sameOrigin) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  buildContextMenu(win);
  buildOfflineGallery(win);

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

  win.setMenu(null);
  win.loadURL('amp-gui://./desktop-settings.html');
});

ipcMain.on('open-addon-settings', () => {
  const win = new BrowserWindow({
    width: 850,
    height: 900,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.setMenu(null);
  buildContextMenu(win);
  win.loadURL('amp-gui://./addons.html');
});

ipcMain.on('open-addon', (_event, addonId) => {
  const win = new BrowserWindow({
    width: 850,
    height: 900,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.setMenu(null);
  buildContextMenu(win);
  win.loadURL(`amp-gui://./addons.html#${addonId}`);
});

ipcMain.on('open-about', () => {
  const win = new BrowserWindow({
    width: 700,
    height: 450,
    resizable: false,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, "preload-about.cjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.setMenu(null);
  win.loadURL(`desktop-info://./about.html`);
  win.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
});

ipcMain.on('version', event => {
  event.returnValue = version;
});

function getDistro() {
  if (process.platform === 'linux') {
    try {
      const data = fs.readFileSync('/etc/os-release', 'utf8');
      const name = data.match(/^NAME="?(.+?)"?$/m)?.[1];
      const version = data.match(/^VERSION="?(.+?)"?$/m)?.[1];
      return `${name} ${version}`;
    } catch {
      return `Linux ${os.release()}`;
    }
  }

  if (process.platform === 'darwin') {
    return `macOS ${os.release()}`;
  }

  if (process.platform === 'win32') {
    return `Windows ${os.release()}`;
  }

  return `Unknown ${os.release()}`;
}

ipcMain.on('get-system-info', event => {
  const electronVersion = process.versions.electron;
  const distro = getDistro();
  const arch = process.arch;

  event.returnValue = `Electron v${electronVersion}, ${distro} ${arch}`;
});
