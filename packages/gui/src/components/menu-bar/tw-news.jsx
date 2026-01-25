import React from 'react';
import {APP_NAME} from '@ampmod/branding';
import {isScratchDesktop} from '../../lib/isScratchDesktop';
import CloseButton from '../close-button/close-button.jsx';
import styles from './tw-news.css';
import icon from './tw-advanced.svg';
import SmartLink from '../../website/components/smart-link/smart-link';

const LOCAL_STORAGE_KEY = `${process.env.ampmod_mode === 'canary' ? 'canary' : 'amp'}:closedNews`;
const NEWS_ID = '0.4';

const getIsClosedInLocalStorage = () => {
    try {
        return localStorage.getItem(LOCAL_STORAGE_KEY) === NEWS_ID;
    } catch (e) {
        return false;
    }
};

const markAsClosedInLocalStorage = () => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, NEWS_ID);
    } catch (e) {
        // ignore
    }
};

class TWNews extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closed: getIsClosedInLocalStorage()
        };
        this.handleClose = this.handleClose.bind(this);
    }
    handleClose() {
        markAsClosedInLocalStorage();
        this.setState(
            {
                closed: true
            },
            () => {
                window.dispatchEvent(new Event('resize'));
            }
        );
    }
    render() {
        const today = new Date();
        if (this.state.closed || isScratchDesktop() || process.env.ampmod_mode === 'lab') {
            return null;
        }
        return (
            <div className={styles.news}>
                <div className={styles.textContainer}>
                    <img src={icon} draggable={false} height={28} />
                    <div className={styles.text}>
                        {APP_NAME} 0.4 has been released! For more information, view the patch notes in the editor.
                    </div>
                    <SmartLink to="/editor" className={styles.button} target="_blank" rel="noopener">
                        Try it now
                    </SmartLink>
                </div>
                <CloseButton className={styles.close} onClick={this.handleClose} />
            </div>
        );
    }
}

export default TWNews;
