var morphdom = require('morphdom')

var element = document.querySelector('.markdown-body')

var path = window.location.pathname.substring(1)
var webSocketPort = window.webSocketPort

var webSocket = new window.WebSocket('ws://localhost:' + webSocketPort + '/')
webSocket.onopen = function () {
  webSocket.send(path)
}
webSocket.onmessage = function (event) {
  morphdom(
    element,
    '<article class="markdown-body">' + event.data + '</article>'
  )
}
