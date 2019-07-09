const config = require('../../../src/karma.conf.shared')
module.exports = config('../coverage/ng-fullscreen')()({
  statements: 100,
  lines: 100,
  branches: 91,
  functions: 100
})
