import defaultsDeep from "lodash.defaultsdeep";

import * as accentGreen from "./accent/green";
import * as accentGreenOld from "./accent/green-old";
import * as accentPurple from "./accent/purple";
import * as accentBlue from "./accent/blue";
import * as accentRed from "./accent/red";
import * as accentRainbow from "./accent/rainbow";
import * as accentGrey from "./accent/grey";

import * as guiLight from "./gui/light";
import * as guiAmpLight from "./gui/amp-light";
import * as guiDark from "./gui/dark";
import * as guiAmpDark from "./gui/amp-dark";
import * as guiAmoled from "./gui/amp-amoled";
import * as guiHighContrast from "./gui/amp-high-contrast";

import * as blocksThree from "./blocks/three";
import * as blocksHighContrast from "./blocks/high-contrast";
import * as blocksDark from "./blocks/dark";

import "./fonts/inter";

const ACCENT_PURPLE = "purple";
const ACCENT_BLUE = "blue";
const ACCENT_RED = "red";
const ACCENT_RAINBOW = "rainbow";
const ACCENT_GREEN = "green";
const ACCENT_GREEN_OLD = "green-old";
const ACCENT_GREY = "grey";

const ACCENT_MAP = {
    [ACCENT_PURPLE]: accentPurple,
    [ACCENT_BLUE]: accentBlue,
    [ACCENT_RED]: accentRed,
    [ACCENT_GREEN]: accentGreen,
    [ACCENT_GREEN_OLD]: accentGreenOld,
    [ACCENT_GREY]: accentGrey,
    [ACCENT_RAINBOW]: accentRainbow,
};
const ACCENT_DEFAULT =
    process.env.ampmod_mode === "canary" ? ACCENT_RED : ACCENT_GREEN;

const GUI_AMP_LIGHT = "light";
const GUI_LIGHT = "light-classic";
const GUI_AMP_DARK = "dark";
const GUI_DARK = "dark-classic";
const GUI_AMOLED = "amoled";
const GUI_HIGH_CONTRAST = "high-contrast";
const GUI_CUSTOM = "custom";
const GUI_MAP = {
    [GUI_AMP_LIGHT]: guiAmpLight,
    [GUI_LIGHT]: guiLight,
    [GUI_AMP_DARK]: guiAmpDark,
    [GUI_DARK]: guiDark,
    [GUI_AMOLED]: guiAmoled,
    [GUI_HIGH_CONTRAST]: guiHighContrast,
    // amp-customizable-colours addon
    [GUI_CUSTOM]: {},
};
const GUI_DEFAULT = GUI_AMP_LIGHT;

const BLOCKS_THREE = "three";
const BLOCKS_DARK = "dark";
const BLOCKS_HIGH_CONTRAST = "high-contrast";
const BLOCKS_CUSTOM = "custom";
const BLOCKS_DEFAULT = BLOCKS_THREE;
const defaultBlockColors = blocksThree.blockColors;
const BLOCKS_MAP = {
    [BLOCKS_THREE]: {
        blocksMediaFolder: "blocks-media/default",
        colors: blocksThree.blockColors,
        extensions: blocksThree.extensions,
        customExtensionColors: {},
        useForStage: true,
    },
    [BLOCKS_HIGH_CONTRAST]: {
        blocksMediaFolder: "blocks-media/high-contrast",
        colors: defaultsDeep(
            {},
            blocksHighContrast.blockColors,
            defaultBlockColors,
        ),
        extensions: blocksHighContrast.extensions,
        customExtensionColors: blocksHighContrast.customExtensionColors,
        useForStage: true,
    },
    [BLOCKS_DARK]: {
        blocksMediaFolder: "blocks-media/dark",
        colors: defaultsDeep({}, blocksDark.blockColors, defaultBlockColors),
        extensions: blocksDark.extensions,
        customExtensionColors: blocksDark.customExtensionColors,
        useForStage: false,
    },
    [BLOCKS_CUSTOM]: {
        // to be filled by editor-theme3 addon
        blocksMediaFolder: "blocks-media/default",
        colors: blocksThree.blockColors,
        extensions: {},
        customExtensionColors: {},
        useForStage: false,
    },
};

let themeObjectsCreated = 0;

class Theme {
    constructor(accent, gui, blocks) {
        // do not modify these directly
        /** @readonly */
        this.id = ++themeObjectsCreated;
        /** @readonly */
        this.accent = Object.prototype.hasOwnProperty.call(ACCENT_MAP, accent)
            ? accent
            : ACCENT_DEFAULT;
        /** @readonly */
        this.gui = Object.prototype.hasOwnProperty.call(GUI_MAP, gui)
            ? gui
            : GUI_DEFAULT;
        /** @readonly */
        this.blocks = Object.prototype.hasOwnProperty.call(BLOCKS_MAP, blocks)
            ? blocks
            : BLOCKS_DEFAULT;
    }

    static light = new Theme(ACCENT_DEFAULT, GUI_AMP_LIGHT, BLOCKS_DEFAULT);
    static dark = new Theme(ACCENT_DEFAULT, GUI_AMP_DARK, BLOCKS_DEFAULT);
    static highContrast = new Theme(
        ACCENT_DEFAULT,
        GUI_DEFAULT,
        BLOCKS_HIGH_CONTRAST,
    );

    set(what, to) {
        if (what === "accent") {
            return new Theme(to, this.gui, this.blocks);
        } else if (what === "gui") {
            return new Theme(this.accent, to, this.blocks);
        } else if (what === "blocks") {
            return new Theme(this.accent, this.gui, to);
        }
        throw new Error(`Unknown theme property: ${what}`);
    }

    getBlocksMediaFolder() {
        return BLOCKS_MAP[this.blocks].blocksMediaFolder;
    }

    getGuiColors() {
        return defaultsDeep(
            {},
            this.gui === "high-contrast" || this.gui === "custom"
                ? null
                : ACCENT_MAP[this.accent].guiColors,
            GUI_MAP[this.gui].guiColors,
            guiLight.guiColors,
        );
    }

    getBlockColors() {
        return defaultsDeep(
            {},
            ACCENT_MAP[this.accent].blockColors,
            GUI_MAP[this.gui].blockColors,
            BLOCKS_MAP[this.blocks].colors,
        );
    }

    getExtensions() {
        return BLOCKS_MAP[this.blocks].extensions;
    }

    isDark() {
        return (
            this.getGuiColors()["color-scheme"] === "dark" ||
            this.getGuiColors()["color-scheme"] === "amoled" ||
            this.getGuiColors()["color-scheme"] === "high-contrast"
        );
    }

    getStageBlockColors() {
        if (BLOCKS_MAP[this.blocks].useForStage) {
            return this.getBlockColors();
        }
        return Theme.light.getBlockColors();
    }

    getCustomExtensionColors() {
        return BLOCKS_MAP[this.blocks].customExtensionColors;
    }
}

export {
    Theme,
    defaultBlockColors,
    ACCENT_RED,
    ACCENT_PURPLE,
    ACCENT_BLUE,
    ACCENT_RAINBOW,
    ACCENT_GREEN,
    ACCENT_GREEN_OLD,
    ACCENT_GREY,
    ACCENT_MAP,
    GUI_AMP_LIGHT,
    GUI_LIGHT,
    GUI_AMP_DARK,
    GUI_DARK,
    GUI_AMOLED,
    GUI_HIGH_CONTRAST,
    GUI_MAP,
    GUI_CUSTOM,
    BLOCKS_THREE,
    BLOCKS_DARK,
    BLOCKS_HIGH_CONTRAST,
    BLOCKS_CUSTOM,
    BLOCKS_MAP,
};
