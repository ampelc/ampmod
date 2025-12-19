import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import InlineMessages from '../../containers/inline-messages.jsx';
import SB3Downloader from '../../containers/sb3-downloader.jsx';
import {filterInlineAlerts} from '../../reducers/alerts';
import classNames from 'classnames';

import styles from './menu-bar.css';
import fileIcon from './icon--save.svg';

const TWSaveStatus = ({alertsList, fileHandle, projectChanged, showSaveFilePicker}) =>
    filterInlineAlerts(alertsList).length > 0 ? (
        <InlineMessages />
    ) : (
        projectChanged && (
            <SB3Downloader showSaveFilePicker={showSaveFilePicker}>
                {(_className, _downloadProjectCallback, {smartSave}) => (
                    <div onClick={smartSave} className={classNames([styles.menuBarItem, styles.hoverable])}>
                        <img
                            src={fileIcon}
                            className={styles.buttonIcon}
                            draggable={false}
                            width={20}
                            height={20}
                        />
                        <span className={styles.collapsibleLabel}>
                            {fileHandle ? (
                                <FormattedMessage
                                    defaultMessage="Save as {file}"
                                    description="Menu bar item to save project to an existing file on the user's computer"
                                    id="tw.menuBar.saveAs"
                                    values={{
                                        file: fileHandle.name
                                    }}
                                />
                            ) : (
                                <FormattedMessage
                                    defaultMessage="Save to your computer"
                                    description="Menu bar item for downloading a project to your computer"
                                    id="gui.menuBar.downloadToComputer"
                                />
                            )}
                        </span>
                    </div>
                )}
            </SB3Downloader>
        )
    );

TWSaveStatus.propTypes = {
    alertsList: PropTypes.arrayOf(PropTypes.object),
    fileHandle: PropTypes.shape({
        name: PropTypes.string
    }),
    projectChanged: PropTypes.bool,
    showSaveFilePicker: PropTypes.func
};

const mapStateToProps = state => ({
    alertsList: state.scratchGui.alerts.alertsList,
    fileHandle: state.scratchGui.tw.fileHandle,
    projectChanged: state.scratchGui.projectChanged
});

export default connect(mapStateToProps, () => ({}))(TWSaveStatus);
