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
            { pattern: './config/spec-bundle.js', watched: false }
        ],

        preprocessors: { './config/spec-bundle.js': [ 'coverage', 'webpack', 'sourcemap' ] },

        webpack: testWebpackConfig,

        coverageReporter: {
            type: 'in-memory'
        },

        webpackMiddleware: {
            noInfo: true,
            stats: {
                chunks: false
            }
        },
        reporters: [ 'dots', 'coverage' ],
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
