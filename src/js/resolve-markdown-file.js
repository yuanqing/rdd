const fs = require('fs-extra')
const markdownExtensions = require('markdown-extensions')

const name = require('../../package.json').name

const markdownFilesRegularExpression = new RegExp(
  '^readme.(' + markdownExtensions.join('|') + ')$',
  'i'
)

function logError (message) {
  console.error(`${name}: ${message}`)
  process.exit(1)
}

async function resolveMarkdownFile (file) {
  if (file) {
    if ((await fs.exists(file)) === false) {
      return logError(`${file}: No such file`)
    }
    return file
  } else {
    const files = await fs.readdir(process.cwd())
    const result = files.find(function (file) {
      return markdownFilesRegularExpression.test(file)
    })
    if (typeof result === 'undefined') {
      return logError('Need a file')
    }
    return result
  }
}

module.exports = resolveMarkdownFile
