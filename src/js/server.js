const ecstatic = require('ecstatic')
const express = require('express')
const fs = require('fs')
const getPort = require('get-port')
const lodashTemplate = require('lodash.template')
const markdownExtensions = require('markdown-extensions')
const path = require('path')

const compileMarkdownFile = require('./compile-markdown-file')
const createFileWatcher = require('./create-file-watcher')
const createWebSocketServer = require('./create-web-socket-server')

const render = lodashTemplate(
  fs.readFileSync(path.resolve(__dirname, '..', 'html', 'template.html'), 'utf8')
)

async function server (file, port) {
  const serverPort = await getPort(port)
  const webSocketPort = await getPort(port + 1)

  const directory = path.dirname(file)

  const markdownRoutes = new RegExp(
    '.*.(' + markdownExtensions.join('|') + ')$',
    'i'
  )

  return new Promise(async function (resolve, reject) {
    const broadcastChangedFileToClients = await createWebSocketServer(
      webSocketPort
    )
    await createFileWatcher(directory, async function (changedFile) {
      try {
        const html = await compileMarkdownFile(
          path.join(directory, changedFile)
        )
        broadcastChangedFileToClients(changedFile, html)
      } catch (error) {
        reject(error)
      }
    })

    const app = express()

    app.get(markdownRoutes, async function (req, res, next) {
      try {
        const html = await compileMarkdownFile(
          path.join(directory, req.originalUrl)
        )
        res.send(
          render({
            content: html,
            title: path.basename(req.path),
            webSocketPort: webSocketPort
          })
        )
      } catch (error) {
        reject(error)
        next()
      }
    })

    // Serve the build directory as static files.
    app.use('/__rdd__', express.static(path.resolve(__dirname, '..', '..', 'build')))

    // Serve the entire `directory` as static files.
    app.use(
      ecstatic({
        root: directory,
        showdir: true
      })
    )

    app.listen(serverPort, function () {
      resolve(serverPort)
    })
  })
}

module.exports = server
