'use strict';

var ecstatic = require('ecstatic');
var fs = require('fs');
var gaze = require('gaze');
var http = require('http');
var Remarkable = require('remarkable');
var shoe = require('shoe');

var md = new Remarkable('full', {
  html: true
});

var render = function(file, stream) {
  stream.write(md.render(fs.readFileSync(file, 'utf8')));
};

var serve = function(file, port) {

  var server = http.createServer(ecstatic(__dirname));
  server.listen(port);

  var sock = shoe(function(stream) {
    render(file, stream);
    gaze(file, function(err, watcher) {
      watcher.on('all', function(event, file) {
        render(file, stream);
      });
    });
  });
  sock.install(server, '/rdd');

};

module.exports = serve;
