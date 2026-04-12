/**
 * @fileoverview
 * Utility functions to return json corresponding to default empty assets.
 */

/**
 * Generate a blank costume object for vm.addCostume with the provided name.
 * @param {string} name the name to use for the costume, caller should localize
 * @return {object} vm costume object
 */
const emptyCostume = name => ({
    name: name,
    bitmapResolution: 1,
    dataFormat: 'svg',
    assetId: 'cd21514d0531fdffb22204e0ec5ed84a',
    md5ext: 'cd21514d0531fdffb22204e0ec5ed84a.svg',
    rotationCenterX: 0,
    rotationCenterY: 0
});

/**
 * Generate a new empty sprite. The caller should provide localized versions of the
 * default names.
 * @param {string} name the name to use for the sprite
 * @param {string} soundName the name to use for the default sound
 * @param {string} costumeName the name to use for the default costume
 * @return {object} object expected by vm.addSprite
 */
const emptySprite = (name, soundName, costumeName) => ({
    name: name,
    isStage: false,
    variables: {},
    lists: {},
    broadcasts: {},
    blocks: {},
    comments: {},
    currentCostume: 0,
    costumes: [
        {
            name: costumeName,
            bitmapResolution: 1,
            dataFormat: 'svg',
            assetId: 'cd21514d0531fdffb22204e0ec5ed84a',
            md5ext: 'cd21514d0531fdffb22204e0ec5ed84a.svg',
            rotationCenterX: 0,
            rotationCenterY: 0
        }
    ],
    sounds: [],
    volume: 100,
    layerOrder: 1,
    visible: true,
    x: 36,
    y: 28,
    size: 100,
    direction: 90,
    draggable: false,
    rotationStyle: 'all around'
});

export {emptyCostume, emptySprite};