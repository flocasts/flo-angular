const config = require('../../../src/karma.conf.shared')
module.exports = config('../coverage')([
  { pattern: 'test/**/*.*', included: false, served: true }
])
