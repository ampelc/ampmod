import ReactDOM from 'react-dom';
import {setAppElement} from 'react-modal';
import * as bowser from 'bowser';
import {APP_NAME, APP_SOURCE} from '@ampmod/branding';
import lsNamespace from "../lib/amp-localstorage-namespace";
import { runAllMigrations } from './amp-migrate-storage';

const appTarget = document.getElementById('app');
export let migrationOccurred = false;
if (new URLSearchParams(window.location.search).has('crash-accidentally')) {
    throw new TypeError(
        'Simulated a TypeError to test the pre-React error screen. ' +
            `If someone sent you a link to this, just open ${APP_NAME} in ` +
            'a new tab and carry on with your day. This is not a bug.'
    );
}

setAppElement(appTarget);

const render = children => {
    if (lsNamespace === "amp:") {
        runAllMigrations();
    }
    if (!migrationOccurred) {
        // TODO: customisation
        if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches)
            document.documentElement.classList.add('amp-gui-animations-enabled');
        ReactDOM.render(children, appTarget);
        if (window.SplashEnd) {
            window.SplashEnd();
        }
    }
};

export const renderToBottom = children => {
    if (!migrationOccurred) {
        ReactDOM.render(children, document.getElementById('app-footer'));
    }
};

export default render;
