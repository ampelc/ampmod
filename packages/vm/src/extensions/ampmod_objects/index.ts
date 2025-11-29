import BlockType from '../../extension-support/block-type.js';
import ArgumentType from '../../extension-support/argument-type.js';
import AmpMod from '../../extension-support/ampmod-api.js';
import RuntimeType from '../../engine/runtime.js';

/**
 * Class for Objects blocks
 * @constructor
 */
class ObjectsBlocks {
    runtime: typeof RuntimeType;
    constructor (runtime: any) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'obj',
            name: 'Objects',
            color1: '#add14b',
            color2: '#8aa936',
            color3: '#688122',
            blocks: [
                {
                    blockType: BlockType.REPORTER,
                    opcode: 'sampleObject',
                    text: 'Sample object for testing before implementation'
                }
            ],
            menus: {
                indicesRandom: {
                    acceptCustom: 'number',
                    acceptReporters: true,
                    items: ['1', 'last', 'random'],
                    defaultValue: 1
                }
            }
        };
    }

    sampleObject () {
        return {name: "Apple Cat"};
    }
}

export default ObjectsBlocks;
