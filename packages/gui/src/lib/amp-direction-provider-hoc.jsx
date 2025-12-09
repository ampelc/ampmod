import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {Direction} from 'radix-ui';

/**
 * amp: Higher Order Component to provide direction to Radix components, based on the current RTL direction.
 * Based off https://codeberg.org/LibreKitten/LibreKitten/src/commit/803879621b/packages/gui/src/lib/lk-direction-provider-hoc.jsx.
 * @param {React.Component} WrappedComponent: The component to wrap.
 * @returns {React.Component} A wrapper component around Direction.Provider, connected to direction state.
 */
const AmpDirectionProviderHOC = WrappedComponent => {
    const DirectionProviderWrapper = ({isRtl, ...componentProps}) => (
        <Direction.Provider dir={isRtl ? 'rtl' : 'ltr'}>
            <WrappedComponent {...componentProps} />
        </Direction.Provider>
    );
    DirectionProviderWrapper.propTypes = {isRtl: PropTypes.bool};

    const mapStateToProps = state => ({
        isRtl: state.locales.isRtl
    });

    return connect(mapStateToProps)(DirectionProviderWrapper);
};

export default AmpDirectionProviderHOC;
