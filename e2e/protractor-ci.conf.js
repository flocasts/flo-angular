const config = require('./protractor-ssr.conf').config;
DEFAULT_TIMEOUT_INTERVAL = 100000
config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox', '--disable-gpu']
  }
};

exports.config = config;