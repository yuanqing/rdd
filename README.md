# rdd.js [![npm Version](http://img.shields.io/npm/v/rdd.svg?style=flat)](https://www.npmjs.org/package/rdd) [![Build Status](https://img.shields.io/travis/yuanqing/rdd.svg?style=flat)](https://travis-ci.org/yuanqing/rdd)

> Preview your `README.md` locally as it would appear on Github, with live updating. Useful for [Readme Driven Development](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html).

## Quick start

Requires [Node.js](https://nodejs.org/).

```
$ ls
README.md
$ npm i -g rdd
$ rdd -o
Serving on localhost:8888
```

Here we&rsquo;re using the `-o` flag to open the rendered page in our default web browser. The page will be updated automatically when we change `README.md`.

## Usage

```
Usage: rdd [file] [options]

File:
  If not specified, tries to find a Readme file (eg. README.md) in the
  current directory.

Options:
  -o, --open       Open the rendered Markdown file in your default web browser
  -p, --port PORT  Set the port to serve the rendered file. Serves on port
                   8888 if not specified.
  -h, --help       Print this message.
```

## Installation

Install via [npm](https://npmjs.com/):

```
$ npm i -g rdd
```

## Known issues

- Syntax highlighting for code blocks (using [Highlight.js](https://github.com/isagalaev/highlight.js)) is slightly different from what Github actually uses
- Does not support emojis or [Task Lists](https://help.github.com/articles/writing-on-github/#task-lists)

## Prior art

- [Grip](https://github.com/joeyespo/grip) is a similar tool written in Python

## License

[MIT](https://github.com/yuanqing/rdd/blob/master/LICENSE)
