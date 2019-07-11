const openWebBrowser = require('open')

const resolveMarkdownFiles = require('../resolve-markdown-files')
const serve = require('../serve')

module.exports = {
  command: ['serve [file]', '$0 [file]'],
  describe: 'Render and serve the given Markdown file',
  builder: function (yargs) {
    yargs.positional('file', {
      type: 'string'
    })
    yargs.option('dark', {
      alias: ['d'],
      type: 'boolean',
      default: false,
      describe: 'Enable dark mode'
    })
    yargs.option('format', {
      alias: ['f'],
      type: 'boolean',
      default: false,
      describe: 'Auto-format the Markdown file on save'
    })
    yargs.option('open', {
      alias: ['o'],
      type: 'boolean',
      default: false,
      describe: 'Open the rendered file in your default web browser'
    })
    yargs.option('port', {
      alias: ['p'],
      type: 'number',
      default: 8888,
      describe: 'Set the preferred port to serve the rendered file'
    })
  },
  handler: async function ({ file, dark, format, open, port }) {
    const markdownFiles = await resolveMarkdownFiles([file])
    const url = await serve(markdownFiles[0], {
      theme: dark ? 'dark' : 'light',
      port,
      shouldFormat: format
    })
    if (open) {
      openWebBrowser(url)
    }
    return Promise.resolve()
  }
}
