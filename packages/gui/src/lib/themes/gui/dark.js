import { guiColors as ampDarkGuiColors, blockColors } from "./amp-dark";

const guiColors = {
    ...ampDarkGuiColors,

    "ui-primary": "#111111",
    "ui-secondary": "#1e1e1e",
    "ui-tertiary": "#2e2e2e",

    'ui-modal-header-background': 'var(--ui-modal-header-background-classic, var(--looks-secondary))',
    'ui-modal-header-foreground': 'hsla(0, 100%, 100%, 1)' /* #FFFFFF */,
    'progress-bar-outer': 'hsla(0, 100%, 100%, 0.25)',
    'menu-bar-hover': 'var(--menu-bar-hover-classic, hsla(0, 0%, 0%, 0.15))',
    'menu-bar-background': 'var(--menu-bar-background-classic, var(--looks-secondary))',
    'menu-bar-foreground': '#ffffff',
    'menu-bar-icon-filter': 'none',
    'menu-bar-background-image': 'var(--menu-bar-background-image-classic)',
    'menu-bar-bottom-border': 'transparent',
    'feedback-background': 'var(--menu-bar-foreground)',
    'feedback-foreground': 'var(--menu-bar-background)',
};

export { guiColors, blockColors };