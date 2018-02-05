var morphdom = require('morphdom')

var element = document.querySelector('.markdown-body')

var path = window.location.pathname.substring(1)
var port = parseInt(window.location.port) + 1

var ws = new WebSocket('ws://localhost:' + port + '/')
ws.onopen = function () {
  ws.send(path)
}
ws.onmessage = function (event) {
  morphdom(
    element,
    '<article class="markdown-body">' + event.data + '</article>'
  )
}
