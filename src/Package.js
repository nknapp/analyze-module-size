const deep = require('deep-aplus')(Promise)
const pify = require('pify')
const fs = require('fs')
const readFile = pify(fs.readFile)
const {PackageStats} = require('./PackageStats')
const debug = require('debug')('analyze-module-size:Package')

/**
 * Computes and aggregates a number of statistics from a package directory
 * in the node_modules folder
 *
 */
class Package {
  /**
   * Create a new Package object
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
   * @param {object<Package>} packageIndex packages as returned by Package#indexByLocation
   */
  connect (packageIndex) {
    if (this.packageJson._requiredBy) {
      this.packageJson._requiredBy.forEach((key) => {
        const dependent = packageIndex.get(key) || Package.dummyForMissingDependent(key, packageIndex)
        this.dependents.push(dependent)
        dependent.dependencies.push(this)
      })
    }
  }

  totalStats () {
    return this.stats.merge(Array.from(this.collectDependencies()).map((dep) => dep.stats))
  }

  totalDependencies () {
    return this.collectDependencies().size
  }

  /**
   * Reduce-function that not reduces the direct and recursive dependencies
   */
  collectDependencies (collector = new Set()) {
    this.dependencies.forEach(function (dep) {
      if (collector.has(dep)) return
      collector.add(dep)
      dep.collectDependencies(collector)
    })
    return collector
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
    debug('Loading package', packageJsonPath)
    var json = readFile(packageJsonPath).then(JSON.parse)
    var stats = PackageStats.loadFrom(packageJsonPath, json)
    return deep({json, stats})
      .then(({json, stats}) => new Package(json, stats))
      .then(result => {
        debug('Done loading package', packageJsonPath)
        return result
      })
  }

  /**
   * Return an object of packages indexed by their location
   * @param {Package[]} packages
   * @return {object<Package>}
   */
  static indexByLocation (packages) {
    const map = new Map(packages.map(p => [p.location(), p]))
    map.set('#USER', new Package({id: '#USER'}))
    map.set('#DEV:/', new Package({id: '#DEV:/'}))
    map.set('#MISSING', new Package({id: "#MISSING'"}))
    return map
  }

  /**
   * Create a dummy package for a missing dependent.
   * @param location the location of the dummy package (i.e. the entry in the _requiredBy-tag of the dependency
   *   of this package)
   * @param packageIndex the map of all packages (location -> package)
   */
  static dummyForMissingDependent (location, packageIndex) {
    const dummy = new Package({_id: location, _location: location}, new PackageStats(null, []))
    const sparePackage = packageIndex.get('#MISSING')
    packageIndex.set(location, dummy)
    dummy.dependents.push(sparePackage)
    sparePackage.dependencies.push(dummy)
    return dummy
  }

  /**
   * Connect a like of packages. The list may contain packages and arrays of packages. It will be flattened
   * @param {(Package|Package[])[]} packages the list of packages or list of packages
   * @return {object} an object containing dependencies of the following kind:
   *   prod ("dependencies"), dev ("devDependencies"), manual ("manually installed by the user"),
   *   missing ("implicitly found as dependent of another package")
   */
  static connectAll (...packages) {
    debug('Connect all')
    // flatten
    const flatPackages = Array.prototype.concat.apply([], packages)
    const packageIndex = Package.indexByLocation(flatPackages)
    flatPackages.forEach((pkg) => pkg.connect(packageIndex))
    debug('Done connect all')
    return {
      prod: packageIndex.get('/').dependencies,
      dev: packageIndex.get('#DEV:/').dependencies,
      manual: packageIndex.get('#USER').dependencies,
      missing: packageIndex.get('#MISSING').dependencies
    }
  }
}

module.exports = {Package}
