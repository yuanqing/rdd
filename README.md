# rdd [![npm Version](https://badgen.net/npm/v/rdd)](https://www.npmjs.org/package/rdd) [![Build Status](https://badgen.net/travis/yuanqing/rdd?label=build)](https://travis-ci.org/yuanqing/rdd)

> Preview your Markdown locally as it would appear on GitHub, with live updating

`rdd` is short for [Readme Driven Development](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html).

## Quick start

_Requires [Node.js](https://nodejs.org/)._

```sh
$ ls
README.md
$ npm i -g rdd
$ rdd -o -d
Serving on 0.0.0.0:8888/README.md
```

Here we’re using the `-o` flag to open the rendered Markdown file in our default web browser, and the `-d` flag to enable dark mode. The rendered page will be updated automatically whenever we edit and save `README.md`.

## Usage

```
rdd [file]

Render and serve the given Markdown file

Commands:
  rdd format [files..]  Auto-format the given Markdown files      [aliases: fmt]
  rdd serve [file]      Render and serve the given Markdown file       [default]
  rdd toc [files..]     Insert a table of contents into the given Markdown files

Positionals:
  file                                                                  [string]

Options:
  --help        Show help                                              [boolean]
  --version     Show version number                                    [boolean]
  --dark, -d    Enable dark mode                      [boolean] [default: false]
  --format, -f  Auto-format the Markdown file on save [boolean] [default: false]
  --open, -o    Open the rendered file in your default web browser
                                                      [boolean] [default: false]
  --port, -p    Set the preferred port to serve the rendered file
                                                        [number] [default: 8888]
```

Use `<!-- toc -->` and `<!-- tocstop -->` to [demarcate where the table of contents should be rendered in your Markdown file](https://github.com/jonschlinkert/markdown-toc#tocinsert).

To “commit” the table of contents to your Markdown file, do:

```sh
$ rdd toc
```

## Installation

```sh
$ npm install --global rdd
```

## Known issues

- Syntax highlighting for code blocks (using [Highlight.js](https://github.com/isagalaev/highlight.js)) is slightly different from what GitHub actually uses

## Prior art

- [Grip](https://github.com/joeyespo/grip) is a similar tool written in Python

## License

[MIT](LICENSE.md)
