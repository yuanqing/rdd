var morphdom = require('morphdom')

var element = document.querySelector('.markdown-body')

var ws = new WebSocket(
  'ws://localhost:' + (parseInt(window.location.port) + 1) + '/'
)
ws.onopen = function () {
  ws.send(window.location.pathname.substring(1))
}
ws.onmessage = function (event) {
  morphdom(
    element,
    '<article class="markdown-body">' + event.data + '</article>'
  )
}
