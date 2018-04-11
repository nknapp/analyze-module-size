const path = require('path')
const {findPackages} = require('./find-packages')
var {Package} = require('./Package')
var pmap = require('p-map')
const deep = require('deep-aplus')(Promise)
const {NullProgressHandler} = require('./progress')

class DependencyTree {
  /**
   * @param {Package} prod package containing the production dependencies (and the files in the repository itself)
   * @param {Package[]} dev packages in the devDependencies
   * @param {Package[]} manual manually installed packages (non-dependencies)
   * @param {Package[]} missing packages whose dependent could not be found
   * @param {Package[]} all all packages in a node_modules directory, in a flat list.
   */
  constructor (rootPackage, prod, dev, manual, missing, all) {
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
    this.missing = missing
    /**
     * @type {Package[]}
     */
    this.all = all
  }

  static loadFrom (packageJsonPath, progressHandler = new NullProgressHandler()) {
    // Compute "this" package
    var rootPackage = Package.loadFrom(packageJsonPath)

    // Compute dependencies
    var cwd = path.dirname(packageJsonPath)

    var dependencies = findPackages(cwd, progressHandler)
      .then((dependencies) => {
        progressHandler.allDependenciesFound(dependencies.length)

        // Load all dependency with a concurrency level of 4
        // Empiric tests show that it is not really slower than running fully parallel,
        // but the progress bar behaves much more consistent.
        return pmap(
          dependencies,
          (packageJson) => {
            return Package.loadFrom(path.join(cwd, packageJson))
              .then(pkg => {
                progressHandler.dependencyLoaded(pkg)
                return pkg
              })
          },
          {concurrency: 4}
        )
      })
    return deep({rootPackage, dependencies}).then(function ({rootPackage, dependencies}) {
      progressHandler.connectAll()
      var {prod, dev, manual, missing} = Package.connectAll(rootPackage, dependencies)
      progressHandler.done()
      return new DependencyTree(
        rootPackage,
        prod,
        dev,
        manual,
        missing,
        dependencies
      )
    })
  }
}

module.exports = {DependencyTree}
