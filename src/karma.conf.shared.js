const plugins = require('./karma.config.plugins')
const coverageIstanbulReporter = require('./karma.config.istanbul')

const sharedKarmaConfig = (dir) => (files) => (cov) => (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins,
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: coverageIstanbulReporter(dir)(cov),
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },
    singleRun: false,
    files: files || []
  });
}

module.exports = sharedKarmaConfig