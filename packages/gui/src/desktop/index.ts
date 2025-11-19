import electron from 'electron';
const { ipcMain, app, dialog, BrowserWindow } = electron;
import path from 'path';
import { APP_NAME } from '@ampmod/branding';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    webPreferences: {
      preload: path.join(process.cwd(), "preload.js"),
      webSecurity: false,
    }
  });

  win.setMenu(null);

  win.webContents.on('before-input-event', (event, input) => {
    // Ctrl+Shift+I or F12 = dev tools
    if ((input.control && input.shift && input.key.toLowerCase() === 'i') || input.key === 'F12') {
      event.preventDefault();
      win.webContents.toggleDevTools();
    }

    // Ctrl+R or Ctrl+F5 = reload
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
        buttons: [
          "Stay",
          "Leave"
        ],
        cancelId: 0,
        defaultId: 0,
        message: "Are you sure you want to exit?",
        detail: "Changes you made may be lost.",
        noLink: true
      });
      if (choice === 1) {
        win.destroy();
      }
      processingWillPreventUnload = false;
    });
  });

  if (process.argv.includes('--dev')) {
    win.loadURL('http://localhost:8601/editor-desktop.html');
  } else {
    win.loadFile('./dist-rendered/editor-desktop.html');
  }
};

app.whenReady().finally(createWindow);

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

    win.loadFile('./settings/settings.html');
});