'use strict';

var shoe = require('shoe');
var through = require('through2');

var result = document.querySelectorAll('.markdown-body')[0];

var stream = shoe('/rdd');
stream.pipe(through(function(chunk, encoding, cb) {
  result.innerHTML = chunk;
  cb();
})).pipe(stream);
