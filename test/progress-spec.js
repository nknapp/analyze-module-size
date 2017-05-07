/* eslint-env mocha */

const chai = require('chai')
chai.use(require('dirty-chai'))
chai.use(require('chai-as-promised'))
const expect = chai.expect
const {ProgressHandler} = require('../src/progress')

const concat = require('concat-stream')

describe('progress:', function () {
  describe('the ProgressHandler', function (done) {
    it('should log the progress', function () {
      var stream = null

      const check = new Promise((resolve, reject) => {
        stream = concat(function (contents) {
          try {
            expect(contents).to.equal(`
dependencies found: 1 ...done

Loading dependency details: =--- a
Loading dependency details: ==-- b
Loading dependency details: ===- c
Loading dependency details: ==== d
Connecting dependency graph
done
--end--`)
          } catch (e) {
            return reject(e)
          }
          resolve()
        })
        stream.isTTY = true
        stream.columns = 80
        stream.rows = 25
        stream.cursorTo = function () {
          this.write('\n')
        }
        stream.clearLine = function (n) {
        }
      })

      var progress = new ProgressHandler(stream)

      var calls = Promise.resolve()
        .then(() => progress.dependencyFound('abc'))
        .then(() => delay())
        .then(() => progress.allDependenciesFound(4))
        .then(() => delay())
        .then(() => progress.dependencyLoaded(mockPkg('a')))
        .then(() => delay())
        .then(() => progress.dependencyLoaded(mockPkg('b')))
        .then(() => delay())
        .then(() => progress.dependencyLoaded(mockPkg('c')))
        .then(() => delay())
        .then(() => progress.dependencyLoaded(mockPkg('d')))
        .then(() => delay())
        .then(() => progress.connectAll())
        .then(() => delay())
        .then(() => progress.done())
        .then(() => delay())
        .then(() => stream.end('--end--'))

      return Promise.all([calls, check])
    })
  })
})

function delay (ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms || 20))
}

function mockPkg (location) {
  return {
    location: () => location
  }
}
