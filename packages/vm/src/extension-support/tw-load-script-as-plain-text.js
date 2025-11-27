import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin.js';
export const pitch = function (request) {
    // Technically this loader does work in other environments, but our use case does not want that.
    if (this.target !== 'web') {
        return 'throw new Error("Not supported in non-web environment");';
    }
    this.cacheable(false);
    const callback = this.async();
    const compiler = this._compilation.createChildCompiler('extension-worker', {});
    compiler.options.target = 'webworker';
    new SingleEntryPlugin(this.context, `!!${request}`, 'extension-worker').apply(compiler);
    compiler.runAsChild((err, entries, compilation) => {
        if (err) {
            return callback(err);
        }
        const file = entries[0].files[0];
        const source = `module.exports = ${JSON.stringify(compilation.assets[file].source())};`;
        return callback(null, source);
    });
};
