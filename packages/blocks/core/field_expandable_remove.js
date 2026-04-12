'use strict';

goog.provide('Blockly.FieldExpandableRemove');

goog.require('Blockly.Field');

/**
 * A simple text-based '-' button.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldAddMinus = function(opt_validator) {
  Blockly.FieldAddMinus.superClass_.constructor.call(this, '-', opt_validator);
};
goog.inherits(Blockly.FieldAddMinus, Blockly.Field);

Blockly.FieldAddMinus.fromJson = function(options) {
  return new Blockly.FieldAddMinus();
};

Blockly.FieldAddMinus.prototype.EDITABLE = true;
Blockly.FieldAddMinus.prototype.CURSOR = 'pointer';

/**
 * Override the click behavior for removal.
 */
Blockly.FieldAddMinus.prototype.showEditor_ = function() {
  if (this.sourceBlock_ && typeof this.sourceBlock_.onExpandableButtonClicked_ === 'function') {
    // Passing 'false' to indicate removal/reduction
    this.sourceBlock_.onExpandableButtonClicked_(false);
  }
};

Blockly.FieldAddMinus.prototype.init = function() {
    if (!this.backgroundRect_ && !this.textElement_) {
        Blockly.FieldAddMinus.superClass_.init.call(this);

        // 1. Constants for a square button
        const size = 24; 
        const padding = 6;

        // 2. Style the Text
        this.textElement_.style['font-weight'] = 'bold';
        this.textElement_.style['font-size'] = '14pt';
        this.textElement_.style['fill'] = '#ffffff';
        
        // Center the text manually within our box
        // (Adjust x/y slightly depending on your font rendering)
        this.textElement_.setAttribute('x', size / 2);
        this.textElement_.setAttribute('y', size / 2); 
        this.textElement_.setAttribute('text-anchor', 'middle');

        // 3. Create the Background "Box"
        this.backgroundRect_ = Blockly.utils.createSvgElement('rect', {
            'rx': 4, 
            'ry': 4,
            'x': 0,
            'y': 0,
            'width': size,
            'height': size,
            'stroke': '#00000022',
            'fill': 'transparent',
            'stroke-width': '1px',
            'cursor': 'pointer'
        }, null);

        // 4. Layering: Box goes behind text
        this.fieldGroup_.insertBefore(this.backgroundRect_, this.textElement_);
        
        // 5. Update the field's size so Blockly knows how much space to leave
        this.size_.width = size;
        this.size_.height = size;
    }
};

// Register as 'field_expandable_remove'
Blockly.Field.register('field_expandable_remove', Blockly.FieldAddMinus);