# analyze-module-size 

[![NPM version](https://badge.fury.io/js/analyze-module-size.svg)](http://badge.fury.io/js/analyze-module-size)
[![Travis Build Status](https://travis-ci.org/nknapp/analyze-module-size.svg?branch=master)](https://travis-ci.org/nknapp/analyze-module-size)
[![Coverage Status](https://img.shields.io/coveralls/nknapp/analyze-module-size.svg)](https://coveralls.io/r/nknapp/analyze-module-size)

> Analyze the size of your module dependencies

`analyze-module-size` shows you, why your package is so large. The reason for the size
of your package often lies in the dependencies you are using. For example [request](https://npmjs.com/package/request)@2.81.0` 
is 7080kb large (including its 53 dependencies) and it comes with a lot of libraries that you may not even need. If you are aware of that, you may choose to use a different library
(e.g. [popsicle](https://npmjs.com/package/popsicle)).

The module [cost-of-modules](https://npmjs.com/package/cost-of-modules) does the same, but it only shows one level of the 
dependency tree. It was an inspiration, but I took no code from it.

Finally, this program still has a lot of opportunities for enhancement. If you have
wishes, ideas or questions, please open an issue.

# Installation

```
npm install -g analyze-module-size
```

# Usage

Run `analyze-module-size` in your project directory. The output will be something like this:
(Note that the displayed sizes are accumulated from the each module an its dependencies):

```
size: 64k... with-dependencies: 1116k
├─┬ globby@6.1.0, 484k, 17 deps
│ ├─┬ glob@7.1.1, 340k, 10 deps
│ │ ├─┬ minimatch@3.0.4, 132k, 3 deps
│ │ │ └─┬ brace-expansion@1.1.7, 84k, 2 deps
│ │ │   ├── concat-map@0.0.1, 40k, 0 deps
│ │ │   └── balanced-match@0.4.2, 24k, 0 deps
│ │ ├─┬ inflight@1.0.6, 60k, 2 deps
│ │ │ ├─┬ once@1.4.0, 40k, 1 deps
│ │ │ │ └── wrappy@1.0.2, 20k, 0 deps
│ │ │ └── wrappy@1.0.2, 20k, 0 deps
│ │ ├─┬ once@1.4.0, 40k, 1 deps
│ │ │ └── wrappy@1.0.2, 20k, 0 deps
│ │ ├── fs.realpath@1.0.0, 32k, 0 deps
│ │ ├── inherits@2.0.3, 24k, 0 deps
│ │ └── path-is-absolute@1.0.1, 20k, 0 deps
│ ├─┬ pinkie-promise@2.0.1, 44k, 1 deps
│ │ └── pinkie@2.0.4, 24k, 0 deps
│ ├─┬ array-union@1.0.2, 40k, 1 deps
│ │ └── array-uniq@1.0.3, 20k, 0 deps
│ ├── object-assign@4.1.1, 20k, 0 deps
│ └── pify@2.3.0, 20k, 0 deps
├─┬ glob@7.1.1, 340k, 10 deps
│ ├─┬ minimatch@3.0.4, 132k, 3 deps
│ │ └─┬ brace-expansion@1.1.7, 84k, 2 deps
│ │   ├── concat-map@0.0.1, 40k, 0 deps
│ │   └── balanced-match@0.4.2, 24k, 0 deps
│ ├─┬ inflight@1.0.6, 60k, 2 deps
│ │ ├─┬ once@1.4.0, 40k, 1 deps
│ │ │ └── wrappy@1.0.2, 20k, 0 deps
│ │ └── wrappy@1.0.2, 20k, 0 deps
│ ├─┬ once@1.4.0, 40k, 1 deps
│ │ └── wrappy@1.0.2, 20k, 0 deps
│ ├── fs.realpath@1.0.0, 32k, 0 deps
│ ├── inherits@2.0.3, 24k, 0 deps
│ └── path-is-absolute@1.0.1, 20k, 0 deps
├─┬ chalk@1.1.3, 144k, 6 deps
│ ├─┬ has-ansi@2.0.0, 40k, 1 deps
│ │ └── ansi-regex@2.1.1, 20k, 0 deps
│ ├─┬ strip-ansi@3.0.1, 40k, 1 deps
│ │ └── ansi-regex@2.1.1, 20k, 0 deps
│ ├── ansi-styles@2.2.1, 20k, 0 deps
│ ├── escape-string-regexp@1.0.5, 20k, 0 deps
│ └── supports-color@2.0.0, 20k, 0 deps
├─┬ debug@2.6.6, 128k, 1 deps
│ └── ms@0.7.3, 20k, 0 deps
├─┬ commander@2.9.0, 88k, 1 deps
│ └── graceful-readlink@1.0.1, 28k, 0 deps
├── archy@1.0.0, 52k, 0 deps
├── graceful-fs@4.1.11, 48k, 0 deps
├─┬ deep-aplus@1.0.4, 44k, 1 deps
│ └── lodash.isplainobject@4.0.6, 20k, 0 deps
├── progress@2.0.0, 44k, 0 deps
├── p-map@1.1.1, 20k, 0 deps
└── pify@2.3.0, 20k, 0 deps
```

## CLI options

```
Usage: analyze-module-size [options]

  Analyzes the size of the package in the current directories, including the size of (production) dependencies

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -d, --depth <levels>  Show only dependencies up to a given depth of recursion
```



# License

`analyze-module-size` is published under the MIT-license.

See [LICENSE.md](LICENSE.md) for details.


# Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
# Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).