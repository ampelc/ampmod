import './blocks.js';

/**
 * The default, placeholder implementation of the function that retrieves
 * the execute cache data for a block.
 * @type {function}
 */
export let getExecuteCachedData = function () {
    throw new Error('blocks.js has not initialized BlocksExecuteCache');
};

/**
 * Public API to allow external code (blocks.js) to replace the implementation
 * of getExecuteCachedData. This prevents the TypeError caused by external code
 * trying to assign to a getter-only property.
 * @param {function} newFunction The new function to use for getting execute cache data.
 */
export const setCached = function (newFunction) {
    if (typeof newFunction !== 'function') {
        throw new Error('setCached requires a function argument.');
    }
    // Reassign the exported variable to inject the new functionality
    getExecuteCachedData = newFunction;
};

export {getExecuteCachedData as getCached};
