import Box2DIcon from './images/box2d.svg';
import BatteryIcon from './images/battery.svg';
import griffpatch from './Box2D.sb3';
import battery from './Battery.apz';

type ExampleMeta = {
    id: string;
    by: string;
    img: string;
    isSupported?: boolean;
    scratchuserid?: string;
    url: string;
};

const examples: Record<string, ExampleMeta> = {
    griffpatch: {
        id: 'griffpatch',
        by: 'DNin01',
        img: Box2DIcon,
        url: griffpatch
    },
    battery: {
        id: 'battery',
        by: '8to16',
        img: BatteryIcon,
        isSupported: 'getBattery' in navigator,
        url: battery
    }
};

export default examples;