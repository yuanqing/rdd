const express = require('express')
const fs = require('fs-extra')
const getPort = require('get-port')
const lodashTemplate = require('lodash.template')
const markdownExtensions = require('markdown-extensions')
const path = require('path')
const sirv = require('sirv')

const createFileWatcher = require('./create-file-watcher')
const createWebSocketServer = require('./create-web-socket-server')
const formatMarkdownFile = require('./format-markdown-file')
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

async function serve (file, { port, shouldFormat, theme }) {
  const serverPort = await getPort({ port })
  const webSocketPort = await getPort({ port: port + 1 })

  const broadcastChangedMarkdownToClients = await createWebSocketServer(
    webSocketPort
  )
  await createFileWatcher(directory, async function (changedFile) {
    const filePath = path.join(directory, changedFile)
    if (shouldFormat && (await formatMarkdownFile(filePath))) {
      return
    }
    const html = await renderMarkdownFile(filePath)
    broadcastChangedMarkdownToClients(changedFile, html)
  })

  const app = express()

  app.get('*', async function (req, res, next) {
    const extension = path.extname(req.originalUrl)
    if (extension !== '') {
      next()
      return
    }
    const url = path.join(req.originalUrl, 'README.md').replace('%20', ' ')
    const filePath = path.join(directory, url)
    if ((await fs.pathExists(filePath)) === false) {
      next()
      return
    }
    res.redirect(url)
  })

  app.get(markdownRoutesRegularExpression, async function (req, res) {
    const filePath = path.join(directory, req.originalUrl).replace('%20', ' ')
    const html = await renderMarkdownFile(filePath)
    res.send(
      render({
        content: html,
        theme,
        title: path.basename(req.path),
        webSocketPort: webSocketPort
      })
    )
  })

  app.use(
    '/__rdd__',
    express.static(path.resolve(__dirname, '..', '..', 'build'))
  )

  app.use(
    sirv(directory, {
      dev: true
    })
  )

  return new Promise(function (resolve) {
    app.listen(serverPort, function () {
      const url = `127.0.0.1:${serverPort}/${file}`
      console.log(`Serving on ${url}`)
      resolve(`http://${url}`)
    })
  })
}

module.exports = serve
