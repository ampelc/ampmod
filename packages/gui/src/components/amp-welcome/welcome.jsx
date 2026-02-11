import React, { useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, injectIntl, intlShape } from "react-intl";
import ReactModal from "react-modal";
import Box from "../box/box.jsx";
import styles from "./welcome.css";
import { APP_NAME } from "@ampmod/branding";
import CloseButton from "../close-button/close-button.jsx";
import ThemeSelector from "./theme-selector.jsx";
import AccentSelector from "./accent-selector.jsx";

const Welcome = ({intl, isRtl, onContinue}) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [theme, setTheme] = useState(window.scratchGui?.theme?.theme || null);
    const [themeChanged, setThemeChanged] = useState(false);

    const handleNext = () => {
        if (stepIndex === 2) {
            onContinue();
        } else {
            setStepIndex(stepIndex + 1);
        }
    };

    return (
        <div className={styles.containerForEverything}>
            <ReactModal
                isOpen
                className={styles.welcomeContent}
                overlayClassName={styles.welcomeOverlay}
                ariaHideApp={false}
            >
                <Box className={styles.illustration}>
                    <CloseButton size={CloseButton.SIZE_LARGE} onClick={onContinue} className={styles.closeButton} />
                </Box>
                <Box className={styles.body}>
                    {/* Step content */}
                    <Box className={styles.steps}>
                        {stepIndex === 0 && (
                            <div className={styles.step}>
                                <h2>
                                    <FormattedMessage
                                        id="amp.welcome.title"
                                        defaultMessage="Welcome to {APP_NAME}!"
                                        description="Welcome modal title"
                                        values={{APP_NAME}}
                                    />
                                </h2>
                                <p>
                                    <FormattedMessage
                                        id="amp.welcome.intro"
                                        defaultMessage="{APP_NAME} is a powerful block-based programming language with new blocks and extensions to allow you to make interesting projects."
                                        description="Welcome modal introduction"
                                        values={{APP_NAME}}
                                    />
                                </p>
                                {process.env.ampmod_mode === 'canary' && (
                                    <p>
                                        <FormattedMessage
                                            id="amp.welcome.canary"
                                            defaultMessage="You are using a canary build of {APP_NAME}. This build may be unstable and contain bugs. Please report any issues you encounter."
                                            description="Welcome modal canary build message"
                                            values={{APP_NAME}}
                                        />
                                    </p>
                                )}
                                {process.env.ampmod_mode === 'lab' && (
                                    <p>
                                        <FormattedMessage
                                            id="amp.welcome.lab"
                                            defaultMessage="{APP_NAME} is experimenting with new features in {APP_NAME} Lab. Projects created here may not currently be compatible with the official {APP_NAME} release. Feedback is welcome on the {forumsLink}."
                                            description="Welcome modal lab build message"
                                            values={{
                                                APP_NAME,
                                                forumsLink: (
                                                    <a
                                                        href="https://codeberg.org/ampmod/ampmod/issues"
                                                        target="_blank"
                                                        rel="noreferrer noopener"
                                                    >
                                                        Codeberg
                                                    </a>
                                                )
                                            }}
                                        />
                                    </p>
                                )}
                                <p>
                                    <FormattedMessage
                                        id="amp.welcome.alreadyUsed"
                                        defaultMessage="If you've used {APP_NAME} before, you can click the button on the top left to skip this tutorial."
                                        description="Welcome modal already used message"
                                        values={{APP_NAME}}
                                    />
                                </p>
                            </div>
                        )}

                        {stepIndex === 1 && (
                            <div className={styles.step}>
                                <h2>
                                    <FormattedMessage
                                        id="amp.welcome.theme.title"
                                        defaultMessage="Choose your theme"
                                        description="Welcome modal theme selection title"
                                    />
                                </h2>
                                <p>
                                    <FormattedMessage
                                        id="amp.welcome.theme.body"
                                        defaultMessage="You can change this later in the Settings menu."
                                        description="Welcome modal theme selection body"
                                    />
                                </p>
                                <ThemeSelector />
                                <AccentSelector />
                            </div>
                        )}

                        {stepIndex === 2 && (
                            <div className={styles.step}>
                                <h2>
                                    <FormattedMessage
                                        id="amp.welcome.help.title"
                                        defaultMessage="Need help?"
                                        description="Welcome modal title"
                                    />
                                </h2>
                                <p>
                                    <FormattedMessage
                                        id="amp.welcome.help"
                                        defaultMessage="Check out the official {wikiLink}, where you can find information about how to use {APP_NAME}."
                                        description="Welcome modal help links"
                                        values={{
                                            wikiLink: (
                                                <a
                                                    href="https://ampmod.miraheze.org"
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                >
                                                    AmpMod Wiki
                                                </a>
                                            ),
                                            APP_NAME
                                        }}
                                    />
                                </p>
                                <p>
                                    <FormattedMessage
                                        id="amp.welcome.signingOff"
                                        defaultMessage="Signing off! -Apple Cat"
                                    />
                                </p>
                            </div>
                        )}
                    </Box>

                    <Box className={styles.buttonRow}>
                        <button className={styles.continue} onClick={handleNext}>
                            {stepIndex === 2 ? (
                                <FormattedMessage
                                    id="amp.welcome.ok"
                                    defaultMessage="OK"
                                    description="Text for the button which continues from the welcome dialog"
                                />
                            ) : (
                                <FormattedMessage
                                    id="amp.welcome.next"
                                    defaultMessage="Next"
                                    description="Text for the button which proceeds to the next welcome step"
                                />
                            )}
                        </button>
                    </Box>
                </Box>
            </ReactModal>
        </div>
    );
};

Welcome.propTypes = {
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool,
    onContinue: PropTypes.func.isRequired
};

export default injectIntl(Welcome);
