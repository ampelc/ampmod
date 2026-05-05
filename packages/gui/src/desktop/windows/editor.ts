import { dialog, shell, BrowserWindow, app } from 'electron';
import path from 'path';
import AbstractWindow from '.';
import GalleryWindow from './extension-documentation';
import { APP_NAME } from '@ampmod/branding';
import { buildOfflineGallery } from '../utilities/build-offline-gallery';
import AboutWindow from './about';
import AddonWindow from './addon';

export default class EditorWindow extends AbstractWindow {
    processingWillPreventUnload: boolean;
    private readonly baseTitleBarHeight = 47;
    private currentThemeColor = "#4FA55C";
    declare window: any;
    declare ipc: any;

    constructor(options = {}) {
        super(options);
        this.processingWillPreventUnload = false;

        // Electron passes the color string directly as the second argument
        this.window.webContents.on('did-change-theme-color', (_event: any, color: string | null) => {
            if (color && color !== this.currentThemeColor) {
                // Electron usually returns the color in #RRGGBB format here
                this.updateTitleBar(color);
            }
        });

        this.window.webContents.on('zoom-changed', () => {
            this.updateTitleBar();
        });

        this.window.webContents.on('did-finish-load', () => {
            this.updateTitleBar();
        });

        this.window.webContents.setWindowOpenHandler(({ url }) => {
            const u = new URL(url);
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
                
                const resourcePath = segments.slice(1).join('/');
                const isAsset = resourcePath.includes('.');
                const galleryURL = `ampmod-extension-gallery://${resourcePath}${isAsset ? '' : '.html'}`;
                
                new GalleryWindow(galleryURL);
                return { action: 'deny' };
            }

            shell.openExternal(url);
            return { action: 'deny' };
        });

        this.window.webContents.on('will-prevent-unload', (event: any) => {
            if (this.processingWillPreventUnload) return;
            this.processingWillPreventUnload = true;

            setTimeout(() => {
                const choice = dialog.showMessageBoxSync(this.window, {
                    title: APP_NAME,
                    type: 'info',
                    buttons: ["Stay", "Leave"],
                    cancelId: 0,
                    defaultId: 0,
                    message: "Are you sure you want to exit?",
                    detail: "Changes you made may be lost.",
                    noLink: true
                });

                if (choice === 1) this.window.destroy();
                this.processingWillPreventUnload = false;
            }, 0);
        });

        buildOfflineGallery(this.window);

        this.setupIpc();
        this.loadURL('amp-gui://./editor-desktop.html');
        this.show();
        
        setImmediate(() => this.updateTitleBar());
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

    private setupIpc() {
        this.ipc.on('open-desktop-settings', () => {
            const win = new BrowserWindow({
                width: 800,
                height: 600,
                show: false,
                webPreferences: {
                    preload: path.join(app.getAppPath(), "preloads/settings.cjs"),
                    nodeIntegration: false,
                    contextIsolation: true
                }
            });
            win.setMenu(null);
            win.loadURL('amp-gui://./desktop-settings.html');
            win.once('ready-to-show', () => win.show());
        });

        this.ipc.on('open-addon-settings', () => this.createAddonWindow());
        this.ipc.on('open-addon', (_: any, addonId: string | undefined) => this.createAddonWindow(addonId));

        this.ipc.on('open-about', () => {
            new AboutWindow();
        });

        this.ipc.on('open-user-data', () => {
            shell.openPath(app.getPath('userData'));
        });
    }

    createAddonWindow(addonId?: string) {
        new AddonWindow(addonId, {
            themeColor: this.currentThemeColor,
            zoomFactor: this.window.webContents.getZoomFactor()
        });
    }

    getDimensions() {
        return { width: 1400, height: 900 };
    }

    getPreload() {
        return 'main';
    }

    getTitleBarStyle() {
        return 'hidden';
    }

    getTitleBarOverlay() {
        return {
            color: "#4FA55C",
            symbolColor: "#fff",
            height: this.baseTitleBarHeight
        };
    }

    applySettings() {
        this.window.setMenu(null);
    }

    static newWindow() {
        return new EditorWindow();
    }
}