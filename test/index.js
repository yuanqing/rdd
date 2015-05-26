'use strict';

var fs = require('fs');
var Nightmare = require('nightmare');
var serve = require('../server.js');
var test = require('tape');

var getMarkdown = function() {
  return document.querySelectorAll('.markdown-body')[0].innerHTML;
};

test('serve(file, port, cb)', function(t) {

  t.test('serves the page on the specified port', function(t) {
    t.plan(2);
    var file = __dirname + '/foo';
    fs.writeFileSync(file, '```js\nx\n```\n```\ny\n```');
    var server = serve(file, 8888, function() {
      t.fail();
    });
    new Nightmare().goto('http://localhost:8888')
      .wait(125)
      .evaluate(getMarkdown, function(result) {
        t.equal(result, '<pre><code class="language-js">x\n</code></pre>\n<pre><code>y\n</code></pre>\n');
      })
      .run(function() {
        fs.unlinkSync(file);
        t.false(fs.existsSync(file));
        server();
      });
  });

  t.test('updates the rendered page when the file changes', function(t) {
    t.plan(3);
    var file = __dirname + '/foo';
    fs.writeFileSync(file, '# foo');
    var server = serve(file, 8888, function() {
      t.fail();
    });
    new Nightmare().goto('http://localhost:8888')
      .wait(125)
      .evaluate(getMarkdown, function(result) {
        t.equal(result, '<h1>foo</h1>\n');
        fs.writeFileSync(file, '# bar');
      })
      .wait(125)
      .evaluate(getMarkdown, function(result) {
        t.equal(result, '<h1>bar</h1>\n');
      })
      .run(function() {
        fs.unlinkSync(file);
        t.false(fs.existsSync(file));
        server();
      });
  });

  t.test('calls `cb` with an error if the file was deleted', function(t) {
    t.plan(3);
    var file = __dirname + '/foo';
    fs.writeFileSync(file, '# foo');
    serve(file, 8888, function(err) {
      t.equals(file + ': No such file', err);
    });
    new Nightmare().goto('http://localhost:8888')
      .wait(125)
      .evaluate(getMarkdown, function(result) {
        t.equal(result, '<h1>foo</h1>\n');
        fs.unlinkSync(file);
      })
      .run(function() {
        t.false(fs.existsSync(file));
      });
  });

});
