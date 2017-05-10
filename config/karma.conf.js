module.exports = function (config) {
    const testWebpackConfig = require('./webpack.test.js');

    const configuration = {
        basePath: '',
        frameworks: [ 'jasmine' ],
        exclude: [],
        client: {
            captureConsole: false
        },
        files: [
            { pattern: './config/spec-bundle.js', watched: false },
            { pattern: './src/assets/**/*', watched: false, included: false, served: true, nocache: false }
        ],

        preprocessors: { './config/spec-bundle.js': [ 'coverage', 'webpack', 'sourcemap' ] },

        webpack: testWebpackConfig,

        coverageReporter: {
            type: 'in-memory'
        },

        remapCoverageReporter: {
            'text-summary': null,
            json: './coverage/coverage.json',
            html: './coverage/html'
        },

        webpackMiddleware: {
            noInfo: true,
            stats: {
                chunks: false
            }
        },
        reporters: [ 'dots', 'coverage', 'remap-coverage' ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_WARN,
        autoWatch: false,
        singleRun: true,
        browsers: [
            'Chrome'
        ]
    };

    config.set(configuration);
};
