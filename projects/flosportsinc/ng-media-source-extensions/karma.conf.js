const config = require('../../../src/karma.conf.shared')
module.exports = config('../coverage')([
  { pattern: 'test/**/*.*', included: false, served: true }
])({
  statements: 80,
  lines: 80,
  branches: 80,
  functions: 80
})
