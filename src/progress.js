const debug = require('debug')('analyze-module-size:progress')
const ProgressBar = require('progress')

class ProgressHandler {
  constructor (stream) {
    this.stream = stream
    this.foundDepsProgress = new ProgressBar('dependencies found: :current', {total: 1000000, stream: this.stream})
    this.loadedDepsProgress = null
  }

  /**
   * Notify the user that a dependency (package.json in node_modules) has been found
   * @param {string} file the path to the package.json file
   */
  dependencyFound (file) {
    this.foundDepsProgress.tick()
  }

  allDependenciesFound (dep) {
    this.stream.write(' ...done\n')
    this.loadedDepsProgress = new ProgressBar('Loading dependency details: :bar :locationxxxxxxxxxxxxxxxxxx', {
      total: dep,
      stream: this.stream
    })
  }

  /**
   * Update the progressbar after a dependency has been loaded.
   * (Increase the tick-count)
   */
  dependencyLoaded (pkg) {
    this.loadedDepsProgress.tick({locationxxxxxxxxxxxxxxxxxx: pkg.location().substr(0, 'locationxxxxxxxxxxxxxxxxxx'.length)})
  }

  connectAll () {
    this.stream.write('Connecting dependency graph\n')
  }

  done () {
    this.stream.write('done\n')
  }
}

/**
 * No actual output (only if DEBUG=anaylze-module-size:progress)
 */
class NullProgressHandler {
  dependencyFound (file) {
    debug('dependencyFound', file)
  }

  allDependenciesFound (count) {
    debug('allDependenciesFound', count)
  }

  dependencyLoaded (pkg) {
    debug('dependencyLoaded', pkg.location())
  }

  connectAll () {
    debug('connectAll')
  }

  done () {
    debug('done')
  }
}

module.exports = {ProgressHandler, NullProgressHandler}
