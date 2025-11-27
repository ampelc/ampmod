import '../import-first';
import React from 'react';
import PropTypes from 'prop-types';
import render from '../../playground/app-target.js';
import styles from '../design.css';
import myStyles from './credits.css';

import {APP_NAME, APP_FORUMS} from '@ampmod/branding';
import {applyGuiColors} from '../../lib/themes/guiHelpers';
import {detectTheme} from '../../lib/themes/themePersistance';
import UserData from './users';

import Header from '../components/header/header';
import Footer from '../components/footer/footer';

import Localise, {setHtmlLang} from '../components/localise/localise';
import appleCat from './apple-cat-pleased.svg';

applyGuiColors(detectTheme());
setHtmlLang(); // Use helper instead of hardcoding <html lang>

const totalContributors =
    (UserData.contributors?.length || 0) +
    (UserData.addonDevelopers?.length || 0) +
    (UserData.extensionDevelopers?.length || 0) +
    (UserData.tw?.length || 0);

const User = ({image, text, href, role}) => (
    <a href={href} target="_blank" rel="noreferrer" className={myStyles.user}>
        <img loading="lazy" className={myStyles.userImage} src={image} width="60" height="60" />
        <div className={myStyles.userInfo}>{text}</div>
        {role && <div className={myStyles.userRole}>{role}</div>}
    </a>
);
User.propTypes = {
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    href: PropTypes.string
};

const UserList = ({users}) => (
    <div className={myStyles.users}>
        {users.map((data, index) => (
            <User key={index} {...data} />
        ))}
    </div>
);
UserList.propTypes = {
    users: PropTypes.arrayOf(PropTypes.object)
};

export default function Credits() {
    return <>
        <Header />
        <header className={styles.headerContainer}>
            <h1 className={styles.headerText}>
                <Localise id="credits.title" values={{APP_NAME}} />
            </h1>
            <p className={styles.wrap}>
                <Localise id="credits.totalContributors" values={{totalContributors, APP_NAME}} />
            </p>
            <div className={styles.spacing}></div>
        </header>
        <main className={styles.main}>
            <section>
                <p>
                    <i>
                        <Localise id="credits.disclaimer.general" />
                    </i>
                </p>
            </section>
            <section>
                <h2>
                    <Localise id="credits.contributors" />
                </h2>
                <UserList users={UserData.contributors} />
            </section>
            <section>
                <h2>
                    <Localise id="credits.addons" />
                </h2>
                <UserList users={UserData.addonDevelopers} />
            </section>
            <section>
                <h2>
                    <Localise id="credits.extensions" />
                </h2>
                <UserList users={UserData.extensionDevelopers} />
            </section>
            <section>
                <h2>
                    <Localise id="credits.exampleProjects" />
                </h2>
                <p>
                    <Localise id="credits.exampleProjectsDescription" />
                </p>
            </section>
            {APP_NAME !== 'AmpMod' && (
                <section>
                    <h2>
                        <Localise id="credits.ampmodSection" />
                    </h2>
                    <p>
                        <Localise id="credits.ampmodDescription" values={{APP_NAME}} />
                    </p>
                </section>
            )}
            <section>
                <h2>
                    <Localise id="credits.turbowarpSection" />
                </h2>
                <p>
                    <Localise id="credits.turbowarpDescription" values={{APP_NAME}} />
                </p>
                <UserList users={UserData.tw} />
            </section>
            <section>
                <h2>
                    <Localise id="credits.scratchSection" />
                </h2>
                <p>
                    <Localise id="credits.scratchDescription" values={{APP_NAME}} />
                </p>
                <p>
                    <a href="https://scratch.mit.edu/donate">
                        <Localise id="credits.scratchDonate" />
                    </a>
                </p>
            </section>
            <section>
                <h2>
                    <Localise id="credits.otherMods" />
                </h2>
                <p>
                    <Localise id="credits.otherModsDescription" values={{APP_NAME}} />
                </p>
                <details>
                    <summary>
                        <Localise id="credits.otherModsSummary" values={{APP_NAME}} />
                    </summary>
                    <ul>
                        <li>
                            <a href="https://librekitten.org">LibreKitten</a>
                        </li>
                    </ul>
                </details>
            </section>
            <section>
                <h2>
                    <Localise id="credits.favicon" />
                </h2>
                <p>
                    <Localise
                        id="credits.faviconDescription"
                        values={{
                            APP_NAME,
                            forumoji: <a href="https://gh.vercte.net/forumoji">Forumoji</a>
                        }}
                    />
                </p>
            </section>
            <section>
                <h2>
                    <Localise id="credits.translators" />
                </h2>
                <p>
                    <Localise id="credits.translatorsDescription" values={{APP_NAME}} />
                </p>
            </section>
            <section>
                <h2>
                    <Localise id="credits.art" />
                </h2>
                <p>
                    <Localise id="credits.artDescription" />
                </p>
            </section>
            <Footer />
        </main>
    </>
};

if (!process.env.SPA) { render(<Credits />); }
