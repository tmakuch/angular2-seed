const webpackMerge = require('webpack-merge');
const commons = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const ngToolsWebpack = require('@ngtools/webpack');
const root = require('./helpers').root;
const path = require('path');

const isAot = process.env.AOT === 'true';

module.exports = webpackMerge(commons, {
    devtool: 'source-map',

    output: {
        path: root(isAot ? 'aot' : 'dist'),
        filename: '[name].[chunkhash].js',
        sourceMapFilename: '[file].map',
        chunkFilename: '[name].[chunkhash].chunk.js'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                }),
                include: [ root('src', 'styles') ]
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!less-loader'
                }),
                include: [ root('src', 'styles') ]
            }
        ]
    },
    plugins: [
        isAot ? new ngToolsWebpack.AotPlugin({
            tsConfigPath: './tsconfig.json',
            entryModule: path.join(__dirname, '..', '/src/app/app.module#AppModule')
        }) : null,
        new ExtractTextPlugin('[name].[contenthash].css'),
        new UglifyJsPlugin({
            // beautify: true, //debug
            // mangle: false, //debug
            // dead_code: false, //debug
            // unused: false, //debug
            // deadCode: false, //debug
            // compress: {
            //   screw_ie8: true,
            //   keep_fnames: true,
            //   drop_debugger: false,
            //   dead_code: false,
            //   unused: false
            // }, // debug
            // comments: true, //debug


            beautify: false, //prod
            output: {
                comments: false
            }, //prod
            mangle: {
                screw_ie8: true
            }, //prod
            compress: {
                screw_ie8: true,
                warnings: false,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
                negate_iife: false // we need this for lazy v8
            },
        }),
        new HashedModuleIdsPlugin(),
        new LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {
                htmlLoader: {
                    minimize: true,
                    removeAttributeQuotes: false,
                    caseSensitive: true,
                    customAttrSurround: [
                        [ /#/, /(?:)/ ],
                        [ /\*/, /(?:)/ ],
                        [ /\[?\(?/, /(?:)/ ]
                    ],
                    customAttrAssign: [ /\)?\]?=/ ]
                }
            }
        })
    ].filter(plugin => plugin !== null)
});
