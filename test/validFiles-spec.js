/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-as-promised'))
const expect = chai.expect
const {validFiles, withParentsAndChildren} = require('../src/validFiles')
const mockfs = require('mock-fs')

describe('validFiles:', function () {
  describe('the "withParents"-function', function () {
    it('should return an array of globs matching the parents and children of a file', function () {
      expect(withParentsAndChildren('a/b/c')).to.deep.equal([
        'a/',
        'a/b/',
        'a/b/c{,/**}'
      ])
    })

    it('should work for files ending with "/"', function () {
      expect(withParentsAndChildren('a/b/c/')).to.deep.equal([
        'a/',
        'a/b/',
        'a/b/c{,/**}'
      ])
    })
  })

  describe('the "validFiles"-function"', function () {
    afterEach(() => mockfs.restore())

    it('should return the files included into an npm-package', function () {
      mockfs({
        'package.json': '', 'README.md': '', 'LICENSE.md': '', 'file1.txt': '', 'file2.txt': ''
      })
      return expect(validFiles('.', {}, []).then(files => files.sort()))
        .to.eventually.deep.equal([
          '/', 'LICENSE.md', 'README.md', 'file1.txt', 'file2.txt', 'package.json'
        ])
    })

    it('should include files from the files-property of package.json', function () {
      mockfs({
        'package.json': '', 'README.md': '', 'LICENSE.md': '', 'file1.txt': '', 'file2.txt': ''
      })
      return expect(validFiles('.', {files: ['file1.txt']}, []).then(files => files.sort()))
        .to.eventually.deep.equal([
          '/', 'LICENSE.md', 'README.md', 'file1.txt', 'package.json'
        ])
    })

    it('should include dirs with children from the files-property of package.json', function () {
      mockfs({
        'package.json': '', 'README.md': '', 'LICENSE.md': '', 'dir/file1.txt': '', 'dir/file2.txt': '', 'file3.txt': ''
      })
      return expect(validFiles('.', {files: ['dir']}, []).then(files => files.sort()))
        .to.eventually.deep.equal([
          '/', 'LICENSE.md', 'README.md', 'dir/', 'dir/file1.txt', 'dir/file2.txt', 'package.json'
        ])
    })

    it('should look for case insensitive license and readme file', function () {
      mockfs({
        'package.json': '', 'readme.md': '', 'license.md': '', 'file1.txt': '', 'file2.txt': ''
      })
      return expect(validFiles('.', {files: ['file1.txt']}, []).then(files => files.sort()))
        .to.eventually.deep.equal([
          '/', 'file1.txt', 'license.md', 'package.json', 'readme.md'
        ])
    })

    it('should not include .git files', function () {
      mockfs({
        'package.json': '', '.git/a': '', '.git/b': '', 'readme.md': '', 'license.md': ''
      })
      return expect(validFiles('.', {}, []).then(files => files.sort()))
        .to.eventually.deep.equal([
          '/', 'license.md', 'package.json', 'readme.md'
        ])
    })

    it('should not even include .git files if they are in the files property', function () {
      mockfs({
        'package.json': '', '.git/a': '', '.git/b': '', 'README.md': '', 'LICENSE.md': ''
      })
      return expect(validFiles('.', {files: ['.git']}, []).then(files => files.sort()))
        .to.eventually.deep.equal([
          '/', 'LICENSE.md', 'README.md', 'package.json'
        ])
    })
  })
})
