/*!
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import {
    APP_BLOG,
    APP_FORUMS,
    APP_NAME,
    APP_SOURCE,
    APP_WIKI,
} from "@ampmod/branding";
import LangSelect from "./lang-select.jsx";
import styles from "./footer.css";
import Localise from "../localise/localise.jsx";
import isAprilFools from '../../../lib/amp-enable-pranks';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerText}>
                    <Localise
                        id="amp.footer.copyright"
                        values={{
                            APP_NAME,
                            year: new Date().getFullYear(),
                            freeSoftware: (
                                <a href="LICENSE.txt">
                                    <Localise id="amp.footer.copyright.freeSoftware" />
                                </a>
                            )
                        }}
                    />
                </div>
                <div className={styles.footerText}>
                    <Localise
                        id="amp.footer.disclaimer"
                        values={{
                            APP_NAME,
                            scratchLink: (
                                <a href="https://scratch.mit.edu" target="_blank" rel="noreferrer">
                                    Scratch
                                </a>
                            ),
                            twLink: (
                                <a href="https://turbowarp.org" target="_blank" rel="noreferrer">
                                    TurboWarp
                                </a>
                            ),
                            supportScratch: (
                                <a href="https://scratchfoundation.org/donate">
                                    <Localise id="amp.footer.disclaimer.supportScratch" />
                                </a>
                            )
                        }}
                    />
                </div>
                <div className={styles.footerColumns}>
                    <div className={styles.footerSection}>
                        <h3>
                            <Localise id="footer.heading.about" />
                        </h3>
                        <a href="./faq.html">
                            <Localise id="tw.footer.faq" />
                        </a>
                        {APP_BLOG && (
                            <a href={APP_BLOG}>
                                <Localise id="tw.footer.blog" />
                            </a>
                        )}
                    </div>
                    <div className={styles.footerSection}>
                        <h3>
                            <Localise id="footer.heading.community" />
                        </h3>
                        {APP_FORUMS && (
                            <>
                                <a href={APP_FORUMS}>
                                    <Localise id="tw.topicButton" values={{APP_NAME}} />
                                </a>
                            </>
                        )}
                        {APP_WIKI && (
                            <a href={APP_WIKI}>
                                <Localise id="tw.footer.wiki" />
                            </a>
                        )}
                        <a href="credits.html">
                            <Localise id="tw.footer.credits" />
                        </a>
                    </div>
                    <div className={styles.footerSection}>
                        <h3>
                            <Localise id="footer.heading.resources" />
                        </h3>
                        <a href="https://ampmod.codeberg.page/manual/">
                            <Localise id="tw.footer.manual" />
                        </a>
                        <a href="https://ampmod.codeberg.page/extensions/">
                            <Localise id="tw.footer.extensions" />
                        </a>
                        <a href={APP_SOURCE}>
                            <Localise id="tw.code" />
                        </a>
                        {process.env.ampmod_mode === 'canary' ? (
                            <a href="https://ampmod.codeberg.page/">
                                <Localise id="amp.production" />
                            </a>
                        ) : (
                            <a href="https://ampmod.codeberg.page/canary/">
                                <Localise id="amp.canary" />
                            </a>
                        )}
                        {/* <a href="https://docs.turbowarp.org/url-parameters">
                            <Localise id="tw.footer.parameters" />
                        </a> */}
                    </div>
                    <div className={styles.footerSection}>
                        <h3>
                            <Localise id="footer.heading.legal" />
                        </h3>
                        <a href="privacy.html">
                            <Localise id="tw.privacy" />
                        </a>
                    </div>
                </div>
                <div className={styles.footerText}>
                    <LangSelect />
                </div>
                <div className={styles.footerText}>
                    <small>{process.env.ampmod_version}</small>
                </div>
            </div>
            {isAprilFools && <div className={styles.semicolon}>;</div>}
        </footer>
    );
};

export default Footer;
