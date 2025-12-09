import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import FancyCheckbox from '../tw-fancy-checkbox/checkbox.jsx';
import Input from '../forms/input.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import DocumentationLink from '../tw-documentation-link/documentation-link.jsx';
import styles from './settings-modal.css';
import helpIcon from './help-icon.svg';
import {APP_NAME} from '@ampmod/branding';

 

const BufferedInput = BufferedInputHOC(Input);

const messages = defineMessages({
    title: {
        defaultMessage: 'Program Settings',
        description: 'Title of settings modal',
        id: 'amp.settingsModal.title'
    },
    help: {
        defaultMessage: 'Click for help',
        description: 'Hover text of help icon in settings',
        id: 'tw.settingsModal.help'
    }
});

const LearnMore = props => (
    <React.Fragment>
        {' '}
        <DocumentationLink {...props}>
            <FormattedMessage defaultMessage="Learn more." id="gui.alerts.cloudInfoLearnMore" />
        </DocumentationLink>
    </React.Fragment>
);

class UnwrappedSetting extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, ['handleClickHelp']);
        this.state = {
            helpVisible: false
        };
    }
    componentDidUpdate(prevProps) {
        if (this.props.active && !prevProps.active) {
             
            this.setState({
                helpVisible: true
            });
        }
    }
    handleClickHelp() {
        this.setState(prevState => ({
            helpVisible: !prevState.helpVisible
        }));
    }
    render() {
        return (
            <div
                className={classNames(styles.setting, {
                    [styles.active]: this.props.active
                })}
            >
                <div className={styles.label}>
                    {this.props.primary}
                    <button
                        className={styles.helpIcon}
                        onClick={this.handleClickHelp}
                        title={this.props.intl.formatMessage(messages.help)}
                    >
                        <img src={helpIcon} draggable={false} />
                    </button>
                </div>
                {this.state.helpVisible && (
                    <div className={styles.detail}>
                        {this.props.help}
                        {this.props.slug && <LearnMore slug={this.props.slug} />}
                    </div>
                )}
                {this.props.secondary}
            </div>
        );
    }
}
UnwrappedSetting.propTypes = {
    intl: intlShape,
    active: PropTypes.bool,
    help: PropTypes.node,
    primary: PropTypes.node,
    secondary: PropTypes.node,
    slug: PropTypes.string
};
const Setting = injectIntl(UnwrappedSetting);

const BooleanSetting = ({value, onChange, label, ...props}) => (
    <Setting
        {...props}
        active={value}
        primary={
            <label className={styles.label}>
                <FancyCheckbox className={styles.checkbox} checked={value} onChange={onChange} />
                {label}
            </label>
        }
    />
);
BooleanSetting.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.bool.isRequired,
    label: PropTypes.node.isRequired
};

const HighQualityPen = props => (
    <BooleanSetting
        {...props}
        label={
            <FormattedMessage
                defaultMessage="High Quality Pen"
                description="High quality pen setting"
                id="tw.settingsModal.highQualityPen"
            />
        }
        help={
            <FormattedMessage
                 
                defaultMessage="Allows pen projects to render at higher resolutions and disables some coordinate rounding in the editor. Not all projects benefit from this setting and it may impact performance."
                description="High quality pen setting help"
                id="tw.settingsModal.highQualityPenHelp"
            />
        }
        slug="high-quality-pen"
    />
);

const CustomFPS = props => (
    <Setting
        active={props.framerate !== 30}
        primary={
            <div className={classNames(styles.label, styles.customStageSize)}>
                <FormattedMessage
                    defaultMessage="Custom FPS:"
                    description="FPS setting"
                    id="amp.settingsModal.fps"
                />
                <BufferedInput
                    value={props.framerate}
                    onSubmit={props.onChange}
                    min="0"
                    max="250"
                    type="number"
                />
            </div>
        }
        help={
            <FormattedMessage
                 
                defaultMessage="Runs scripts at a custom amount of times per second instead of 30. 60 is a common option. Use 0 to un-cap the FPS so it runs at the monitor's refresh rate."
                description="FPS setting help"
                id="amp.settingsModal.fpsHelp"
            />
        }
        slug="custom-fps"
    />
);
CustomFPS.propTypes = {
    framerate: PropTypes.number,
    onFramerateChange: PropTypes.func
};


