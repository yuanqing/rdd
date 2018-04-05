# rdd [![npm Version](https://img.shields.io/npm/v/rdd.svg?style=flat)](https://www.npmjs.org/package/rdd) [![Build Status](https://img.shields.io/travis/yuanqing/rdd.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/rdd)

> Preview your Markdown locally as it would appear on GitHub, with live updating.

## Quick start

Requires [Node.js](https://nodejs.org/).

```sh
$ ls
README.md
$ npm i -g rdd
$ rdd -o
Serving on 0.0.0.0:8888
```

Here we&rsquo;re using the `-o` flag (`--open` works, too) to open the rendered page in our default web browser. The page will be updated automatically whenever we change `README.md`. This is useful for [Readme Driven Development](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html).

## Usage

```
Usage: rdd [file] [options]

File:
  If not specified, tries to find a Markdown file (eg. README.md) in the
  current directory.

Options:
  -h, --help         Print this message.
  -o, --open         Open the rendered Markdown file in your default
                     web browser.
  -p, --port [port]  Set the preferred port to serve the rendered file.
  -v, --version      Print the version number.
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

## Prior art

- [Grip](https://github.com/joeyespo/grip) is a similar tool written in Python

## License

[MIT](LICENSE.md)
