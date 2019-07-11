const resolveMarkdownFiles = require('../resolve-markdown-files')
const writeMarkdownTocToFile = require('../write-markdown-toc-to-file')

module.exports = {
  command: ['toc [files..]'],
  describe: 'Insert a table of contents into the given Markdown files',
  builder: function (yargs) {
    yargs.positional('files', {
      type: 'string'
    })
  },
  handler: async function ({ files }) {
    const markdownFiles = await resolveMarkdownFiles(files)
    return Promise.all(markdownFiles, function (markdownFile) {
      return writeMarkdownTocToFile(markdownFile)
    })
  }
}
