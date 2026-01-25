/*!
 * Copyright (C) 2021 Thomas Weber
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
import AmpFileDragHOC from '../lib/amp-file-drag-hoc';
import {loadServiceWorker} from './load-service-worker';

import SettingsStore from '../addons/settings-store-singleton';
import AddonChannels from '../addons/channels';
import runAddons from '../addons/entry';

import GUI from './render-gui.jsx';
import styles from './interface.css';

import {APP_NAME, APP_SLOGAN} from '@ampmod/branding';

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

const handleClickAddonSettings = addonId => {
    if (process.env.ampmod_mode === "standalone") {
        const url = new URL(window.location.href);
        url.searchParams.set('addon-settings', '');

        if (typeof addonId === 'string' && addonId.length > 0) {
            url.hash = `#${addonId}`;
        } else {
            url.hash = '';
        }

        window.open(url.toString(), '_blank');
        return;
    }
    // addonId might be a string of the addon to focus on, undefined, or an event (treat like undefined)
    const path = process.env.ROUTING_STYLE === 'wildcard' || process.env.SPA ? 'addons' : 'addons.html';
    const url = `${process.env.ROOT}${path}${typeof addonId === 'string' ? `#${addonId}` : ''}`;
    window.open(url);
};

const messages = defineMessages({
    defaultTitle: {
        defaultMessage: 'Run Scratch projects faster',
        description: 'Default title of editor',
        id: 'tw.guiDefaultTitle'
    }
});

class Interface extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdateProjectTitle = this.handleUpdateProjectTitle.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isLoading && !this.props.isLoading) {
            loadServiceWorker();
        }
    }

    handleUpdateProjectTitle(title, isDefault) {
        if (isDefault || !title) {
            document.title = `${APP_NAME} Editor`;
        } else {
            document.title = `${title} on ${APP_NAME}`;
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
                        backpackVisible
                        backpackHost="_local_"
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
    ErrorBoundaryHOC('TW Interface'),
    // amp: Trigger TWThemeManagerHOC earlier so early crash message errors are readable
    TWThemeManagerHOC,
    TWProjectMetaFetcherHOC,
    TWStateManagerHOC,
    SBFileUploaderHOC,
    AmpFileDragHOC,
    TWPackagerIntegrationHOC
)(ConnectedInterface);

export default WrappedInterface;
