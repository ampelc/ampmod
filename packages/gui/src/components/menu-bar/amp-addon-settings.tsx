import React from 'react';
import {FormattedMessage} from 'react-intl';
import {MenuItem} from '../menu/menu.jsx';
import addonsIcon from './addons.svg';
import styles from './settings-menu.css';

interface AddonsLinkProps {
    handleClickAddonSettings?(...args: unknown[]): unknown;
    theme?: Theme;
}

const AddonsLink = ({
    handleClickAddonSettings
}: AddonsLinkProps) => (
    <MenuItem>
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
        </div>
    </MenuItem>
);

export default AddonsLink;
