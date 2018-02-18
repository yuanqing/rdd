const emojilib = require('emojilib')
const fs = require('fs')
const path = require('path')

const emojis = Object.keys(emojilib.lib).reduce(function (result, key) {
  const unicode = emojilib.lib[key].char
  if (unicode) {
    result[key] = unicode
  }
  return result
}, {})

const file = path.resolve(__dirname, '..', 'build', 'emojis.json')
fs.writeFile(file, JSON.stringify(emojis), 'utf8', function (error) {
  if (error) {
    throw error
  }
})
