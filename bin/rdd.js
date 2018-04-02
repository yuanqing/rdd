#!/usr/bin/env node

const fs = require('fs')
const markdownExtensions = require('markdown-extensions')
const nopt = require('nopt')
const opn = require('opn')
const path = require('path')

const server = require('../src/js/server')

const logError = function (message) {
  console.error('rdd: ' + message)
  process.exit(1)
}

const knownOptions = {
  open: Boolean,
  port: Number,
  usage: Boolean
}
const shorthands = {
  o: '--open',
  p: '--port',
  h: '--help'
}
const options = nopt(knownOptions, shorthands)

if (options.help) {
  fs.createReadStream(path.join(__dirname, 'usage.txt')).pipe(process.stdout)
  process.exit(0)
}

let file = options.argv.remain[0]
if (file) {
  if (!fs.existsSync(file)) {
    logError(file + ': No such file')
  }
} else {
  const regExp = new RegExp(
    '^readme.(' + markdownExtensions.join('|') + ')$',
    'i'
  )
  file = fs.readdirSync(process.cwd()).reduce(function (foundFile, file) {
    if (foundFile) {
      return foundFile
    }
    if (regExp.test(file)) {
      return file
    }
  }, null)
  if (!file) {
    logError('Need a file')
  }
}

server(file, options.port || 8888)
  .then(function (serverPort) {
    console.log('Serving on 0.0.0.0:' + serverPort)
    if (options.open) {
      opn('http://0.0.0.0:' + serverPort + '/' + file)
    }
  })
  .catch(logError)
