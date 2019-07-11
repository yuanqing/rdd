#!/usr/bin/env node

const yargs = require('yargs')

const name = require('../../package.json').name

yargs
  .scriptName(name)
  .command(require('./commands/format'))
  .command(require('./commands/serve'))
  .command(require('./commands/toc'))
  .strict()
  .help()
  .version()
  .parse()
