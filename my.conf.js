// Karma configuration
// Generated on Tue Jan 26 2016 18:34:32 GMT+0530 (IST)

module.exports = function(config) {
  if(process.env.TRAVIS) {
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
      console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
      process.exit(1)
    }
  }
  var configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'detectBrowsers'],


    // list of files / patterns to load in the browser
    files: [
      "src/jsObjectAnimation.js",
      "src/jsobject.js",
      "src/*.Spec.js",
      "node_modules/jasmine-ajax/lib/mock-ajax.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'dots', 'coverage', 'saucelabs'],

    preprocessors: {
      'src/jsObjectAnimation.js': ['coverage'],
      'src/jsobject.js': ['coverage']
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    sauceLabs: {
      testName: 'Karma and Sauce',
      recordScreenshots: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    },
    captureTimeout: 120000,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    detectBrowsers: {
      enabled: true,
      usePhantomJS: true
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {
          type: 'json',
          subdir: 'json'
        },
        {
          type: 'html',
          subdir: 'html'
        },
        {
          type: 'lcov',
          subdir: 'lcov'
        }
      ]
    },

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      },
      sl_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7',
        version: '35'
      },
      sl_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '30'
      },
      sl_ios_safari: {
        base: 'SauceLabs',
        browserName: 'iphone',
        platform: 'OS X 10.9',
        version: '7.1'
      },
      sl_ie_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      }
    },
    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-sauce-launcher',
      'karma-safari-launcher',
      'karma-detect-browsers'
    ]
  };
  if(process.env.TRAVIS) {
    configuration.detectBrowsers = {
      enabled: false,
      usePhantomJS: true
    }
    configuration.browsers = ['Chrome_travis_ci', 'Firefox', 'FirefoxAurora', 'FirefoxNightly', 'PhantomJS', 'sl_chrome', 'sl_firefox', 'sl_ios_safari', 'sl_ie_11'];
  }
  config.set(configuration);
}
