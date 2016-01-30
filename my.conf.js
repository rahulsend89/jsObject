// Karma configuration
// Generated on Tue Jan 26 2016 18:34:32 GMT+0530 (IST)

module.exports = function(config) {
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
    reporters: ['progress','dots','coverage'],

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
    logLevel: config.LOG_INFO,


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
      'karma-safari-launcher',
      'karma-detect-browsers'
    ]
  };
  if(process.env.TRAVIS){
    configuration.detectBrowsers = {
          enabled : false,
          usePhantomJS: true
    }
    configuration.browsers = ['Chrome_travis_ci', 'Firefox', 'FirefoxAurora', 'FirefoxNightly', 'PhantomJS'];
  }
  config.set(configuration);
}
