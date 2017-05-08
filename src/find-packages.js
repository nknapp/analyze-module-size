var Glob = require('glob').Glob

/**
 * @param {string} cwd
 * @param {ProgressHandler} progressHandler
 */
function findPackages (cwd, progressHandler) {
  return new Promise((resolve, reject) => {
    const matcher = new Glob(
      '**/node_modules/{@*/,}*/package.json',
      {cwd},
      (err, results) => err ? /* istanbul ignore next */ reject(err) : resolve(results)
    )
    matcher.on('match', function (file) {
      progressHandler.dependencyFound(file)
    })
  })
    .then(dependencies => {
      // Only allow paths liks node_modules/pkg-name/node_modules/pkg-name/node_modules/pkg-name/package.json
      return dependencies.filter((file) => {
        const valid = file.match(/^(node_modules\/(@[^/]*\/)?[^/]*\/)*package.json/)
        return valid
      })
    })
}

module.exports = {findPackages}
