const webSocket = new window.WebSocket(
  `ws://0.0.0.0:${window.__rddWebSocketPort}/`
)

const path = window.location.pathname.substring(1)
webSocket.onopen = function () {
  webSocket.send(path)
}

const element = document.querySelector('.markdown-body')
webSocket.onmessage = function (event) {
  element.innerHTML = event.data
}
