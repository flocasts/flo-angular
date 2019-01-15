module.exports = function (dir) {
  console.log(require('path').join(__dirname, dir))
  return {
    dir: require('path').join(__dirname, dir),
    reports: ['html', 'lcovonly', 'text-summary'],
    fixWebpackSourcePaths: true,
    thresholds: {
      emitWarning: false,
      global: {
        statements: 100,
        lines: 100,
        branches: 100,
        functions: 100
      }
    }
  }
}