#!/usr/bin/env node

var {analyze} = require('../src/index')

var realFs = require('fs')
var gracefulFs = require('graceful-fs')
var {ProgressHandler} = require('../src/progress')

gracefulFs.gracefulify(realFs)

analyze(process.cwd(), {progress: new ProgressHandler(process.stderr), depth: process.argv[2]})
  .then(
    (output) => {
      return process.stdout.write(output)
    },
    (err) => process.stderr.write(err.stack + '\n')
  )
