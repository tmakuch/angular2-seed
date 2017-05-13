const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const helpers = require('./helpers');
const isAot = process.env.AOT === 'true';
const package = require('../package.json');

module.exports = {
    devtool: 'source-map',
    entry: {
        'main': './src/main.ts'
    },
    output: {
        filename: 'lib.js',
        path: helpers.root('lib'),
        library: 'lib.js',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        modules: [
            helpers.root('src'),
            helpers.root('node_modules')
        ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: isAot ? [
                    '@ngtools/webpack'
                ] : [
                    'ng-router-loader',
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: 'config/ts/tsconfig.lib.json'
                        },
                    },
                    'angular2-template-loader'
                ],
                exclude: [ /\.(spec|e2e)\.ts$/ ]
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.css$/,
                use: [ 'to-string-loader', 'css-loader' ]
            },
            {
                test: /\.less$/,
                use: [ 'to-string-loader', 'css-loader', 'less-loader' ]
            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            },
            {
                test: /\.(jpg|png|gif|eot|woff2?|svg|ttf)$/,
                use: 'file-loader'
            }
        ],

    },
    plugins: [
        new CheckerPlugin(),
        isAot ? new ngToolsWebpack.AotPlugin({
            tsConfigPath: './tsconfig.json',
            entryModule: path.join(__dirname, '..', '/example/app/app.module#AppModule')
        }) : null,
        new helpers.DtsBundlerPlugin(package.name, 'src/**/*.d.ts', '../lib/lib.d.ts'),
        new ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('src')
        ),
        // new UglifyJsPlugin({
        //     // beautify: true, //debug
        //     // mangle: false, //debug
        //     // dead_code: false, //debug
        //     // unused: false, //debug
        //     // deadCode: false, //debug
        //     // compress: {
        //     //   screw_ie8: true,
        //     //   keep_fnames: true,
        //     //   drop_debugger: false,
        //     //   dead_code: false,
        //     //   unused: false
        //     // }, // debug
        //     // comments: true, //debug
        //
        //
        //     beautify: false, //prod
        //     output: {
        //         comments: false
        //     }, //prod
        //     mangle: {
        //         screw_ie8: true
        //     }, //prod
        //     compress: {
        //         screw_ie8: true,
        //         warnings: false,
        //         conditionals: true,
        //         unused: true,
        //         comparisons: true,
        //         sequences: true,
        //         dead_code: true,
        //         evaluate: true,
        //         if_return: true,
        //         join_vars: true,
        //         negate_iife: false // we need this for lazy v8
        //     },
        // }),
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
};
