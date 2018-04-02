const highlight = require('highlight.js')
const md = require('md')
const promisify = require('util').promisify
const readFile = promisify(require('fs').readFile)

const emojis = require('../../build/emojis.json')

const GITHUB_EMOJI_REGEX = /:(\w+):/g
function insertEmojis (string) {
  return string.replace(GITHUB_EMOJI_REGEX, function (match, keyword) {
    const unicode = emojis[keyword]
    return unicode || match
  })
}

const renderer = new md.Renderer()
renderer.heading = function (text, level) {
  return `<h${level}>${text}</h${level}>`
}

const mdOptions = {
  gfm: true,
  highlight: function (code) {
    return highlight.highlightAuto(code).value
  },
  renderer: renderer
}

function compileMarkdown (string) {
  return insertEmojis(md(string, mdOptions))
}

async function compileMarkdownFile (file) {
  const data = await readFile(file, 'utf8')
  return compileMarkdown(data)
}

module.exports = compileMarkdownFile