CustomFPS.propTypes = {
    framerate: PropTypes.number,
    onChange: PropTypes.func,
    onCustomizeFramerate: PropTypes.func
};

const Interpolation = props => (
    <BooleanSetting
        {...props}
        label={
            <FormattedMessage
                defaultMessage="Interpolation"
                description="Interpolation setting"
                id="tw.settingsModal.interpolation"
            />
        }
        help={
            <FormattedMessage
                 
                defaultMessage="Makes projects appear smoother by interpolating sprite motion. For AmpMod projects, you should use Custom FPS instead."
                description="Interpolation setting help"
                id="tw.settingsModal.interpolationHelp"
            />
        }
        slug="interpolation"
    />
);

const InfiniteClones = props => (
    <BooleanSetting
        {...props}
        label={
            <FormattedMessage
                defaultMessage="Infinite Clones"
                description="Infinite Clones setting"
                id="tw.settingsModal.infiniteClones"
            />
        }
        help={
            <FormattedMessage
                defaultMessage="Disables Scratch's 300 clone limit."
                description="Infinite Clones setting help"
                id="tw.settingsModal.infiniteClonesHelp"
            />
        }
        slug="infinite-clones"
    />
);

const RemoveFencing = props => (
    <BooleanSetting
        {...props}
        label={
            <FormattedMessage
                defaultMessage="Remove Fencing"
                description="Remove Fencing setting"
                id="tw.settingsModal.removeFencing"
            />
        }
        help={
            <FormattedMessage
                 
                defaultMessage="Allows sprites to move offscreen, become as large or as small as they want, and makes touching blocks work offscreen."
                description="Remove Fencing setting help"
                id="tw.settingsModal.removeFencingHelp"
            />
        }
        slug="remove-fencing"
    />
);

const RemoveMiscLimits = props => (
    <BooleanSetting
        {...props}
        label={
            <FormattedMessage
                defaultMessage="Remove Miscellaneous Limits"
                description="Remove Miscellaneous Limits setting"
                id="tw.settingsModal.removeMiscLimits"
            />
        }
        help={
            <FormattedMessage
                defaultMessage="Removes sound effect limits and pen size limits."
                description="Remove Miscellaneous Limits setting help"
                id="tw.settingsModal.removeMiscLimitsHelp"
            />
        }
        slug="remove-misc-limits"
    />
);

const WarpTimer = props => (
    <BooleanSetting
        {...props}
        label={
            <FormattedMessage
                defaultMessage="Warp Timer"
                description="Warp Timer setting"
                id="tw.settingsModal.warpTimer"
            />
        }
        help={
            <FormattedMessage
                 
                defaultMessage="Makes scripts check if they are stuck in a long or infinite loop and run at a low framerate instead of getting stuck until the loop finishes. This fixes most crashes but has a significant performance impact."
                description="Warp Timer help"
                id="tw.settingsModal.warpTimerHelp"
            />
        }
        slug="warp-timer"
    />
);

const CaseSensitivity = props => (
    <BooleanSetting
        {...props}
        label={
            <FormattedMessage
                defaultMessage="Case Sensitivity"
                description="Case Sensitivity setting"
                id="amp.settingsModal.caseSensitivity"
            />
        }
        help={
            <FormattedMessage
                 
                defaultMessage="Makes the () = () block case-sensitive. E.g. with this option, (Apple) = (APPLE) will equal false, but when it is disabled, it will equal true. This may break vanilla Scratch projects."
                description="Case Sensitivity help"
                id="amp.settingsModal.caseSensitivityHelp"
            />
        }
    />
);

const DisableCompiler = props => (
    <BooleanSetting
        {...props}
        label={
            <FormattedMessage
                defaultMessage="Disable Compiler"
                description="Disable Compiler setting"
                id="tw.settingsModal.disableCompiler"
            />
        }
        help={
            <FormattedMessage
                 
                defaultMessage="Disables the {APP_NAME} compiler. You may want to enable this while editing projects so that scripts update immediately. Otherwise, you should never enable this."
                description="Disable Compiler help"
                id="tw.settingsModal.disableCompilerHelp"
                values={{
                    APP_NAME
                }}
            />
        }
        slug="disable-compiler"
    />
);

