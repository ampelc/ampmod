import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {connect} from 'react-redux';

import check from './check.svg';
import dropdownCaret from './dropdown-caret.svg';
import {MenuItem, MenuSection, Submenu} from '../menu/menu.jsx';
import {
    GUI_MAP,
    GUI_AMP_LIGHT,
    GUI_LIGHT,
    GUI_DARK,
    GUI_AMOLED,
    GUI_HIGH_CONTRAST,
    GUI_CUSTOM,
    Theme
} from '../../lib/themes/index.js';
import {closeSettingsMenu} from '../../reducers/menus.js';
import {setTheme} from '../../reducers/theme.js';
import {persistTheme} from '../../lib/themes/themePersistance.js';
import lightModeIcon from './tw-sun.svg';
import darkModeIcon from './tw-moon.svg';
import colourfulModeIcon from './md-symbols-palette.svg';
import customIcon from './tw-blocks-custom.svg';
import {openGuiThemeMenu, guiThemeMenuOpen} from '../../reducers/menus.js';
import styles from './settings-menu.css';
import openLinkIcon from './tw-open-link.svg';

const options = defineMessages({
    [GUI_AMP_LIGHT]: {
        defaultMessage: 'Light',
        description: 'Light theme option',
        id: 'amp.gui.light'
    },
    [GUI_LIGHT]: {
        defaultMessage: 'Colourful',
        description: 'Colourful theme option',
        id: 'amp.gui.colourful'
    },
    [GUI_DARK]: {
        defaultMessage: 'Dark',
        description: 'Dark theme option',
        id: 'amp.gui.dark'
    },
    [GUI_AMOLED]: {
        defaultMessage: 'AMOLED',
        description: 'AMOLED theme option',
        id: 'amp.gui.amoled'
    },
    [GUI_HIGH_CONTRAST]: {
        defaultMessage: 'High Contrast (Alpha)',
        description: 'High contrast theme option',
        id: 'amp.gui.highContrast'
    },
    [GUI_CUSTOM]: {
        defaultMessage: 'Customize in Addon Settings',
        description: 'Link to addon settings',
        id: 'tw.blockColors.custom'
    }
});

const icons = {
    [GUI_LIGHT]: colourfulModeIcon,
    [GUI_AMP_LIGHT]: lightModeIcon,
    [GUI_DARK]: darkModeIcon,
    [GUI_AMOLED]: darkModeIcon,
    [GUI_HIGH_CONTRAST]: darkModeIcon,
    [GUI_CUSTOM]: customIcon,
};

const GuiIcon = ({ id }) => <img src={icons[id]} draggable={false} width={24} height={24} className={styles.icon} alt="" />;

GuiIcon.propTypes = {id: PropTypes.string};

const GuiThemeItem = ({id, isSelected, onClick, disabled, ...props}) => (
    <MenuItem onClick={disabled ? null : onClick} {...props}>
        <div
            className={classNames(styles.option, {
                [styles.disabled]: disabled
            })}
        >
            <img
                className={classNames(styles.check, {
                    [styles.selected]: isSelected
                })}
                width={15}
                height={12}
                src={check}
                draggable={false}
            />
            <GuiIcon id={id} />
            <FormattedMessage {...options[id]} />
            {id === GUI_CUSTOM && (
                <img width={20} height={20} className={styles.openLink} src={openLinkIcon} draggable={false} />
            )}
        </div>
    </MenuItem>
);

GuiThemeItem.propTypes = {
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

const GuiThemeMenu = ({isOpen, isRtl, onChangeTheme, onOpenCustomSettings, onOpen, theme}) => (
    <MenuItem expanded={isOpen}>
        <div className={styles.option} onClick={onOpen}>
            <GuiIcon id={theme.gui} />
            <div className={styles.menuItemTitleAndSubtitle}>
                <span className={styles.submenuLabel}>
                    <FormattedMessage
                        defaultMessage={theme.gui === GUI_CUSTOM ? 'Theme and Accent' : 'Theme'}
                        description="Label for menu to choose GUI theme or theme + accent if custom"
                        id={theme.gui === GUI_CUSTOM ? 'amp.menuBar.guiThemeCustom' : 'amp.menuBar.guiTheme'}
                    />
                </span>
                <span className={styles.menuItemSubtitle}>
                    <FormattedMessage {...options[theme.gui]} />
                </span>
            </div>
            <img className={styles.expandCaret} src={dropdownCaret} draggable={false} />
        </div>
        <Submenu place={isRtl ? 'left' : 'right'}>
          {[
              GUI_AMP_LIGHT,
              GUI_LIGHT
          ].map(id => (
              <GuiThemeItem
                  key={id}
                  id={id}
                  isSelected={theme.gui === id}
                  onClick={id === GUI_CUSTOM ? onOpenCustomSettings : () => onChangeTheme(theme.set('gui', id))}
                  disabled={id !== GUI_CUSTOM && theme.gui === GUI_CUSTOM}
              />
          ))}
          <MenuSection>
              {[
                  GUI_DARK,
                  GUI_AMOLED
              ].map(id => (
                  <GuiThemeItem
                      key={id}
                      id={id}
                      isSelected={theme.gui === id}
                      onClick={id === GUI_CUSTOM ? onOpenCustomSettings : () => onChangeTheme(theme.set('gui', id))}
                      disabled={id !== GUI_CUSTOM && theme.gui === GUI_CUSTOM}
                  />
              ))}
            </MenuSection>
          <MenuSection>
              {[
                  ...(onOpenCustomSettings ? [GUI_CUSTOM] : [])
              ].map(id => (
                  <GuiThemeItem
                      key={id}
                      id={id}
                      isSelected={theme.gui === id}
                      onClick={id === GUI_CUSTOM ? onOpenCustomSettings : () => onChangeTheme(theme.set('gui', id))}
                      disabled={id !== GUI_CUSTOM && theme.gui === GUI_CUSTOM}
                  />
              ))}
            </MenuSection>
        </Submenu>
    </MenuItem>
);

GuiThemeMenu.propTypes = {
    theme: PropTypes.instanceOf(Theme),
    isRtl: PropTypes.bool,
    onOpen: PropTypes.func,
    onChangeTheme: PropTypes.func,
    onOpenCustomSettings: PropTypes.func
};

const mapStateToProps = state => ({
    isOpen: guiThemeMenuOpen(state),
    theme: state.scratchGui.theme.theme,
    isRtl: state.locales.isRtl
});

const mapDispatchToProps = dispatch => ({
    onChangeTheme: theme => {
        dispatch(setTheme(theme));
        dispatch(closeSettingsMenu());
        persistTheme(theme);
    },
    onOpen: () => dispatch(openGuiThemeMenu())
});

export default connect(mapStateToProps, mapDispatchToProps)(GuiThemeMenu);
