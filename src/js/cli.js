#!/usr/bin/env node

const openWebBrowser = require('open')
const yargs = require('yargs')

const name = require('../../package.json').name
const resolveMarkdownFile = require('./resolve-markdown-file')
const serve = require('./serve')
const writeMarkdownTocToFile = require('./write-markdown-toc-to-file')

yargs
  .scriptName(name)
  .command({
    command: '$0 [file]',
    describe: 'Renders and serves the given Markdown document',
    builder: function (yargs) {
      yargs.option('open', {
        alias: ['o'],
        type: 'boolean',
        default: false,
        describe: 'Open the rendered Markdown document in your default web browser'
      })
      yargs.option('port', {
        alias: ['p'],
        type: 'number',
        default: 8888,
        describe: 'Set the preferred port to serve the rendered document'
      })
      yargs.option('toc', {
        alias: ['t'],
        type: 'boolean',
        default: false,
        describe: 'Insert a table of contents into the Markdown document'
      })
    },
    handler: async function ({ file, open, port, toc }) {
      const markdownFile = await resolveMarkdownFile(file)
      if (toc) {
        return writeMarkdownTocToFile(markdownFile)
      }
      const url = await serve(markdownFile, port)
      if (open) {
        openWebBrowser(url)
      }
      return Promise.resolve()
    }
  })
  .strict()
  .help()
  .version()
  .parse()
