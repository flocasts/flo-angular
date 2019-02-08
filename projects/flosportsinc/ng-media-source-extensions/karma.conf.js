const config = require('../../../src/karma.conf.shared')
module.exports = config('../coverage')([
  { pattern: 'test/**/*.*', included: false, served: true }
])({
  statements: 90,
  lines: 90,
  branches: 100,
  functions: 85
})
