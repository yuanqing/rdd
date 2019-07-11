const globby = require('globby')
const markdownExtensions = require('markdown-extensions')

const name = require('../../package.json').name

const markdownFilesRegularExpression = new RegExp(
  '.(' + markdownExtensions.join('|') + ')$',
  'i'
)
const defaultGlob = 'readme.(' + markdownExtensions.join('|') + ')'

function logError (message) {
  console.error(`${name}: ${message}`)
  process.exit(1)
}

async function resolveMarkdownFiles (globPatterns) {
  const filtered = globPatterns.filter(Boolean)
  if (filtered.length === 0) {
    filtered.push(defaultGlob)
  }
  const files = await globby(filtered, { caseSensitiveMatch: false })
  if (files.length === 0) {
    return logError('Need a Markdown file')
  }
  return files.filter(function (file) {
    return markdownFilesRegularExpression.test(file)
  })
}

module.exports = resolveMarkdownFiles
