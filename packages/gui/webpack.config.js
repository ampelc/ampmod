/* eslint-env node */
/* eslint-disable import/no-commonjs, import/no-nodejs-modules */

const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const monorepoPackageJson = require('../../package.json');
const svgToMiniDataURI = require('mini-svg-data-uri');

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { SwcMinifyWebpackPlugin } = require('swc-minify-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');

const STATIC_PATH = process.env.STATIC_PATH || '/static';
const {APP_NAME, APP_SLOGAN, APP_DESCRIPTION, APP_SOURCE} = require('@ampmod/branding');

const root = process.env.ROOT || '';
if (root.length > 0 && !root.endsWith('/')) {
    throw new Error('If ROOT is defined, it must have a trailing slash.');
}

const IS_CBP_BUILD = Boolean(process.env.IS_CBP_BUILD);
const htmlWebpackPluginCommon = {
    scriptLoading: process.env.BUILD_MODE === 'standalone' ? 'defer' : 'module',
    root: root,
    meta: JSON.parse(process.env.EXTRA_META || '{}'),
    APP_NAME,
    isCbp: process.env.IS_CBP_BUILD || false,
    NODE_ENV: process.env.NODE_ENV,
    BUILD_MODE: process.env.BUILD_MODE,
    DEBUG: Boolean(process.env.DEBUG),
    ROUTING_STYLE: process.env.ROUTING_STYLE || "filehash",
    ampmod_version: monorepoPackageJson.version,
    ampmod_mode: process.env.BUILD_MODE,
    LAB_EXPERIMENT_NAME: process.env.LAB_EXPERIMENT_NAME || "default",
    LAB_EXPERIMENT_NAME_FULL:
        process.env.LAB_EXPERIMENT_NAME_FULL || "AmpMod Lab",
    minify:
        process.env.NODE_ENV === 'production'
            ? {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true
              }
            : false
};

