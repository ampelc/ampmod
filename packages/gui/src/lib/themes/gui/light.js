import {guiColors as modernLightColors} from './amp-light';

const guiColors = {
    ...modernLightColors,

    'ui-primary': 'hsla(215, 100%, 95%, 1)' /* #E5F0FF */,
    'ui-secondary': 'hsla(215, 75%, 95%, 1)' /* #E9F1FC */,
    'ui-tertiary': 'hsla(215, 50%, 90%, 1)' /* #D9E3F2 */,

    'ui-modal-background': 'hsla(0, 100%, 100%, 1)' /* #FFFFFF */,
    'ui-modal-foreground': 'hsla(225, 15%, 40%, 1)' /* #575E75 */,
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

const blockColors = {};

export {guiColors, blockColors};
