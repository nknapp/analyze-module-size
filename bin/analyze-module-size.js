#!/usr/bin/env node

const {analyze} = require('../src/index')
const {ProgressHandler} = require('../src/progress')
const program = require('commander')
require('graceful-fs').gracefulify(require('fs'))

program
  .version(require('../package').version)
  .description('Analyzes the size of the package in the current directories, ' +
    'including the size of (production) dependencies')
  .usage('[options]')
  .option('-d, --depth <levels>', 'Show only dependencies up to a given depth of recursion')
  .parse(process.argv)

analyze(process.cwd(), {progress: new ProgressHandler(process.stderr), depth: program.depth})
  .then(
    (output) => {
      return process.stdout.write(output)
    },
    (err) => process.stderr.write(err.stack + '\n')
  )
