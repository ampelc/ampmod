import classNames from 'classnames';
import React from 'react';
import { NavigationMenu } from "radix-ui";
import Logo from '../../../components/menu-bar/tw-advanced.svg';
import FakeLogo from './lampmod.svg';
import CanaryLogo from '../../../components/menu-bar/ampmod-canary.svg';
import styles from './header.css';
import TWNews from '../../../components/menu-bar/tw-news';
import Localise from '../localise/localise';
import SmartLink from "../smart-link/smart-link";
import isAprilFools from '../../../lib/amp-enable-pranks';

const Header = () => {
    const logoSrc =
        process.env.ampmod_mode === 'canary'
            ? CanaryLogo
            : isAprilFools
            ? FakeLogo
            : Logo;

    const logoAlt =
        isAprilFools && process.env.ampmod_mode !== 'canary'
            ? 'LampMod Logo'
            : 'AmpMod Logo';

    const linkClassesThatShouldBeMergedOneDay = classNames(styles.headerItem, styles.hoverable);

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

                    <NavigationMenu.Root className={styles.mainNav}>
                        <NavigationMenu.List className={styles.navList}>
                            
                            <NavigationMenu.Item className={styles.navItem}>
                                <SmartLink
                                    to="/editor"
                                    className={linkClassesThatShouldBeMergedOneDay}
                                >
                                    <Localise id="header.create" />
                                </SmartLink>
                            </NavigationMenu.Item>

                            <NavigationMenu.Item className={styles.navItem}>
                                <SmartLink
                                    to="/examples"
                                    className={linkClassesThatShouldBeMergedOneDay}
                                    onMouseEnter={() => process.env.SPA && import(/* webpackChunkName: "examples-landing" */ '../../examples/examples')}
                                >
                                    <Localise id="examples.title" />
                                </SmartLink>
                            </NavigationMenu.Item>

                            <NavigationMenu.Item className={styles.navItem}>
                                <SmartLink
                                    to="https://ampmod.codeberg.page/manual"
                                    className={linkClassesThatShouldBeMergedOneDay}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Localise id="header.manual" />
                                </SmartLink>
                            </NavigationMenu.Item>

                            <NavigationMenu.Item className={styles.navItem}>
                                <SmartLink
                                    to="https://ampmod.codeberg.page/extensions"
                                    className={linkClassesThatShouldBeMergedOneDay}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Localise id="header.extensions" />
                                </SmartLink>
                            </NavigationMenu.Item>

                        </NavigationMenu.List>
                    </NavigationMenu.Root>
                    
                </div>
            </div>

            <div className={styles.spacer}></div>
            <TWNews />
        </>
    );
};

export default Header;