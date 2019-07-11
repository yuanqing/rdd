const resolveMarkdownFiles = require('../resolve-markdown-files')
const formatMarkdownFile = require('../format-markdown-file')

module.exports = {
  command: ['format [files..]', 'fmt [files..]'],
  describe: 'Auto-format the given Markdown files',
  builder: function (yargs) {
    yargs.positional('files', {
      type: 'string'
    })
  },
  handler: async function ({ files }) {
    const markdownFiles = await resolveMarkdownFiles(files)
    return Promise.all(markdownFiles, function (markdownFile) {
      return formatMarkdownFile(markdownFile)
    })
  }
}
