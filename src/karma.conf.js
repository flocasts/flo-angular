const config = require('./karma.conf.shared')
module.exports = config('../coverage/flo-angular')([
])({
  statements: 90,
  lines: 90,
  branches: 75,
  functions: 90
})