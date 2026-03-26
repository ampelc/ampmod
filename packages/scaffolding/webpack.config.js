const path = require('node:path');
const fs = require('node:fs');
const webpack = require('webpack');
const EagerImportsPlugin = require('./src-build/eager-imports-plugin/eager-imports-plugin.js');
const { SwcMinifyWebpackPlugin } = require('swc-minify-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const dist = path.resolve(__dirname, 'dist');
fs.rmSync(dist, {
  force: true,
  recursive: true
});

const makeScaffolding = ({withMusic}) => ({
  mode: isProduction ? 'production' : 'development',
  devtool: 'source-map',
  output: {
    library: 'Scaffolding',
    libraryTarget: 'umd',
    filename: '[name].js',
    path: dist
  },
  resolve: {
   fallback: {
      buffer: require.resolve("buffer/"),
   },
  },
  entry: withMusic ? {
    'scaffolding-with-music': './src/index.js'
  } : {
    'scaffolding-min': './src/index.js'
  },
  resolve: {
    alias: {
      'text-encoding$': path.resolve(__dirname, 'src-build/text-encoding'),
      'htmlparser2$': path.resolve(__dirname, 'src-build/htmlparser2'),
      'scratch-translate-extension-languages$': path.resolve(__dirname, 'src-build/scratch-translate-extension-languages/languages.json'),
      'scratch-parser$': path.resolve(__dirname, 'src-build/scratch-parser')
    }
  },
  optimization: {
   minimizer: [new SwcMinifyWebpackPlugin({compress: true, mangle: true, format: {comments: "some"}})]
  },
  module: {
    rules: [
      {
            test: /\.[jt]s$/,
            loader: 'swc-loader',
            options: {
               jsc: {
                  parser: {
                        syntax: 'typescript',
                        decorators: false,
                        dynamicImport: true
                  },
                  target: 'es2022'
               },
               sourceMaps: process.env.NODE_ENV !== 'production'
            }
      },
      {
        test: /scratch3_music[/\\]assets[/\\].*\.mp3$/i,
        use: [
          {
            loader: withMusic ? (
              path.resolve(__dirname, 'src-build', 'cjs-data-url-loader')
            ) : (
              path.resolve(__dirname, 'src-build', 'cjs-remote-music-asset-loader')
            )
          }
        ]
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
    }),
    new webpack.BannerPlugin({
      banner: `AmpMod Scaffolding (${withMusic ? 'with music' : 'min'}) | https://codeberg.org/ampmod/ampmod (MPL-2.0) | =^..^=`,
      entryOnly: true
    }),
    new EagerImportsPlugin(),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  resolveLoader: {
    modules: [
      // Replace worker-loader with our own modified version
      // path.resolve(__dirname, 'src-build', 'inline-worker-loader'),
      'node_modules',
    ],
  },
});

module.exports = [
  makeScaffolding({withMusic: false}),
  makeScaffolding({withMusic: true})
];
