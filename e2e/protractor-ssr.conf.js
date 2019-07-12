const config = require('./protractor.conf').config;
const { exec } = require('child_process');

require('dotenv').config()

let proc

config.beforeLaunch = function () {
  proc = exec('node dist/server.js')
}

config.onCleanUp = function () {
  try {
    process.kill(proc.pid)
  } catch { }
}

exports.config = config;