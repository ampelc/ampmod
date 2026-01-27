import AbstractWindow from '.';

export default class ExtDocsWindow extends AbstractWindow {
    constructor(url: string) {
        super();
        this.window.setMenu(null);
        this.loadURL(url);
        this.window.once('ready-to-show', () => this.show());
    }

    getDimensions() {
        return { width: 700, height: 800 };
    }

    getPreload() {
        return 'infoPages';
    }

    getTitleBarStyle() {
        return 'default';
    }

    applySettings() {
        this.window.setMenu(null);
    }
}