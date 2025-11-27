const test = require('tap').test;
const cast = require('../../src/util/cast');

test('toList', t => {
    t.same(cast.toList(), []);
    t.same(cast.toList(1), [1]);
    t.same(cast.toList('Chicken'), ['Chicken']);
    t.same(cast.toList(['Chicken']), ['Chicken']);
    t.end();
});
