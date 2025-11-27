import '../import-first.js';
import React from 'react';
import render from '../../playground/app-target.js';

// This page diverges significantly from other pages and thus uses its own independent styles altogether.
// design.css is only used for the hero in a separate component.
import styles from './home.css';

import {APP_FORUMS, APP_NAME, APP_WIKI, APP_SLOGAN} from '@ampmod/branding';
import {applyGuiColors} from '../../lib/themes/guiHelpers.js';
import {detectTheme} from '../../lib/themes/themePersistance.js';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import Clippy from '../../containers/amp-clippy';
import Hero from '../components/hero/hero';

import Localise, {setHtmlLang} from '../components/localise/localise';

applyGuiColors(detectTheme());
setHtmlLang();
document.title = `${APP_NAME} - ${APP_SLOGAN}`;

export default function Home() {
    return (
        <>
            <Header />
            <Clippy isFixed messageSet="website" />
            <Hero />
            <main className={styles.main}>
                <div className={styles.mainContentGrid}>
                    <div className={styles.leftColumn}>
                        <section>
                            <h2>
                                <Localise id="whatIsAppName" values={{ APP_NAME }} />
                            </h2>
                            <p>
                                <Localise id="appDescription" values={{ APP_NAME }} />
                            </p>
                        </section>

                        <section>
                            <h2>
                                <Localise id="buildEasily" />
                            </h2>
                            <p>
                                <Localise id="buildEasilyText" values={{ APP_NAME }} />
                            </p>
                        </section>

                        <section>
                            <h2>
                                <Localise id="needHelp" />
                            </h2>
                            <div className={styles.buttonRow}>
                                <a href={APP_WIKI} className={styles.button}>
                                    <Localise id="visitWiki" />
                                </a>
                            </div>
                        </section>
                    </div>

                    <div className={styles.rightColumn}>
                        <section>
                            <h2>
                                <Localise id="features" />
                            </h2>
                            <div className={styles.twoColumnGrid}>
                                <div className={styles.columnItem}>
                                    <h3>
                                        <Localise id="forProgrammers" />
                                    </h3>
                                    <ul>
                                        <li><Localise id="jsCompile" values={{ APP_NAME }} /></li>
                                        <li><Localise id="arraysFeature" /></li>
                                        <li><Localise id="extensionsFeature" values={{ APP_NAME }} /></li>
                                    </ul>
                                </div>

                                <div className={styles.columnItem}>
                                    <h3>
                                        <Localise id="forArtists" />
                                    </h3>
                                    <ul>
                                        <li><Localise id="newFonts" values={{ APP_NAME }} /></li>
                                        <li><Localise id="roundedRectangle" /></li>
                                        <li><Localise id="customFonts" /></li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <Footer />
            </main>
        </>
    );
}

if (!process.env.SPA) {
    render(<Home />);
}
