const path = require('path')
const pify = require('pify')
const glob = pify(require('glob'))
var {Package} = require('./Package')
var debug = require('debug')('analyze-module-size:DependencyTree')
var EventEmitter = require('events')
var Promise = require('bluebird')
const deep = require('deep-aplus')(Promise)

class DependencyTree {
  /**
   * @param {Package} prod package containing the production dependencies (and the files in the repository itself)
   * @param {Package} dev package containing the dev-dependencies
   * @param {Package} manual package containing the manually installed dependencies
   * @param {Package[]} all all packages in a node_modules directory, in a flat list.
   */
  constructor (rootPackage, prod, dev, manual, all) {
    this.rootPackage = rootPackage
    /**
     * @type {Package[]}
     */
    this.prod = prod
    /**
     * @type {Package[]}
     */
    this.dev = dev
    /**
     * @type {Package[]}
     */
    this.manual = manual
    /**
     * @type {Package[]}
     */
    this.all = all
  }

  static loadFrom (packageJsonPath) {
    // Compute "this" package
    var rootPackage = Package.loadFrom(packageJsonPath)
    const progress = new EventEmitter()

    // Compute dependencies
    var cwd = path.dirname(packageJsonPath)
    var dependencies = glob('**/node_modules/*/package.json', {cwd})
      .then((dependencies) => {
        debug('dependencies resolved')
        progress.emit('unfiltered-dependencies', dependencies.length)
        // Only allow paths liks node_modules/pkg-name/node_modules/pkg-name/node_modules/pkg-name/package.json
        const filteredDependencies = dependencies
          .filter((packageJson) => {
            progress.emit('dep-filtered', dependencies.length)
            return packageJson.match(/^(node_modules\/[^/]*\/)*package.json/)
          })

        debug('dependencies filtered')
        progress.emit('dependencies', filteredDependencies.length)

        // Load all dependency with a concurrency level of 4
        // Empiric tests show that it is not really slower than running fully parallel,
        // but the progress bar behaves much more consistent.
        return Promise.map(
          filteredDependencies,
          (packageJson) => {
            progress.emit('dep-start-load', packageJson)
            return Package.loadFrom(path.join(cwd, packageJson))
              .then(pkg => {
                progress.emit('dep-end-load', packageJson)
                return pkg
              })
          },
          {concurrency: 4}
        )
      })
    return {
      progress: progress,
      promise: deep({rootPackage, dependencies}).then(function ({rootPackage, dependencies}) {
        var {prod, dev, manual} = Package.connectAll(rootPackage, dependencies)
        return new DependencyTree(rootPackage, prod.dependencies, dev.dependencies, manual.dependencies, dependencies)
      })
    }
  }
}

module.exports = {DependencyTree}