export const sizePresets = [
    {
        id: 'd',
        width: 480,
        height: 360,
        message: {
            id: 'amp.settingsModal.presetStageDefault',
            defaultMessage: 'Default',
            description: 'Preset label for 4:3 stage size'
        }
    },
    {
        id: 'w',
        width: 640,
        height: 360,
        message: {
            id: 'amp.settingsModal.presetStageWidescreen',
            defaultMessage: 'Widescreen',
            description: 'Preset label for 16:9 stage size'
        }
    },
    {
        id: 's',
        width: 360,
        height: 360,
        message: {
            id: 'amp.settingsModal.presetStageSquare',
            defaultMessage: 'Square',
            description: 'Preset label for 1:1 stage size'
        }
    }
];

const CustomStageSize = ({
    customStageSizeEnabled,
    stageWidth,
    onStageWidthChange,
    stageHeight,
    onStageHeightChange,
    onPresetSelected
}) => {
    const applyPreset = preset => {
        onPresetSelected(preset.width, preset.height);
    };

    const getAspectRatio = (width, height) => {
        const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
        const divisor = gcd(width, height);
        return `${width / divisor}:${height / divisor}`;
    }

    return (
        <Setting
            active={customStageSizeEnabled}
            primary={
                <div className={classNames(styles.label, styles.customStageSize)}>
                    <FormattedMessage
                        defaultMessage="Custom Stage Size:"
                        description="Custom Stage Size option"
                        id="tw.settingsModal.customStageSize"
                    />
                    <BufferedInput
                        value={stageWidth}
                        onSubmit={onStageWidthChange}
                        className={styles.customStageSizeInput}
                        type="number"
                        min="0"
                        max="1024"
                        step="1"
                    />
                    <span>{'×'}</span>
                    <BufferedInput
                        value={stageHeight}
                        onSubmit={onStageHeightChange}
                        className={styles.customStageSizeInput}
                        type="number"
                        min="0"
                        max="1024"
                        step="1"
                    />
                </div>
            }
            secondary={
                <>
                    {(stageWidth >= 1000 || stageHeight >= 1000) && (
                        <div className={styles.warning}>
                            <FormattedMessage
                                defaultMessage="Using a custom stage size this large is not recommended! Instead, use a lower size with the same aspect ratio and let fullscreen mode upscale it to match the user's display."
                                description="Warning about using stages that are too large in settings modal"
                                id="tw.settingsModal.largeStageWarning"
                            />
                            <LearnMore slug="custom-stage-size" />
                        </div>
                    )}
                    <div className={styles.presetButtons}>
                        {sizePresets.map(preset => {
                            const isSelected =
                                stageWidth === preset.width && stageHeight === preset.height;
                            return (
                                <button
                                    key={preset.id}
                                    onClick={() => applyPreset(preset)}
                                    className={classNames(styles.presetButton, {
                                        [styles.selectedPreset]: isSelected
                                    })}
                                    style={{
                                        height: 135,
                                        width: (preset.width / preset.height) * 135
                                    }}
                                >
                                    <FormattedMessage {...preset.message} />
                                    <div style={{ fontSize: 12, marginTop: 4 }}>
                                        {getAspectRatio(preset.width, preset.height)}
                                    </div>
                                </button>
                            );

                        })}
                    </div>
                </>
            }
            help={
                <FormattedMessage
                    defaultMessage="Changes the size of the stage from 480x360 to something else. Try 640x360 to make the stage widescreen. Very few vanilla Scratch projects will handle this properly."
                    description="Custom Stage Size option help text"
                    id="tw.settingsModal.customStageSizeHelp"
                />
            }
            slug="custom-stage-size"
        />
    );
};
CustomStageSize.propTypes = {
    customStageSizeEnabled: PropTypes.bool,
    stageWidth: PropTypes.number,
    onStageWidthChange: PropTypes.func,
    stageHeight: PropTypes.number,
    onStageHeightChange: PropTypes.func
};

