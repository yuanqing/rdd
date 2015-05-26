'use strict';

var ecstatic = require('ecstatic');
var fs = require('fs');
var gaze = require('gaze');
var http = require('http');
var Remarkable = require('remarkable');
var shoe = require('shoe');
var hljs = require('highlight.js');

var md = new Remarkable('full', {
  html: true,
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {}
    }
    return '';
  }
});

var render = function(file, stream) {
  stream.write(md.render(fs.readFileSync(file, 'utf8')));
};

var serve = function(file, port, cb) {

  var server = http.createServer(ecstatic(__dirname));
  server.listen(port);

  var sock = shoe(function(stream) {
    render(file, stream);
    gaze(file, function(err, watcher) {
      if (err) {
        return cb(err);
      }
      watcher.on('changed', function() {
        render(file, stream);
      });
      watcher.on('deleted', function() {
        server.close();
        watcher.close();
        cb(file + ': No such file');
      });
    });
  });
  sock.install(server, '/rdd');

  return server;

};

module.exports = serve;
