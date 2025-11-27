import BlockType from '../../extension-support/block-type.js';
import ArgumentType from '../../extension-support/argument-type.js';
import AmpMod from '../../extension-support/ampmod-api.js';
import RuntimeType from '../../engine/runtime.js';

/**
 * Class for Electro Test blocks
 * @constructor
 */
class ElectroTestBlocks {
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
            id: 'electroTest',
            name: 'Electro Test',
            docsURI: 'https://example.com',
            globalExtensions: ['colours_more'],
            blocks: [
                {
                    blockType: BlockType.ARRAY,
                    opcode: 'listOfGreetings',
                    text: 'list of greetings'
                },
                {
                    blockType: BlockType.ARRAY,
                    opcode: 'addRandomNumber',
                    text: 'add a random number to [ARRAY]',
                    arguments: {
                        ARRAY: {
                            type: ArgumentType.ARRAY
                        }
                    }
                },
                {
                    blockType: BlockType.ARRAY,
                    opcode: 'itemOf',
                    text: 'my item [ITEM] of [ARRAY]',
                    arguments: {
                        ITEM: {
                            menu: 'awesomeMenu'
                        },
                        ARRAY: {
                            type: ArgumentType.ARRAY
                        }
                    }
                },
                {
                    blockType: BlockType.REPORTER,
                    opcode: 'ampApiObject',
                    text: 'AmpMod API object'
                },
                {
                    blockType: BlockType.MULTIREPORTER,
                    opcode: 'multiReporter',
                    text: 'reporter that can be dropped in array/boolean arguments'
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'helpUrlExists',
                    text: 'I have my own tooltip',
                    tooltip: 'I have proof'
                },
                {
                    blockType: BlockType.INLINE,
                    opcode: 'drawer',
                    text: ['drawer 1', 'drawer 2', 'drawer 3', 'drawer bottom'],
                    branchCount: 3
                },
                {
                    blockType: BlockType.COMMAND,
                    extensions: ['shape_switch_case'],
                    opcode: 'scbb',
                    text: 'switch, case, beep boop'
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: 'inlineinputsno',
                    text: ['test', 'without', 'inline', 'inputs'],
                    inlineInputs: false
                },
                {
                    blockType: BlockType.COMMAND,
                    isTerminal: true,
                    opcode: 'pause',
                    text: 'enable pause'
                }
            ],
            menus: {
                awesomeMenu: {
                    acceptCustom: 'number',
                    acceptReporters: true,
                    items: ['1', 'last', 'random'],
                    defaultValue: 1
                }
            }
        };
    }

    listOfGreetings () {
        return ['hello', 'hi', 'greetings', 'welcome', 'hola', 'bonjour'];
    }

    addRandomNumber (args: { ARRAY: any; }) {
        const baseArray = args.ARRAY;
        return [...baseArray, Math.floor(Math.random() * 10) + 1];
    }

    ampApiObject () {
        return AmpMod;
    }

    multiReporter () {
        return "I'm not joking";
    }

    helpUrlExists () {
        console.log('Yes');
    }

    scbb () {
        // eslint-disable-next-line no-alert
        alert('switch like a snitch');
    }

    pause () {
        // @ts-ignore
        this.runtime.isPaused = true;
    }
}

export default ElectroTestBlocks;
