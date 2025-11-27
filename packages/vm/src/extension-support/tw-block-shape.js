import ScratchBlocksConstants from '../engine/scratch-blocks-constants.js';
/**
 * Types of block shapes
 * @enum {number}
 */
const BlockShape = {
    /**
     * Output shape: hexagonal (booleans/predicates).
     */
    HEXAGONAL: ScratchBlocksConstants.OUTPUT_SHAPE_HEXAGONAL,
    /**
     * Output shape: rounded (numbers).
     */
    ROUND: ScratchBlocksConstants.OUTPUT_SHAPE_ROUND,
    /**
     * Output shape: squared (any/all values; strings).
     */
    SQUARE: ScratchBlocksConstants.OUTPUT_SHAPE_SQUARE
};
export default BlockShape;
