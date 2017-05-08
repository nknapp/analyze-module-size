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
const {NullProgressHandler} = require('./progress')

/**
 *
 * @param cwd
 * @param options
 * @param {number} options.depth The number of levels to display in the tree-view
 * @param {ProgressHandler} options.progress
 */
function analyze (cwd, options = {}) {
  return DependencyTree.loadFrom(path.join(cwd, 'package.json'), options.progress || new NullProgressHandler())
    .then(function (tree) {
      return archy({
        label: `size: ${tree.rootPackage.stats.totalBlockSize() / 1024}k... with-dependencies: ${tree.rootPackage.totalStats().totalBlockSize() / 1024}k`,
        nodes: toArchy(tree.prod, options.depth)
      })
    })
}

/**
 *
 * @param pkgs
 * @param {number=} depth
 */
function toArchy (pkgs, depth) {
  if (depth <= 0) return []
  const result = pkgs.map(pkg => {
    const blockSize = pkg.totalStats().totalBlockSize()
    const dependencyCount = pkg.totalDependencies()
    return {
      label: `${pkg.packageJson._id}, ${chalk.red(blockSize / 1024 + 'k')}, ${dependencyCount} deps`,
      size: blockSize,
      nodes: toArchy(pkg.dependencies, depth && depth - 1)
    }
  })
  return sortby(result, (node) => {
    return -node.size
  })
}

module.exports = {analyze}
