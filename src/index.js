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
      let result = archy({
        label: `size: ${tree.rootPackage.stats.totalBlockSize() / 1024}k... with-dependencies: ${tree.rootPackage.totalStats().totalBlockSize() / 1024}k`,
        nodes: toArchy(tree.prod, options.depth, [])
      })
      if (tree.missing.length > 0) {
        result += '\n' + archy({
          label: `missing packages, that are referenced as dependent of an existing dependency`,
          nodes: toArchy(tree.missing, options.depth, [])
        })
      }
      return result
    })
}

/**
 * Create an archy-compatible object-structure of the dependency tree.
 *
 * @param pkgs
 * @param {number=} depth
 * @param {string[]} cycleChecker list of "_location"s on the current path down the dependency tree.
 */
function toArchy (pkgs, depth, cycleChecker) {
  if (depth <= 0) return []
  const result = pkgs.map(pkg => {
    if (cycleChecker.indexOf(pkg.packageJson._location) >= 0) {
      return {
        label: `${pkg.packageJson._id} (cycle detected)`,
        size: undefined,
        nodes: []
      }
    }
    cycleChecker.push(pkg.packageJson._location)
    try {
      const blockSize = pkg.totalStats().totalBlockSize()
      const dependencyCount = pkg.totalDependencies()
      return {
        label: `${pkg.packageJson._id}, ${chalk.red(blockSize / 1024 + 'k')}, ${dependencyCount} deps`,
        size: blockSize,
        nodes: toArchy(pkg.dependencies, depth && depth - 1, cycleChecker)
      }
    } finally {
      cycleChecker.pop()
    }
  })
  return sortby(result, (node) => {
    return -node.size
  })
}

module.exports = {analyze}
