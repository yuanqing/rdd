const markyDeepLinks = require('marky-deep-links')
markyDeepLinks()

const webSocket = new window.WebSocket(
  `ws://127.0.0.1:${window.__rddWebSocketPort}/`
)

const path = window.location.pathname.substring(1)
webSocket.onopen = function () {
  webSocket.send(path)
}

const element = document.querySelector('.markdown-body')
webSocket.onmessage = function (event) {
  element.innerHTML = event.data
}
