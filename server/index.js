const ecstatic = require('ecstatic')
const express = require('express')
const fs = require('fs')
const lodashTemplate = require('lodash.template')
const marked = require('marked')
const path = require('path')
const chokidar = require('chokidar')
const WebSocket = require('ws')

const compileMarkdownFile = function (filePath, callback) {
  fs.readFile(filePath, 'utf8', function (error, data) {
    if (error) {
      callback(error)
      return
    }
    callback(null, marked(data))
  })
}

const render = lodashTemplate(
  fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8')
)

const server = function (file, port, callback) {
  const directory = path.dirname(file)

  const clients = []

  const webSocketServer = new WebSocket.Server({ port: port + 1 })
  let count = 0
  webSocketServer.on('connection', function (webSocket) {
    const index = count++
    webSocket.on('message', function (file) {
      clients.push({
        file: file,
        webSocket: webSocket
      })
    })
    webSocket.on('error', function () {
      clients[index] = null
    })
  })

  const watcher = chokidar.watch('**/*.md', {
    cwd: directory,
    ignored: '**/node_modules/**'
  })
  watcher.on('change', function (changedFile) {
    compileMarkdownFile(path.join(directory, changedFile), function (
      error,
      html
    ) {
      if (error) {
        callback(error)
        return
      }
      clients.forEach(function (client) {
        if (client && client.file == changedFile) {
          client.webSocket.send(html)
        }
      })
    })
  })

  const app = express()

  app.get('*.md', function (req, res, next) {
    compileMarkdownFile(path.join(directory, req.originalUrl), function (
      error,
      html
    ) {
      if (error) {
        callback(error)
        next()
        return
      }
      res.send(
        render({
          title: path.basename(req.path),
          content: html
        })
      )
    })
  })

  app.use('/__rdd__', express.static(path.resolve(__dirname, '..')))

  app.use(
    ecstatic({
      root: process.cwd(),
      showdir: true
    })
  )

  app.listen(port)
}

module.exports = server
