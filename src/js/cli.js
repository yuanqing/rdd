#!/usr/bin/env node

const openWebBrowser = require('open')
const yargs = require('yargs')

const name = require('../../package.json').name
const resolveMarkdownFile = require('./resolve-markdown-file')
const serve = require('./serve')

yargs
  .scriptName(name)
  .command({
    command: '$0 [file]',
    describe: 'Renders the given Markdown file',
    builder: function (yargs) {
      yargs.option('open', {
        alias: ['o'],
        type: 'boolean',
        describe: 'Open the rendered Markdown file in your default web browser'
      })
      yargs.option('port', {
        alias: ['p'],
        type: 'number',
        default: 8888,
        describe: 'Set the preferred port to serve your Markdown file'
      })
    },
    handler: async function ({ file, open, port }) {
      const markdownFile = await resolveMarkdownFile(file)
      const url = await serve(markdownFile, port)
      if (open) {
        openWebBrowser(url)
      }
    }
  })
  .strict()
  .help()
  .version()
  .parse()
