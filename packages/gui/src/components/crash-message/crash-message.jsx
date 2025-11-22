import PropTypes from 'prop-types';
import React, {useState} from 'react';
import Box from '../box/box.jsx';
import {FormattedMessage} from 'react-intl';

import styles from './crash-message.css';
import reloadIcon from './reload.svg';

import {APP_FORUMS_BUGS, APP_CONTACT} from '@ampmod/branding';

const CrashMessage = props => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        let text = '';
        if (props.errorMessage) text += props.errorMessage + '\n';
        if (props.eventId) text += `Error ID: ${props.eventId}\n`;
        navigator.clipboard.writeText(text.trim()).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className={styles.crashWrapper}>
            <Box className={styles.body}>
                <p className={styles.header}>
                    <img className={styles.reloadIcon} src={reloadIcon} draggable={false} />
                    <FormattedMessage
                        defaultMessage="Oops! Something went wrong."
                        description="Crash Message title"
                        id="gui.crashMessage.label"
                    />
                </p>
                <p>
                    <FormattedMessage
                        defaultMessage={
                            'This page has crashed.' +
                            ' Please refresh your page to try' +
                            ' again. If this continues, please report the error to' +
                            ' the {issueTracker}.'
                        }
                        description="Message to inform the user that page has crashed."
                        id="tw.gui.crashMessage.description"
                        values={{
                            issueTracker: (
                                <a href={APP_CONTACT} rel="noreferrer noopener" target="_blank">
                                    <FormattedMessage
                                        defaultMessage="issue tracker"
                                        description="Link text to the AmpMod issue tracker"
                                        id="gui.crashMessage.issueTrackerLinkText"
                                    />
                                </a>
                            )
                        }}
                    />
                </p>
                {props.errorMessage && <p className={styles.errorMessage}>{props.errorMessage}</p>}
                {props.eventId && (
                    <p>
                        <FormattedMessage
                            defaultMessage="Your error was logged with id {errorId}"
                            description="Message to inform the user that page has crashed."
                            id="gui.crashMessage.errorNumber"
                            values={{
                                errorId: props.eventId
                            }}
                        />
                    </p>
                )}
                <button className={styles.reloadButton} onClick={props.onReload}>
                    <FormattedMessage
                        defaultMessage="Reload"
                        description="Button to reload the page when page crashes"
                        id="gui.crashMessage.reload"
                    />
                </button>
                <p>
                    <FormattedMessage
                        defaultMessage="Please provide the above backtrace. Click {copyLink} to copy it."
                        description="Message to remind the user to provide the backtrace, with a link to copy it"
                        id="tw.gui.crashMessage.copyBacktrace"
                        values={{
                            copyLink: (
                                <button
                                    type="button"
                                    className={styles.copyButton}
                                    onClick={handleCopy}
                                    style={{marginLeft: '8px'}}
                                >
                                    {copied ? (
                                        <FormattedMessage
                                            defaultMessage="Copied!"
                                            description="Button to copy the backtrace (after copying)"
                                            id="gui.crashMessage.copyButton.copied"
                                        />
                                    ) : (
                                        <FormattedMessage
                                            defaultMessage="here"
                                            description="Button to copy the backtrace"
                                            id="gui.crashMessage.copyButton"
                                        />
                                    )}
                                </button>
                            )
                        }}
                    />
                </p>
                <p>
                    <FormattedMessage
                        defaultMessage="Try {clearCache} or {eraseData}, which may fix some issues."
                        description="Message to inform the user that clearing cache or erasing data may fix some issues."
                        id="tw.gui.crashMessage.clearCacheOrEraseData"
                        values={{
                            clearCache: (
                                <a
                                    href="#"
                                    onClick={() => {
                                        var search = location.search.replace(/[?&]nocache=\d+/, '');
                                        location.replace(
                                            location.pathname +
                                                search +
                                                (search ? '&' : '?') +
                                                'nocache=' +
                                                Math.floor(Math.random() * 100000)
                                        );
                                    }}
                                >
                                    <FormattedMessage
                                        defaultMessage="bypassing the cache"
                                        description="Link text to bypass cache"
                                        id="gui.crashMessage.bypassCacheLinkText"
                                    />
                                </a>
                            ),
                            eraseData: (
                                <a
                                    href="#"
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                'Your backpack and restore points will be deleted. Continue?'
                                            )
                                        ) {
                                            window.indexedDB.deleteDatabase('Amp_RestorePoints');
                                            window.indexedDB.deleteDatabase('Amp_Backpack');
                                            window.localStorage.removeItem('amp:theme');
                                            window.localStorage.removeItem('amp:username');
                                            window.localStorage.removeItem('amp:language');
                                            window.location.reload();
                                        }
                                    }}
                                >
                                    <FormattedMessage
                                        defaultMessage="erasing the data"
                                        description="Link text to delete AmpMod's site data"
                                        id="gui.crashMessage.eraseDataLinkText"
                                    />
                                </a>
                            )
                        }}
                    />
                </p>
            </Box>
        </div>
    );
};

CrashMessage.propTypes = {
    eventId: PropTypes.string,
    errorMessage: PropTypes.string,
    onReload: PropTypes.func.isRequired
};

export default CrashMessage;
