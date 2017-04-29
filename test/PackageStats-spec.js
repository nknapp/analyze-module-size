/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const {PackageStats} = require('../src/PackageStats')
const fs = require('fs')

describe('The PackageStats-class', function () {
  it('should load the package-stats from a directory', function () {
    return PackageStats.loadFrom('test/fixtures/project1/package.json')
      .then((packageStats) => {
        expect(packageStats.directory).to.equal('test/fixtures/project1')
        expect(sortedNameAndSize(packageStats.files)).to.deep.equal([
          f('test/fixtures/project1/'),
          f('test/fixtures/project1/dir/'),
          f('test/fixtures/project1/dir/file2.txt'),
          f('test/fixtures/project1/file3.txt'),
          f('test/fixtures/project1/file5000.txt'),
          f('test/fixtures/project1/file6.txt'),
          f('test/fixtures/project1/package.json')
        ])
      })
  })

  it('should compute the byte-size of all the files in a directory', function () {
    return PackageStats.loadFrom('test/fixtures/project1/package.json')
      .then((packageStats) => {
        var expectedSize = sumSize(
          'test/fixtures/project1/',
          'test/fixtures/project1/dir/',
          'test/fixtures/project1/dir/file2.txt',
          'test/fixtures/project1/file3.txt',
          'test/fixtures/project1/file5000.txt',
          'test/fixtures/project1/file6.txt',
          'test/fixtures/project1/package.json')
        expect(packageStats.totalByteSize()).to.equal(expectedSize)
        expect(packageStats.totalByteSize(), 'Call twice to cover else-branch in coverage-report')
          .to.equal(expectedSize)
      })
  })

  it('should compute the disk usage (by whole blocks) of the directory', function () {
    var expectedSize = sumBlocksize(
      'test/fixtures/project1/',
      'test/fixtures/project1/dir/',
      'test/fixtures/project1/dir/file2.txt',
      'test/fixtures/project1/file3.txt',
      'test/fixtures/project1/file5000.txt',
      'test/fixtures/project1/file6.txt',
      'test/fixtures/project1/package.json')
    return PackageStats.loadFrom('test/fixtures/project1/package.json')
      .then((packageStats) => {
        expect(packageStats.totalBlockSize()).to.equal(expectedSize)
        expect(packageStats.totalBlockSize(), 'Call twice to cover else-branch in coverage-report').to.equal(expectedSize)
      })
  })

  it('should merge two stats-object by unioning the files', function () {
    return Promise.all([
      PackageStats.loadFrom('test/fixtures/project1/package.json'),
      PackageStats.loadFrom('test/fixtures/project2/package.json'),
      PackageStats.loadFrom('test/fixtures/project1/package.json')
    ])
      .then((packages) => {
        // Merge package with the first package being the main package
        const merged = packages[0].merge(packages.slice(1))
        expect(merged, 'Must return a copy').not.to.equal(packages[0])
        expect(merged.directory).to.equal('test/fixtures/project1')
        expect(sortedNameAndSize(merged.files)).to.deep.equal([
          f('test/fixtures/project1/'),
          f('test/fixtures/project1/dir/'),
          f('test/fixtures/project1/dir/file2.txt'),
          f('test/fixtures/project1/file3.txt'),
          f('test/fixtures/project1/file5000.txt'),
          f('test/fixtures/project1/file6.txt'),
          f('test/fixtures/project1/package.json'),
          f('test/fixtures/project2/'),
          f('test/fixtures/project2/file10.txt'),
          f('test/fixtures/project2/package.json')
        ])
      })
  })
})

function sortedNameAndSize (files) {
  return files.map((file) => file.file + ' - ' + file.stat.size).sort()
}

/**
 * Augment filename by size for expected values in test-conditions
 * @param {string} file path to the file
 * @return {string} file - size
 */
function f (file) {
  return `${file} - ${fs.statSync(file).size}`
}

/**
 * Compute the bytesize-sum of all given files
 * @param {...string} files a list of filenames
 */
function sumSize (...files) {
  return files.reduce((sum, file) => sum + fs.statSync(file).size, 0)
}

/**
 * Compute the blocksize-sum of all given files (ceil the size of each file up to the next block size multiple)
 * @param {...string} files a list of filenames
 */
function sumBlocksize (...files) {
  return files.reduce((sum, file) => {
    const stat = fs.statSync(file)
    return sum + Math.ceil(stat.size / stat.blksize) * stat.blksize
  }, 0)
}
