const WebSocket = require('ws')

async function createWebSocketServer (port) {
  return new Promise(async function (resolve, reject) {
    const webSocketServer = new WebSocket.Server({ port: port })

    const clients = []

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

    function broadcastChangedFileToClients (changedFile, html) {
      clients.forEach(function (client) {
        if (client && client.file === changedFile) {
          client.webSocket.send(html)
        }
      })
    }

    webSocketServer.on('listening', function () {
      resolve(broadcastChangedFileToClients)
    })
  })
}

module.exports = createWebSocketServer
