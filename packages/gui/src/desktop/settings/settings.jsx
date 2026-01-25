import React, { useState } from 'react';
import render from '../../playground/app-target';
import styles from './settings.css';
import '@fontsource-variable/inter';
import 'modern-normalize';
import './resets.css';
import designStyles from '../../website/design.css';
import { applyGuiColors } from '../../lib/themes/guiHelpers';
import { detectTheme } from '../../lib/themes/themePersistance';
import { APP_NAME } from '@ampmod/branding';

applyGuiColors(detectTheme());

const DesktopSettings = () => {
  const [allowAnyWebsite, setAllowAnyWebsite] = useState(false);
  const [useLocalGallery, setUseLocalGallery] = useState(false);
  const [nodeIntegration, setNodeIntegration] = useState(false);
  const api = window.desktopSettingsApi;

  const handleToggleAnyWebsite = () => {
    setAllowAnyWebsite(prev => {
      const newValue = !prev;
      api.setSetting('allowAnyWebsite', newValue);
      return newValue;
    });
  };

  const handleToggleLocalGallery = () => {
    setUseLocalGallery(prev => {
      const newValue = !prev;
      api.setSetting('useLocalGallery', newValue);
      return newValue;
    });
  };

  const handleToggleNodeIntegration = () => {
    const newValue = !nodeIntegration;
    setNodeIntegration(newValue);
    api.setSetting('nodeIntegration', newValue);
  };

  const handleReset = () => {
    confirm(`Are you sure you want to reset ${APP_NAME}? This will irreversably delete all data such as settings and your backpack.`);
  }

  return (
    <div className={styles.settingsContainer}>
      <p className={styles.description}>WIP - these do nothing yet.</p>

      <div className={styles.settingItem}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={allowAnyWebsite}
            onChange={handleToggleAnyWebsite}
            className={`${styles.checkbox} ${styles.toggleInput}`}
          />
          <span className={styles.labelText}>Allow {APP_NAME} to access any website</span>
        </label>
      </div>

      <div className={styles.settingItem}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={useLocalGallery}
            onChange={handleToggleLocalGallery}
            className={`${styles.checkbox} ${styles.toggleInput}`}
          />
          <span className={styles.labelText}>Use a local copy of the extension gallery</span>
        </label>
        <p className={styles.note}>
          This allows offline use at the cost of potentially being outdated. Update AmpMod regularly to prevent this.
        </p>
      </div>

      <h2 className={styles.header}>Do not use unless you know what you are doing:</h2>
      <div className={styles.settingItem}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={useLocalGallery}
            onChange={handleToggleNodeIntegration}
            className={`${styles.checkbox} ${styles.toggleInput}`}
          />
          <span className={styles.labelText}>Node.js integration, which may give projects the ability to do anything with this system, including the ability to install malware</span>
        </label>
      </div>
      <div>
        <button className={styles.button} onClick={() => {api.openUserData()}}>
          Open Data Folder
        </button>
      </div>
      <div>
        <button className={`${styles.button} ${styles.dangerButton}`} onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

render(<DesktopSettings />);
