const config = require('./karma.conf.shared')
module.exports = config('../coverage/flo-angular')([
])({
  statements: 90,
  lines: 100,
  branches: 90,
  functions: 90
})