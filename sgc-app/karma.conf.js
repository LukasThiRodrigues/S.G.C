module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: false
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
        browsers: ['ChromeCI'],
        customLaunchers: {
            ChromeCI: {
                base: 'Chrome',
                flags: [
                    '--headless=new',
                    '--no-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-setuid-sandbox',
                    '--disable-software-rasterizer',
                    '--mute-audio'
                ]
            }
        },
        singleRun: true,
    });
};
