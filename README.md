# rdd [![npm Version](https://img.shields.io/npm/v/rdd.svg?style=flat)](https://www.npmjs.org/package/rdd) [![Build Status](https://img.shields.io/travis/yuanqing/rdd.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/rdd)

> Preview your `README.md` locally as it would appear on GitHub, with live updating. Useful for [Readme Driven Development](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html).

## Quick start

Requires [Node.js](https://nodejs.org/).

```sh
$ ls
README.md
$ npm install --global rdd
$ rdd --open
Serving on 0.0.0.0:8888
```

Here we&rsquo;re using the `--open` flag (`-o` works, too) to open the rendered page in our default web browser. The page will be updated automatically whenever we change `README.md`.

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

Install via [npm](https://npmjs.com):

```sh
$ npm install --global rdd
```

Or [yarn](https://yarnpkg.com):

```sh
$ yarn global add rdd
```

## Known issues

- Syntax highlighting for code blocks (using [Highlight.js](https://github.com/isagalaev/highlight.js)) is slightly different from what GitHub actually uses
- Does not support [Task Lists](https://help.github.com/articles/about-task-lists/#creating-task-lists)

## Prior art

- [Grip](https://github.com/joeyespo/grip) is a similar tool written in Python

## License

[MIT](LICENSE.md)
