import { app, ipcMain, shell } from 'electron';
import { APP_NAME } from '@ampmod/branding';
import { setupProtocols } from './protocols.js';
import { createRequire } from 'node:module';
import EditorWindow from './windows/editor';
import UpdateWindow from './windows/update';
import fs from 'fs';
import os from 'os';
import path from 'path';

const require = createRequire(import.meta.url);
const { version } = require("./../../../../package.json");

// Path to wait for before booting any UI
const EDITOR_PATH = path.join(app.getAppPath(), 'gui', 'editor-desktop.html');

app.setName(APP_NAME.replaceAll(' ', '-'));

/**
 * Polling helper to ensure the app doesn't start until the build file exists.
 */
function waitForEditorFile(callback) {
  if (fs.existsSync(EDITOR_PATH)) {
    callback();
  } else {
    setTimeout(() => waitForEditorFile(callback), 100);
  }
}

/**
 * Handles the update check and returns a promise that resolves only 
 * when it's safe to open the Editor (either no update, or update dismissed).
 */
async function handleInitialBoot() {
  try {
    const response = await fetch('https://codeberg.org/api/v1/repos/ampmod/ampmod/releases/latest');
    if (!response.ok) throw new Error('Network error');

    const data = await response.json();
    const remoteVersion = data.tag_name;

    // If an update is found, create the window and wait for it to close
    if (remoteVersion !== version) {
      return new Promise((resolve) => {
        const updateWin = new UpdateWindow();
        
        // Strictly wait until the window is fully gone
        updateWin.window.on('closed', () => {
          resolve();
        });
      });
    }
  } catch (err) {
    console.error('Update check failed, proceeding to editor:', err);
  }
  
  // Resolve immediately if no update is found or fetch fails
  return Promise.resolve();
}

// --- App Lifecycle ---

app.whenReady().then(() => {
  setupProtocols();

  waitForEditorFile(async () => {
    // 1. Wait for update logic to finish (including user dismissal)
    await handleInitialBoot();

    // 2. Only now create the editor window
    if (EditorWindow.getAllWindows().length === 0) {
      EditorWindow.newWindow();
    }

    // 3. Set up the recurring background check (won't block anything)
    setInterval(backgroundUpdateCheck, 30 * 60 * 1000);
  });
});

/**
 * Background check that just pops the window up if a new version is found 
 * during a session.
 */
async function backgroundUpdateCheck() {
  try {
    const response = await fetch('https://codeberg.org/api/v1/repos/ampmod/ampmod/releases/latest');
    const data = await response.json();
    if (data.tag_name !== version) {
      if (UpdateWindow.getWindowsByClass(UpdateWindow).length === 0) {
        new UpdateWindow();
      }
    }
  } catch (e) {}
}

// --- System Info Listeners ---

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // Logic to prevent opening editor if update window is currently modal/visible
  const noWindows = EditorWindow.getAllWindows().length === 0 && 
                    UpdateWindow.getWindowsByClass(UpdateWindow).length === 0;
  if (noWindows) {
    EditorWindow.newWindow();
  }
});

function getDistro() {
  if (process.platform === 'linux') {
    try {
      const data = fs.readFileSync('/etc/os-release', 'utf8');
      const name = data.match(/^NAME="?(.+?)"?$/m)?.[1];
      const v = data.match(/^VERSION="?(.+?)"?$/m)?.[1];
      return `${name} ${v}`;
    } catch {
      return `Linux ${os.release()}`;
    }
  }
  if (process.platform === 'darwin') return `macOS ${os.release()}`;
  if (process.platform === 'win32') return `Windows ${os.release()}`;
  return `Unknown ${os.release()}`;
}

ipcMain.on('version', event => {
  event.returnValue = version;
});

ipcMain.on('get-system-info', event => {
  event.returnValue = `Electron v${process.versions.electron}, ${getDistro()} ${process.arch}`;
});