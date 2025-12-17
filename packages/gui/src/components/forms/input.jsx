import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import styles from './input.css';

const Input = props => {
    props = {
        ...props,
        small: typeof props.small === "undefined" ? false : props.small
    };

    const {small, ...componentProps} = props;
    return (
        <input
            {...componentProps}
            className={classNames(styles.inputForm, props.className, {
                [styles.inputSmall]: small
            })}
        />
    );
};

Input.propTypes = {
    className: PropTypes.string,
    small: PropTypes.bool
};

export default Input;
