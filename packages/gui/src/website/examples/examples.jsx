import '../import-first.js';
import React from 'react';
import render from '../../playground/app-target.js';
import styles from '../design.css';
import myStyles from './examples.css';

import {APP_NAME} from '@ampmod/branding';
import {applyGuiColors} from '../../lib/themes/guiHelpers.js';
import {detectTheme} from '../../lib/themes/themePersistance.js';

import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import Example from './example';
import projects from '../../lib/examples';
import Localise, {localise, setHtmlLang} from '../components/localise/localise';
import { driver } from 'driver.js';
import '!!style-loader!css-loader!driver.js/dist/driver.css';

applyGuiColors(detectTheme());
setHtmlLang();
document.title = `${localise('examples.title')} - ${APP_NAME}`;

export default function ExamplesPage() {
    const firstExampleRef = React.useRef(null);
    let exdriver = {};

    React.useEffect(() => {
        if (firstExampleRef.current) {
            exdriver = driver({
                showButtons: [""],
                popoverClass: myStyles.popover,
                overlayColor: "var(--driver-overlay-colour)",
                steps: [
                    {
                        element: firstExampleRef.current,
                        popover: {
                            description: localise('examples.apz.101.description'),
                            side: 'bottom',
                            align: 'center'
                        }
                    }
                ],
            });

            exdriver.drive();
        }
    }, []);

    return (
        <>
            <Header />
            <header className={styles.headerContainer}>
                <h1 className={styles.headerText}>
                    <Localise id="examples.title" />
                </h1>
                <p className={styles.headerText}>
                    <Localise id="examples.introduction" values={{APP_NAME}} />
                </p>
            </header>
            <main className={styles.main}>
                <section>
                    <div className={myStyles.examplesRow}>
                        {Object.values(projects).map((proj, index) => (
                            <Example
                                key={proj.id}
                                id={proj.id}
                                by={proj.by}
                                img={proj.img}
                                isSupported={proj.isSupported ?? true}
                                ref={index === 0 ? firstExampleRef : null}
                                onClick={() => exdriver?.destroy()}
                            />
                        ))}
                    </div>
                </section>
                <section>
                    <p>
                        <small>
                            <Localise
                                id="examples.licenceText"
                                values={{
                                    ccLink: (
                                        <a href="https://creativecommons.org/licenses/by/4.0/deed.en">
                                            <Localise id="examples.licence.cc" />
                                        </a>
                                    ),
                                    imageAttribution: (
                                        <a href="https://codeberg.org/ampmod/ampmod/src/branch/develop/packages/gui/src/website/examples/images/README.md">
                                            <Localise id="examples.licence.images" />
                                        </a>
                                    )
                                }}
                            />
                        </small>
                    </p>
                </section>
            </main>
            <Footer />
        </>
    );
};

if (!process.env.SPA) { render(<ExamplesPage />); }
