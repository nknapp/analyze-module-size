#!/usr/bin/env node

var {analyze} = require('../src/index')
analyze(process.cwd())
  .then(
    (output) => process.stdout.write(output),
    (err) => process.stderr.write(err.stack + '\n')
  )
