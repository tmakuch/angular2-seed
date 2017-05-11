const webpackMerge = require('webpack-merge');
const commons = require('./webpack.common.js');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const root = require('./helpers').root;

module.exports = webpackMerge(commons, {
    devtool: 'cheap-module-source-map',

    output: {
        path: root('dist'),
        filename: '[name].js',
        sourceMapFilename: '[file].map',
        chunkFilename: '[id].chunk.js',

        library: 'lib.js',
        libraryTarget: 'umd',
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ],
                include: [ root('src', 'styles') ]
            },
            {
                test: /\.less$/,
                use: [ 'style-loader', 'css-loader', 'less-loader' ],
                include: [ root('src', 'styles') ]
            }
        ]
    },

    plugins: [
        new LoaderOptionsPlugin({
            debug: true,
            options: {}
        })
    ],

    devServer: {
        port: '3000',
        host: '0.0.0.0',
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    }
});
