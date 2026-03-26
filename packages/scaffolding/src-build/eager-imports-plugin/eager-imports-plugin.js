// Plugin to modify webpack to interpret all dynamic import() as webpackMode: "eager"

const patchParser = (parser) => {
  const originalParseCommentOptions = parser.parseCommentOptions;
  if (!originalParseCommentOptions) return;
  parser.parseCommentOptions = function (...args) {
    const result = originalParseCommentOptions.call(this, ...args);
        if (result && result.options) {
      result.options.webpackMode = 'eager';
    }
    
    return result;
  };
};

const PLUGIN_NAME = 'EagerImportsPlugin';

class EagerImportsPlugin {
  apply (compiler) {
    compiler.hooks.normalModuleFactory.tap(PLUGIN_NAME, (normalModuleFactory) => {
      normalModuleFactory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, patchParser);
      normalModuleFactory.hooks.parser.for('javascript/dynamic').tap(PLUGIN_NAME, patchParser);
      normalModuleFactory.hooks.parser.for('javascript/esm').tap(PLUGIN_NAME, patchParser);
    });
  }
}

module.exports = EagerImportsPlugin;