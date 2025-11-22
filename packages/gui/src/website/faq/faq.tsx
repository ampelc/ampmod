import render from '../../playground/app-target.js';
import styles from '../design.css';
import myStyles from './faq.css';

import {APP_NAME} from '@ampmod/branding';
import {applyGuiColors} from '../../lib/themes/guiHelpers.js';
import {detectTheme} from '../../lib/themes/themePersistance.js';

import Header from '../components/header/header';
import Footer from '../components/footer/footer';

import React from "react";
import Localise, {setHtmlLang} from '../components/localise/localise.jsx';

applyGuiColors(detectTheme());
setHtmlLang();

const Credits = () => (
    <>
        <Header />
        <header className={styles.headerContainer}>
            <h1 className={styles.headerText}>
                <Localise id="faq.title" values={{APP_NAME}} />
            </h1>
            <div className={styles.spacing}></div>
        </header>
        <main className={styles.main}>
            <div className={myStyles.styledHeadings}>

                {/* Introduction */}
                <section>
                    <h2>
                        <Localise id="faq.why.q" values={{APP_NAME}} />
                    </h2>
                    <p><Localise id="faq.why.a1" values={{APP_NAME}} /></p>
                    <p><Localise id="faq.why.a2" values={{APP_NAME}} /></p>
                </section>

                <section>
                    <h2>
                        <Localise id="faq.opensource.q" values={{APP_NAME}} />
                    </h2>
                    <p>
                        <Localise id="faq.opensource.a" values={{
                            APP_NAME,
                            onCodeberg: (
                                <a href="https://codeberg.org/ampmod"><Localise id="onCodeberg" /></a>
                            )
                        }} />
                    </p>
                </section>

                {/* Philosophy */}
                <section>
                    <h2>
                        <Localise id="faq.philosophy.q" values={{APP_NAME}} />
                    </h2>
                    <p><Localise id="faq.philosophy.intro" values={{APP_NAME}} /></p>
                    <ul>
                        <li><p><Localise id="faq.philosophy.learn" /></p></li>
                        <li><p><Localise id="faq.philosophy.understand" /></p></li>
                        <li><p><Localise id="faq.philosophy.appropriate" /></p></li>
                    </ul>
                </section>

                {/* Using it */}
                <section>
                    <h2>
                        <Localise id="faq.browsers.q" values={{APP_NAME}} />
                    </h2>
                    <p><Localise id="faq.browsers.a" values={{APP_NAME}} /></p>
                </section>

                <section>
                    <h2>
                        <Localise id="faq.updates.q" values={{APP_NAME}} />
                    </h2>
                    <p><Localise id="faq.updates.a" values={{APP_NAME}} /></p>
                </section>

                <section>
                    <h2>
                        <Localise id="faq.extensions.q" />
                    </h2>
                    <p><Localise id="faq.extensions.a" values={{APP_NAME}} /></p>
                </section>

                <section>
                    <h2>
                        <Localise id="faq.performance.q" values={{APP_NAME}} />
                    </h2>
                    <p><Localise id="faq.performance.a" values={{APP_NAME}} /></p>
                </section>
            </div>

            <Footer />
        </main>
    </>
);

render(<Credits />);
