const path = require('path')
const deep = require('deep-aplus')(Promise)
const pify = require('pify')
const glob = pify(require('glob'))
var {Package} = require('./Package')

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

    // Compute dependencies
    var cwd = path.dirname(packageJsonPath)
    var dependencies = glob('**/node_modules/*/package.json', {cwd})
      .then((dependencies) => {
        return dependencies
        // Only allow paths liks node_modules/pkg-name/node_modules/pkg-name/node_modules/pkg-name/package.json
          .filter((packageJson) => {
            return packageJson.match(/^(node_modules\/[^/]*\/)*package.json/)
          })
          .map((packageJson) => Package.loadFrom(path.join(cwd, packageJson)))
      })

    return deep({rootPackage, dependencies}).then(function ({rootPackage, dependencies}) {
      var {prod, dev, manual} = Package.connectAll(rootPackage, dependencies)
      return new DependencyTree(rootPackage, prod.dependencies, dev.dependencies, manual.dependencies, dependencies)
    })
  }
}

module.exports = {DependencyTree}
