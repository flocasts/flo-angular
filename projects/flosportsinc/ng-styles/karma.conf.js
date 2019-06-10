const config = require('../../../src/karma.conf.shared')
module.exports = config('../coverage/ng-styles')()({
  statements: 100,
  lines: 100,
  branches: 100,
  functions: 0
})
