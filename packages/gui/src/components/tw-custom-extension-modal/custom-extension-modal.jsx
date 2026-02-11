import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import FileInput from './file-input.jsx';
import styles from './custom-extension-modal.css';
import FancyCheckbox from '../tw-fancy-checkbox/checkbox.jsx';
import {isTrustedExtension} from '../../containers/tw-security-manager.jsx';

import {APP_NAME} from '@ampmod/branding';

const messages = defineMessages({
    title: {
        defaultMessage: 'Load Custom Extension',
        description: 'Title of custom extension menu',
        id: 'tw.customExtensionModal.title'
    }
});

const CustomExtensionModal = props => {
    const [shouldSave, setShouldSave] = useState(false);
    const [saveName, setSaveName] = useState('');
    const [saveDescription, setSaveDescription] = useState('');

    const handleLoadClick = () => {
        props.onLoadExtension({
            saveToLocalStorage: shouldSave,
            saveName,
            saveDescription
        });
    };

    return (
        <Modal
            className={styles.modalContent}
            onRequestClose={props.onClose}
            contentLabel={props.intl.formatMessage(messages.title)}
            id="customExtensionModal"
        >
            <Box
                className={styles.body}
                onDragOver={props.onDragOver}
                onDragLeave={props.onDragLeave}
                onDrop={props.onDrop}
            >
                <div className={styles.typeSelectorContainer}>
                    <div
                        className={styles.typeSelectorButton}
                        data-active={props.type === 'url'}
                        onClick={props.onSwitchToURL}
                        tabIndex={0}
                    >
                        <FormattedMessage defaultMessage="URL" id="tw.customExtensionModal.url" />
                    </div>
                    <div
                        className={styles.typeSelectorButton}
                        data-active={props.type === 'file'}
                        onClick={props.onSwitchToFile}
                        tabIndex={0}
                    >
                        <FormattedMessage defaultMessage="Files" id="tw.customExtensionModal.file" />
                    </div>
                    <div
                        className={styles.typeSelectorButton}
                        data-active={props.type === 'text'}
                        onClick={props.onSwitchToText}
                        tabIndex={0}
                    >
                        <FormattedMessage defaultMessage="Text" id="tw.customExtensionModal.text" />
                    </div>
                </div>

                {props.type === 'url' ? (
                    <React.Fragment key={props.type}>
                        <p>
                            <FormattedMessage
                                defaultMessage="Enter the extension's URL:"
                                id="tw.customExtensionModal.promptURL"
                            />
                        </p>
                        <input
                            type="text"
                            className={styles.urlInput}
                            value={props.url}
                            onChange={props.onChangeURL}
                            onKeyDown={props.onKeyDown}
                            placeholder="https://raw.codeberg.page/ampmod/extensions/@pages/..."
                            autoFocus
                        />
                    </React.Fragment>
                ) : props.type === 'file' ? (
                    <React.Fragment key={props.type}>
                        <p>
                            <FormattedMessage
                                defaultMessage="Select or drop extension JavaScript files:"
                                id="tw.customExtensionModal.promptFile"
                            />
                        </p>
                        <FileInput accept=".js" onChange={props.onChangeFiles} files={props.files} />
                    </React.Fragment>
                ) : (
                    <React.Fragment key={props.type}>
                        <p>
                            <FormattedMessage
                                defaultMessage="Paste the extension's JavaScript source code:"
                                id="tw.customExtensionModal.promptText"
                            />
                        </p>
                        <textarea
                            className={styles.textCodeInput}
                            placeholder={
                                'class Extension {\n  // ...\n}\nScratch.extensions.register(new Extension());'
                            }
                            value={props.text}
                            onChange={props.onChangeText}
                            autoFocus
                            spellCheck={false}
                        />
                    </React.Fragment>
                )}

                {props.type === 'url' && isTrustedExtension(props.url) ? (
                    <p className={styles.trustedExtension}>
                        <FormattedMessage
                            defaultMessage="This extension will be loaded without the sandbox because it is from a trusted source."
                            id="tw.customExtensionModal.trusted"
                        />
                    </p>
                ) : (
                    <React.Fragment>
                        {props.onChangeUnsandboxed ? (
                            <React.Fragment>
                                <label className={styles.unsandboxedContainer}>
                                    <FancyCheckbox
                                        className={styles.unsandboxedCheckbox}
                                        checked={props.unsandboxed}
                                        onChange={props.onChangeUnsandboxed}
                                    />
                                    <FormattedMessage
                                        defaultMessage="Run without sandbox"
                                        id="tw.customExtensionModal.unsandboxed"
                                    />
                                </label>
                                {props.unsandboxed && (!props.type === 'url' || !isTrustedExtension(props.url)) && (
                                    <p className={styles.unsandboxedWarning}>
                                        <FormattedMessage
                                            defaultMessage="Loading extensions without the sandbox is dangerous and should not be enabled if you don't know what you're doing."
                                            id="tw.customExtensionModal.unsandboxedWarning1"
                                        />
                                        <FormattedMessage
                                            defaultMessage="Unsandboxed extensions can corrupt your project, delete your settings, phish for passwords, and other bad things. The {APP_NAME} developers are not responsible for any resulting issues."
                                            id="tw.customExtensionModal.unsandboxedWarning2"
                                            values={{APP_NAME}}
                                        />
                                    </p>
                                )}
                            </React.Fragment>
                        ) : (
                            <p>
                                <FormattedMessage
                                    defaultMessage="Extensions from untrusted URLs will always be loaded with the sandbox for security."
                                    id="tw.customExtensionModal.untrusted"
                                />
                            </p>
                        )}
                    </React.Fragment>
                )}

                <div>
                    <label className={styles.unsandboxedCheckbox}>
                        <FancyCheckbox checked={shouldSave} onChange={e => setShouldSave(e.target.checked)} />
                        Save extension to library
                    </label>

                    {shouldSave && (
                        <>
                            <p>
                                This extension will only be saved to your computer and will not be available for other
                                users. If you would like to allow others to use this extension, please see{' '}
                                <a href="https://codeberg.org/ampmod/extensions/" target="_blank">
                                    the extension gallery repository
                                </a>
                                .
                            </p>
                            <div className={styles.saveInputs}>
                                <input
                                    type="text"
                                    placeholder="Extension name"
                                    className={styles.urlInput}
                                    value={saveName}
                                    onChange={e => setSaveName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Extension description"
                                    className={styles.urlInput}
                                    value={saveDescription}
                                    onChange={e => setSaveDescription(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.buttonRow}>
                    <button className={styles.loadButton} onClick={handleLoadClick} disabled={!props.canLoadExtension}>
                        <FormattedMessage defaultMessage="Load" id="tw.customExtensionModal.load" />
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

CustomExtensionModal.propTypes = {
    intl: intlShape,
    canLoadExtension: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['url', 'file', 'text']).isRequired,
    onSwitchToFile: PropTypes.func.isRequired,
    onSwitchToURL: PropTypes.func.isRequired,
    onSwitchToText: PropTypes.func.isRequired,
    files: PropTypes.instanceOf(FileList),
    onChangeFiles: PropTypes.func.isRequired,
    onDragOver: PropTypes.func.isRequired,
    onDragLeave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    onChangeURL: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    unsandboxed: PropTypes.bool.isRequired,
    onChangeUnsandboxed: PropTypes.func,
    onLoadExtension: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default injectIntl(CustomExtensionModal);
