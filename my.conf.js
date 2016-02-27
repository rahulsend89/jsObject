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
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 30000,

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

    browserStack: {
      project: 'rahulsend89/jsObject',
      name: "jsObjectTest",
      startTunnel: true,
      timeout: 600 // 10min
    },

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      },
      'SL_Chrome': {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: '45'
      },
      'SL_Firefox': {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '39'
      },
      'SL_Safari': {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.10',
        version: '8'
      },
      'SL_IE_9': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2008',
        version: '9'
      },
      'SL_IE_10': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2012',
        version: '10'
      },
      'SL_IE_11': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      },
      'SL_iOS': {
        base: "SauceLabs",
        browserName: "iphone",
        platform: "OS X 10.10",
        version: "8.1"
      },
      'SL_IE_6': {
        base: "SauceLabs",
        browserName: "internet explorer",
        platform: "Windows XP",
        version: "6.0"
      },
      'SL_Android_4': {
        base: "SauceLabs",
        browserName: "Android Emulator",
        platform: "Android 4.0",
        version: "4.0"
      },
      'SL_Android_5': {
        base: "SauceLabs",
        browserName: "Android Emulator",
        platform: "Android 5.0",
        version: "5.0"
      },
      'BS_Chrome': {
        base: 'BrowserStack',
        browser: 'chrome',
        os: 'Windows',
        os_version: '8.1'
      },
      'BS_Firefox': {
        base: 'BrowserStack',
        browser: 'firefox',
        os: 'Windows',
        os_version: '8.1'
      },
      'BS_Opera': {
        base: 'BrowserStack',
        browser: 'opera',
        os: 'Windows',
        os_version: '8.1'
      },
      'BS_IE_11': {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '8.1'
      },
      'BS_IE_10': {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '10.0',
        os: 'Windows',
        os_version: '7'
      },
      'BS_IE_9': {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '9.0',
        os: 'Windows',
        os_version: '7'
      },
      'BS_Safari': {
        base: 'BrowserStack',
        browser: 'safari',
        os: 'OS X',
        os_version: 'Yosemite'
      },
      'BS_iOS': {
        base: 'BrowserStack',
        device: 'iPhone 5S',
        os: 'ios',
        os_version: '7.0'
      },
      'BS_Android': {
        base: 'BrowserStack',
        device: 'Samsung Galaxy S5',
        os: 'android',
        os_version: '4.4'
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
      'karma-detect-browsers',
      'karma-browserstack-launcher'
    ]
  };
  if(process.env.TRAVIS) {
    configuration.detectBrowsers = {
      enabled: false,
      usePhantomJS: true
    };
    configuration.browsers = ['Chrome_travis_ci', 'Firefox', 'FirefoxAurora', 'FirefoxNightly', 'PhantomJS', 'SL_Chrome','SL_Firefox','SL_Safari','SL_IE_9','SL_IE_10','SL_IE_11','SL_iOS','SL_IE_6','SL_Android_5','SL_Android_4','BS_Chrome','BS_Firefox','BS_Opera','BS_IE_11','BS_IE_10','BS_IE_9','BS_Safari','BS_iOS','BS_Android'];
  }
  config.set(configuration);
};
