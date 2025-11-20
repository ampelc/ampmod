/* eslint-env node */
/* eslint-disable import/no-commonjs, import/no-nodejs-modules */

const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const monorepoPackageJson = require('../../package.json');

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { SwcMinifyWebpackPlugin } = require('swc-minify-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const STATIC_PATH = process.env.STATIC_PATH || '/static';
const {APP_NAME, APP_SLOGAN, APP_DESCRIPTION, APP_SOURCE} = require('@ampmod/branding');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const root = process.env.ROOT || '';
if (root.length > 0 && !root.endsWith('/')) {
    throw new Error('If ROOT is defined, it must have a trailing slash.');
}

if (process.env.ENABLE_SERVICE_WORKER) {
    console.warn(
        'amp: ENABLE_SERVICE_WORKER is deprecated as the service worker is now enabled by default. To disable the service worker, use DISABLE_SERVICE_WORKER instead.'
    );
}

const IS_CBP_BUILD = Boolean(process.env.IS_CBP_BUILD);
const htmlWebpackPluginCommon = {
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
    devServer: {
        static: { directory: path.resolve(__dirname, "build") },
        host: "0.0.0.0",
        compress: true,
        allowedHosts: "all",
        port: process.env.PORT || 8601,
        // allows ROUTING_STYLE=wildcard to work properly
        historyApiFallback: {
            rewrites: [
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
    output: {
        clean: !process.env.CI,
        library: "GUI",
        filename:
            process.env.NODE_ENV === "production"
                ? `js/${CACHE_EPOCH}/[name].[contenthash].js`
                : "js/[name].js",
        chunkFilename:
            process.env.NODE_ENV === 'production' ? `js/${CACHE_EPOCH}/[name].[contenthash].js` : 'js/[name].js',
        publicPath: root
    },
    resolve: {
        symlinks: false,
        extensions: [".jsx", ".js", ".ts", ".tsx"],
        fallback: {
            buffer: require.resolve("buffer/"),
        },
        alias: {
            'text-encoding$': path.resolve(__dirname, 'src/lib/tw-text-encoder'),
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
                        target: process.env.NODE_ENV === 'production' ? 'es2022' : 'esnext',
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
                resourceQuery: /^(?!basic$).*/,
                use: [
                    MiniCssExtractPlugin.loader,
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
                                    require('@csstools/postcss-bundler'),
                                ]
                            }
                        }
                    }
                ]
            },
            {
                // Static assets
                test: /\.(svg|png|wav|mp3|gif|jpg|woff2?|hex)$/,
                type: "asset",
                parser: { dataUrlCondition: { maxSize: 8 * 1024 } },
                generator: { filename: "static/assets/[name][hash][ext]" },
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
            chunks: "all",
            minSize: 10000,
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
        new webpack.DefinePlugin({
            "process.env.DEBUG": Boolean(process.env.DEBUG),
            "process.env.DISABLE_SERVICE_WORKER": JSON.stringify(
                process.env.DISABLE_SERVICE_WORKER || ""
            ),
            "process.env.ROOT": JSON.stringify(root),
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
                },
            ],
        }),
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
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
        entry: {
            'website': [
                './src/website/components/header/header.tsx',
                './src/website/components/footer/footer.tsx',
                './src/website/design.css'
            ],
            'editor': './src/playground/editor.jsx',
            'editor-desktop': './src/desktop/render-editor.jsx',
            'fullscreen': './src/playground/fullscreen.jsx',
            'embed': './src/playground/embed.jsx',
            'addon-settings': './src/playground/addon-settings.jsx',
            'credits': './src/website/credits/credits.jsx',
            'home': './src/website/home/home.jsx',
            'notfound': './src/website/not-found.ts',
            'minorpages': './src/website/minor-pages/render.tsx',
            'faq': './src/website/faq/faq.tsx',
            'examples-landing': './src/website/examples/examples.jsx'
        },
        output: {
            hashFunction: 'sha256',
            path: process.env.BUILD_TARGET === 'desktop' ? path.resolve(__dirname, 'src/desktop/dist-rendered') : path.resolve(__dirname, 'build')
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                minChunks: 1,
                minSize: 10000,
                maxSize: 2000000,
                maxInitialRequests: 8,
                cacheGroups: {
                    reactVendor: {
                        test: /node_modules[\\/](react|react-dom|react-modal|react-intl)/,
                        name: 'react-libs',
                        chunks: 'all',
                        priority: 20
                    },
                    examples: {
                        test: /[\\/]src[\\/]lib[\\/]examples[\\/]/,
                        name: 'examples',
                        priority: 50,
                        reuseExistingChunk: true
                    },
                    sharedEditor: {
                        test: /[\\/]src[\\/]playground[\\/]/,
                        name: 'ampmod-ide',
                        chunks: chunk => ['editor','fullscreen','embed'].includes(chunk.name),
                        minChunks: 2,
                        priority: 35,
                        reuseExistingChunk: true
                    },
                    stylesEditor: {
                        name: 'common-editor',
                        type: 'css/mini-extract',
                        chunks: chunk => ['editor', 'fullscreen', 'embed'].includes(chunk.name),
                        enforce: true,
                        minChunks: 2
                    },
                    stylesWebsite: {
                        name: 'common-website',
                        type: 'css/mini-extract',
                        chunks: chunk =>
                            ['home', 'minorpages', 'faq', 'examples-landing', 'credits', 'notfound'].includes(chunk.name),
                        enforce: true,
                        minChunks: 2
                    },
                    stylesGlobal: {
                        name: 'common',
                        type: 'css/mini-extract',
                        chunks: 'all',
                        enforce: true,
                        minChunks: 4
                    }
                }
            },
            minimizer: [new SwcMinifyWebpackPlugin({compress: true, mangle: true, format: {comments: "some"}})]
        },
        stats:
            process.env.NODE_ENV === 'production'
                ? 'errors-only'
                : {
                      chunks: true,
                      chunkModules: false,
                      chunkOrigins: false,
                      colors: true
                  },
        plugins: base.plugins.concat([
            ...process.env.BUILD_TARGET === "desktop" || process.env.NODE_ENV !== "production" ? [
                new HtmlWebpackPlugin({
                    chunks: ["editor-desktop"],
                    template: "src/playground/simple.ejs",
                    filename:
                        'editor-desktop.html',
                    title: APP_NAME,
                    ...htmlWebpackPluginCommon
                }),
            ] : [],
            new HtmlWebpackPlugin({
                chunks: ['info', 'minorpages'],
                title: `Privacy Policy - ${APP_NAME}`,
                template: 'src/playground/simple.ejs',
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
                chunks: ['editor'],
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
                          chunks: ['info', 'home'],
                          template: 'src/playground/simple.ejs',
                          filename: 'index.html',
                          title: `${APP_NAME} - ${APP_SLOGAN}`,
                          description: APP_DESCRIPTION,
                          ...htmlWebpackPluginCommon
                      })
                  ]
                : []),
            new HtmlWebpackPlugin({
                chunks: ['info', 'minorpages'],
                template: 'src/playground/simple.ejs',
                filename: 'new-compiler.html',
                title: `New compiler - ${APP_NAME}`,
                // prettier-ignore
                 
                description: `${APP_NAME} 0.3 includes a rewritten compiler to make projects run up to 2 times faster than in ${APP_NAME} 0.2.2.`,
                page: 'newcompiler',
                ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['info', 'examples-landing'],
                template: 'src/playground/simple.ejs',
                filename: 'examples.html',
                title: `Examples - ${APP_NAME}`,
                // prettier-ignore
                 
                description: `Example projects for ${APP_NAME}.`,
                ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['info', 'faq'],
                template: 'src/playground/simple.ejs',
                filename: 'faq.html',
                title: `FAQ - ${APP_NAME}`,
                // prettier-ignore
                 
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
                chunks: ['info', 'credits'],
                template: 'src/playground/simple.ejs',
                filename: 'credits.html',
                title: `Credits - ${APP_NAME}`,
                description: `Meet the development team of ${APP_NAME}.`,
                ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['notfound'],
                template: 'src/playground/simple.ejs',
                filename: '404.html',
                title: `Not Found - ${APP_NAME}`,
                ...htmlWebpackPluginCommon
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'static',
                        to: ''
                    }
                ]
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "extensions/**",
                        to: "static",
                        context: "src/examples",
                    },
                ],
            }),
        ]),
    }),
].concat(
    process.env.BUILD_MODE === 'standalone'
        ? merge(base, {
              target: 'web',
              mode: 'production',
              devtool: false,
              entry: {
                  'standalone': ['./src/playground/amp-standalone-handler.jsx']
              },
              output: {
                  library: 'AmpModStandalone',
                  libraryTarget: 'umd',
                  filename: '[name].js',
                  chunkFilename: '[name].js',
                  path: path.resolve('standalone'),
                  publicPath: `${STATIC_PATH}/`
              },
              optimization: {
                  splitChunks: false,
                  runtimeChunk: false,
                  usedExports: true,
                  sideEffects: true,
                  concatenateModules: true,
                  minimize: true,
              },
              module: {
                  rules: [
                      base.module.rules[0],
                      base.module.rules[1],
                      {
                          test: /\.(svg|png|wav|mp3|gif|jpg|woff2?)$/,
                          type: 'asset/inline',
                      },
                      base.module.rules[3],
                      base.module.rules[4],
                  ]
              },
              plugins: base.plugins.concat([
                  new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
                  new HtmlWebpackPlugin({
                      chunks: ['standalone'],
                      template: 'src/playground/simple.ejs',
                      filename: `AmpMod-Standalone-${monorepoPackageJson.version}-EXPERIMENTAL.html`,
                      title: `${APP_NAME} - ${APP_SLOGAN}`,
                      isEditor: true,
                      inject: 'body',
                      ...htmlWebpackPluginCommon
                  }),
                  new HtmlInlineScriptPlugin({ scriptMatchPattern: [/./] })
              ])
          })
        : []
);
