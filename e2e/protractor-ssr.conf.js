const config = require('./protractor.conf').config;
const { exec } = require('child_process');

let proc

config.beforeLaunch = function() {
  proc = exec('node dist/server.js')
}
config.onCleanUp = function() {
  process.kill(proc.pid)
}

exports.config = config;