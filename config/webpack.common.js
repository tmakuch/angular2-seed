const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const root = require('./helpers').root;
const isAot = process.env.AOT === 'true';
const isProd = process.env.NODE_ENV === 'prod';

module.exports = {
    entry: {
        'polyfills': './example/polyfills.ts',
        'main': isAot ? './example/main.aot.ts' : './example/main.ts'
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        modules: [
            root('example'),
            root('src'),
            root('node_modules')
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
                            configFileName: isProd ? 'config/ts/tsconfig.prod.json' : 'config/ts/tsconfig.dev.json'
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
                use: [ 'to-string-loader', 'css-loader' ],
                exclude: [ root('example', 'styles') ]
            },
            {
                test: /\.less$/,
                use: [ 'to-string-loader', 'css-loader', 'less-loader' ],
                exclude: [ root('example', 'styles') ]
            },
            {
                test: /\.html$/,
                use: 'raw-loader',
                exclude: [ root('example', 'index.html') ]
            },
            {
                test: /\.(jpg|png|gif|eot|woff2?|svg|ttf)$/,
                use: 'file-loader'
            }
        ],

    },
    plugins: [
        new CheckerPlugin(),
        new CommonsChunkPlugin({
            name: 'polyfills',
            chunks: [ 'polyfills' ]
        }),
        new ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            root('src')
        ),
        new HtmlWebpackPlugin({
            template: 'example/index.html',
            chunksSortMode: 'dependency',
            inject: 'body'
        })
    ]
};
