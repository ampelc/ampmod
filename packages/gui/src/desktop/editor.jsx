/*!
 * Copyright (C) 2025 AmpElectrecuted
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {injectIntl, intlShape, defineMessages} from 'react-intl';
import {getIsLoading} from '../reducers/project-state.js';

import AppStateHOC from '../lib/app-state-hoc.jsx';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import TWThemeManagerHOC from '../containers/tw-theme-manager-hoc.jsx';
import TWProjectMetaFetcherHOC from '../lib/tw-project-meta-fetcher-hoc.jsx';
import TWStateManagerHOC from '../lib/tw-state-manager-hoc.jsx';
import SBFileUploaderHOC from '../lib/sb-file-uploader-hoc.jsx';
import TWPackagerIntegrationHOC from '../lib/tw-packager-integration-hoc.jsx';

import SettingsStore from '../addons/settings-store-singleton.js';
import AddonChannels from '../addons/channels.js';
import runAddons from '../addons/entry.js';

import GUI from '../playground/render-gui.jsx';
import styles from '../playground/interface.css';

import {APP_NAME} from '@ampmod/branding';

runAddons();

if (AddonChannels.reloadChannel) {
    AddonChannels.reloadChannel.addEventListener('message', () => {
        location.reload();
    });
}

if (AddonChannels.changeChannel) {
    AddonChannels.changeChannel.addEventListener('message', e => {
        SettingsStore.setStoreWithVersionCheck(e.data);
    });
}

const handleClickAddonSettings = (addonId) => {
    // Electron passes objects to this for some strange reason
    if (typeof addonId === 'string') {
        window._AMP_INTERNAL_API.openAddon(addonId);
        return;
    }
    window._AMP_INTERNAL_API.openAddonSettings();
};

class Interface extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdateProjectTitle = this.handleUpdateProjectTitle.bind(this);
    }

    handleUpdateProjectTitle(title, isDefault) {
        if (!title) {
            document.title = `${APP_NAME}`;
        } else {
            document.title = `${title} - ${APP_NAME}`;
        }
    }

    render() {
        const {isRtl, ...props} = this.props;

        return (
            <div className={classNames(styles.container, styles.editor)} dir={isRtl ? 'rtl' : 'ltr'}>
                <div className={styles.center}>
                    <GUI
                        onClickAddonSettings={handleClickAddonSettings}
                        onUpdateProjectTitle={this.handleUpdateProjectTitle}
                        onClickDesktopSettings={() => {
                            window._AMP_INTERNAL_API.openDesktopSettings();
                        }}
                        backpackVisible
                        backpackHost="_local_"
                        isScratchDesktop
                        {...props}
                    />
                </div>
            </div>
        );
    }
}

Interface.propTypes = {
    intl: intlShape,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    isLoading: PropTypes.bool,
    isRtl: PropTypes.bool
};

const mapStateToProps = state => ({
    customStageSize: state.scratchGui.customStageSize,
    isLoading: getIsLoading(state.scratchGui.projectState.loadingState),
    isRtl: state.locales.isRtl
});

const ConnectedInterface = injectIntl(connect(mapStateToProps)(Interface));

const WrappedInterface = compose(
    AppStateHOC,
    ErrorBoundaryHOC('AmpMod Desktop'),
    // amp: Trigger TWThemeManagerHOC earlier so early crash message errors are readable
    TWThemeManagerHOC,
    TWStateManagerHOC,
    SBFileUploaderHOC,
    TWPackagerIntegrationHOC
)(ConnectedInterface);

export default WrappedInterface;
