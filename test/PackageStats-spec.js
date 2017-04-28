/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect
const {PackageStats} = require('../src/PackageStats')

describe('The PackageStats-class', function () {
  it('should load the package-stats from a directory', function () {
    return PackageStats.loadFrom('test/fixtures/project1/package.json')
      .then((packageStats) => {
        expect(packageStats.directory).to.equal('test/fixtures/project1')
        expect(sortedNameAndSize(packageStats.files)).to.deep.equal([
          'test/fixtures/project1/ - 4096',
          'test/fixtures/project1/dir/ - 4096',
          'test/fixtures/project1/dir/file2.txt - 2',
          'test/fixtures/project1/file3.txt - 3',
          'test/fixtures/project1/file5000.txt - 5000',
          'test/fixtures/project1/file6.txt - 6',
          'test/fixtures/project1/package.json - 148'
        ])
      })
  })

  it('should compute the byte-size of all the files in a directory', function () {
    return PackageStats.loadFrom('test/fixtures/project1/package.json')
      .then((packageStats) => {
        expect(packageStats.totalByteSize()).to.equal(4096 + 4096 + 2 + 3 + 5000 + 6 + 148)
        expect(packageStats.totalByteSize(), 'Call twice to cover else-branch in coverage-report')
          .to.equal(4096 + 4096 + 2 + 3 + 5000 + 6 + 148)
      })
  })

  it('should compute the disk usage (by whole blocks) of the directory', function () {
    return PackageStats.loadFrom('test/fixtures/project1/package.json')
      .then((packageStats) => {
        expect(packageStats.totalBlockSize()).to.equal(8 * 4096)
        expect(packageStats.totalBlockSize(), 'Call twice to cover else-branch in coverage-report').to.equal(8 * 4096)
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
          'test/fixtures/project1/ - 4096',
          'test/fixtures/project1/dir/ - 4096',
          'test/fixtures/project1/dir/file2.txt - 2',
          'test/fixtures/project1/file3.txt - 3',
          'test/fixtures/project1/file5000.txt - 5000',
          'test/fixtures/project1/file6.txt - 6',
          'test/fixtures/project1/package.json - 148',
          'test/fixtures/project2/ - 4096',
          'test/fixtures/project2/file10.txt - 10',
          'test/fixtures/project2/package.json - 156'
        ])
      })
  })
})

function sortedNameAndSize (files) {
  return files.map((file) => file.file + ' - ' + file.stat.size).sort()
}
