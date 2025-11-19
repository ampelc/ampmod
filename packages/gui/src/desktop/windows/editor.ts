import electron from 'electron';
const { dialog, BrowserWindow } = electron;
import { APP_NAME } from '@ampmod/branding';

export class EditorWindow {
  public win: InstanceType<typeof BrowserWindow> | null = null;
  private processingWillPreventUnload = false;

  constructor() {
    this.createWindow();
  }

  private createWindow() {
    this.win = new BrowserWindow({
      width: 1400,
      height: 900,
      webPreferences: {
        nodeIntegration: false
      }
    });

    this.win.setMenu(null);
    this.setupShortcuts();
    this.setupWillPreventUnload();
    this.loadContent();
  }

  private setupShortcuts() {
    if (!this.win) return;

    this.win.webContents.on('before-input-event', (event: { preventDefault: () => void; }, input: { control: any; shift: any; key: string; }) => {
      // Ctrl+Shift+I or F12 = dev tools
      if ((input.control && input.shift && input.key.toLowerCase() === 'i') || input.key === 'F12') {
        event.preventDefault();
        this.win?.webContents.toggleDevTools();
      }

      // Ctrl+R or Ctrl+F5 = reload
      if (input.control && (input.key === "F5" || input.key.toLowerCase() === "r")) {
        event.preventDefault();
        this.win?.webContents.reload();
      }
    });
  }

  private setupWillPreventUnload() {
    if (!this.win) return;

    this.win.webContents.on('will-prevent-unload', () => {
      // Happily stolen from from https://github.com/TurboWarp/desktop/blob/6c52ba5/src-main/windows/editor.js#L252
      //
      // Using showMessageBoxSync synchronously in the event handler causes broken focus on Windows.
      // See https://github.com/TurboWarp/desktop/issues/1245
      // To work around that, we won't cancel that will-prevent-unload event so the window stays
      // open. After a very short delay to let focus get fixed, we'll show a dialog and force close
      // the window ourselves if the user wants.

      // Due to the timeout, this event could theoretically fire multiple times before we show the
      // dialog. Make sure to only show one dialog if that happens.
      if (this.processingWillPreventUnload) {
        return;
      }
      this.processingWillPreventUnload = true;

      setTimeout(() => {
        const choice = dialog.showMessageBoxSync(this.win!, {
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
          this.win?.destroy();
        }
        this.processingWillPreventUnload = false;
      });
    });
  }

  private loadContent() {
    if (!this.win) return;

    if (process.argv.includes('--dev')) {
      this.win.loadURL('http://localhost:8601/editor-desktop.html');
    } else {
      this.win.loadFile('./dist-rendered/editor-desktop.html');
    }
  }
}