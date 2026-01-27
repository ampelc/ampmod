import { BrowserWindow, app } from 'electron';
import path from 'path';
import AbstractWindow from '.';

export default class AddonWindow extends AbstractWindow {
    private readonly baseTitleBarHeight = 47;
    private currentThemeColor: string;

    constructor(addonId?: string, parentOptions = { themeColor: "#4FA55C", zoomFactor: 1 }) {
        super({
            width: 850,
            height: 900,
            show: false,
            webPreferences: {
                preload: path.join(app.getAppPath(), "preloads/main.cjs"),
                nodeIntegration: false,
                contextIsolation: true
            },
            titleBarStyle: 'hidden'
        });

        this.currentThemeColor = parentOptions.themeColor;

        this.window.webContents.on('did-change-theme-color', (_event: any, color: string | null) => {
            if (color && color !== this.currentThemeColor) {
                this.updateTitleBar(color);
            }
        });

        this.window.webContents.on('zoom-changed', () => this.updateTitleBar());
        this.window.webContents.on('did-finish-load', () => {
            this.window.webContents.setZoomFactor(parentOptions.zoomFactor);
            this.updateTitleBar();
        });

        this.window.setMenu(null);
        const url = addonId ? `amp-gui://./addons.html#${addonId}` : 'amp-gui://./addons.html';
        this.window.loadURL(url);

        this.window.once('ready-to-show', () => {
            this.updateTitleBar();
            this.window.show();
        });
    }

    private updateTitleBar(newColor?: string) {
        if (process.platform === 'darwin') return;
        if (newColor) this.currentThemeColor = newColor;

        const factor = this.window.webContents.getZoomFactor();
        const scaledHeight = Math.max(30, Math.round(this.baseTitleBarHeight * factor));

        const luma = this.getLuminance(this.currentThemeColor);
        const symbolColor = luma > 0.8 ? "#000000" : "#ffffff";

        this.window.setTitleBarOverlay({
            color: this.currentThemeColor,
            symbolColor: symbolColor,
            height: scaledHeight
        });
    }

    private getLuminance(hex: string) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    getDimensions() {
        return { width: 850, height: 900 };
    }

    getPreload() {
        return 'main';
    }

    getTitleBarStyle(): "hidden" | "default" | "hiddenInset" | "customButtonsOnHover" | undefined {
        return 'hidden';
    }

    getTitleBarOverlay() {
        return {
            color: this.currentThemeColor || "#4FA55C",
            symbolColor: "#fff",
            height: this.baseTitleBarHeight
        };
    }
}