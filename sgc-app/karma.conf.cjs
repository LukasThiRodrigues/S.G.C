module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            require('karma-jasmine'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('karma-jsdom-launcher')
        ],

        client: {
            clearContext: false,
        },

        reporters: ['progress', 'kjhtml', 'coverage'],

        coverageReporter: {
            dir: require('path').join(__dirname, './coverage'),
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'lcov' },
                { type: 'text-summary' }
            ]
        },

        browsers: ['jsdom'],

        singleRun: true,
    });
};
