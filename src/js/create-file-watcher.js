const chokidar = require('chokidar')
const markdownExtensions = require('markdown-extensions')

const markdownFilesGlob = markdownExtensions.map(function (extension) {
  return '**/*.' + extension
})

async function createFileWatcher (directory, onChangeCallback) {
  return new Promise(async function (resolve) {
    const watcher = chokidar.watch(markdownFilesGlob, {
      cwd: directory,
      ignored: '**/node_modules/**'
    })

    watcher.on('ready', resolve)

    watcher.on('change', onChangeCallback)
  })
}

module.exports = createFileWatcher
