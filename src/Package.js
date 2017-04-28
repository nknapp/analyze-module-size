const deep = require('deep-aplus')(Promise)
const pify = require('pify')
const fs = require('fs')
const readFile = pify(fs.readFile)
const {PackageStats} = require('./PackageStats')

/**
 * Computes and aggregates a number of statistics from a package directory
 * in the node_modules folder
 *
 */
class Package {
  /**
   * Create a new Packageobject
   * @param {object} packageJson the parsed package.json file
   * @param {PackageStats} stats the statistics object
   */
  constructor (packageJson, stats) {
    /**
     * @type {{_id: string, _requiredBy: string[], _location: string}}
     */
    this.packageJson = packageJson
    /**
     * @type {PackageStats}
     */
    this.stats = stats
    this.dependencies = []
    this.dependents = []
  }

  /**
   * Create references to dependencies and dependents
   * contained in the packages-map.
   *
   * @param {object<Package>} packages packages as returned by Package#indexByLocation
   */
  connect (packages) {
    if (this.packageJson._requiredBy) {
      this.packageJson._requiredBy.forEach((key) => {
        const dependent = packages.get(key)
        if (!dependent) {
          throw new Error(`Could not find "${key}" in ${JSON.stringify(Array.from(packages.keys()))}`)
        }
        this.dependents.push(dependent)
        dependent.dependencies.push(this)
      })
    }
  }

  totalStats () {
    return this.stats.merge(this.dependencies.map((dep) => {
      return dep.totalStats()
    }))
  }

  totalDependencies () {
    return this.dependencies.reduce((sum, dep) => sum + dep.totalDependencies() + 1, 0)
  }

  location () {
    return this.packageJson._location || '/'
  }

  /**
   *
   * @param packageJsonPath
   * @return {Promise<PackageStats>}
   */
  static loadFrom (packageJsonPath) {
    var json = readFile(packageJsonPath).then(JSON.parse)
    var stats = PackageStats.loadFrom(packageJsonPath)
    return deep({json, stats})
      .then(({json, stats}) => new Package(json, stats))
  }

  /**
   * Return an object of packages indexed by their location
   * @param {Package[]} packages
   * @return {object<Package>}
   */
  static indexByLocation (packages) {
    const map = new Map(packages.map(p => [p.location(), p]))
    map.set('#USER', new Package())
    map.set('#DEV:/', new Package())
    return map
  }

  /**
   *
   * @param {...(Package|Package[])} packages
   */
  static connectAll (...packages) {
    // flatten
    const flatPackages = Array.prototype.concat.apply([], packages)
    const index = Package.indexByLocation(flatPackages)
    flatPackages.forEach((pkg) => pkg.connect(index))
    return {
      prod: index.get('/'),
      dev: index.get('#DEV:/'),
      manual: index.get('#USER')
    }
  }
}

module.exports = {Package}
