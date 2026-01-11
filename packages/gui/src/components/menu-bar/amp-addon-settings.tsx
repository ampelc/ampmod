import {FormattedMessage} from 'react-intl';
import React from 'react';
import {MenuItem} from '../menu/menu.jsx';
import addonsIcon from './addons.svg';
import openLinkIcon from './tw-open-link.svg';
import styles from './settings-menu.css';

const AddonSettingsButton = ({handleClickAddonSettings, ...props}: {
  handleClickAddonSettings: () => void;
}) => (
    <MenuItem {...props}>
        <div
            className={styles.option}
            onClick={handleClickAddonSettings}
        >
            <img src={addonsIcon} draggable={false} width={24} height={24} className={styles.icon} />
            <span className={styles.submenuLabel}>
                <FormattedMessage
                    defaultMessage="Addons"
                    description="Button to open addon settings"
                    id="tw.menuBar.addons"
                />
            </span>
            <img src={openLinkIcon} draggable={false} width={20} height={20} className={styles.icon} />
        </div>
    </MenuItem>
);

export default AddonSettingsButton;
