import classNames from 'classnames';
import React from 'react';
import Logo from '../../../components/menu-bar/tw-advanced.svg';
import FakeLogo from './lampmod.svg';
import CanaryLogo from '../../../components/menu-bar/ampmod-canary.svg';
import styles from './header.css';
import TWNews from '../../../components/menu-bar/tw-news';
import Localise from '../localise/localise';
import SmartLink from "../smart-link/smart-link";

// Determine if today is April Fools’ Day
function isAprilFools() {
    const now = new Date();
    return now.getMonth() === 3 && now.getDate() === 1;
}

const Header = () => {
    const showFakeLogo = isAprilFools();
    const logoSrc =
        process.env.ampmod_mode === 'canary'
            ? CanaryLogo
            : showFakeLogo
            ? FakeLogo
            : Logo;

    const logoAlt =
        showFakeLogo && process.env.ampmod_mode !== 'canary'
            ? 'LampMod Logo'
            : 'AmpMod Logo';

    return (
        <>
            <div className={styles.header}>
                <div className={styles.mainGroup}>
                    <SmartLink
                        to="/"
                        className={classNames(styles.headerItem, styles.ampmodLogo)}
                        aria-label={logoAlt}
                        onMouseEnter={() => process.env.SPA && import(/* webpackChunkName: "home" */ '../../home/home')}
                    >
                        <img height={26} src={logoSrc} alt={logoAlt} />
                    </SmartLink>

                    <SmartLink
                        to="/editor"
                        className={classNames(styles.headerItem, styles.hoverable)}
                    >
                        <Localise id="header.create" />
                    </SmartLink>

                    <SmartLink
                        to="/examples"
                        className={classNames(styles.headerItem, styles.hoverable)}
                        onMouseEnter={() => process.env.SPA && import(/* webpackChunkName: "examples-landing" */ '../../examples/examples')}
                    >
                        <Localise id="examples.title" />
                    </SmartLink>

                    <SmartLink
                        to="https://ampmod.codeberg.page/manual"
                        className={classNames(styles.headerItem, styles.hoverable)}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Localise id="header.manual" />
                    </SmartLink>

                    <SmartLink
                        to="https://ampmod.codeberg.page/extensions"
                        className={classNames(styles.headerItem, styles.hoverable)}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Localise id="header.extensions" />
                    </SmartLink>
                </div>
            </div>

            <div className={styles.spacer}></div>
            <TWNews />
        </>
    );
};

export default Header;
