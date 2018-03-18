const chokidar = require('chokidar')
const ecstatic = require('ecstatic')
const express = require('express')
const fs = require('fs')
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
const mapEmojiKeywordToUnicode = function (match, keyword) {
  const unicode = emojis[keyword]
  return unicode || match
}

const compileMarkdownFile = function (file, callback) {
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

markdownExtensions.map(function (extension) {
  return '**/*.' + extension
})

const server = function (file, port, callback) {
  // The directory to be watched for changes.
  const directory = path.dirname(file)

  // A list of clients that have connected to the `webSocketServer`.
  const clients = []

  const webSocketServer = new WebSocket.Server({ port: port + 1 })
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
        return callback(error)
      }
      clients.forEach(function (client) {
        if (client && client.file === changedFile) {
          client.webSocket.send(html)
        }
      })
    })
  })

  // Pre-process markdown files before serving.
  const app = express()
  app.get(markdownRoutes, function (req, res, next) {
    compileMarkdownFile(path.join(directory, req.originalUrl), function (
      error,
      html
    ) {
      if (error) {
        callback(error)
        return next()
      }
      res.send(
        render({
          title: path.basename(req.path),
          content: html
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

  app.listen(port)
}

module.exports = server
