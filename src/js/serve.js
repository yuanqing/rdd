const express = require('express')
const fs = require('fs-extra')
const getPort = require('get-port')
const lodashTemplate = require('lodash.template')
const markdownExtensions = require('markdown-extensions')
const path = require('path')
const sirv = require('sirv')

const createFileWatcher = require('./create-file-watcher')
const createWebSocketServer = require('./create-web-socket-server')
const renderMarkdownFile = require('./render-markdown-file')

const render = lodashTemplate(
  fs.readFileSync(
    path.resolve(__dirname, '..', 'html', 'template.html'),
    'utf8'
  )
)

const markdownRoutesRegularExpression = new RegExp(
  '.*.(' + markdownExtensions.join('|') + ')$',
  'i'
)

const directory = process.cwd()

async function serve (file, port) {
  const serverPort = await getPort({ port })
  const webSocketPort = await getPort({ port: port + 1 })

  return new Promise(async function (resolve, reject) {
    const broadcastChangedMarkdownToClients = await createWebSocketServer(
      webSocketPort
    )
    await createFileWatcher(directory, async function (changedFile) {
      try {
        const html = await renderMarkdownFile(path.join(directory, changedFile))
        broadcastChangedMarkdownToClients(changedFile, html)
      } catch (error) {
        reject(error)
      }
    })

    const app = express()

    app.get(markdownRoutesRegularExpression, async function (req, res, next) {
      try {
        const html = await renderMarkdownFile(
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

    app.use(
      '/__rdd',
      express.static(path.resolve(__dirname, '..', '..', 'build'))
    )

    app.use(sirv(directory))

    app.listen(serverPort, function () {
      const url = `0.0.0.0:${serverPort}/${file}`
      console.log(`Serving on ${url}`)
      resolve(`http://${url}`)
    })
  })
}

module.exports = serve
