'use strict';

var ecstatic = require('ecstatic');
var fs = require('fs');
var Gaze = require('gaze');
var hljs = require('highlight.js');
var http = require('http');
var Remarkable = require('remarkable');
var shoe = require('shoe');

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

  var watcher;

  var watch = function(stream) {
    var gaze = new Gaze(file);
    gaze.on('changed', function() {
      render(file, stream);
    });
    gaze.on('deleted', function() {
      close();
      cb(file + ': No such file');
    });
    return gaze;
  };

  var close = function() {
    server.close();
    watcher.close();
  };

  var sock = shoe(function(stream) {
    render(file, stream);
    watcher = watch(stream);
  });
  sock.install(server, '/rdd');

  return close;

};

module.exports = serve;
