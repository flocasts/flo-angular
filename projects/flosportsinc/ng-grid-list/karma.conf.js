const config = require('../../../src/karma.conf.shared')
module.exports = config('../coverage/ng-grid-list')()({
  statements: 100,
  lines: 100,
  branches: 95,
  functions: 100
})
