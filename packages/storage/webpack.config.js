const path = require('path');

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.[jt]s$/,
                loader: 'swc-loader',
                include: [
                    path.resolve(__dirname, 'src')
                ],
                options: {
                    jsc: {
                        target: 'es2022'
                    },
                    sourceMaps: process.env.NODE_ENV !== 'production'
                }
            },
            {
                test: /\.(png|svg|wav)$/,
                loader: 'arraybuffer-loader'
            }
        ]
    },
    plugins: []
};

module.exports = [
    // Web-compatible
    Object.assign({}, base, {
        target: 'web',
        entry: {
            'scratch-storage': './src/index.js',
            'scratch-storage.min': './src/index.js'
        },
        output: {
            library: 'ScratchStorage',
            libraryTarget: 'umd',
            path: path.resolve('dist', 'web'),
            filename: '[name].js'
        }
    }),

    // Node-compatible
    Object.assign({}, base, {
        target: 'node',
        entry: {
            'scratch-storage': './src/index.js'
        },
        output: {
            library: 'ScratchStorage',
            libraryTarget: 'commonjs2',
            path: path.resolve('dist', 'node'),
            filename: '[name].js'
        },
        externals: {
            'base64-js': true,
            'js-md5': true,
            'localforage': true,
            'text-encoding': true
        }
    })
];