// When this changes, the path for all JS files will change, bypassing any HTTP caches
const CACHE_EPOCH = `amp-${monorepoPackageJson.version}`;

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: process.env.SOURCEMAP || (process.env.NODE_ENV === 'production' ? false : 'source-map'),
    cache: { type: 'filesystem' },
    devServer: {
        static: { directory: path.resolve(__dirname, "build") },
        host: "0.0.0.0",
        compress: true,
        port: process.env.PORT || 8601,
        // allows ROUTING_STYLE=wildcard to work properly
        historyApiFallback: {
            rewrites: process.env.SPA ? [ {from: /./, to: '/index.html'} ] : [
                {from: /^\/\d+\/?$/, to: '/index.html'},
                {
                    from: /^\/\d+\/fullscreen\/?$/,
                    to: '/fullscreen/index.html'
                },
                {from: /^\/\d+\/editor\/?$/, to: '/editor.html'},
                {from: /^\/\d+\/embed\/?$/, to: '/embed.html'},
                {from: /^\/addons\/?$/, to: '/addons.html'},
                {from: /^\/new-compiler\/?$/, to: '/new-compiler.html'},
                {from: /^\/examples\/?$/, to: '/examples.html'},
                {from: /./, to: '/404.html'}
            ]
        },
        client: {
            overlay: false,
        }
    },
    experiments: {
        futureDefaults: true,
        css: false, // for now
        outputModule: process.env.BUILD_MODE !== 'standalone',
    },
    output: {
        clean: !process.env.CI,
        filename:
            process.env.NODE_ENV === "production"
                ? `js/${CACHE_EPOCH}/[name].[contenthash].js`
                : "js/[name].js",
        chunkFilename:
            process.env.NODE_ENV === 'production' ? `js/${CACHE_EPOCH}/[name].[contenthash].js` : 'js/[name].js',
        publicPath: root,
        module: process.env.BUILD_MODE !== 'standalone'
    },
    resolve: {
        symlinks: false,
        extensions: [".jsx", ".js", ".ts", ".tsx"],
        fallback: {
            buffer: require.resolve("buffer/"),
        },
        alias: {
            'react': path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
            'scratch-render-fonts$': path.resolve(__dirname, 'src/lib/tw-scratch-render-fonts'),
            '@ampmod/branding$': path.resolve(__dirname, 'src/lib/amp-intercept-branding'),
            'real-branding$': path.resolve(__dirname, '../branding'),
            'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
            'react/jsx-runtime': 'react/jsx-runtime.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                loader: 'swc-loader',
                include: [
                    path.resolve(__dirname, 'src'),
                    /node_modules[\\/]scratch-[^\\/]+[\\/]src/
                ],
                options: {
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                            tsx: true,
                            decorators: false,
                            dynamicImport: true
                        },
                        target: (process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'standalone') ? 'es2022' : 'esnext',
                        transform: {
                            react: {
                                pragma: 'React.createElement',
                                pragmaFrag: 'React.Fragment',
                                throwIfNamespace: true,
                                development: process.env.NODE_ENV !== 'production',
                                refresh: process.env.NODE_ENV !== 'production',
                                useBuiltins: true
                            }
                        }
                    },
                    sourceMaps: process.env.NODE_ENV !== 'production'
                }
            },
            {
                test: /\.css$/i,
                resourceQuery: {
                    not: [/^\?basic$/, /^\?addon-style$/]
                },
                use: [
                    process.env.BUILD_MODE === 'standalone' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                namedExport: false,
                                localIdentName: '[name]_[local]_[hash:base64:5]',
                                exportLocalsConvention: 'camelCaseOnly'
                            },
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('postcss-import'),
                                    require('postcss-simple-vars'),
                                    require('postcss-nesting'),
                                    require('postcss-preset-env'),
                                    ...(process.env.NODE_ENV === 'production'
                                        ? [require('cssnano')({ preset: 'default' })]
                                        : []),
                                    // require('@csstools/postcss-bundler'),
                                ]
                            }
                        }
                    }
                ]
            },
            {
                resourceQuery: /addon-style/,
                use: [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    // we only want to minify
                                    ...(process.env.NODE_ENV === 'production'
                                        ? [require('cssnano')({ preset: 'default' })]
                                        : []),
                                ]
                            }
                        }
                    }
                ]
            },
            // Static assets
            ...(process.env.BUILD_MODE === 'standalone' ? [{
                test: /\.(png|wav|mp3|gif|jpg|ico|woff2)$/,
                type: "asset/inline",
            }, {
                test: /\.svg$/,
                type: "asset/inline",
                generator: {
                  dataUrl: content => {
                    content = content.toString();
                    return svgToMiniDataURI(content);
                  },
                },
            }] : [{
                test: /\.(png|wav|mp3|gif|jpg|ico|woff2?|hex)$/,
                type: "asset",
                parser: { dataUrlCondition: { maxSize: 8 * 1024 } },
                generator: { filename: "static/assets/[hash][ext]" },
            }, {
                test: /\.svg$/,
                type: "asset",
                parser: { dataUrlCondition: { maxSize: 10 * 1024 } },
                generator: {
                  filename: "static/assets/[hash].svg",
                  dataUrl: content => {
                    content = content.toString();
                    return svgToMiniDataURI(content);
                  },
                },
            }]),
            {
                // Static assets
                test: /\.(sb3|apz)$/,
                type: "asset/resource",
                generator: { filename: "static/projects/[name].[hash][ext]" },
            },
            {
                resourceQuery: /raw/,
                type: 'asset/source',
            },
            {
                resourceQuery: /bytes/,
                type: 'asset/bytes',
            }
        ]
    },
    optimization: {
        moduleIds: "deterministic",
        chunkIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
            chunks: process.env.SPA ? "async" : "all",
            minSize: 20000,
            minChunks: 1,
            maxInitialRequests: 3,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
        emitOnErrors: true,
    },
    plugins: [
        ...(process.env.BUILD_MODE !== 'standalone' ? [
            new MiniCssExtractPlugin({
                filename:
                    process.env.NODE_ENV === 'production'
                        ? `css/${CACHE_EPOCH}/[name].[contenthash].css`
                        : 'css/[name].css',
                chunkFilename:
                    process.env.NODE_ENV === 'production'
                        ? `css/${CACHE_EPOCH}/[name].[contenthash].css`
                        : 'css/[id].css',
                ignoreOrder: true,
                runtime: true,
            })
        ] : []),
        new webpack.DefinePlugin({
            "global": "globalThis",
            "process.env.DEBUG": Boolean(process.env.DEBUG),
            "process.env.ROOT": JSON.stringify(root),
            "process.env.AW3": Boolean(process.env.AW3),
            "process.env.SPA": Boolean(process.env.SPA),
            "process.env.ROUTING_STYLE": JSON.stringify(
                process.env.ROUTING_STYLE || "filehash"
            ),
            "process.env.ampmod_version": JSON.stringify(
                monorepoPackageJson.version
            ),
            "process.env.ampmod_mode": JSON.stringify(process.env.BUILD_MODE),
            "process.env.ampmod_is_cbp": Boolean(process.env.IS_CBP_BUILD),
            "process.env.ampmod_lab_experiment_name": JSON.stringify(
                process.env.LAB_EXPERIMENT_NAME || "default"
            ),
            "process.env.ampmod_lab_experiment_name_full": JSON.stringify(
                process.env.LAB_EXPERIMENT_NAME_FULL || "AmpMod Lab"
            ),
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "../blocks/media", to: "static/blocks-media/default" },
                {
                    from: '../blocks/media',
                    to: 'static/blocks-media/high-contrast'
                },
                {
                    from: 'src/lib/themes/blocks/high-contrast-media/blocks-media',
                    to: 'static/blocks-media/high-contrast',
                    force: true
                },
                { from: "../blocks/media", to: "static/blocks-media/dark" },
                {
                    from: "src/lib/themes/blocks/dark-media/blocks-media",
                    to: "static/blocks-media/dark",
                    force: true,
                }
            ],
        }),
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
    ],
};

