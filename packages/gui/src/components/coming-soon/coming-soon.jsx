import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'react-tooltip';

import styles from './coming-soon.css';

import awwCatIcon from './aww-cat.png';
import coolCatIcon from './cool-cat.png';

const messages = defineMessages({
    message1: {
        defaultMessage: "Don't worry, we're on it",
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message1'
    },
    message2: {
        defaultMessage: 'Coming Soon...',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message2'
    },
    message3: {
        defaultMessage: "We're working on it",
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message3'
    }
});

class ComingSoonContent extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, ['getRandomMessage']);
        this.state = {
            isShowing: false
        };
    }

    setShow() {
        // needed to set the opacity to 1, since the default is .9 on show
        this.setState({isShowing: true});
    }

    setHide() {
        this.setState({isShowing: false});
    }

    getRandomMessage() {
        // randomly chooses a message from `messages` to display in the tooltip.
        const images = [awwCatIcon, coolCatIcon];
        const messageNumber = Math.floor(Math.random() * Object.keys(messages).length) + 1;
        const imageNumber = Math.floor(Math.random() * Object.keys(images).length);

        return (
            (<FormattedMessage
                {...messages[`message${messageNumber}`]}
                values={{
                    emoji: (
                        // We shouldn't be using the cat images since they are trademarks of Scratch
                        // so how about an emoticon instead?
                        (<span>:)</span>)
                    )
                }}
            />)
        );
    }

    render() {
        const { className, place } = this.props;

        return (
            <Tooltip
                className={classNames(styles.comingSoon, className, {
                    [styles.show]: this.state.isShowing,
                    [styles.left]: place === 'left',
                    [styles.right]: place === 'right',
                    [styles.top]: place === 'top',
                    [styles.bottom]: place === 'bottom'
                })}
                place={place}
                // v5 uses `content` instead of `getContent`
                content={this.getRandomMessage()}
                onShow={this.setShow.bind(this)}
                onHide={this.setHide.bind(this)}
            />
        );
    }
}

ComingSoonContent.propTypes = {
    className: PropTypes.string,
    
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left'])
};

ComingSoonContent.defaultProps = {
    place: 'bottom'
};

const ComingSoon = injectIntl(ComingSoonContent);

// Wrapper component
const ComingSoonTooltip = props => (
    <div className={props.className}>
        <Tooltip
            className={props.tooltipClassName}
            place={props.place}
            // v5 uses `content` instead of `data-tip`
            content={props.children}
            delayHide={props.delayHide}
            delayShow={props.delayShow}
        />
    </div>
);

ComingSoonTooltip.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    delayHide: PropTypes.number,
    delayShow: PropTypes.number,
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    tooltipClassName: PropTypes.string
};

export { ComingSoon as ComingSoonComponent, ComingSoonTooltip };
