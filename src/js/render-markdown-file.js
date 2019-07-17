const fs = require('fs-extra')
const MarkdownIt = require('markdown-it')
const markdownItEmoji = require('markdown-it-emoji')
const markdownItGithubHeadings = require('markdown-it-github-headings')
const markdownItHighlightJs = require('markdown-it-highlightjs')

const insertMarkdownToc = require('./insert-markdown-toc')

async function renderMarkdownFile (file) {
  const m = new MarkdownIt({
    html: true,
    linkify: true
  })
    .use(markdownItEmoji)
    .use(markdownItGithubHeadings)
    .use(markdownItHighlightJs, { auto: false })
  const markdown = await fs.readFile(file, 'utf8')
  return m.render(insertMarkdownToc(markdown))
}

module.exports = renderMarkdownFile
