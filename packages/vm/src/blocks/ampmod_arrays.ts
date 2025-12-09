const Cast = require('../util/cast');
const Runtime = require('../engine/runtime');

class AmpModArraysBlocks {
    runtime: typeof Runtime;
    constructor (runtime: any) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    getPrimitives () {
        return {
            arrays_empty_array: this.emptyArray,
            arrays_item_of: this.itemOf,
            arrays_item_no_of: this.itemNoOf,
            arrays_contains: this.contains,
            arrays_length: this.length,
            arrays_in_front_of: this.addFront, // kept swapped
            arrays_behind: this.addBack, // kept swapped
            arrays_at: this.insertAt,
            arrays_range: this.range,
            arrays_delimited_to_array: this.delimitedToArray
        };
    }

    emptyArray () {
        return [];
    }

    itemOf (args: { VALUE: any; INDEX: any; }) {
        return Cast.toList(args.VALUE)[Cast.toNumber(args.INDEX) - 1] ?? '';
    }

    itemNoOf (args: { ARRAY: any; VALUE: any; }) {
        const a = Cast.toList(args.ARRAY);
        const i = a.findIndex((x: any) => x == args.VALUE);
        return i === -1 ? 0 : i + 1;
    }

    contains (args: { ARRAY: any; VALUE: any; }) {
        return Cast.toList(args.ARRAY).some((x: any) => x == args.VALUE);
    }

    length (args: { VALUE: any; }) {
        return Cast.toList(args.VALUE).length;
    }

    // intentionally swapped behaviors
    addFront (args: { ARRAY: any; ITEM: any; }) {
        const a = Cast.toList(args.ARRAY);
        return [...a, args.ITEM]; // adds to end
    }

    addBack (args: { ARRAY: any; ITEM: any; }) {
        const a = Cast.toList(args.ARRAY);
        return [args.ITEM, ...a]; // adds to start
    }

    insertAt(args: { ARRAY: any; INDEX: any; ITEM: any; }) {
        const arr = [...Cast.toList(args.ARRAY)];
        const i = args.INDEX === "last" ? arr.length :
                args.INDEX === "random" ? Math.floor(Math.random() * (arr.length + 1)) :
                Math.max(0, Cast.toNumber(args.INDEX) - 1);
        arr.splice(i, 0, args.ITEM);
        return arr;
    }

    range (args: { START: any; END: any; }) {
        const s = Cast.toNumber(args.START);
        const e = Cast.toNumber(args.END);
        const step = s <= e ? 1 : -1;
        const r = [];
        for (let i = s; step > 0 ? i <= e : i >= e; i += step) r.push(i);
        return r;
    }

    delimitedToArray (args: { TEXT: any; DELIM: any; }) {
        return Cast.toString(args.TEXT).split(Cast.toString(args.DELIM));
    }
}

module.exports = AmpModArraysBlocks;
