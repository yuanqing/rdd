const fs = require('fs-extra')
const prettier = require('prettier')

// resolves to `true` if and only if the markdown was actually formatted
async function formatMarkdownFile (file) {
  const markdown = await fs.readFile(file, 'utf8')
  const result = prettier.format(markdown, { parser: 'markdown' })
  if (markdown === result) {
    return false
  }
  await fs.writeFile(file, result)
  return true
}

module.exports = formatMarkdownFile
