const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const root = require('./helpers').root;
const isAot = process.env.AOT === 'true';
const isProd = process.env.NODE_ENV === 'prod';

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'main': isAot ? './src/main.aot.ts' : './src/main.ts'
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        modules: [
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
                exclude: [ root('src', 'styles') ]
            },
            {
                test: /\.less$/,
                use: [ 'to-string-loader', 'css-loader', 'less-loader' ],
                exclude: [ root('src', 'styles') ]
            },
            {
                test: /\.html$/,
                use: 'raw-loader',
                exclude: [ root('src', 'index.html') ]
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
            template: 'src/index.html',
            chunksSortMode: 'dependency',
            inject: 'body'
        })
    ]
};
