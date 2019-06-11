const config = require('../../../src/karma.conf.shared')
module.exports = config('../coverage/ng-media-source-extensions')([
  { pattern: 'test/**/*.*', included: false, served: true }
])({
  statements: 50,
  lines: 50,
  branches: 50,
  functions: 50
})
