import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import {closeSettingsModal} from '../reducers/modals';
import SettingsModalComponent from '../components/tw-settings-modal/settings-modal.jsx';
import {defaultStageSize} from '../reducers/custom-stage-size';

const messages = defineMessages({
    newFramerate: {
        defaultMessage: 'New framerate:',
        description: 'Prompt shown to choose a new framerate',
        id: 'tw.menuBar.newFramerate'
    }
});

class UsernameModal extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleFramerateChange',
            'handleHighQualityPenChange',
            'handleInterpolationChange',
            'handleInfiniteClonesChange',
            'handleRemoveFencingChange',
            'handleRemoveLimitsChange',
            'handleWarpTimerChange',
            'handleStageWidthChange',
            'handleStageHeightChange',
            'handleDisableCompilerChange',
            'handleCaseSensitivityChange',
            'handlePresetSelected',
            'handleStoreProjectOptions'
        ]);
    }

    handleFramerateChange(value) {
        const numeric = Number(value) ?? 30;
        this.props.vm.setFramerate(numeric);
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleHighQualityPenChange(e) {
        this.props.vm.renderer.setUseHighQualityRender(e.target.checked);
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleInterpolationChange(e) {
        this.props.vm.setInterpolation(e.target.checked);
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleInfiniteClonesChange(e) {
        this.props.vm.setRuntimeOptions({
            maxClones: e.target.checked ? Infinity : 300
        });
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleRemoveFencingChange(e) {
        this.props.vm.setRuntimeOptions({
            fencing: e.target.checked
        });
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleRemoveLimitsChange(e) {
        this.props.vm.setRuntimeOptions({
            miscLimits: !e.target.checked
        });
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleCaseSensitivityChange(e) {
        this.props.vm.setRuntimeOptions({
            caseSensitivity: e.target.checked
        });
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleWarpTimerChange(e) {
        this.props.vm.setCompilerOptions({
            warpTimer: e.target.checked
        });
    }

    handleDisableCompilerChange(e) {
        this.props.vm.setCompilerOptions({
            enabled: !e.target.checked
        });
    }

    handleStageWidthChange(value) {
        this.props.vm.setStageSize(value, this.props.customStageSize.height);
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleStageHeightChange(value) {
        this.props.vm.setStageSize(this.props.customStageSize.width, value);
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handlePresetSelected(width, height) {
        this.props.vm.setStageSize(width, height);
        if (!this.props.isEmbedded) this.handleStoreProjectOptions();
    }

    handleStoreProjectOptions() {
        this.props.vm.storeProjectOptions();
    }

    render() {
        const {
             
            onClose,
            vm,
             
            ...props
        } = this.props;
        return (
            <SettingsModalComponent
                onClose={this.props.onClose}
                onFramerateChange={this.handleFramerateChange}
                onHighQualityPenChange={this.handleHighQualityPenChange}
                onInterpolationChange={this.handleInterpolationChange}
                onInfiniteClonesChange={this.handleInfiniteClonesChange}
                onRemoveFencingChange={this.handleRemoveFencingChange}
                onRemoveLimitsChange={this.handleRemoveLimitsChange}
                onCaseSensitivityChange={this.handleCaseSensitivityChange}
                onWarpTimerChange={this.handleWarpTimerChange}
                onStageWidthChange={this.handleStageWidthChange}
                onStageHeightChange={this.handleStageHeightChange}
                // onDisableCompilerChange={this.handleDisableCompilerChange}
                stageWidth={this.props.customStageSize.width}
                stageHeight={this.props.customStageSize.height}
                customStageSizeEnabled={
                    this.props.customStageSize.width !== defaultStageSize.width ||
                    this.props.customStageSize.height !== defaultStageSize.height
                }
                onPresetSelected={this.handlePresetSelected}
                onStoreProjectOptions={this.handleStoreProjectOptions}
                {...props}
            />
        );
    }
}

UsernameModal.propTypes = {
    intl: intlShape,
    onClose: PropTypes.func,
    vm: PropTypes.shape({
        renderer: PropTypes.shape({
            setUseHighQualityRender: PropTypes.func
        }),
        setFramerate: PropTypes.func,
        setCompilerOptions: PropTypes.func,
        setInterpolation: PropTypes.func,
        setRuntimeOptions: PropTypes.func,
        setStageSize: PropTypes.func,
        storeProjectOptions: PropTypes.func
    }),
    isEmbedded: PropTypes.bool,
    framerate: PropTypes.number,
    highQualityPen: PropTypes.bool,
    interpolation: PropTypes.bool,
    infiniteClones: PropTypes.bool,
    removeFencing: PropTypes.bool,
    removeLimits: PropTypes.bool,
    caseSensitivity: PropTypes.bool,
    warpTimer: PropTypes.bool,
    customStageSize: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number
    }),
    disableCompiler: PropTypes.bool
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    isEmbedded: state.scratchGui.mode.isEmbedded,
    framerate: state.scratchGui.tw.framerate,
    highQualityPen: state.scratchGui.tw.highQualityPen,
    interpolation: state.scratchGui.tw.interpolation,
    infiniteClones: state.scratchGui.tw.runtimeOptions.maxClones === Infinity,
    removeFencing: state.scratchGui.tw.runtimeOptions.fencing,
    removeLimits: !state.scratchGui.tw.runtimeOptions.miscLimits,
    caseSensitivity: state.scratchGui.tw.runtimeOptions.caseSensitivity,
    warpTimer: state.scratchGui.tw.compilerOptions.warpTimer,
    customStageSize: state.scratchGui.customStageSize,
    disableCompiler: false
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(closeSettingsModal())
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UsernameModal));
