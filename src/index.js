/*!
 * analyze-module-size <https://github.com/nknapp/analyze-module-size>
 *
 * Copyright (c) 2017 Nils Knappmeier.
 * Released under the MIT license.
 */
var {DependencyTree} = require('./DependencyTree')
const sortby = require('lodash.sortby')
const archy = require('archy')
const chalk = require('chalk')
const path = require('path')

function analyze (cwd) {
  return DependencyTree.loadFrom(path.join(cwd, 'package.json'))
    .then(function (tree) {
      return archy({
        label: `total-size: ${tree.rootPackage.totalStats().totalBlockSize() / 1024}k`,
        nodes: toArchy(tree.prod)
      })
    })
}

function toArchy (pkgs) {
  const result = pkgs.map(pkg => {
    const blockSize = pkg.totalStats().totalBlockSize()
    const dependencyCount = pkg.totalDependencies()
    return {
      label: `${pkg.packageJson._id}, ${chalk.red(blockSize / 1024 + 'k')}, ${dependencyCount} deps`,
      size: blockSize,
      nodes: toArchy(pkg.dependencies)
    }
  })
  return sortby(result, (node) => {
    return -node.size
  })
}

module.exports = {analyze}
