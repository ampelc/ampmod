import React, { useEffect, useState } from "react";
import styles from "../../design.css";
import myStyles from "./hero.css";
import WelcomeBanner from "./image.png";
import * as Bowser from "bowser";
import Localise from "../localise/localise.jsx";
import classNames from "classnames";
import SmartLink from "../smart-link/smart-link";

export default () => {
    const [isPhone, setIsPhone] = useState(false);

    useEffect(() => {
        const parsed = Bowser.parse(window.navigator.userAgent);
        const platformType = parsed.platform.type;
        setIsPhone(platformType === 'mobile');
    }, []);

    return (
        <>
            <header className={classNames([styles.headerContainer, myStyles.headerContainer])}>
                <div className={myStyles.headerContainerContainer}>
                    <div className={myStyles.headerContent}>
                        <h1 className={styles.headerText}>
                            <Localise id="appSlogan" />
                        </h1>

                        {process.env.ampmod_mode === 'canary' && (
                            <>
                                <strong>
                                    <Localise id="hero.canaryWarning" />
                                </strong>
                            </>
                        )}

                        <div className={styles.spacing}></div>
                        <div className={myStyles.buttonRow}>
                            {!isPhone && (
                                <SmartLink to="/editor" className={myStyles.primaryButton}>
                                    <Localise id="hero.create" />
                                </SmartLink>
                            )}
                            <SmartLink to="/examples" className={myStyles.primaryButton} onMouseEnter={() => process.env.SPA && import(/* webpackChunkName: "examples-landing" */ '../../examples/examples')}>
                                <Localise id="hero.examples" />
                            </SmartLink>
                        </div>
                    </div>

                    <div className={myStyles.headerImage}>
                        <div className={myStyles.ledOverlay} />
                        <img src={WelcomeBanner} height={500} alt="An image of the AmpMod programming interface, with a project featuring a dango in the center, a navigation bar at the top for selecting different demos with Mode 2 currently selected, and a block falling from the dango." />
                    </div>
                    <div className={myStyles.laptopKeyboard}></div>
                </div>
            </header>
            <div className={myStyles.headerBottomBump} />
        </>
    );
};
