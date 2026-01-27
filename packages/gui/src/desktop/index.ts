import { app, ipcMain, shell } from 'electron';
import { APP_NAME } from '@ampmod/branding';
import { setupProtocols } from './protocols.js';
import { createRequire } from 'node:module';
import EditorWindow from './windows/editor';
import fs from 'fs';
import os from 'os';

const require = createRequire(import.meta.url);
const { version } = require("./../../../../package.json");

app.setName(APP_NAME.replaceAll(' ', '-'));

app.whenReady().then(() => {
  setupProtocols();
  EditorWindow.newWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (EditorWindow.getAllWindows().length === 0) {
    EditorWindow.newWindow();
  }
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
  if (process.platform === 'darwin') return `macOS ${os.release()}`;
  if (process.platform === 'win32') return `Windows ${os.release()}`;
  return `Unknown ${os.release()}`;
}

ipcMain.on('version', event => {
  event.returnValue = version;
});

ipcMain.on('get-system-info', event => {
  const electronVersion = process.versions.electron;
  const distro = getDistro();
  const arch = process.arch;
  event.returnValue = `Electron v${electronVersion}, ${distro} ${arch}`;
});