#!/usr/bin/env node

var {analyze} = require('../src/index')

var realFs = require('fs')
var gracefulFs = require('graceful-fs')
var tsProgress = require('ts-progress')

gracefulFs.gracefulify(realFs)

const {promise, progress} = analyze(process.cwd(), {depth: process.argv[2]})

var progressBar = null

progress
  .on('dependencies', dep => {
    progressBar = tsProgress.create({
      title: 'Loading package info',
      total: dep * 2
    })
  })
  .on('dep-start-load', pkg => progressBar.update())
  .on('dep-end-load', pkg => progressBar.update())

promise.then(
  (output) => {
    progressBar.done()
    return process.stdout.write(output)
  },
  (err) => process.stderr.write(err.stack + '\n')
)
