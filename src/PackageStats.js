const path = require('path')
const deep = require('deep-aplus')(Promise)
const pify = require('pify')
const fs = require('fs')
const stat = pify(fs.stat)
const glob = pify(require('glob'))

/**
 * Computes and aggregates a number of statistics from a package directory
 * in the node_modules folder
 *
 */
class PackageStats {
  /**
   * Create a new PackageStats object
   * @param {string} directory path to the package-json files
   * @param {{file: string, stat: fs.Stats}} files files and stats in this package
   */
  constructor (directory, files) {
    /**
     * @type {string}
     */
    this.directory = directory
    /**
     * @type {{file: string, stat: fs.Stats}}
     */
    this.files = files
  }

  totalByteSize () {
    if (!this._totalByteSize) {
      this._totalByteSize = this.files.reduce((result, file) => result + file.stat.size, 0)
    }
    return this._totalByteSize
  }

  totalBlockSize () {
    if (!this._totalBlocksize) {
      this._totalBlockSize = this.files.reduce((result, file) => {
        return result + Math.ceil(file.stat.size / file.stat.blksize) * file.stat.blksize
      }, 0)
    }
    return this._totalBlockSize
  }

  /**
   * Returns a new PackageStats-object with the same directory
   * and the union of all files in this package and the other packages
   * @param {PackageStats[]} packages
   */
  merge (packages) {
    var uniq = {}
    // Merge files
    this.files.forEach(file => { uniq[file.file] = file })
    packages.forEach(pkg => {
      pkg.files.forEach(file => { uniq[file.file] = file })
    })
    // Recreate file array
    var files = Object.keys(uniq).map((key) => uniq[key])
    return new PackageStats(this.directory, files)
  }

  /**
   *
   * @param packageJsonPath
   * @return {Promise<PackageStats>}
   */
  static loadFrom (packageJsonPath) {
    var directory = path.dirname(packageJsonPath)
    return glob('**', {dot: true, cwd: directory, mark: true, ignore: 'node_modules/**'})
    // Add the directory itself
      .then(files => ['./'].concat(files))
      // Gather stats
      .then(files => files.map(file => ({file: path.join(directory, file), stat: stat(path.join(directory, file))})))
      // Wait for promises
      .then(deep)
      // creaate PackageStats-object
      .then((files) => new PackageStats(directory, files))
  }
}

module.exports = {PackageStats}
