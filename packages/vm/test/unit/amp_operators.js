const test = require('tap').test;
const Operators = require('../../src/blocks/scratch3_operators');

const blocks = new Operators({
    runtimeOptions: {
        caseSensitivity: false
    }
});
const sensitiveBlocks = new Operators({
    runtimeOptions: {
        caseSensitivity: true
    }
});

test('exponent', t => {
    t.strictEqual(blocks.exponent({NUM1: '2', NUM2: '4'}), 16);
    t.end();
});

test('equals - case sensitive', t => {
    t.strictEqual(blocks.equals({OPERAND1: 'a', OPERAND2: 'A'}), true);
    t.strictEqual(sensitiveBlocks.equals({OPERAND1: 'a', OPERAND2: 'A'}), false);
    t.end();
});

test('new line', t => {
    t.strictEqual(blocks.newline(), "\n");
    t.end();
});
