# rdd [![npm Version](https://badgen.net/npm/v/rdd)](https://www.npmjs.org/package/rdd) [![Build Status](https://badgen.net/travis/yuanqing/rdd?label=build)](https://travis-ci.org/yuanqing/rdd)

> Preview your Markdown locally as it would appear on GitHub, with live updating

## Quick start

Requires [Node.js](https://nodejs.org/).

```sh
$ ls
README.md
$ npm i -g rdd
$ rdd -o
Serving on 0.0.0.0:8888/README.md
```

Here we’re using the `-o` flag (`--open` works, too) to open the rendered page in our default web browser. The page will be updated automatically whenever we change `README.md`. This is useful for [Readme Driven Development](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html).

## Usage

```
rdd [file]

Renders the given Markdown file

Options:
  --help      Show help                                                [boolean]
  --version   Show version number                                      [boolean]
  --open, -o  Open the rendered Markdown file in your default web browser
                                                                       [boolean]
  --port, -p  Set the preferred port to serve your Markdown file        [number]
```

## Installation

```sh
$ yarn global add rdd
```

## Known issues

- Syntax highlighting for code blocks (using [Highlight.js](https://github.com/isagalaev/highlight.js)) is slightly different from what GitHub actually uses

## Prior art

- [Grip](https://github.com/joeyespo/grip) is a similar tool written in Python

## License

[MIT](LICENSE.md)
