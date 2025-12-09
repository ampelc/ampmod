import Box2DIcon from './images/box2d.svg';
import BatteryIcon from './images/battery.svg';

type ExampleMeta = {
    id: string;
    by: string;
    img: string;
    isSupported?: boolean;
    scratchuserid?: string;
    loader: () => Promise<ArrayBuffer>;
};

const examples: Record<string, ExampleMeta> = {
    /* "101": {
        id: '101',
        by: 'AmpMod',
        img: require("./images/ampmod101.svg"),
        loader: () =>
            // @ts-ignore
            alert("Not implemented"),
    }, */
    griffpatch: {
        id: 'griffpatch',
        by: 'DNin01',
        img: Box2DIcon,
        loader: () =>
            import(
                /* webpackChunkName: "examples-apz-griffpatch" */ './Box2D.sb3?bytes'
            ).then(module => module.default as unknown as ArrayBuffer)
    },
    battery: {
        id: 'battery',
        by: '8to16',
        img: BatteryIcon,
        isSupported: 'getBattery' in navigator,
        scratchuserid: '141263923',
        loader: () =>
            import(
                /* webpackChunkName: "examples-apz-battery" */ './Battery.apz?bytes'
            ).then(module => module.default as unknown as ArrayBuffer)
    }
};

export default examples;
