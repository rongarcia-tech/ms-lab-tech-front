module.exports = function(config) {
  config.set({
    // Base path that will be used to resolve all patterns (e.g., files, exclude)
    basePath: '',
    // Frameworks to use
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      // require('@angular-devkit/build-angular/plugins/karma') old
    ],
    client: {
      jasmine: {
        // You can add configuration options for Jasmine here
        // For example, to disable random execution:
        // random: false
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/proyecto_lab_tech'),
      subdir: '.',
      reporters: [
        { type: 'html', subdir: '.' },
        { type: 'lcov', subdir: 'lcov-report' }
      ],
      includeAllSources: true,
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
