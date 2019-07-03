const WebSocket = require('ws')

async function createWebSocketServer (port) {
  return new Promise(async function (resolve, reject) {
    const webSocketServer = new WebSocket.Server({ port })

    const clients = []

    webSocketServer.on('connection', function (webSocket) {
      // On connecting, new clients will send the `webSocketServer` its file path. We store the path and the
      // corresponding `webSocket` instance in `clients`.
      webSocket.on('message', function (file) {
        clients.push({
          file: file,
          webSocket: webSocket
        })
      })
    })

    function broadcastChangedFileToClients (changedFile, html) {
      clients.forEach(function (client) {
        if (client.file === changedFile) {
          try {
            client.webSocket.send(html)
          } catch (error) {
            reject(error)
          }
        }
      })
    }

    webSocketServer.on('listening', function () {
      resolve(broadcastChangedFileToClients)
    })
  })
}

module.exports = createWebSocketServer
