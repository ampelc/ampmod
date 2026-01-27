import AbstractWindow from '.';
import { shell } from 'electron';

export default class AboutWindow extends AbstractWindow {
    constructor() {
        super();
        this.window.setMenu(null);
        this.loadURL('desktop-info://./about.html');
        this.window.once('ready-to-show', () => this.show());
        this.window.webContents.on('will-navigate', (event, url) => {
            event.preventDefault();
            shell.openExternal(url);
        });
    }

    getDimensions() {
        return { width: 400, height: 600 };
    }

    getPreload() {
        return 'about';
    }

    getTitleBarStyle() {
        return 'hidden';
    }
    getTitleBarOverlay() {
        return {
            color: "#4FA55C",
            symbolColor: "#ffffff",
            height: 30
        }
    }
    isPopup() { return true }
}