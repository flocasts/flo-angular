module.exports = (dir) => (cov) => {
  return {
    dir: require('path').join(__dirname, dir),
    reports: ['html', 'lcovonly', 'text-summary'],
    fixWebpackSourcePaths: true,
    thresholds: {
      emitWarning: false,
      global: cov || {
        statements: 100,
        lines: 100,
        branches: 100,
        functions: 100
      }
    }
  }
}