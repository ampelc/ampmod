import React from "react";
import ClippyComponent from '../components/amp-clippy/clippy.jsx';
import isAprilFools from '../lib/amp-enable-pranks';

const Clippy = ({isFixed, messageSet}) => {
    return <>{isAprilFools && <ClippyComponent isFixed={isFixed} messageSet={messageSet} />}</>;
};

export default Clippy;
