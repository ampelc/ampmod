import React from 'react';
import {FormattedMessage} from 'react-intl';
import {MenuItem} from '../menu/menu.jsx';
import icon from './tw-advanced.svg';
import styles from './settings-menu.css';
import openLinkIcon from './tw-open-link.svg';
import { APP_NAME } from '@ampmod/branding';

const onClick = () => window.open("https://ampmod.codeberg.page/", "_blank", "noopener");

const AmpVisitWebsiteStandalone = () => (
    <MenuItem onClick={onClick}>
        <div className={styles.option}>
            <img src={icon} draggable={false} width={24} height={24} className={styles.icon} alt="" />
            <span className={styles.submenuLabel}>
                <FormattedMessage
                    defaultMessage="{APP_NAME} Website"
                    description="Button in menu bar under settings to open the website"
                    id="amp.menuBar.visitWebsite"
                    values={{APP_NAME}}
                />
            </span>
            <img src={openLinkIcon} draggable={false} width={20} height={20} className={styles.icon} />
        </div>
    </MenuItem>
);

export default AmpVisitWebsiteStandalone;
