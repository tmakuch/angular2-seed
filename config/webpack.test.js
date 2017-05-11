const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

const root = require('./helpers').root;

process.env.ENV = process.env.NODE_ENV = 'test';

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: [ '.ts', '.js' ],
        modules: [
            root('example'),
            'node_modules'
        ]
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    root('node_modules/rxjs'),
                    root('node_modules/@angular')
                ]
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        query: {
                            sourceMap: false,
                            inlineSourceMap: true,
                            compilerOptions: {
                                removeComments: true
                            }
                        },
                    },
                    'angular2-template-loader'
                ],
                exclude: [ /\.e2e\.ts$/ ]
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: [ root('example/index.html') ]
            },
            {
                test: /\.css$/,
                loader: [ 'to-string-loader', 'css-loader' ],
                exclude: [ root('example', 'index.html') ]
            },
            {
                test: /\.less$/,
                loader: [ 'to-string-loader', 'css-loader', 'less-loader'  ],
                exclude: [ root('example', 'index.html') ]
            },
            {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: [ root('example', 'index.html') ]
            }
        ]
    },

    plugins: [
        new ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            root('example')
        ),
        new LoaderOptionsPlugin({
            debug: false
        })
    ],

    performance: {
        hints: false
    }
};
