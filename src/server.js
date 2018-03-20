const chokidar = require('chokidar')
const ecstatic = require('ecstatic')
const express = require('express')
const fs = require('fs')
const getPort = require('get-port')
const highlight = require('highlight.js')
const lodashTemplate = require('lodash.template')
const markdownExtensions = require('markdown-extensions')
const md = require('md')
const path = require('path')
const WebSocket = require('ws')

const emojis = require('../build/emojis.json')

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

const GITHUB_EMOJI_REGEX = /:(\w+):/g
function mapEmojiKeywordToUnicode (match, keyword) {
  const unicode = emojis[keyword]
  return unicode || match
}

function compileMarkdownFile (file, callback) {
  fs.readFile(file, 'utf8', function (error, data) {
    if (error) {
      return callback(error)
    }
    const result = md(data, mdOptions).replace(
      GITHUB_EMOJI_REGEX,
      mapEmojiKeywordToUnicode
    )
    callback(null, result)
  })
}

// For interpolating values into the template.
const render = lodashTemplate(
  fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8')
)

// File paths to watch for changes.
const markdownFiles = markdownExtensions.map(function (extension) {
  return '**/*.' + extension
})

// RegExp to match routes with markdown file extensions.
const markdownRoutes = new RegExp(
  '.*.(' + markdownExtensions.join('|') + ')$',
  'i'
)

function server (file, port) {
  return new Promise(async function (resolve, reject) {
    let webSocketPort

    // The directory to be watched for changes.
    const directory = path.dirname(file)

    // Pre-process markdown files before serving.
    const app = express()
    app.get(markdownRoutes, function (req, res, next) {
      compileMarkdownFile(path.join(directory, req.originalUrl), function (
        error,
        html
      ) {
        if (error) {
          reject(error)
          return next()
        }
        res.send(
          render({
            content: html,
            title: path.basename(req.path),
            webSocketPort: webSocketPort
          })
        )
      })
    })

    // Serve the build directory as static files.
    app.use('/__rdd__', express.static(path.resolve(__dirname, '..', 'build')))

    // Serve the entire `directory` as static files.
    app.use(
      ecstatic({
        root: directory,
        showdir: true
      })
    )

    const serverPort = await getPort({ port: port })
    app.listen(serverPort)

    // A list of clients that have connected to the `webSocketServer`.
    const clients = []

    webSocketPort = await getPort({ port: serverPort })
    console.log(webSocketPort)
    const webSocketServer = new WebSocket.Server({ port: webSocketPort })
    let count = 0
    webSocketServer.on('connection', function (webSocket) {
      const index = count++
      // On connecting, new clients will send the `webSocketServer` its file path. We store the path and the
      // corresponding `webSocket` instance in `clients`.
      webSocket.on('message', function (file) {
        clients.push({
          file: file,
          webSocket: webSocket
        })
      })
      // Whenever a client disconnects, unset the corresponding index in `clients`.
      webSocket.on('error', function () {
        clients[index] = null
      })
    })

    // Whenever a file in `markdownFiles` changes, compile the file and broadcast the `html` to each client in
    // `clients` that correspond to the `changedFile`.
    const watcher = chokidar.watch(markdownFiles, {
      cwd: directory,
      ignored: '**/node_modules/**'
    })
    watcher.on('change', function (changedFile) {
      compileMarkdownFile(path.join(directory, changedFile), function (
        error,
        html
      ) {
        if (error) {
          reject(error)
          return
        }
        clients.forEach(function (client) {
          if (client && client.file === changedFile) {
            client.webSocket.send(html)
          }
        })
      })
    })

    resolve(serverPort)
  })
}

module.exports = server
