module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage')
        ],

        client: {
            jasmine: {},
            clearContext: false
        },

        browsers: ['ChromeHeadlessCI'],

        customLaunchers: {
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--no-zygote'
                ]
            }
        },

        reporters: ['progress', 'kjhtml'],
        singleRun: true,
        restartOnFileChange: false
    });
};
