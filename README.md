# rddx [![npm Version](https://img.shields.io/npm/v/rdd?cacheSeconds=1800)](https://www.npmjs.org/package/rdd) [![build](https://github.com/yuanqing/rdd/workflows/build/badge.svg)](https://github.com/yuanqing/rdd/actions?query=workflow%3Abuild)

> Preview your Markdown locally as it would appear on GitHub, with live updating

`rdd` is short for [Readme Driven Development](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html).

## Quick start

*Requires [Node.js](https://nodejs.org/).*

```
$ ls
README.md
$ npx rdd --open
Serving on 127.0.0.1:8888/README.md
```

Here we’re using the `--open` flag to open the rendered Markdown file in our default web browser. The rendered page will be updated automatically whenever we edit and save `README.md`.

## Usage

<!-- ``` markdown-interpolate: node src/js/cli.js --help -->
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
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -d, --dark     Enable dark mode                     [boolean] [default: false]
  -f, --format   Auto-format the Markdown file on save[boolean] [default: false]
  -o, --open     Open the rendered file in your default web browser
                                                      [boolean] [default: false]
  -p, --port     Set the preferred port to serve the rendered file
                                                        [number] [default: 8888]
```
<!-- ``` end -->

Use `<!-- toc -->` and `<!-- tocstop -->` to [demarcate where the table of contents should be rendered in your Markdown file](https://github.com/jonschlinkert/markdown-toc#tocinsert).

To “commit” the table of contents to the file, do:

```
$ npx rdd toc
```

## Installation

```
$ npm install --global rdd
```

## Known issues

- Syntax highlighting for code blocks (using [Highlight.js](https://github.com/isagalaev/highlight.js)) is slightly different from what GitHub actually uses

## Prior art

- [Grip](https://github.com/joeyespo/grip) is a similar tool written in Python

## License

[MIT](/LICENSE.md)
