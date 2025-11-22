// This is plain JS for the sake of saving a lot of megabytes from the React bundle,
// since we inline our js into the 404 page.
import {APP_FORUMS, APP_NAME} from '@ampmod/branding';
import {applyGuiColors} from '../lib/themes/guiHelpers';
import {detectTheme} from '../lib/themes/themePersistance';
import styles from './design.css';

applyGuiColors(detectTheme());
document.documentElement.lang = 'en';

const root = document.getElementById('app') || document.body;

root.innerHTML = `
    <header class="${styles.headerContainer} ${styles.headerContainerAltColour}">
        <h1>404 Not Found</h1>
        <p>Sorry, this page doesn't appear to exist.</p>
    </header>
    <main class="${styles.main}">
        <section>
            <p>
                Are you looking for the <a href="editor">${APP_NAME} editor</a> or 
                <a href="player">player</a>?
            </p>
        </section>
    </main>
`;
