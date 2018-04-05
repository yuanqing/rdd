#!/usr/bin/env node

const fs = require('fs')
const markdownExtensions = require('markdown-extensions')
const nopt = require('nopt')
const opn = require('opn')
const path = require('path')

const version = require('../package.json').version
const server = require('../src/js/server')

const help = `
Usage: rdd [file] [options]

File:
  If not specified, tries to find a Markdown file (eg. README.md) in the
  current directory.

Options:
  -h, --help         Print this message.
  -o, --open         Open the rendered Markdown file in your default
                     web browser.
  -p, --port [port]  Set the preferred port to serve the rendered file.
  -v, --version      Print the version number.
`

function logError (message) {
  console.error('rdd: ' + message)
  process.exit(1)
}

const knownOptions = {
  help: Boolean,
  open: Boolean,
  port: Number,
  version: Boolean
}
const shorthands = {
  h: '--help',
  o: '--open',
  p: '--port',
  v: '--version'
}
const options = nopt(knownOptions, shorthands)

if (options.help) {
  console.log(help)
  process.exit(0)
}

if (options.version) {
  console.log(version)
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
