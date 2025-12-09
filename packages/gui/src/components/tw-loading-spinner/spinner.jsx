import React from 'react';
import styles from './spinner.css';
import { AccessibleIcon } from 'radix-ui';

const Loading = ({isWhite, bare}) => (
    <AccessibleIcon.Root label="Loading...">
        <div className={!bare && styles.container}>
            <div className={`${styles.spinner} ${isWhite ? styles.spinnerWhite : ''}`} />
        </div>
    </AccessibleIcon.Root>
);

export default Loading;
