const fs = require('fs-extra')
const MarkdownIt = require('markdown-it')
const markdownItEmoji = require('markdown-it-emoji')
const markdownItGithubHeadings = require('markdown-it-github-headings')
const markdownItHighlightJs = require('markdown-it-highlightjs')

const m = new MarkdownIt({
  html: true,
  linkify: true
})
  .use(markdownItEmoji)
  .use(markdownItGithubHeadings)
  .use(markdownItHighlightJs)

async function renderMarkdownFile (file) {
  const markdown = await fs.readFile(file, 'utf8')
  return m.render(markdown)
}

module.exports = renderMarkdownFile
