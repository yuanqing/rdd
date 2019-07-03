const fs = require('fs-extra')

const insertMarkdownToc = require('./insert-markdown-toc')

async function writeMarkdownTocToFile (file) {
  const markdown = await fs.readFile(file, 'utf8')
  return fs.outputFile(file, insertMarkdownToc(markdown))
}

module.exports = writeMarkdownTocToFile
