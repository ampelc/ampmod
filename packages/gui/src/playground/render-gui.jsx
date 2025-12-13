import React, {useEffect} from 'react';
import GUI from '../containers/gui.jsx';

const searchParams = new URLSearchParams(location.search);
const cloudHost = searchParams.get('cloud_host') || 'wss://clouddata.turbowarp.org';

const RenderGUI = props => {
    return (
        <GUI
            cloudHost={cloudHost}
            canUseCloud
            hasCloudPermission
            canSave={false}
            basePath={process.env.ROOT}
            canEditTitle
            enableCommunity={!window.isPwa}
            canChangeTheme={!process.env.AW3}
            canShare={process.env.AW3}
            {...props}
        />
    );
};

export default RenderGUI;
