import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import {APP_NAME} from '@ampmod/branding';
import Modal from '../../containers/modal.jsx';
import styles from './unknown-platform-modal.css';

const messages = defineMessages({
    title: {
        defaultMessage: 'Outdated Version',
        description: 'Title of modal that appears when loading a project made with another version of the current platform',
        id: 'amp.unknownVersion.title'
    }
});

const platformToString = platform => {
    if (!platform) {
        return '(?)';
    }
    if (platform.name && platform.url) {
        return `${platform.name} (${platform.url})`;
    } else if (platform.name) {
        return `${platform.name}`;
    } else if (platform.url) {
        return `${platform.url}`;
    }
    return '(?)';
};

const UnknownPlatformModal = props => (
    <Modal
        className={styles.modalContent}
        onRequestClose={props.onClose}
        contentLabel={props.intl.formatMessage(messages.title)}
        id="unknownPlatformModal"
    >
        <div className={styles.body}>
            <p>
                <FormattedMessage
                    defaultMessage="The project was made for a newer major or minor version of this platform."          
                    description="Text in modal that appears when loading a project made for another version."
                    id="amp.unknownVersion.1"
                    values={{APP_NAME}}
                />
            </p>

            <p>
                <FormattedMessage
                     
                    defaultMessage="Compatibility with {APP_NAME} {APP_VERSION} is not guaranteed. You can continue at your own risk, but we may not be able to help if you encounter any problems."
                     
                    description="Text in modal that appears when loading a project made for another version."
                    id="amp.unknownVersion.2"
                    values={{
                        APP_NAME,
                        APP_VERSION: process.env.ampmod_version
                    }}
                />
            </p>

            <button className={styles.button} onClick={props.onClose} disabled={!props.canClose}>
                <FormattedMessage
                    defaultMessage="I understand"
                     
                    description="Button in modal that appears when loading a project made for another mod. Allows ignoring the warning."
                    id="tw.unknownPlatform.continue"
                />
            </button>
        </div>
    </Modal>
);

UnknownPlatformModal.propTypes = {
    intl: intlShape,
    onClose: PropTypes.func.isRequired,
    canClose: PropTypes.bool,
    platform: PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string
    })
};

export default injectIntl(UnknownPlatformModal);