const StoreProjectOptions = ({onStoreProjectOptions}) => (
    <div className={styles.setting}>
        <div>
            <button onClick={onStoreProjectOptions} className={styles.button}>
                <FormattedMessage
                    defaultMessage="Store settings in project"
                    description="Button in settings modal"
                    id="tw.settingsModal.storeProjectOptions"
                />
            </button>
        </div>
    </div>
);
StoreProjectOptions.propTypes = {
    onStoreProjectOptions: PropTypes.func
};

const Header = props => (
    <div className={styles.header}>
        {props.children}
        <div className={styles.divider} />
    </div>
);
Header.propTypes = {
    children: PropTypes.node
};

const CollapsibleSection = ({titleId, children}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.collapsibleSection}>
            <div
                className={styles.header}
                onClick={() => setIsOpen(prev => !prev)}
                style={{cursor: 'pointer'}}
            >
                <FormattedMessage {...titleId} />
                <div className={styles.divider} />
                <span className={styles.collapseArrow}>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && children}
        </div>
    );
};
CollapsibleSection.propTypes = {
    titleId: PropTypes.object,
    children: PropTypes.node
}

const SettingsModalComponent = props => (
    <Modal
        className={styles.modalContent}
        onRequestClose={props.onClose}
        contentLabel={props.intl.formatMessage(messages.title)}
        id="settingsModal"
    >
        <Box className={styles.body}>
            <Header>
                <FormattedMessage
                    defaultMessage="Quality of Life"
                    description="Settings modal section"
                    id="amp.settingsModal.qol"
                />
            </Header>
            {!props.isEmbedded && <CustomStageSize {...props} />}
            <CustomFPS framerate={props.framerate} onChange={props.onFramerateChange} />
            <HighQualityPen value={props.highQualityPen} onChange={props.onHighQualityPenChange} />
            <WarpTimer value={props.warpTimer} onChange={props.onWarpTimerChange} />
            <Header>
                <FormattedMessage
                    defaultMessage="Remove Limits"
                    description="Settings modal section"
                    id="tw.settingsModal.removeLimits"
                />
            </Header>
            <InfiniteClones value={props.infiniteClones} onChange={props.onInfiniteClonesChange} />
            <RemoveFencing value={props.removeFencing} onChange={props.onRemoveFencingChange} />
            <RemoveMiscLimits value={props.removeLimits} onChange={props.onRemoveLimitsChange} />
            <CollapsibleSection titleId={{defaultMessage: 'Danger Zone', description: 'Settings modal section', id: 'tw.settingsModal.dangerZone'}}>
                <div className={styles.warning}>
                    <FormattedMessage
                        defaultMessage="These options may change behaviour of certain blocks, and will often break your project."
                        description="Danger zone warning"
                        id="amp.settingsModal.dangerZoneWarning"
                    />
                </div>
                <CaseSensitivity value={props.caseSensitivity} onChange={props.onCaseSensitivityChange} />
                <Interpolation value={props.interpolation} onChange={props.onInterpolationChange} />
                {/* <DisableCompiler value={props.disableCompiler} onChange={props.onDisableCompilerChange} /> */}
            </CollapsibleSection>
        </Box>
    </Modal>
);

SettingsModalComponent.propTypes = {
    intl: intlShape,
    onClose: PropTypes.func,
    isEmbedded: PropTypes.bool,
    framerate: PropTypes.number,
    onFramerateChange: PropTypes.func,
    onCustomizeFramerate: PropTypes.func,
    highQualityPen: PropTypes.bool,
    onHighQualityPenChange: PropTypes.func,
    interpolation: PropTypes.bool,
    onInterpolationChange: PropTypes.func,
    infiniteClones: PropTypes.bool,
    onInfiniteClonesChange: PropTypes.func,
    removeFencing: PropTypes.bool,
    onRemoveFencingChange: PropTypes.func,
    removeLimits: PropTypes.bool,
    onRemoveLimitsChange: PropTypes.func,
    warpTimer: PropTypes.bool,
    onWarpTimerChange: PropTypes.func,
    disableCompiler: PropTypes.bool,
    onDisableCompilerChange: PropTypes.func
};

export default injectIntl(SettingsModalComponent);
