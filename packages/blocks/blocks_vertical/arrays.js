/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2025 AmpElectrecuted
 * All rights reserved.
 *
 * GPL-3.0.
 */

"use strict";

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

// Define message keys for localization
Blockly.Msg.ARRAYS_ITEM_OF = "item %1 of %2";
Blockly.Msg.ARRAYS_ITEM_NO_OF = "item # of %1 in %2";
Blockly.Msg.ARRAYS_CONTAINS = "%1 contains %2?";
Blockly.Msg.ARRAYS_LENGTH = "length of %1";
Blockly.Msg.ARRAYS_EMPTY_ARRAY = "empty array";
Blockly.Msg.ARRAYS_DELIMITED_TO_ARRAY = "array from %1 separated by %2";
Blockly.Msg.ARRAYS_IN_FRONT_OF = "add %1 to %2";
Blockly.Msg.ARRAYS_BEHIND = "%1 in front of %2";
Blockly.Msg.ARRAYS_AT = "insert %1 at %2 of %3";
Blockly.Msg.ARRAYS_RANGE = "list from %1 to %2";

Blockly.Blocks["arrays_item_of"] = {
    /**
     * Block for getting an item from an array.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_ITEM_OF,
            args0: [
                {
                    type: "input_value",
                    name: "INDEX",
                },
                {
                    type: "input_value",
                    name: "VALUE",
                    check: "Array",
                },
            ],
            output: null,
            extensions: ["colours_data_lists", "shape_round"],
        });
    },
};

Blockly.Blocks["arrays_item_no_of"] = {
    /**
     * Block for getting the index of an item in an array.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_ITEM_NO_OF,
            args0: [
                {
                    type: "input_value",
                    name: "VALUE",
                },
                {
                    type: "input_value",
                    name: "ARRAY",
                    check: "Array",
                },
            ],
            extensions: ["colours_data_lists", "output_number"],
        });
    },
};

Blockly.Blocks["arrays_contains"] = {
    /**
     * Block for checking if a list contains a value.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_CONTAINS,
            args0: [
                {
                    type: "input_value",
                    name: "ARRAY",
                    check: "Array",
                },
                {
                    type: "input_value",
                    name: "VALUE",
                },
            ],
            extensions: ["colours_data_lists", "output_boolean"],
        });
    },
};

Blockly.Blocks["arrays_length"] = {
    /**
     * Block for getting the length of a list.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_LENGTH,
            args0: [
                {
                    type: "input_value",
                    name: "VALUE",
                    check: "Array",
                },
            ],
            output: "Number",
            extensions: ["colours_data_lists", "output_number"],
        });
    },
};

Blockly.Blocks["arrays_empty_array"] = {
    /**
     * Block for creating an empty list.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_EMPTY_ARRAY,
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

Blockly.Blocks["arrays_delimited_to_array"] = {
    /**
     * Block for creating a list from a text.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_DELIMITED_TO_ARRAY,
            args0: [
                {
                    type: "input_value",
                    name: "TEXT",
                },
                {
                    type: "input_value",
                    name: "DELIM",
                },
            ],
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

// The 2 blocks below are swapped due to a mistake during development.

Blockly.Blocks["arrays_in_front_of"] = {
    /**
     * Block for reporting a list with an item added to the top.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_BEHIND,
            args0: [
                {
                    type: "input_value",
                    name: "ITEM",
                },
                {
                    type: "input_value",
                    name: "ARRAY",
                    check: "Array",
                },
            ],
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

Blockly.Blocks["arrays_behind"] = {
    /**
     * Block for reporting a list with an item added to the bottom.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_IN_FRONT_OF,
            args0: [
                {
                    type: "input_value",
                    name: "ITEM",
                },
                {
                    type: "input_value",
                    name: "ARRAY",
                    check: "Array",
                },
            ],
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

Blockly.Blocks["arrays_at"] = {
    /**
     * Block for reporting a list with an item at a specific position.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_AT,
            args0: [
                {
                    type: "input_value",
                    name: "ITEM",
                },
                {
                    type: "input_value",
                    name: "INDEX",
                },
                {
                    type: "input_value",
                    name: "ARRAY",
                    check: "Array",
                },
            ],
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

Blockly.Blocks["arrays_range"] = {
    /**
     * Block for creating a list with a range.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            message0: Blockly.Msg.ARRAYS_RANGE,
            args0: [
                {
                    type: "input_value",
                    name: "START",
                    check: "Number",
                },
                {
                    type: "input_value",
                    name: "END",
                    check: "Number",
                },
            ],
            output: "Array",
            extensions: ["colours_data_lists", "shape_square"],
        });
    },
};

Blockly.Blocks['arrays_expandablemake'] = {
    /**
     * Block for creating an array with dynamic placeholders.
     * Fixed to prevent shadow block ghosting during drags.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": "array with %1 %2",
            "args0": [
                {
                    "type": "field_expandable_remove",
                    "name": "REMOVE"
                },
                {
                    "type": "field_expandable_add",
                    "name": "ADD"
                }
            ],
            "output": "Array",
            "extensions": ["colours_data_lists", "shape_square"]
        });

        this.inputs_ = 0;
        this.placeholders_ = ["apple", "banana", "pear", "orange", "kiwi"];

        // Initial setup
        for (let i = 0; i < 2; i++) {
            this.addInput_(i);
            this.inputs_++;
        }
    },

    /**
     * Save the number of inputs to the XML.
     */
    mutationToDom: function () {
        const container = document.createElement('mutation');
        container.setAttribute('items', String(this.inputs_));
        return container;
    },

    /**
     * Restore the number of inputs from XML.
     */
    domToMutation: function (xmlElement) {
        const items = parseInt(xmlElement.getAttribute('items'), 10);
        const newCount = isNaN(items) ? 0 : items;

        // 1. Remove existing inputs to ensure a clean rebuild
        for (let i = 0; i < this.inputs_; i++) {
            if (this.getInput('ADD' + i)) {
                this.removeInput('ADD' + i);
            }
        }

        // 2. Update count and rebuild structure
        this.inputs_ = newCount;
        for (let i = 0; i < this.inputs_; i++) {
            this.addInput_(i);
        }
    },

    /**
     * Internal helper to create the input hole.
     * Shadow blocks are only created when manually expanding, not during drag/load.
     * @param {number} index The current input index.
     * @private
     */
    addInput_: function (index) {
        const inputName = 'ADD' + index;
        if (this.getInput(inputName)) return; // Prevent duplicate inputs

        const input = this.appendValueInput(inputName);
        input.setCheck(null);

        // Logic check: Only spawn new shadow blocks if this is a live user action
        // and NOT a re-rendering/dragging event (where recordUndo is usually false/null)
        const isLiveAction = Blockly.Events.isEnabled() && !this.workspace.isFlyout;

        if (isLiveAction && this.workspace) {
            const placeholderText = this.placeholders_[index] || "thing";
            const conn = input.connection;

            if (conn && !conn.targetConnection) {
                const shadowBlock = this.workspace.newBlock('text');
                shadowBlock.setShadow(true);
                if (shadowBlock.getField('TEXT')) {
                    shadowBlock.setFieldValue(placeholderText, 'TEXT');
                }
                shadowBlock.initSvg();
                shadowBlock.render();
                conn.connect(shadowBlock.outputConnection);
            }
        }
    },

    /**
     * Triggered by FieldExpandable buttons.
     */
    onExpandableButtonClicked_: function (isAdding) {
        Blockly.Events.setGroup(true);
        const oldMutation = Blockly.Xml.domToText(this.mutationToDom());

        if (isAdding) {
            // Logic for adding a new input
            this.addInput_(this.inputs_);
            this.inputs_++;
        } else {
            // Logic for removing the last input
            if (this.inputs_ > 0) {
                this.inputs_--;
                const inputName = 'ADD' + this.inputs_;
                const input = this.getInput(inputName);
                if (input && input.connection && input.connection.targetBlock()) {
                    const target = input.connection.targetBlock();
                    if (target.isShadow()) {
                        target.dispose();
                    }
                }
                this.removeInput(inputName);
            }
        }

        this.initSvg();
        this.render();

        const newMutation = Blockly.Xml.domToText(this.mutationToDom());
        Blockly.Events.fire(new Blockly.Events.BlockChange(this,
            'mutation', null, oldMutation, newMutation));
        Blockly.Events.setGroup(false);
    }
};