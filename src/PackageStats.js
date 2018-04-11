const path = require('path')
const deep = require('deep-aplus')(Promise)
const pify = require('pify')
const fs = require('fs')
const stat = pify(fs.stat)
const {validFiles} = require('./validFiles')

/**
 * Computes and aggregates a number of statistics from a package directory
 * in the node_modules folder
 *
 */
class PackageStats {
  /**
   * Create a new PackageStats object
   * @param {string} directory path to the package-json files
   * @param {{file: string, stat: fs.Stats}[]} files files and stats in this package
   */
  constructor (directory, files) {
    /**
     * @type {string}
     */
    this.directory = directory
    /**
     * @type {{file: string, stat: fs.Stats}[]}
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
    if (!this._totalBlockSize) {
      this._totalBlockSize = this.files.reduce((result, file) => {
        const blksize = file.stat.blksize || 4096 // On NTFS, the blksize is NaN (#5). In order to get a result at all, we assume 4kb for NaN and 0.
        return result + Math.ceil(file.stat.size / blksize) * blksize
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
   * Create PackageStats from the location of a package.json file
   *
   * @param packageJsonPath path to the package.json file
   * @param {Promise<object>|object=} packageJson the parse package.json file,
   *    either directly or as Promise
   * @return {Promise<PackageStats>} a promise for the PackageStats object
   */
  static loadFrom (packageJsonPath, packageJson = {}) {
    const directory = path.dirname(packageJsonPath)

    return Promise.resolve(packageJson)
      .then((packageJson) => validFiles(directory, packageJson))
      // Add the directory itself
      .then(files => files.map((file) => path.normalize(file)))
      // Gather stats
      .then(files => files.map(file => {
        return {
          file: path.join(directory, file),
          stat: stat(path.join(directory, file))
        }
      }))
      // Wait for promises
      .then(deep)
      // create PackageStats-object
      .then((files) => new PackageStats(directory, files))
  }
}

module.exports = {PackageStats}
