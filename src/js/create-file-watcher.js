const chokidar = require('chokidar')
const markdownExtensions = require('markdown-extensions')

const markdownFiles = markdownExtensions.map(function (extension) {
  return '**/*.' + extension
})

async function createFileWatcher (directory, onChangeCallback) {
  return new Promise(async function (resolve, reject) {
    const watcher = chokidar.watch(markdownFiles, {
      cwd: directory,
      ignored: '**/node_modules/**'
    })

    watcher.on('ready', resolve)

    watcher.on('change', onChangeCallback)
  })
}

module.exports = createFileWatcher
