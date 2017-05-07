/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-as-promised'))
const expect = chai.expect

const fs = require('fs')
const {analyze} = require('../src/index')

// Enabling chalk in tests is bad for comparability.
require('chalk').enabled = false

describe('The index-function (module main function):', function () {
  it('should return an archy-tree for the dependencies of the referenced package directory', function () {
    return analyze('test/fixtures/moduleWithDeps')
      .then((result) => {
        expect(result).to.equal(fs.readFileSync('test/fixtures/moduleWithDeps.txt', 'utf-8'))
      })
  })

  it('should cut the display at a specific depth if specified', function () {
    return analyze('test/fixtures/moduleWithDeps', {depth: 1})
      .then((result) => {
        expect(result).to.equal(fs.readFileSync('test/fixtures/moduleWithDeps-depth1.txt', 'utf-8'))
      })
  })
})
