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
  // Output varies depending on the fs blocksize
  const blksize = fs.statSync(__filename).blksize || 4096

  it('should return an archy-tree for the dependencies of the referenced package directory', function () {
    return analyze('test/fixtures/moduleWithDeps')
      .then((result) => {
        expect(result).to.equal(fs.readFileSync(`test/fixtures/moduleWithDeps-blk${blksize}-${process.platform}.txt`, 'utf-8'))
      })
  })

  it('should cut the display at a specific depth if specified', function () {
    return analyze('test/fixtures/moduleWithDeps', {depth: 1})
      .then((result) => {
        expect(result).to.equal(fs.readFileSync(`test/fixtures/moduleWithDeps-depth1-blk${blksize}-${process.platform}.txt`, 'utf-8'))
      })
  })

  it('should handle cyclic dependencies gracefully', function () {
    return analyze('test/fixtures/moduleWithCyclicDeps')
      .then((result) => {
        // The size numbers in this test are irrelevant. In order to keep the test compatible on multiple platforms,
        // all sizes are set to 42k
        expect(k24(result)).to.equal(k24(fs.readFileSync(`test/fixtures/moduleWithCyclicDeps.txt`, 'utf-8')))
      })
  })

  it('should handle missing dependents gracefully', function () {
    return analyze('test/fixtures/moduleWithMissingDependent')
      .then((result) => {
        // The size numbers in this test are irrelevant. In order to keep the test compatible on multiple platforms,
        // all sizes are set to 42k
        expect(k24(result)).to.equal(k24(fs.readFileSync(`test/fixtures/moduleWithMissingDependent.txt`, 'utf-8')))
      })
  })
})

/**
 * Replace all kilobyte-numbers by 42k for comparibility if the numbers should not be part of the test
 * @param string
 * @return {*}
 */
function k24 (string) {
  return string.replace(/\d+k/g, '42k')
}
