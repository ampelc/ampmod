import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import LanguageMenu from './language-menu.jsx';
import MenuBarMenu from './menu-bar-menu.jsx';
import {MenuSection} from '../menu/menu.jsx';
import MenuLabel from './tw-menu-label.jsx';
import TWAccentThemeMenu from './tw-theme-accent.jsx';
import TWGuiThemeMenu from './tw-theme-gui.jsx';
import TWBlocksThemeMenu from './tw-theme-blocks.jsx';
import TWDesktopSettings from './tw-desktop-settings.jsx';
import AmpAddonSettings from './amp-addon-settings.tsx';
import AmpInstallPWA from './amp-install-pwa.tsx';
import AmpErase from './amp-erase.tsx';
import AmpShowWelcome from './amp-show-welcome.jsx';
import AmpVisitWebsiteStandalone from './amp-visit-website-standalone.tsx';
import {MenuItem} from '../menu/menu.jsx';
import {APP_NAME} from '@ampmod/branding';

import menuBarStyles from './menu-bar.css';
import styles from './settings-menu.css';

import dropdownCaret from './dropdown-caret.svg';
import settingsIcon from './icon--settings.svg';

// Sequence to type "ark" 3 times
const ERASE_LOCK_KEYCOMB = ['KeyA', 'KeyR', 'KeyK', 'KeyA', 'KeyR', 'KeyK', 'KeyA', 'KeyR', 'KeyK'];

class SettingsMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showAmpErase: false,
            konamiIndex: 0
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    // Use componentDidUpdate to manage the keydown listener based on menu state
    componentDidUpdate(prevProps) {
        const {settingsMenuOpen} = this.props;

        if (settingsMenuOpen !== prevProps.settingsMenuOpen) {
            if (settingsMenuOpen) {
                // Menu is opened: Start listening and reset index
                window.addEventListener('keydown', this.handleKeyDown);
                this.setState({konamiIndex: 0});
            } else {
                // Menu is closed: Stop listening and reset the AmpErase state
                window.removeEventListener('keydown', this.handleKeyDown);
                this.setState({
                    showAmpErase: false, // Reset AmpErase condition
                    konamiIndex: 0
                });
            }
        }
    }

    // Remove the listener when the component is fully unmounted (not just closed)
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        const {konamiIndex} = this.state;
        const expectedKey = ERASE_LOCK_KEYCOMB[konamiIndex];
        const pressedKey = event.code;

        if (pressedKey === expectedKey) {
            const nextIndex = konamiIndex + 1;

            if (nextIndex === ERASE_LOCK_KEYCOMB.length) {
                // Konami code completed
                this.setState({showAmpErase: true, konamiIndex: 0});
            } else {
                // Next key in sequence
                this.setState({konamiIndex: nextIndex});
            }
        } else {
            // Sequence broken, check if the key was the first one to restart the attempt
            this.setState({
                konamiIndex: pressedKey === ERASE_LOCK_KEYCOMB[0] ? 1 : 0
            });
        }
    }

    render() {
        const {
            canChangeLanguage,
            canChangeTheme,
            isRtl,
            onClickDesktopSettings,
            onClickAddonSettings,
            onOpenCustomSettings,
            onOpenAltCustomSettings,
            onRequestClose,
            onRequestOpen,
            settingsMenuOpen
        } = this.props;

        const {showAmpErase} = this.state;

        return (
            <div>
                <MenuLabel open={settingsMenuOpen} onOpen={onRequestOpen} onClose={onRequestClose}>
                    <img
                        src={settingsIcon}
                        className={menuBarStyles.icon}
                        draggable={false}
                        width={20}
                        height={20}
                    />
                    <span className={styles.dropdownLabel}>
                        <FormattedMessage
                            defaultMessage="Settings"
                            description="Settings menu"
                            id="gui.menuBar.settings"
                        />
                    </span>
                    <img
                        src={dropdownCaret}
                        draggable={false}
                        width={8}
                        height={5}
                        className={menuBarStyles.itemDropdownCaretIcon}
                    />
                    <MenuBarMenu
                        className={menuBarStyles.menuBarMenu}
                        open={settingsMenuOpen}
                        place={isRtl ? 'left' : 'right'}
                    >
                        <MenuSection>
                            {canChangeLanguage && <LanguageMenu onRequestCloseSettings={onRequestClose} />}
                            {canChangeTheme && (
                                <>
                                    <TWGuiThemeMenu onOpenCustomSettings={onOpenAltCustomSettings} />
                                    <TWBlocksThemeMenu onOpenCustomSettings={onOpenCustomSettings} />
                                    <TWAccentThemeMenu />
                                </>
                            )}
                            {onClickDesktopSettings && <TWDesktopSettings onClick={onClickDesktopSettings} />}
                        </MenuSection>
                        <MenuSection>
                            <AmpAddonSettings handleClickAddonSettings={onClickAddonSettings} />
                            {process.env.ampmod_mode === "standalone" && <AmpVisitWebsiteStandalone />}
                            {process.env.ampmod_mode !== 'standalone' && <AmpInstallPWA />}
                            {/* <AmpShowWelcome /> */}

                            {(showAmpErase || process.env.ampmod_mode === 'standalone') && <AmpErase />}
                        </MenuSection>
                        <MenuSection>
                            <MenuItem>
                                <div className={`${styles.option} ${styles.disabled}`}>
                                    <span className={styles.submenuLabel}>
                                        {APP_NAME} v{process.env.ampmod_version}
                                    </span>
                                </div>
                            </MenuItem>
                        </MenuSection>
                    </MenuBarMenu>
                </MenuLabel>
            </div>
        );
    }
}

SettingsMenu.propTypes = {
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    isRtl: PropTypes.bool,
    onClickDesktopSettings: PropTypes.func,
    onOpenCustomSettings: PropTypes.func,
    onRequestClose: PropTypes.func,
    onRequestOpen: PropTypes.func,
    settingsMenuOpen: PropTypes.bool
};

export default SettingsMenu;
