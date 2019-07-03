const markdownToc = require('markdown-toc')

function insertMarkdownToc (markdown) {
  return markdownToc.insert(markdown, {
    bullets: '-'
  })
}

module.exports = insertMarkdownToc