if (!process.env.CI) {
    base.plugins.push(new webpack.ProgressPlugin());
}
if (process.env.NODE_ENV !== "production") {
    base.plugins.push(new ReactRefreshWebpackPlugin({overlay: false}));
}

module.exports = [
    // to run editor examples
    merge(base, {
        entry: process.env.SPA ? {
            'main':  './src/playground/amp-spa.tsx',
            'service-worker-extra': './src/playground/service-worker.js',
        } : {
            'website': [
                './src/website/components/header/header.tsx',
                './src/website/components/footer/footer.tsx',
                './src/website/design.css'
            ],
            'editor': './src/playground/editor.jsx',
            'player': './src/playground/player.jsx',
            'fullscreen': './src/playground/fullscreen.jsx',
            'embed': './src/playground/embed.jsx',
            'addon-settings': './src/playground/addon-settings.jsx',
            'credits': './src/website/credits/credits.jsx',
            'home': './src/website/home/home.jsx',
            'notfound': './src/website/not-found.ts',
            'minorpages': './src/website/minor-pages/render.tsx',
            'faq': './src/website/faq/faq.tsx',
            'examples-landing': './src/website/examples/examples.jsx',
            'service-worker-extra': './src/playground/service-worker.js',
        },
        output: {
            hashFunction: 'sha256',
            path: path.resolve(__dirname, 'build')
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                minChunks: 1,
                minSize: 500 * 1024,
                maxSize: 10 * 1024 * 1024,
                maxInitialRequests: 12,
            },
            minimizer: [new SwcMinifyWebpackPlugin({compress: true, mangle: true, format: {comments: "some"}})]
        },
        stats: {
            preset: process.env.STATS ?? 'summary',
            errorDetails: true
        },
        plugins: base.plugins.concat([
            ...(process.env.SPA
                ? [
                    new HtmlWebpackPlugin({
                        chunks: ['main'],
                        template: 'src/playground/index.ejs',
                        filename: 'index.html',
                        title: `${APP_NAME} - ${APP_SLOGAN}`,
                        ...htmlWebpackPluginCommon
                    })
                ]
                : [
                    new HtmlWebpackPlugin({
                        chunks: ['info', 'minorpages'],
                        title: `Privacy Policy - ${APP_NAME}`,
                        template: 'src/playground/index.ejs',
                        filename: 'privacy.html',
                        skipSimpleAnalytics: true,
                        page: 'privacy',
                        ...htmlWebpackPluginCommon
                    }),
                    new HtmlWebpackPlugin({
                        chunks: ["editor"],
                        template: "src/playground/index.ejs",
                        filename:
                            process.env.BUILD_MODE === "lab"
                                ? "index.html"
                                : "editor.html",
                        title: `${APP_NAME} - ${APP_SLOGAN}`,
                        isEditor: true,
                        ...htmlWebpackPluginCommon
                    }),
                    new HtmlWebpackPlugin({
                        chunks: ['player'],
                        template: 'src/playground/index.ejs',
                        filename: 'player.html',
                        title: `${APP_NAME} - ${APP_SLOGAN}`,
                        isEditor: true,
                        ...htmlWebpackPluginCommon
                    }),
                    new HtmlWebpackPlugin({
                        chunks: ['fullscreen'],
                        template: 'src/playground/index.ejs',
                        filename: 'fullscreen.html',
                        title: `${APP_NAME} - ${APP_SLOGAN}`,
                        ...htmlWebpackPluginCommon
                    }),
                    new HtmlWebpackPlugin({
                        chunks: ['embed'],
                        template: 'src/playground/embed.ejs',
                        filename: 'embed.html',
                        title: `Embedded Project - ${APP_NAME}`,
                        ...htmlWebpackPluginCommon
                    }),
                    ...(process.env.BUILD_MODE !== 'lab'
                        ? [
                                new HtmlWebpackPlugin({
                                    chunks: ['website', 'home'],
                                    template: 'src/playground/index.ejs',
                                    filename: 'index.html',
                                    title: `${APP_NAME} - ${APP_SLOGAN}`,
                                    description: APP_DESCRIPTION,
                                    ...htmlWebpackPluginCommon
                                })
                            ]
                        : []),
                    new HtmlWebpackPlugin({
                        chunks: ['website', 'minorpages'],
                        template: 'src/playground/index.ejs',
                        filename: 'new-compiler.html',
                        title: `New compiler - ${APP_NAME}`,
                        description: `${APP_NAME} 0.3 includes a rewritten compiler to make projects run up to 2 times faster than in ${APP_NAME} 0.2.2.`,
                        page: 'newcompiler',
                        ...htmlWebpackPluginCommon
                    }),
                    new HtmlWebpackPlugin({
                        chunks: ['website', 'examples-landing'],
                        template: 'src/playground/index.ejs',
                        filename: 'examples.html',
                        title: `Examples - ${APP_NAME}`,
                        description: `Example projects for ${APP_NAME}.`,
                        ...htmlWebpackPluginCommon
                    }),
                    new HtmlWebpackPlugin({
                        chunks: ['website', 'faq'],
                        template: 'src/playground/index.ejs',
                        filename: 'faq.html',
                        title: `FAQ - ${APP_NAME}`,
                        description: `Frequently asked questions about ${APP_NAME}.`,
                        ...htmlWebpackPluginCommon
                    }),
                    new HtmlWebpackPlugin({
                        chunks: ['addon-settings'],
                        template: 'src/playground/index.ejs',
                        filename: 'addons.html',
                        title: `Addon Settings - ${APP_NAME}`,
                        ...htmlWebpackPluginCommon
                    }),
                    new HtmlWebpackPlugin({
                        chunks: ['website', 'credits'],
                        template: 'src/playground/index.ejs',
                        filename: 'credits.html',
                        title: `Credits - ${APP_NAME}`,
                        description: `Meet the development team of ${APP_NAME}.`,
                        ...htmlWebpackPluginCommon
                    }),
                    new HtmlWebpackPlugin({
                        chunks: ['notfound'],
                        template: 'src/playground/index.ejs',
                        filename: '404.html',
                        title: `Not Found - ${APP_NAME}`,
                        ...htmlWebpackPluginCommon
                    }),
                ]),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'static',
                        to: ''
                    },
                  ...(process.env.IS_CBP_BUILD ? [{ from: "./static-prod", to: ""}] : [])
                ]
            }),
            ...(process.env.NODE_ENV === "production" || process.env.ENABLE_SERVICE_WORKER)
               && !process.env.BUILD_MODE === 'standalone' ? [
                new WorkboxPlugin.GenerateSW({
                    // these options encourage the ServiceWorkers to get in there fast
                    // and not allow any straggling "old" SWs to hang around
                    clientsClaim: true,
                    skipWaiting: true,
                    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
                    excludeChunks: [
                        // website pages
                        'examples-landing',
                        'faq',
                        'credits',
                        'home',
                        'embed',
                        'notfound', // used in MPA
                        'minorpages', // used in MPA
                        'page-new-compiler', // used in SPA
                        'page-privacy', // used in SPA
                        'extension-gdxfor', // what the heck is a gdxfor (i know but barely anyone uses this)
                        // bunch of obscure LEGO stuff
                        'extension-ev3',
                        'extension-boost',
                        'extension-wedo2',
                        // people seem to use microbit on scratch so not including that unless nobody uses that over here
                    ],
                    exclude: [
                        /images\/seo\/.*/, // SEO stuff
                        /.*\.map$/, // source maps
                        /^robots\.txt$/, // no use outside of the internet
                        /\.woff$/, // old font format
                        /\/static\/blocks-media\/.*\/icons\/(control_(forever|wait)|event_.*|set\-led.*|wedo.*)/ // unused
                    ],
                    importScriptsViaChunks: ['service-worker-extra'],
                }),
            ] : []
        ]),
    }),
].concat(
    process.env.BUILD_MODE === 'standalone'
        ? merge(base, {
              target: 'web',
              mode: 'production',
              devtool: false,
              entry: {standalone: './src/playground/amp-standalone-handler.jsx'},
              output: {
                  filename: '[name].js',
                  chunkFilename: '[name].js',
                  path: path.resolve('standalone'),
              },
              optimization: {
                  splitChunks: false,
                  runtimeChunk: false,
                  usedExports: true,
                  sideEffects: true,
                  concatenateModules: true,
                  minimize: true,
                  minimizer: [new SwcMinifyWebpackPlugin({ compress: { passes: 3, unsafe: true } })]
              },
              plugins: base.plugins.concat([
                  new webpack.IgnorePlugin({
                    resourceRegExp: /\.woff$/,
                  }),
                  new ImageMinimizerPlugin({
                    minimizer: {
                      implementation: ImageMinimizerPlugin.imageminMinify,
                      options: {
                        plugins: [
                          // these don't work
                          // ["gifsicle", { interlaced: true, optimizationLevel: 3, colors: 64 }],  
                          // ["mozjpeg", { quality: 50, progressive: true }],
                          // ["pngquant", { quality: [0.5, 0.7], speed: 1 }],

                          [
                            "svgo",
                            {
                              plugins: [
                                {
                                  name: "preset-default",
                                  params: {
                                    overrides: {
                                      removeViewBox: false,
                                      removeComments: true,
                                      removeMetadata: true,
                                      removeDesc: true,
                                      removeTitle: true,
                                      convertPathData: {
                                        floatPrecision: 2
                                      },
                                      convertTransform: {
                                        floatPrecision: 2
                                      },
                                      cleanupNumericValues: {
                                        floatPrecision: 2
                                      }
                                    },
                                  },
                                },
                              ],
                            },
                          ],
                        ],
                      },
                    },
                  }),
                  new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
                  new webpack.BannerPlugin({
                    banner: `AmpMod ${monorepoPackageJson.version} Standalone | GPL-3.0: https://codeberg.org/ampmod/ampmod | =^..^=`,
                    entryOnly: true,
                  }),
                  new HtmlWebpackPlugin({
                      chunks: ['standalone'],
                  	  template: "src/playground/index.ejs",
                      filename: `AmpMod-Standalone-${monorepoPackageJson.version}-EXPERIMENTAL.html`,
                      title: `${APP_NAME} - ${APP_SLOGAN}`,
                      inject: 'body',
                      ...htmlWebpackPluginCommon
                  }),
                  new HtmlInlineScriptPlugin({ scriptMatchPattern: [/./] })
              ])
          })
        : []
);
